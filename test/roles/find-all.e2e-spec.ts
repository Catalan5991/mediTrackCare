import request from 'supertest';
import { bearer } from '../helpers/auth-test.helper';
import {
  cerrarContextoModulosE2E,
  ContextoModulosE2E,
  iniciarContextoModulosE2E,
} from '../helpers/assigned-modules-e2e.helper';

// Valida la estructura paginada real y el rechazo de parámetros inválidos.
describe('Roles - Listar (E2E)', () => {
  let c: ContextoModulosE2E;

  beforeAll(async () => {
    c = await iniciarContextoModulosE2E();
  });

  afterAll(async () => cerrarContextoModulosE2E(c));

  it('lista roles con paginación', async () => {
    const r = await request(c.servidor)
      .get('/api/roles?page=1&limit=10')
      .set(bearer(c.tokens.ADMIN))
      .expect(200);

    expect(Array.isArray(r.body.data)).toBe(true);

    expect(r.body).toEqual(
      expect.objectContaining({
        total: expect.any(Number),
        page: 1,
        limit: 10,
        lastPage: expect.any(Number),
      }),
    );
  });

  it('rechaza paginación inválida', async () => {
    await request(c.servidor)
      .get('/api/roles?page=0&limit=no-numerico')
      .set(bearer(c.tokens.ADMIN))
      .expect(400);
  });
});
