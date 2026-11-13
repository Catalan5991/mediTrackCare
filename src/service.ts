import node from '@prisma/composer/node';
import { compute } from '@prisma/composer-prisma-cloud';

// This declaration requires a bundled dist/api.mjs build artifact.
// Complete Prisma 8 migration and Bun-compatible bundling before enabling deployment.
export default compute({
  name: 'api',
  deps: {},
  build: node({ module: import.meta.url, entry: '../dist/api.mjs' }),
});
