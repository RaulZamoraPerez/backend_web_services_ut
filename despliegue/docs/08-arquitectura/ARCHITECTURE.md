# 🏗️ Arquitectura del Sistema - UTTECAM API

## 📊 Visión General

La API UTTECAM está construida con una arquitectura en capas que separa las responsabilidades y facilita el mantenimiento y escalabilidad del sistema.

```
┌─────────────────────────────────────────────────────────────┐
│                    Cliente (Frontend)                        │
│              React / Vue / Angular / HTML                    │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP/HTTPS Requests
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   Express.js Server                          │
│                      (Puerto 3000)                           │
└─────────────────────┬───────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
   ┌────────┐   ┌────────┐   ┌────────┐
   │ Textos │   │Directo-│   │Nosotros│
   │  API   │   │ rios   │   │  API   │
   └────┬───┘   └────┬───┘   └────┬───┘
        │            │            │
        └────────────┼────────────┘
                     ▼
         ┌───────────────────────┐
         │  Middleware Layer     │
         │  - Error Handler      │
         │  - Upload Manager     │
         │  - CORS               │
         └──────────┬────────────┘
                    ▼
         ┌───────────────────────┐
         │  Controllers Layer    │
         │  - Business Logic     │
         │  - Validation         │
         └──────────┬────────────┘
                    ▼
         ┌───────────────────────┐
         │   Sequelize ORM       │
         │   - Models            │
         │   - Queries           │
         └──────────┬────────────┘
                    ▼
         ┌───────────────────────┐
         │   MySQL Database      │
         │   - textos            │
         │   - directorios       │
         │   - nosotros          │
         └───────────────────────┘
```

---

## 🔧 Componentes Principales

### 1. **Capa de Entrada (Express Server)**

**Archivo:** `src/server.ts`, `src/app.ts`

**Responsabilidades:**
- Inicialización del servidor Express
- Configuración de middleware global
- Gestión de rutas principales
- Health checks
- Sincronización con base de datos

**Tecnologías:**
- Express.js 4.x
- CORS para políticas de origen cruzado
- Body-parser para JSON

---

### 2. **Capa de Rutas (Routes)**

**Ubicación:** `src/routes/`

**Archivos:**
- `textos.ts` - Rutas del módulo textos
- `directorios.ts` - Rutas del módulo directorios
- `nosotros.ts` - Rutas del módulo nosotros

**Responsabilidades:**
- Definición de endpoints HTTP
- Mapeo de rutas a controladores
- Configuración de middleware específico de ruta

**Patrón:**
```typescript
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', upload.single('imagen'), controller.create);
router.put('/:id', upload.single('imagen'), controller.update);
router.delete('/:id', controller.delete);
```

---

### 3. **Capa de Controladores (Controllers)**

**Ubicación:** `src/controllers/`

**Archivos:**
- `textoController.ts` - Lógica de negocio para textos
- `directorioControler.ts` - Lógica de negocio para directorios
- `nosotrosController.ts` - Lógica de negocio para nosotros

**Responsabilidades:**
- Procesamiento de requests HTTP
- Validación de datos de entrada
- Llamadas a modelos Sequelize
- Formateo de respuestas
- Manejo de errores específicos

**Ejemplo de flujo:**
```typescript
export const create = async (req: Request, res: Response) => {
  try {
    // 1. Validar datos de entrada
    const { contenido } = req.body;
    if (!contenido) {
      return res.status(400).json({ error: 'Campo requerido' });
    }

    // 2. Interactuar con modelo
    const texto = await Texto.create({ contenido });

    // 3. Formatear y enviar respuesta
    res.status(201).json({
      message: 'Texto creado exitosamente',
      texto
    });
  } catch (error) {
    // 4. Manejo de errores
    res.status(500).json({ error: 'Error interno' });
  }
};
```

---

### 4. **Capa de Modelos (Models)**

**Ubicación:** `src/models/`

**Archivos:**
- `Texto.ts` - Modelo Sequelize para textos
- `Directorios.ts` - Modelo Sequelize para directorios
- `Nosotros.ts` - Modelo Sequelize para contenido institucional

**Responsabilidades:**
- Definición de esquemas de datos
- Validaciones a nivel de modelo
- Configuración de relaciones (futuro)
- Hooks y middlewares de modelo
- Mapeo ORM a base de datos

**Características Sequelize:**
- Timestamps automáticos
- Validaciones integradas
- Índices optimizados
- Tipos de datos seguros

**Ejemplo de modelo:**
```typescript
const Texto = sequelize.define('Texto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  contenido: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 5000]
    }
  }
}, {
  tableName: 'textos',
  timestamps: true,
  underscored: true
});
```

---

### 5. **Capa de Middleware**

**Ubicación:** `src/middleware/`

**Archivos:**
- `errorHandler.ts` - Manejo centralizado de errores
- `uploadMiddleware.ts` - Gestión de uploads de archivos

**Responsabilidades:**

#### Error Handler:
- Captura de errores no manejados
- Formateo consistente de respuestas de error
- Logging de errores
- Respuestas amigables al cliente

#### Upload Middleware:
- Validación de archivos subidos
- Configuración de Multer
- Límites de tamaño
- Filtros de tipo de archivo
- Gestión de almacenamiento

---

### 6. **Capa de Configuración**

**Ubicación:** `src/config/`

**Archivos:**
- `database.ts` - Configuración de Sequelize
- `syncDatabase.ts` - Sincronización y seeds

**Responsabilidades:**
- Conexión a base de datos MySQL
- Pool de conexiones
- Variables de entorno
- Configuración de logging SQL
- Sincronización de modelos
- Datos de prueba (seeds)

---

### 7. **Capa de Datos (MySQL Database)**

**Esquema de Base de Datos:**

#### Tabla: `textos`
```sql
CREATE TABLE textos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  contenido TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_created_at (created_at)
);
```

#### Tabla: `directorios`
```sql
CREATE TABLE directorios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(150) NOT NULL,
  nombre VARCHAR(150) NOT NULL,
  telefono VARCHAR(20),
  extension VARCHAR(10),
  correo VARCHAR(150),
  imagen VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Tabla: `nosotros`
```sql
CREATE TABLE nosotros (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo VARCHAR(50) NOT NULL,
  titulo VARCHAR(200) NOT NULL,
  descripcion TEXT,
  imagen VARCHAR(255),
  lista JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_tipo (tipo)
);
```

---

## 🔄 Flujo de Datos

### Ejemplo: Crear un Directorio con Imagen

```
1. Cliente → POST /api/directorios (multipart/form-data)
   ↓
2. Express Server recibe request
   ↓
3. Middleware uploadMiddleware procesa imagen
   ↓
4. Router directorios → directorioController.create
   ↓
5. Controller valida datos:
   - titulo, nombre son requeridos
   - correo tiene formato válido
   - teléfono solo números
   ↓
6. Controller llama a Directorios.create()
   ↓
7. Sequelize genera query SQL:
   INSERT INTO directorios (titulo, nombre, ...)
   ↓
8. MySQL ejecuta query y devuelve ID
   ↓
9. Sequelize mapea resultado a modelo
   ↓
10. Controller formatea respuesta JSON
   ↓
11. Express envía respuesta al cliente
```

---

## 🗂️ Estructura de Archivos

```
BKUTTECAM/
├── src/                          # Código fuente TypeScript
│   ├── app.ts                    # Configuración Express
│   ├── server.ts                 # Punto de entrada
│   ├── config/                   # Configuración
│   │   ├── database.ts           # Conexión Sequelize
│   │   └── syncDatabase.ts       # Sincronización
│   ├── models/                   # Modelos Sequelize
│   │   ├── Texto.ts
│   │   ├── Directorios.ts
│   │   └── Nosotros.ts
│   ├── controllers/              # Lógica de negocio
│   │   ├── textoController.ts
│   │   ├── directorioControler.ts
│   │   └── nosotrosController.ts
│   ├── routes/                   # Definición de rutas
│   │   ├── textos.ts
│   │   ├── directorio.ts
│   │   └── nosotros.ts
│   └── middleware/               # Middleware personalizado
│       ├── errorHandler.ts
│       └── uploadMiddleware.ts
├── uploads/                      # Archivos subidos
│   └── nosotros/                 # Imágenes institucionales
├── dist/                         # Código compilado (JS)
├── docs/                         # Documentación
├── sql/                          # Scripts SQL
├── package.json                  # Dependencias
├── tsconfig.json                # Config TypeScript
└── .env                         # Variables de entorno
```

---

## 🔐 Seguridad

### Implementaciones Actuales:

1. **Validación de Entrada**
   - Validación de tipos de datos
   - Sanitización de strings
   - Límites de longitud

2. **Upload de Archivos**
   - Whitelist de extensiones
   - Límite de tamaño (5MB)
   - Validación de MIME types

3. **Base de Datos**
   - Prepared statements (Sequelize ORM)
   - Prevención de SQL Injection
   - Conexiones seguras

4. **CORS**
   - Configuración de orígenes permitidos
   - Headers controlados

### Mejoras Futuras Sugeridas:

- [ ] Autenticación JWT
- [ ] Rate limiting
- [ ] HTTPS obligatorio
- [ ] Sanitización adicional con helmet.js
- [ ] Auditoría de logs
- [ ] Cifrado de datos sensibles

---

## 📈 Escalabilidad

### Capacidad Actual:
- **Usuarios concurrentes:** ~100-500
- **Requests por segundo:** ~50-100
- **Tamaño de BD:** Hasta 10GB eficientemente

### Optimizaciones Implementadas:
- ✅ Índices en campos frecuentes
- ✅ Pool de conexiones (10 conexiones)
- ✅ Queries optimizadas con Sequelize
- ✅ Paginación en listados

### Plan de Escalabilidad:

#### Fase 1 (Pequeña escala):
- Hosting compartido o VPS básico
- MySQL single instance
- Servidor Node.js único

#### Fase 2 (Escala media):
- VPS dedicado
- Redis para caché
- Load balancer
- CDN para imágenes

#### Fase 3 (Gran escala):
- Cluster de Node.js
- Réplicas de MySQL
- Microservicios separados
- Kubernetes para orquestación

---

## 🧪 Testing (Futuro)

### Estructura Propuesta:
```
tests/
├── unit/                    # Tests unitarios
│   ├── models/
│   ├── controllers/
│   └── middleware/
├── integration/            # Tests de integración
│   ├── api/
│   └── database/
└── e2e/                   # Tests end-to-end
    └── scenarios/
```

### Herramientas Sugeridas:
- **Jest** - Framework de testing
- **Supertest** - Tests de API
- **ts-jest** - Jest para TypeScript
- **Mock databases** - Para tests aislados

---

## 🔄 CI/CD (Futuro)

### Pipeline Sugerido:

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Install dependencies
      - Run linter
      - Run tests
      - Build TypeScript
      
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - Deploy to production
      - Run migrations
      - Smoke tests
```

---

## 📊 Monitoreo y Logs

### Implementación Actual:
- Console.log básico
- Logs de Sequelize SQL (desarrollo)
- Error tracking en catch blocks

### Mejoras Sugeridas:
- **Winston** - Logging estructurado
- **Morgan** - HTTP request logging
- **Sentry** - Error tracking
- **PM2** - Process manager con logs
- **Grafana** - Dashboards de métricas

---

## 🚀 Deployment

### Opciones Disponibles:

1. **cPanel** (Recomendado para inicio)
   - Node.js Selector
   - MySQL integrado
   - Certificados SSL automáticos

2. **VPS/Cloud**
   - Ubuntu Server
   - PM2 para gestión de procesos
   - Nginx como reverse proxy

3. **Containers**
   - Docker
   - Docker Compose
   - Kubernetes (escala grande)

**Ver:** [Guía de Deployment](./DEPLOYMENT.md) para instrucciones detalladas.

---

## 🔮 Roadmap Técnico

### Versión 2.0 (Próxima)
- [ ] Sistema de autenticación
- [ ] Roles y permisos
- [ ] API de archivos/documentos
- [ ] Tests unitarios e integración
- [ ] Documentación Swagger/OpenAPI

### Versión 3.0 (Futuro)
- [ ] GraphQL API
- [ ] WebSockets para tiempo real
- [ ] Microservicios
- [ ] Cache distribuido (Redis)
- [ ] Búsqueda full-text (Elasticsearch)

---

**Universidad Tecnológica de Tecamachalco** 🎓  
**Arquitectura diseñada para escalabilidad y mantenibilidad**
