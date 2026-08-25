import request from 'supertest';
import { bearer } from '../helpers/auth-test.helper';
import {
  cerrarContextoModulosE2E,
  ContextoModulosE2E,
  iniciarContextoModulosE2E,
} from '../helpers/assigned-modules-e2e.helper';

// Consulta un rol existente y comprueba la respuesta para un ID inexistente.
describe('Roles - Consultar por ID (E2E)', () => {
  let c: ContextoModulosE2E;
  let id: number;

  beforeAll(async () => {
    c = await iniciarContextoModulosE2E();
    id = (await c.prisma.role.findUniqueOrThrow({ where: { name: 'ADMIN' } }))
      .id;
  });

  afterAll(async () => cerrarContextoModulosE2E(c));

  it('obtiene un rol existente', async () => {
    const r = await request(c.servidor)
      .get(`/api/roles/${id}`)
      .set(bearer(c.tokens.ADMIN))
      .expect(200);
    expect(r.body).toEqual(expect.objectContaining({ id, name: 'ADMIN' }));
  });

  it('retorna 404 para un ID inexistente', async () => {
    await request(c.servidor)
      .get('/api/roles/2147483647')
      .set(bearer(c.tokens.ADMIN))
      .expect(404);
  });
});
