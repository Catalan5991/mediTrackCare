import request from 'supertest';
import { bearer } from '../helpers/auth-test.helper';
import {
  cerrarContextoModulosE2E,
  ContextoModulosE2E,
  crearPacienteE2E,
  iniciarContextoModulosE2E,
} from '../helpers/assigned-modules-e2e.helper';

// Valida eliminación física con 204 y protección del endpoint mediante JWT.
describe('Mediciones médicas - Eliminar', () => {
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

  it('elimina una medición y retorna 204', async () => {
    await request(c.servidor)
      .delete(`/api/medical-measurements/${id}`)
      .set(bearer(c.tokens.ADMIN))
      .expect(204);
    expect(
      await c.prisma.medicalMeasurement.findUnique({ where: { id } }),
    ).toBeNull();
  });

  it('rechaza la eliminación sin JWT', async () => {
    await request(c.servidor)
      .delete(`/api/medical-measurements/${id}`)
      .expect(401);
  });
});
