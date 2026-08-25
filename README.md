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
