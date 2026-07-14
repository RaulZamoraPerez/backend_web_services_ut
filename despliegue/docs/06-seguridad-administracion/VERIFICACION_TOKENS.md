# 🔍 Índice Rápido - Verificación de Tokens JWT

## 📍 Acceso Rápido

### 🎯 ¿Cómo Verificar un Token?

Consulta la **[Guía Completa de Autenticación JWT](./06-seguridad-administracion/AUTENTICACION_JWT.md#verificación-de-tokens)**

### 🧪 Testing de Seguridad

```bash
# Ejecutar test completo
npm run test:tokens
```

**Documentación:**
- [Resumen Test Tokens](./06-seguridad-administracion/RESUMEN_TEST_TOKENS.md)
- [Test Completo](./06-seguridad-administracion/TEST_TOKEN_SECURITY.md)
- [Guía Visual](./06-seguridad-administracion/GUIA_VISUAL_TEST_TOKENS.md)

---

## 🔐 3 Métodos de Verificación

### 1️⃣ Verificación con Endpoint (Recomendado)

```bash
curl http://localhost:3002/api/auth/profile \
  -H "Authorization: Bearer <TU_TOKEN>"
```

**Respuestas:**
- ✅ **200** = Token válido
- ❌ **401** = Sin token
- ❌ **403** = Token inválido/expirado

📖 [Ver documentación completa](./06-seguridad-administracion/AUTENTICACION_JWT.md#método-1-usar-el-endpoint-de-perfil)

### 2️⃣ Verificación con Tests Automáticos

```bash
npm run test:tokens
```

Ejecuta 10 tests de seguridad que verifican:
- Generación de tokens
- Expiración
- Firma válida
- Protección de rutas
- Y más...

📖 [Ver documentación de tests](./06-seguridad-administracion/TEST_TOKEN_SECURITY.md)

### 3️⃣ Verificación Programática

```typescript
import { verifyToken } from './middleware/auth';

const token = 'eyJhbGci...';
const decoded = verifyToken(token);

if (decoded) {
  console.log('✅ Token válido');
  console.log('Usuario:', decoded.username);
  console.log('Rol:', decoded.role);
} else {
  console.log('❌ Token inválido');
}
```

📖 [Ver ejemplos de código](./06-seguridad-administracion/AUTENTICACION_JWT.md#2-verificación-manual)

---

## 📚 Documentación Completa

### Autenticación
- **[AUTENTICACION_JWT.md](./06-seguridad-administracion/AUTENTICACION_JWT.md)** - Guía completa de JWT
  - Login y obtención de tokens
  - **3 métodos de verificación**
  - Uso en requests
  - Troubleshooting

### Seguridad
- **[SECURITY.md](./06-seguridad-administracion/SECURITY.md)** - Características de seguridad
- **[ADMIN_USER.md](./06-seguridad-administracion/ADMIN_USER.md)** - Gestión de usuarios
- **[RUTAS_PUBLICAS_PROTEGIDAS.md](./06-seguridad-administracion/RUTAS_PUBLICAS_PROTEGIDAS.md)** - Control de acceso

### Testing
- **[RESUMEN_TEST_TOKENS.md](./06-seguridad-administracion/RESUMEN_TEST_TOKENS.md)** - Resumen ejecutivo
- **[TEST_TOKEN_SECURITY.md](./06-seguridad-administracion/TEST_TOKEN_SECURITY.md)** - Documentación completa
- **[GUIA_VISUAL_TEST_TOKENS.md](./06-seguridad-administracion/GUIA_VISUAL_TEST_TOKENS.md)** - Guía visual

---

## 🚀 Inicio Rápido

### 1. Obtener Token

```bash
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### 2. Verificar Token

```bash
curl http://localhost:3002/api/auth/profile \
  -H "Authorization: Bearer <TOKEN_DEL_PASO_1>"
```

### 3. Ejecutar Tests

```bash
npm run test:tokens
```

---

## 💡 Preguntas Frecuentes

### ¿Cómo sé si mi token expiró?

**Opción 1:** Hacer una request a una ruta protegida
```bash
curl http://localhost:3002/api/auth/profile \
  -H "Authorization: Bearer <TOKEN>"
```
Si retorna **403**, el token expiró.

**Opción 2:** Decodificar el token (sin verificar)
```javascript
const jwt = require('jsonwebtoken');
const decoded = jwt.decode(token);
console.log('Expira:', new Date(decoded.exp * 1000));
```

📖 [Ver más en Troubleshooting](./06-seguridad-administracion/AUTENTICACION_JWT.md#troubleshooting)

### ¿Cómo verifico que el formato del header es correcto?

El formato correcto es:
```
Authorization: Bearer eyJhbGci...
```

⚠️ **Nota:** El prefijo `Bearer ` (con espacio) es obligatorio.

📖 [Ver ejemplos](./06-seguridad-administracion/AUTENTICACION_JWT.md#formato-del-header)

### ¿Dónde encuentro los códigos de error HTTP?

| Código | Significado | Acción |
|--------|-------------|--------|
| 200 | OK | Token válido ✅ |
| 401 | Unauthorized | Falta token |
| 403 | Forbidden | Token inválido/expirado |

📖 [Tabla completa de códigos](./06-seguridad-administracion/AUTENTICACION_JWT.md#códigos-de-respuesta-http)

---

## 🔗 Enlaces Útiles

- [README Principal](./README.md)
- [API Reference](./04-api-referencia/API_REFERENCE.md)
- [Instalación](./02-instalacion-configuracion/INSTALLATION.md)
- [Development](./03-desarrollo/DEVELOPMENT.md)

---

**Actualizado:** 23 de octubre de 2025  
**Versión:** 2.0.0-secure
