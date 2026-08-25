import 'dotenv/config';
import bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error('DATABASE_URL es obligatoria para ejecutar la semilla.');

const prisma = new PrismaClient({ adapter: new PrismaPg(databaseUrl) });
const isProduction = process.env.NODE_ENV === 'production';
const demoEnabled = (process.env.SEED_DEMO_DATA ?? String(!isProduction)).toLowerCase() === 'true';
const demoPassword = process.env.DEMO_PASSWORD ?? 'MediTrackDemo2026!';

async function seedRoles() {
  const definitions = [
    ['ADMIN', 'Administración completa de la plataforma'],
    ['DOCTOR', 'Seguimiento clínico de pacientes asignados'],
    ['CAREGIVER', 'Apoyo al paciente y seguimiento de tomas'],
    ['PATIENT', 'Consulta y registro de su tratamiento'],
  ] as const;

  for (const [name, description] of definitions) {
    await prisma.role.upsert({
      where: { name },
      update: { description, isActive: true },
      create: { name, description },
    });
  }

  // Los nombres fuera del enum no tienen una entrada en la matriz de permisos.
  // Se conservan para no romper relaciones históricas, pero no deben autenticar.
  await prisma.role.updateMany({
    where: { name: { notIn: definitions.map(([name]) => name) } },
    data: { isActive: false },
  });

  return Object.fromEntries(
    await Promise.all(
      definitions.map(async ([name]) => [name, await prisma.role.findUniqueOrThrow({ where: { name } })]),
    ),
  ) as Record<(typeof definitions)[number][0], { id: number }>;
}

async function upsertUser(email: string, name: string, roleId: number, passwordHash: string) {
  return prisma.user.upsert({
    where: { email },
    update: { name, roleId, password: passwordHash, isActive: true },
    create: { email, name, roleId, password: passwordHash },
  });
}

async function seedAdmin(roles: Awaited<ReturnType<typeof seedRoles>>) {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase() ?? (!isProduction ? 'admin@meditrackcare.local' : undefined);
  const password = process.env.ADMIN_PASSWORD ?? (!isProduction ? demoPassword : undefined);
  if (!email || !password) {
    throw new Error('ADMIN_EMAIL y ADMIN_PASSWORD son obligatorias en producción para crear el administrador inicial.');
  }
  if (password.length < 12) throw new Error('ADMIN_PASSWORD debe contener al menos 12 caracteres.');
  return upsertUser(
    email,
    process.env.ADMIN_NAME ?? 'Administrador MediTrackCare',
    roles.ADMIN.id,
    await bcrypt.hash(password, 12),
  );
}

async function seedDemoData(roles: Awaited<ReturnType<typeof seedRoles>>, adminId: number) {
  if (demoPassword.length < 12) throw new Error('DEMO_PASSWORD debe contener al menos 12 caracteres.');
  const passwordHash = await bcrypt.hash(demoPassword, 12);

  const doctorUser = await upsertUser('doctor.demo@meditrackcare.local', 'Dra. Elena Ramírez', roles.DOCTOR.id, passwordHash);
  const caregiverUser = await upsertUser('cuidador.demo@meditrackcare.local', 'Carlos Hernández', roles.CAREGIVER.id, passwordHash);
  const patientUser = await upsertUser('paciente.demo@meditrackcare.local', 'Ana Martínez', roles.PATIENT.id, passwordHash);

  const patient = await prisma.patient.upsert({
    where: { userId: patientUser.id },
    update: { fullName: patientUser.name, isActive: true },
    create: {
      userId: patientUser.id,
      fullName: patientUser.name,
      birthDate: new Date('1964-05-14T00:00:00.000Z'),
      gender: 'FEMENINO',
      phone: '2220000001',
      address: 'Domicilio de demostración, Izúcar de Matamoros, Puebla',
      emergencyContactName: caregiverUser.name,
      emergencyContactPhone: '2220000002',
    },
  });

  const doctor = await prisma.doctor.upsert({
    where: { userId: doctorUser.id },
    update: { fullName: doctorUser.name, isActive: true },
    create: {
      userId: doctorUser.id,
      fullName: doctorUser.name,
      professionalLicense: 'DEMO-MED-2026',
      specialty: 'Medicina familiar',
      phone: '2220000003',
      email: doctorUser.email,
    },
  });

  await prisma.caregiver.upsert({
    where: { userId_patientId: { userId: caregiverUser.id, patientId: patient.id } },
    update: { relationship: 'Hijo', isPrimary: true, isActive: true },
    create: { userId: caregiverUser.id, patientId: patient.id, relationship: 'Hijo', isPrimary: true },
  });
  await prisma.doctorPatient.upsert({
    where: { doctorId_patientId: { doctorId: doctor.id, patientId: patient.id } },
    update: { isActive: true },
    create: { doctorId: doctor.id, patientId: patient.id },
  });

  let medication = await prisma.medication.findFirst({ where: { name: 'Losartán (demostración)' } });
  medication ??= await prisma.medication.create({
    data: {
      name: 'Losartán (demostración)',
      description: 'Medicamento de ejemplo; no representa una indicación médica real.',
      presentation: 'TABLETA',
      concentration: '50 mg',
      unit: 'tableta',
      route: 'ORAL',
    },
  });

  const startDate = new Date('2026-08-01T00:00:00.000Z');
  let prescription = await prisma.prescription.findFirst({
    where: { patientId: patient.id, doctorId: doctor.id, diagnosis: 'Hipertensión controlada (demostración)', startDate },
  });
  prescription ??= await prisma.prescription.create({
    data: {
      patientId: patient.id,
      doctorId: doctor.id,
      diagnosis: 'Hipertensión controlada (demostración)',
      notes: 'Registro exclusivamente demostrativo.',
      startDate,
      status: 'ACTIVO',
    },
  });

  let item = await prisma.prescriptionItem.findFirst({
    where: { prescriptionId: prescription.id, medicationId: medication.id, dose: '1 tableta' },
  });
  item ??= await prisma.prescriptionItem.create({
    data: {
      prescriptionId: prescription.id,
      medicationId: medication.id,
      dose: '1 tableta',
      frequency: 'Cada 24 horas',
      instructions: 'Tomar a la misma hora; dato de demostración.',
      startDate,
    },
  });

  let reminder = await prisma.reminder.findFirst({
    where: { patientId: patient.id, prescriptionItemId: item.id, scheduledTime: '08:00' },
  });
  reminder ??= await prisma.reminder.create({
    data: {
      patientId: patient.id,
      prescriptionItemId: item.id,
      scheduledTime: '08:00',
      daysOfWeek: 'LUN,MAR,MIE,JUE,VIE,SAB,DOM',
    },
  });

  const scheduledAt = new Date('2026-08-24T14:00:00.000Z');
  let intake = await prisma.intake.findFirst({ where: { patientId: patient.id, reminderId: reminder.id, scheduledAt } });
  intake ??= await prisma.intake.create({
    data: {
      patientId: patient.id,
      prescriptionItemId: item.id,
      reminderId: reminder.id,
      confirmedByUserId: caregiverUser.id,
      scheduledAt,
      takenAt: new Date('2026-08-24T14:05:00.000Z'),
      status: 'TOMADA',
      notes: 'Toma de ejemplo confirmada por el cuidador.',
    },
  });

  const measuredAt = new Date('2026-08-24T13:50:00.000Z');
  const measurement = await prisma.medicalMeasurement.findFirst({
    where: { patientId: patient.id, measurementType: 'PRESION_ARTERIAL', measuredAt },
  });
  if (!measurement) {
    await prisma.medicalMeasurement.create({
      data: {
        patientId: patient.id,
        registeredByUserId: caregiverUser.id,
        measurementType: 'PRESION_ARTERIAL',
        value: 120,
        secondValue: 80,
        unit: 'mmHg',
        notes: 'Medición de demostración.',
        measuredAt,
      },
    });
  }

  const notification = await prisma.notification.findFirst({
    where: { userId: patientUser.id, intakeId: intake.id, title: 'Toma registrada (demostración)' },
  });
  if (!notification) {
    await prisma.notification.create({
      data: {
        userId: patientUser.id,
        patientId: patient.id,
        intakeId: intake.id,
        title: 'Toma registrada (demostración)',
        message: 'La toma programada fue confirmada.',
        type: 'TOMA_CONFIRMADA',
        status: 'LEIDA',
        sentAt: new Date('2026-08-24T14:06:00.000Z'),
        readAt: new Date('2026-08-24T14:10:00.000Z'),
      },
    });
  }

  const file = await prisma.file.findFirst({ where: { patientId: patient.id, fileName: 'evidencia-demo.pdf' } });
  if (!file) {
    await prisma.file.create({
      data: {
        patientId: patient.id,
        prescriptionId: prescription.id,
        fileName: 'evidencia-demo.pdf',
        fileUrl: 'https://example.invalid/meditrackcare/evidencia-demo.pdf',
        fileType: 'application/pdf',
        description: 'Metadatos de archivo para demostración; la URL no contiene datos reales.',
      },
    });
  }

  const audit = await prisma.auditLog.findFirst({
    where: { userId: adminId, module: 'SEED', action: 'CREATE_DEMO_DATA', entityName: 'Database' },
  });
  if (!audit) {
    await prisma.auditLog.create({
      data: {
        userId: adminId,
        module: 'SEED',
        action: 'CREATE_DEMO_DATA',
        entityName: 'Database',
        description: 'Carga inicial de registros de demostración.',
      },
    });
  }

  console.log('Usuarios demo: doctor.demo, cuidador.demo y paciente.demo @meditrackcare.local');
}

async function main() {
  const roles = await seedRoles();
  const admin = await seedAdmin(roles);
  if (demoEnabled) await seedDemoData(roles, admin.id);
  console.log(`Semilla completada. Datos demo: ${demoEnabled ? 'habilitados' : 'deshabilitados'}.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
