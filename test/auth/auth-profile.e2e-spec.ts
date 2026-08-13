import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import type { Server } from 'node:http';

import { AppModule } from '../../src/app.module';
import { configureApp } from '../../src/configure-app';

interface LoginResponseBody {
  accessToken: string;
  user: {
    email: string;
  };
}

interface ProfileResponseBody {
  email: string;
}

describe('Autenticación - Inicio de sesión y perfil', () => {
  let app: INestApplication;
  let accessToken: string;
  let testEmail: string;
  let testPassword: string;

  const getHttpServer = (): Server => app.getHttpServer() as Server;

  beforeAll(async () => {
    testEmail = process.env.E2E_USER_EMAIL ?? '';
    testPassword = process.env.E2E_USER_PASSWORD ?? '';

    if (!testEmail || !testPassword) {
      throw new Error(
        'E2E_USER_EMAIL y E2E_USER_PASSWORD son obligatorias para esta prueba',
      );
    }

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('autenticar un usuario con credenciales válidas', async () => {
    const response = await request(getHttpServer())
      .post('/api/auth/login')
      .send({ email: testEmail, password: testPassword })
      .expect(201);
    const body = response.body as LoginResponseBody;

    expect(response.status).toBe(201);
    expect(body.user).toBeDefined();
    expect(body.user.email).toBe(testEmail);
    expect(body.accessToken).toBeDefined();
    expect(body.accessToken).toEqual(expect.any(String));

    accessToken = body.accessToken;
    process.env.TEST_ACCESS_TOKEN = accessToken;
  });

  it('responder 401 al acceder al perfil sin JWT', async () => {
    const response = await request(getHttpServer())
      .get('/api/auth/profile')
      .expect(401);

    expect(response.status).toBe(401);
  });

  it('obtener el perfil autenticado utilizando el JWT', async () => {
    expect(accessToken).toBeDefined();
    expect(process.env.TEST_ACCESS_TOKEN).toBe(accessToken);

    const response = await request(getHttpServer())
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${process.env.TEST_ACCESS_TOKEN}`)
      .expect(200);
    const body = response.body as ProfileResponseBody;

    expect(response.status).toBe(200);
    expect(body.email).toBeDefined();
    expect(body.email).toBe(testEmail);
  });
});
