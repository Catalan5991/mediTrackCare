import request from 'supertest';
import { bearer } from '../helpers/auth-test.helper';
import {
  cerrarContextoModulosE2E,
  ContextoModulosE2E,
  crearPacienteE2E,
  iniciarContextoModulosE2E,
} from '../helpers/assigned-modules-e2e.helper';

// Consulta una relación User/Patient real y cubre el recurso inexistente.
describe('Pacientes - Consultar por ID', () => {
  let c: ContextoModulosE2E;
  let id: number;

  beforeAll(async () => {
    c = await iniciarContextoModulosE2E();
    id = (await crearPacienteE2E(c)).id;
  });

  afterAll(async () => cerrarContextoModulosE2E(c));

  it('obtiene un paciente existente', async () => {
    const r = await request(c.servidor)
      .get(`/api/patients/${id}`)
      .set(bearer(c.tokens.ADMIN))
      .expect(200);
    expect(r.body.id).toBe(id);
  });

  it('retorna 404 para un paciente inexistente', async () => {
    await request(c.servidor)
      .get('/api/patients/2147483647')
      .set(bearer(c.tokens.ADMIN))
      .expect(404);
  });
});
