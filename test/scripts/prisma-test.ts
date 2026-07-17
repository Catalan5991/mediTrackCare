import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { config } from 'dotenv';

config({ path: resolve('.env.test'), override: false, quiet: true });

const testDatabaseUrl = process.env.TEST_DATABASE_URL;
if (!testDatabaseUrl) {
  throw new Error(
    'TEST_DATABASE_URL es obligatoria; nunca se utiliza la DATABASE_URL de desarrollo.',
  );
}

const executable = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const result = spawnSync(executable, ['prisma', ...process.argv.slice(2)], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env: { ...process.env, NODE_ENV: 'test', DATABASE_URL: testDatabaseUrl },
});
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
