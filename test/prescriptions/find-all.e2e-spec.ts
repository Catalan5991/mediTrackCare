import request from 'supertest';
import { bearer } from '../helpers/auth-test.helper';
import {
  cerrarContextoModulosE2E,
  ContextoModulosE2E,
  iniciarContextoModulosE2E,
} from '../helpers/assigned-modules-e2e.helper';

describe('Prescripciones - Listar (E2E)', () => {
  let c: ContextoModulosE2E;

  beforeAll(async () => {
    c = await iniciarContextoModulosE2E();
  });

  afterAll(async () => {
    await c.prisma.prescriptionItem.deleteMany({});
    await c.prisma.prescription.deleteMany({});
    await cerrarContextoModulosE2E(c);
  });

  it('lista recetas medicas para un usuario autorizado', async () => {
    const r = await request(c.servidor)
      .get('/api/prescriptions')
      .set(bearer(c.tokens.ADMIN))
      .expect(200);

    expect(r.body).toBeDefined();
  });

  it('rechaza la consulta sin JWT', async () => {
    await request(c.servidor).get('/api/prescriptions').expect(401);
  });
});