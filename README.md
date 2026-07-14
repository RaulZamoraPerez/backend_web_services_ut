# UTTECAM API v2.0 - Seguridad Empresarial ��🚀

API CRUD para gestión de contenido de la Universidad Tecnológica de Tecamachalco, implementada con **Sequelize ORM**, **TypeScript**, **Express** y **seguridad OWASP Top 10 completa**.

---

## 🔥 **NUEVO: Versión 2.0.0-secure**

> **⚡ ACTUALIZACIÓN MAYOR:** Esta versión incluye implementación completa de **OWASP Top 10 2021** con autenticación JWT, rate limiting, validaciones de seguridad, logging avanzado y protección multicapa.

### 🛡️ Nivel de Seguridad: **EMPRESARIAL**
- ✅ **OWASP Top 10 2021:** Cumplimiento completo (10/10)
- ✅ **Autenticación JWT:** Sistema de roles (admin/editor/viewer)
- ✅ **Rate Limiting:** Protección contra DDoS y fuerza bruta
- ✅ **Validación de Entrada:** Sanitización completa de datos
- ✅ **Logging de Seguridad:** Winston con rotación diaria
- ✅ **Headers Seguros:** Helmet + CSP + HSTS
- ✅ **Upload Seguro:** Validación de firmas de archivo

---

## 📚 Documentación Completa

> 📑 **[Ver Índice Visual de Documentación →](./docs/INDICE_VISUAL.md)** - Guía visual organizada por categorías y escenarios de uso

### 🔒 **Documentación de Seguridad (NUEVO)**
| Documento | Descripción |
|-----------|-------------|
| **[🔒 SECURITY.md](./docs/SECURITY.md)** | 📋 **Documentación completa OWASP Top 10** - Implementación detallada |
| **[🚀 IMPLEMENTATION.md](./docs/IMPLEMENTATION.md)** | ⚙️ **Guía de implementación** - Setup de seguridad paso a paso |
| **[👤 ADMIN_USER.md](./docs/ADMIN_USER.md)** | 🔑 **Usuario administrador** - Credenciales y uso |

### 📖 **Documentación Principal**
| Documento | Descripción |
|-----------|-------------|
| **[API Reference](./docs/API_REFERENCE.md)** | 📖 Documentación completa de todos los endpoints |
| **[NOSOTROS API](./docs/NOSOTROS_API.md)** | 🏛️ **API de contenido institucional** - Gestión de visión, misión, valores |
| **[Architecture Guide](./docs/ARCHITECTURE.md)** | 🏗️ Arquitectura del sistema y diagramas técnicos |
| **[Installation Guide](./docs/INSTALLATION.md)** | ⚙️ Guía detallada de instalación |
| **[Development Guide](./docs/DEVELOPMENT.md)** | 💻 Guía para desarrollo local |
| **[Deployment Guide](./docs/DEPLOYMENT.md)** | 🚀 Opciones de despliegue |
| **[cPanel Deployment](./docs/CPANEL_DEPLOYMENT.md)** | 🌐 Deployment específico en cPanel |
| **[Images Upload Guide](./docs/IMAGENES_UPLOAD.md)** | 📸 Sistema de manejo de imágenes |
| **[Changelog](./CHANGELOG.md)** | 📝 Historial de versiones y cambios |

---

## ✨ Características v2.0

### 🔒 **Seguridad (NUEVO)**
- ✅ **Autenticación JWT** - Tokens seguros con expiración
- ✅ **Autorización por Roles** - Admin, Editor, Viewer
- ✅ **Rate Limiting** - Protección contra ataques
- ✅ **Validación de Entrada** - Sanitización automática
- ✅ **Logging de Seguridad** - Eventos y auditoría
- ✅ **Headers Seguros** - Helmet + CSP personalizados
- ✅ **Upload Seguro** - Validación de tipos y firmas
- ✅ **CORS Restrictivo** - Orígenes controlados
- ✅ **Detección de Ataques** - Patrones maliciosos
- ✅ **Anti-Fuerza Bruta** - Bloqueo progresivo

### 🚀 **Core Features**
- ✅ **TypeScript** - Tipado estático para mayor seguridad
- ✅ **Sequelize ORM** - Abstracción de base de datos moderna
- ✅ **Validaciones automáticas** - A nivel de modelo
- ✅ **Paginación integrada** - Con metadatos de paginación
- ✅ **Búsqueda de texto** - Filtrado por contenido
- ✅ **Estadísticas en tiempo real** - Dashboard de métricas
- ✅ **Manejo de errores** - Respuestas consistentes
- ✅ **Timestamps automáticos** - created_at y updated_at
- ✅ **Índices optimizados** - Para mejor rendimiento

---

## 🚀 Instalación y Configuración

### 1. Clonar e instalar dependencias

```bash
git clone https://github.com/Lisa2900/BKUTTECAM.git
cd BKUTTECAM
git checkout version-estable
npm install
```

### 2. Configurar variables de entorno

Copia `.env.example` a `.env` y configura:

```env
# Base de datos MySQL
DB_HOST=localhost
DB_PORT=3306
DB_NAME=uttecam
DB_USER=root
DB_PASSWORD=tu_password

# Servidor  
PORT=3002
NODE_ENV=development

# JWT Security (OBLIGATORIO PARA v2.0)
JWT_SECRET=tu_clave_secreta_super_robusta_256_bits_minimo

# Logging (Opcional)
LOG_LEVEL=info
LOG_DIR=./logs
```

> ⚠️ **IMPORTANTE v2.0:** El `JWT_SECRET` es **obligatorio** para la autenticación. Genera una clave robusta:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

### 3. Crear base de datos MySQL

```sql
CREATE DATABASE uttecam CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Crear usuario administrador

```bash
# Crear el primer usuario administrador
npm run create:admin
```

Esto creará un usuario con:
- **Username:** `admin`
- **Email:** `admin@uttecam.edu.mx`  
- **Password:** `Admin123!@#`
- **Role:** `admin`

> 📖 Ver [ADMIN_USER.md](./docs/ADMIN_USER.md) para más detalles.

### 5. Ejecutar el proyecto

```bash
# Desarrollo (con auto-recarga)
npm run dev

# El servidor iniciará en: http://localhost:3002
# Health check: http://localhost:3002/health
```

---

## 🔐 Autenticación y Autorización (NUEVO v2.0)

### 🎯 Sistema JWT
La API ahora requiere autenticación para endpoints críticos:

```javascript
// 1. Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'admin',
    password: 'Admin123!@#'
  })
});

const { token } = await response.json();

// 2. Usar token en requests
const result = await fetch('/api/textos', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    titulo: 'Mi texto',
    contenido: 'Contenido del texto',
    tipo: 'noticia'
  })
});
```

### 🔒 Endpoints Protegidos
- `POST/PUT/DELETE /api/textos/*` - Requiere autenticación
- `POST/PUT/DELETE /api/nosotros/*` - Requiere autenticación  
- `POST/PUT/DELETE /api/directorios/*` - Requiere autenticación
- `POST /api/auth/register` - Requiere autenticación (solo admins)

### 👥 Roles de Usuario
- **admin** - Acceso completo + gestión de usuarios
- **editor** - Crear, editar y eliminar contenido
- **viewer** - Solo lectura

---

## 📡 Módulos de la API

La API cuenta con **4 módulos principales**:

### 🔐 **Autenticación (NUEVO)**
Sistema de gestión de usuarios y autenticación.

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | Login de usuario | ❌ |
| POST | `/api/auth/register` | Registrar usuario | ✅ |
| GET | `/api/auth/profile` | Perfil del usuario | ✅ |
| POST | `/api/auth/logout` | Logout | ✅ |

### 1️⃣ **Textos**
Gestión de contenido textual general.

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/textos` | Listar textos con paginación | ❌ |
| GET | `/api/textos/stats` | Estadísticas de textos | ❌ |
| GET | `/api/textos/:id` | Obtener texto por ID | ❌ |
| POST | `/api/textos` | Crear nuevo texto | ✅ |
| PUT | `/api/textos/:id` | Actualizar texto | ✅ |
| DELETE | `/api/textos/:id` | Eliminar texto | ✅ |

### 2️⃣ **Directorios**
Gestión del directorio de personal y estructura organizacional.

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/directorios` | Listar todos los directorios | ❌ |
| GET | `/api/directorios/:id` | Obtener directorio por ID | ❌ |
| POST | `/api/directorios` | Crear directorio (con imagen) | ✅ |
| PUT | `/api/directorios/:id` | Actualizar directorio (con imagen) | ✅ |
| DELETE | `/api/directorios/:id` | Eliminar directorio | ✅ |

### 3️⃣ **Nosotros**
Gestión de contenido institucional (visión, misión, valores, historia).

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/nosotros/tipos` | Tipos de contenido disponibles | ❌ |
| GET | `/api/nosotros/contenido` | Listar contenido institucional | ❌ |
| GET | `/api/nosotros/contenido/:id` | Obtener contenido por ID | ❌ |
| POST | `/api/nosotros/contenido` | Crear contenido (con imagen) | ✅ |
| PUT | `/api/nosotros/contenido/:id` | Actualizar contenido (con imagen) | ✅ |
| DELETE | `/api/nosotros/contenido/:id` | Eliminar contenido | ✅ |

### 4️⃣ **Solicitudes de Constancia** 🆕
Sistema de solicitudes de constancias de estudios, kardex y trámite de título.

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/solicitudes-constancia` | Crear nueva solicitud | ❌ |
| GET | `/api/solicitudes-constancia/referencia/:ref` | Consultar por número de referencia | ❌ |
| GET | `/api/solicitudes-constancia/matricula/:mat` | Consultar por matrícula | ❌ |
| GET | `/api/solicitudes-constancia` | Listar todas las solicitudes | ✅ |
| GET | `/api/solicitudes-constancia/buscar` | Buscar solicitudes | ✅ |
| GET | `/api/solicitudes-constancia/estadisticas` | Estadísticas del módulo | ✅ |
| GET | `/api/solicitudes-constancia/:id` | Obtener solicitud por ID | ✅ |
| PUT | `/api/solicitudes-constancia/:id/estado` | Actualizar estado | ✅ |
| DELETE | `/api/solicitudes-constancia/:id` | Eliminar solicitud | 🔴 |

> 📋 **[Ver documentación completa del módulo →](./docs/SOLICITUDES_CONSTANCIA_KARDEX.md)**

### 🛡️ **Sistema (Health & Security)**
Endpoints de monitoreo y estado del sistema.

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/health` | Health check con métricas de seguridad | ❌ |
| GET | `/` | Información general de la API | ❌ |

> 📖 **[Ver documentación completa de endpoints →](./docs/API_REFERENCE.md)**

---

## 💡 Ejemplos de Uso Rápido

### 🔐 **Autenticación (NUEVO v2.0)**

```javascript
// Login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'admin',
    password: 'Admin123!@#'
  })
});

const { token } = await loginResponse.json();

// Crear texto (requiere autenticación)
const createResponse = await fetch('/api/textos', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    titulo: 'Mi Texto Seguro',
    contenido: 'Creado con autenticación JWT',
    tipo: 'noticia'
  })
});
```
```http
GET /api/textos?page=1&limit=5
```

**Respuesta:**
### 📝 **Textos - Ejemplos**

#### Listar textos (público)
```http
GET /api/textos?page=1&limit=5
```

**Respuesta:**
```json
{
  "textos": [
    {
      "id": 2,
      "titulo": "Texto de Prueba Admin",
      "contenido": "Este texto fue creado por el usuario administrador usando autenticación JWT",
      "tipo": "noticia",
      "createdAt": "2024-10-06T18:56:40.000Z",
      "updatedAt": "2024-10-06T18:56:40.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 2,
    "itemsPerPage": 5
  }
}
```

#### Crear texto (requiere autenticación)
```http
POST /api/textos
Authorization: Bearer <token>
Content-Type: application/json

{
  "titulo": "Nuevo Texto Seguro",
  "contenido": "Contenido creado con autenticación JWT",
  "tipo": "noticia"
}
```
```

## 🗄️ Modelos de Base de Datos

### 👤 **Usuario (NUEVO v2.0)**
```typescript
interface UserAttributes {
  id: number;
  username: string;        // Único
  email: string;          // Único, validado
  password: string;       // Hash bcrypt
  role: 'admin' | 'editor' | 'viewer';
  is_active: boolean;
  last_login?: Date;
  failed_login_attempts: number;
  locked_until?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
```

### 📝 **Texto**
```typescript
interface TextoAttributes {
  id: number;
  titulo: string;         // Requerido, 1-200 caracteres
  contenido: string;      // Requerido, 1-5000 caracteres  
  tipo: string;          // noticia, evento, anuncio, etc.
  createdAt?: Date;
  updatedAt?: Date;
}
```

### 👥 **Directorio**
```typescript
interface DirectorioAttributes {
  id: number;
  nombre: string;         // Requerido
  apellido: string;       // Requerido
  puesto: string;         // Requerido
  telefono?: string;      // Validado formato
  extension?: string;
  email?: string;         // Validado formato
  imagen?: string;        // Path de archivo
  createdAt?: Date;
  updatedAt?: Date;
}
```

### 🏛️ **Nosotros**
```typescript
interface NosotrosAttributes {
  id: number;
  tipo: 'vision' | 'mision' | 'valores' | 'historia';
  titulo: string;         // Requerido
  contenido: string;      // Requerido
  imagen?: string;        // Path de archivo
  orden?: number;         // Para ordenamiento
  activo: boolean;        // Para mostrar/ocultar
  createdAt?: Date;
  updatedAt?: Date;
}
```

### 🔒 **Validaciones de Seguridad**
- ✅ **Passwords:** Hash bcrypt con 12 rounds
- ✅ **Emails:** Validación de formato + unicidad
- ✅ **Usernames:** Validación + unicidad
- ✅ **Contenido:** Sanitización automática
- ✅ **Archivos:** Validación de tipo y tamaño
- ✅ **SQL Injection:** Prevención con Sequelize ORM
- ✅ Timestamps automáticos
- ✅ Índices optimizados

### Comandos de base de datos

```bash
# Resetear base de datos con datos de prueba
npm run db:reset

# Insertar solo datos de prueba
npm run db:seed
```

## 🛠️ Arquitectura del Proyecto

```
BKUTTECAM/
├── 📁 backup/              # Archivos de respaldo
│   ├── db.backup.ts        # Configuración MySQL anterior
│   ├── textoModel.backup.ts # Modelo MySQL anterior
│   └── README_old.md       # Documentación anterior
├── 📁 docs/                # Documentación API
├── 📁 src/                 # Código fuente TypeScript
│   ├── config/
│   │   ├── database.ts     # Configuración Sequelize
│   │   └── syncDatabase.ts # Sincronización y seeds
│   ├── models/
│   │   └── Texto.ts        # Modelo Sequelize
│   ├── controllers/
### 📁 **Estructura Actualizada v2.0**

```
src/
├── middleware/            # 🔒 NUEVO: Middleware de seguridad
│   ├── auth.ts           # ✅ Autenticación JWT
│   ├── rateLimiter.ts    # ✅ Rate limiting multicapa
│   ├── security.ts       # ✅ Headers de seguridad
│   ├── validation.ts     # ✅ Validación de entrada
│   ├── logging.ts        # ✅ Logging de seguridad
│   ├── uploadMiddleware.ts # ✅ Upload seguro
│   └── errorHandler.ts   # Manejo de errores
├── controllers/
│   ├── authController.ts # 🔒 NUEVO: Controlador de auth
│   ├── textoController.ts
│   ├── nosotrosController.ts
│   └── directorioController.ts
├── routes/
│   ├── auth.ts           # 🔒 NUEVO: Rutas de autenticación
│   ├── textos.ts         # ✅ Protegidas con auth
│   ├── nosotros.ts       # ✅ Protegidas con auth
│   └── directorio.ts     # ✅ Protegidas con auth
├── models/
│   ├── User.ts           # 🔒 NUEVO: Modelo de usuario
│   ├── Texto.ts
│   ├── Nosotros.ts
│   └── Directorios.ts
├── config/
│   ├── database.ts
│   └── syncDatabase.ts
├── app.ts                # ✅ Middleware de seguridad integrado
└── server.ts

docs/                     # 📚 Documentación completa
├── SECURITY.md           # � NUEVO: Documentación OWASP
├── IMPLEMENTATION.md     # 🔒 NUEVO: Guía implementación
├── ADMIN_USER.md         # 🔒 NUEVO: Usuario administrador
├── API_REFERENCE.md
├── ARCHITECTURE.md
├── DEVELOPMENT.md
├── INDICE_VISUAL.md      # 📖 NUEVO: Índice visual de documentación
├── INSTALLATION.md
├── DEPLOYMENT.md

scripts/                  # �️ Scripts utilitarios
├── create-admin.js       # 🔒 NUEVO: Crear usuario admin
├── create-admin.ts       # 🔒 NUEVO: Versión TypeScript
└── create-production-package.js

logs/                     # 📝 NUEVO: Sistema de logging
├── app-YYYY-MM-DD.log    # Logs generales
├── error-YYYY-MM-DD.log  # Logs de errores  
└── security-YYYY-MM-DD.log # 🔒 Logs de seguridad
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo y compilación
npm run dev              # Desarrollo con auto-recarga (puerto 3002)
npm run build           # Limpiar y compilar TypeScript
npm run start           # Ejecutar en producción
npm run clean           # Limpiar archivos compilados

# Base de datos
npm run db:reset        # Resetear BD con datos de prueba
npm run db:seed         # Insertar datos de ejemplo

# 🔒 NUEVOS: Seguridad y administración
npm run create:admin    # Crear usuario administrador
npm run security:test   # Probar endpoints de seguridad

# Desarrollo
npm run lint            # Linter (configurar próximamente)
npm run test            # Tests (configurar próximamente)
```

## 🚦 Tecnologías Utilizadas

### 🔒 **Seguridad (NUEVO v2.0)**
- **bcryptjs** - Hash de contraseñas seguro
- **jsonwebtoken** - Tokens JWT para autenticación
- **helmet** - Headers de seguridad HTTP
- **express-rate-limit** - Rate limiting y DDoS protection
- **express-validator** - Validación y sanitización
- **winston** - Sistema de logging avanzado
- **morgan** - HTTP request logging

### 🚀 **Core Technologies**
- **TypeScript** - Tipado estático y mejor desarrollo
- **Express.js** - Framework web minimalista
- **Sequelize** - ORM para MySQL/MariaDB
- **MySQL** - Base de datos relacional
- **Multer** - Manejo de uploads de archivos
- **CORS** - Cross-Origin Resource Sharing
- **Dotenv** - Gestión de variables de entorno

### ⚡ **Ventajas v2.0**

#### ✅ Seguridad Empresarial
- **OWASP Top 10 2021** - Cumplimiento completo
- **Autenticación robusta** - JWT con roles y permisos
- **Rate limiting inteligente** - Múltiples capas de protección
- **Logging de auditoría** - Trazabilidad completa
- **Validación estricta** - Sanitización automática

#### ✅ Desarrollo Avanzado
- **ORM completo** - Abstrae consultas SQL complejas
- **Migraciones automáticas** - Control de versiones de BD
- **Validaciones integradas** - A nivel de modelo y endpoint
- **Relaciones optimizadas** - Para expansiones futuras
- **Tipado TypeScript** - Autocompletado y detección de errores

#### ✅ Producción Ready
- **Health checks** - Monitoreo de estado del sistema
- **Logging estructurado** - Formato JSON con rotación
- **Error handling** - Manejo centralizado de errores
- **Performance** - Rate limiting y optimizaciones
- **Documentación completa** - Para desarrollo y operaciones

---

## 🔮 Estado del Proyecto

### ✅ **Completado (v2.0.0-secure)**
- ✅ **Seguridad OWASP Top 10** - Implementación completa
- ✅ **Autenticación JWT** - Sistema de usuarios y roles
- ✅ **Rate Limiting** - Protección DDoS y fuerza bruta
- ✅ **Logging de Seguridad** - Auditoría y monitoreo
- ✅ **Validación Completa** - Sanitización de entrada
- ✅ **Upload Seguro** - Validación de archivos
- ✅ **Documentación 100%** - Guías completas
- ✅ **Usuario Administrador** - Setup inicial
- ✅ **Health Monitoring** - Estado del sistema
- ✅ **Tests de Diagnóstico** - Verificación automatizada del backend en producción

### 🧪 **Testing**
```bash
# Tests de diagnóstico para backend en línea
npm run test:diagnostic          # Test rápido (health, endpoints públicos)
npm run test:diagnostic:full     # Test exhaustivo (auth, CRUD, seguridad)
npm run test:diagnostic:all      # Ejecutar ambos tests

# Test de seguridad (auditoría OWASP Top 10)
npm run test:security            # 26 tests de seguridad

# Tests locales
npm test                         # Ejecutar todos los tests
npm run test:watch              # Tests en modo watch
npm run test:coverage           # Tests con cobertura
```

**📖 Documentación de tests:**
- [Tests de Diagnóstico](./docs/DIAGNOSTIC_TESTS.md) - Verificación del backend en producción
- [Auditoría de Seguridad](./docs/SECURITY_AUDIT.md) - Tests OWASP Top 10

### 🚧 **Próximas Mejoras Sugeridas**
- [ ] **CI/CD Pipeline** - Integración y despliegue continuo
- [ ] **API Versioning** - Versionado de endpoints
- [ ] **Cache Redis** - Optimización de performance
- [ ] **2FA** - Autenticación de dos factores
- [ ] **OAuth Integration** - Login con Google/Microsoft
- [ ] **API Documentation** - Swagger/OpenAPI
- [ ] **Monitoring Dashboard** - Métricas en tiempo real

### 🚀 Inicio Rápido para Desarrolladores

Si acabas de bajar el proyecto, sigue estos pasos para garantizar que funcione:

1. **Configurar el entorno**:
   - Copia el archivo `.env.example` y renómbralo a `.env`.
   - Ajusta las credenciales de tu base de datos MySQL local (`DB_USER`, `DB_PASSWORD`, `DB_NAME`).

2. **Base de Datos**:
   - Asegúrate de tener MySQL corriendo.
   - Crea una base de datos vacía con el nombre que definiste en `.env` (por defecto `uttecam`).
   - Al iniciar el servidor por primera vez, las tablas se crearán automáticamente.

3. **Instalar dependencias**:
   ```bash
   npm install
   ```

4. **Iniciar en modo desarrollo**:
   ```bash
   npm run dev
   ```

> **Nota sobre Carpetas**: El proyecto está configurado para crear automáticamente la carpeta `uploads/` y todas sus subcarpetas necesarias al iniciar, por lo que no necesitas crearlas manualmente.

---

## API UTTECAM - Backend

Este es el backend oficial de la Universidad Tecnológica de Tecamachalco (UTTECAM).

---

## 🚀 Inicio Rápido para Desarrolladores

Si acabas de bajar el proyecto, sigue estos pasos para garantizar que funcione:

1. **Configurar el entorno**:
   - Copia el archivo `.env.example` y renómbralo a `.env`.
   - Ajusta las credenciales de tu base de datos MySQL local (`DB_USER`, `DB_PASSWORD`, `DB_NAME`).

2. **Base de Datos**:
   - Asegúrate de tener MySQL corriendo.
   - Crea una base de datos vacía con el nombre que definiste en `.env` (por defecto: `uttecam`).
   - El sistema sincronizará las tablas automáticamente al iniciar.

3. **Instalar dependencias**:
   ```bash
   npm install
   ```

4. **Iniciar en modo desarrollo**:
   ```bash
   npm run dev
   ```

> **Nota sobre Carpetas**: El proyecto detectará y creará automáticamente el directorio `uploads/` y todas sus subcarpetas necesarias (`directorios`, `documentos`, `organigrama`, etc.) al arrancar.

---

## 🛠️ Tecnologías y Arquitectura

- **TypeScript** - Lenguaje tipado
- **Express.js** - Framework web
- **Sequelize** - ORM para bases de datos
- **MySQL** - Base de datos relacional
- **dotenv** - Variables de entorno
- **CORS** - Intercambio de recursos

## 🔗 Enlaces importantes

- **Repositorio GitHub:** https://github.com/Lisa2900/BKUTTECAM
- **Rama principal:** `version-estable` (con Sequelize)
- **Ramas disponibles:** `master`, `typescript-version`, `version-estable`
- **Changelog:** [CHANGELOG.md](./CHANGELOG.md) - Historial de versiones y cambios

## 📋 Estado del proyecto

---

## 🌐 Endpoints Principales

### Health Check (NUEVO)
```bash
GET http://localhost:3002/health
```
**Respuesta con métricas de seguridad:**
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
  },
  "database": "connected"
}
```

### Información de la API
```bash
GET http://localhost:3002/
```

### Documentación Interactiva
Todos los endpoints están documentados en:
- 📖 [API_REFERENCE.md](./docs/API_REFERENCE.md) - Referencia completa
- 🔒 [SECURITY.md](./docs/SECURITY.md) - Documentación de seguridad
- 👤 [ADMIN_USER.md](./docs/ADMIN_USER.md) - Usuario administrador

---

## 🔧 Quick Start

### 1. Setup Completo
```bash
# Clonar repositorio
git clone https://github.com/Lisa2900/BKUTTECAM.git
cd BKUTTECAM
git checkout version-estable

# Instalar dependencias
npm install

# Configurar .env (incluir JWT_SECRET)
cp .env.example .env
# Editar .env con tus configuraciones

# Crear usuario administrador
npm run create:admin

# Iniciar servidor
npm run dev
```

### 2. Probar la API
```bash
# Health check
curl http://localhost:3002/health

# Login admin
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123!@#"}'

# Crear contenido (con token)
# Incluir Authorization: Bearer <token>
```

---

## 🛡️ Requisitos del Sistema

### Mínimos
- **Node.js:** >= 18.0.0
- **MySQL:** >= 8.0
- **npm:** >= 9.0.0
- **Memoria RAM:** >= 2GB
- **Espacio en disco:** >= 1GB

### Recomendados para Producción
- **Node.js:** >= 20.0.0
- **MySQL:** >= 8.0.30
- **Memoria RAM:** >= 4GB
- **CPU:** >= 2 cores
- **SSL/TLS:** Certificado válido

---

## 👥 Contribuciones

### 🔒 Consideraciones de Seguridad
Antes de contribuir, revisar:
- [SECURITY.md](./docs/SECURITY.md) - Estándares de seguridad
- [DEVELOPMENT.md](./docs/DEVELOPMENT.md) - Guía de desarrollo

### 📝 Proceso de Contribución
1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Seguir estándares de seguridad OWASP
4. Agregar tests si es necesario
5. Commit con mensajes descriptivos
6. Push a la rama (`git push origin feature/nueva-funcionalidad`)
7. Crear Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

---

## 📞 Soporte

### 🔒 Reportar Vulnerabilidades de Seguridad
- **Email:** security@uttecam.edu.mx
- **Proceso:** Divulgación responsable
- **Tiempo de Respuesta:** 24-48 horas

### 💬 Soporte General
- **Email:** dev@uttecam.edu.mx
- **Documentación:** [docs/](./docs/)
- **Issues:** GitHub Issues

---

**🎉 ¡API UTTECAM v2.0 con Seguridad Empresarial Lista!**

> 🛡️ **Nivel de Seguridad:** EMPRESARIAL | **OWASP Top 10:** ✅ COMPLETO | **Estado:** PRODUCCIÓN READY

**Universidad Tecnológica de Tecamachalco** 🎓  
**Desarrollado con ❤️, TypeScript y Seguridad OWASP**