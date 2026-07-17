import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { Credentials, TestContext, TestRole } from './test-context';

function readToken(body: unknown): string {
  if (!body || typeof body !== 'object')
    throw new Error('El inicio de sesión no devolvió un objeto JSON');
  const value = body as Record<string, unknown>;
  const token = value.accessToken ?? value.access_token ?? value.token;
  if (typeof token !== 'string')
    throw new Error(
      'La respuesta del inicio de sesión no contiene un campo de token compatible',
    );
  return token;
}

export async function loginAs(
  app: INestApplication,
  credentials: Credentials,
): Promise<string> {
  const response = await request(app.getHttpServer())
    .post('/api/auth/login')
    .send({ email: credentials.email, password: credentials.password })
    .expect(201);
  return readToken(response.body);
}

export function bearer(token: string): { Authorization: string } {
  return { Authorization: `Bearer ${token}` };
}

export async function tokenFor(
  app: INestApplication,
  context: TestContext,
  role: TestRole,
): Promise<string> {
  context.tokens[role] ??= await loginAs(app, context.users[role]);
  return context.tokens[role];
}
