import request from 'supertest';
import { bearer } from '../helpers/auth-test.helper';
import {
  cerrarContextoModulosE2E,
  ContextoModulosE2E,
  crearPacienteE2E,
  iniciarContextoModulosE2E,
} from '../helpers/assigned-modules-e2e.helper';

// Prepara un paciente propio, valida filtros y comprueba el rechazo sin JWT.
describe('Pacientes - Listar', () => {
  let c: ContextoModulosE2E;
  let id: number;

  beforeAll(async () => {
    c = await iniciarContextoModulosE2E();
    id = (await crearPacienteE2E(c)).id;
  });

  afterAll(async () => cerrarContextoModulosE2E(c));

  it('lista pacientes con filtros válidos', async () => {
    const r = await request(c.servidor)
      .get('/api/patients?page=1&limit=10&isActive=true')
      .set(bearer(c.tokens.ADMIN))
      .expect(200);
    expect(Array.isArray(r.body.data)).toBe(true);
    expect(r.body.data).toEqual(
      expect.arrayContaining([expect.objectContaining({ id })]),
    );
  });

  it('rechaza la consulta sin JWT', async () => {
    await request(c.servidor).get('/api/patients').expect(401);
  });
});
