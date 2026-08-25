import { Response } from 'supertest';

/**
 * Ejecuta la operación expect error.
 * @param response Respuesta HTTP utilizada para devolver el resultado.
 * @param statusCode Valor de status code requerido por la operacion.
 * @returns No retorna ningún valor.
 */
export function expectError(response: Response, statusCode: number): void {
  expect(response.status).toBe(statusCode);
  expect(response.body.statusCode).toBe(statusCode);
  const nestedError =
    response.body.error && typeof response.body.error === 'object'
      ? response.body.error
      : undefined;
  expect(response.body.message ?? nestedError?.message).toBeDefined();
  if (response.body.timestamp !== undefined) {
    expect(response.body.timestamp).toEqual(expect.any(String));
  }
  if (response.body.path !== undefined) {
    expect(response.body.path).toEqual(expect.any(String));
  }
}
