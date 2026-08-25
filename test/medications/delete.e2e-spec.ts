import request from 'supertest';
import { bearer } from '../helpers/auth-test.helper';
import {
  cerrarContextoModulosE2E,
  ContextoModulosE2E,
  iniciarContextoModulosE2E,
} from '../helpers/assigned-modules-e2e.helper';

// Comprueba la desactivación lógica y el rechazo de solicitudes sin JWT.
describe('Medicamentos - Eliminar (E2E)', () => {
  let c: ContextoModulosE2E;
  let id: number;

  beforeAll(async () => {
    c = await iniciarContextoModulosE2E();
    const m = await c.prisma.medication.create({
      data: {
        name: `Medicamento delete ${c.sufijo}`,
        presentation: 'TABLETA',
        route: 'ORAL',
      },
    });
    id = m.id;
    c.ids.medicamentos.push(id);
  });

  afterAll(async () => cerrarContextoModulosE2E(c));
  it('desactiva un medicamento existente', async () => {
    const r = await request(c.servidor)
      .delete(`/api/medications/${id}`)
      .set(bearer(c.tokens.ADMIN))
      .expect(200);
    expect(r.body.isActive).toBe(false);
  });

  it('rechaza la eliminación sin JWT', async () => {
    await request(c.servidor).delete(`/api/medications/${id}`).expect(401);
  });
});
