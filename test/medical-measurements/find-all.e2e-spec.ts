import request from 'supertest';
import { bearer } from '../helpers/auth-test.helper';
import {
  cerrarContextoModulosE2E,
  ContextoModulosE2E,
  crearPacienteE2E,
  iniciarContextoModulosE2E,
} from '../helpers/assigned-modules-e2e.helper';

// Filtra mediciones propias por paciente y cubre rangos de fechas inválidos.
describe('Mediciones médicas - Listar', () => {
  let c: ContextoModulosE2E;
  let patientId: number;

  beforeAll(async () => {
    c = await iniciarContextoModulosE2E();
    patientId = (await crearPacienteE2E(c)).id;
    const m = await c.prisma.medicalMeasurement.create({
      data: {
        patientId,
        registeredByUserId: c.usuarios.PATIENT.id,
        measurementType: 'GLUCOSA',
        value: 100,
        unit: 'mg/dL',
        measuredAt: new Date(),
      },
    });
    c.ids.mediciones.push(m.id);
  });

  afterAll(async () => cerrarContextoModulosE2E(c));

  it('lista mediciones filtradas por paciente', async () => {
    const r = await request(c.servidor)
      .get(`/api/medical-measurements?patientId=${patientId}&page=1&limit=10`)
      .set(bearer(c.tokens.ADMIN))
      .expect(200);

    expect(r.body.data).toEqual(
      expect.arrayContaining([expect.objectContaining({ patientId })]),
    );
  });

  it('rechaza un rango de fechas inválido', async () => {
    await request(c.servidor)
      .get(
        '/api/medical-measurements?dateFrom=2027-01-02T00:00:00.000Z&dateTo=2027-01-01T00:00:00.000Z',
      )
      .set(bearer(c.tokens.ADMIN))
      .expect(400);
  });
});
