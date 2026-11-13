import request from 'supertest';
import { bearer } from '../helpers/auth-test.helper';
import {
  cerrarContextoModulosE2E,
  ContextoModulosE2E,
  iniciarContextoModulosE2E,
} from '../helpers/assigned-modules-e2e.helper';

// Verifica que el catálogo de roles sea cerrado y requiera permiso administrativo.
describe('Roles - Crear', () => {
  let c: ContextoModulosE2E;

  beforeAll(async () => {
    c = await iniciarContextoModulosE2E();
  });

  afterAll(async () => cerrarContextoModulosE2E(c));

  it('rechaza roles que no pertenecen al catálogo de seguridad', async () => {
    await request(c.servidor)
      .post('/api/roles')
      .set(bearer(c.tokens.ADMIN))
      .send({ name: `E2E_ROLE_${c.sufijo}`, description: 'No soportado' })
      .expect(400);
  });

  it('impide duplicar un rol del sistema ya precargado', async () => {
    await request(c.servidor)
      .post('/api/roles')
      .set(bearer(c.tokens.ADMIN))
      .send({ name: 'ADMIN', description: 'Duplicado' })
      .expect(409);
  });

  it('rechaza a un paciente sin permiso', async () => {
    await request(c.servidor)
      .post('/api/roles')
      .set(bearer(c.tokens.PATIENT))
      .send({ name: `DENIED_${c.sufijo}` })
      .expect(403);
  });
});
