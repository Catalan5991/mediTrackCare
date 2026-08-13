import request from 'supertest';
import { bearer } from '../helpers/auth-test.helper';
import {
  cerrarContextoModulosE2E,
  ContextoModulosE2E,
  iniciarContextoModulosE2E,
} from '../helpers/assigned-modules-e2e.helper';

// Actualiza un usuario técnico y verifica el rechazo de campos inválidos.
describe('Usuarios - Actualizar (E2E)', () => {
  let c: ContextoModulosE2E;

  beforeAll(async () => {
    c = await iniciarContextoModulosE2E();
  });

  afterAll(async () => cerrarContextoModulosE2E(c));

  it('actualiza un usuario existente', async () => {
    const r = await request(c.servidor)
      .patch(`/api/users/${c.usuarios.PATIENT.id}`)
      .set(bearer(c.tokens.ADMIN))
      .send({ name: 'Usuario actualizado E2E' })
      .expect(200);
    expect(r.body.name).toBe('Usuario actualizado E2E');
  });

  it('rechaza datos inválidos', async () => {
    await request(c.servidor)
      .patch(`/api/users/${c.usuarios.PATIENT.id}`)
      .set(bearer(c.tokens.ADMIN))
      .send({ email: 'invalido' })
      .expect(400);
  });
});
