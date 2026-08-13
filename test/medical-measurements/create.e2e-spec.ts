import request from 'supertest';
import { bearer } from '../helpers/auth-test.helper';
import {
  cerrarContextoModulosE2E,
  ContextoModulosE2E,
  crearPacienteE2E,
  iniciarContextoModulosE2E,
} from '../helpers/assigned-modules-e2e.helper';

// Prepara User y Patient reales para crear una medición y validar su DTO.
describe('Mediciones médicas - Crear', () => {
  let c: ContextoModulosE2E;
  let patientId: number;

  beforeAll(async () => {
    c = await iniciarContextoModulosE2E();
    patientId = (await crearPacienteE2E(c)).id;
  });

  afterAll(async () => cerrarContextoModulosE2E(c));
  it('crea una medición con relaciones reales', async () => {
    const dto = {
      patientId,
      registeredByUserId: c.usuarios.PATIENT.id,
      measurementType: 'GLUCOSA',
      value: 110.5,
      unit: 'mg/dL',
      measuredAt: new Date().toISOString(),
    };

    const r = await request(c.servidor)
      .post('/api/medical-measurements')
      .set(bearer(c.tokens.ADMIN))
      .send(dto)
      .expect(201);
    c.ids.mediciones.push(r.body.id as number);

    expect(r.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        patientId,
        measurementType: 'GLUCOSA',
      }),
    );
  });

  it('rechaza un tipo de medición inválido', async () => {
    await request(c.servidor)
      .post('/api/medical-measurements')
      .set(bearer(c.tokens.ADMIN))
      .send({
        patientId,
        measurementType: 'INVALIDA',
        value: 'alto',
        unit: 'mg/dL',
        measuredAt: new Date().toISOString(),
      })
      .expect(400);
  });
});
