import request from 'supertest';
import { bearer } from '../helpers/auth-test.helper';
import {
  cerrarContextoModulosE2E,
  ContextoModulosE2E,
  crearPacienteE2E,
  iniciarContextoModulosE2E,
} from '../helpers/assigned-modules-e2e.helper';
import { MedicationForm, MedicationRoute } from '../../generated/prisma/client';

describe('Prescripciones - Eliminar (E2E)', () => {
  let c: ContextoModulosE2E;
  let id: number;

  beforeAll(async () => {
    c = await iniciarContextoModulosE2E();
    const p = await crearPacienteE2E(c);

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

    const res = await request(c.servidor)
      .post('/api/prescriptions')
      .set(bearer(c.tokens.ADMIN))
      .send({
        patientId: p.id,
        diagnosis: 'Diagnostico para borrar',
        generalInstructions: 'Instrucciones para borrar',
        items: [
          {
            medicationId: med.id,
            dose: '500mg',
            frequency: 'Cada 8 horas',
            duration: '5 dias',
            instructions: 'Tomar despues de comer',
          },
        ],
      });

    id = res.body.id;
  });

  afterAll(async () => {
    await c.prisma.prescriptionItem.deleteMany({});
    await c.prisma.prescription.deleteMany({});
    await cerrarContextoModulosE2E(c);
  });

  it('elimina una receta medica existente', async () => {
    await request(c.servidor)
      .delete(`/api/prescriptions/${id}`)
      .set(bearer(c.tokens.ADMIN))
      .expect(200);
  });

  it('rechaza la eliminacion sin JWT', async () => {
    await request(c.servidor).delete(`/api/prescriptions/${id}`).expect(401);
  });
});