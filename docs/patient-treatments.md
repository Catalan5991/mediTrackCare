# Registro de tratamientos personales y recetas externas

Este módulo mantiene separados los tratamientos de seguimiento de las recetas emitidas por médicos verificados. Los registros **SELF_REPORTED** y **EXTERNAL_PRESCRIPTION** son datos capturados por el usuario y **no equivalen** a una prescripción clínica verificada.

## Endpoints (todos requieren JWT)

- `POST /api/patient-treatments` — paciente propietario, cuidador autorizado con `canManageReminders` o administrador; crea un registro de seguimiento.
- `GET /api/patient-treatments?patientId=1` — consulta los últimos 100 tratamientos de pacientes autorizados.
- `GET /api/patient-treatments/:id` — consulta segura por paciente.
- `PATCH /api/patient-treatments/:id` — edita información o estado, sin permitir reasignar paciente, medicamento ni origen.
- `POST /api/patient-treatments/:id/intakes` — confirma u omite una toma manual con permiso `canTrack`.
- `GET /api/patient-treatments/:id/intakes` — consulta hasta 100 tomas manuales.

### Ejemplo: tratamiento personal

```json
{
  "patientId": 1,
  "medicationId": 2,
  "origin": "SELF_REPORTED",
  "notes": "Seguimiento personal del medicamento indicado previamente",
  "scheduledTimes": []
}
```

### Ejemplo: transcripción de receta externa

```json
{
  "patientId": 1,
  "medicationId": 2,
  "origin": "EXTERNAL_PRESCRIPTION",
  "externalPrescriberName": "Médico externo",
  "externalPrescriptionDate": "2026-10-20",
  "dose": "1 tableta",
  "frequency": "Cada 12 horas",
  "startDate": "2026-10-20",
  "endDate": "2026-10-27",
  "scheduledTimes": ["08:00", "20:00"],
  "daysOfWeek": []
}
```

### Registrar toma

```json
{ "status": "TAKEN", "takenAt": "2026-10-26T12:30:00.000Z" }
```

## Límites actuales

- Los horarios de tratamientos personales se guardan, pero **todavía no generan recordatorios automáticos ni ocurrencias programadas**; el motor actual depende de `PrescriptionItem`. Las tomas de este módulo son manuales.
- Estos registros todavía no se incluyen en el dashboard actual ni en `/patients/:id/agenda`. La app móvil debe consultar los nuevos endpoints.
- Las recetas médicas registradas por médicos verificados siguen utilizando `/prescriptions` sin cambios.
- El módulo de archivos/evidencias existe pero todavía no hay un vínculo directo entre `File` y `PatientTreatment`. Adjuntar PDF/fotografía de una receta externa es una mejora futura.
- Para registrar medicamentos nuevos en el catálogo global se requiere ADMIN. No se modificaron permisos de `POST /medications`.

## Preparación local

```bash
npm ci
npx prisma validate
npx prisma migrate dev
npx prisma generate
npm run build
```

En entornos compartidos o producción, validar la migración previamente y usar `npx prisma migrate deploy`; nunca ejecutar `migrate reset` en datos reales.

## GitFlow
Rama: `feature/backend-patient-treatments`; abrir PR a `development` tras pruebas. No se modifica `main` ni `development`.
