import request from 'supertest';
import { bearer } from '../helpers/auth-test.helper';
import {
  cerrarContextoModulosE2E,
  ContextoModulosE2E,
  iniciarContextoModulosE2E,
} from '../helpers/assigned-modules-e2e.helper';

// Consulta un usuario real, evita exponer su contraseña y valida IDs incorrectos.
describe('Usuarios - Consultar por ID', () => {
  let c: ContextoModulosE2E;

  beforeAll(async () => {
    c = await iniciarContextoModulosE2E();
  });

  afterAll(async () => cerrarContextoModulosE2E(c));

  it('obtiene el usuario solicitado sin exponer la contraseña', async () => {
    const r = await request(c.servidor)
      .get(`/api/users/${c.usuarios.PATIENT.id}`)
      .set(bearer(c.tokens.ADMIN))
      .expect(200);
    expect(r.body.email).toBe(c.usuarios.PATIENT.email);
    expect(r.body).not.toHaveProperty('password');
  });

  it('rechaza un ID no numérico', async () => {
    await request(c.servidor)
      .get('/api/users/no-numerico')
      .set(bearer(c.tokens.ADMIN))
      .expect(400);
  });
});
