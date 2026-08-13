import request from 'supertest';
import { bearer } from '../helpers/auth-test.helper';
import {
  cerrarContextoModulosE2E,
  ContextoModulosE2E,
  iniciarContextoModulosE2E,
} from '../helpers/assigned-modules-e2e.helper';

// Comprueba el listado autenticado y la protección del endpoint sin JWT.
describe('Usuarios - Listar', () => {
  let c: ContextoModulosE2E;

  beforeAll(async () => {
    c = await iniciarContextoModulosE2E();
  });

  afterAll(async () => cerrarContextoModulosE2E(c));

  it('lista usuarios para un administrador', async () => {
    const r = await request(c.servidor)
      .get('/api/users')
      .set(bearer(c.tokens.ADMIN))
      .expect(200);
    expect(Array.isArray(r.body)).toBe(true);
    expect(r.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: c.usuarios.ADMIN.id }),
      ]),
    );
  });

  it('rechaza la consulta sin JWT', async () => {
    await request(c.servidor).get('/api/users').expect(401);
  });
});
