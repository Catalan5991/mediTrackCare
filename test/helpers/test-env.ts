import { resolve } from 'node:path';
import { config } from 'dotenv';

config({ path: resolve('.env.test'), override: false, quiet: true });

const testDatabaseUrl = process.env.TEST_DATABASE_URL;

if (!testDatabaseUrl) {
  throw new Error(
    'TEST_DATABASE_URL es obligatoria. Las pruebas e2e no usan DATABASE_URL para proteger los datos de desarrollo.',
  );
}

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = testDatabaseUrl;
process.env.JWT_SECRET ??= 'e2e-only-secret-at-least-32-characters';
process.env.JWT_EXPIRES_IN ??= '1h';
