import request from 'supertest';
import { bearer } from '../helpers/auth-test.helper';
import {
  cerrarContextoModulosE2E,
  ContextoModulosE2E,
  crearPacienteE2E,
  iniciarContextoModulosE2E,
} from '../helpers/assigned-modules-e2e.helper';
import { MedicationForm, MedicationRoute } from '../../generated/prisma/client';

describe('Prescripciones - Crear (E2E)', () => {
  let c: ContextoModulosE2E;
  let patientId: number;
  let medicationId: number;

  beforeAll(async () => {
    c = await iniciarContextoModulosE2E();
    patientId = (await crearPacienteE2E(c)).id;

    const formVal = Object.values(MedicationForm)[0];
    const routeVal = Object.values(MedicationRoute)[0];

    const med = await c.prisma.medication.create({
      data: {
        name: `Medicamento Test ${Date.now()}`,
        description: 'Uso en pruebas E2E',
        presentation: formVal,
        route: routeVal,
      },
    });
    medicationId = med.id;
  });

  afterAll(async () => {
    // Limpieza ordenada para respetar las llaves foráneas
    await c.prisma.prescriptionItem.deleteMany({});
    await c.prisma.prescription.deleteMany({});
    await cerrarContextoModulosE2E(c);
  });

  it('crea una receta medica valida', async () => {
    const dto = {
      patientId,
      diagnosis: 'Infección leve de prueba',
      generalInstructions: 'Tomar con abundante agua',
      items: [
        {
          medicationId,
          dose: '500mg',
          frequency: 'Cada 8 horas',
          duration: '5 dias',
          instructions: 'Tomar despues de comer',
        },
      ],
    };

    const r = await request(c.servidor)
      .post('/api/prescriptions')
      .set(bearer(c.tokens.ADMIN))
      .send(dto)
      .expect(201);

    expect(r.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        patientId,
      }),
    );
  });

  it('rechaza una receta con datos invalidos', async () => {
    await request(c.servidor)
      .post('/api/prescriptions')
      .set(bearer(c.tokens.ADMIN))
      .send({ patientId: 'invalido' })
      .expect(400);
  });
});