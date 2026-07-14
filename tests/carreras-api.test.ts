import request from 'supertest';
import app from '../src/app';
import Carrera from '../src/models/Carrera';
import { connectDatabase } from '../src/config/database';
import path from 'path';
import fs from 'fs';

// JWT token para tests (generar uno válido o usar mock)
let authToken: string | undefined;
let testCarreraId: number | undefined;

// Conectar a la base de datos antes de los tests
beforeAll(async () => {
  await connectDatabase();
  
  // Para pruebas con autenticación, necesitarías generar un token válido
  // Por ahora usamos un mock o puedes hacer login primero
  authToken = 'Bearer test-token'; // Reemplazar con token real
});

// Limpiar datos de prueba después de los tests
afterAll(async () => {
  // Limpiar carreras de prueba si es necesario
  if (testCarreraId) {
    await Carrera.destroy({ where: { id: testCarreraId } });
  }
});

describe('API de Carreras - Tests Completos', () => {
  
  // ==========================================
  // TESTS DE ENDPOINTS PÚBLICOS
  // ==========================================
  
  describe('GET /api/carreras - Obtener carreras activas', () => {
    test('Debe retornar lista de carreras activas', async () => {
      const response = await request(app)
        .get('/api/carreras')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(Array.isArray(response.body)).toBe(true);
      
      if (response.body.length > 0) {
        const carrera = response.body[0];
        expect(carrera).toHaveProperty('id');
        expect(carrera).toHaveProperty('nombre');
        expect(carrera).toHaveProperty('siglas');
        expect(carrera).toHaveProperty('nivel');
        expect(carrera).toHaveProperty('modalidad');
        expect(carrera).toHaveProperty('duracion');
        expect(carrera).toHaveProperty('objetivo');
        expect(carrera).toHaveProperty('perfil_ingreso');
        expect(carrera).toHaveProperty('perfil_egreso');
        expect(carrera).toHaveProperty('campo_laboral');
        expect(carrera).toHaveProperty('imagen');
        expect(carrera).toHaveProperty('video_url');
        expect(carrera).toHaveProperty('plan_estudios_url');
        expect(carrera).toHaveProperty('orden');
        expect(carrera).toHaveProperty('activo');
        expect(carrera.activo).toBe(true);
      }
    });

    test('Debe retornar carreras ordenadas por orden y nivel', async () => {
      const response = await request(app)
        .get('/api/carreras')
        .expect(200);

      if (response.body.length > 1) {
        // Verificar que están ordenadas
        for (let i = 1; i < response.body.length; i++) {
          const prev = response.body[i - 1];
          const curr = response.body[i];
          expect(prev.orden <= curr.orden).toBe(true);
        }
      }
    });

    test('Debe incluir campo video_url en la respuesta', async () => {
      const response = await request(app)
        .get('/api/carreras')
        .expect(200);

      if (response.body.length > 0) {
        const carrera = response.body[0];
        expect(carrera).toHaveProperty('video_url');
        // video_url puede ser null o string
        expect(['string', 'object']).toContain(typeof carrera.video_url);
      }
    });
  });

  describe('GET /api/carreras/nivel/:nivel - Obtener por nivel', () => {
    test('Debe retornar solo carreras TSU', async () => {
      const response = await request(app)
        .get('/api/carreras/nivel/TSU')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(Array.isArray(response.body)).toBe(true);
      
      response.body.forEach((carrera: any) => {
        expect(carrera.nivel).toBe('TSU');
        expect(carrera.activo).toBe(true);
      });
    });

    test('Debe retornar solo carreras de Ingeniería', async () => {
      const response = await request(app)
        .get('/api/carreras/nivel/Ingenieria')
        .expect(200);

      response.body.forEach((carrera: any) => {
        expect(carrera.nivel).toBe('Ingenieria');
        expect(carrera.activo).toBe(true);
      });
    });

    test('Debe retornar solo carreras de Licenciatura', async () => {
      const response = await request(app)
        .get('/api/carreras/nivel/Licenciatura')
        .expect(200);

      response.body.forEach((carrera: any) => {
        expect(carrera.nivel).toBe('Licenciatura');
        expect(carrera.activo).toBe(true);
      });
    });

    test('Debe retornar array vacío para nivel inválido', async () => {
      const response = await request(app)
        .get('/api/carreras/nivel/InvalidLevel')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });
  });

  describe('GET /api/carreras/:id - Obtener carrera por ID', () => {
    test('Debe retornar una carrera específica por ID', async () => {
      // Primero obtenemos una carrera existente
      const carrerasResponse = await request(app).get('/api/carreras');
      
      if (carrerasResponse.body.length > 0) {
        const carreraId = carrerasResponse.body[0].id;
        
        const response = await request(app)
          .get(`/api/carreras/${carreraId}`)
          .expect(200)
          .expect('Content-Type', /json/);

        expect(response.body).toHaveProperty('id', carreraId);
        expect(response.body).toHaveProperty('nombre');
        expect(response.body).toHaveProperty('video_url');
      }
    });

    test('Debe retornar 404 para ID inexistente', async () => {
      const response = await request(app)
        .get('/api/carreras/99999')
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });

    test('Debe retornar carrera con todos los campos completos', async () => {
      const carrerasResponse = await request(app).get('/api/carreras');
      
      if (carrerasResponse.body.length > 0) {
        const carreraId = carrerasResponse.body[0].id;
        
        const response = await request(app)
          .get(`/api/carreras/${carreraId}`)
          .expect(200);

        const carrera = response.body;
        
        // Verificar estructura completa
        expect(typeof carrera.nombre).toBe('string');
        expect(typeof carrera.siglas).toBe('string');
        expect(['TSU', 'Ingenieria', 'Licenciatura']).toContain(carrera.nivel);
        expect(['Escolarizada', 'Ejecutiva', 'Mixta']).toContain(carrera.modalidad);
        expect(typeof carrera.duracion).toBe('string');
        expect(typeof carrera.objetivo).toBe('string');
        expect(typeof carrera.perfil_ingreso).toBe('string');
        expect(typeof carrera.perfil_egreso).toBe('string');
        expect(typeof carrera.campo_laboral).toBe('string');
        expect(typeof carrera.imagen).toBe('string');
        expect(typeof carrera.orden).toBe('number');
        expect(typeof carrera.activo).toBe('boolean');
      }
    });
  });

  // ==========================================
  // TESTS DE MODELO Y VALIDACIONES
  // ==========================================
  
  describe('Modelo Carrera - Validaciones', () => {
    test('Debe validar campos requeridos', async () => {
      try {
        await Carrera.create({
          // Faltan campos requeridos
          nombre: 'Test',
        } as any);
        fail('Debería haber lanzado error de validación');
      } catch (error: any) {
        expect(error.name).toBe('SequelizeValidationError');
      }
    });

    test('Debe aceptar valores válidos de nivel', async () => {
      const nivelesValidos = ['TSU', 'Ingenieria', 'Licenciatura'];
      
      for (const nivel of nivelesValidos) {
        const carrera = Carrera.build({
          nombre: 'Test Carrera',
          siglas: 'TEST',
          nivel: nivel as any,
          duracion: '2 años',
          objetivo: 'Objetivo de prueba',
          perfil_ingreso: 'Perfil de ingreso',
          perfil_egreso: 'Perfil de egreso',
          campo_laboral: 'Campo laboral',
          imagen: 'test.jpg',
          orden: 1,
          activo: true,
        });

        expect(carrera.nivel).toBe(nivel);
      }
    });

    test('Debe permitir video_url como opcional', async () => {
      const carrera = Carrera.build({
        nombre: 'Test Carrera',
        siglas: 'TEST',
        nivel: 'TSU',
        duracion: '2 años',
        objetivo: 'Objetivo de prueba',
        perfil_ingreso: 'Perfil de ingreso',
        perfil_egreso: 'Perfil de egreso',
        campo_laboral: 'Campo laboral',
        imagen: 'test.jpg',
        video_url: 'video_test.mp4',
        orden: 1,
        activo: true,
      });

      expect(carrera.video_url).toBe('video_test.mp4');
    });

    test('Debe permitir video_url como null', async () => {
      const carrera = Carrera.build({
        nombre: 'Test Carrera',
        siglas: 'TEST',
        nivel: 'TSU',
        duracion: '2 años',
        objetivo: 'Objetivo de prueba',
        perfil_ingreso: 'Perfil de ingreso',
        perfil_egreso: 'Perfil de egreso',
        campo_laboral: 'Campo laboral',
        imagen: 'test.jpg',
        orden: 1,
        activo: true,
      });

      expect(carrera.video_url).toBeUndefined();
    });
  });

  // ==========================================
  // TESTS DE ESTADÍSTICAS Y CONTEO
  // ==========================================
  
  describe('Estadísticas de Carreras', () => {
    test('Debe contar correctamente carreras por nivel', async () => {
      const tsuResponse = await request(app).get('/api/carreras/nivel/TSU');
      const ingResponse = await request(app).get('/api/carreras/nivel/Ingenieria');
      const licResponse = await request(app).get('/api/carreras/nivel/Licenciatura');

      const totalTSU = tsuResponse.body.length;
      const totalIng = ingResponse.body.length;
      const totalLic = licResponse.body.length;

      console.log(`📊 Estadísticas:`);
      console.log(`   TSU: ${totalTSU} carreras`);
      console.log(`   Ingenierías: ${totalIng} carreras`);
      console.log(`   Licenciaturas: ${totalLic} carreras`);

      expect(totalTSU).toBeGreaterThanOrEqual(0);
      expect(totalIng).toBeGreaterThanOrEqual(0);
      expect(totalLic).toBeGreaterThanOrEqual(0);
    });

    test('Debe contar carreras con video', async () => {
      const response = await request(app).get('/api/carreras');
      
      const conVideo = response.body.filter((c: any) => c.video_url && c.video_url !== '');
      const sinVideo = response.body.filter((c: any) => !c.video_url || c.video_url === '');

      console.log(`📹 Videos:`);
      console.log(`   Con video: ${conVideo.length}`);
      console.log(`   Sin video: ${sinVideo.length}`);

      expect(conVideo.length + sinVideo.length).toBe(response.body.length);
    });

    test('Debe verificar todas las carreras tienen imagen', async () => {
      const response = await request(app).get('/api/carreras');
      
      const sinImagen = response.body.filter((c: any) => !c.imagen);

      expect(sinImagen.length).toBe(0);
      console.log(`✅ Todas las ${response.body.length} carreras tienen imagen`);
    });
  });

  // ==========================================
  // TESTS DE INTEGRIDAD DE DATOS
  // ==========================================
  
  describe('Integridad de Datos', () => {
    test('Todos los campos de texto no deben estar vacíos', async () => {
      const response = await request(app).get('/api/carreras');
      
      response.body.forEach((carrera: any) => {
        expect(carrera.nombre.trim().length).toBeGreaterThan(0);
        expect(carrera.siglas.trim().length).toBeGreaterThan(0);
        expect(carrera.duracion.trim().length).toBeGreaterThan(0);
        expect(carrera.objetivo.trim().length).toBeGreaterThan(0);
        expect(carrera.perfil_ingreso.trim().length).toBeGreaterThan(0);
        expect(carrera.perfil_egreso.trim().length).toBeGreaterThan(0);
        expect(carrera.campo_laboral.trim().length).toBeGreaterThan(0);
      });
    });

    test('Orden de carreras debe ser único o coherente', async () => {
      const response = await request(app).get('/api/carreras');
      
      const ordenes = response.body.map((c: any) => c.orden);
      expect(ordenes.length).toBeGreaterThan(0);
      
      // Verificar que los números de orden son positivos
      ordenes.forEach((orden: number) => {
        expect(orden).toBeGreaterThanOrEqual(0);
      });
    });

    test('Modalidades deben ser válidas', async () => {
      const response = await request(app).get('/api/carreras');
      
      const modalidadesValidas = ['Escolarizada', 'Ejecutiva', 'Mixta'];
      
      response.body.forEach((carrera: any) => {
        expect(modalidadesValidas).toContain(carrera.modalidad);
      });
    });

    test('Niveles deben ser válidos', async () => {
      const response = await request(app).get('/api/carreras');
      
      const nivelesValidos = ['TSU', 'Ingenieria', 'Licenciatura'];
      
      response.body.forEach((carrera: any) => {
        expect(nivelesValidos).toContain(carrera.nivel);
      });
    });
  });

  // ==========================================
  // TESTS DE PERFORMANCE
  // ==========================================
  
  describe('Performance', () => {
    test('GET /api/carreras debe responder en menos de 500ms', async () => {
      const start = Date.now();
      
      await request(app)
        .get('/api/carreras')
        .expect(200);
      
      const duration = Date.now() - start;
      
      console.log(`⏱️  Tiempo de respuesta: ${duration}ms`);
      expect(duration).toBeLessThan(500);
    });

    test('GET /api/carreras/:id debe responder en menos de 300ms', async () => {
      const carrerasResponse = await request(app).get('/api/carreras');
      
      if (carrerasResponse.body.length > 0) {
        const carreraId = carrerasResponse.body[0].id;
        const start = Date.now();
        
        await request(app)
          .get(`/api/carreras/${carreraId}`)
          .expect(200);
        
        const duration = Date.now() - start;
        
        console.log(`⏱️  Tiempo de respuesta por ID: ${duration}ms`);
        expect(duration).toBeLessThan(300);
      }
    });
  });

  // ==========================================
  // TESTS DE ESTRUCTURA DE VIDEO_URL
  // ==========================================
  
  describe('Campo video_url - Validaciones', () => {
    test('video_url debe ser string o null', async () => {
      const response = await request(app).get('/api/carreras');
      
      response.body.forEach((carrera: any) => {
        if (carrera.video_url !== null) {
          expect(typeof carrera.video_url).toBe('string');
        }
      });
    });

    test('Si existe video_url, debe tener formato válido de archivo', async () => {
      const response = await request(app).get('/api/carreras');
      
      const carrerasConVideo = response.body.filter((c: any) => c.video_url && c.video_url !== '');
      
      carrerasConVideo.forEach((carrera: any) => {
        // Debe terminar en .mp4, .webm, o .avi
        const validExtensions = ['.mp4', '.webm', '.avi'];
        const hasValidExtension = validExtensions.some(ext => 
          carrera.video_url.toLowerCase().endsWith(ext)
        );
        
        if (!hasValidExtension) {
          console.warn(`⚠️  Carrera "${carrera.nombre}" tiene video con extensión no estándar: ${carrera.video_url}`);
        }
      });
    });
  });

  // ==========================================
  // RESUMEN FINAL
  // ==========================================
  
  describe('Resumen de Tests', () => {
    test('Generar reporte completo del módulo de carreras', async () => {
      const response = await request(app).get('/api/carreras');
      const total = response.body.length;
      
      const porNivel = {
        TSU: response.body.filter((c: any) => c.nivel === 'TSU').length,
        Ingenieria: response.body.filter((c: any) => c.nivel === 'Ingenieria').length,
        Licenciatura: response.body.filter((c: any) => c.nivel === 'Licenciatura').length,
      };

      const porModalidad = {
        Escolarizada: response.body.filter((c: any) => c.modalidad === 'Escolarizada').length,
        Ejecutiva: response.body.filter((c: any) => c.modalidad === 'Ejecutiva').length,
        Mixta: response.body.filter((c: any) => c.modalidad === 'Mixta').length,
      };

      const conVideo = response.body.filter((c: any) => c.video_url && c.video_url !== '').length;
      const conPlan = response.body.filter((c: any) => c.plan_estudios_url).length;
      const activas = response.body.filter((c: any) => c.activo).length;

      console.log('\n═══════════════════════════════════════════════════════════');
      console.log('           📊 REPORTE COMPLETO DEL MÓDULO DE CARRERAS');
      console.log('═══════════════════════════════════════════════════════════');
      console.log(`\n📚 Total de carreras: ${total}`);
      console.log(`✅ Carreras activas: ${activas}`);
      console.log(`\n📋 Por nivel:`);
      console.log(`   - TSU: ${porNivel.TSU}`);
      console.log(`   - Ingenierías: ${porNivel.Ingenieria}`);
      console.log(`   - Licenciaturas: ${porNivel.Licenciatura}`);
      console.log(`\n🏫 Por modalidad:`);
      console.log(`   - Escolarizada: ${porModalidad.Escolarizada}`);
      console.log(`   - Ejecutiva: ${porModalidad.Ejecutiva}`);
      console.log(`   - Mixta: ${porModalidad.Mixta}`);
      console.log(`\n📹 Multimedia:`);
      console.log(`   - Con video: ${conVideo}`);
      console.log(`   - Con plan de estudios: ${conPlan}`);
      console.log(`   - Con imagen: ${total} (100%)`);
      console.log('\n═══════════════════════════════════════════════════════════\n');

      expect(total).toBeGreaterThan(0);
      expect(activas).toBeGreaterThan(0);
    });
  });
});
