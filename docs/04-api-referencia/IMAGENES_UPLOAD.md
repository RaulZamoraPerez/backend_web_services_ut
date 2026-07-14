# 📸 Sistema de Manejo de Imágenes - API Nosotros

## 🎯 Características Implementadas

### ✅ **Upload de Imágenes:**
- **Formatos soportados:** JPEG, JPG, PNG, GIF, WEBP, AVIF, SVG
- **Tamaño máximo:** 5MB por archivo
- **Nomenclatura automática:** `{tipo}_{timestamp}.{extension}`
- **Organización:** `/uploads/nosotros/`

### ✅ **Gestión Automática:**
- **Eliminación automática** de archivos al eliminar contenido
- **Reemplazo automático** de imágenes al actualizar
- **Limpieza automática** en caso de errores de validación
- **URLs completas** generadas automáticamente

## 📡 Endpoints con Soporte de Imágenes

### 1. **Crear Contenido con Imagen**
```http
POST /api/nosotros/contenido
Content-Type: multipart/form-data

tipo: vision
titulo: Mi Visión
descripcion: Descripción del contenido
imagen: [archivo de imagen]
lista: ["Item 1", "Item 2"]
```

### 2. **Actualizar Contenido con Nueva Imagen**
```http
PUT /api/nosotros/contenido/:id
Content-Type: multipart/form-data

titulo: Título actualizado
imagen: [nuevo archivo de imagen]
```

### 3. **Obtener Contenido (con URLs de imagen)**
```http
GET /api/nosotros/contenido
```

**Respuesta:**
```json
{
  "message": "Contenido obtenido correctamente",
  "count": 2,
  "data": [
    {
      "id": 1,
      "tipo": "vision",
      "titulo": "Nuestra Visión",
      "descripcion": "...",
      "imagen": "nosotros/vision_1727486365123.jpg",
      "imageUrl": "/uploads/nosotros/vision_1727486365123.jpg",
      "lista": null,
      "fechaCreacion": "2025-09-29T19:00:00.000Z",
      "fechaActualizacion": "2025-09-29T19:00:00.000Z"
    }
  ]
}
```

### 4. **Subir banner para sección de Extensión Universitaria**
```http
POST /api/extension/sections/:slug/upload-image
Content-Type: multipart/form-data
Authorization: Bearer {JWT}

image: [archivo de imagen]
```

Ejemplo de respuesta (200):
```json
{
  "id": 1,
  "slug": "talleres-culturales",
  "title": "Talleres Culturales",
  "description": "...",
  "banner_url": "/uploads/Actividades Culturales y Deportivas/Culturales/BANNER_DEPORTIVOS_CULTURALES.jpg",
  "items": []
}
```

Notas:
- Requiere autenticación (rol admin/editor según el token JWT)
- El archivo se almacena en `uploads/` bajo una ruta amigable relacionada a la sección
- Si ya existía un banner previo para la sección, es eliminado automáticamente
- Se valida el tipo y tamaño del archivo


## 🔧 Ejemplos de Uso con cURL

### Crear contenido con imagen:
```bash
curl -X POST "http://localhost:3001/api/nosotros/contenido" \
  -F "tipo=vision" \
  -F "titulo=Nueva Visión" \
  -F "descripcion=Descripción de nuestra visión" \
  -F "imagen=@/ruta/a/tu/imagen.jpg"
```

### Actualizar solo el texto (mantener imagen):
```bash
curl -X PUT "http://localhost:3001/api/nosotros/contenido/1" \
  -F "titulo=Título Actualizado" \
  -F "descripcion=Nueva descripción"
```

### Actualizar imagen:
```bash
curl -X PUT "http://localhost:3001/api/nosotros/contenido/1" \
  -F "imagen=@/ruta/a/nueva/imagen.png"
```

## 🌐 URLs de Acceso a Imágenes

Las imágenes subidas están disponibles en:
```
http://localhost:3001/uploads/nosotros/{nombre_archivo}
```

## 🛡️ Validaciones de Seguridad

### **Tipos de archivo:**
- ✅ Solo imágenes permitidas
- ✅ Validación de MIME type
- ✅ Validación de extensión

### **Tamaño:**
- ✅ Máximo 5MB por archivo
- ✅ Validación automática

### **Gestión de errores:**
- ✅ Limpieza automática de archivos en caso de error
- ✅ Eliminación de archivos huérfanos
- ✅ Rollback completo en operaciones fallidas

## 📁 Estructura de Directorios

```
BKUTTECAM/
├── uploads/
│   ├── nosotros/
│   │   ├── vision_1727486365123.jpg
│   │   ├── mision_1727486365124.webp
│   │   └── valores_1727486365125.png
│   └── .gitignore (ignora archivos, mantiene estructura)
```

## 🚀 Estados de Respuesta

### **Éxito (201/200):**
```json
{
  "message": "Contenido creado correctamente",
  "data": {
    "id": 1,
    "imageUrl": "/uploads/nosotros/vision_1727486365123.jpg"
  }
}
```

### **Error de validación (400):**
```json
{
  "error": "Solo se permiten imágenes (jpeg, jpg, png, gif, webp, avif, svg)"
}
```

### **Error de tamaño (400):**
```json
{
  "error": "File too large"
}
```

## 💡 Consejos de Uso

1. **Nombres descriptivos:** El sistema genera nombres únicos automáticamente
2. **Formatos recomendados:** WEBP para mejor compresión, PNG para transparencias
3. **Optimización:** Comprimir imágenes antes de subir para mejor rendimiento
4. **Backup:** Los archivos se eliminan automáticamente al eliminar contenido

## 🔍 Testing con PowerShell

```powershell
# Crear contenido sin imagen
$body = @{
    tipo = "vision"
    titulo = "Test"
    descripcion = "Descripción de prueba"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3001/api/nosotros/contenido" -Method POST -Body $body -ContentType "application/json"

# Para archivos, usar herramientas como Postman o crear formularios HTML
```

¡El sistema está completamente funcional y listo para producción! 🎉