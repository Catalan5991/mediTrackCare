import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { PrismaService } from '../src/modules/prisma/prisma.service';
import { createTestApp } from './helpers/app-test.helper';
import { bearer, tokenFor } from './helpers/auth-test.helper';
import { cleanDatabase, seedTestUsers } from './helpers/database-test.helper';
import { expectError } from './helpers/response-test.helper';
import { TestContext } from './helpers/test-context';

describe('CRUD, roles y asignaciones de doctores (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let context: TestContext;

  beforeAll(async () => {
    app = await createTestApp();
    prisma = app.get(PrismaService);
    await cleanDatabase(prisma);
    context = await seedTestUsers(prisma);
  });

  afterAll(async () => {
    await cleanDatabase(prisma);
    await app.close();
  });

  it('valida CRUD, normalización, permisos y borrado lógico', async () => {
    const api = request(app.getHttpServer());
    const admin = bearer(await tokenFor(app, context, 'ADMIN'));
    const doctorToken = bearer(await tokenFor(app, context, 'DOCTOR'));
    const patientToken = bearer(await tokenFor(app, context, 'PATIENT'));
    const created = await api
      .post('/api/doctors')
      .set(admin)
      .send({
        userId: context.users.DOCTOR.id,
        fullName: '  Dra. Prueba E2E  ',
        professionalLicense: '  ced-e2e-001  ',
        specialty: 'Cardiología',
        email: '  DOCTOR.E2E@EXAMPLE.COM ',
      })
      .expect(201);
    const id = created.body.id as number;
    expect(created.body).toEqual(
      expect.objectContaining({
        fullName: 'Dra. Prueba E2E',
        professionalLicense: 'CED-E2E-001',
        email: 'doctor.e2e@example.com',
        isActive: true,
      }),
    );

    expectError(
      await api.post('/api/doctors').set(admin).send({
        userId: context.users.PATIENT.id,
        fullName: 'Usuario con rol incorrecto',
      }),
      400,
    );
    expectError(
      await api.post('/api/doctors').set(admin).send({
        userId: context.users.DOCTOR.id,
        fullName: 'Duplicado',
      }),
      409,
    );
    expectError(
      await api.post('/api/doctors').set(admin).send({
        userId: 999999,
        fullName: 'Usuario inexistente',
      }),
      400,
    );
    expectError(
      await api.post('/api/doctors').set(admin).send({
        userId: context.users.DOCTOR.id,
        fullName: 'Campo extra',
        unexpected: true,
      }),
      400,
    );
    expectError(
      await api.post('/api/doctors').set(patientToken).send({
        userId: context.users.DOCTOR.id,
        fullName: 'Sin permiso',
      }),
      403,
    );

    const list = await api
      .get('/api/doctors?search=ced-e2e&specialty=cardio&page=1&limit=5')
      .set(doctorToken)
      .expect(200);
    expect(list.body).toEqual(
      expect.objectContaining({
        data: expect.arrayContaining([expect.objectContaining({ id })]),
        page: 1,
        limit: 5,
      }),
    );
    expectError(await api.get('/api/doctors').set(patientToken), 403);
    expectError(await api.get('/api/doctors/not-a-number').set(admin), 400);
    expectError(await api.get('/api/doctors/999999').set(admin), 404);

    await api
      .patch(`/api/doctors/${id}`)
      .set(admin)
      .send({ specialty: 'Medicina interna' })
      .expect(200);
    const mine = await api.get('/api/doctors/me').set(doctorToken).expect(200);
    expect(mine.body.id).toBe(id);

    const patient = await prisma.patient.create({
      data: {
        userId: context.users.PATIENT.id,
        fullName: 'Paciente asignado E2E',
        birthDate: new Date('1990-01-01'),
      },
    });
    await api
      .post(`/api/doctors/${id}/patients/${patient.id}`)
      .set(admin)
      .expect(201);
    const assignments = await api
      .get('/api/doctors/me/patients')
      .set(doctorToken)
      .expect(200);
    expect(assignments.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ doctorId: id, patientId: patient.id }),
      ]),
    );
    await api
      .delete(`/api/doctors/${id}/patients/${patient.id}`)
      .set(admin)
      .expect(200);

    const deleted = await api
      .delete(`/api/doctors/${id}`)
      .set(admin)
      .expect(200);
    expect(deleted.body.isActive).toBe(false);
    expectError(await api.delete(`/api/doctors/${id}`).set(admin), 409);
    const defaultList = await api.get('/api/doctors').set(admin).expect(200);
    expect(defaultList.body.data).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ id })]),
    );
    const inactiveList = await api
      .get('/api/doctors?isActive=false')
      .set(admin)
      .expect(200);
    expect(inactiveList.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id, isActive: false }),
      ]),
    );
    await api
      .patch(`/api/doctors/${id}`)
      .set(admin)
      .send({ isActive: true })
      .expect(200);
  });
});
