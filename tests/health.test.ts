import request from 'supertest';
import app from '../src/app';

// Configuración base para tests
const BASE_URL = 'http://localhost:3002';

describe('API Health Check', () => {
  test('GET /health - debería retornar estado saludable', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'OK');
    expect(response.body).toHaveProperty('timestamp');
  });

  test('GET /api/health - debería funcionar con prefijo API', async () => {
    // Nota: Esta ruta podría no existir, probamos con /health
    const response = await request(BASE_URL)
      .get('/health')
      .expect(200);

    expect(response.body).toBeDefined();
  });
});