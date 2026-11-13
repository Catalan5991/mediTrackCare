import { module } from '@prisma/composer';
import apiService from './src/service.ts';

// The module name matches the already-connected Prisma project.
// Do not provision another database; reuse the existing Prisma Postgres instance.
export default module('meditrackcare', ({ provision }) => {
  provision(apiService);
});
