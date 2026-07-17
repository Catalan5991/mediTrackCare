import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { PrismaService } from '../src/modules/prisma/prisma.service';
import { createTestApp } from './helpers/app-test.helper';
import { bearer } from './helpers/auth-test.helper';
import { cleanDatabase } from './helpers/database-test.helper';
import { validRegistration } from './fixtures/users.fixture';
import { expectError } from './helpers/response-test.helper';

describe('Autenticación (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    app = await createTestApp();
    prisma = app.get(PrismaService);
    await cleanDatabase(prisma);
  });
  afterAll(async () => {
    await cleanDatabase(prisma);
    await app.close();
  });

  it('registra un usuario, inicia sesión y consulta su perfil', async () => {
    const dto = validRegistration();
    const registered = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(dto)
      .expect(201);
    expect(registered.body).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
        user: expect.objectContaining({ email: dto.email, role: 'PATIENT' }),
      }),
    );
    const login = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: dto.email, password: dto.password })
      .expect(201);
    const profile = await request(app.getHttpServer())
      .get('/api/auth/profile')
      .set(bearer(login.body.accessToken as string))
      .expect(200);
    expect(profile.body).toEqual(expect.objectContaining({ email: dto.email }));
  });

  it('rechaza campos obligatorios ausentes y propiedades no permitidas', async () => {
    expectError(
      await request(app.getHttpServer()).post('/api/auth/register').send({}),
      400,
    );
    expectError(
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'nobody@e2e.invalid', password: '123456', admin: true }),
      400,
    );
  });

  it('rechaza usuarios duplicados y credenciales incorrectas', async () => {
    const dto = validRegistration();
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(dto)
      .expect(201);
    expectError(
      await request(app.getHttpServer()).post('/api/auth/register').send(dto),
      409,
    );
    expectError(
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: dto.email, password: 'WrongPassword' }),
      401,
    );
  });
});
