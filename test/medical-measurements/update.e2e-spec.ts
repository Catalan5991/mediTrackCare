import request from 'supertest';
import { bearer } from '../helpers/auth-test.helper';
import {
  cerrarContextoModulosE2E,
  ContextoModulosE2E,
  crearPacienteE2E,
  iniciarContextoModulosE2E,
} from '../helpers/assigned-modules-e2e.helper';

// Actualiza valor y notas, y comprueba la validación numérica del DTO.
describe('Mediciones médicas - Actualizar', () => {
  let c: ContextoModulosE2E;
  let id: number;

  beforeAll(async () => {
    c = await iniciarContextoModulosE2E();
    const p = await crearPacienteE2E(c);
    const m = await c.prisma.medicalMeasurement.create({
      data: {
        patientId: p.id,
        measurementType: 'GLUCOSA',
        value: 100,
        unit: 'mg/dL',
        measuredAt: new Date(),
      },
    });
    id = m.id;
    c.ids.mediciones.push(id);
  });

  afterAll(async () => cerrarContextoModulosE2E(c));

  it('actualiza una medición existente', async () => {
    const r = await request(c.servidor)
      .patch(`/api/medical-measurements/${id}`)
      .set(bearer(c.tokens.ADMIN))
      .send({ value: 115.25, notes: 'Actualizada E2E' })
      .expect(200);
    expect(Number(r.body.value)).toBe(115.25);
  });

  it('rechaza un valor no numérico', async () => {
    await request(c.servidor)
      .patch(`/api/medical-measurements/${id}`)
      .set(bearer(c.tokens.ADMIN))
      .send({ value: 'alto' })
      .expect(400);
  });
});
