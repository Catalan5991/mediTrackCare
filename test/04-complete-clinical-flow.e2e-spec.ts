import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { PrismaService } from '../src/modules/prisma/prisma.service';
import { createTestApp } from './helpers/app-test.helper';
import { bearer, tokenFor } from './helpers/auth-test.helper';
import { cleanDatabase, seedTestUsers } from './helpers/database-test.helper';
import { expectError } from './helpers/response-test.helper';
import { TestContext } from './helpers/test-context';

describe('Flujo clínico completo (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let context: TestContext;
  let adminToken: string;
  let patientToken: string;

  beforeAll(async () => {
    app = await createTestApp();
    prisma = app.get(PrismaService);
    await cleanDatabase(prisma);
    context = await seedTestUsers(prisma);
    adminToken = await tokenFor(app, context, 'ADMIN');
    patientToken = await tokenFor(app, context, 'PATIENT');
  });

  afterAll(async () => {
    await cleanDatabase(prisma);
    await app.close();
  });

  it('cubre el CRUD administrativo de usuarios sin exponer contraseñas', async () => {
    const api = request(app.getHttpServer());
    const admin = bearer(adminToken);
    const email = `managed-${Date.now()}@e2e.invalid`;
    const created = await api
      .post('/api/users')
      .set(admin)
      .send({
        name: 'Usuario Administrado E2E',
        email,
        password: 'E2ePassword123!',
        role: 'PATIENT',
      })
      .expect(201);
    const id = created.body.id as number;
    expect(created.body).toEqual(
      expect.objectContaining({ id, email, role: 'PATIENT' }),
    );
    expect(created.body).not.toHaveProperty('password');
    expectError(
      await api.post('/api/users').set(admin).send({
        name: 'Duplicado',
        email,
        password: 'E2ePassword123!',
        role: 'PATIENT',
      }),
      409,
    );
    expectError(
      await api
        .post('/api/users')
        .set(admin)
        .send({
          name: 'Rol inválido',
          email: `invalid-${Date.now()}@e2e.invalid`,
          password: 'E2ePassword123!',
          role: 'SUPERUSER',
        }),
      400,
    );
    const found = await api.get(`/api/users/${id}`).set(admin).expect(200);
    expect(found.body).not.toHaveProperty('password');
    await api
      .patch(`/api/users/${id}`)
      .set(admin)
      .send({ name: 'Usuario Actualizado E2E' })
      .expect(200);
    expectError(await api.get('/api/users/not-a-number').set(admin), 400);
    await api.delete(`/api/users/${id}`).set(admin).expect(200);
    const inactive = await api.get(`/api/users/${id}`).set(admin).expect(200);
    expect(inactive.body.isActive).toBe(false);
  });

  it('crea y valida el flujo relacional completo', async () => {
    const api = request(app.getHttpServer());
    const admin = bearer(adminToken);

    const patientResponse = await api
      .post('/api/patients')
      .set(admin)
      .send({
        userId: context.users.PATIENT.id,
        fullName: 'Paciente Flujo E2E',
        birthDate: '1990-05-20',
        gender: 'NO_ESPECIFICADO',
      })
      .expect(201);
    const patientId = patientResponse.body.id as number;
    expect(patientResponse.body.userId).toBe(context.users.PATIENT.id);

    expectError(
      await api.post('/api/patients').set(admin).send({
        userId: context.users.PATIENT.id,
        fullName: 'Duplicado',
        birthDate: '1990-05-20',
      }),
      409,
    );
    expectError(
      await api.post('/api/patients').set(admin).send({
        userId: 999999,
        fullName: 'Sin usuario',
        birthDate: 'invalid',
      }),
      400,
    );
    const patientList = await api
      .get('/api/patients?search=Flujo&page=1&limit=5&isActive=true')
      .set(admin)
      .expect(200);
    expect(patientList.body.data).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: patientId })]),
    );
    await api.get(`/api/patients/${patientId}`).set(admin).expect(200);
    const updatedPatient = await api
      .patch(`/api/patients/${patientId}`)
      .set(admin)
      .send({ phone: '+525511111111', address: 'Dirección E2E' })
      .expect(200);
    expect(updatedPatient.body.phone).toBe('+525511111111');
    expectError(
      await api
        .patch(`/api/patients/${patientId}`)
        .set(admin)
        .send({ gender: 'INVALIDO' }),
      400,
    );
    expectError(await api.get('/api/patients/no-numerico').set(admin), 400);
    expectError(await api.get('/api/patients/999999').set(admin), 404);

    const doctorResponse = await api
      .post('/api/doctors')
      .set(admin)
      .send({
        userId: context.users.DOCTOR.id,
        fullName: 'Doctor Flujo E2E',
        professionalLicense: `E2E-${Date.now()}`,
        specialty: 'Medicina interna',
      })
      .expect(201);
    const doctorId = doctorResponse.body.id as number;
    const doctorList = await api
      .get('/api/doctors?specialty=medicina&page=1&limit=5')
      .set(bearer(await tokenFor(app, context, 'DOCTOR')))
      .expect(200);
    expect(doctorList.body.data).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: doctorId })]),
    );
    await api
      .patch(`/api/doctors/${doctorId}`)
      .set(admin)
      .send({ phone: '+525500000000' })
      .expect(200);

    const caregiverResponse = await api
      .post('/api/caregivers')
      .set(admin)
      .send({
        userId: context.users.CAREGIVER.id,
        patientId,
        relationship: 'Familiar E2E',
        isPrimary: true,
      })
      .expect(201);
    const caregiverId = caregiverResponse.body.id as number;
    expectError(
      await api.post('/api/caregivers').set(admin).send({
        userId: context.users.CAREGIVER.id,
        patientId,
        relationship: 'Duplicado',
      }),
      409,
    );
    const caregivers = await api
      .get(
        `/api/caregivers?patientId=${patientId}&isPrimary=true&page=1&limit=5`,
      )
      .set(admin)
      .expect(200);
    expect(caregivers.body.data).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: caregiverId })]),
    );
    await api.get(`/api/caregivers/${caregiverId}`).set(admin).expect(200);
    const updatedCaregiver = await api
      .patch(`/api/caregivers/${caregiverId}`)
      .set(admin)
      .send({ relationship: 'Responsable E2E', isPrimary: false })
      .expect(200);
    expect(updatedCaregiver.body.relationship).toBe('Responsable E2E');
    expectError(
      await api.get('/api/caregivers?page=0&limit=no-numerico').set(admin),
      400,
    );
    expectError(await api.get('/api/caregivers/999999').set(admin), 404);

    const medicationResponse = await api
      .post('/api/medications')
      .set(admin)
      .send({
        name: 'Medicamento Flujo E2E',
        presentation: 'TABLETA',
        route: 'ORAL',
        concentration: '500 mg',
        unit: 'mg',
      })
      .expect(201);
    const medicationId = medicationResponse.body.id as number;

    const today = new Date();
    const tomorrow = new Date(today.getTime() + 86_400_000);
    const inSevenDays = new Date(today.getTime() + 7 * 86_400_000);
    const date = (value: Date) => value.toISOString().slice(0, 10);
    const prescriptionResponse = await api
      .post('/api/prescriptions')
      .set(admin)
      .send({
        patientId,
        doctorId,
        diagnosis: 'Diagnóstico E2E',
        issueDate: date(today),
        expirationDate: date(inSevenDays),
        items: [
          {
            medicationId,
            dose: '500 mg',
            frequency: 'Cada 8 horas',
            startDate: date(today),
            endDate: date(inSevenDays),
          },
        ],
      })
      .expect(201);
    const prescriptionId = prescriptionResponse.body.id as number;
    const prescriptionItemId = prescriptionResponse.body.items[0].id as number;
    expect(prescriptionResponse.body.items).toHaveLength(1);

    expectError(
      await api.post('/api/prescriptions').set(admin).send({
        patientId,
        items: [],
      }),
      400,
    );
    const prescriptionList = await api
      .get(`/api/prescriptions?patientId=${patientId}&page=1&limit=5`)
      .set(admin)
      .expect(200);
    expect(prescriptionList.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: prescriptionId, patientId }),
      ]),
    );
    const prescriptionDetail = await api
      .get(`/api/prescriptions/${prescriptionId}`)
      .set(admin)
      .expect(200);
    expect(prescriptionDetail.body.items).toHaveLength(1);
    const updatedPrescription = await api
      .patch(`/api/prescriptions/${prescriptionId}`)
      .set(admin)
      .send({ diagnosis: 'Diagnóstico actualizado E2E' })
      .expect(200);
    expect(updatedPrescription.body.diagnosis).toBe(
      'Diagnóstico actualizado E2E',
    );
    const cancelledPrescription = await api
      .patch(`/api/prescriptions/${prescriptionId}/cancel`)
      .set(admin)
      .expect(200);
    expect(cancelledPrescription.body.status).toBe('CANCELADO');
    expectError(
      await api.get('/api/prescriptions?status=INVALIDO').set(admin),
      400,
    );
    expectError(await api.get('/api/prescriptions/999999').set(admin), 404);

    const reminderResponse = await api
      .post('/api/reminders')
      .set(admin)
      .send({ patientId, prescriptionItemId, scheduledTime: '08:00' })
      .expect(201);
    const reminderId = reminderResponse.body.id as number;
    expectError(
      await api.post('/api/reminders').set(admin).send({
        patientId,
        prescriptionItemId,
        scheduledTime: '25:99',
      }),
      400,
    );
    const reminderList = await api
      .get(
        `/api/reminders?patientId=${patientId}&scheduledTime=08:00&page=1&limit=5`,
      )
      .set(admin)
      .expect(200);
    expect(reminderList.body.data).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: reminderId })]),
    );
    await api.get(`/api/reminders/${reminderId}`).set(admin).expect(200);
    const updatedReminder = await api
      .patch(`/api/reminders/${reminderId}`)
      .set(admin)
      .send({ scheduledTime: '09:30', daysOfWeek: 'MON,WED,FRI' })
      .expect(200);
    expect(updatedReminder.body.scheduledTime).toBe('09:30');
    expectError(await api.get('/api/reminders/999999').set(admin), 404);

    const intakeResponse = await api
      .post('/api/intakes')
      .set(admin)
      .send({
        patientId,
        prescriptionItemId,
        reminderId,
        confirmedByUserId: context.users.PATIENT.id,
        scheduledAt: tomorrow.toISOString(),
        status: 'PENDIENTE',
      })
      .expect(201);
    const intakeId = intakeResponse.body.id as number;
    await api
      .patch(`/api/intakes/${intakeId}`)
      .set(admin)
      .send({ status: 'TOMADA', takenAt: tomorrow.toISOString() })
      .expect(200);
    const intakeList = await api
      .get(`/api/intakes?patientId=${patientId}&status=TOMADA&page=1&limit=5`)
      .set(admin)
      .expect(200);
    expect(intakeList.body.data).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: intakeId })]),
    );
    await api.get(`/api/intakes/${intakeId}`).set(admin).expect(200);
    expectError(await api.get('/api/intakes?status=INVALIDO').set(admin), 400);
    expectError(await api.get('/api/intakes/999999').set(admin), 404);
    expectError(
      await api
        .get(
          '/api/intakes?dateFrom=2027-01-02T00:00:00.000Z&dateTo=2027-01-01T00:00:00.000Z',
        )
        .set(admin),
      400,
    );
    const measurementResponse = await api
      .post('/api/medical-measurements')
      .set(admin)
      .send({
        patientId,
        registeredByUserId: context.users.PATIENT.id,
        measurementType: 'GLUCOSA',
        value: 110.5,
        unit: 'mg/dL',
        measuredAt: today.toISOString(),
      })
      .expect(201);
    const measurementId = measurementResponse.body.id as number;
    expectError(
      await api.post('/api/medical-measurements').set(admin).send({
        patientId,
        measurementType: 'INVALIDA',
        value: 'alto',
        unit: 'mg/dL',
        measuredAt: today.toISOString(),
      }),
      400,
    );
    const measurementList = await api
      .get(
        `/api/medical-measurements?patientId=${patientId}&measurementType=GLUCOSA&page=1&limit=5`,
      )
      .set(admin)
      .expect(200);
    expect(measurementList.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: measurementId,
          measurementType: 'GLUCOSA',
        }),
      ]),
    );
    await api
      .get(`/api/medical-measurements/${measurementId}`)
      .set(admin)
      .expect(200);
    const updatedMeasurement = await api
      .patch(`/api/medical-measurements/${measurementId}`)
      .set(admin)
      .send({ value: 115.25, notes: 'Actualizada E2E' })
      .expect(200);
    expect(Number(updatedMeasurement.body.value)).toBe(115.25);
    expectError(
      await api.get('/api/medical-measurements/999999').set(admin),
      404,
    );

    const notificationResponse = await api
      .post('/api/notifications')
      .set(admin)
      .send({
        userId: context.users.PATIENT.id,
        patientId,
        intakeId,
        title: 'Notificación E2E',
        message: 'Es hora de confirmar la toma.',
        type: 'RECORDATORIO_TOMA',
      })
      .expect(201);
    const notificationId = notificationResponse.body.id as number;
    const patientNotifications = await api
      .get(`/api/notifications?userId=${context.users.ADMIN.id}`)
      .set(bearer(patientToken))
      .expect(200);
    expect(patientNotifications.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: notificationId,
          userId: context.users.PATIENT.id,
        }),
      ]),
    );
    await api
      .patch(`/api/notifications/${notificationId}/sent`)
      .set(admin)
      .expect(200);
    const readNotification = await api
      .patch(`/api/notifications/${notificationId}/read`)
      .set(bearer(patientToken))
      .expect(200);
    expect(readNotification.body.status).toBe('LEIDA');
    const notificationDetail = await api
      .get(`/api/notifications/${notificationId}`)
      .set(bearer(patientToken))
      .expect(200);
    expect(notificationDetail.body.userId).toBe(context.users.PATIENT.id);
    const updatedNotification = await api
      .patch(`/api/notifications/${notificationId}`)
      .set(admin)
      .send({ title: 'Notificación actualizada E2E' })
      .expect(200);
    expect(updatedNotification.body.title).toBe('Notificación actualizada E2E');
    expectError(
      await api
        .get(`/api/notifications/${notificationId}`)
        .set(bearer(await tokenFor(app, context, 'CAREGIVER'))),
      403,
    );
    expectError(
      await api.get('/api/notifications?type=INVALIDO').set(admin),
      400,
    );
    expectError(await api.get('/api/notifications/999999').set(admin), 404);

    const fileResponse = await api
      .post('/api/files')
      .set(admin)
      .send({
        patientId,
        prescriptionId,
        medicationId,
        fileName: 'evidencia-e2e.pdf',
        fileUrl: 'http://localhost/e2e/evidencia.pdf',
        fileType: 'application/pdf',
      })
      .expect(201);
    const fileId = fileResponse.body.id as number;
    const fileList = await api
      .get(
        `/api/files?patientId=${patientId}&fileType=application/pdf&search=evidencia&page=1&limit=5`,
      )
      .set(admin)
      .expect(200);
    expect(fileList.body.data).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: fileId })]),
    );
    await api.get(`/api/files/${fileId}`).set(admin).expect(200);
    const updatedFile = await api
      .patch(`/api/files/${fileId}`)
      .set(admin)
      .send({ description: 'Metadatos actualizados E2E' })
      .expect(200);
    expect(updatedFile.body.description).toBe('Metadatos actualizados E2E');
    expectError(await api.get('/api/files?page=0&limit=101').set(admin), 400);
    expectError(await api.get('/api/files/999999').set(admin), 404);
    expectError(
      await api.post('/api/files').set(admin).send({
        patientId: 999999,
        fileName: 'inexistente.pdf',
        fileUrl: 'http://localhost/e2e/inexistente.pdf',
        fileType: 'application/pdf',
      }),
      400,
    );

    const auditResponse = await api
      .post('/api/audit-logs')
      .set(admin)
      .send({
        userId: context.users.ADMIN.id,
        module: 'e2e',
        action: 'COMPLETE_FLOW',
        entityName: 'Prescription',
        entityId: prescriptionId,
      })
      .expect(201);
    const auditId = auditResponse.body.id as number;
    const auditDetail = await api
      .get(`/api/audit-logs/${auditId}`)
      .set(admin)
      .expect(200);
    expect(auditDetail.body.action).toBe('COMPLETE_FLOW');
    const auditList = await api
      .get('/api/audit-logs?module=e2e&action=COMPLETE_FLOW&page=1&limit=10')
      .set(admin)
      .expect(200);
    expect(auditList.body.data).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: auditId })]),
    );
    expectError(
      await api.get('/api/audit-logs?page=0&limit=101').set(admin),
      400,
    );
    expectError(await api.get('/api/audit-logs/999999').set(admin), 404);
    expectError(
      await api.get('/api/audit-logs').set(bearer(patientToken)),
      403,
    );

    const dashboard = await api
      .get('/api/dashboard/admin?period=7d')
      .set(admin)
      .expect(200);
    expect(dashboard.body).toEqual(
      expect.objectContaining({
        users: expect.objectContaining({ total: expect.any(Number) }),
        prescriptions: expect.objectContaining({ total: expect.any(Number) }),
        medicalMeasurements: expect.objectContaining({
          total: expect.any(Number),
        }),
      }),
    );
    expect(dashboard.body.prescriptions.total).toBeGreaterThanOrEqual(1);
    expectError(
      await api.get('/api/dashboard/admin?period=365d').set(admin),
      400,
    );
    const patientDashboard = await api
      .get('/api/dashboard/patient/me?period=7d')
      .set(bearer(patientToken))
      .expect(200);
    expect(patientDashboard.body.patient.id).toBe(patientId);

    await api.delete(`/api/files/${fileId}`).set(admin).expect(204);
    await api
      .delete(`/api/notifications/${notificationId}`)
      .set(admin)
      .expect(204);
    await api
      .delete(`/api/medical-measurements/${measurementId}`)
      .set(admin)
      .expect(204);
    await api.delete(`/api/intakes/${intakeId}`).set(admin).expect(204);
    await api.delete(`/api/reminders/${reminderId}`).set(admin).expect(204);
    await api
      .delete(`/api/prescriptions/${prescriptionId}`)
      .set(admin)
      .expect(200);
    await api.delete(`/api/caregivers/${caregiverId}`).set(admin).expect(200);
    await api.delete(`/api/doctors/${doctorId}`).set(admin).expect(200);
    await api.delete(`/api/patients/${patientId}`).set(admin).expect(200);
  }, 120_000);
});
