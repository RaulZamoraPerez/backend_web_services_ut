# 🔒 Test de Auditoría de Seguridad OWASP Top 10

Este documento describe el test automático de auditoría de seguridad basado en **OWASP Top 10 2021** para la API UTTECAM.

## 📋 Descripción General

El test `security-audit.test.ts` realiza una auditoría exhaustiva de seguridad verificando las protecciones implementadas contra los 10 vectores de ataque más críticos según OWASP.

## 🚀 Ejecución

```bash
# Ejecutar auditoría de seguridad
npm run test:security

# Con URL personalizada
DIAGNOSTIC_BACKEND_URL=https://staging.api.uttecam.edu.mx npm run test:security

# Con credenciales personalizadas
DIAGNOSTIC_BACKEND_URL=https://api.uttecam.edu.mx \
ADMIN_EMAIL=admin@uttecam.edu.mx \
ADMIN_PASSWORD='Admin123!@#' \
npm run test:security
```

## 🔍 Tests Incluidos (26 tests)

### A01:2021 – Control de Acceso Roto (4 tests)
- ✅ Endpoints protegidos rechazan peticiones sin autenticación
- ✅ Tokens inválidos son rechazados
- ✅ Tokens mal formados o expirados son rechazados
- ✅ Prevención de IDOR (Insecure Direct Object Reference)

**¿Qué verifica?**
- Que recursos protegidos requieran autenticación válida
- Que no se puedan acceder a recursos de otros usuarios (ej: `/api/solicitudes-constancia/999999`)

### A02:2021 – Fallas Criptográficas (3 tests)
- ✅ HTTPS habilitado en producción
- ✅ Headers de seguridad presentes (HSTS, CSP, X-Frame-Options, X-Content-Type-Options)
- ✅ Contraseñas no se exponen en respuestas de API

**¿Qué verifica?**
- Uso de HTTPS en producción
- Headers de seguridad configurados
- No exposición de información sensible (contraseñas, hashes)

### A03:2021 – Inyección (4 tests)
- ✅ **SQL Injection** - Prevención con payloads comunes:
  - `1' OR '1'='1`
  - `admin'--`
  - `1; DROP TABLE users--`
- ✅ **NoSQL Injection** - Prevención de objetos maliciosos:
  - `{ $ne: null }`
  - `{ $gt: '' }`
- ✅ **XSS (Cross-Site Scripting)** - Sanitización de:
  - `<script>alert("XSS")</script>`
  - `<img src=x onerror=alert("XSS")>`
- ✅ **Command Injection** - Prevención de:
  - `; ls -la`
  - `| cat /etc/passwd`
  - `` `whoami` ``

**¿Qué verifica?**
- Parámetros de consulta son sanitizados
- Campos de texto no permiten ejecución de scripts
- No se ejecutan comandos del sistema

### A04:2021 – Diseño Inseguro (2 tests)
- ✅ **Rate Limiting** - Límites de peticiones configurados
- ✅ **Logging** - Endpoints sensibles registran actividad

**¿Qué verifica?**
- Protección contra ataques de fuerza bruta (límite de peticiones por minuto)
- Headers de rate limit presentes: `ratelimit-limit`, `ratelimit-remaining`
- Detección de múltiples peticiones rápidas (429 Too Many Requests)

### A05:2021 – Configuración de Seguridad Incorrecta (4 tests)
- ✅ **Información del servidor** - No se expone `X-Powered-By`, versiones específicas
- ✅ **Stack traces** - No se exponen en respuestas de error
- ✅ **CORS** - Configurado restrictivamente (no permite `*`)
- ✅ **Métodos HTTP** - Solo métodos estándar habilitados

**¿Qué verifica?**
- Headers que revelan tecnología están ocultos
- Errores 404/500 no muestran paths de archivos o stack traces
- CORS permite solo orígenes específicos

### A06:2021 – Componentes Vulnerables (1 test)
- ✅ **Versión de la API** - Versión estable en producción

**¿Qué verifica?**
- No se usa versión `dev`, `alpha`, `beta` en producción

### A07:2021 – Fallas de Autenticación (3 tests)
- ✅ **Contraseñas débiles** - Rechazadas (123456, password, etc.)
- ✅ **Validación de login** - Campos obligatorios requeridos
- ✅ **Expiración de sesión** - Tokens JWT tienen campo `exp`

**¿Qué verifica?**
- Política de contraseñas fuertes (mínimo 8 caracteres, mayúsculas, números, símbolos)
- Login requiere username/email y password
- Tokens tienen tiempo de expiración

### A08:2021 – Fallas de Integridad (1 test)
- ✅ **Validación de Content-Type** - Uploads requieren tipo correcto

**¿Qué verifica?**
- Peticiones POST/PUT validan el Content-Type
- Rechaza contenido no JSON donde se espera JSON

### A09:2021 – Fallas de Logging (2 tests)
- ✅ **Timestamps** - Health check incluye timestamp
- ✅ **Headers de auditoría** - Headers útiles para logs presentes

**¿Qué verifica?**
- Respuestas incluyen información temporal para auditoría
- Headers como `date`, `content-type` están presentes

### A10:2021 – SSRF (Server-Side Request Forgery) (1 test)
- ✅ **URLs maliciosas** - Rechazadas:
  - `http://localhost:22`
  - `http://169.254.169.254/latest/meta-data/`
  - `file:///etc/passwd`

**¿Qué verifica?**
- Parámetros de URL no procesan recursos internos o locales

### 📊 Resumen de Seguridad (1 test)
- ✅ **Reporte completo** - JSON con estado de seguridad general

## 📊 Ejemplo de Salida

```bash
PASS tests/security-audit.test.ts (18.5s)
  🔒 Auditoría de Seguridad OWASP Top 10
    A01:2021 - Control de Acceso Roto
      ✓ Endpoints protegidos deben rechazar peticiones sin autenticación (1347 ms)
      ✓ Token inválido debe ser rechazado (276 ms)
      ✓ Token expirado o malformado debe ser rechazado (1173 ms)
      ✓ Debe prevenir acceso a recursos de otros usuarios (IDOR) (604 ms)
    A02:2021 - Fallas Criptográficas
      ✓ HTTPS debe estar habilitado en producción (2 ms)
      ✓ Headers de seguridad deben estar presentes (323 ms)
      ✓ Contraseñas no deben exponerse en respuestas (331 ms)
    ...
    📊 Resumen de Seguridad:
    {
      "timestamp": "2026-01-16T20:47:37.605Z",
      "baseUrl": "https://api.uttecam.edu.mx",
      "https": true,
      "headers": {
        "hsts": true,
        "csp": true,
        "xFrameOptions": true,
        "xContentTypeOptions": true
      },
      "authentication": true,
      "serverInfo": "LiteSpeed"
    }

Test Suites: 1 passed, 1 total
Tests:       26 passed, 26 total
Time:        18.698 s
```

## ⚠️ Interpretación de Resultados

### ✅ Todos los tests pasaron
El backend tiene una configuración de seguridad sólida que cumple con OWASP Top 10.

### ⚠️ Advertencias (warnings)
Las advertencias no fallan el test pero indican áreas de mejora:
- `⚠ Headers faltantes` - Pueden estar configurados en el proxy/servidor web
- `⚠ Endpoint puede ser público` - El endpoint no requiere autenticación
- `⚠ No se está usando HTTPS` - Solo aceptable en localhost

### ❌ Tests fallidos
Si algún test falla, indica una vulnerabilidad de seguridad que debe ser corregida.

## 🔧 Variables de Entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| `DIAGNOSTIC_BACKEND_URL` | URL del backend a auditar | `https://api.uttecam.edu.mx` |
| `ADMIN_EMAIL` | Email del admin | `admin@uttecam.edu.mx` |
| `ADMIN_PASSWORD` | Password del admin | `Admin123!@#` |

## 📈 Integración con CI/CD

### GitHub Actions

```yaml
name: Security Audit

on:
  schedule:
    - cron: '0 2 * * *'  # Diario a las 2 AM
  workflow_dispatch:

jobs:
  security-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - name: Run Security Audit
        env:
          DIAGNOSTIC_BACKEND_URL: https://api.uttecam.edu.mx
          ADMIN_EMAIL: ${{ secrets.ADMIN_EMAIL }}
          ADMIN_PASSWORD: ${{ secrets.ADMIN_PASSWORD }}
        run: npm run test:security
```

### Cron Job (Linux)

```bash
# Ejecutar auditoría semanal los lunes a las 3 AM
0 3 * * 1 cd /path/to/BKUTTECAM && npm run test:security > /var/log/security-audit.log 2>&1
```

## 🛡️ Buenas Prácticas

### Frecuencia de Auditoría
- **Desarrollo:** Antes de cada despliegue
- **Staging:** Diario
- **Producción:** Semanal o después de cambios

### Qué hacer con los resultados
1. **Tests pasando:** Continuar monitoreando
2. **Advertencias:** Evaluar y priorizar mejoras
3. **Tests fallando:** Corregir inmediatamente antes de desplegar

### Mejoras Recomendadas
Si alguno de estos tests falla:

- **A01 (Control de Acceso):** Implementar middleware de autenticación
- **A02 (Criptografía):** Habilitar HTTPS, configurar headers de seguridad
- **A03 (Inyección):** Usar ORM/parametrización, sanitizar entrada
- **A04 (Diseño):** Implementar rate limiting con express-rate-limit
- **A05 (Configuración):** Ocultar headers de servidor, usar helmet.js
- **A07 (Autenticación):** Validar complejidad de contraseñas, implementar JWT
- **A08 (Integridad):** Validar Content-Type, firmas de archivos
- **A09 (Logging):** Implementar Winston o similar
- **A10 (SSRF):** Validar y sanitizar URLs de entrada

## 📚 Recursos

- [OWASP Top 10 2021](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Helmet.js Documentation](https://helmetjs.github.io/)

## 🔄 Personalización

Para añadir más tests de seguridad, editar `tests/security-audit.test.ts`:

```typescript
describe('Mi test personalizado', () => {
  test('debe verificar mi condición de seguridad', async () => {
    const res = await request(BASE_URL)
      .get('/mi-endpoint')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    // ... tus verificaciones
  });
});
```

---

**Última actualización:** Enero 2026  
**Mantenedor:** Equipo de Desarrollo UTTECAM
