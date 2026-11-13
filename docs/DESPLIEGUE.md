# Despliegue de MediTrackCare

## Servidor local Ubuntu con Docker

1. Instalar Docker Engine y el complemento Compose en Ubuntu.
2. Clonar el repositorio y entrar en su directorio.
3. Copiar `.env.production.example` como `.env.production` y reemplazar todos los secretos.
4. Ejecutar `docker compose up -d --build`.
5. Comprobar `docker compose ps`, `docker compose logs api` y `curl http://localhost:3000/api/health`.
6. Abrir Swagger en `http://IP_DEL_SERVIDOR:3000/docs`.

La API espera a PostgreSQL, aplica las migraciones de Prisma, ejecuta una semilla idempotente y arranca `dist/main.js`. El volumen `meditrackcare_postgres` conserva la información aunque se recreen los contenedores.

## Railway (VPS/servicio en la nube)

1. Crear un proyecto desde el repositorio y agregar PostgreSQL.
2. Definir `DATABASE_URL` con la referencia que Railway genera para PostgreSQL.
3. Definir `JWT_SECRET`, `JWT_EXPIRES_IN_SECONDS`, `ADMIN_NAME`, `ADMIN_EMAIL` y `ADMIN_PASSWORD`. El administrador inicial se crea o actualiza durante cada despliegue; estas variables son obligatorias en producción.
4. Mantener `SEED_DEMO_DATA=false`. Solo para una instancia académica sin datos reales puede habilitarse junto con `DEMO_PASSWORD`.
5. Exponer el dominio público del servicio. Railway proporciona `PORT`; no debe fijarse manualmente.
6. Verificar `https://DOMINIO/api/health` y `https://DOMINIO/docs`.

## Catálogo de roles y datos iniciales

La API reconoce exclusivamente `ADMIN`, `DOCTOR`, `CAREGIVER` y `PATIENT`. Son los mismos valores usados por los DTO, la tabla `roles`, los tokens JWT, los decoradores y la matriz central de permisos. La semilla crea los cuatro roles antes de crear usuarios; la administración de usuarios nunca genera roles implícitamente.

El registro público asigna siempre `PATIENT`. Solo un usuario con `MANAGE_USERS` —por defecto, `ADMIN`— puede crear o cambiar usuarios con otro rol. Si un rol se desactiva, sus usuarios dejan de autenticarse y sus tokens vigentes son rechazados.

Fuera de producción, los datos demo se habilitan si `SEED_DEMO_DATA` no se define. La carga crea un doctor, un cuidador y un paciente, además de perfiles y registros relacionados de medicamento, receta, recordatorio, toma, medición, notificación, archivo y auditoría. En producción está deshabilitada por defecto y debe activarse explícitamente.

`railway.toml` selecciona el Dockerfile, declara el endpoint de salud y configura reinicios por error. El comando de inicio aplica migraciones y datos iniciales antes de levantar la API.

## Pruebas funcionales mínimas por instancia

Ejecutar la misma secuencia contra la IP local y contra el dominio de Railway:

1. `GET /api/health`: debe responder 200 y `status: ok`.
2. `POST /api/auth/login`: debe responder con un token ante credenciales válidas y 401 ante credenciales inválidas.
3. `GET /api/auth/profile` con Bearer token: debe responder 200; sin token, 401.
4. Probar desde Swagger los CRUD implementados para roles, usuarios, pacientes, médicos, cuidadores, medicamentos, recetas, recordatorios, tomas, mediciones, notificaciones, archivos y bitácora.
5. Registrar fecha, URL, petición, respuesta, estado HTTP, resultado y evidencia visual en el reporte.

No se deben publicar contraseñas, JWT ni cadenas de conexión en capturas o documentos.
