import request from 'supertest';
import { bearer } from '../helpers/auth-test.helper';
import {
  cerrarContextoModulosE2E,
  ContextoModulosE2E,
  crearUsuarioE2E,
  iniciarContextoModulosE2E,
} from '../helpers/assigned-modules-e2e.helper';

// Crea primero un User relacionado y valida datos correctos e inválidos del paciente.
describe('Pacientes - Crear', () => {
  let c: ContextoModulosE2E;

  beforeAll(async () => {
    c = await iniciarContextoModulosE2E();
  });

  afterAll(async () => cerrarContextoModulosE2E(c));

  it('crea un paciente relacionado con un usuario real', async () => {
    const u = await crearUsuarioE2E(c);

    const dto = {
      userId: u.id,
      fullName: 'Paciente creado E2E',
      birthDate: '1990-05-20',
      gender: 'NO_ESPECIFICADO',
    };

    const r = await request(c.servidor)
      .post('/api/patients')
      .set(bearer(c.tokens.ADMIN))
      .send(dto)
      .expect(201);
    c.ids.pacientes.push(r.body.id as number);

    expect(r.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        userId: u.id,
        fullName: dto.fullName,
      }),
    );
  });

  it('rechaza datos inválidos', async () => {
    await request(c.servidor)
      .post('/api/patients')
      .set(bearer(c.tokens.ADMIN))
      .send({ userId: 0, fullName: 'Inválido', birthDate: 'no-fecha' })
      .expect(400);
  });
});
