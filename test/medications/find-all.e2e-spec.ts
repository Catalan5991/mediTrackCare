import request from 'supertest';
import { bearer } from '../helpers/auth-test.helper';
import {
  cerrarContextoModulosE2E,
  ContextoModulosE2E,
  iniciarContextoModulosE2E,
} from '../helpers/assigned-modules-e2e.helper';

// Verifica acceso permitido para DOCTOR y denegado para PATIENT.
describe('Medicamentos - Listar', () => {
  let c: ContextoModulosE2E;

  beforeAll(async () => {
    c = await iniciarContextoModulosE2E();
  });

  afterAll(async () => cerrarContextoModulosE2E(c));
  it('permite al doctor listar medicamentos', async () => {
    const r = await request(c.servidor)
      .get('/api/medications')
      .set(bearer(c.tokens.DOCTOR))
      .expect(200);
    expect(Array.isArray(r.body)).toBe(true);
  });

  it('rechaza a un paciente sin rol permitido', async () => {
    await request(c.servidor)
      .get('/api/medications')
      .set(bearer(c.tokens.PATIENT))
      .expect(403);
  });
});
