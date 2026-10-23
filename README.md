# MediTrackCare API

Backend de seguimiento de tratamientos médicos desarrollado con NestJS 11, Prisma 7 y PostgreSQL. Incluye autenticación JWT, autorización por roles, documentación Swagger y módulos para pacientes, médicos, cuidadores, medicamentos, recetas, recordatorios, tomas, mediciones, notificaciones, archivos, auditoría y tableros.

## Desarrollo

```bash
npm ci
npx prisma generate
npm run start:dev
```

Variables obligatorias:

- `DATABASE_URL`: conexión PostgreSQL.
- `JWT_SECRET`: secreto de firma de al menos 32 caracteres.
- `JWT_EXPIRES_IN_SECONDS`: vigencia del token; se recomienda `3600`.
- `PORT`: puerto HTTP; por defecto `3000`.

La API se publica bajo `/api`; Swagger está disponible en `/docs` y la comprobación pública de salud en `/api/health`.

## Pruebas

```bash
npm test -- --runInBand
npm run test:e2e
npm run test:e2e:full
```

Las pruebas E2E requieren `TEST_DATABASE_URL` y nunca utilizan la base de datos de desarrollo. Consulte [docs/E2E_TESTING.md](docs/E2E_TESTING.md) y [docs/E2E_TEST_RESULTS.md](docs/E2E_TEST_RESULTS.md).

## Producción local con Docker

```bash
cp .env.production.example .env.production
# Reemplace todos los secretos del archivo copiado.
docker compose up -d --build
docker compose ps
```

El inicio de producción aplica migraciones, ejecuta la semilla idempotente y levanta `dist/main`. PostgreSQL conserva la información en un volumen nombrado.

La semilla garantiza el catálogo `ADMIN`, `DOCTOR`, `CAREGIVER` y `PATIENT`, y crea el administrador indicado mediante `ADMIN_EMAIL` y `ADMIN_PASSWORD`. El registro público siempre asigna `PATIENT`; solo el administrador puede asignar otro rol. Para cargar registros académicos relacionados, use `SEED_DEMO_DATA=true` y una `DEMO_PASSWORD` de al menos 12 caracteres. No habilite datos demo en una instancia con información real.

## Railway

El repositorio incluye `railway.toml` y utiliza el mismo `Dockerfile`. Agregue PostgreSQL al proyecto y configure `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN_SECONDS`, `ADMIN_NAME`, `ADMIN_EMAIL` y `ADMIN_PASSWORD`. Railway inyecta `PORT` automáticamente.

La guía completa y la matriz de validación están en [docs/DESPLIEGUE.md](docs/DESPLIEGUE.md). El reporte académico se genera con:

```bash
python scripts/generate_deployment_report.py
```

## Recuperacion de contrasena

Configure `RESEND_API_KEY`, `RESEND_FROM` (remitente de un dominio verificado en Resend) y `PASSWORD_RESET_URL` en .env o en el despliegue. La URL apunta a la pagina de recuperacion del frontend.

Ejecute `npx prisma generate` y aplique la migracion con `npx prisma migrate deploy` antes de iniciar el backend.

- `POST /api/auth/forgot-password`: `{"email":"maria@example.com"}`.
- El frontend lee `token` del enlace y envia `POST /api/auth/reset-password`: `{"token":"<token-del-correo>","newPassword":"NuevaClave123"}`.

Ambos endpoints son publicos y devuelven HTTP 200 al completarse. La solicitud devuelve el mismo mensaje para cuentas inexistentes, inactivas o limitadas (una solicitud por cuenta cada 60 segundos). Los tokens vencen en 15 minutos, se almacenan como SHA-256 y se consumen atomicamente al cambiar la contrasena con bcrypt. Una nueva solicitud aceptada invalida el enlace anterior. Los errores de envio se registran sin exponer datos y revocan el token; el cliente mantiene la respuesta generica. Sin configuracion de correo se devuelve HTTP 503. Tokens invalidos, usados o vencidos devuelven HTTP 400.

La nueva contrasena admite al menos 6 caracteres y hasta 72 bytes UTF-8. Este flujo no revoca los JWT ya emitidos: siguen vigentes hasta su expiracion. Configure tambien limites por IP en el proxy de despliegue. Este repositorio de API no incluye una pantalla de frontend.

Referencia: [API de envio de Resend](https://resend.com/docs/api-reference/emails/send-email).
