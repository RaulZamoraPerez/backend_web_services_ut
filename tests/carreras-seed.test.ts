import request from 'supertest';
import app from '../src/app'; // Assuming app is exported from src/app.ts
import Carrera from '../src/models/Carrera';
import sequelize from '../src/config/database';

describe('Carreras Seed and API Tests', () => {
  
  beforeAll(async () => {
    await sequelize.authenticate();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('Database should contain 12 careers after seed', async () => {
    const count = await Carrera.count();
    expect(count).toBe(12);
  });

  test('Software career should have correct data', async () => {
    const software = await Carrera.findOne({ where: { nombre: 'TICS DESARROLLO DE SOFTWARE' } });
    
    let mapa = software?.mapa_curricular;
    if (typeof mapa === 'string') {
        mapa = JSON.parse(mapa);
    }

    expect(software).toBeDefined();
    expect(software?.nivel).toBe('Ingenieria');
    expect(mapa).toBeDefined();
    expect(Array.isArray(mapa)).toBe(true);
    expect(mapa[0].semester).toBe('Primero');
  });

  test('API /api/carreras should return all careers', async () => {
    const res = await request(app).get('/api/carreras');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(12);
  });

  test('API /api/carreras/:id should return details including mapa_curricular', async () => {
    const software = await Carrera.findOne({ where: { nombre: 'TICS DESARROLLO DE SOFTWARE' } });
    const res = await request(app).get(`/api/carreras/${software?.id}`);
    expect(res.status).toBe(200);
    expect(res.body.nombre).toBe('TICS DESARROLLO DE SOFTWARE');
    expect(res.body.mapa_curricular).toBeDefined();
  });

  test('Should have careers of different levels (Ingenieria, Licenciatura)', async () => {
    const ingenierias = await Carrera.count({ where: { nivel: 'Ingenieria' } });
    const licenciaturas = await Carrera.count({ where: { nivel: 'Licenciatura' } });
    
    expect(ingenierias).toBeGreaterThan(0);
    expect(licenciaturas).toBeGreaterThan(0);
  });
});
