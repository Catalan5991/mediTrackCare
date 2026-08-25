import request from 'supertest';
import { bearer } from '../helpers/auth-test.helper';
import {
  cerrarContextoModulosE2E,
  ContextoModulosE2E,
  crearPacienteE2E,
  iniciarContextoModulosE2E,
} from '../helpers/assigned-modules-e2e.helper';

// Valida desactivación administrativa y denegación para un rol insuficiente.
describe('Pacientes - Eliminar', () => {
  let c: ContextoModulosE2E;
  let id: number;

  beforeAll(async () => {
    c = await iniciarContextoModulosE2E();
    id = (await crearPacienteE2E(c)).id;
  });

  afterAll(async () => cerrarContextoModulosE2E(c));

  it('desactiva un paciente existente', async () => {
    const r = await request(c.servidor)
      .delete(`/api/patients/${id}`)
      .set(bearer(c.tokens.ADMIN))
      .expect(200);
    expect(r.body.isActive).toBe(false);
  });

  it('rechaza a un doctor sin rol administrativo', async () => {
    await request(c.servidor)
      .delete(`/api/patients/${id}`)
      .set(bearer(c.tokens.DOCTOR))
      .expect(403);
  });
});
