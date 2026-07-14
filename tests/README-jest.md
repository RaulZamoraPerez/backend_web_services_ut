# Testing con Jest

Este proyecto usa **Jest** como framework de testing principal, junto con **Supertest** para tests de API HTTP.

## 🚀 Inicio rápido

### Ejecutar todos los tests
```bash
npm test
```

### Ejecutar tests en modo watch (desarrollo)
```bash
npm run test:watch
```

### Diagnóstico online (test para backend ya desplegado)
El proyecto incluye tests que realizan comprobaciones básicas y exhaustivas contra un backend ya en línea.

#### Tests disponibles:
1. **`diagnostic-online.test.ts`** - Test rápido (health, endpoints públicos, tiempos de respuesta)
2. **`diagnostic-online-comprehensive.test.ts`** - Test exhaustivo (autenticación, endpoints protegidos, CRUD, seguridad)

#### Variables de entorno:
- `DIAGNOSTIC_BACKEND_URL` o `BACKEND_URL` - URL del backend (ej: `https://api.uttecam.edu.mx`)
- `ADMIN_EMAIL` - Email del admin (default: `admin@uttecam.edu.mx`)
- `ADMIN_PASSWORD` - Password del admin (default: `Admin123!@#`)
- `PROBAR_LOGIN_EMAIL` y `PROBAR_LOGIN_PASSWORD` - Para test básico de login (opcional)
- `DIAGNOSTIC_ENDPOINTS` - Endpoints públicos a probar separados por comas (opcional)

#### Ejemplos de uso:

```bash
# Test rápido contra URL por defecto
npm test diagnostic-online.test.ts

# Test rápido contra URL remota
DIAGNOSTIC_BACKEND_URL=https://api.uttecam.edu.mx npm test diagnostic-online.test.ts

# Test exhaustivo (recomendado para diagnóstico completo)
DIAGNOSTIC_BACKEND_URL=https://api.uttecam.edu.mx npm test diagnostic-online-comprehensive.test.ts

# Test con credenciales personalizadas
DIAGNOSTIC_BACKEND_URL=https://api.uttecam.edu.mx ADMIN_EMAIL=admin@uttecam.edu.mx ADMIN_PASSWORD='Admin123!@#' npm test diagnostic-online-comprehensive.test.ts

# Ambos tests en secuencia
DIAGNOSTIC_BACKEND_URL=https://api.uttecam.edu.mx npm test diagnostic-online
```

#### Qué verifica el test exhaustivo:
- ✅ Autenticación con usuario admin
- ✅ Health checks y métricas del sistema
- ✅ Endpoints públicos (sin autenticación)
- ✅ Endpoints protegidos (con autenticación JWT)
- ✅ Operaciones CRUD (POST, PUT, DELETE)
- ✅ Manejo de errores (401, 403, 404)
- ✅ Tiempos de respuesta
- ✅ Headers de seguridad

### Test de seguridad (auditoría OWASP Top 10)
El proyecto incluye un test exhaustivo de seguridad que verifica la protección contra OWASP Top 10: `tests/security-audit.test.ts`.

```bash
# Test de seguridad completo
npm run test:security

# Con URL personalizada
DIAGNOSTIC_BACKEND_URL=https://api.uttecam.edu.mx npm run test:security
```

#### Qué verifica (26 tests):
- ✅ A01: Control de Acceso Roto (4 tests)
- ✅ A02: Fallas Criptográficas (3 tests)
- ✅ A03: Inyección (SQL, NoSQL, XSS, Command) (4 tests)
- ✅ A04: Diseño Inseguro (Rate Limiting) (2 tests)
- ✅ A05: Configuración de Seguridad (4 tests)
- ✅ A06: Componentes Vulnerables (1 test)
- ✅ A07: Fallas de Autenticación (3 tests)
- ✅ A08: Fallas de Integridad (1 test)
- ✅ A09: Fallas de Logging (2 tests)
- ✅ A10: SSRF (1 test)
- ✅ Reporte de Seguridad (1 test)

**📖 Ver documentación completa:** [docs/SECURITY_AUDIT.md](../docs/SECURITY_AUDIT.md)

### Ejecutar tests con cobertura
```bash
npm run test:coverage
```

### Ejecutar tests para CI/CD
```bash
npm run test:ci
```

## 📁 Estructura de tests

```
tests/
├── setup.ts                    # Configuración global de Jest
├── health.test.ts             # Tests básicos de health check
├── nosotros-api.test.ts       # Tests de API para "Nosotros"
└── nosotros/                  # Tests legacy (axios)
    ├── nosotros.test.js
    ├── nosotros-validation.test.js
    └── ...
```

## 🛠️ Configuración

### Jest Configuration (`jest.config.js`)
- **Preset**: `ts-jest` para soporte TypeScript
- **Environment**: `node` para tests backend
- **Coverage**: Reportes en texto, HTML y LCOV
- **Setup**: Configuración global en `tests/setup.ts`

### Variables de entorno para tests
```bash
# En .env o .env.test
NODE_ENV=test
JWT_SECRET=test-jwt-secret
TEST_JWT_TOKEN=tu-token-de-prueba
```

## 📝 Escribiendo tests

### Tests de API con Supertest

```typescript
import request from 'supertest';
import app from '../src/app';

describe('Mi API', () => {
  test('GET /endpoint', async () => {
    const response = await request(app)
      .get('/endpoint')
      .expect(200);

    expect(response.body).toHaveProperty('data');
  });

  test('POST /endpoint requiere auth', async () => {
    const response = await request(app)
      .post('/endpoint')
      .set('Authorization', `Bearer ${token}`)
      .send({ data: 'test' })
      .expect(201);

    expect(response.body).toHaveProperty('id');
  });
});
```

### Tests de unidades

```typescript
import { miFuncion } from '../src/utils/miFuncion';

describe('miFuncion', () => {
  test('debería retornar resultado esperado', () => {
    const result = miFuncion('input');
    expect(result).toBe('expected output');
  });

  test('debería manejar errores', () => {
    expect(() => miFuncion(null)).toThrow('Error message');
  });
});
```

## 🔧 Comandos útiles

### Ejecutar tests específicos
```bash
# Un archivo específico
npm test health.test.ts

# Tests que coincidan con patrón
npm test -- --testNamePattern="health"

# Una suite específica
npm test -- --testPathPattern=nosotros
```

### Depuración
```bash
# Ver logs detallados
npm test -- --verbose

# Ejecutar un test específico
npm test -- --testNamePattern="debería obtener contenido"
```

### Cobertura
```bash
# Ver reporte en terminal
npm run test:coverage

# Abrir reporte HTML
open coverage/lcov-report/index.html
```

## 📊 Cobertura de código

Jest genera reportes de cobertura que muestran:
- **Statements**: Líneas ejecutadas
- **Branches**: Ramas condicionales
- **Functions**: Funciones llamadas
- **Lines**: Líneas cubiertas

Configurado para excluir:
- Archivos de tipos (`.d.ts`)
- `server.ts` (punto de entrada)

## 🔄 Migración desde tests legacy

Los tests actuales en `tests/nosotros/` usan Axios directamente. Para migrar:

1. **Convertir a Jest/Supertest**:
   ```typescript
   // Antes (Axios)
   const response = await axios.get(`${BASE_URL}/api/nosotros`);

   // Después (Supertest)
   const response = await request(BASE_URL).get('/api/nosotros');
   ```

2. **Usar assertions de Jest**:
   ```typescript
   // Antes
   if (!response.data.vision) throw new Error('Falta visión');

   // Después
   expect(response.body).toHaveProperty('vision');
   ```

## 🐛 Debugging

### Tests que fallan
1. Verificar que el servidor esté ejecutándose
2. Revisar variables de entorno
3. Verificar tokens de autenticación
4. Revisar logs del servidor durante tests

### Timeout errors
```typescript
// Aumentar timeout para tests lentos
test('test lento', async () => {
  // ... test code
}, 10000); // 10 segundos
```

## 📚 Recursos

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Testing Node.js with Jest](https://nodejs.dev/learn/testing-in-nodejs-with-jest)