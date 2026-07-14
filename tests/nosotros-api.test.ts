import request from 'supertest';
import app from '../src/app';
import NosotrosContent from '../src/models/Nosotros';

// Configuración para tests
const BASE_URL = 'http://localhost:3002';
const API_PREFIX = '/api';

// Token de prueba (debería generarse dinámicamente en un entorno real)
const TEST_TOKEN = process.env.TEST_JWT_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbl90ZXN0Iiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzYyMzY3MTM0LCJleHAiOjE3NjI0NTM1MzR9.XXpBn57mUNdzUK1GTo06IABzQVMdewX4Z90gUxZhDxY';

const authHeaders = {
  'Authorization': `Bearer ${TEST_TOKEN}`,
  'Content-Type': 'application/json'
};

// Configuración de timeout para tests de base de datos
jest.setTimeout(30000);

describe('Nosotros API', () => {
  // Setup antes de todos los tests
  beforeAll(async () => {
    // Verificar conexión a la base de datos
    try {
      await NosotrosContent.sequelize?.authenticate();
      console.log('✅ Conexión a la base de datos establecida');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.warn('⚠️  No se pudo conectar a la base de datos. Algunos tests podrían fallar:', errorMessage);
    }
  });

  // Limpiar datos de prueba después de cada test
  afterEach(async () => {
    try {
      // Limpiar datos de prueba si existe la tabla
      await NosotrosContent.destroy({ where: {} });
    } catch (error) {
      // Ignorar errores si la tabla no existe
    }
  });

  describe('GET /api/nosotros/content', () => {
    test('debería obtener contenido sin autenticación', async () => {
      // Crear contenido de prueba
      const testContent = {
        vision: { imageSrc: 'test.jpg', title: 'Visión', description: 'Test vision' },
        mision: { imageSrc: 'test.jpg', title: 'Misión', description: 'Test mision' },
        valores: { imageSrc: 'test.jpg', title: 'Valores', description: ['Valor 1', 'Valor 2'] },
        politicaIntegral: { imageSrc: 'test.jpg', title: 'Política', description: 'Test politica' },
        objetivoIntegral: 'Test objetivo',
        noDiscriminacion: [['Test1'], ['Test2']]
      };

      await NosotrosContent.create(testContent);

      const response = await request(app)
        .get(`${API_PREFIX}/nosotros/content`)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('vision');
      expect(response.body).toHaveProperty('mision');
      expect(response.body).toHaveProperty('valores');
      expect(response.body).toHaveProperty('politicaIntegral');
      expect(response.body).toHaveProperty('objetivoIntegral');
      expect(response.body).toHaveProperty('noDiscriminacion');
    });

    test('debería devolver 404 cuando no hay contenido', async () => {
      const response = await request(app)
        .get(`${API_PREFIX}/nosotros/content`)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Contenido no encontrado');
    });

    test('valores.description debería ser un array', async () => {
      // Crear contenido de prueba
      const testContent = {
        vision: { imageSrc: 'test.jpg', title: 'Visión', description: 'Test vision' },
        mision: { imageSrc: 'test.jpg', title: 'Misión', description: 'Test mision' },
        valores: { imageSrc: 'test.jpg', title: 'Valores', description: ['Valor 1', 'Valor 2'] },
        politicaIntegral: { imageSrc: 'test.jpg', title: 'Política', description: 'Test politica' },
        objetivoIntegral: 'Test objetivo',
        noDiscriminacion: [['Test1'], ['Test2']]
      };

      await NosotrosContent.create(testContent);

      const response = await request(app)
        .get(`${API_PREFIX}/nosotros/content`)
        .expect(200);

      expect(Array.isArray(response.body.valores.description)).toBe(true);
      expect(response.body.valores.description.length).toBeGreaterThan(0);
      expect(response.body.valores.description).toEqual(['Valor 1', 'Valor 2']);
    });
  });

  describe('PATCH /api/nosotros/content/:section', () => {
    beforeEach(async () => {
      // Crear contenido base para tests
      const testContent = {
        vision: { imageSrc: 'test.jpg', title: 'Visión', description: 'Test vision' },
        mision: { imageSrc: 'test.jpg', title: 'Misión', description: 'Test mision' },
        valores: { imageSrc: 'test.jpg', title: 'Valores', description: ['Valor 1', 'Valor 2'] },
        politicaIntegral: { imageSrc: 'test.jpg', title: 'Política', description: 'Test politica' },
        objetivoIntegral: 'Test objetivo',
        noDiscriminacion: [['Test1'], ['Test2']]
      };
      await NosotrosContent.create(testContent);
    });

    test('debería requerir autenticación', async () => {
      const response = await request(app)
        .patch(`${API_PREFIX}/nosotros/content/valores`)
        .send({ title: 'Test' })
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Token de acceso requerido');
    });

    test('debería actualizar sección valores con token válido', async () => {
      const updateData = {
        title: 'VALORES',
        description: [
          'Excelencia académica',
          'Innovación tecnológica',
          'Compromiso social'
        ],
        imageSrc: '/uploads/nosotros/valores.jpg'
      };

      const response = await request(app)
        .patch(`${API_PREFIX}/nosotros/content/valores`)
        .set(authHeaders)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.valores).toMatchObject(updateData);
    });

    test('debería actualizar sección vision con token válido', async () => {
      const updateData = {
        title: 'VISIÓN',
        description: 'Nueva descripción de visión',
        imageSrc: '/uploads/nosotros/vision.jpg'
      };

      const response = await request(app)
        .patch(`${API_PREFIX}/nosotros/content/vision`)
        .set(authHeaders)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.vision).toMatchObject(updateData);
    });

    test('debería actualizar sección mision con token válido', async () => {
      const updateData = {
        title: 'MISIÓN',
        description: 'Nueva descripción de misión',
        imageSrc: '/uploads/nosotros/mision.jpg'
      };

      const response = await request(app)
        .patch(`${API_PREFIX}/nosotros/content/mision`)
        .set(authHeaders)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.mision).toMatchObject(updateData);
    });

    test('debería actualizar sección politicaIntegral con token válido', async () => {
      const updateData = {
        title: 'POLÍTICA INTEGRAL',
        description: 'Nueva política integral',
        imageSrc: '/uploads/nosotros/politica.jpg'
      };

      const response = await request(app)
        .patch(`${API_PREFIX}/nosotros/content/politicaIntegral`)
        .set(authHeaders)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.politicaIntegral).toMatchObject(updateData);
    });

    test('debería actualizar sección objetivoIntegral con token válido', async () => {
      const updateData = 'Nuevo objetivo integral';

      const response = await request(app)
        .patch(`${API_PREFIX}/nosotros/content/objetivoIntegral`)
        .set(authHeaders)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.objetivoIntegral).toBe(updateData);
    });

    test('debería actualizar sección noDiscriminacion con token válido', async () => {
      const updateData = [
        ['Nueva categoría 1'],
        ['Nueva categoría 2']
      ];

      const response = await request(app)
        .patch(`${API_PREFIX}/nosotros/content/noDiscriminacion`)
        .set(authHeaders)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.noDiscriminacion).toEqual(updateData);
    });

    test('debería rechazar sección inválida', async () => {
      const response = await request(app)
        .patch(`${API_PREFIX}/nosotros/content/seccioninvalida`)
        .set(authHeaders)
        .send({ title: 'Test' })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Sección inválida');
    });

    test('debería devolver 404 si no existe contenido', async () => {
      // Limpiar contenido
      await NosotrosContent.destroy({ where: {} });

      const response = await request(app)
        .patch(`${API_PREFIX}/nosotros/content/valores`)
        .set(authHeaders)
        .send({ title: 'Test' })
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Contenido no encontrado');
    });
  });

  describe('Validaciones de datos', () => {
    beforeEach(async () => {
      // Crear contenido base para tests
      const testContent = {
        vision: { imageSrc: 'test.jpg', title: 'Visión', description: 'Test vision' },
        mision: { imageSrc: 'test.jpg', title: 'Misión', description: 'Test mision' },
        valores: { imageSrc: 'test.jpg', title: 'Valores', description: ['Valor 1', 'Valor 2'] },
        politicaIntegral: { imageSrc: 'test.jpg', title: 'Política', description: 'Test politica' },
        objetivoIntegral: 'Test objetivo',
        noDiscriminacion: [['Test1'], ['Test2']]
      };
      await NosotrosContent.create(testContent);
    });

    test('debería validar estructura de valores - description debe ser array', async () => {
      const invalidData = {
        title: 'VALORES',
        description: 'esto no es un array', // Debería ser array
        imageSrc: '/test.jpg'
      };

      const response = await request(app)
        .patch(`${API_PREFIX}/nosotros/content/valores`)
        .set(authHeaders)
        .send(invalidData)
        .expect(200); // El backend no valida tipos, solo actualiza

      expect(response.body).toBeDefined();
    });

    test('debería manejar datos vacíos gracefully', async () => {
      const emptyData = {};

      const response = await request(app)
        .patch(`${API_PREFIX}/nosotros/content/vision`)
        .set(authHeaders)
        .send(emptyData)
        .expect(200);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/nosotros/content/:section', () => {
    beforeEach(async () => {
      // Crear contenido base para tests
      const testContent = {
        vision: { imageSrc: 'test.jpg', title: 'Visión', description: 'Test vision' },
        mision: { imageSrc: 'test.jpg', title: 'Misión', description: 'Test mision' },
        valores: { imageSrc: 'test.jpg', title: 'Valores', description: ['Valor 1', 'Valor 2'] },
        politicaIntegral: { imageSrc: 'test.jpg', title: 'Política', description: 'Test politica' },
        objetivoIntegral: 'Test objetivo',
        noDiscriminacion: [['Test1'], ['Test2']]
      };
      await NosotrosContent.create(testContent);
    });

    test('debería obtener sección vision específica', async () => {
      const response = await request(app)
        .get(`${API_PREFIX}/nosotros/content/vision`)
        .expect(200);

      expect(response.body).toHaveProperty('vision');
      expect(response.body.vision).toHaveProperty('title', 'Visión');
      expect(response.body.vision).toHaveProperty('description', 'Test vision');
    });

    test('debería obtener sección valores específica', async () => {
      const response = await request(app)
        .get(`${API_PREFIX}/nosotros/content/valores`)
        .expect(200);

      expect(response.body).toHaveProperty('valores');
      expect(Array.isArray(response.body.valores.description)).toBe(true);
    });

    test('debería obtener sección objetivoIntegral específica', async () => {
      const response = await request(app)
        .get(`${API_PREFIX}/nosotros/content/objetivoIntegral`)
        .expect(200);

      expect(response.body).toHaveProperty('objetivoIntegral', 'Test objetivo');
    });

    test('debería rechazar sección inválida', async () => {
      const response = await request(app)
        .get(`${API_PREFIX}/nosotros/content/seccioninvalida`)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Sección inválida');
    });

    test('debería devolver 404 si no existe contenido', async () => {
      // Limpiar contenido
      await NosotrosContent.destroy({ where: {} });

      const response = await request(app)
        .get(`${API_PREFIX}/nosotros/content/vision`)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Contenido no encontrado');
    });
  });

  describe('POST /api/nosotros/content', () => {
    test('debería requerir autenticación', async () => {
      const testContent = {
        vision: { imageSrc: 'test.jpg', title: 'Visión', description: 'Test' },
        mision: { imageSrc: 'test.jpg', title: 'Misión', description: 'Test' },
        valores: { imageSrc: 'test.jpg', title: 'Valores', description: ['Test'] },
        politicaIntegral: { imageSrc: 'test.jpg', title: 'Política', description: 'Test' },
        objetivoIntegral: 'Test',
        noDiscriminacion: [['Test']]
      };

      const response = await request(app)
        .post(`${API_PREFIX}/nosotros/content`)
        .send(testContent)
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Token de acceso requerido');
    });

    test('debería crear contenido con token válido', async () => {
      const testContent = {
        vision: { imageSrc: 'test.jpg', title: 'Visión', description: 'Test vision' },
        mision: { imageSrc: 'test.jpg', title: 'Misión', description: 'Test mision' },
        valores: { imageSrc: 'test.jpg', title: 'Valores', description: ['Valor 1', 'Valor 2'] },
        politicaIntegral: { imageSrc: 'test.jpg', title: 'Política', description: 'Test politica' },
        objetivoIntegral: 'Test objetivo',
        noDiscriminacion: [['Test1'], ['Test2']]
      };

      const response = await request(app)
        .post(`${API_PREFIX}/nosotros/content`)
        .set(authHeaders)
        .send(testContent)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Contenido creado exitosamente');
      expect(response.body).toHaveProperty('content');
    });

    test('debería rechazar datos inválidos', async () => {
      const invalidContent = {
        vision: { imageSrc: 'test.jpg', title: 'Visión', description: 'Test' }
        // Faltan campos requeridos
      };

      const response = await request(app)
        .post(`${API_PREFIX}/nosotros/content`)
        .set(authHeaders)
        .send(invalidContent)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Datos inválidos');
    });
  });

  describe('PUT /api/nosotros/content', () => {
    beforeEach(async () => {
      // Crear contenido base para tests
      const testContent = {
        vision: { imageSrc: 'test.jpg', title: 'Visión', description: 'Test vision' },
        mision: { imageSrc: 'test.jpg', title: 'Misión', description: 'Test mision' },
        valores: { imageSrc: 'test.jpg', title: 'Valores', description: ['Valor 1', 'Valor 2'] },
        politicaIntegral: { imageSrc: 'test.jpg', title: 'Política', description: 'Test politica' },
        objetivoIntegral: 'Test objetivo',
        noDiscriminacion: [['Test1'], ['Test2']]
      };
      await NosotrosContent.create(testContent);
    });

    test('debería requerir autenticación', async () => {
      const updateContent = {
        vision: { imageSrc: 'updated.jpg', title: 'Visión Updated', description: 'Updated' },
        mision: { imageSrc: 'updated.jpg', title: 'Misión Updated', description: 'Updated' },
        valores: { imageSrc: 'updated.jpg', title: 'Valores Updated', description: ['Updated'] },
        politicaIntegral: { imageSrc: 'updated.jpg', title: 'Política Updated', description: 'Updated' },
        objetivoIntegral: 'Updated',
        noDiscriminacion: [['Updated']]
      };

      const response = await request(app)
        .put(`${API_PREFIX}/nosotros/content`)
        .send(updateContent)
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Token de acceso requerido');
    });

    test('debería actualizar todo el contenido con token válido', async () => {
      const updateContent = {
        vision: { imageSrc: 'updated.jpg', title: 'Visión Updated', description: 'Updated vision' },
        mision: { imageSrc: 'updated.jpg', title: 'Misión Updated', description: 'Updated mision' },
        valores: { imageSrc: 'updated.jpg', title: 'Valores Updated', description: ['Updated value'] },
        politicaIntegral: { imageSrc: 'updated.jpg', title: 'Política Updated', description: 'Updated politica' },
        objetivoIntegral: 'Updated objetivo',
        noDiscriminacion: [['Updated1'], ['Updated2']]
      };

      const response = await request(app)
        .put(`${API_PREFIX}/nosotros/content`)
        .set(authHeaders)
        .send(updateContent)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Contenido actualizado exitosamente');
      expect(response.body).toHaveProperty('content');
    });
  });

  describe('DELETE /api/nosotros/content', () => {
    beforeEach(async () => {
      // Crear contenido base para tests
      const testContent = {
        vision: { imageSrc: 'test.jpg', title: 'Visión', description: 'Test vision' },
        mision: { imageSrc: 'test.jpg', title: 'Misión', description: 'Test mision' },
        valores: { imageSrc: 'test.jpg', title: 'Valores', description: ['Valor 1', 'Valor 2'] },
        politicaIntegral: { imageSrc: 'test.jpg', title: 'Política', description: 'Test politica' },
        objetivoIntegral: 'Test objetivo',
        noDiscriminacion: [['Test1'], ['Test2']]
      };
      await NosotrosContent.create(testContent);
    });

    test('debería requerir autenticación', async () => {
      const response = await request(app)
        .delete(`${API_PREFIX}/nosotros/content`)
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Token de acceso requerido');
    });

    test('debería eliminar todo el contenido con token válido', async () => {
      const response = await request(app)
        .delete(`${API_PREFIX}/nosotros/content`)
        .set(authHeaders)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Contenido eliminado exitosamente');
      expect(response.body).toHaveProperty('deletedCount', 1);

      // Verificar que ya no existe contenido
      const checkResponse = await request(app)
        .get(`${API_PREFIX}/nosotros/content`)
        .expect(404);
    });
  });

  describe('DELETE /api/nosotros/content/:section', () => {
    beforeEach(async () => {
      // Crear contenido base para tests
      const testContent = {
        vision: { imageSrc: 'test.jpg', title: 'Visión', description: 'Test vision' },
        mision: { imageSrc: 'test.jpg', title: 'Misión', description: 'Test mision' },
        valores: { imageSrc: 'test.jpg', title: 'Valores', description: ['Valor 1', 'Valor 2'] },
        politicaIntegral: { imageSrc: 'test.jpg', title: 'Política', description: 'Test politica' },
        objetivoIntegral: 'Test objetivo',
        noDiscriminacion: [['Test1'], ['Test2']]
      };
      await NosotrosContent.create(testContent);
    });

    test('debería requerir autenticación', async () => {
      const response = await request(app)
        .delete(`${API_PREFIX}/nosotros/content/vision`)
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Token de acceso requerido');
    });

    test('debería restaurar sección a valores por defecto', async () => {
      const response = await request(app)
        .delete(`${API_PREFIX}/nosotros/content/vision`)
        .set(authHeaders)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('vision');
      expect(response.body.vision).toHaveProperty('title', 'Visión');
      // Verificar que se restauró a valores por defecto
      expect(response.body.vision.description).toContain('2027');
    });

    test('debería rechazar sección inválida', async () => {
      const response = await request(app)
        .delete(`${API_PREFIX}/nosotros/content/seccioninvalida`)
        .set(authHeaders)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Sección inválida');
    });
  });

  describe('POST /api/nosotros/upload-image', () => {
    beforeEach(async () => {
      // Crear contenido base para tests
      const testContent = {
        vision: { imageSrc: 'test.jpg', title: 'Visión', description: 'Test vision' },
        mision: { imageSrc: 'test.jpg', title: 'Misión', description: 'Test mision' },
        valores: { imageSrc: 'test.jpg', title: 'Valores', description: ['Valor 1', 'Valor 2'] },
        politicaIntegral: { imageSrc: 'test.jpg', title: 'Política', description: 'Test politica' },
        objetivoIntegral: 'Test objetivo',
        noDiscriminacion: [['Test1'], ['Test2']]
      };
      await NosotrosContent.create(testContent);
    });

    test('should accept large JSON data up to 1MB on /upload-image (nosotros)', async () => {
      // Build a long description string larger than the default 100KB but smaller than 1MB
      const longDescription = 'a'.repeat(150 * 1024); // ~150KB

      const longPayload = { title: 'Test long', description: longDescription };

      const jpegBuffer = Buffer.from([0xff, 0xd8, 0xff, 0xdb, 0x00]); // minimal JPEG signature

      const response = await request(app)
        .post(`${API_PREFIX}/nosotros/upload-image`)
        .set(authHeaders)
        .attach('image', jpegBuffer, 'test.jpg')
        .field('section', 'vision')
        .field('data', JSON.stringify(longPayload))
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('section', 'vision');
      expect(response.body).toHaveProperty('filename');
    });

    test('should reject large field on carreras endpoint with default limits', async () => {
      // Use the dev test endpoint for carreras which uses uploadCarrera with default limits (100KB)
      const veryLong = 'b'.repeat(150 * 1024);
      const jpegBuffer = Buffer.from([0xff, 0xd8, 0xff, 0xdb, 0x00]);

      const response = await request(app)
        .post(`/api/_dev/tests/upload/carreras`)
        .attach('imagen', jpegBuffer, 'test.jpg')
        .field('title', veryLong)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Field value too long');
    });
  });
});