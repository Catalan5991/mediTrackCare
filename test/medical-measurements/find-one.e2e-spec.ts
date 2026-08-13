import request from 'supertest';
import { bearer } from '../helpers/auth-test.helper';
import {
  cerrarContextoModulosE2E,
  ContextoModulosE2E,
  crearPacienteE2E,
  iniciarContextoModulosE2E,
} from '../helpers/assigned-modules-e2e.helper';

// Consulta una medición relacionada y valida el caso de recurso inexistente.
describe('Mediciones médicas - Consultar por ID', () => {
  let c: ContextoModulosE2E;
  let id: number;
  beforeAll(async () => {
    c = await iniciarContextoModulosE2E();
    const p = await crearPacienteE2E(c);
    const m = await c.prisma.medicalMeasurement.create({
      data: {
        patientId: p.id,
        measurementType: 'PESO',
        value: 70,
        unit: 'kg',
        measuredAt: new Date(),
      },
    });
    id = m.id;
    c.ids.mediciones.push(id);
  });
  afterAll(async () => cerrarContextoModulosE2E(c));
  it('obtiene una medición existente', async () => {
    const r = await request(c.servidor)
      .get(`/api/medical-measurements/${id}`)
      .set(bearer(c.tokens.ADMIN))
      .expect(200);
    expect(r.body.id).toBe(id);
  });
  it('retorna 404 para una medición inexistente', async () => {
    await request(c.servidor)
      .get('/api/medical-measurements/2147483647')
      .set(bearer(c.tokens.ADMIN))
      .expect(404);
  });
});
