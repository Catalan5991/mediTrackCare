import request from 'supertest';
import { bearer } from '../helpers/auth-test.helper';
import {
  cerrarContextoModulosE2E,
  ContextoModulosE2E,
  iniciarContextoModulosE2E,
} from '../helpers/assigned-modules-e2e.helper';

// Crea un rol temporal único y verifica el permiso administrativo requerido.
describe('Roles - Crear', () => {
  let c: ContextoModulosE2E;

  beforeAll(async () => {
    c = await iniciarContextoModulosE2E();
  });

  afterAll(async () => cerrarContextoModulosE2E(c));

  it('crea un rol con permiso administrativo', async () => {
    const dto = {
      name: `E2E_ROLE_${c.sufijo}`,
      description: 'Rol temporal E2E',
    };
    const r = await request(c.servidor)
      .post('/api/roles')
      .set(bearer(c.tokens.ADMIN))
      .send(dto)
      .expect(201);
    c.ids.roles.push(r.body.id as number);

    expect(r.body).toEqual(
      expect.objectContaining({ id: expect.any(Number), name: dto.name }),
    );
  });

  it('rechaza a un paciente sin permiso', async () => {
    await request(c.servidor)
      .post('/api/roles')
      .set(bearer(c.tokens.PATIENT))
      .send({ name: `DENIED_${c.sufijo}` })
      .expect(403);
  });
});
