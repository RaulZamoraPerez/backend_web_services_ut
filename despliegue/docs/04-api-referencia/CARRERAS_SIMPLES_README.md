# Sistema de Carreras Dinámicas

## 🎯 Propósito

Sistema para gestionar el catálogo de carreras de UTTECAM de forma dinámica, sin necesidad de modificar código. Reemplaza el array estático `CARRERAS_DISPONIBLES` con una API completa.

## 📁 Archivos Creados

```
src/
├── models/
│   └── CarreraSimple.ts                          # Modelo Sequelize
├── controllers/
│   └── carreras-simples/
│       ├── CarreraSimpleService.ts               # Lógica de negocio
│       └── CarreraSimpleController.ts            # Controladores HTTP
├── routes/
│   └── CarreraSimpleRoute.ts                     # Rutas y validaciones
scripts/
└── seeds/
    └── seedCarrerasSimples.ts                    # Seed con 10 carreras iniciales
```

## 🚀 Endpoints

### Públicos (sin autenticación)

- `GET /api/carreras-simples` - Todas las carreras
- `GET /api/carreras-simples/grouped` - Agrupadas por tipo
- `GET /api/carreras-simples/nombres` - Solo nombres (para selectores)
- `GET /api/carreras-simples/:id` - Carrera específica

### Protegidos (requieren JWT)

- `POST /api/carreras-simples` - Crear carrera
- `PUT /api/carreras-simples/:id` - Editar carrera
- `DELETE /api/carreras-simples/:id` - Eliminar carrera

## 📊 Modelo de Datos

```typescript
{
  id: string; // UUID
  nombre: string; // "TSU en Desarrollo de Software"
  tipo: string; // TSU | INGENIERIA | LICENCIATURA | MAESTRIA | DOCTORADO | OTRO
  activo: boolean; // true/false
  createdAt: Date;
  updatedAt: Date;
}
```

## 💡 Uso en Frontend

### Antes (Array estático):

```javascript
const CARRERAS_DISPONIBLES = [
  'TSU en Desarrollo de Software',
  'TSU en Mecatrónica',
  // ...
];
```

### Ahora (API dinámica):

```javascript
// Obtener nombres para selector
const response = await fetch('/api/carreras-simples/nombres?activas=true');
const carreras = await response.json();
// ["TSU en Desarrollo de Software", "TSU en Mecatrónica", ...]
```

### Agregar nueva carrera desde Dashboard:

```javascript
const token = localStorage.getItem('token');
await fetch('/api/carreras-simples', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    nombre: 'TSU en Ciberseguridad',
    tipo: 'TSU',
    activo: true,
  }),
});
```

## 🌱 Seed Inicial

El sistema incluye 10 carreras iniciales:

**TSU:**

- TSU en Desarrollo de Software
- TSU en Mecatrónica
- TSU en Energías Renovables
- TSU en Procesos Industriales
- TSU en Tecnologías de la Información

**Ingenierías:**

- Ingeniería en Desarrollo de Software
- Ingeniería en Mecatrónica
- Ingeniería en Energías Renovables
- Ingeniería en Procesos Industriales
- Ingeniería en Tecnologías de la Información

## ✅ Ventajas

✅ **No requiere modificar código** para agregar/editar carreras  
✅ **Gestión desde dashboard** con interfaz amigable  
✅ **Historial de cambios** con timestamps  
✅ **Activar/desactivar** sin eliminar datos  
✅ **Sincronización automática** en todo el sistema  
✅ **Filtrado flexible** (activas/todas)  
✅ **Agrupación por tipo** para UI organizada

## 📝 Casos de Uso

1. **Dashboard - Gestión de Catálogo**

   - Crear nuevas carreras cuando se abran programas
   - Editar nombres si cambian oficialmente
   - Desactivar carreras descontinuadas (sin eliminar historial)

2. **Formularios Públicos**

   - Mostrar selector de carreras disponibles
   - Checkboxes organizados por categoría (TSU/Ingeniería)
   - Actualización automática cuando se agregan carreras

3. **Asignación de Personal**

   - Usar el catálogo dinámico para asignar personal a carreras
   - Garantiza que solo se asignen carreras existentes

4. **Reportes y Estadísticas**
   - Filtrar por tipo de carrera
   - Ver carreras activas vs inactivas
   - Historial de cuándo se agregó cada carrera

## 🔐 Seguridad

- Rutas de lectura: **Públicas** (cualquiera puede consultar)
- Rutas de escritura: **Protegidas** con JWT (solo admins)
- Validación de datos con express-validator
- Nombre único a nivel de base de datos

## 📖 Documentación Completa

- `CARRERAS_SIMPLES_ENDPOINTS.txt` - Documentación detallada de todos los endpoints
- `CARRERAS_SIMPLES_FRONTEND.txt` - Ejemplos de integración en React y Vanilla JS

## 🔄 Integración Completa

✅ Modelo registrado en `syncDatabase.ts`  
✅ Rutas registradas en `app.ts` (`/api/carreras-simples`)  
✅ Sin errores de compilación  
✅ Listo para usar
