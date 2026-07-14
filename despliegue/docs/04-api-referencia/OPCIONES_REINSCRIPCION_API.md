# API - Opciones de Reinscripción

Sistema para gestionar las opciones de reinscripción mostradas en la sección de trámites.

**Arquitectura**: 2 modelos separados

- **SeccionReinscripcion**: Título y subtítulo principal (1 registro único)
- **OpcionReinscripcion**: Cards individuales con PDFs (múltiples registros)

## 📋 Modelos de Datos

### SeccionReinscripcion (Registro Único)

```typescript
{
  id: string; // UUID
  titulo: string; // "Opciones de Reinscripción" (max 300)
  subtitulo: string | null; // "Selecciona el tipo..." (max 500)
  createdAt: Date;
  updatedAt: Date;
}
```

### OpcionReinscripcion (Múltiples Cards)

```typescript
{
  id: string; // UUID
  titulo: string; // Título de la card (max 300)
  subtitulo: string | null; // Subtítulo de la card (max 500)
  archivoPath: string; // Ruta del archivo PDF
  activo: boolean; // Estado de la opción
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🔗 Endpoints

## 📄 SECCIÓN (Título y Subtítulo Principal)

### 1. Crear o Actualizar Sección

**POST** `/api/opciones-reinscripcion/seccion`

🔒 **Requiere autenticación** (Token JWT)

Solo puede existir **1 registro** de sección. Si ya existe, se actualiza automáticamente.

#### Request Body (JSON)

```json
{
  "titulo": "Opciones de Reinscripción",
  "subtitulo": "Selecciona el tipo de reinscripción que corresponda a tu situación"
}
```

#### Respuesta Exitosa (200 OK)

```json
{
  "id": "uuid-generado",
  "titulo": "Opciones de Reinscripción",
  "subtitulo": "Selecciona el tipo de reinscripción que corresponda a tu situación",
  "createdAt": "2025-12-09T20:00:00.000Z",
  "updatedAt": "2025-12-09T20:00:00.000Z"
}
```

#### Ejemplo con cURL

```bash
curl -X POST http://localhost:3000/api/opciones-reinscripcion/seccion \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Opciones de Reinscripción",
    "subtitulo": "Selecciona el tipo de reinscripción que corresponda a tu situación"
  }'
```

---

### 2. Obtener Sección

**GET** `/api/opciones-reinscripcion/seccion`

🌐 **Endpoint público**

#### Respuesta Exitosa (200 OK)

```json
{
  "id": "uuid",
  "titulo": "Opciones de Reinscripción",
  "subtitulo": "Selecciona el tipo de reinscripción que corresponda a tu situación",
  "createdAt": "2025-12-09T20:00:00.000Z",
  "updatedAt": "2025-12-09T20:00:00.000Z"
}
```

#### Respuesta si no existe (404)

```json
{
  "error": "No se ha configurado la sección de reinscripción."
}
```

---

## 🃏 OPCIONES (Cards con PDFs)

### 3. Crear o Actualizar Opción (Card)

**POST** `/api/opciones-reinscripcion`

🔒 **Requiere autenticación** (Token JWT)

#### Request Body (Multipart/Form-Data)

```javascript
{
  "id": "uuid-opcional",    // Si se envía, actualiza. Si no, crea nuevo
  "titulo": "Alumnos de la UTTecam",
  "subtitulo": "Reinscripción para estudiantes actuales...",
  "activo": true,
  "archivo": File           // PDF, max 10MB
}
```

#### Respuesta Exitosa (201 Created o 200 OK)

```json
{
  "id": "uuid-generado",
  "titulo": "Alumnos de la UTTecam",
  "subtitulo": "Reinscripción para estudiantes actuales de la Universidad Tecnológica de Tecamachalco.",
  "archivoPath": "uploads/opciones_reinscripcion/Alumnos_UTTecam_1733800000000.pdf",
  "activo": true,
  "createdAt": "2025-12-09T20:00:00.000Z",
  "updatedAt": "2025-12-09T20:00:00.000Z"
}
```

#### Ejemplo con cURL

```bash
# Crear nueva card
curl -X POST http://localhost:3000/api/opciones-reinscripcion \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "titulo=Alumnos de la UTTecam" \
  -F "subtitulo=Reinscripción para estudiantes actuales" \
  -F "activo=true" \
  -F "archivo=@/path/to/document.pdf"

# Actualizar card existente
curl -X POST http://localhost:3000/api/opciones-reinscripcion \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "id=uuid-de-card-existente" \
  -F "titulo=Alumnos de la UTTecam Actualizado" \
  -F "archivo=@/path/to/new-document.pdf"
```

#### Validaciones

- ✅ `titulo`: Requerido, máximo 300 caracteres
- ✅ `subtitulo`: Opcional, máximo 500 caracteres
- ✅ `archivo`: Requerido, solo PDF, máximo 10MB
- ✅ `activo`: Opcional, booleano (default: true)

---

### 4. Obtener Todas las Opciones (Cards)

**GET** `/api/opciones-reinscripcion`

🌐 **Endpoint público**

#### Query Parameters

- `activas` (opcional): `true` | `false` - Filtrar solo opciones activas

#### Ejemplos de Uso

```bash
# Todas las opciones
GET /api/opciones-reinscripcion

# Solo opciones activas
GET /api/opciones-reinscripcion?activas=true
```

#### Respuesta Exitosa (200 OK)

```json
[
  {
    "id": "uuid-1",
    "titulo": "Alumnos de la UTTecam",
    "subtitulo": "Reinscripción para estudiantes actuales",
    "archivoPath": "uploads/opciones_reinscripcion/documento1.pdf",
    "activo": true,
    "createdAt": "2025-12-09T20:00:00.000Z",
    "updatedAt": "2025-12-09T20:00:00.000Z"
  },
  {
    "id": "uuid-2",
    "titulo": "Alumnos provenientes de generaciones anteriores y de otras Universidades Tecnológicas",
    "subtitulo": "Proceso especial para estudiantes de generaciones pasadas o transferencias.",
    "archivoPath": "uploads/opciones_reinscripcion/documento2.pdf",
    "activo": true,
    "createdAt": "2025-12-09T20:05:00.000Z",
    "updatedAt": "2025-12-09T20:05:00.000Z"
  }
]
```

---

### 5. Obtener Opción por ID

**GET** `/api/opciones-reinscripcion/:id`

🌐 **Endpoint público**

#### Respuesta Exitosa (200 OK)

```json
{
  "id": "uuid-generado",
  "titulo": "Alumnos de la UTTecam",
  "subtitulo": "Reinscripción para estudiantes actuales",
  "archivoPath": "uploads/opciones_reinscripcion/documento.pdf",
  "activo": true,
  "createdAt": "2025-12-09T20:00:00.000Z",
  "updatedAt": "2025-12-09T20:00:00.000Z"
}
```

---

### 6. Descargar Archivo PDF

**GET** `/api/opciones-reinscripcion/:id/download`

🌐 **Endpoint público**

Descarga el archivo PDF asociado a la opción de reinscripción.

#### Ejemplo

```bash
GET /api/opciones-reinscripcion/uuid-de-opcion/download
```

#### Respuesta

- Archivo PDF para descarga
- Header: `Content-Disposition: attachment; filename="..."`

---

### 7. Eliminar Opción (Card)

**DELETE** `/api/opciones-reinscripcion/:id`

🔒 **Requiere autenticación** (Token JWT)

Elimina la opción de reinscripción y su archivo PDF asociado del sistema.

#### Respuesta Exitosa (200 OK)

```json
{
  "message": "Opción de reinscripción 'Alumnos de la UTTecam' eliminada exitosamente."
}
```

---

## 📁 Estructura de Archivos

Los archivos PDF se guardan en:

```
uploads/opciones_reinscripcion/
├── Alumnos_de_la_UTTecam_1733800000000.pdf
├── Alumnos_provenientes_1733800100000.pdf
└── ...
```

### Formato de Nombre de Archivo

```
{nombre_original_sanitizado}_{timestamp}.pdf
```

- Nombre original: Caracteres especiales reemplazados por `_`
- Máximo 50 caracteres del nombre base
- Timestamp: Milisegundos desde epoch
- Extensión: `.pdf`

---

## 💡 Casos de Uso Completos

### Caso 1: Configuración Inicial del Sistema

```javascript
// 1. Configurar la sección (título y subtítulo principal)
const seccionResponse = await fetch('/api/opciones-reinscripcion/seccion', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    titulo: 'Opciones de Reinscripción',
    subtitulo: 'Selecciona el tipo de reinscripción que corresponda a tu situación',
  }),
});

// 2. Crear primera card (Alumnos UTTecam)
const formData1 = new FormData();
formData1.append('titulo', 'Alumnos de la UTTecam');
formData1.append('subtitulo', 'Reinscripción para estudiantes actuales');
formData1.append('activo', 'true');
formData1.append('archivo', pdfFile1);

await fetch('/api/opciones-reinscripcion', {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` },
  body: formData1,
});

// 3. Crear segunda card (Alumnos de otras UT)
const formData2 = new FormData();
formData2.append(
  'titulo',
  'Alumnos provenientes de generaciones anteriores y de otras Universidades Tecnológicas'
);
formData2.append(
  'subtitulo',
  'Proceso especial para estudiantes de generaciones pasadas o transferencias.'
);
formData2.append('activo', 'true');
formData2.append('archivo', pdfFile2);

await fetch('/api/opciones-reinscripcion', {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` },
  body: formData2,
});
```

---

### Caso 2: Mostrar en el Frontend

```javascript
// Obtener sección (título y subtítulo principal)
const seccionResponse = await fetch('/api/opciones-reinscripcion/seccion');
const seccion = await seccionResponse.json();

// Obtener todas las opciones activas (cards)
const opcionesResponse = await fetch('/api/opciones-reinscripcion?activas=true');
const opciones = await opcionesResponse.json();

// Renderizar
renderSeccion({
  titulo: seccion.titulo,
  subtitulo: seccion.subtitulo,
});

opciones.forEach((opcion) => {
  renderCard({
    titulo: opcion.titulo,
    subtitulo: opcion.subtitulo,
    downloadUrl: `/api/opciones-reinscripcion/${opcion.id}/download`,
  });
});
```

---

### Caso 3: Actualizar Solo el Título de la Sección

```javascript
// Actualizar solo la sección (sin tocar las cards)
await fetch('/api/opciones-reinscripcion/seccion', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    titulo: 'Opciones de Reinscripción 2025',
    subtitulo: 'Nuevo subtítulo actualizado',
  }),
});
```

---

### Caso 4: Actualizar PDF de una Card

```javascript
const formData = new FormData();
formData.append('id', 'uuid-de-card-existente'); // ← Incluir ID para actualizar
formData.append('titulo', 'Alumnos de la UTTecam');
formData.append('archivo', nuevoPdfFile); // El PDF anterior se eliminará automáticamente

await fetch('/api/opciones-reinscripcion', {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` },
  body: formData,
});
```

---

## 🔒 Seguridad

### Endpoints Protegidos (Requieren JWT)

- ✅ `POST /api/opciones-reinscripcion/seccion`
- ✅ `POST /api/opciones-reinscripcion`
- ✅ `DELETE /api/opciones-reinscripcion/:id`

### Endpoints Públicos

- 🌐 `GET /api/opciones-reinscripcion/seccion`
- 🌐 `GET /api/opciones-reinscripcion`
- 🌐 `GET /api/opciones-reinscripcion/:id`
- 🌐 `GET /api/opciones-reinscripcion/:id/download`

### Validaciones de Archivo

- ✅ Solo archivos PDF permitidos
- ✅ Tamaño máximo: 10MB
- ✅ Validación de MIME type: `application/pdf`
- ✅ Nombres de archivo sanitizados
- ✅ Eliminación automática de archivos antiguos al actualizar

---

## 🗄️ Base de Datos

### Scripts SQL

```sql
-- Crear tablas
CREATE TABLE IF NOT EXISTS seccion_reinscripcion (
  id VARCHAR(36) PRIMARY KEY,
  titulo VARCHAR(300) NOT NULL,
  subtitulo VARCHAR(500) DEFAULT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS opciones_reinscripcion (
  id VARCHAR(36) PRIMARY KEY,
  titulo VARCHAR(300) NOT NULL,
  subtitulo VARCHAR(500) DEFAULT NULL,
  archivoPath VARCHAR(500) NOT NULL,
  activo BOOLEAN DEFAULT TRUE NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Índices
CREATE INDEX idx_opciones_reinscripcion_activo ON opciones_reinscripcion(activo);
CREATE INDEX idx_opciones_reinscripcion_created ON opciones_reinscripcion(createdAt);
```

---

## ✅ Estado del Sistema

- ✅ Modelo `SeccionReinscripcion` creado (1 registro único)
- ✅ Modelo `OpcionReinscripcion` creado (múltiples cards)
- ✅ Services con lógica de negocio implementados
- ✅ Controller con manejo de archivos
- ✅ Rutas con validaciones registradas
- ✅ Sistema de archivos configurado
- ✅ Integrado en app.ts
- ✅ Base de datos sincronizada
- ✅ Documentación completa

**Sistema listo para producción** 🚀

---

## 📝 Instalación y Setup

```bash
# 1. Crear las tablas
mysql -u root -p uttecam < sql/opciones_reinscripcion.sql

# 2. (Opcional) Insertar datos de ejemplo
mysql -u root -p uttecam < sql/opciones_reinscripcion_seed.sql

# 3. Verificar que las tablas se crearon
mysql -u root -p uttecam -e "SHOW TABLES LIKE '%reinscripcion%';"
```

**Output esperado:**

```
+-------------------------------------+
| Tables_in_uttecam (%reinscripcion%) |
+-------------------------------------+
| seccion_reinscripcion               |
| opciones_reinscripcion              |
+-------------------------------------+
```
