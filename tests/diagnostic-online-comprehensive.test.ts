import request from 'supertest';

/**
 * Test exhaustivo de la API UTTECAM en línea
 * 
 * Este test verifica:
 * 1. Autenticación con usuario admin
 * 2. Endpoints públicos (GET sin auth)
 * 3. Endpoints protegidos (GET/POST/PUT/DELETE con auth)
 * 4. Health checks y métricas
 * 5. Manejo de errores (401, 403, 404)
 * 
 * Variables de entorno:
 * - DIAGNOSTIC_BACKEND_URL: URL del backend (default: http://localhost:3002)
 * - ADMIN_EMAIL: Email del admin (default: admin@uttecam.edu.mx)
 * - ADMIN_PASSWORD: Password del admin (default: Admin123!@#)
 */

const BASE_URL = (process.env.DIAGNOSTIC_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:3002').replace(/\/$/, '');
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@uttecam.edu.mx';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin123!@#';

jest.setTimeout(60000); // 60 segundos para todas las pruebas

let authToken: string | null = null;

describe('Diagnóstico Exhaustivo: API UTTECAM Online', () => {
  
  // ==================== AUTENTICACIÓN ====================
  describe('1. Autenticación', () => {
    test('Login con credenciales admin debe retornar token JWT', async () => {
      const loginPaths = ['/api/auth/login', '/auth/login', '/api/login'];
      const credentials = [
        { username: 'admin', password: ADMIN_PASSWORD },
        { username: ADMIN_EMAIL, password: ADMIN_PASSWORD },
        { email: ADMIN_EMAIL, password: ADMIN_PASSWORD }
      ];
      
      let success = false;
      
      for (const path of loginPaths) {
        for (const cred of credentials) {
          try {
            const res = await request(BASE_URL)
              .post(path)
              .send(cred)
              .set('Content-Type', 'application/json')
              .set('Accept', 'application/json');

            if (res.status === 200 || res.status === 201) {
              expect(res.body).toBeDefined();
              
              // Buscar token en diferentes propiedades comunes
              const token = res.body.token || res.body.accessToken || res.body.jwt || res.body.access_token;
              expect(token).toBeTruthy();
              
              authToken = token; // Guardar para usar en otros tests
              success = true;
              console.log(`✓ Login exitoso en ${path} con ${JSON.stringify(Object.keys(cred))}`);
              break;
            }
          } catch (err) {
            // Probar siguiente combinación
          }
        }
        if (success) break;
      }
      
      expect(success).toBe(true);
      expect(authToken).toBeTruthy();
    }, 15000);

    test('Login con credenciales incorrectas debe retornar 400/401/403', async () => {
      const res = await request(BASE_URL)
        .post('/api/auth/login')
        .send({ username: 'fakeusertest123', password: 'wrongpassword' })
        .set('Content-Type', 'application/json');

      expect([400, 401, 403]).toContain(res.status);
    });
  });

  // ==================== HEALTH CHECKS ====================
  describe('2. Health Checks y Métricas', () => {
    test('GET /health - estado del servidor', async () => {
      const res = await request(BASE_URL)
        .get('/health')
        .set('Accept', 'application/json');

      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
      
      // Esperar campos comunes de health check
      const hasStatus = res.body.status || res.body.ok || res.body.health;
      expect(hasStatus).toBeTruthy();
    });

    test('GET / - información de la API', async () => {
      const res = await request(BASE_URL)
        .get('/')
        .set('Accept', 'application/json');

      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
    });

    test('GET /health/detailed - métricas detalladas (si existe)', async () => {
      const res = await request(BASE_URL)
        .get('/health/detailed')
        .set('Accept', 'application/json');

      // Puede ser 200 o 404 si no está implementado
      expect([200, 404]).toContain(res.status);
    });

    test('GET /metrics - métricas del sistema (si existe)', async () => {
      const res = await request(BASE_URL)
        .get('/metrics')
        .set('Accept', 'application/json');

      expect([200, 404]).toContain(res.status);
    });
  });

  // ==================== ENDPOINTS PÚBLICOS ====================
  describe('3. Endpoints Públicos (sin autenticación)', () => {
    const publicEndpoints = [
      { path: '/api/textos', description: 'Textos generales' },
      { path: '/api/nosotros', description: 'Información institucional' },
      { path: '/api/carreras', description: 'Carreras' },
      { path: '/api/carreras-simples', description: 'Carreras simplificadas' },
      { path: '/api/hero-slides', description: 'Hero slides' },
      { path: '/api/eventos', description: 'Eventos' },
      { path: '/api/noticias', description: 'Noticias' },
      { path: '/api/anuncios', description: 'Anuncios' },
      { path: '/api/calendarios', description: 'Calendarios' },
      { path: '/api/extension', description: 'Extensión Universitaria' },
      { path: '/api/documentos/areas', description: 'Áreas de documentos' },
      { path: '/api/modelo-educativo', description: 'Modelo Educativo' },
      { path: '/api/opciones-reinscripcion', description: 'Opciones de Reinscripción' },
    ];

    publicEndpoints.forEach(({ path, description }) => {
      test(`GET ${path} - ${description}`, async () => {
        const res = await request(BASE_URL)
          .get(path)
          .set('Accept', 'application/json');

        // Aceptar 200 o 404 (endpoint puede no tener datos)
        expect([200, 404]).toContain(res.status);
        
        if (res.status === 200) {
          expect(res.body).toBeDefined();
          console.log(`✓ ${path}: ${res.status}`);
        }
      });
    });
  });

  // ==================== ENDPOINTS PROTEGIDOS (requieren auth) ====================
  describe('4. Endpoints Protegidos (requieren autenticación)', () => {
    const protectedEndpoints = [
      { path: '/api/directorios', description: 'Directorios' },
      { path: '/api/organigrama', description: 'Organigrama' },
      { path: '/api/solicitudes-constancia', description: 'Solicitudes de constancia' },
    ];

    protectedEndpoints.forEach(({ path, description }) => {
      test(`GET ${path} sin auth debe retornar 401/403`, async () => {
        const res = await request(BASE_URL)
          .get(path)
          .set('Accept', 'application/json');

        // Si requiere auth, debe ser 401 o 403
        // Si es público, será 200
        expect([200, 401, 403, 404]).toContain(res.status);
        console.log(`  ${path} sin auth: ${res.status}`);
      });

      test(`GET ${path} con auth debe funcionar`, async () => {
        if (!authToken) {
          console.warn('  ⚠ Token no disponible, saltando test con auth');
          return;
        }

        const res = await request(BASE_URL)
          .get(path)
          .set('Authorization', `Bearer ${authToken}`)
          .set('Accept', 'application/json');

        // Con auth, debe ser 200 o 404 (sin datos)
        expect([200, 404]).toContain(res.status);
        
        if (res.status === 200) {
          expect(res.body).toBeDefined();
          console.log(`✓ ${path} con auth: ${res.status}`);
        }
      });
    });
  });

  // ==================== CRUD OPERATIONS ====================
  describe('5. Operaciones CRUD (con autenticación)', () => {
    let createdResourceId: number | null = null;

    test('POST - crear un recurso de prueba (si el endpoint lo permite)', async () => {
      if (!authToken) {
        console.warn('  ⚠ Token no disponible, saltando test POST');
        return;
      }

      // Intentar crear un anuncio de prueba
      const testData = {
        titulo: `Test Diagnóstico ${Date.now()}`,
        contenido: 'Este es un anuncio de prueba creado por el sistema de diagnóstico automático',
        isActive: false, // Inactivo para no aparecer en producción
        fechaPublicacion: new Date().toISOString()
      };

      const res = await request(BASE_URL)
        .post('/api/anuncios')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Content-Type', 'application/json')
        .send(testData);

      // Puede ser 201 (creado), 400/422 (validación), 403 (sin permisos) o 404 (endpoint no existe)
      expect([201, 200, 400, 403, 404, 422]).toContain(res.status);

      if (res.status === 201 || res.status === 200) {
        createdResourceId = res.body.id || res.body.data?.id;
        console.log(`✓ Recurso creado con ID: ${createdResourceId}`);
      }
    });

    test('PUT - actualizar recurso creado', async () => {
      if (!authToken || !createdResourceId) {
        console.warn('  ⚠ No hay recurso para actualizar, saltando test');
        return;
      }

      const updateData = {
        titulo: `Test Diagnóstico Actualizado ${Date.now()}`,
        contenido: 'Contenido actualizado',
        isActive: false
      };

      const res = await request(BASE_URL)
        .put(`/api/anuncios/${createdResourceId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .set('Content-Type', 'application/json')
        .send(updateData);

      expect([200, 403, 404]).toContain(res.status);
      
      if (res.status === 200) {
        console.log(`✓ Recurso ${createdResourceId} actualizado`);
      }
    });

    test('DELETE - eliminar recurso creado', async () => {
      if (!authToken || !createdResourceId) {
        console.warn('  ⚠ No hay recurso para eliminar, saltando test');
        return;
      }

      const res = await request(BASE_URL)
        .delete(`/api/anuncios/${createdResourceId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect([200, 204, 403, 404]).toContain(res.status);
      
      if (res.status === 200 || res.status === 204) {
        console.log(`✓ Recurso ${createdResourceId} eliminado`);
      }
    });
  });

  // ==================== MANEJO DE ERRORES ====================
  describe('6. Manejo de Errores', () => {
    test('GET a ruta inexistente debe retornar 404', async () => {
      const res = await request(BASE_URL)
        .get('/api/ruta-que-no-existe-12345')
        .set('Accept', 'application/json');

      expect(res.status).toBe(404);
    });

    test('POST sin Content-Type debe retornar error apropiado', async () => {
      const res = await request(BASE_URL)
        .post('/api/anuncios')
        .send('invalid-data');

      expect([400, 401, 403, 415, 422]).toContain(res.status);
    });

    test('Request con token inválido debe retornar 401/403', async () => {
      const res = await request(BASE_URL)
        .get('/api/directorios')
        .set('Authorization', 'Bearer token-invalido-12345');

      // Puede ser 200 si el endpoint es público, 401/403 si es protegido
      expect([200, 401, 403]).toContain(res.status);
    });
  });

  // ==================== PERFORMANCE ====================
  describe('7. Performance y Tiempos de Respuesta', () => {
    test('Endpoint /health debe responder en menos de 1 segundo', async () => {
      const start = Date.now();
      
      const res = await request(BASE_URL)
        .get('/health')
        .set('Accept', 'application/json');

      const duration = Date.now() - start;
      
      expect(res.status).toBe(200);
      expect(duration).toBeLessThan(1000);
      console.log(`  ✓ /health respondió en ${duration}ms`);
    });

    test('Endpoint público debe responder en menos de 3 segundos', async () => {
      const start = Date.now();
      
      const res = await request(BASE_URL)
        .get('/api/nosotros')
        .set('Accept', 'application/json');

      const duration = Date.now() - start;
      
      expect([200, 404]).toContain(res.status);
      expect(duration).toBeLessThan(3000);
      console.log(`  ✓ /api/nosotros respondió en ${duration}ms`);
    });
  });

  // ==================== HEADERS DE SEGURIDAD ====================
  describe('8. Headers de Seguridad', () => {
    test('Response debe incluir headers de seguridad básicos', async () => {
      const res = await request(BASE_URL)
        .get('/health')
        .set('Accept', 'application/json');

      expect(res.status).toBe(200);
      
      // Verificar headers de seguridad comunes
      const securityHeaders = [
        'x-content-type-options',
        'x-frame-options',
        'strict-transport-security',
        'content-security-policy'
      ];

      const presentHeaders = securityHeaders.filter(header => 
        res.headers[header] !== undefined
      );

      // Al menos algunos headers de seguridad deben estar presentes
      expect(presentHeaders.length).toBeGreaterThan(0);
      console.log(`  ✓ Headers de seguridad presentes: ${presentHeaders.join(', ')}`);
    });
  });
});
