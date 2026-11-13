# Prisma Compute deployment preparation

The GitHub repository is **already connected** to the Prisma project `meditrackcare`. Do not reconnect it.

The `.github/workflows/prisma-deploy.yml` workflow uses GitHub OIDC (`id-token: write`) and `prisma/cloud-deploy-action@v1`. The default branch deploys to production; other branches use preview stages.

## Not yet deployable

The current NestJS backend still depends on Prisma ORM 7.8.0, whereas the deploy action uses the repository's installed Prisma CLI and Compute requires Prisma 8. The deployment will fail until the migration is complete. Composer packages are also missing.

Before enabling production deployments:

1. Migrate Prisma ORM, Prisma Client, adapters, application repositories, and the lockfile to a compatible Prisma 8 release following the official upgrade guide.
2. Install `@prisma/composer` and `@prisma/composer-prisma-cloud`, and configure the `composer` section of `prisma.config.ts` with the Node build extension and Prisma Cloud state.
3. Provide a Bun-compatible, self-contained `dist/api.mjs` entry. Current `npm run build` runs `nest build` and does **not** produce that file.
4. Adapt NestJS startup to use `service.port()` rather than `process.env.PORT` and declare all required configuration and secrets in Composer.
5. Wire the **existing** Prisma Postgres database in the deployment project; do not create a replacement database or run destructive migrations.
6. Test the app locally and deploy this feature branch to a preview, confirming Swagger, JWT, CRUD endpoints, and PostgreSQL connectivity.
7. Merge into the default branch only after the preview is healthy, because that push deploys production.

The initial Composer files are a declaration scaffold, **not** a working deployment of the existing backend.
