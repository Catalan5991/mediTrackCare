import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error('DATABASE_URL es obligatoria.');

const prisma = new PrismaClient({ adapter: new PrismaPg(databaseUrl) });

async function main() {
  const expectedRoles = ['ADMIN', 'DOCTOR', 'CAREGIVER', 'PATIENT'];
  const [roles, demoUsers, patient] = await Promise.all([
    prisma.role.findMany({ where: { name: { in: expectedRoles }, isActive: true } }),
    prisma.user.count({ where: { email: { endsWith: '.demo@meditrackcare.local' }, isActive: true } }),
    prisma.patient.findFirst({
      where: { user: { email: 'paciente.demo@meditrackcare.local' } },
      include: {
        caregivers: true,
        doctorAssignments: true,
        prescriptions: { include: { items: { include: { reminders: true, intakes: true } } } },
        medicalMeasurements: true,
        notifications: true,
        files: true,
      },
    }),
  ]);

  const checks = {
    roles: roles.length === expectedRoles.length,
    demoUsers: demoUsers === 3,
    patientProfile: Boolean(patient),
    caregiverRelation: (patient?.caregivers.length ?? 0) >= 1,
    doctorRelation: (patient?.doctorAssignments.length ?? 0) >= 1,
    prescription: (patient?.prescriptions.length ?? 0) >= 1,
    reminderAndIntake: Boolean(
      patient?.prescriptions.some((rx) =>
        rx.items.some((item) => item.reminders.length >= 1 && item.intakes.length >= 1),
      ),
    ),
    measurement: (patient?.medicalMeasurements.length ?? 0) >= 1,
    notification: (patient?.notifications.length ?? 0) >= 1,
    file: (patient?.files.length ?? 0) >= 1,
  };

  console.table(checks);
  if (Object.values(checks).some((value) => !value)) {
    throw new Error('La carga inicial no cumple todas las relaciones esperadas.');
  }
}

main()
  .finally(async () => prisma.$disconnect());
