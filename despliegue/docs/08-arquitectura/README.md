# 🏗️ 08. Arquitectura

## Documentos en esta sección

Documentación técnica sobre la arquitectura y diseño del sistema.

### 📄 Documentos Disponibles

1. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Arquitectura Completa del Sistema
   - Visión general de la arquitectura
   - Diagramas de arquitectura
   - Flujo de datos
   - Capas del sistema (Routes → Controllers → Models → DB)
   - Estructura de archivos detallada
   - Esquema de base de datos
   - Patrones de diseño utilizados
   - Middleware y su flujo
   - Seguridad implementada
   - Plan de escalabilidad
   - Testing y CI/CD (futuro)
   - **Ideal para:** Arquitectos, desarrolladores senior, auditorías técnicas

---

## 🏛️ Visión General

### Arquitectura en Capas

```
┌─────────────────────────────────────┐
│         Cliente (Frontend)          │
│   (React, Vue, Mobile, etc.)        │
└──────────────┬──────────────────────┘
               │ HTTP/HTTPS
               ▼
┌─────────────────────────────────────┐
│         API REST (Express)          │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Middleware Layer        │   │
│  │  • Authentication (JWT)     │   │
│  │  • Validation               │   │
│  │  • Rate Limiting            │   │
│  │  • Security (Helmet)        │   │
│  │  • Logging                  │   │
│  └─────────────────────────────┘   │
│               │                     │
│  ┌─────────────────────────────┐   │
│  │      Routes Layer           │   │
│  │  • /api/textos              │   │
│  │  • /api/directorios         │   │
│  │  • /api/nosotros            │   │
│  │  • /api/auth                │   │
│  │  • /api/solicitudes         │   │
│  └─────────────────────────────┘   │
│               │                     │
│  ┌─────────────────────────────┐   │
│  │    Controllers Layer        │   │
│  │  • Business Logic           │   │
│  │  • Data Processing          │   │
│  │  • Error Handling           │   │
│  └─────────────────────────────┘   │
│               │                     │
│  ┌─────────────────────────────┐   │
│  │      Models Layer           │   │
│  │  • Sequelize ORM            │   │
│  │  • Data Validation          │   │
│  │  • Relations                │   │
│  └─────────────────────────────┘   │
└──────────────┬──────────────────────┘
               │ SQL
               ▼
┌─────────────────────────────────────┐
│       Database (MySQL)              │
│  • Textos                           │
│  • Directorios                      │
│  • Nosotros                         │
│  • Users                            │
│  • Solicitudes                      │
│  • Formularios                      │
└─────────────────────────────────────┘
```

---

## 📁 Estructura del Proyecto

```
BKUTTECAM/
├── src/                      # Código fuente TypeScript
│   ├── app.ts               # Aplicación Express principal
│   ├── server.ts            # Servidor HTTP
│   ├── config/              # Configuraciones
│   │   ├── database.ts      # Conexión a BD
│   │   └── syncDatabase.ts  # Sincronización
│   ├── controllers/         # Lógica de negocio
│   │   ├── authController.ts
│   │   ├── textoController.ts
│   │   ├── directorioController.ts
│   │   ├── nosotrosController.ts
│   │   ├── formularioController.ts
│   │   └── solicitudConstanciaController.ts
│   ├── middleware/          # Middleware personalizado
│   │   ├── auth.ts          # JWT Validation
│   │   ├── validation.ts    # Input Validation
│   │   ├── rateLimiter.ts   # Rate Limiting
│   │   ├── security.ts      # Security Headers
│   │   ├── logging.ts       # Logging
│   │   ├── errorHandler.ts  # Error Handling
│   │   └── uploadMiddleware.ts # File Upload
│   ├── models/              # Modelos Sequelize
│   │   ├── User.ts
│   │   ├── Texto.ts
│   │   ├── Directorios.ts
│   │   ├── Nosotros.ts
│   │   ├── Formulario.ts
│   │   └── Solicitud_Constancia.ts
│   └── routes/              # Definición de rutas
│       ├── auth.ts
│       ├── textos.ts
│       ├── directorio.ts
│       ├── nosotros.ts
│       ├── formulario.ts
│       └── solicitudConstancia.ts
├── dist/                    # JavaScript compilado
├── uploads/                 # Archivos subidos
│   ├── directorios/
│   └── nosotros/
├── logs/                    # Logs del sistema
│   ├── access-*.log
│   ├── security-*.log
│   └── security-error-*.log
├── sql/                     # Scripts de base de datos
│   ├── database_setup.sql
│   ├── directorios.sql
│   ├── formularios.sql
│   ├── nosotros_contenido.sql
│   └── solicitudes_constancias_kardex.sql
├── scripts/                 # Scripts de utilidad
│   ├── create-admin.js
│   └── test-solicitudes.js
├── docs/                    # Documentación
├── .env                     # Variables de entorno
├── package.json             # Dependencias
└── tsconfig.json           # Config TypeScript
```

---

## 🔄 Flujo de Datos

### Request Flow

```
1. Cliente → HTTP Request
                ↓
2. Express → Middleware Chain
   • Logging (registra request)
   • Security Headers (Helmet)
   • CORS
   • Rate Limiting (verifica límites)
   • Body Parser (parsea JSON)
                ↓
3. Routes → Identifica endpoint
   • Valida ruta
   • Aplica middleware específico
                ↓
4. Auth Middleware (si es ruta protegida)
   • Verifica token JWT
   • Extrae usuario
   • Verifica permisos
                ↓
5. Validation Middleware
   • Valida parámetros
   • Sanitiza inputs
   • Verifica tipos de datos
                ↓
6. Controller
   • Procesa lógica de negocio
   • Interactúa con modelos
                ↓
7. Model (Sequelize)
   • Construye queries SQL
   • Ejecuta en base de datos
   • Valida datos
                ↓
8. Database (MySQL)
   • Ejecuta query
   • Retorna resultados
                ↓
9. Controller (continuación)
   • Procesa resultados
   • Formatea respuesta
                ↓
10. Error Handler (si hay error)
    • Captura error
    • Formatea mensaje
    • Log del error
                ↓
11. Response → Cliente
    • Status code apropiado
    • JSON response
    • Headers de seguridad
```

---

## 🗄️ Esquema de Base de Datos

### Tablas Principales

```sql
Users
├── id (PK)
├── nombre
├── email (UNIQUE)
├── password (HASHED)
├── role (admin/user)
└── timestamps

Textos
├── id (PK)
├── titulo
├── contenido
├── categoria
└── timestamps

Directorios
├── id (PK)
├── nombre
├── cargo
├── telefono
├── email
├── imagen (URL)
└── timestamps

Nosotros
├── id (PK)
├── tipo (mision/vision/valores)
├── titulo
├── contenido
├── imagen (URL)
└── timestamps

Formularios
├── id (PK)
├── nombre
├── campos (JSON)
└── timestamps

Solicitudes_Constancias
├── id (PK)
├── numero_referencia (UNIQUE)
├── tipo
├── nombre_completo
├── correo
├── matricula
├── carrera
├── cuatrimestre
├── estado (pendiente/procesando/completada/rechazada)
├── motivo_rechazo
└── timestamps
```

---

## 🎨 Patrones de Diseño

### 1. MVC (Model-View-Controller)
- **Models:** Sequelize ORM
- **Views:** JSON API (Frontend separado)
- **Controllers:** Lógica de negocio

### 2. Middleware Pattern
- Chain of Responsibility
- Funciones reutilizables
- Separación de concerns

### 3. Repository Pattern
- Modelos abstraen acceso a datos
- Facilita testing
- Cambio de ORM sin afectar controllers

### 4. Dependency Injection
- Configuraciones centralizadas
- Fácil testing y mocking

---

## 🔒 Arquitectura de Seguridad

### Capas de Seguridad

```
1. Network Layer
   └── HTTPS/TLS

2. Application Layer
   ├── Helmet.js (Security Headers)
   ├── CORS (Cross-Origin)
   └── Rate Limiting

3. Authentication Layer
   ├── JWT Tokens
   ├── Bcrypt (Password Hashing)
   └── Session Management

4. Authorization Layer
   ├── Role-Based Access Control
   └── Route Protection

5. Data Layer
   ├── Input Validation
   ├── SQL Injection Prevention (ORM)
   ├── XSS Protection
   └── Data Sanitization

6. Monitoring Layer
   ├── Access Logs
   ├── Security Logs
   └── Error Logs
```

---

## 📊 Tecnologías Utilizadas

### Backend
- **Runtime:** Node.js v16+
- **Framework:** Express.js 4.18+
- **Language:** TypeScript 5+
- **ORM:** Sequelize 6+
- **Database:** MySQL 8+

### Seguridad
- **Authentication:** JWT (jsonwebtoken)
- **Encryption:** bcrypt
- **Rate Limiting:** express-rate-limit
- **Headers:** Helmet.js
- **Validation:** express-validator

### Utilidades
- **Upload:** Multer
- **Logging:** Winston / Morgan
- **Environment:** dotenv
- **CORS:** cors

---

## 📋 Documentos Relacionados

- **[DEVELOPMENT.md](../03-desarrollo/DEVELOPMENT.md)** - Desarrollo en el proyecto
- **[API_REFERENCE.md](../04-api-referencia/API_REFERENCE.md)** - Endpoints disponibles
- **[SECURITY.md](../06-seguridad-administracion/SECURITY.md)** - Seguridad implementada
- **[INSTALLATION.md](../02-instalacion-configuracion/INSTALLATION.md)** - Setup inicial

---

[← Volver al índice principal](../README.md)
