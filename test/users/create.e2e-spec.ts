import request from 'supertest';
import { bearer } from '../helpers/auth-test.helper';
import {
  cerrarContextoModulosE2E,
  ContextoModulosE2E,
  iniciarContextoModulosE2E,
} from '../helpers/assigned-modules-e2e.helper';

// Valida creación administrativa, respuesta segura y rechazo por DTO o permisos.
describe('Usuarios - Crear', () => {
  let c: ContextoModulosE2E;

  beforeAll(async () => {
    c = await iniciarContextoModulosE2E();
  });

  afterAll(async () => cerrarContextoModulosE2E(c));

  it('crea un usuario con datos válidos y autorización administrativa', async () => {
    const dto = {
      name: 'Usuario creado E2E',
      email: `e2e-created-${c.sufijo}@test.local`,
      password: 'Password123!',
      role: 'PATIENT',
    };
    const r = await request(c.servidor)
      .post('/api/users')
      .set(bearer(c.tokens.ADMIN))
      .send(dto)
      .expect(201);
    c.ids.usuarios.push(r.body.id as number);

    expect(r.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        email: dto.email,
        role: 'PATIENT',
      }),
    );

    expect(r.body).not.toHaveProperty('password');
  });

  it('rechaza un DTO inválido y a un usuario sin permisos', async () => {
    await request(c.servidor)
      .post('/api/users')
      .set(bearer(c.tokens.ADMIN))
      .send({ email: 'invalido' })
      .expect(400);

    await request(c.servidor)
      .post('/api/users')
      .set(bearer(c.tokens.PATIENT))
      .send({
        name: 'Denegado',
        email: `denied-${c.sufijo}@test.local`,
        password: 'Password123!',
      })
      .expect(403);
  });
});
