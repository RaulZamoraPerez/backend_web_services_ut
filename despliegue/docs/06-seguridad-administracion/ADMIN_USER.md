# 👤 Usuario Administrador - UTTECAM API

## 🎯 Usuario Administrador Creado

Se ha creado exitosamente el usuario administrador para la API UTTECAM con las siguientes credenciales:

### 🔑 Credenciales de Acceso

```
Username: admin
Email: admin@uttecam.edu.mx
Password: Admin123!@#
Role: admin
Estado: Activo
```

---

## 🚀 Cómo Usar

### 1. Login (Obtener Token JWT)

**Endpoint:** `POST /api/auth/login`

**Body (JSON):**
```json
{
  "username": "admin",
  "password": "Admin123!@#"
}
```

**Respuesta exitosa:**
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Usar Token en Requests

Incluir el token en el header `Authorization` para acceder a endpoints protegidos:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Ejemplos de Endpoints Protegidos

#### Crear Texto:
```bash
POST /api/textos
Authorization: Bearer <token>
Content-Type: application/json

{
  "titulo": "Mi Texto",
  "contenido": "Contenido del texto",
  "tipo": "noticia"
}
```

#### Ver Perfil:
```bash
GET /api/auth/profile
Authorization: Bearer <token>
```

#### Crear Usuario:
```bash
POST /api/auth/register
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "nuevo_usuario",
  "email": "usuario@uttecam.edu.mx",
  "password": "Password123!",
  "role": "editor"
}
```

---

## 🔧 Scripts Útiles

### Crear Usuario Admin (nuevamente)
```bash
npm run create:admin
```

### Verificar Estado de Seguridad
```bash
npm run security:test
```

### Login via cURL
```bash
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123!@#"}'
```

### Login via PowerShell
```powershell
$response = Invoke-RestMethod -Uri "http://localhost:3002/api/auth/login" -Method POST -ContentType "application/json" -Body '{"username":"admin","password":"Admin123!@#"}'
$token = $response.token
echo $token
```

---

## 🛡️ Permisos del Administrador

Como administrador, puedes:

- ✅ **Crear, editar y eliminar textos**
- ✅ **Crear, editar y eliminar contenido 'nosotros'**  
- ✅ **Crear, editar y eliminar directorios**
- ✅ **Registrar nuevos usuarios**
- ✅ **Acceder a todos los endpoints protegidos**
- ✅ **Ver perfiles de usuario**
- ✅ **Gestionar roles de usuarios**

---

## ⚠️ Seguridad

### Importante:
1. **Cambia la contraseña** después del primer login
2. **No compartas** las credenciales
3. **Usa HTTPS** en producción
4. **El token expira** en 24 horas
5. **Protege el JWT_SECRET** en producción

### Cambiar Contraseña:
Usar el endpoint `PUT /api/auth/profile` con el nuevo password.

---

## 🧪 Testing Completo

### 1. Verificar Health Check:
```bash
curl http://localhost:3002/health
```

### 2. Login y Obtener Token:
```bash
TOKEN=$(curl -s -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123!@#"}' | \
  jq -r '.token')
```

### 3. Crear Texto con Token:
```bash
curl -X POST http://localhost:3002/api/textos \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Test Admin","contenido":"Texto de prueba","tipo":"noticia"}'
```

### 4. Ver Perfil:
```bash
curl -X GET http://localhost:3002/api/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🔄 Recrear Usuario Admin

Si necesitas recrear el usuario administrador:

```bash
# 1. Eliminar usuario existente de la base de datos (opcional)
# 2. Ejecutar el script
npm run create:admin
```

El script verifica automáticamente si ya existe un administrador y no creará duplicados.

---

## 📊 Estado del Sistema

Para verificar que todo funciona correctamente:

```bash
# Health check con métricas de seguridad
curl http://localhost:3002/health

# Debe mostrar:
# - status: "OK"
# - api_version: "2.0.0-secure"  
# - security.authentication: "jwt"
# - security.rateLimit: "active"
```

---

## 📞 Soporte

Si tienes problemas con el usuario administrador:

1. Verifica que el servidor esté corriendo
2. Verifica la conexión a la base de datos
3. Revisa los logs en `logs/security-*.log`
4. Ejecuta `npm run create:admin` para recrear el usuario

---

**🎉 ¡Usuario administrador listo para usar!**