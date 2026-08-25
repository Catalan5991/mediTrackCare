# Matriz de casos E2E

## Flujo clÃ­nico relacional

`test/04-complete-clinical-flow.e2e-spec.ts` agrega escenarios funcionales para Users, Patients, Caregivers, Prescriptions e items anidados, Reminders, Intakes, Medical Measurements, Notifications, Files, Audit Logs y ambos dashboards. Incluye duplicados, DTO y enums invÃ¡lidos, filtros, paginaciÃ³n, propiedad de notificaciones, transiciones de estado, relaciones inexistentes y eliminaciÃ³n inversa.

La matriz deriva de los decoradores de los controladores actuales. Todas las rutas incluyen el prefijo `/api`.

| ID             | Módulo               | Método                | Endpoint                          | Escenario                       | Esperado    |
| -------------- | -------------------- | --------------------- | --------------------------------- | ------------------------------- | ----------- |
| E2E-HEALTH-001 | Health               | GET                   | `/api`                            | Ruta pública                    | 200         |
| E2E-AUTH-001   | Auth                 | POST                  | `/api/auth/register`              | Datos válidos                   | 201 y token |
| E2E-AUTH-002   | Auth                 | POST                  | `/api/auth/register`              | Duplicado                       | 409         |
| E2E-AUTH-003   | Auth                 | POST                  | `/api/auth/login`                 | Credenciales válidas/inválidas  | 201/401     |
| E2E-AUTH-004   | Auth                 | GET                   | `/api/auth/profile`               | Bearer válido/ausente           | 200/401     |
| E2E-ROLE-001   | Roles                | POST/GET/PATCH/DELETE | `/api/roles[/:id]`                | ADMIN/PATIENT                   | éxito/403   |
| E2E-USER-001   | Users                | POST/GET/PATCH/DELETE | `/api/users[/:id]`                | JWT ausente/inválido            | 401         |
| E2E-PAT-001    | Patients             | POST/GET/PATCH/DELETE | `/api/patients[/:id]`             | JWT ausente/inválido            | 401         |
| E2E-CARE-001   | Caregivers           | POST/GET/PATCH/DELETE | `/api/caregivers[/:id]`           | JWT ausente/inválido            | 401         |
| E2E-MED-001    | Medications          | POST                  | `/api/medications`                | ADMIN, DTO válido/inválido      | 201/400     |
| E2E-MED-002    | Medications          | GET                   | `/api/medications[/:id]`          | DOCTOR/PATIENT                  | 200/403     |
| E2E-MED-003    | Medications          | PATCH/DELETE          | `/api/medications/:id`            | ADMIN y consulta posterior      | 200/404     |
| E2E-RX-001     | Prescriptions        | POST/GET/PATCH/DELETE | `/api/prescriptions[/:id]`        | JWT ausente/inválido            | 401         |
| E2E-RX-002     | Prescriptions        | PATCH                 | `/api/prescriptions/:id/cancel`   | JWT ausente/inválido            | 401         |
| E2E-REM-001    | Reminders            | POST/GET/PATCH/DELETE | `/api/reminders[/:id]`            | JWT ausente/inválido            | 401         |
| E2E-INT-001    | Intakes              | POST/GET/PATCH/DELETE | `/api/intakes[/:id]`              | JWT ausente/inválido            | 401         |
| E2E-MM-001     | Medical Measurements | POST/GET/PATCH/DELETE | `/api/medical-measurements[/:id]` | JWT ausente/inválido            | 401         |
| E2E-NOT-001    | Notifications        | POST/GET/PATCH/DELETE | `/api/notifications[/:id]`        | JWT ausente/inválido            | 401         |
| E2E-NOT-002    | Notifications        | PATCH                 | `/api/notifications/:id/read`     | JWT ausente/inválido            | 401         |
| E2E-NOT-003    | Notifications        | PATCH                 | `/api/notifications/:id/sent`     | JWT ausente/inválido            | 401         |
| E2E-FILE-001   | Files                | POST/GET/PATCH/DELETE | `/api/files[/:id]`                | Metadatos; JWT ausente/inválido | 401         |
| E2E-AUDIT-001  | Audit Logs           | POST/GET              | `/api/audit-logs[/:id]`           | JWT ausente/inválido            | 401         |
| E2E-DASH-001   | Dashboard            | GET                   | `/api/dashboard/admin`            | JWT ausente/inválido            | 401         |
| E2E-DASH-002   | Dashboard            | GET                   | `/api/dashboard/patient/me`       | JWT ausente/inválido            | 401         |

El contrato JWT se expande con `it.each` a 74 endpoints protegidos × 2 escenarios. La ejecución real final obtuvo 157 pruebas aprobadas de 157.
