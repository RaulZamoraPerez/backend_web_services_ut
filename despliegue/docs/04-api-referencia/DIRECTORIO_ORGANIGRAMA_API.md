# API de Directorio y Organigrama - UTTECAM

## Descripción General

Este módulo maneja dos estructuras relacionadas con el personal de la universidad:

1. **Directorio**: Lista plana de contactos con información básica (teléfono, email, etc.)
2. **Organigrama**: Estructura jerárquica del personal de la universidad

## Endpoints

### Directorio

#### GET `/api/directorios`
Obtiene todos los registros del directorio ordenados por título.

**Respuesta:**
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
      "imagen": "Organigrama/secretarioVinculacion.png"
    }
  ]
}
```

#### GET `/api/directorios/:id`
Obtiene un registro específico por ID.

#### POST `/api/directorios` 🔒
Crea un nuevo registro en el directorio. Requiere autenticación.

**Body (multipart/form-data):**
- `titulo` (requerido): Cargo o puesto
- `nombre` (requerido): Nombre completo
- `telefono` (opcional): Número telefónico
- `extension` (opcional): Extensión telefónica
- `correo` (opcional): Email
- `imagen` (opcional): Archivo de imagen

#### PUT `/api/directorios/:id` 🔒
Actualiza un registro existente. Requiere autenticación.

#### DELETE `/api/directorios/:id` 🔒
Elimina un registro. Requiere autenticación.

---

### Organigrama

#### GET `/api/organigrama`
Obtiene la estructura jerárquica completa del organigrama.

**Respuesta:**
```json
{
  "message": "Organigrama obtenido correctamente",
  "data": [
    {
      "key": "rector",
      "expanded": true,
      "type": "person",
      "data": {
        "image": "Organigrama/Rector.png",
        "name": "Ing. Enrique Salvador Fernández Lozada",
        "title": "Rector",
        "text": "Descripción opcional..."
      },
      "children": [
        // Nodos hijos...
      ]
    }
  ]
}
```

#### GET `/api/organigrama/flat`
Obtiene una lista plana (sin jerarquía) de todos los nodos.

#### GET `/api/organigrama/:id`
Obtiene un nodo específico por ID.

#### POST `/api/organigrama` 🔒
Crea un nuevo nodo en el organigrama. Requiere autenticación.

**Body (multipart/form-data):**
- `name` (requerido): Nombre completo
- `title` (requerido): Cargo o título
- `image` (requerido): Ruta o archivo de imagen
- `parent_id` (opcional): ID del nodo padre
- `type` (opcional): Tipo de nodo (default: 'person')
- `expanded` (opcional): Si está expandido (default: true)
- `text` (opcional): Descripción o biografía
- `order_position` (opcional): Posición de orden
- `key` (opcional): Clave única del nodo

#### PUT `/api/organigrama/:id` 🔒
Actualiza un nodo existente. Requiere autenticación.

#### DELETE `/api/organigrama/:id` 🔒
Elimina un nodo. **No se puede eliminar si tiene hijos**. Requiere autenticación.

#### POST `/api/organigrama/sync` 🔒
Sincroniza toda la estructura jerárquica desde datos del cliente. Requiere autenticación.

**Body:**
```json
{
  "data": [
    {
      "expanded": true,
      "type": "person",
      "data": {
        "image": "path/to/image.png",
        "name": "Nombre Completo",
        "title": "Cargo",
        "text": "Descripción opcional"
      },
      "children": [...]
    }
  ]
}
```

---

## Sincronización desde el Cliente

El sistema está diseñado para que el **cliente (UTTECAM)** sea la fuente de verdad. Los datos reales están en:

- `UTTECAM/src/data/directorios.data.ts`
- `UTTECAM/src/data/Organigrama.data.ts`

Para sincronizar estos datos con el backend:

```bash
cd BKUTTECAM
node scripts/sync-directorio-organigrama.js
```

Este script:
1. Lee los datos del cliente
2. Los envía al backend
3. Crea/actualiza los registros en la base de datos

---

## Estructura de Base de Datos

### Tabla `directorios`
```sql
CREATE TABLE directorios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(150) NOT NULL,
  nombre VARCHAR(150) NOT NULL,
  telefono VARCHAR(20),
  extension VARCHAR(10),
  correo VARCHAR(150),
  imagen VARCHAR(255)
);
```

### Tabla `organigrama`
```sql
CREATE TABLE organigrama (
  id INT AUTO_INCREMENT PRIMARY KEY,
  key VARCHAR(50),
  parent_id INT,
  expanded BOOLEAN DEFAULT TRUE,
  type VARCHAR(50) DEFAULT 'person',
  image VARCHAR(255) NOT NULL,
  name VARCHAR(200) NOT NULL,
  title VARCHAR(200) NOT NULL,
  text TEXT,
  order_position INT DEFAULT 0,
  FOREIGN KEY (parent_id) REFERENCES organigrama(id) ON DELETE CASCADE
);
```

---

## Imágenes

Las imágenes se almacenan en:
- **Directorio**: `/uploads/directorio/`
- **Organigrama**: `/uploads/organigrama/`

Formatos permitidos: JPG, PNG, WebP, AVIF
Tamaño máximo: 10MB

---

## Seguridad

- Los endpoints GET son públicos
- Los endpoints POST, PUT, DELETE requieren autenticación con JWT
- Las imágenes son validadas por tipo MIME
- Rate limiting aplicado

---

## Notas Importantes

1. **El cliente es la fuente de verdad**: Todos los datos reales están en el frontend UTTECAM
2. **Sincronización manual**: Usa el script `sync-directorio-organigrama.js` para actualizar el backend
3. **Organigrama jerárquico**: El backend maneja la estructura de árbol automáticamente
4. **No eliminar padres**: No se pueden eliminar nodos del organigrama que tengan hijos

---

## Ejemplos de Uso

### Obtener Directorio (Cliente)
```typescript
const response = await fetch('http://localhost:3002/api/directorios');
const data = await response.json();
```

### Obtener Organigrama (Cliente)
```typescript
const response = await fetch('http://localhost:3002/api/organigrama');
const data = await response.json();
// data.data contendrá la estructura jerárquica completa
```

### Crear en Directorio (Dashboard)
```typescript
const formData = new FormData();
formData.append('titulo', 'Director General');
formData.append('nombre', 'Dr. Juan Pérez');
formData.append('telefono', '9831234567');
formData.append('extension', '100');
formData.append('correo', 'director@uttecam.edu.mx');
formData.append('imagen', fileInput.files[0]);

const response = await fetchWithAuth('/directorios', {
  method: 'POST',
  body: formData
});
```
