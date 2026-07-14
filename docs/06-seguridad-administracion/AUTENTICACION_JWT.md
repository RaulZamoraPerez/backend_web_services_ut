# 🔐 Autenticación JWT - Guía Completa

## 📋 Índice

1. [Introducción](#introducción)
2. [Configuración](#configuración)
3. [Autenticación de Usuarios](#autenticación-de-usuarios)
4. [Verificación de Tokens](#verificación-de-tokens)
5. [Uso de Tokens en Requests](#uso-de-tokens-en-requests)
6. [Testing de Seguridad](#testing-de-seguridad)
7. [Troubleshooting](#troubleshooting)
8. [Mejores Prácticas](#mejores-prácticas)

---

## 🎯 Introducción

Este sistema utiliza **JSON Web Tokens (JWT)** para autenticación y autorización. Los tokens son seguros, tienen expiración y contienen información del usuario codificada.

### ¿Qué es un JWT?

Un JWT tiene 3 partes separadas por puntos:
```
header.payload.signature
```

**Ejemplo:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

---

## ⚙️ Configuración

### Variables de Entorno

Configura en tu archivo `.env`:

```env
# JWT Configuration
JWT_SECRET=tu-secret-super-seguro-cambialo-en-produccion
JWT_EXPIRES_IN=1h

# Para producción, usa un secret más fuerte
# Generar secret seguro: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Configuración Actual

- **Secret:** Variable de entorno segura
- **Expiración:** Configurable (por defecto: 1 hora)
- **Algoritmo:** HS256 (HMAC SHA256)

---

## 🔑 Autenticación de Usuarios

### 1. Login

#### Endpoint
```
POST /api/auth/login
```

#### Request Body
```json
{
  "username": "admin",
  "password": "admin123"
}
```

#### Respuesta Exitosa
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@uttecam.edu.mx",
    "role": "admin"
  }
}
```

#### Ejemplo con cURL
```bash
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

#### Ejemplo con JavaScript
```javascript
const response = await fetch('http://localhost:3002/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'admin',
    password: 'admin123'
  })
});

const data = await response.json();
const token = data.token;
```

### 2. Registro de Usuario

⚠️ **Nota:** Solo administradores pueden registrar nuevos usuarios.

#### Endpoint
```
POST /api/auth/register
```

#### Headers Requeridos
```
Authorization: Bearer <TOKEN_ADMIN>
Content-Type: application/json
```

#### Request Body
```json
{
  "username": "nuevouser",
  "email": "user@uttecam.edu.mx",
  "password": "Password123!",
  "role": "viewer"
}
```

#### Roles Disponibles
- `admin` - Acceso completo
- `editor` - Puede editar contenido
- `viewer` - Solo lectura

---

## ✅ Verificación de Tokens

### Métodos de Verificación

#### 1. Verificación Automática (Middleware)

El sistema verifica automáticamente los tokens en rutas protegidas:

```typescript
// src/middleware/auth.ts
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.slice(7) 
    : null;

  if (!token) {
    return res.status(401).json({
      error: 'Token de acceso requerido',
      message: 'Debe proporcionar un token válido en el header Authorization'
    });
  }

  const decoded = verifyToken(token);
  
  if (!decoded) {
    return res.status(403).json({
      error: 'Token inválido',
      message: 'El token proporcionado no es válido o ha expirado'
    });
  }

  req.user = decoded;
  next();
};
```

#### 2. Verificación Manual

```typescript
import { verifyToken } from '../middleware/auth';

// Verificar un token manualmente
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
const decoded = verifyToken(token);

if (decoded) {
  console.log('Token válido');
  console.log('Usuario:', decoded.username);
  console.log('Rol:', decoded.role);
} else {
  console.log('Token inválido o expirado');
}
```

#### 3. Verificar Token desde el Cliente

**Endpoint de Perfil (requiere token válido):**
```
GET /api/auth/profile
```

**Request:**
```bash
curl http://localhost:3002/api/auth/profile \
  -H "Authorization: Bearer TU_TOKEN_JWT"
```

**Respuesta Exitosa (200):**
```json
{
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@uttecam.edu.mx",
    "role": "admin",
    "isActive": true
  }
}
```

**Respuesta Sin Token (401):**
```json
{
  "error": "Token de acceso requerido",
  "message": "Debe proporcionar un token válido en el header Authorization"
}
```

**Respuesta Token Inválido/Expirado (403):**
```json
{
  "error": "Token inválido",
  "message": "El token proporcionado no es válido o ha expirado"
}
```

### Validaciones que Realiza el Sistema

1. ✅ **Presencia del Token**
   - Verifica que exista el header `Authorization`
   - Verifica que tenga el prefijo `Bearer `

2. ✅ **Firma del Token**
   - Valida que el token fue firmado con el `JWT_SECRET` correcto
   - Rechaza tokens manipulados o falsificados

3. ✅ **Expiración**
   - Verifica que el token no haya expirado
   - Rechaza tokens vencidos (status 403)

4. ✅ **Estructura del Payload**
   - Valida que contenga `id`, `username`, y `role`
   - Verifica integridad de los datos

### Códigos de Respuesta HTTP

| Código | Significado | Cuándo Ocurre |
|--------|-------------|---------------|
| 200 | OK | Token válido, acceso concedido |
| 401 | Unauthorized | No se proporcionó token o formato incorrecto |
| 403 | Forbidden | Token inválido o expirado |
| 500 | Server Error | Error interno del servidor |

---

## 🚀 Uso de Tokens en Requests

### Formato del Header

```
Authorization: Bearer <TOKEN>
```

⚠️ **Importante:** El prefijo `Bearer ` (con espacio) es obligatorio.

### Ejemplos de Uso

#### cURL
```bash
curl http://localhost:3002/api/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### JavaScript (Fetch API)
```javascript
const token = localStorage.getItem('token');

fetch('http://localhost:3002/api/auth/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
  .then(response => response.json())
  .then(data => console.log(data));
```

#### Axios
```javascript
import axios from 'axios';

const token = localStorage.getItem('token');

axios.get('http://localhost:3002/api/auth/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
  .then(response => console.log(response.data));
```

#### Postman

1. Ir a la pestaña **Headers**
2. Agregar header:
   - **Key:** `Authorization`
   - **Value:** `Bearer eyJhbGciOi...`

O usar la pestaña **Authorization**:
- **Type:** Bearer Token
- **Token:** `eyJhbGciOi...`

---

## 🧪 Testing de Seguridad

### Test Automático Completo

Ejecuta el test completo de seguridad de tokens:

```bash
npm run test:tokens
```

Este test verifica:
- ✅ Generación de tokens
- ✅ Expiración de tokens
- ✅ Tokens con firma inválida
- ✅ Tokens manipulados
- ✅ Acceso sin token
- ✅ Acceso con token expirado
- ✅ Acceso con token válido
- ✅ Formato del header Authorization
- ✅ Verificación de roles
- ✅ Decodificación segura

**Documentación completa del test:**
- [`TEST_TOKEN_SECURITY.md`](./TEST_TOKEN_SECURITY.md)
- [`GUIA_VISUAL_TEST_TOKENS.md`](./GUIA_VISUAL_TEST_TOKENS.md)
- [`RESUMEN_TEST_TOKENS.md`](./RESUMEN_TEST_TOKENS.md)

### Tests Manuales Rápidos

#### 1. Verificar Token Válido
```bash
# Primero, obtener un token
TOKEN=$(curl -s -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  | grep -o '"token":"[^"]*"' \
  | sed 's/"token":"\(.*\)"/\1/')

# Usar el token
curl http://localhost:3002/api/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

#### 2. Verificar Rechazo Sin Token
```bash
curl http://localhost:3002/api/auth/profile
# Debe retornar 401
```

#### 3. Verificar Rechazo con Token Inválido
```bash
curl http://localhost:3002/api/auth/profile \
  -H "Authorization: Bearer token_invalido"
# Debe retornar 403
```

#### 4. Verificar Formato de Header
```bash
# Sin prefijo "Bearer" - debe fallar
curl http://localhost:3002/api/auth/profile \
  -H "Authorization: eyJhbGciOi..."
# Debe retornar 401
```

---

## 🔧 Troubleshooting

### Error: "Token de acceso requerido"

**Causa:** No se envió el header `Authorization` o está vacío.

**Solución:**
```javascript
// ✅ Correcto
headers: {
  'Authorization': `Bearer ${token}`
}

// ❌ Incorrecto
headers: {
  // Falta el header
}
```

### Error: "Token inválido"

**Posibles causas:**

1. **Token manipulado o modificado**
   ```javascript
   // No modifiques el token manualmente
   const token = originalToken.slice(0, -5) + 'XXXXX'; // ❌
   ```

2. **Token expirado**
   ```bash
   # Obtén un nuevo token haciendo login
   curl -X POST http://localhost:3002/api/auth/login ...
   ```

3. **JWT_SECRET incorrecto**
   ```env
   # Verifica que el .env tenga el secret correcto
   JWT_SECRET=tu-secret-super-seguro-cambialo-en-produccion
   ```

4. **Formato incorrecto**
   ```javascript
   // ✅ Correcto
   Authorization: Bearer eyJhbGci...
   
   // ❌ Incorrecto (falta "Bearer ")
   Authorization: eyJhbGci...
   ```

### Token Expira Muy Rápido

**Configuración actual de testing:**
```env
JWT_EXPIRES_IN=5 segundos  # Solo para pruebas
```

**Para producción:**
```env
JWT_EXPIRES_IN=1h   # 1 hora
# o
JWT_EXPIRES_IN=15m  # 15 minutos
```

### No Puedo Acceder a Rutas Protegidas

**Checklist:**

1. ✅ ¿El servidor está corriendo?
   ```bash
   npm run dev
   ```

2. ✅ ¿Tienes un token válido?
   ```bash
   # Hacer login primero
   POST /api/auth/login
   ```

3. ✅ ¿El header está bien formateado?
   ```
   Authorization: Bearer <token>
   ```

4. ✅ ¿El token no ha expirado?
   ```javascript
   // Decodificar token para ver expiración
   const decoded = jwt.decode(token);
   console.log(new Date(decoded.exp * 1000));
   ```

5. ✅ ¿Tu usuario tiene el rol necesario?
   ```javascript
   // Algunas rutas requieren rol específico
   // admin: acceso completo
   // editor: puede editar
   // viewer: solo lectura
   ```

---

## 🛡️ Mejores Prácticas

### ✅ HACER

1. **Usar HTTPS en producción**
   ```javascript
   // Los tokens se envían en headers, usa HTTPS
   const API_URL = 'https://api.uttecam.edu.mx';
   ```

2. **Almacenar tokens de forma segura**
   ```javascript
   // En aplicaciones web, considera httpOnly cookies
   // o sessionStorage para mayor seguridad
   sessionStorage.setItem('token', data.token);
   ```

3. **Manejar expiración de tokens**
   ```javascript
   // Implementar refresh tokens o re-login automático
   if (response.status === 403) {
     // Token expirado, hacer re-login
     redirectToLogin();
   }
   ```

4. **Validar siempre con verifyToken()**
   ```typescript
   // ✅ Correcto - verifica firma y expiración
   const decoded = verifyToken(token);
   
   // ❌ Incorrecto - solo decodifica, no verifica
   const decoded = jwt.decode(token);
   ```

5. **Usar expiración apropiada**
   ```env
   # Tokens de acceso: cortos
   JWT_EXPIRES_IN=15m
   
   # Refresh tokens: largos (si implementas)
   REFRESH_TOKEN_EXPIRES_IN=7d
   ```

### ❌ NO HACER

1. **No almacenar tokens en localStorage en producción**
   ```javascript
   // ❌ Vulnerable a XSS
   localStorage.setItem('token', token);
   
   // ✅ Mejor usar httpOnly cookies o sessionStorage
   ```

2. **No enviar tokens en URLs**
   ```javascript
   // ❌ Nunca hagas esto
   const url = `/api/data?token=${token}`;
   
   // ✅ Siempre en headers
   headers: { 'Authorization': `Bearer ${token}` }
   ```

3. **No incluir información sensible en el payload**
   ```typescript
   // ❌ No incluyas passwords, datos bancarios, etc
   const payload = {
     id: user.id,
     password: user.password  // ❌ NO!
   };
   
   // ✅ Solo datos necesarios y no sensibles
   const payload = {
     id: user.id,
     username: user.username,
     role: user.role
   };
   ```

4. **No ignores errores de verificación**
   ```typescript
   // ❌ No hagas esto
   try {
     jwt.verify(token, secret);
   } catch (e) {
     // Ignorar error ❌
   }
   
   // ✅ Maneja apropiadamente
   const decoded = verifyToken(token);
   if (!decoded) {
     return res.status(403).json({ error: 'Token inválido' });
   }
   ```

5. **No uses el mismo secret en desarrollo y producción**
   ```env
   # .env.development
   JWT_SECRET=dev-secret-123
   
   # .env.production
   JWT_SECRET=<secret-super-fuerte-aleatorio-de-32-chars>
   ```

---

## 📚 Estructura del Token

### Header
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### Payload (datos del usuario)
```json
{
  "id": 1,
  "username": "admin",
  "role": "admin",
  "iat": 1761270190,  // Issued at (timestamp)
  "exp": 1761273790   // Expiration (timestamp)
}
```

### Signature
```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  JWT_SECRET
)
```

---

## 🔗 Referencias

### Documentación Relacionada
- [SECURITY.md](./SECURITY.md) - Características de seguridad completas
- [ADMIN_USER.md](./ADMIN_USER.md) - Gestión de usuarios admin
- [RUTAS_PUBLICAS_PROTEGIDAS.md](./RUTAS_PUBLICAS_PROTEGIDAS.md) - Control de acceso

### Tests de Seguridad
- [TEST_TOKEN_SECURITY.md](./TEST_TOKEN_SECURITY.md) - Test completo
- [GUIA_VISUAL_TEST_TOKENS.md](./GUIA_VISUAL_TEST_TOKENS.md) - Guía visual
- [RESUMEN_TEST_TOKENS.md](./RESUMEN_TEST_TOKENS.md) - Resumen ejecutivo

### Archivos del Sistema
- `src/middleware/auth.ts` - Middleware de autenticación
- `src/controllers/authController.ts` - Controladores de auth
- `src/routes/auth.ts` - Rutas de autenticación

### Recursos Externos
- [JWT.io](https://jwt.io/) - Decodificar y debuggear tokens
- [OWASP JWT Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
- [RFC 7519](https://tools.ietf.org/html/rfc7519) - JSON Web Token Standard

---

**Última actualización:** 23 de octubre de 2025  
**Versión:** 2.0.0-secure
