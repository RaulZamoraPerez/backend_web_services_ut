# 🔍 Tests de Diagnóstico para Backend en Línea

Este documento describe cómo ejecutar los tests automáticos de diagnóstico para verificar que el backend de la API UTTECAM esté funcionando correctamente en producción.

## 📋 Descripción General

Se incluyen dos tipos de tests de diagnóstico:

1. **Test Rápido** (`diagnostic-online.test.ts`) - Comprobaciones básicas
2. **Test Exhaustivo** (`diagnostic-online-comprehensive.test.ts`) - Comprobaciones completas con autenticación

## 🚀 Ejecución Rápida

### Opción 1: Scripts NPM (Recomendado)

```bash
# Test rápido (health checks, endpoints públicos, tiempos de respuesta)
npm run test:diagnostic

# Test exhaustivo completo (recomendado para diagnóstico completo)
npm run test:diagnostic:full

# Ejecutar ambos tests
npm run test:diagnostic:all
```

### Opción 2: Comandos Manuales

```bash
# Test rápido
DIAGNOSTIC_BACKEND_URL=https://api.uttecam.edu.mx npm test diagnostic-online.test.ts

# Test exhaustivo
DIAGNOSTIC_BACKEND_URL=https://api.uttecam.edu.mx npm test diagnostic-online-comprehensive.test.ts
```

## 🔧 Variables de Entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| `DIAGNOSTIC_BACKEND_URL` | URL del backend a probar | `https://api.uttecam.edu.mx` |
| `ADMIN_EMAIL` | Email del admin para autenticación | `admin@uttecam.edu.mx` |
| `ADMIN_PASSWORD` | Password del admin | `Admin123!@#` |
| `DIAGNOSTIC_ENDPOINTS` | Endpoints públicos separados por comas (solo test rápido) | Ver código |

### Ejemplos con Variables Personalizadas

```bash
# Probar contra otro servidor
DIAGNOSTIC_BACKEND_URL=https://staging.api.uttecam.edu.mx npm run test:diagnostic:full

# Con credenciales personalizadas
DIAGNOSTIC_BACKEND_URL=https://api.uttecam.edu.mx \
ADMIN_EMAIL=admin@uttecam.edu.mx \
ADMIN_PASSWORD='MiPassword123!' \
npm run test:diagnostic:full
```

## ✅ Qué Verifica el Test Rápido

- ✓ Health endpoint disponible y responde 200
- ✓ Al menos un endpoint público responde 200
- ✓ Tiempo de respuesta razonable (< 3 segundos)
- ✓ Login opcional si se proporcionan credenciales

**Duración estimada:** ~10-15 segundos

## ✅ Qué Verifica el Test Exhaustivo

### 1️⃣ Autenticación
- ✓ Login con credenciales admin retorna token JWT
- ✓ Login con credenciales incorrectas retorna error apropiado

### 2️⃣ Health Checks y Métricas
- ✓ `GET /health` - estado del servidor
- ✓ `GET /` - información de la API
- ✓ `GET /health/detailed` - métricas detalladas (si existe)
- ✓ `GET /metrics` - métricas del sistema (si existe)

### 3️⃣ Endpoints Públicos (sin autenticación)
Verifica los siguientes endpoints:
- `/api/textos`
- `/api/nosotros`
- `/api/carreras`
- `/api/carreras-simples`
- `/api/hero-slides`
- `/api/eventos`
- `/api/noticias`
- `/api/anuncios`
- `/api/calendarios`
- `/api/extension`
- `/api/documentos/areas`
- `/api/modelo-educativo`
- `/api/opciones-reinscripcion`

### 4️⃣ Endpoints Protegidos (requieren autenticación)
- ✓ Verifica que sin token retornen 401/403
- ✓ Verifica que con token funcionen correctamente
- Endpoints probados:
  - `/api/directorios`
  - `/api/organigrama`
  - `/api/solicitudes-constancia`

### 5️⃣ Operaciones CRUD
- ✓ POST - crear recursos (si el usuario tiene permisos)
- ✓ PUT - actualizar recursos
- ✓ DELETE - eliminar recursos

### 6️⃣ Manejo de Errores
- ✓ Rutas inexistentes retornan 404
- ✓ Requests sin Content-Type apropiado retornan error
- ✓ Tokens inválidos retornan 401/403

### 7️⃣ Performance
- ✓ `/health` responde en menos de 1 segundo
- ✓ Endpoints públicos responden en menos de 3 segundos

### 8️⃣ Seguridad
- ✓ Verifica presencia de headers de seguridad:
  - `x-content-type-options`
  - `x-frame-options`
  - `strict-transport-security`
  - `content-security-policy`

**Duración estimada:** ~30-40 segundos

## 📊 Interpretación de Resultados

### ✅ Todos los tests pasaron
```
Test Suites: 1 passed, 1 total
Tests:       34 passed, 34 total
```
El backend está funcionando correctamente.

### ❌ Algunos tests fallaron
```
Test Suites: 1 failed, 1 total
Tests:       3 failed, 31 passed, 34 total
```
Revisar los detalles de los tests que fallaron para identificar el problema.

### Errores Comunes

#### Error de Conexión
```
Error: connect ECONNREFUSED
```
**Solución:** Verificar que la URL del backend sea correcta y esté accesible.

#### Error de Autenticación
```
Expected: true
Received: false
```
**Solución:** Verificar que las credenciales de admin sean correctas.

#### Timeouts
```
Timeout - Async callback was not invoked within the 60000 ms timeout
```
**Solución:** El servidor puede estar lento o caído. Verificar estado del servidor.

## 🔄 Integración con CI/CD

### Ejemplo para GitHub Actions

```yaml
name: Diagnostic Tests

on:
  schedule:
    - cron: '0 */6 * * *'  # Cada 6 horas
  workflow_dispatch:

jobs:
  diagnostic:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - name: Run Diagnostic Tests
        env:
          DIAGNOSTIC_BACKEND_URL: https://api.uttecam.edu.mx
          ADMIN_EMAIL: ${{ secrets.ADMIN_EMAIL }}
          ADMIN_PASSWORD: ${{ secrets.ADMIN_PASSWORD }}
        run: npm run test:diagnostic:all
```

### Ejemplo para Cron Job (Linux)

```bash
# Agregar a crontab (crontab -e)
# Ejecutar test exhaustivo cada 6 horas y enviar reporte por email

0 */6 * * * cd /path/to/BKUTTECAM && npm run test:diagnostic:full 2>&1 | mail -s "API Diagnostic Report" admin@uttecam.edu.mx
```

## 📝 Logs y Debugging

### Ver logs detallados

```bash
# Con verbose
DIAGNOSTIC_BACKEND_URL=https://api.uttecam.edu.mx npm test -- diagnostic-online-comprehensive.test.ts --verbose --runInBand

# Solo mostrar tests que fallaron
npm run test:diagnostic:full 2>&1 | grep -A 10 "FAIL"
```

### Guardar reporte

```bash
npm run test:diagnostic:full > diagnostic-report.txt 2>&1
```

## 🛠️ Personalización

Para añadir más endpoints o comprobaciones, editar:
- `tests/diagnostic-online.test.ts` - Test rápido
- `tests/diagnostic-online-comprehensive.test.ts` - Test exhaustivo

Ejemplo de cómo añadir un nuevo endpoint público:

```typescript
const publicEndpoints = [
  // ... endpoints existentes
  { path: '/api/mi-nuevo-endpoint', description: 'Mi nuevo endpoint' },
];
```

## 📚 Recursos Adicionales

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Testing Guide](./tests/README-jest.md)

---

**Última actualización:** Enero 2026  
**Mantenedor:** Equipo de Desarrollo UTTECAM
