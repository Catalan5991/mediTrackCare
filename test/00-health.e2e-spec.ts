import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { createTestApp } from './helpers/app-test.helper';

describe('Estado de la API (e2e)', () => {
  let app: INestApplication;
  beforeAll(async () => {
    app = await createTestApp();
  });
  afterAll(async () => {
    await app.close();
  });

  it('GET /api es una ruta pública', async () => {
    const response = await request(app.getHttpServer()).get('/api').expect(200);
    expect(response.text).toBe('Hello World!');
  });
});
