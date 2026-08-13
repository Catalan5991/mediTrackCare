import request from 'supertest';
import { bearer } from '../helpers/auth-test.helper';
import {
  cerrarContextoModulosE2E,
  ContextoModulosE2E,
  iniciarContextoModulosE2E,
} from '../helpers/assigned-modules-e2e.helper';

// Prepara un medicamento propio y valida su consulta y un ID inválido.
describe('Medicamentos - Consultar por ID', () => {
  let c: ContextoModulosE2E;
  let id: number;

  beforeAll(async () => {
    c = await iniciarContextoModulosE2E();
    const m = await c.prisma.medication.create({
      data: {
        name: `Medicamento consulta ${c.sufijo}`,
        presentation: 'TABLETA',
        route: 'ORAL',
      },
    });
    id = m.id;
    c.ids.medicamentos.push(id);
  });

  afterAll(async () => cerrarContextoModulosE2E(c));

  it('obtiene un medicamento existente', async () => {
    const r = await request(c.servidor)
      .get(`/api/medications/${id}`)
      .set(bearer(c.tokens.DOCTOR))
      .expect(200);
    expect(r.body.id).toBe(id);
  });

  it('rechaza un ID no numérico', async () => {
    await request(c.servidor)
      .get('/api/medications/no-numero')
      .set(bearer(c.tokens.ADMIN))
      .expect(400);
  });
});
