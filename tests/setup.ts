// tests/setup.ts
import dotenv from 'dotenv';

// Configurar variables de entorno para tests
dotenv.config({ path: '.env' });

// Configuraciones globales para tests
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';

// Aumentar timeout para tests de integración
jest.setTimeout(10000);