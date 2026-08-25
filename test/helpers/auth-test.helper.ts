import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { Credentials, TestContext, TestRole } from './test-context';

/**
 * Ejecuta la operación read token.
 * @param body Valor de body requerido por la operacion.
 * @returns Resultado producido por la operación.
 * @throws {Error} Cuando los datos o el estado incumplen la regla de negocio validada.
 */
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

/**
 * Ejecuta la operación login as.
 * @param app Valor de app requerido por la operacion.
 * @param credentials Valor de credentials requerido por la operacion.
 * @returns Promesa que resuelve con el resultado de la operación.
 */
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

/**
 * Ejecuta la operación bearer.
 * @param token Token utilizado para autenticar o autorizar la operación.
 * @returns Resultado producido por la operación.
 */
export function bearer(token: string): { Authorization: string } {
  return { Authorization: `Bearer ${token}` };
}

/**
 * Ejecuta la operación token for.
 * @param app Valor de app requerido por la operacion.
 * @param context Contexto de ejecución proporcionado por NestJS.
 * @param role Valor de role requerido por la operacion.
 * @returns Promesa que resuelve con el resultado de la operación.
 */
export async function tokenFor(
  app: INestApplication,
  context: TestContext,
  role: TestRole,
): Promise<string> {
  context.tokens[role] ??= await loginAs(app, context.users[role]);
  return context.tokens[role];
}
