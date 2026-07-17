import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { createTestApp } from './helpers/app-test.helper';
import { expectError } from './helpers/response-test.helper';

type Method = 'get' | 'post' | 'patch' | 'delete';
const protectedEndpoints: ReadonlyArray<[Method, string]> = [
  ['get', '/auth/profile'],
  ...[
    'roles',
    'users',
    'patients',
    'doctors',
    'caregivers',
    'medications',
    'prescriptions',
    'reminders',
    'intakes',
    'medical-measurements',
    'files',
  ].flatMap(
    (resource): Array<[Method, string]> => [
      ['post', `/${resource}`],
      ['get', `/${resource}`],
      ['get', `/${resource}/1`],
      ['patch', `/${resource}/1`],
      ['delete', `/${resource}/1`],
    ],
  ),
  ['patch', '/prescriptions/1/cancel'],
  ['get', '/doctors/me'],
  ['get', '/doctors/me/patients'],
  ['get', '/doctors/1/patients'],
  ['post', '/doctors/1/patients/1'],
  ['delete', '/doctors/1/patients/1'],
  ['post', '/audit-logs'],
  ['get', '/audit-logs'],
  ['get', '/audit-logs/1'],
  ['post', '/notifications'],
  ['get', '/notifications'],
  ['get', '/notifications/1'],
  ['patch', '/notifications/1'],
  ['patch', '/notifications/1/read'],
  ['patch', '/notifications/1/sent'],
  ['delete', '/notifications/1'],
  ['get', '/dashboard/admin'],
  ['get', '/dashboard/patient/me'],
];

describe('Contrato JWT para todos los endpoints protegidos (e2e)', () => {
  let app: INestApplication;
  beforeAll(async () => {
    app = await createTestApp();
  });
  afterAll(async () => {
    await app.close();
  });

  it.each(protectedEndpoints)(
    '%s /api%s devuelve 401 cuando no se proporciona JWT',
    async (method, path) => {
      const response = await request(app.getHttpServer())
        [method](`/api${path}`)
        .send({});
      expectError(response, 401);
    },
  );

  it.each(protectedEndpoints)(
    '%s /api%s devuelve 401 cuando el JWT es inválido',
    async (method, path) => {
      const response = await request(app.getHttpServer())
        [method](`/api${path}`)
        .set('Authorization', 'Bearer invalid.jwt.token')
        .send({});
      expectError(response, 401);
    },
  );
});
