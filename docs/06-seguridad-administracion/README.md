# 🔒 06. Seguridad y Administración

## Documentos en esta sección

Todo sobre seguridad, autenticación, verificación de tokens y administración del sistema.

### 📄 Documentos Principales

1. **[AUTENTICACION_JWT.md](./AUTENTICACION_JWT.md)** ⭐ **NUEVO** - Guía Completa de JWT
   - Cómo funciona JWT
   - Login y obtención de tokens
   - **Verificación de tokens** (manual y automática)
   - Uso de tokens en requests
   - Testing de seguridad
   - Troubleshooting completo
   - Mejores prácticas
   - **Ideal para:** Entender y usar autenticación JWT

2. **[SECURITY.md](./SECURITY.md)** - Características de Seguridad
   - JWT Authentication
   - Password Hashing (bcrypt)
   - Rate Limiting
   - Input Validation
   - SQL Injection Protection
   - XSS Protection
   - CORS configurado
   - Helmet.js
   - **Ideal para:** Implementar seguridad, auditorías

3. **[ADMIN_USER.md](./ADMIN_USER.md)** - Usuario Administrador
   - Credenciales por defecto
   - Cómo obtener token JWT
   - Usar token en requests
   - Ejemplos de endpoints protegidos
   - Permisos del administrador
   - Cambiar contraseña
   - **Ideal para:** Administradores, testing de API

4. **[RUTAS_PUBLICAS_PROTEGIDAS.md](./RUTAS_PUBLICAS_PROTEGIDAS.md)** - Control de Acceso
   - Rutas públicas vs protegidas
   - Middleware de autenticación
   - Roles y permisos
   - **Ideal para:** Entender control de acceso

### 🧪 Testing de Seguridad

5. **[RESUMEN_TEST_TOKENS.md](./RESUMEN_TEST_TOKENS.md)** ⭐ **NUEVO** - Resumen Ejecutivo
   - Resumen del sistema de testing
   - Resultados y estadísticas
   - Guía rápida de uso
   - **Ideal para:** Vista general del testing

6. **[TEST_TOKEN_SECURITY.md](./TEST_TOKEN_SECURITY.md)** **NUEVO** - Test Completo
   - 10 tests de seguridad implementados
   - Descripción detallada de cada test
   - Interpretación de resultados
   - Recomendaciones de seguridad
   - **Ideal para:** Testing profundo de JWT

7. **[GUIA_VISUAL_TEST_TOKENS.md](./GUIA_VISUAL_TEST_TOKENS.md)** **NUEVO** - Guía Visual
   - Interpretación visual de resultados
   - Códigos de color explicados
   - Ejemplos de salidas
   - Troubleshooting visual
   - **Ideal para:** Entender resultados de tests

---

## 🔐 Inicio Rápido

### 1. Verificar Seguridad de Tokens

```bash
# Ejecutar test completo de seguridad
npm run test:tokens
```

Este comando ejecuta 10 tests que verifican:
- ✅ Generación correcta de tokens
- ✅ Expiración de tokens
- ✅ Rechazo de tokens inválidos
- ✅ Protección de rutas
- ✅ Validación de formato
- ✅ Y más...

**Ver:** [RESUMEN_TEST_TOKENS.md](./RESUMEN_TEST_TOKENS.md) para detalles.

### 2. Obtener Token JWT (Login)

```bash
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

**Respuesta:**
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

### 3. Verificar Token (Obtener Perfil)

```bash
curl http://localhost:3002/api/auth/profile \
  -H "Authorization: Bearer TU_TOKEN_JWT"
```

**Respuestas posibles:**
- ✅ **200 OK** - Token válido
- ❌ **401 Unauthorized** - Token no proporcionado
- ❌ **403 Forbidden** - Token inválido o expirado

### 4. Usar Token en Requests

```bash
# Reemplaza TU_TOKEN_JWT con el token obtenido
curl http://localhost:3002/api/textos \
  -H "Authorization: Bearer TU_TOKEN_JWT"
```

**Ver:** [AUTENTICACION_JWT.md](./AUTENTICACION_JWT.md) para guía completa.

---

## 🎯 Guía de Verificación de Tokens

### ¿Cómo saber si un token es válido?

#### Método 1: Usar el endpoint de perfil
```bash
curl http://localhost:3002/api/auth/profile \
  -H "Authorization: Bearer <TOKEN>"
```

- Si retorna **200**: Token válido ✅
- Si retorna **401**: No enviaste token ❌
- Si retorna **403**: Token inválido o expirado ❌

#### Método 2: Ejecutar tests automáticos
```bash
npm run test:tokens
```

Verifica automáticamente:
- Tokens válidos
- Tokens expirados
- Tokens manipulados
- Formato correcto
- Firma válida

#### Método 3: Verificación programática
```typescript
import { verifyToken } from './middleware/auth';

const token = 'eyJhbGci...';
const decoded = verifyToken(token);

if (decoded) {
  console.log('✅ Token válido');
  console.log('Usuario:', decoded.username);
} else {
  console.log('❌ Token inválido');
}
```

**Ver:** [AUTENTICACION_JWT.md#verificación-de-tokens](./AUTENTICACION_JWT.md#verificación-de-tokens)

---

## 🔐 Credenciales por Defecto

### Usuario Administrador
```
Username: admin
Password: admin123
Email: admin@uttecam.edu.mx
```

⚠️ **IMPORTANTE:** Cambiar estas credenciales en producción.

### Crear Nuevo Usuario Admin
```bash
npm run create:admin
```

---

## 🚀 Comandos Útiles

```bash
# Testing de seguridad
npm run test:tokens          # Test completo de tokens JWT

# Gestión de usuarios
npm run create:admin         # Crear usuario administrador

# Base de datos
npm run db:reset             # Reset completo de BD
npm run db:seed              # Seed de datos iniciales
```

---

## 🛡️ Características de Seguridad

### ✅ Implementadas

1. **Autenticación JWT**
   - Tokens seguros
   - Expiración configurable
   - Refresh tokens (opcional)

2. **Encriptación de Contraseñas**
   - bcrypt con salt rounds
   - No se almacenan contraseñas en texto plano

3. **Rate Limiting**
   - Protección contra fuerza bruta
   - Límites por IP
   - Diferentes límites por endpoint

4. **Validación de Datos**
   - express-validator
   - Sanitización de inputs
   - Validación de tipos

5. **Protección SQL Injection**
   - Sequelize ORM
   - Queries parametrizadas
   - Escape automático

6. **Headers de Seguridad**
   - Helmet.js
   - CORS configurado
   - XSS Protection

7. **Logging de Seguridad**
   - Registro de intentos de login
   - Logs de acceso
   - Detección de anomalías

---

## 👤 Roles de Usuario

### Admin
- Acceso total a todos los endpoints
- Crear, editar, eliminar usuarios
- Gestionar todo el contenido
- Ver logs y estadísticas

### User (futuro)
- Acceso limitado
- Solo lectura de algunos recursos
- Crear solicitudes

### Public
- Solo endpoints públicos
- Sin autenticación
- Lectura de contenido público

---

## 🔧 Comandos Útiles

### Crear Usuario Administrador
```bash
npm run create-admin
```

### Verificar Estado de Seguridad
```bash
curl http://localhost:3000/health
```

### Cambiar Contraseña de Admin
```bash
curl -X PUT http://localhost:3000/api/auth/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN" \
  -d '{
    "oldPassword": "Admin2024!",
    "newPassword": "NuevaPassword123!"
  }'
```

---

## ⚠️ Mejores Prácticas

### ✅ Hacer
- Cambiar credenciales por defecto
- Usar HTTPS en producción
- Mantener JWT_SECRET seguro
- Rotar tokens regularmente
- Monitorear logs de seguridad
- Mantener dependencias actualizadas
- Hacer backups regulares

### ❌ NO Hacer
- Compartir tokens JWT
- Commit de archivos .env
- Usar contraseñas débiles
- Deshabilitar validaciones
- Ignorar logs de seguridad
- Exponer información sensible en errores

---

## 📋 Documentos Relacionados

- **[API_REFERENCE.md](../04-api-referencia/API_REFERENCE.md)** - Endpoints de autenticación
- **[DEPLOYMENT.md](../05-despliegue/DEPLOYMENT.md)** - Seguridad en producción
- **[ARCHITECTURE.md](../08-arquitectura/ARCHITECTURE.md)** - Arquitectura de seguridad

---

[← Volver al índice principal](../README.md)
