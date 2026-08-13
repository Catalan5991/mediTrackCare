import request from 'supertest';
import { bearer } from '../helpers/auth-test.helper';
import {
  cerrarContextoModulosE2E,
  ContextoModulosE2E,
  iniciarContextoModulosE2E,
} from '../helpers/assigned-modules-e2e.helper';

// Modifica únicamente un rol temporal y valida el whitelist del DTO.
describe('Roles - Actualizar (E2E)', () => {
  let c: ContextoModulosE2E;
  let id: number;

  beforeAll(async () => {
    c = await iniciarContextoModulosE2E();
    const r = await c.prisma.role.create({
      data: { name: `E2E_UPDATE_${c.sufijo}` },
    });
    id = r.id;
    c.ids.roles.push(id);
  });

  afterAll(async () => cerrarContextoModulosE2E(c));

  it('actualiza la descripción de un rol propio', async () => {
    const r = await request(c.servidor)
      .patch(`/api/roles/${id}`)
      .set(bearer(c.tokens.ADMIN))
      .send({ description: 'Descripción actualizada E2E' })
      .expect(200);
    expect(r.body.description).toBe('Descripción actualizada E2E');
  });

  it('rechaza un cuerpo no permitido', async () => {
    await request(c.servidor)
      .patch(`/api/roles/${id}`)
      .set(bearer(c.tokens.ADMIN))
      .send({ campoInvalido: true })
      .expect(400);
  });
});
