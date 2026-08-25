import request from 'supertest';
import { bearer } from '../helpers/auth-test.helper';
import {
  cerrarContextoModulosE2E,
  ContextoModulosE2E,
  crearPacienteE2E,
  iniciarContextoModulosE2E,
} from '../helpers/assigned-modules-e2e.helper';

// Comprueba la actualización parcial y la validación del género recibido.
describe('Pacientes - Actualizar', () => {
  let c: ContextoModulosE2E;
  let id: number;
  beforeAll(async () => {
    c = await iniciarContextoModulosE2E();
    id = (await crearPacienteE2E(c)).id;
  });

  afterAll(async () => cerrarContextoModulosE2E(c));

  it('actualiza un paciente existente', async () => {
    const r = await request(c.servidor)
      .patch(`/api/patients/${id}`)
      .set(bearer(c.tokens.ADMIN))
      .send({ phone: '+525511111111', address: 'Dirección E2E' })
      .expect(200);
    expect(r.body.phone).toBe('+525511111111');
  });

  it('rechaza un género inválido', async () => {
    await request(c.servidor)
      .patch(`/api/patients/${id}`)
      .set(bearer(c.tokens.ADMIN))
      .send({ gender: 'INVALIDO' })
      .expect(400);
  });
});
