# API Reference - UTTECAM

## Authentication
Esta API actualmente **no requiere autenticación**. Todos los endpoints son públicos.

## Base URL
```
http://localhost:3000
```

## Content Type
Todos los requests que envían datos deben usar:
```
Content-Type: application/json
```

## Rate Limiting
Actualmente **no hay límites de rate**, pero se recomienda no realizar más de 100 requests por minuto.

---

## Endpoints

### GET /

Obtiene información básica de la API.

**Response**
```json
{
  "mensaje": "API UTTECAM operativa",
  "version": "1.0.0",
  "endpoints": {
    "health": "/health",
    "textos": "/api/textos",
    "nosotros": "/api/nosotros",
    "directorios": "/api/directorios"
  }
}
```

---

### GET /health

Health check del sistema y base de datos.

**Response**
```json
{
  "status": "OK",
  "timestamp": "2025-09-25T10:30:00.000Z",
  "uptime": 3600,
  "database": "connected"
}
```

**Status Codes**
- `200`: Sistema operativo
- `500`: Error del sistema

---

### GET /api/textos

Obtiene lista de todos los textos.

**Response**
```json
[
  {
    "id": 1,
    "contenido": "Texto de ejemplo",
    "created_at": "2025-09-25T10:00:00.000Z",
    "updated_at": "2025-09-25T10:00:00.000Z"
  }
]
```

**Status Codes**
- `200`: Éxito
- `500`: Error del servidor

---

### GET /api/textos/:id

Obtiene un texto específico por ID.

**Parameters**
- `id` (integer, required): ID del texto

**Response Success (200)**
```json
{
  "id": 1,
  "contenido": "Texto específico",
  "created_at": "2025-09-25T10:00:00.000Z",
  "updated_at": "2025-09-25T10:00:00.000Z"
}
```

**Response Error (404)**
```json
{
  "error": "No encontrado"
}
```

**Response Error (400)**
```json
{
  "error": "ID inválido"
}
```

**Status Codes**
- `200`: Texto encontrado
- `400`: ID inválido
- `404`: Texto no encontrado
- `500`: Error del servidor

---

### POST /api/textos

Crea un nuevo texto.

**Request Body**
```json
{
  "contenido": "Nuevo texto a crear"
}
```

**Response Success (201)**
```json
{
  "id": 3,
  "contenido": "Nuevo texto a crear",
  "created_at": "2025-09-25T11:00:00.000Z",
  "updated_at": "2025-09-25T11:00:00.000Z"
}
```

**Response Error (400)**
```json
{
  "error": "contenido requerido (string no vacío)"
}
```

**Validation Rules**
- `contenido`: String requerido, no vacío después de trim()

**Status Codes**
- `201`: Texto creado exitosamente
- `400`: Datos inválidos
- `500`: Error del servidor

---

### PUT /api/textos/:id

Actualiza un texto existente.

**Parameters**
- `id` (integer, required): ID del texto a actualizar

**Request Body**
```json
{
  "contenido": "Contenido actualizado"
}
```

**Response Success (200)**
```json
{
  "id": 1,
  "contenido": "Contenido actualizado"
}
```

**Response Error (404)**
```json
{
  "error": "No encontrado"
}
```

**Response Error (400)**
```json
{
  "error": "contenido requerido"
}
```

**Validation Rules**
- `id`: Número entero válido
- `contenido`: String requerido, no vacío después de trim()

**Status Codes**
- `200`: Texto actualizado
- `400`: ID o datos inválidos
- `404`: Texto no encontrado
- `500`: Error del servidor

---

### DELETE /api/textos/:id

Elimina un texto existente.

**Parameters**
- `id` (integer, required): ID del texto a eliminar

**Response Success (204)**
Sin contenido en el body.

**Response Error (404)**
```json
{
  "error": "No encontrado"
}
```

**Response Error (400)**
```json
{
  "error": "ID inválido"
}
```

**Status Codes**
- `204`: Texto eliminado exitosamente
- `400`: ID inválido
- `404`: Texto no encontrado
- `500`: Error del servidor

---

## Error Handling

Todos los errores siguen el mismo formato:

```json
{
  "error": "Descripción del error"
}
```

### Common Error Responses

**400 Bad Request**
```json
{
  "error": "ID inválido"
}
```

**404 Not Found**
```json
{
  "error": "No encontrado"
}
```

**500 Internal Server Error**
```json
{
  "error": "Error interno del servidor",
  "message": "Detalles técnicos del error"
}
```

---

## Examples

### JavaScript/Fetch
```javascript
// Obtener todos los textos
fetch('http://localhost:3000/api/textos')
  .then(response => response.json())
  .then(data => console.log(data));

// Crear nuevo texto
fetch('http://localhost:3000/api/textos', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    contenido: 'Mi nuevo texto'
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

### Python/Requests
```python
import requests

# Obtener todos los textos
response = requests.get('http://localhost:3000/api/textos')
print(response.json())

# Crear nuevo texto
data = {'contenido': 'Mi nuevo texto'}
response = requests.post(
    'http://localhost:3000/api/textos',
    json=data
)
print(response.json())
```

### PHP/cURL
```php
// Obtener todos los textos
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://localhost:3000/api/textos');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
echo $response;

// Crear nuevo texto
$data = json_encode(['contenido' => 'Mi nuevo texto']);
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://localhost:3000/api/textos');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
echo $response;
```

---

## Directorios API

El módulo de directorios gestiona la información del personal y estructura organizacional de la universidad.

### GET /api/directorios

Obtiene todos los directorios registrados.

**Response Success (200)**
```json
{
  "message": "Directorios obtenidos correctamente",
  "data": [
    {
      "id": 1,
      "titulo": "Secretaría de Vinculación",
      "nombre": "Mtro. Daniel Huerta Conde",
      "telefono": "2494223300",
      "extension": "120",
      "correo": "vinculacion@uttecam.edu.mx",
      "imagen": "directorio_1696123456789.png"
    },
    {
      "id": 2,
      "titulo": "Encargado de Secretaría Académica",
      "nombre": "Mtro. Carlos Islas Contreras",
      "telefono": "2494223300",
      "extension": "135",
      "correo": "secretariaacademica@uttecam.edu.mx",
      "imagen": "directorio_1696123456790.png"
    }
  ]
}
```

**Status Codes**
- `200`: Directorios obtenidos exitosamente
- `500`: Error del servidor

---

### GET /api/directorios/:id

Obtiene un directorio específico por su ID.

**Parameters**
- `id` (number): ID del directorio

**Response Success (200)**
```json
{
  "message": "Directorio encontrado",
  "data": {
    "id": 1,
    "titulo": "Secretaría de Vinculación",
    "nombre": "Mtro. Daniel Huerta Conde",
    "telefono": "2494223300",
    "extension": "120",
    "correo": "vinculacion@uttecam.edu.mx",
    "imagen": "directorio_1696123456789.png"
  }
}
```

**Response Error (404)**
```json
{
  "message": "Directorio no encontrado"
}
```

**Response Error (400)**
```json
{
  "error": "ID inválido"
}
```

**Status Codes**
- `200`: Directorio encontrado
- `400`: ID inválido
- `404`: Directorio no encontrado
- `500`: Error del servidor

---

### POST /api/directorios

Crea un nuevo directorio. Soporta subida de imagen mediante multipart/form-data.

**Content-Type**: `multipart/form-data`

**Form Fields**
- `titulo` (string, required): Título del cargo (máx. 150 caracteres)
- `nombre` (string, required): Nombre completo de la persona (máx. 150 caracteres)
- `telefono` (string, optional): Número de teléfono (máx. 20 caracteres, solo números)
- `extension` (string, optional): Extensión telefónica (máx. 10 caracteres, solo números)
- `correo` (string, optional): Correo electrónico (máx. 150 caracteres, formato email válido)
- `imagen` (file, optional): Imagen del directorio (formatos: jpeg, jpg, png, gif, webp, avif, svg | máx. 5MB)

**Response Success (201)**
```json
{
  "message": "Directorio creado correctamente",
  "data": {
    "id": 3,
    "titulo": "Director de Tecnologías",
    "nombre": "Ing. Ana García López",
    "telefono": "2494223300",
    "extension": "140",
    "correo": "tecnologias@uttecam.edu.mx",
    "imagen": "directorio_1696123456791.png"
  }
}
```

**Response Error (400) - Campos requeridos**
```json
{
  "error": "Título y nombre son campos requeridos"
}
```

**Response Error (400) - Validación**
```json
{
  "error": "Error de validación",
  "details": [
    {
      "field": "correo",
      "message": "Debe ser un correo electrónico válido"
    },
    {
      "field": "telefono",
      "message": "El teléfono debe contener solo números"
    }
  ]
}
```

**Status Codes**
- `201`: Directorio creado exitosamente
- `400`: Error de validación o campos requeridos faltantes
- `500`: Error del servidor

---

### PUT /api/directorios/:id

Actualiza un directorio existente. Soporta subida de imagen mediante multipart/form-data.

**Parameters**
- `id` (number): ID del directorio a actualizar

**Content-Type**: `multipart/form-data`

**Form Fields**
- `titulo` (string, required): Título del cargo (máx. 150 caracteres)
- `nombre` (string, required): Nombre completo de la persona (máx. 150 caracteres)
- `telefono` (string, optional): Número de teléfono (máx. 20 caracteres, solo números)
- `extension` (string, optional): Extensión telefónica (máx. 10 caracteres, solo números)
- `correo` (string, optional): Correo electrónico (máx. 150 caracteres, formato email válido)
- `imagen` (file, optional): Nueva imagen del directorio (formatos: jpeg, jpg, png, gif, webp, avif, svg | máx. 5MB)

**Response Success (200)**
```json
{
  "message": "Directorio actualizado correctamente",
  "data": {
    "id": 1,
    "titulo": "Secretaría de Vinculación Empresarial",
    "nombre": "Mtro. Daniel Huerta Conde",
    "telefono": "2494223300",
    "extension": "120",
    "correo": "vinculacion@uttecam.edu.mx",
    "imagen": "directorio_1696123456792.png"
  }
}
```

**Response Error (400) - ID inválido**
```json
{
  "error": "ID inválido"
}
```

**Response Error (404)**
```json
{
  "message": "Directorio no encontrado"
}
```

**Response Error (400) - Validación**
```json
{
  "error": "Error de validación",
  "details": [
    {
      "field": "titulo",
      "message": "El título debe tener entre 1 y 150 caracteres"
    }
  ]
}
```

**Status Codes**
- `200`: Directorio actualizado exitosamente
- `400`: Error de validación, ID inválido o campos requeridos faltantes
- `404`: Directorio no encontrado
- `500`: Error del servidor

---

### DELETE /api/directorios/:id

Elimina un directorio específico.

**Parameters**
- `id` (number): ID del directorio a eliminar

**Response Success (200)**
```json
{
  "message": "Directorio eliminado correctamente",
  "data": {
    "id": 1
  }
}
```

**Response Error (400)**
```json
{
  "error": "ID inválido"
}
```

**Response Error (404)**
```json
{
  "message": "Directorio no encontrado"
}
```

**Status Codes**
- `200`: Directorio eliminado exitosamente
- `400`: ID inválido
- `404`: Directorio no encontrado
- `500`: Error del servidor

---

## Directorios - Ejemplos de Uso

### JavaScript/Fetch - Obtener todos los directorios
```javascript
fetch('http://localhost:3000/api/directorios')
  .then(response => response.json())
  .then(data => console.log(data));
```

### JavaScript/Fetch - Crear directorio con imagen
```javascript
const formData = new FormData();
formData.append('titulo', 'Director de Innovación');
formData.append('nombre', 'Dr. Luis Martínez');
formData.append('telefono', '2494223300');
formData.append('extension', '150');
formData.append('correo', 'innovacion@uttecam.edu.mx');
formData.append('imagen', fileInput.files[0]); // archivo de input file

fetch('http://localhost:3000/api/directorios', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

### JavaScript/Fetch - Actualizar directorio
```javascript
const formData = new FormData();
formData.append('titulo', 'Secretaría de Vinculación Empresarial');
formData.append('nombre', 'Mtro. Daniel Huerta Conde');
formData.append('telefono', '2494223300');
formData.append('extension', '120');
formData.append('correo', 'vinculacion@uttecam.edu.mx');

fetch('http://localhost:3000/api/directorios/1', {
  method: 'PUT',
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

### cURL - Crear directorio con imagen
```bash
curl -X POST http://localhost:3000/api/directorios \
  -F "titulo=Director de Sistemas" \
  -F "nombre=Ing. María González" \
  -F "telefono=2494223300" \
  -F "extension=160" \
  -F "correo=sistemas@uttecam.edu.mx" \
  -F "imagen=@/ruta/a/imagen.jpg"
```

### cURL - Obtener directorio específico
```bash
curl -X GET http://localhost:3000/api/directorios/1
```

### cURL - Eliminar directorio
```bash
curl -X DELETE http://localhost:3000/api/directorios/1
```

---

## Nosotros API

> 📖 **Documentación completa:** Ver **[NOSOTROS_API.md](./NOSOTROS_API.md)** para documentación detallada de la API de contenido institucional.

El módulo de **Nosotros** gestiona el contenido institucional de la universidad (visión, misión, valores, política integral, objetivo integral, política de no discriminación) con soporte para imágenes.

### Endpoints Principales
- `GET /api/nosotros/content` - Obtener todo el contenido institucional
- `GET /api/nosotros/content/{section}` - Obtener sección específica
- `POST /api/nosotros/content` - Crear contenido (requiere autenticación)
- `PUT /api/nosotros/content` - Actualizar todo el contenido (requiere autenticación)
- `PATCH /api/nosotros/content/{section}` - Actualizar sección específica (requiere autenticación)
- `DELETE /api/nosotros/content` - Eliminar todo el contenido (requiere autenticación)
- `DELETE /api/nosotros/content/{section}` - Restaurar sección a valores por defecto (requiere autenticación)

---

## Resumen de Endpoints

### Textos
- `GET /api/textos` - Listar textos con paginación
- `GET /api/textos/stats` - Estadísticas
- `GET /api/textos/:id` - Obtener por ID
- `POST /api/textos` - Crear texto
- `PUT /api/textos/:id` - Actualizar texto
- `DELETE /api/textos/:id` - Eliminar texto

### Directorios
- `GET /api/directorios` - Listar directorios
- `GET /api/directorios/:id` - Obtener por ID
- `POST /api/directorios` - Crear directorio (con imagen)
- `PUT /api/directorios/:id` - Actualizar directorio (con imagen)
- `DELETE /api/directorios/:id` - Eliminar directorio

### Nosotros
- `GET /api/nosotros/contenido` - Listar todo el contenido
- `GET /api/nosotros/contenido/:id` - Obtener por ID
- `GET /api/nosotros/contenido/tipo/:tipo` - Obtener por tipo
- `POST /api/nosotros/contenido` - Crear contenido (con imagen)
- `PUT /api/nosotros/contenido/:id` - Actualizar contenido (con imagen)
- `DELETE /api/nosotros/contenido/:id` - Eliminar contenido

---

## Resumen de Endpoints

### Textos
- `GET /api/textos` - Listar textos con paginación
- `GET /api/textos/stats` - Estadísticas
- `GET /api/textos/:id` - Obtener por ID
- `POST /api/textos` - Crear texto
- `PUT /api/textos/:id` - Actualizar texto
- `DELETE /api/textos/:id` - Eliminar texto

### Directorios
- `GET /api/directorios` - Listar directorios
- `GET /api/directorios/:id` - Obtener por ID
- `POST /api/directorios` - Crear directorio (con imagen)
- `PUT /api/directorios/:id` - Actualizar directorio (con imagen)
- `DELETE /api/directorios/:id` - Eliminar directorio

### Nosotros
- `GET /api/nosotros/content` - Obtener todo el contenido institucional
- `GET /api/nosotros/content/{section}` - Obtener sección específica
- `POST /api/nosotros/content` - Crear contenido (requiere autenticación)
- `PUT /api/nosotros/content` - Actualizar todo el contenido (requiere autenticación)
- `PATCH /api/nosotros/content/{section}` - Actualizar sección específica (requiere autenticación)
- `DELETE /api/nosotros/content` - Eliminar todo el contenido (requiere autenticación)
- `DELETE /api/nosotros/content/{section}` - Restaurar sección a valores por defecto (requiere autenticación)

---

**API UTTECAM - Documentación Completa v1.0** 📚  
**Última actualización:** Octubre 2025