# Formularios API - Documentación Completa

## Descripción
El módulo de Formularios permite crear y gestionar formularios dinámicos para la Universidad Tecnológica de Tecamachalco. Los formularios se almacenan en formato JSON lo que permite máxima flexibilidad para diferentes tipos de campos y estructuras.

## Modelo de Datos

### Estructura de la tabla `formularios`
```sql
CREATE TABLE `formularios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `contenido` json NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_created_at` (`created_at`)
);
```

### Estructura del JSON `contenido`
```json
{
  "titulo": "Nombre del formulario",
  "descripcion": "Descripción opcional del formulario",
  "campos": [
    {
      "tipo": "text|email|number|select|textarea|file|checkbox|radio|date",
      "nombre": "nombre_campo",
      "etiqueta": "Etiqueta visible para el usuario",
      "requerido": true|false,
      "placeholder": "Texto de ayuda opcional",
      "opciones": ["opcion1", "opcion2"], // solo para select, checkbox, radio
      "validacion": {
        "min": 1,
        "max": 100,
        "patron": "regex_pattern"
      }
    }
  ],
  "archivo": "archivo_adjunto.pdf" // opcional
}
```

### Tipos de Campo Soportados
- **text**: Campo de texto simple
- **email**: Campo de email con validación
- **number**: Campo numérico
- **select**: Lista desplegable
- **textarea**: Área de texto multilínea
- **file**: Subida de archivos
- **checkbox**: Casillas de verificación múltiple
- **radio**: Botones de radio (selección única)
- **date**: Selector de fecha

## Endpoints Disponibles

### 1. Listar todos los formularios
**GET** `/api/formularios`

**Response:**
```json
{
  "message": "Formularios obtenidos correctamente",
  "data": [
    {
      "id": 1,
      "contenido": {
        "titulo": "Formulario de Inscripción",
        "descripcion": "Formulario para nuevos estudiantes",
        "campos": [...],
        "archivo": "formulario_1696123456789.pdf"
      },
      "createdAt": "2025-10-03T10:30:00.000Z",
      "updatedAt": "2025-10-03T10:30:00.000Z"
    }
  ]
}
```

### 2. Obtener formulario específico
**GET** `/api/formularios/:id`

### 3. Crear nuevo formulario
**POST** `/api/formularios`

**Content-Type**: `multipart/form-data`

**Form Fields:**
- `titulo` (string, required): Título del formulario
- `descripcion` (string, optional): Descripción del formulario
- `campos` (string, optional): JSON string con la estructura de campos
- `archivo` (file, optional): Archivo adjunto al formulario

**Ejemplo de campos:**
```json
[
  {
    "tipo": "text",
    "nombre": "nombre_completo",
    "etiqueta": "Nombre completo",
    "requerido": true,
    "placeholder": "Ingrese su nombre completo"
  },
  {
    "tipo": "email",
    "nombre": "correo",
    "etiqueta": "Correo electrónico",
    "requerido": true
  },
  {
    "tipo": "select",
    "nombre": "carrera",
    "etiqueta": "Carrera de interés",
    "requerido": true,
    "opciones": ["Sistemas", "Administración", "Mecatrónica"]
  }
]
```

### 4. Actualizar formulario
**PUT** `/api/formularios/:id`

### 5. Eliminar formulario
**DELETE** `/api/formularios/:id`

## Ejemplos de Uso

### Frontend - Crear formulario con JavaScript
```javascript
// Estructura de campos
const campos = [
  {
    tipo: "text",
    nombre: "nombre",
    etiqueta: "Nombre completo",
    requerido: true
  },
  {
    tipo: "email",
    nombre: "email",
    etiqueta: "Correo electrónico",
    requerido: true
  },
  {
    tipo: "select",
    nombre: "departamento",
    etiqueta: "Departamento",
    requerido: true,
    opciones: ["Sistemas", "Administración", "Académico"]
  }
];

// Crear FormData
const formData = new FormData();
formData.append('titulo', 'Formulario de Solicitud');
formData.append('descripcion', 'Formulario para solicitudes internas');
formData.append('campos', JSON.stringify(campos));

// Si hay archivo
if (fileInput.files[0]) {
  formData.append('archivo', fileInput.files[0]);
}

// Enviar al servidor
fetch('/api/formularios', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => console.log('Formulario creado:', data));
```

### React - Renderizar formulario dinámico
```jsx
import React, { useState, useEffect } from 'react';

function FormularioRenderer({ formularioId }) {
  const [formulario, setFormulario] = useState(null);
  const [respuestas, setRespuestas] = useState({});

  useEffect(() => {
    // Cargar formulario
    fetch(`/api/formularios/${formularioId}`)
      .then(res => res.json())
      .then(data => {
        setFormulario(data.data);
        // Inicializar respuestas
        const inicial = {};
        data.data.contenido.campos.forEach(campo => {
          inicial[campo.nombre] = '';
        });
        setRespuestas(inicial);
      });
  }, [formularioId]);

  const handleInputChange = (nombre, valor) => {
    setRespuestas(prev => ({
      ...prev,
      [nombre]: valor
    }));
  };

  const renderCampo = (campo) => {
    const { tipo, nombre, etiqueta, requerido, opciones, placeholder } = campo;

    switch (tipo) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <input
            type={tipo}
            name={nombre}
            placeholder={placeholder}
            required={requerido}
            value={respuestas[nombre] || ''}
            onChange={(e) => handleInputChange(nombre, e.target.value)}
          />
        );

      case 'textarea':
        return (
          <textarea
            name={nombre}
            placeholder={placeholder}
            required={requerido}
            value={respuestas[nombre] || ''}
            onChange={(e) => handleInputChange(nombre, e.target.value)}
          />
        );

      case 'select':
        return (
          <select
            name={nombre}
            required={requerido}
            value={respuestas[nombre] || ''}
            onChange={(e) => handleInputChange(nombre, e.target.value)}
          >
            <option value="">Seleccione...</option>
            {opciones.map(opcion => (
              <option key={opcion} value={opcion}>{opcion}</option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div>
            {opciones.map(opcion => (
              <label key={opcion}>
                <input
                  type="checkbox"
                  value={opcion}
                  checked={(respuestas[nombre] || []).includes(opcion)}
                  onChange={(e) => {
                    const actual = respuestas[nombre] || [];
                    const nuevo = e.target.checked
                      ? [...actual, opcion]
                      : actual.filter(item => item !== opcion);
                    handleInputChange(nombre, nuevo);
                  }}
                />
                {opcion}
              </label>
            ))}
          </div>
        );

      case 'radio':
        return (
          <div>
            {opciones.map(opcion => (
              <label key={opcion}>
                <input
                  type="radio"
                  name={nombre}
                  value={opcion}
                  checked={respuestas[nombre] === opcion}
                  onChange={(e) => handleInputChange(nombre, e.target.value)}
                />
                {opcion}
              </label>
            ))}
          </div>
        );

      default:
        return <span>Tipo de campo no soportado</span>;
    }
  };

  if (!formulario) return <div>Cargando...</div>;

  return (
    <form className="formulario-dinamico">
      <h2>{formulario.contenido.titulo}</h2>
      {formulario.contenido.descripcion && (
        <p className="descripcion">{formulario.contenido.descripcion}</p>
      )}
      
      {formulario.contenido.campos.map(campo => (
        <div key={campo.nombre} className="campo-grupo">
          <label>
            {campo.etiqueta}
            {campo.requerido && <span className="requerido">*</span>}
          </label>
          {renderCampo(campo)}
        </div>
      ))}
      
      <button type="submit">Enviar</button>
    </form>
  );
}

export default FormularioRenderer;
```

### CSS Sugerido
```css
.formulario-dinamico {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
}

.formulario-dinamico h2 {
  color: #2c3e50;
  margin-bottom: 10px;
  text-align: center;
}

.descripcion {
  color: #7f8c8d;
  text-align: center;
  margin-bottom: 30px;
  font-style: italic;
}

.campo-grupo {
  margin-bottom: 20px;
}

.campo-grupo label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #34495e;
}

.requerido {
  color: #e74c3c;
  margin-left: 3px;
}

.campo-grupo input,
.campo-grupo textarea,
.campo-grupo select {
  width: 100%;
  padding: 10px;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  font-size: 14px;
}

.campo-grupo input:focus,
.campo-grupo textarea:focus,
.campo-grupo select:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
}

.campo-grupo input[type="checkbox"],
.campo-grupo input[type="radio"] {
  width: auto;
  margin-right: 8px;
}

button[type="submit"] {
  background-color: #3498db;
  color: white;
  padding: 12px 30px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
  margin-top: 20px;
}

button[type="submit"]:hover {
  background-color: #2980b9;
}
```

## Constructor de Formularios

### Interfaz de Administración
```jsx
import React, { useState } from 'react';

function FormularioBuilder() {
  const [formulario, setFormulario] = useState({
    titulo: '',
    descripcion: '',
    campos: []
  });

  const tiposCampo = [
    { value: 'text', label: 'Texto' },
    { value: 'email', label: 'Email' },
    { value: 'number', label: 'Número' },
    { value: 'textarea', label: 'Área de texto' },
    { value: 'select', label: 'Lista desplegable' },
    { value: 'checkbox', label: 'Casillas múltiples' },
    { value: 'radio', label: 'Opción única' },
    { value: 'date', label: 'Fecha' },
    { value: 'file', label: 'Archivo' }
  ];

  const agregarCampo = () => {
    const nuevoCampo = {
      tipo: 'text',
      nombre: `campo_${Date.now()}`,
      etiqueta: '',
      requerido: false,
      placeholder: '',
      opciones: []
    };
    
    setFormulario(prev => ({
      ...prev,
      campos: [...prev.campos, nuevoCampo]
    }));
  };

  const actualizarCampo = (index, campo) => {
    setFormulario(prev => {
      const nuevosCampos = [...prev.campos];
      nuevosCampos[index] = campo;
      return { ...prev, campos: nuevosCampos };
    });
  };

  const eliminarCampo = (index) => {
    setFormulario(prev => ({
      ...prev,
      campos: prev.campos.filter((_, i) => i !== index)
    }));
  };

  const guardarFormulario = async () => {
    const formData = new FormData();
    formData.append('titulo', formulario.titulo);
    formData.append('descripcion', formulario.descripcion);
    formData.append('campos', JSON.stringify(formulario.campos));

    try {
      const response = await fetch('/api/formularios', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        alert('Formulario guardado exitosamente');
        setFormulario({ titulo: '', descripcion: '', campos: [] });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="formulario-builder">
      <h2>Constructor de Formularios</h2>
      
      {/* Información básica */}
      <div className="seccion-basica">
        <h3>Información Básica</h3>
        <input
          type="text"
          placeholder="Título del formulario"
          value={formulario.titulo}
          onChange={(e) => setFormulario(prev => ({ ...prev, titulo: e.target.value }))}
        />
        <textarea
          placeholder="Descripción (opcional)"
          value={formulario.descripcion}
          onChange={(e) => setFormulario(prev => ({ ...prev, descripcion: e.target.value }))}
        />
      </div>

      {/* Campos */}
      <div className="seccion-campos">
        <h3>Campos del Formulario</h3>
        {formulario.campos.map((campo, index) => (
          <CampoEditor
            key={index}
            campo={campo}
            tiposCampo={tiposCampo}
            onUpdate={(nuevoCampo) => actualizarCampo(index, nuevoCampo)}
            onDelete={() => eliminarCampo(index)}
          />
        ))}
        
        <button onClick={agregarCampo} className="btn-agregar">
          + Agregar Campo
        </button>
      </div>

      {/* Acciones */}
      <div className="acciones">
        <button onClick={guardarFormulario} className="btn-guardar">
          Guardar Formulario
        </button>
      </div>
    </div>
  );
}

function CampoEditor({ campo, tiposCampo, onUpdate, onDelete }) {
  const handleChange = (propiedad, valor) => {
    onUpdate({ ...campo, [propiedad]: valor });
  };

  return (
    <div className="campo-editor">
      <div className="campo-header">
        <select
          value={campo.tipo}
          onChange={(e) => handleChange('tipo', e.target.value)}
        >
          {tiposCampo.map(tipo => (
            <option key={tipo.value} value={tipo.value}>
              {tipo.label}
            </option>
          ))}
        </select>
        <button onClick={onDelete} className="btn-eliminar">×</button>
      </div>
      
      <input
        type="text"
        placeholder="Nombre del campo"
        value={campo.nombre}
        onChange={(e) => handleChange('nombre', e.target.value)}
      />
      
      <input
        type="text"
        placeholder="Etiqueta visible"
        value={campo.etiqueta}
        onChange={(e) => handleChange('etiqueta', e.target.value)}
      />
      
      {campo.tipo !== 'checkbox' && campo.tipo !== 'radio' && (
        <input
          type="text"
          placeholder="Placeholder (opcional)"
          value={campo.placeholder || ''}
          onChange={(e) => handleChange('placeholder', e.target.value)}
        />
      )}
      
      <label>
        <input
          type="checkbox"
          checked={campo.requerido}
          onChange={(e) => handleChange('requerido', e.target.checked)}
        />
        Campo requerido
      </label>
      
      {['select', 'checkbox', 'radio'].includes(campo.tipo) && (
        <div className="opciones-editor">
          <h4>Opciones:</h4>
          {(campo.opciones || []).map((opcion, i) => (
            <div key={i} className="opcion-item">
              <input
                type="text"
                value={opcion}
                onChange={(e) => {
                  const nuevasOpciones = [...(campo.opciones || [])];
                  nuevasOpciones[i] = e.target.value;
                  handleChange('opciones', nuevasOpciones);
                }}
              />
              <button onClick={() => {
                const nuevasOpciones = (campo.opciones || []).filter((_, index) => index !== i);
                handleChange('opciones', nuevasOpciones);
              }}>×</button>
            </div>
          ))}
          <button onClick={() => {
            const nuevasOpciones = [...(campo.opciones || []), ''];
            handleChange('opciones', nuevasOpciones);
          }}>+ Agregar opción</button>
        </div>
      )}
    </div>
  );
}

export default FormularioBuilder;
```

## Casos de Uso

### 1. Formulario de Inscripción
```json
{
  "titulo": "Inscripción de Estudiantes",
  "descripcion": "Formulario para el registro de nuevos estudiantes",
  "campos": [
    {
      "tipo": "text",
      "nombre": "nombre_completo",
      "etiqueta": "Nombre completo",
      "requerido": true
    },
    {
      "tipo": "email",
      "nombre": "correo",
      "etiqueta": "Correo electrónico",
      "requerido": true
    },
    {
      "tipo": "select",
      "nombre": "carrera",
      "etiqueta": "Carrera",
      "requerido": true,
      "opciones": ["Ingeniería en Sistemas", "Administración", "Mecatrónica"]
    },
    {
      "tipo": "date",
      "nombre": "fecha_nacimiento",
      "etiqueta": "Fecha de nacimiento",
      "requerido": true
    }
  ]
}
```

### 2. Formulario de Contacto
```json
{
  "titulo": "Contacto",
  "descripcion": "Envíanos tus consultas",
  "campos": [
    {
      "tipo": "text",
      "nombre": "nombre",
      "etiqueta": "Nombre",
      "requerido": true
    },
    {
      "tipo": "email",
      "nombre": "email",
      "etiqueta": "Email",
      "requerido": true
    },
    {
      "tipo": "select",
      "nombre": "categoria",
      "etiqueta": "Categoría",
      "requerido": true,
      "opciones": ["Información general", "Admisiones", "Soporte técnico"]
    },
    {
      "tipo": "textarea",
      "nombre": "mensaje",
      "etiqueta": "Mensaje",
      "requerido": true
    }
  ]
}
```

## Mejoras Futuras

1. **Validaciones avanzadas**: Patrones regex, rangos de valores
2. **Campos condicionales**: Mostrar/ocultar campos según respuestas
3. **Plantillas predefinidas**: Formularios comunes ya configurados
4. **Exportación de respuestas**: Excel, CSV, PDF
5. **Notificaciones por email**: Alertas automáticas
6. **Integración con calendario**: Para campos de fecha/hora
7. **Firma digital**: Para formularios oficiales
8. **Múltiples idiomas**: Soporte para formularios bilingües
9. **Análisis de respuestas**: Dashboard con estadísticas
10. **API de respuestas**: Endpoint para enviar respuestas de formularios