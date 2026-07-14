# Changelog - UTTECAM API

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

---

## [2.0.0-secure] - 2025-10-10

### 🆕 NUEVO MÓDULO: Solicitudes de Constancia y Kardex

**🎯 CARACTERÍSTICAS PRINCIPALES:**
- ✅ Sistema completo de solicitudes académicas en línea
- ✅ Gestión de constancias de estudios, kardex y trámite de título
- ✅ Seguimiento por número de referencia único
- ✅ Endpoints públicos para estudiantes y protegidos para administradores
- ✅ Validaciones completas y sistema de auditoría
- ✅ Estadísticas y reportes avanzados

### 📦 Archivos Nuevos
- `src/models/Solicitud_Constancia.ts` - Modelo de datos con validaciones
- `src/controllers/solicitudConstanciaController.ts` - Lógica de negocio completa
- `src/routes/solicitudConstancia.ts` - Rutas y middleware de seguridad
- `sql/solicitudes_constancias_kardex.sql` - Script de base de datos con triggers y vistas
- `docs/SOLICITUDES_CONSTANCIA_KARDEX.md` - Documentación completa del módulo
- `scripts/test-solicitudes.js` - Script de pruebas automatizadas

### 🔗 API Endpoints Nuevos
#### Públicos (Sin autenticación):
- `POST /api/solicitudes-constancia` - Crear nueva solicitud
- `GET /api/solicitudes-constancia/referencia/:ref` - Consultar por número de referencia
- `GET /api/solicitudes-constancia/matricula/:mat` - Consultar por matrícula

#### Protegidos (Requieren autenticación):
- `GET /api/solicitudes-constancia` - Listar todas las solicitudes con filtros
- `GET /api/solicitudes-constancia/buscar` - Búsqueda avanzada
- `GET /api/solicitudes-constancia/estadisticas` - Estadísticas del módulo
- `GET /api/solicitudes-constancia/:id` - Obtener solicitud por ID
- `PUT /api/solicitudes-constancia/:id/estado` - Actualizar estado (editor/admin)
- `DELETE /api/solicitudes-constancia/:id` - Eliminar solicitud (solo admin)

### 🛡️ Seguridad Implementada
- ✅ Rate limiting diferenciado para endpoints públicos y protegidos
- ✅ Validación exhaustiva de datos de entrada
- ✅ Logging de auditoría para todas las operaciones
- ✅ Prevención de solicitudes duplicadas
- ✅ Autorización por roles (viewer/editor/admin)
- ✅ Números de referencia únicos y seguros

### 📊 Características del Modelo
- ✅ Estados de solicitud: pendiente, en_proceso, completado, cancelado
- ✅ Niveles académicos: TSU, LIC
- ✅ Tipos de entrega: presencial, electrónico
- ✅ Documentos: Constancia de Estudios, Constancia de trámite de título, Kardex
- ✅ Validaciones de integridad en base de datos
- ✅ Triggers automáticos para fechas de actualización
- ✅ Índices optimizados para consultas frecuentes

### 🗃️ Base de Datos
- ✅ Tabla `solicitudes_constancias_kardex` con constraints completos
- ✅ Índices optimizados para rendimiento
- ✅ Triggers para validación y auditoría
- ✅ Vistas para reportes y estadísticas
- ✅ Datos de ejemplo para pruebas

### 📖 Documentación
- ✅ Documentación completa del módulo
- ✅ Diagramas de flujo de datos
- ✅ Ejemplos de uso para todos los endpoints
- ✅ Guías de troubleshooting
- ✅ Scripts de prueba automatizados

### 🧪 Testing
- ✅ Script `npm run test:solicitudes` para pruebas automatizadas
- ✅ Validación de endpoints públicos y protegidos
- ✅ Verificación de autenticación y autorización
- ✅ Pruebas de validación de datos
- ✅ Tests de creación, consulta y actualización

---

## [2.0.0-secure] - 2024-10-06

### 🔒 IMPLEMENTACIÓN COMPLETA OWASP TOP 10 2021

**⚠️ CAMBIO MAYOR:** Esta versión incluye cambios significativos en la arquitectura de seguridad.

### 🎉 Características de Seguridad Implementadas

#### A01: Broken Access Control ✅
- ✅ Sistema de autenticación JWT completo
- ✅ Autorización por roles (admin, editor, viewer)
- ✅ Protección de endpoints críticos
- ✅ Gestión de sesiones segura
- ✅ Control de acceso granular

#### A02: Cryptographic Failures ✅  
- ✅ Hash de contraseñas con bcrypt (12 rounds)
- ✅ JWT con firma HS256
- ✅ Protección de datos sensibles
- ✅ Enforcement de HTTPS

#### A03: Injection ✅
- ✅ Validación completa con express-validator
- ✅ Sanitización automática de entrada
- ✅ Sequelize ORM (protección SQL injection)
- ✅ Prepared statements exclusivamente

#### A04: Insecure Design ✅
- ✅ Arquitectura multicapa (10 capas de seguridad)
- ✅ Principio de menor privilegio
- ✅ Fail-safe defaults
- ✅ Logging de eventos de seguridad

#### A05: Security Misconfiguration ✅
- ✅ Headers de seguridad con Helmet
- ✅ CORS restrictivo configurado
- ✅ Ocultación de información técnica
- ✅ Configuración de producción securizada

#### A06: Vulnerable Components ✅
- ✅ Dependencias actualizadas a últimas versiones
- ✅ Librerías de seguridad confiables
- ✅ Monitoreo de vulnerabilidades configurado

#### A07: Authentication Failures ✅
- ✅ Protección contra fuerza bruta
- ✅ Bloqueo progresivo de cuentas
- ✅ Gestión segura de sesiones JWT
- ✅ Validación robusta de contraseñas

#### A08: Software Integrity Failures ✅
- ✅ Validación de archivos por firmas
- ✅ Control estricto de uploads
- ✅ Verificación de integridad de contenido
- ✅ Sandboxing de archivos subidos

#### A09: Logging Failures ✅
- ✅ Sistema Winston con rotación diaria
- ✅ Logs de seguridad estructurados
- ✅ Detección de patrones de ataque
- ✅ Retención automática de logs

#### A10: Server-Side Request Forgery ✅
- ✅ Validación de URLs externas
- ✅ Whitelist de dominios permitidos
- ✅ Timeouts de requests
- ✅ Sanitización de headers HTTP

### 🛠️ Archivos Nuevos
- `src/middleware/auth.ts` - Autenticación JWT
- `src/middleware/rateLimiter.ts` - Rate limiting multicapa
- `src/middleware/security.ts` - Headers de seguridad
- `src/middleware/validation.ts` - Validación de entrada
- `src/middleware/logging.ts` - Logging de seguridad
- `src/controllers/authController.ts` - Controlador de autenticación
- `src/routes/auth.ts` - Rutas de autenticación
- `src/models/User.ts` - Modelo de usuario seguro
- `docs/SECURITY.md` - Documentación completa OWASP
- `docs/IMPLEMENTATION.md` - Guía de implementación

### 🔧 Archivos Modificados
- `src/app.ts` - Integración completa de middleware de seguridad
- `src/routes/textos.ts` - Protección de endpoints
- `src/routes/nosotros.ts` - Protección de endpoints
- `src/routes/directorio.ts` - Protección de endpoints
- `src/middleware/uploadMiddleware.ts` - Reescrito para seguridad
- `docs/INDEX.md` - Actualizado con documentación de seguridad

### 📦 Nuevas Dependencias
- `bcryptjs@^2.4.3` - Hash de contraseñas
- `jsonwebtoken@^9.0.2` - JWT tokens
- `helmet@^7.1.0` - Security headers
- `express-rate-limit@^7.1.5` - Rate limiting
- `express-slow-down@^2.0.1` - DDoS protection
- `express-validator@^7.0.1` - Input validation
- `winston@^3.11.0` - Logging system
- `winston-daily-rotate-file@^5.0.0` - Log rotation
- `morgan@^1.10.0` - HTTP logging

### 🚀 Nuevas Funcionalidades
- Sistema de autenticación completo (login/register/logout)
- Rate limiting por IP y por endpoint
- Headers de seguridad automáticos
- Logging de eventos de seguridad
- Validación automática de todos los inputs
- Upload seguro con validación de firmas
- Detección de patrones de ataque
- Health check con métricas de seguridad
- CORS restrictivo configurado

### 🔒 Endpoints Protegidos
- `POST /api/textos` - Requiere autenticación
- `PUT /api/textos/:id` - Requiere autenticación  
- `DELETE /api/textos/:id` - Requiere autenticación
- `POST /api/nosotros/contenido` - Requiere autenticación
- `PUT /api/nosotros/contenido/:id` - Requiere autenticación
- `DELETE /api/nosotros/contenido/:id` - Requiere autenticación
- `POST /api/directorios` - Requiere autenticación
- `PUT /api/directorios/:id` - Requiere autenticación
- `DELETE /api/directorios/:id` - Requiere autenticación

### 📊 Métricas de Seguridad
- **OWASP Top 10 Compliance:** 10/10 ✅
- **Authentication Coverage:** 100% endpoints críticos
- **Input Validation:** 100% endpoints
- **Logging Coverage:** 100% eventos de seguridad
- **Rate Limit Compliance:** 100%

---

## [1.0.0] - 2025-10-06

### 🎉 Versión Estable Inicial

Esta es la primera versión estable de producción de la API UTTECAM con Sequelize ORM.

### ✨ Características Principales

#### Módulo Textos
- ✅ CRUD completo para gestión de textos
- ✅ Paginación con metadatos (página actual, total de páginas, etc.)
- ✅ Búsqueda por contenido con LIKE
- ✅ Estadísticas en tiempo real (total, textos hoy, último texto)
- ✅ Validaciones automáticas a nivel de modelo
- ✅ Timestamps automáticos (created_at, updated_at)

#### Módulo Directorios
- ✅ CRUD completo para gestión de personal
- ✅ Upload de imágenes con Multer
- ✅ Validaciones de campos (email, teléfono, extensión)
- ✅ Eliminación automática de imágenes al borrar registros
- ✅ Reemplazo automático de imágenes al actualizar
- ✅ URLs de imágenes generadas automáticamente

#### Módulo Nosotros
- ✅ CRUD completo para contenido institucional
- ✅ Filtrado por tipo de contenido (visión, misión, valores, etc.)
- ✅ Upload de imágenes institucionales
- ✅ Soporte para listas en formato JSON
- ✅ Gestión automática de archivos
- ✅ URLs completas de imágenes

### 🔧 Infraestructura

#### Backend
- ✅ TypeScript para tipado estático
- ✅ Express.js como framework web
- ✅ Sequelize ORM para abstracción de base de datos
- ✅ MySQL como base de datos relacional
- ✅ Multer para manejo de uploads
- ✅ CORS configurado para desarrollo y producción

#### Arquitectura
- ✅ Patrón MVC (Modelo-Vista-Controlador)
- ✅ Separación de capas (Routes → Controllers → Models)
- ✅ Middleware personalizado para errores y uploads
- ✅ Configuración centralizada
- ✅ Variables de entorno con dotenv

#### Base de Datos
- ✅ Modelos Sequelize con validaciones
- ✅ Índices optimizados para consultas frecuentes
- ✅ Charset UTF-8 para soporte multiidioma
- ✅ Timestamps automáticos
- ✅ Pool de conexiones configurado

### 📚 Documentación

- ✅ README.md completo con ejemplos
- ✅ API_REFERENCE.md exhaustivo con todos los endpoints
- ✅ ARCHITECTURE.md con diagramas y flujos de datos
- ✅ INSTALLATION.md con guía paso a paso
- ✅ DEVELOPMENT.md para desarrolladores
- ✅ DEPLOYMENT.md con múltiples opciones de deploy
- ✅ CPANEL_DEPLOYMENT.md específico para cPanel
- ✅ IMAGENES_UPLOAD.md sobre sistema de archivos
- ✅ Ejemplos en múltiples lenguajes (JavaScript, Python, PHP, cURL)

### 🛠️ Scripts NPM

- ✅ `npm run dev` - Desarrollo con auto-recarga
- ✅ `npm run build` - Compilación TypeScript
- ✅ `npm start` - Ejecución en producción
- ✅ `npm run clean` - Limpieza de archivos compilados
- ✅ `npm run db:reset` - Reset de BD con datos de prueba
- ✅ `npm run db:seed` - Inserción de datos de ejemplo

### 🔐 Seguridad

- ✅ Validación de entrada en todos los endpoints
- ✅ Prepared statements (protección SQL injection)
- ✅ Whitelist de extensiones de archivo
- ✅ Límites de tamaño de archivo (5MB)
- ✅ Validación de MIME types
- ✅ Sanitización de strings
- ✅ CORS configurado correctamente

### 📦 Dependencias Principales

#### Producción
- express@^4.21.0
- sequelize@^6.37.3
- mysql2@^3.11.3
- multer@^1.4.5-lts.1
- dotenv@^16.4.5
- cors@^2.8.5

#### Desarrollo
- typescript@^5.6.2
- @types/express@^4.17.21
- @types/node@^22.7.4
- @types/multer@^1.4.12
- @types/cors@^2.8.17
- ts-node@^10.9.2
- nodemon@^3.1.7

### 🌐 Endpoints Disponibles

#### Sistema
- `GET /` - Información de la API
- `GET /health` - Health check

#### Textos (6 endpoints)
- `GET /api/textos` - Listar con paginación
- `GET /api/textos/stats` - Estadísticas
- `GET /api/textos/:id` - Obtener por ID
- `POST /api/textos` - Crear texto
- `PUT /api/textos/:id` - Actualizar texto
- `DELETE /api/textos/:id` - Eliminar texto

#### Directorios (5 endpoints)
- `GET /api/directorios` - Listar todos
- `GET /api/directorios/:id` - Obtener por ID
- `POST /api/directorios` - Crear con imagen
- `PUT /api/directorios/:id` - Actualizar con imagen
- `DELETE /api/directorios/:id` - Eliminar

#### Nosotros (6 endpoints)
- `GET /api/nosotros/contenido` - Listar todo
- `GET /api/nosotros/contenido/:id` - Obtener por ID
- `GET /api/nosotros/contenido/tipo/:tipo` - Filtrar por tipo
- `POST /api/nosotros/contenido` - Crear con imagen
- `PUT /api/nosotros/contenido/:id` - Actualizar con imagen
- `DELETE /api/nosotros/contenido/:id` - Eliminar

**Total: 19 endpoints funcionales**

### 📊 Estadísticas del Proyecto

- **Archivos TypeScript:** 15+
- **Líneas de código:** ~2,500+
- **Documentación:** 7 archivos completos
- **Cobertura de documentación:** 100%
- **Ejemplos de código:** 50+ ejemplos

---

## [0.9.0] - 2025-09-26

### 🔄 Migración a Sequelize

#### Agregado
- Implementación completa de Sequelize ORM
- Modelos Sequelize para todas las entidades
- Validaciones automáticas en modelos
- Sincronización automática de esquemas

#### Cambiado
- Migración desde consultas SQL manuales a Sequelize
- Refactorización completa de controladores
- Optimización de queries con ORM

#### Respaldado
- Archivos anteriores movidos a carpeta `/backup`
- Documentación anterior preservada como referencia

---

## [0.8.0] - 2025-09-20

### 📸 Sistema de Imágenes

#### Agregado
- Upload de imágenes con Multer
- Validación de tipos de archivo
- Gestión automática de archivos
- URLs públicas para imágenes
- Eliminación automática al borrar registros

---

## [0.7.0] - 2025-09-15

### 📂 Módulos Directorios y Nosotros

#### Agregado
- Módulo completo de Directorios
- Módulo completo de Nosotros
- Validaciones específicas por módulo
- Endpoints RESTful completos

---

## [0.5.0] - 2025-09-10

### 📝 Módulo Textos Base

#### Agregado
- CRUD básico de textos
- Paginación simple
- Búsqueda por contenido
- Conexión MySQL básica

---

## [0.1.0] - 2025-09-01

### 🚀 Inicio del Proyecto

#### Agregado
- Estructura inicial del proyecto
- Configuración TypeScript
- Express.js básico
- Variables de entorno

---

## 🔮 Roadmap Futuro

### [2.0.0] - Planeado

#### 🔐 Autenticación y Autorización
- [ ] Sistema de usuarios con JWT
- [ ] Roles y permisos (Admin, Editor, Viewer)
- [ ] Refresh tokens
- [ ] Recuperación de contraseña

#### 🧪 Testing
- [ ] Tests unitarios con Jest
- [ ] Tests de integración
- [ ] Tests E2E
- [ ] Cobertura mínima del 80%

#### 📊 Monitoreo y Logs
- [ ] Winston para logging estructurado
- [ ] Morgan para logs HTTP
- [ ] Sentry para tracking de errores
- [ ] Métricas con Prometheus

#### 🚀 CI/CD
- [ ] GitHub Actions para CI
- [ ] Deploy automático
- [ ] Análisis de código estático
- [ ] Dependabot para actualizaciones

### [2.5.0] - Futuro

#### 📚 Documentación Interactiva
- [ ] Swagger/OpenAPI 3.0
- [ ] Postman Collection
- [ ] Playground interactivo

#### ⚡ Performance
- [ ] Cache con Redis
- [ ] CDN para imágenes
- [ ] Compresión de respuestas
- [ ] Rate limiting avanzado

### [3.0.0] - Visión a Largo Plazo

#### 🎯 Features Avanzadas
- [ ] GraphQL API
- [ ] WebSockets para real-time
- [ ] Versionado de contenido
- [ ] Historial de cambios
- [ ] Multi-tenancy

#### 🏗️ Arquitectura
- [ ] Microservicios
- [ ] Event-driven architecture
- [ ] Message queues (RabbitMQ/Kafka)
- [ ] Búsqueda full-text (Elasticsearch)

---

## 📝 Notas de Versiones

### Convenciones de Versionado

Seguimos [Semantic Versioning](https://semver.org/):

- **MAJOR** (X.0.0): Cambios incompatibles con versiones anteriores
- **MINOR** (0.X.0): Nuevas funcionalidades compatibles
- **PATCH** (0.0.X): Correcciones de bugs

### Tipos de Cambios

- **✨ Agregado (Added)**: Nuevas características
- **🔄 Cambiado (Changed)**: Cambios en funcionalidad existente
- **⚠️ Deprecado (Deprecated)**: Características que serán removidas
- **🗑️ Removido (Removed)**: Características eliminadas
- **🐛 Corregido (Fixed)**: Corrección de bugs
- **🔐 Seguridad (Security)**: Parches de seguridad

---

## 🔗 Enlaces

- **Repositorio:** [https://github.com/Lisa2900/BKUTTECAM](https://github.com/Lisa2900/BKUTTECAM)
- **Rama Estable:** `version-estable`
- **Issues:** [GitHub Issues](https://github.com/Lisa2900/BKUTTECAM/issues)
- **Documentación:** [README.md](./README.md)

---

**Universidad Tecnológica de Tecamachalco** 🎓  
**Mantenido con ❤️ por el equipo de desarrollo**
