import request from 'supertest';
import { bearer } from '../helpers/auth-test.helper';
import {
  cerrarContextoModulosE2E,
  ContextoModulosE2E,
  iniciarContextoModulosE2E,
} from '../helpers/assigned-modules-e2e.helper';

// Crea un medicamento único y cubre la validación del enum de presentación.
describe('Medicamentos - Crear (E2E)', () => {
  let c: ContextoModulosE2E;

  beforeAll(async () => {
    c = await iniciarContextoModulosE2E();
  });

  afterAll(async () => cerrarContextoModulosE2E(c));

  it('crea un medicamento válido', async () => {
    const dto = {
      name: `Medicamento E2E ${c.sufijo}`,
      presentation: 'TABLETA',
      route: 'ORAL',
    };
    const r = await request(c.servidor)
      .post('/api/medications')
      .set(bearer(c.tokens.ADMIN))
      .send(dto)
      .expect(201);
    c.ids.medicamentos.push(r.body.id as number);
    expect(r.body).toEqual(expect.objectContaining(dto));
  });

  it('rechaza una presentación inválida', async () => {
    await request(c.servidor)
      .post('/api/medications')
      .set(bearer(c.tokens.ADMIN))
      .send({ name: 'Inválido', presentation: 'INVALIDA', route: 'ORAL' })
      .expect(400);
  });
});
