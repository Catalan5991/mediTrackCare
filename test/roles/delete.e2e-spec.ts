import request from 'supertest';
import { bearer } from '../helpers/auth-test.helper';
import {
  cerrarContextoModulosE2E,
  ContextoModulosE2E,
  iniciarContextoModulosE2E,
} from '../helpers/assigned-modules-e2e.helper';

// Comprueba la desactivación lógica del rol y la protección mediante JWT.
describe('Roles - Eliminar (E2E)', () => {
  let c: ContextoModulosE2E;
  let id: number;

  beforeAll(async () => {
    c = await iniciarContextoModulosE2E();
    const r = await c.prisma.role.create({
      data: { name: `E2E_DELETE_${c.sufijo}` },
    });
    id = r.id;
    c.ids.roles.push(id);
  });

  afterAll(async () => cerrarContextoModulosE2E(c));
  it('desactiva lógicamente un rol', async () => {
    const r = await request(c.servidor)
      .delete(`/api/roles/${id}`)
      .set(bearer(c.tokens.ADMIN))
      .expect(200);
    expect(r.body.isActive).toBe(false);
  });

  it('rechaza la eliminación sin JWT', async () => {
    await request(c.servidor).delete(`/api/roles/${id}`).expect(401);
  });
});
