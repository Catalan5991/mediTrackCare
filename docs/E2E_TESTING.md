# Pruebas end-to-end de MediTrackCare

> Inventario actualizado: 77 handlers HTTP totales, 74 rutas protegidas y módulo Doctors con perfil personal y asignaciones Doctor–Patient.

## Objetivo y herramientas

La suite valida el contrato HTTP real de la API con NestJS, Jest, Supertest, Prisma y PostgreSQL. Usa la misma configuración de prefijo `api`, `ValidationPipe` (`whitelist`, `forbidNonWhitelisted`, `transform`) y filtro global que `main.ts`.

## Arquitectura

- `test/config`: configuración secuencial de Jest y reportes.
- `test/helpers`: creación/cierre de Nest, autenticación, respuestas y base de datos.
- `test/fixtures`: datos sintéticos sin información personal.
- `test/*.e2e-spec.ts`: health, Auth, contrato JWT y flujos CRUD/autorización.
- `test/scripts`: conversión del JSON real de Jest a Markdown.

## Base de datos de pruebas

La suite exige `TEST_DATABASE_URL` y la copia a `DATABASE_URL` antes de cargar Nest. Nunca acepta implícitamente la URL de desarrollo. La limpieza usa una transacción con `deleteMany` en orden de llaves foráneas. Prisma se desconecta al cerrar cada aplicación.

Preparación en PowerShell:

```powershell
Copy-Item .env.test.example .env.test.local
$env:TEST_DATABASE_URL='postgresql://postgres:postgres@localhost:5433/meditrackcare_e2e?schema=public'
npm run test:db:migrate
```

## Ejecución y reportes

```powershell
npm run test:e2e
npm run test:e2e:cov
npm run test:e2e:full
```

Los resultados se escriben en `test/results/html/e2e-report.html`, `test/results/junit/e2e-results.xml`, `test/results/e2e-results.json` y `coverage/lcov-report/index.html`. El último comando genera `docs/E2E_TEST_RESULTS.md`; nunca presenta como aprobada una prueba no ejecutada.

## Cobertura funcional

Se detectaron 77 handlers en total: 76 en controladores de módulos y el health raíz. Existen Auth, Roles, Users, Patients, Doctors, Caregivers, Medications, Prescriptions (sus items se reciben anidados), Reminders, Intakes, Medical Measurements, Notifications, Files, Audit Logs y Dashboard. La suite recorre las 74 rutas protegidas para JWT ausente/inválido y valida flujos CRUD relacionales.

No existe controlador independiente de Prescription Items ni módulo Reports. Files guarda metadatos (`fileName`, `fileUrl`, `fileType`): no hay endpoints multipart, descarga ni almacenamiento físico que probar. Los usuarios de cuatro roles se crean desde el helper de pruebas.

## Autenticación, roles y excepciones

Los helpers extraen `accessToken`, `access_token` o `token`, producen Bearer headers y cachean tokens por rol. Las pruebas comprueban 401 sin token/token inválido, 403 por rol o permiso, 400 de DTO/ParseIntPipe, 404 tras eliminación y 409 en registro duplicado. La forma común esperada contiene `statusCode`, `message`, `timestamp` y `path`.

## Flujo completo y límites actuales

El flujo integral cubre el perfil Doctor, asociaciones Doctor–Patient, prescripciones e items. El Doctor consulta sus asignaciones mediante `/api/doctors/me/patients`. No se simula un 500 destructivo.

## Evidencias escolares recomendadas

Conservar capturas del reporte HTML, resumen de consola, cobertura, artifact de CI y casos de la matriz. Registrar fecha, commit, URL de base anonimizada y versión de Node/PostgreSQL. No versionar resultados variables ni secretos.

## Problemas encontrados y correcciones

- El health raíz heredaba el guard JWT global: se marcó público.
- `main.ts` y las pruebas podían divergir: se extrajo `configureApp`.
- No existía protección contra usar la base de desarrollo: ahora `TEST_DATABASE_URL` es obligatoria.
- Faltaban ejecución secuencial, reportes, scripts Windows y resumen Markdown: fueron agregados.
