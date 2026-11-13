import * as bcrypt from 'bcrypt';

import { PrismaService } from '../../src/modules/prisma/prisma.service';
import { TestContext, TestRole } from './test-context';

const roles: TestRole[] = ['ADMIN', 'DOCTOR', 'CAREGIVER', 'PATIENT'];
const password = 'E2ePassword123!';

/**
 * Ejecuta la operación clean database.
 * @param prisma Servicio que coordina las operaciones de prisma.
 * @returns No retorna ningún valor.
 */
export async function cleanDatabase(prisma: PrismaService): Promise<void> {
  await prisma.$transaction([
    prisma.doctorPatient.deleteMany(),
    prisma.auditLog.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.medicalMeasurement.deleteMany(),
    prisma.intake.deleteMany(),
    prisma.reminder.deleteMany(),
    prisma.file.deleteMany(),
    prisma.prescriptionItem.deleteMany(),
    prisma.prescription.deleteMany(),
    prisma.caregiver.deleteMany(),
    prisma.doctor.deleteMany(),
    prisma.patient.deleteMany(),
    prisma.medication.deleteMany(),
    prisma.user.deleteMany(),
    prisma.role.deleteMany(),
  ]);
}

/**
 * Ejecuta la operación seed test users.
 * @param prisma Servicio que coordina las operaciones de prisma.
 * @returns Promesa que resuelve con el resultado de la operación.
 */
export async function seedTestUsers(
  prisma: PrismaService,
): Promise<TestContext> {
  const hash = await bcrypt.hash(password, 4);
  const users = {} as TestContext['users'];
  for (const role of roles) {
    const roleRow = await prisma.role.create({ data: { name: role } });
    const email = `${role.toLowerCase()}@e2e.invalid`;
    const user = await prisma.user.create({
      data: { roleId: roleRow.id, name: `E2E ${role}`, email, password: hash },
    });
    users[role] = { id: user.id, email, password, role };
  }
  return { users, tokens: {} };
}
