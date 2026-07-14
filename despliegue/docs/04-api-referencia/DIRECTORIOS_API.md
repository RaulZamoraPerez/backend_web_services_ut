# Directorios API - Documentación Completa

## Descripción
El módulo de Directorios gestiona la información del personal y estructura organizacional de la Universidad Tecnológica de Tecamachalco. Permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre los registros del directorio institucional.

## Modelo de Datos

### Estructura de la tabla `directorios`
```sql
CREATE TABLE `directorios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(150) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `extension` varchar(10) DEFAULT NULL,
  `correo` varchar(150) DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
);
```

### Campos
- **id**: Identificador único (auto-incrementable)
- **titulo**: Cargo o posición (requerido, máx. 150 caracteres)
- **nombre**: Nombre completo de la persona (requerido, máx. 150 caracteres)
- **telefono**: Número telefónico (opcional, máx. 20 caracteres, solo números)
- **extension**: Extensión telefónica (opcional, máx. 10 caracteres, solo números)
- **correo**: Correo electrónico institucional (opcional, máx. 150 caracteres, formato email)
- **imagen**: Ruta de la imagen/fotografía (opcional, máx. 255 caracteres)

### Validaciones
- **titulo**: No vacío, entre 1-150 caracteres
- **nombre**: No vacío, entre 1-150 caracteres
- **telefono**: Solo números, máximo 20 caracteres
- **extension**: Solo números, máximo 10 caracteres
- **correo**: Formato de email válido, máximo 150 caracteres
- **imagen**: Formatos permitidos: jpeg, jpg, png, gif, webp, avif, svg
- **Tamaño de archivo**: Máximo 5MB

## Endpoints Disponibles

### 1. Listar todos los directorios
**GET** `/api/directorios`

### 2. Obtener directorio específico
**GET** `/api/directorios/:id`

### 3. Crear nuevo directorio
**POST** `/api/directorios`

### 4. Actualizar directorio
**PUT** `/api/directorios/:id`

### 5. Eliminar directorio
**DELETE** `/api/directorios/:id`

## Manejo de Archivos

### Configuración de Upload
- **Directorio destino**: `/uploads/directorios/`
- **Formatos permitidos**: jpeg, jpg, png, gif, webp, avif, svg
- **Tamaño máximo**: 5MB
- **Nomenclatura**: `directorio_{timestamp}.{extension}`

### Middleware utilizado
```typescript
import { uploadDirectorios } from '../middleware/uploadMiddleware';

// Para endpoints que manejan archivos
router.post('/', uploadDirectorios.single('imagen'), createDirectorio);
router.put('/:id', uploadDirectorios.single('imagen'), updateDirectorio);
```

## Ejemplos de Uso

### Frontend (HTML + JavaScript)

#### Formulario para crear directorio
```html
<form id="directorioForm" enctype="multipart/form-data">
  <input type="text" name="titulo" placeholder="Título del cargo" required>
  <input type="text" name="nombre" placeholder="Nombre completo" required>
  <input type="tel" name="telefono" placeholder="Teléfono">
  <input type="text" name="extension" placeholder="Extensión">
  <input type="email" name="correo" placeholder="Correo electrónico">
  <input type="file" name="imagen" accept="image/*">
  <button type="submit">Crear Directorio</button>
</form>

<script>
document.getElementById('directorioForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  
  try {
    const response = await fetch('/api/directorios', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('Directorio creado:', result);
      // Actualizar UI
    } else {
      console.error('Error:', result);
    }
  } catch (error) {
    console.error('Error de red:', error);
  }
});
</script>
```

#### Listar directorios con React
```jsx
import React, { useState, useEffect } from 'react';

function DirectoriosList() {
  const [directorios, setDirectorios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDirectorios();
  }, []);

  const fetchDirectorios = async () => {
    try {
      const response = await fetch('/api/directorios');
      const data = await response.json();
      setDirectorios(data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteDirectorio = async (id) => {
    if (confirm('¿Eliminar este directorio?')) {
      try {
        const response = await fetch(`/api/directorios/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setDirectorios(directorios.filter(d => d.id !== id));
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="directorios-list">
      {directorios.map(directorio => (
        <div key={directorio.id} className="directorio-card">
          {directorio.imagen && (
            <img 
              src={`/uploads/directorios/${directorio.imagen}`}
              alt={directorio.nombre}
              className="directorio-imagen"
            />
          )}
          <h3>{directorio.titulo}</h3>
          <p><strong>{directorio.nombre}</strong></p>
          {directorio.telefono && (
            <p>📞 {directorio.telefono} 
              {directorio.extension && ` ext. ${directorio.extension}`}
            </p>
          )}
          {directorio.correo && (
            <p>📧 <a href={`mailto:${directorio.correo}`}>{directorio.correo}</a></p>
          )}
          <button onClick={() => deleteDirectorio(directorio.id)}>
            Eliminar
          </button>
        </div>
      ))}
    </div>
  );
}

export default DirectoriosList;
```

## Consideraciones de Seguridad

### Validación de Archivos
- Solo se aceptan formatos de imagen específicos
- Límite de tamaño de archivo (5MB)
- Validación de MIME type
- Nombres de archivo únicos para evitar colisiones

### Validación de Datos
- Validación de formato de email
- Validación de campos numéricos (teléfono, extensión)
- Sanitización de strings
- Validación de longitud de campos

### Manejo de Errores
- Respuestas de error estructuradas
- Logging de errores del servidor
- Manejo de errores de base de datos
- Validación de entrada del usuario

## Datos de Ejemplo

### Directorio típico
```json
{
  "id": 1,
  "titulo": "Secretaría de Vinculación",
  "nombre": "Mtro. Daniel Huerta Conde",
  "telefono": "2494223300",
  "extension": "120",
  "correo": "vinculacion@uttecam.edu.mx",
  "imagen": "directorio_1696123456789.png"
}
```

### Lista de directorios institucionales
Los datos incluyen personal de:
- Secretaría de Vinculación
- Secretaría Académica
- Abogado General
- Contraloría Interna
- Dirección de Administración y Finanzas
- Extensión Universitaria

## Integración con Frontend

### CSS Sugerido para tarjetas de directorio
```css
.directorios-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}

.directorio-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.directorio-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.directorio-imagen {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 15px;
}

.directorio-card h3 {
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 1.1em;
}

.directorio-card p {
  margin: 8px 0;
  color: #34495e;
}
```

## Mejoras Futuras

### Posibles extensiones
1. **Búsqueda y filtrado**: Endpoint para buscar por nombre, título o área
2. **Categorización**: Agrupar por departamentos o áreas
3. **Historial**: Mantener registro de cambios
4. **Permisos**: Sistema de roles para edición
5. **Notificaciones**: Alertas cuando se actualiza información
6. **Exportación**: Generar directorio en PDF o Excel
7. **Sincronización**: Integración con sistemas HR existentes

### Optimizaciones
1. **Caché**: Implementar caché para consultas frecuentes
2. **Compresión de imágenes**: Redimensionar automáticamente
3. **CDN**: Servir imágenes desde CDN
4. **Paginación**: Para listas grandes de directorios
5. **Indexación**: Índices de base de datos para búsquedas rápidas