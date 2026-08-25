import request from 'supertest';
import { bearer } from '../helpers/auth-test.helper';
import {
  cerrarContextoModulosE2E,
  ContextoModulosE2E,
  iniciarContextoModulosE2E,
} from '../helpers/assigned-modules-e2e.helper';

// Actualiza un medicamento temporal y comprueba la restricción del rol ADMIN.
describe('Medicamentos - Actualizar', () => {
  let c: ContextoModulosE2E;
  let id: number;

  beforeAll(async () => {
    c = await iniciarContextoModulosE2E();
    const m = await c.prisma.medication.create({
      data: {
        name: `Medicamento update ${c.sufijo}`,
        presentation: 'TABLETA',
        route: 'ORAL',
      },
    });
    id = m.id;
    c.ids.medicamentos.push(id);
  });

  afterAll(async () => cerrarContextoModulosE2E(c));

  it('actualiza un medicamento existente', async () => {
    const r = await request(c.servidor)
      .patch(`/api/medications/${id}`)
      .set(bearer(c.tokens.ADMIN))
      .send({ description: 'Actualizado E2E' })
      .expect(200);
    expect(r.body.description).toBe('Actualizado E2E');
  });

  it('rechaza a un doctor sin rol administrativo', async () => {
    await request(c.servidor)
      .patch(`/api/medications/${id}`)
      .set(bearer(c.tokens.DOCTOR))
      .send({ description: 'Denegado' })
      .expect(403);
  });
});
