# Sistema de Personal por Carreras

## 📋 Descripción

Sistema para asignar personal administrativo a carreras específicas, permitiendo el enrutamiento inteligente de correos según la carrera seleccionada por el estudiante en los formularios.

## 🗂️ Estructura de Archivos

```
src/
├── models/
│   └── PersonalCarrera.ts                    # Modelo Sequelize
├── controllers/
│   └── personal-carreras/
│       ├── PersonalCarreraService.ts         # Lógica de negocio
│       └── PersonalCarreraController.ts      # Controladores HTTP
└── routes/
    └── PersonalCarreraRoute.ts               # Definición de rutas
```

## 📊 Modelo de Datos

### PersonalCarrera

```typescript
{
  id: string;                 // UUID (PK)
  nombre: string;             // Nombre del personal (máx. 200 caracteres)
  correo: string;             // Email único (máx. 200 caracteres)
  carreras: string[];         // Array de carreras asignadas (JSON)
  activo: boolean;            // Estado (default: true)
  createdAt: Date;            // Fecha de creación
  updatedAt: Date;            // Fecha de actualización
}
```

## 🛣️ Endpoints API

Base URL: `/api/personal-carreras`

### 1. Crear Personal (Protegida 🔒)

```
POST /
Authorization: Bearer <token>

Body:
{
  "nombre": "María González",
  "correo": "maria.gonzalez@uttecam.edu.mx",
  "carreras": ["TSU en Desarrollo de Software", "Ingeniería en Sistemas"],
  "activo": true  // opcional, default: true
}

Response 201:
{
  "id": "uuid-1234",
  "nombre": "María González",
  "correo": "maria.gonzalez@uttecam.edu.mx",
  "carreras": ["TSU en Desarrollo de Software", "Ingeniería en Sistemas"],
  "activo": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 2. Obtener Todo el Personal (Pública)

```
GET /

Response 200:
[
  {
    "id": "uuid-1234",
    "nombre": "María González",
    "correo": "maria.gonzalez@uttecam.edu.mx",
    "carreras": ["TSU en Desarrollo de Software"],
    "activo": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  ...
]

Nota: Ordenado alfabéticamente por nombre
```

### 3. Obtener Personal por ID (Pública)

```
GET /:id

Response 200:
{
  "id": "uuid-1234",
  "nombre": "María González",
  "correo": "maria.gonzalez@uttecam.edu.mx",
  "carreras": ["TSU en Desarrollo de Software"],
  "activo": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}

Response 404:
{
  "error": "Not Found",
  "message": "No se encontró personal con ID: uuid-1234"
}
```

### 4. Actualizar Personal (Protegida 🔒)

```
PUT /:id
Authorization: Bearer <token>

Body (todos los campos son opcionales):
{
  "nombre": "María González López",
  "correo": "nuevo.correo@uttecam.edu.mx",
  "carreras": ["Ingeniería en Sistemas"],
  "activo": false
}

Response 200:
{
  "id": "uuid-1234",
  "nombre": "María González López",
  "correo": "nuevo.correo@uttecam.edu.mx",
  "carreras": ["Ingeniería en Sistemas"],
  "activo": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T10:00:00.000Z"
}

Response 400 (correo duplicado):
{
  "error": "Bad Request",
  "message": "El correo 'nuevo.correo@uttecam.edu.mx' ya está en uso."
}
```

### 5. Eliminar Personal (Protegida 🔒)

```
DELETE /:id
Authorization: Bearer <token>

Response 200:
{
  "message": "Personal eliminado exitosamente."
}

Response 404:
{
  "error": "Not Found",
  "message": "No se encontró personal con ID: uuid-1234"
}
```

## 🔧 Validaciones

### Crear Personal (POST /)

- ✅ `nombre`: requerido, máx. 200 caracteres
- ✅ `correo`: requerido, formato email válido, máx. 200 caracteres, único
- ✅ `carreras`: array requerido, mínimo 1 elemento, todos string válidos
- ✅ `activo`: opcional, debe ser booleano

### Actualizar Personal (PUT /:id)

- ✅ `nombre`: opcional, si se envía: no vacío, máx. 200 caracteres
- ✅ `correo`: opcional, si se envía: formato email, máx. 200 caracteres, único
- ✅ `carreras`: opcional, si se envía: array mínimo 1 elemento, todos string válidos
- ✅ `activo`: opcional, debe ser booleano

## 💼 Lógica de Negocio (PersonalCarreraService)

### Métodos Principales

#### `create(data)`

- Valida datos requeridos
- Verifica que el correo no exista
- Crea el registro con activo=true por defecto

#### `getAll()`

- Retorna todo el personal
- Ordenado alfabéticamente por nombre

#### `getById(id)`

- Busca personal por ID
- Lanza error 404 si no existe

#### `update(id, data)`

- Actualiza solo los campos enviados
- Valida unicidad de correo (excepto el mismo registro)
- Valida que carreras tenga al menos 1 elemento

#### `delete(id)`

- Elimina el registro de la base de datos

#### `getCorreoByCarrera(carrera)` 🌟

**Método especial para enrutamiento de correos**

```typescript
// Busca el primer personal activo que tenga asignada la carrera
const correo = await service.getCorreoByCarrera('TSU en Desarrollo de Software');

// Retorna:
// - string: correo del personal asignado
// - null: no hay personal asignado para esa carrera
```

**Uso en servicios de email:**

```typescript
// En EmailService o similar
const carreraEstudiante = req.body.carrera;
const correoDestino = await personalCarreraService.getCorreoByCarrera(carreraEstudiante);

if (correoDestino) {
  // Enviar al personal asignado
  await enviarEmail(correoDestino, datos);
} else {
  // Fallback: enviar a correo genérico
  await enviarEmail(process.env.DEFAULT_EMAIL, datos);
}
```

## 🔐 Seguridad

### Rutas Protegidas (requieren JWT)

- ✅ POST `/` - Crear personal
- ✅ PUT `/:id` - Actualizar personal
- ✅ DELETE `/:id` - Eliminar personal

### Rutas Públicas

- ✅ GET `/` - Listar personal
- ✅ GET `/:id` - Obtener por ID

**Nota**: Las rutas públicas permiten que el frontend consulte el personal disponible para mostrar información de contacto.

## 🎯 Casos de Uso

### 1. Dashboard Administrativo

```typescript
// Crear nuevo personal
POST /api/personal-carreras
{
  "nombre": "Juan Pérez",
  "correo": "juan.perez@uttecam.edu.mx",
  "carreras": ["TSU en Mecatrónica", "Ingeniería en Mecatrónica"]
}

// Actualizar carreras asignadas
PUT /api/personal-carreras/uuid-1234
{
  "carreras": ["TSU en Mecatrónica", "Ingeniería en Mecatrónica", "TSU en Energías Renovables"]
}

// Desactivar personal
PUT /api/personal-carreras/uuid-1234
{
  "activo": false
}
```

### 2. Frontend - Formularios Dinámicos

```typescript
// Obtener lista de personal para mostrar en formularios
const response = await fetch('/api/personal-carreras');
const personal = await response.json();

// Mostrar selector de carreras basado en personal activo
const carrerasDisponibles = personal
  .filter((p) => p.activo)
  .flatMap((p) => p.carreras)
  .filter((c, i, arr) => arr.indexOf(c) === i); // únicos
```

### 3. Enrutamiento Inteligente de Emails

```typescript
// En el servicio de envío de formularios
async enviarFormulario(datosFormulario) {
  const { carrera, nombre, email, mensaje } = datosFormulario;

  // Buscar personal asignado a la carrera
  const correoResponsable = await personalCarreraService.getCorreoByCarrera(carrera);

  // Enviar al responsable o fallback
  const destinatario = correoResponsable || process.env.DEFAULT_EMAIL;

  await emailService.send({
    to: destinatario,
    subject: `Nueva solicitud - ${carrera}`,
    body: `${nombre} (${email}) ha enviado: ${mensaje}`
  });
}
```

## 📝 Ejemplos de Datos

```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "nombre": "María González",
    "correo": "maria.gonzalez@uttecam.edu.mx",
    "carreras": ["TSU en Desarrollo de Software", "Ingeniería en Desarrollo de Software"],
    "activo": true,
    "createdAt": "2024-01-15T08:00:00.000Z",
    "updatedAt": "2024-01-15T08:00:00.000Z"
  },
  {
    "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "nombre": "Juan Pérez",
    "correo": "juan.perez@uttecam.edu.mx",
    "carreras": ["TSU en Mecatrónica", "Ingeniería en Mecatrónica"],
    "activo": true,
    "createdAt": "2024-01-15T09:00:00.000Z",
    "updatedAt": "2024-01-15T09:00:00.000Z"
  },
  {
    "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
    "nombre": "Ana Martínez",
    "correo": "ana.martinez@uttecam.edu.mx",
    "carreras": ["TSU en Energías Renovables", "Ingeniería en Energías Renovables"],
    "activo": false,
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-20T15:30:00.000Z"
  }
]
```

## 🚀 Integración Completa

### 1. Sincronización de Base de Datos

El modelo ya está registrado en `src/config/syncDatabase.ts`:

```typescript
import { PersonalCarrera } from '../models/PersonalCarrera';

const models = [
  ...,
  PersonalCarrera
];
```

### 2. Registro de Rutas

Ya registrado en `src/app.ts`:

```typescript
import PersonalCarreraRoute from './routes/PersonalCarreraRoute';

app.use('/api/personal-carreras', PersonalCarreraRoute);
```

### 3. Uso en Otros Servicios

```typescript
// Ejemplo de integración en un servicio de formularios
import { PersonalCarreraService } from '../controllers/personal-carreras/PersonalCarreraService';

const personalService = new PersonalCarreraService();

async function procesarFormulario(datos: any) {
  const correoDestino = await personalService.getCorreoByCarrera(datos.carrera);

  if (correoDestino) {
    // Enviar a personal asignado
    await enviarEmail(correoDestino, datos);
  } else {
    // Enviar a correo genérico de servicios escolares
    await enviarEmail(process.env.SERVICIOS_EMAIL, datos);
  }
}
```

## 🔍 Notas Importantes

1. **Campo carreras (JSON)**: Se almacena como JSON en MySQL, permite arrays flexibles de carreras
2. **Correo único**: Un personal no puede repetir correo (constraint a nivel BD)
3. **Activo=false**: No elimina el registro, solo lo marca como inactivo
4. **getCorreoByCarrera**: Retorna el **primer** personal activo que tenga la carrera asignada
5. **Ordenamiento**: GET / retorna personal ordenado alfabéticamente por nombre

## ✅ Checklist de Implementación

- [x] Modelo PersonalCarrera creado
- [x] PersonalCarreraService implementado
- [x] PersonalCarreraController implementado
- [x] Rutas definidas con validaciones
- [x] Integración en app.ts
- [x] Registro en syncDatabase.ts
- [x] Método getCorreoByCarrera para enrutamiento
- [ ] Integración con servicio de emails existente
- [ ] Crear seed data de ejemplo (opcional)
- [ ] Tests unitarios (opcional)

---

**Creado**: Sistema completo de gestión de personal por carreras  
**Propósito**: Enrutamiento inteligente de emails según carrera seleccionada  
**Estado**: ✅ Listo para usar
