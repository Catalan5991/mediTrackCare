import request from 'supertest';
import { bearer } from '../helpers/auth-test.helper';
import {
  cerrarContextoModulosE2E,
  ContextoModulosE2E,
  crearUsuarioE2E,
  iniciarContextoModulosE2E,
} from '../helpers/assigned-modules-e2e.helper';

// Valida la desactivación lógica y exige autenticación JWT para eliminar.
describe('Usuarios - Eliminar', () => {
  let c: ContextoModulosE2E;

  beforeAll(async () => {
    c = await iniciarContextoModulosE2E();
  });

  afterAll(async () => cerrarContextoModulosE2E(c));

  it('desactiva un usuario existente', async () => {
    const u = await crearUsuarioE2E(c);
    const r = await request(c.servidor)
      .delete(`/api/users/${u.id}`)
      .set(bearer(c.tokens.ADMIN))
      .expect(200);
    expect(r.body.isActive).toBe(false);
  });

  it('rechaza la eliminación sin JWT', async () => {
    await request(c.servidor)
      .delete(`/api/users/${c.usuarios.PATIENT.id}`)
      .expect(401);
  });
});
