import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { PrismaService } from '../src/modules/prisma/prisma.service';
import { createTestApp } from './helpers/app-test.helper';
import { bearer, tokenFor } from './helpers/auth-test.helper';
import { cleanDatabase, seedTestUsers } from './helpers/database-test.helper';
import { expectError } from './helpers/response-test.helper';
import { TestContext } from './helpers/test-context';

describe('CRUD de roles, permisos y medicamentos (e2e)', () => {
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

  it('permite a ADMIN y rechaza a PATIENT en la administración de roles', async () => {
    const admin = await tokenFor(app, context, 'ADMIN');
    const patient = await tokenFor(app, context, 'PATIENT');
    const created = await request(app.getHttpServer())
      .post('/api/roles')
      .set(bearer(admin))
      .send({ name: 'E2E_ROLE', description: 'Temporal' })
      .expect(201);
    expect(created.body).toEqual(
      expect.objectContaining({ id: expect.any(Number), name: 'E2E_ROLE' }),
    );
    const list = await request(app.getHttpServer())
      .get('/api/roles?search=E2E&page=1&limit=5&isActive=true')
      .set(bearer(admin))
      .expect(200);
    expect(list.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: created.body.id }),
      ]),
    );
    await request(app.getHttpServer())
      .get(`/api/roles/${created.body.id as number}`)
      .set(bearer(admin))
      .expect(200);
    const updated = await request(app.getHttpServer())
      .patch(`/api/roles/${created.body.id as number}`)
      .set(bearer(admin))
      .send({ description: 'Descripción actualizada E2E' })
      .expect(200);
    expect(updated.body.description).toBe('Descripción actualizada E2E');
    expectError(
      await request(app.getHttpServer())
        .post('/api/roles')
        .set(bearer(admin))
        .send({ name: 'E2E_ROLE' }),
      409,
    );
    expectError(
      await request(app.getHttpServer())
        .get('/api/roles?page=0&limit=no-numerico')
        .set(bearer(admin)),
      400,
    );
    expectError(
      await request(app.getHttpServer())
        .post('/api/roles')
        .set(bearer(patient))
        .send({ name: 'DENIED' }),
      403,
    );
    await request(app.getHttpServer())
      .delete(`/api/roles/${created.body.id as number}`)
      .set(bearer(admin))
      .expect(200);
    const inactive = await request(app.getHttpServer())
      .get(`/api/roles/${created.body.id as number}`)
      .set(bearer(admin))
      .expect(200);
    expect(inactive.body.isActive).toBe(false);
  });

  it('ejecuta el CRUD de medicamentos y valida DTO, IDs, duplicados y roles', async () => {
    const admin = await tokenFor(app, context, 'ADMIN');
    const doctor = await tokenFor(app, context, 'DOCTOR');
    const patient = await tokenFor(app, context, 'PATIENT');
    const dto = {
      name: 'E2E Metformina',
      presentation: 'TABLETA',
      route: 'ORAL',
    };
    const created = await request(app.getHttpServer())
      .post('/api/medications')
      .set(bearer(admin))
      .send(dto)
      .expect(201);
    const id = created.body.id as number;
    expect(created.body).toEqual(expect.objectContaining(dto));
    await request(app.getHttpServer())
      .get('/api/medications')
      .set(bearer(doctor))
      .expect(200);
    await request(app.getHttpServer())
      .get(`/api/medications/${id}`)
      .set(bearer(doctor))
      .expect(200);
    expectError(
      await request(app.getHttpServer())
        .get('/api/medications')
        .set(bearer(patient)),
      403,
    );
    expectError(
      await request(app.getHttpServer())
        .post('/api/medications')
        .set(bearer(admin))
        .send({ ...dto, presentation: 'INVALID' }),
      400,
    );
    expectError(
      await request(app.getHttpServer())
        .post('/api/medications')
        .set(bearer(admin))
        .send({ ...dto, unexpected: true }),
      400,
    );
    expectError(
      await request(app.getHttpServer())
        .get('/api/medications/not-a-number')
        .set(bearer(admin)),
      400,
    );
    await request(app.getHttpServer())
      .patch(`/api/medications/${id}`)
      .set(bearer(admin))
      .send({ description: 'Actualizado' })
      .expect(200);
    await request(app.getHttpServer())
      .delete(`/api/medications/${id}`)
      .set(bearer(admin))
      .expect(200);
    const inactive = await request(app.getHttpServer())
      .get(`/api/medications/${id}`)
      .set(bearer(admin))
      .expect(200);
    expect(inactive.body.isActive).toBe(false);
  });
});
