import request from 'supertest';
import app from '../src/app';
import Carrera from '../src/models/Carrera';
import { connectDatabase } from '../src/config/database';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';

let authToken: string;
let createdCarreraId: number;

beforeAll(async () => {
  await connectDatabase();
  const secret = process.env.JWT_SECRET || 'test-jwt-secret';
  authToken = jwt.sign({ id: 1, username: 'admin', role: 'admin' }, secret);
});

afterAll(async () => {
  if (createdCarreraId) {
    await Carrera.destroy({ where: { id: createdCarreraId } });
  }
});

describe('Gestión de Carreras (CRUD)', () => {
  
  test('POST /api/carreras - Crear carrera con imagen de portada', async () => {
    // Crear un archivo dummy para la prueba
    const dummyImagePath = path.join(__dirname, 'dummy_image.jpg');
    fs.writeFileSync(dummyImagePath, 'dummy content');

    const response = await request(app)
      .post('/api/carreras')
      .set('Authorization', `Bearer ${authToken}`)
      .field('nombre', 'Ingeniería de Prueba')
      .field('siglas', 'IDP')
      .field('nivel', 'Ingenieria')
      .field('duracion', '10 cuatrimestres')
      .field('objetivo', 'Objetivo de prueba')
      .field('perfil_ingreso', 'Perfil ingreso prueba')
      .field('perfil_egreso', 'Perfil egreso prueba')
      .field('campo_laboral', 'Campo laboral prueba')
      .field('orden', 99)
      .field('activo', true)
      .attach('imagen', dummyImagePath)
      .attach('imagen_portada', dummyImagePath);

    // Limpiar archivo dummy
    fs.unlinkSync(dummyImagePath);

    expect(response.status).toBe(201); // O 201
    expect(response.body).toHaveProperty('id');
    expect(response.body.nombre).toBe('Ingeniería de Prueba');
    expect(response.body).toHaveProperty('imagen_portada');
    expect(response.body.imagen_portada).toContain('portadas/');
    
    createdCarreraId = response.body.id;
  });

  test('PUT /api/carreras/:id - Actualizar carrera e imagen de portada', async () => {
    if (!createdCarreraId) return;

    const dummyImagePath = path.join(__dirname, 'dummy_portada_update.jpg');
    fs.writeFileSync(dummyImagePath, 'dummy content update');

    const response = await request(app)
      .put(`/api/carreras/${createdCarreraId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .field('nombre', 'Ingeniería de Prueba Actualizada')
      .attach('imagen_portada', dummyImagePath);

    fs.unlinkSync(dummyImagePath);

    expect(response.status).toBe(200);
    expect(response.body.nombre).toBe('Ingeniería de Prueba Actualizada');
    expect(response.body.imagen_portada).toContain('portadas/');
    // Verificar que cambió (aunque el nombre aleatorio lo asegura)
  });

  test('GET /api/carreras/:id - Verificar campos actualizados', async () => {
    if (!createdCarreraId) return;

    const response = await request(app)
      .get(`/api/carreras/${createdCarreraId}`)
      .expect(200);

    expect(response.body.nombre).toBe('Ingeniería de Prueba Actualizada');
    expect(response.body).toHaveProperty('imagen_portada');
    expect(response.body.imagen_portada).not.toBeNull();
  });

  test('GET /api/carreras - Verificar que imagen_portada se incluye en la lista', async () => {
    if (!createdCarreraId) return;

    const response = await request(app)
      .get('/api/carreras')
      .expect(200);

    const carrera = response.body.find((c: any) => c.id === createdCarreraId);
    expect(carrera).toBeDefined();
    expect(carrera).toHaveProperty('imagen_portada');
    expect(carrera.imagen_portada).not.toBeNull();
  });

  test('DELETE /api/carreras/:id - Eliminar carrera', async () => {
    if (!createdCarreraId) return;

    const response = await request(app)
      .delete(`/api/carreras/${createdCarreraId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    // Verificar que ya no existe
    await request(app)
      .get(`/api/carreras/${createdCarreraId}`)
      .expect(404);
      
    createdCarreraId = 0; // Reset
  });
});
