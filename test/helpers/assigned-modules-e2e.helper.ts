import { INestApplication } from '@nestjs/common';
import type { Server } from 'node:http';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../../src/modules/prisma/prisma.service';
import { createTestApp } from './app-test.helper';
import { loginAs } from './auth-test.helper';

type RolPrueba = 'ADMIN' | 'DOCTOR' | 'PATIENT';

export interface ContextoModulosE2E {
  app: INestApplication;
  prisma: PrismaService;
  servidor: Server;
  sufijo: string;
  usuarios: Record<RolPrueba, { id: number; email: string; password: string }>;
  tokens: Record<RolPrueba, string>;
  ids: {
    usuarios: number[];
    pacientes: number[];
    roles: number[];
    medicamentos: number[];
    mediciones: number[];
  };
}

/** Crea datos técnicos únicos sin depender de credenciales personales. */
export async function iniciarContextoModulosE2E(): Promise<ContextoModulosE2E> {
  const app = await createTestApp();
  const prisma = app.get(PrismaService);
  const sufijo = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const password = 'E2ePassword123!';
  const hash = await bcrypt.hash(password, 4);
  const usuarios = {} as ContextoModulosE2E['usuarios'];
  const ids: ContextoModulosE2E['ids'] = {
    usuarios: [],
    pacientes: [],
    roles: [],
    medicamentos: [],
    mediciones: [],
  };

  for (const rol of ['ADMIN', 'DOCTOR', 'PATIENT'] as RolPrueba[]) {
    const role = await prisma.role.upsert({
      where: { name: rol },
      update: {},
      create: { name: rol },
    });
    const email = `e2e-${rol.toLowerCase()}-${sufijo}@test.local`;
    const user = await prisma.user.create({
      data: {
        roleId: role.id,
        name: `Usuario E2E ${rol}`,
        email,
        password: hash,
      },
    });
    ids.usuarios.push(user.id);
    usuarios[rol] = { id: user.id, email, password };
  }

  const tokens = {
    ADMIN: await loginAs(app, usuarios.ADMIN),
    DOCTOR: await loginAs(app, usuarios.DOCTOR),
    PATIENT: await loginAs(app, usuarios.PATIENT),
  };

  return {
    app,
    prisma,
    servidor: app.getHttpServer() as Server,
    sufijo,
    usuarios,
    tokens,
    ids,
  };
}

/** Registra un usuario adicional y conserva su ID para la limpieza selectiva. */
export async function crearUsuarioE2E(
  contexto: ContextoModulosE2E,
  rol: RolPrueba = 'PATIENT',
) {
  const role = await contexto.prisma.role.findUniqueOrThrow({
    where: { name: rol },
  });
  const password = 'E2ePassword123!';
  const user = await contexto.prisma.user.create({
    data: {
      roleId: role.id,
      name: 'Usuario auxiliar E2E',
      email: `e2e-aux-${contexto.sufijo}-${contexto.ids.usuarios.length}@test.local`,
      password: await bcrypt.hash(password, 4),
    },
  });
  contexto.ids.usuarios.push(user.id);
  return user;
}

/** Prepara la relación Patient/User requerida por mediciones y consultas. */
export async function crearPacienteE2E(contexto: ContextoModulosE2E) {
  const user = await crearUsuarioE2E(contexto);
  const patient = await contexto.prisma.patient.create({
    data: {
      userId: user.id,
      fullName: 'Paciente auxiliar E2E',
      birthDate: new Date('1990-01-01'),
    },
  });
  contexto.ids.pacientes.push(patient.id);
  return patient;
}

/** Elimina solo registros cuyos IDs fueron creados por la suite actual. */
export async function cerrarContextoModulosE2E(contexto?: ContextoModulosE2E) {
  if (!contexto) return;
  const { prisma, ids } = contexto;
  if (ids.mediciones.length)
    await prisma.medicalMeasurement.deleteMany({
      where: { id: { in: ids.mediciones } },
    });
  if (ids.pacientes.length)
    await prisma.patient.deleteMany({ where: { id: { in: ids.pacientes } } });
  if (ids.medicamentos.length)
    await prisma.medication.deleteMany({
      where: { id: { in: ids.medicamentos } },
    });
  if (ids.usuarios.length)
    await prisma.user.deleteMany({ where: { id: { in: ids.usuarios } } });
  if (ids.roles.length)
    await prisma.role.deleteMany({ where: { id: { in: ids.roles } } });
  await contexto.app.close();
}
