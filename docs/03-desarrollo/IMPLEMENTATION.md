# 🚀 GUÍA DE IMPLEMENTACIÓN OWASP
## Implementación Completa de Seguridad UTTECAM API

---

## 📋 RESUMEN DE IMPLEMENTACIÓN

**✅ ESTADO: IMPLEMENTACIÓN COMPLETA**

Se ha implementado exitosamente el **OWASP Top 10 2021** en la API UTTECAM con las siguientes mejoras:

### 🔧 Archivos Creados/Modificados

#### Nuevos Archivos de Seguridad:
```
src/middleware/
├── auth.ts              # Sistema de autenticación JWT
├── rateLimiter.ts       # Rate limiting multicapa
├── security.ts          # Headers de seguridad
├── validation.ts        # Validación de entrada
└── logging.ts           # Logging de seguridad

src/controllers/
└── authController.ts    # Controlador de autenticación

src/routes/
└── auth.ts             # Rutas de autenticación

src/models/
└── User.ts             # Modelo de usuario seguro
```

#### Archivos Modificados:
```
src/app.ts              # Integración de middleware de seguridad
src/routes/textos.ts    # Protección de endpoints
src/routes/nosotros.ts  # Protección de endpoints  
src/routes/directorio.ts # Protección de endpoints
src/middleware/uploadMiddleware.ts # Reescrito completamente para seguridad
```

---

## 🔒 CARACTERÍSTICAS DE SEGURIDAD IMPLEMENTADAS

### 1. Sistema de Autenticación JWT ✅
- Registro y login de usuarios
- Tokens con expiración (24h)
- Hash de contraseñas con bcrypt (12 rounds)
- Sistema de roles (admin, editor, viewer)
- Protección contra fuerza bruta

### 2. Rate Limiting Multicapa ✅
- Límite general: 100 requests/15min
- Límite auth: 5 requests/15min  
- Speed limiting: retraso progresivo
- Protección DDoS básica

### 3. Headers de Seguridad ✅
- Helmet con CSP completo
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- HSTS habilitado
- XSS Protection

### 4. Validación de Entrada ✅
- Express-validator en todos los endpoints
- Sanitización automática
- Validación de tipos de datos
- Manejo centralizado de errores

### 5. Logging de Seguridad ✅
- Winston con rotación diaria
- Logs de autenticación
- Detección de patrones de ataque
- Logs estructurados en JSON

### 6. CORS Restrictivo ✅
- Orígenes específicos permitidos
- Credentials habilitados
- Headers controlados

### 7. Upload Seguro ✅
- Validación de tipos MIME
- Verificación de firmas de archivo
- Límites de tamaño
- Extensiones permitidas

---

## 🛠️ DEPENDENCIAS INSTALADAS

```json
{
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2", 
  "helmet": "^7.1.0",
  "express-rate-limit": "^7.1.5",
  "express-slow-down": "^2.0.1",
  "express-validator": "^7.0.1",
  "winston": "^3.11.0",
  "winston-daily-rotate-file": "^5.0.0",
  "morgan": "^1.10.0"
}
```

---

## 🚀 COMANDOS DE DESPLIEGUE

### Para Desarrollo:
```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con valores seguros

# Ejecutar en desarrollo
npm run dev
```

### Para Producción:
```bash
# Compilar TypeScript
npm run build

# Ejecutar en producción
npm start
```

---

## 🔧 CONFIGURACIÓN REQUERIDA

### Variables de Entorno (.env):
```bash
# Base de datos
DB_HOST=localhost
DB_USER=uttecam_user
DB_PASSWORD=password_segura_aqui
DB_NAME=uttecam_dev

# JWT (OBLIGATORIO - generar clave segura)
JWT_SECRET=clave_secreta_muy_robusta_256_bits_minimo

# Aplicación
NODE_ENV=production
PORT=3002

# Logging
LOG_LEVEL=info
LOG_DIR=./logs
```

### Generar JWT_SECRET Seguro:
```bash
# En Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# O usar openssl
openssl rand -hex 64
```

---

## 📊 ENDPOINTS DISPONIBLES

### 🔓 Públicos (sin autenticación):
```
GET  /                      # Información de la API
GET  /health               # Health check con métricas
GET  /api/textos           # Listar textos
GET  /api/textos/:id       # Obtener texto específico  
GET  /api/textos/stats     # Estadísticas
GET  /api/nosotros/tipos   # Tipos de contenido
GET  /api/nosotros/contenido # Listar contenido
GET  /api/nosotros/contenido/:id # Contenido específico
GET  /api/directorios      # Listar directorios
GET  /api/directorios/:id  # Directorio específico
```

### 🔒 Protegidos (requieren autenticación):
```
# Autenticación
POST /api/auth/login       # Login de usuario
POST /api/auth/register    # Registro (requiere auth previa)
POST /api/auth/logout      # Logout
GET  /api/auth/profile     # Perfil del usuario

# Textos
POST /api/textos           # Crear texto
PUT  /api/textos/:id       # Actualizar texto
DELETE /api/textos/:id     # Eliminar texto

# Nosotros  
POST /api/nosotros/contenido   # Crear contenido
PUT  /api/nosotros/contenido/:id # Actualizar contenido
DELETE /api/nosotros/contenido/:id # Eliminar contenido

# Directorios
POST /api/directorios      # Crear directorio
PUT  /api/directorios/:id  # Actualizar directorio
DELETE /api/directorios/:id # Eliminar directorio
```

---

## 🧪 TESTING DE LA IMPLEMENTACIÓN

### 1. Verificar Health Check:
```bash
curl http://localhost:3002/health
```

**Respuesta esperada:**
```json
{
  "status": "OK",
  "api_version": "2.0.0-secure",
  "security": {
    "headers": "enabled",
    "cors": "restricted", 
    "rateLimit": "active",
    "authentication": "jwt",
    "fileValidation": "active",
    "logging": "enabled"
  }
}
```

### 2. Probar Rate Limiting:
```bash
# Hacer múltiples requests rápidos
for i in {1..10}; do curl http://localhost:3002/health; done
```

### 3. Verificar Autenticación:
```bash
# Intentar acceso sin token (debe fallar)
curl -X POST http://localhost:3002/api/textos

# Intentar con datos inválidos
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"","password":""}'
```

### 4. Verificar Headers de Seguridad:
```bash
curl -I http://localhost:3002/
# Buscar headers: X-Frame-Options, X-Content-Type-Options, etc.
```

---

## 📁 ESTRUCTURA DE LOGS

Los logs se generan automáticamente en:
```
logs/
├── app-2024-10-06.log          # Logs generales
├── error-2024-10-06.log        # Errores
├── security-2024-10-06.log     # Eventos de seguridad
└── [archivos anteriores...]    # Rotación automática
```

### Monitorear Logs en Tiempo Real:
```bash
# Logs generales
tail -f logs/app-$(date +%Y-%m-%d).log

# Logs de seguridad
tail -f logs/security-$(date +%Y-%m-%d).log

# Errores
tail -f logs/error-$(date +%Y-%m-%d).log
```

---

## 🔍 VERIFICACIÓN DE SEGURIDAD

### Checklist de Verificación:

- [ ] ✅ Servidor inicia sin errores
- [ ] ✅ Health check responde con métricas de seguridad
- [ ] ✅ Endpoints públicos accesibles sin autenticación
- [ ] ✅ Endpoints protegidos requieren token JWT
- [ ] ✅ Rate limiting funciona (límites por IP)
- [ ] ✅ Headers de seguridad presentes
- [ ] ✅ Validación de entrada funciona
- [ ] ✅ Logs se generan correctamente
- [ ] ✅ CORS restrictivo configurado
- [ ] ✅ Upload de archivos validado

### Herramientas de Testing Recomendadas:

1. **OWASP ZAP** - Escaneo automático
2. **Postman** - Testing de API
3. **Burp Suite** - Análisis de seguridad
4. **curl** - Pruebas de línea de comandos

---

## 🚨 TROUBLESHOOTING

### Problemas Comunes:

#### 1. Error de JWT_SECRET:
```
Error: JWT_SECRET not defined
```
**Solución:** Configurar JWT_SECRET en .env

#### 2. Error de Base de Datos:
```
Error: Unable to connect to database
```
**Solución:** Verificar credenciales en .env

#### 3. Warning de express-slow-down:
```
ExpressSlowDownWarning: delayMs option changed
```
**Solución:** Es solo un warning, no afecta funcionalidad

#### 4. Rate Limit Alcanzado:
```
Error: Too many requests
```
**Solución:** Esperar 15 minutos o cambiar IP

---

## 📈 PRÓXIMOS PASOS RECOMENDADOS

### Para Producción:
1. **SSL/TLS:** Configurar certificados HTTPS
2. **Firewall:** Configurar reglas de red
3. **Monitoreo:** Implementar alertas en tiempo real
4. **Backup:** Configurar respaldos de base de datos
5. **CI/CD:** Integrar testing de seguridad

### Para Mejoras Futuras:
1. **2FA:** Autenticación de dos factores
2. **OAuth:** Integración con proveedores externos
3. **API Keys:** Sistema complementario de API keys
4. **Audit Trail:** Registro completo de cambios
5. **Geoblocking:** Bloqueo por ubicación geográfica

---

## 📞 SOPORTE

Para consultas sobre la implementación:

**Email:** dev@uttecam.edu.mx  
**Documentación:** `/docs/SECURITY.md`  
**Estado del Sistema:** `GET /health`

---

**🎉 ¡Implementación OWASP Top 10 Completada Exitosamente!**

*La API UTTECAM ahora cuenta con seguridad de nivel empresarial.*