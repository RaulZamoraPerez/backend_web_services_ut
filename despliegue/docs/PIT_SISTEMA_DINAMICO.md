# Sistema Dinámico PIT - Flujo Completo

## 📋 Descripción

El Programa Institucional de Tutorías (PIT) ahora funciona con un sistema dinámico similar a "Servicios y Gestión", donde todo el contenido se gestiona desde el Dashboard y se muestra automáticamente en el sitio público UTTECAM.

## 🏗️ Arquitectura

### Backend (BKUTTECAM)
- **Base de Datos**: Área PIT (ID: 7) en la tabla `area`
- **Modelos**: Area, Categorias, Archivos (con relaciones)
- **API**: Endpoints en `/api/documentos`

### Dashboard (Dashboard-UTTECAM)
- **Componente**: `src/pages/Accesos/Pit.tsx`
- **Servicio**: `GestorDocumentos` (gestión CRUD completa)
- **Configuración**: `src/constants/areas.ts` (ID_Area: 7)

### Sitio Público (UTTECAM)
- **Componente**: `src/views/Sigc/PIT.tsx` (dinámico)
- **API Service**: `src/util/documentosApi.ts`
- **Ruta**: `/programa-institucional-tutorias`

## 🔄 Flujo de Trabajo

### 1. Gestión desde el Dashboard

El administrador accede a **Dashboard > Accesos > PIT**:

1. **Crear Categorías**: Organizar documentos por año, tipo, etc.
   - Ejemplo: "2024", "2023", "Formatos", etc.

2. **Subir Documentos**: En cada categoría
   - Drag & drop o selección múltiple
   - Nombres descriptivos automáticos
   - Validación de tipos de archivo

3. **Gestionar**: 
   - Editar nombres de categorías
   - Eliminar documentos
   - Reorganizar contenido

### 2. Visualización Automática en UTTECAM

Todo lo creado en el Dashboard aparece automáticamente en:
- **Ruta**: `https://uttecam.edu.mx/programa-institucional-tutorias`
- **Componente**: Tabla dinámica con todas las categorías y documentos
- **Actualización**: En tiempo real al recargar la página

## 🛠️ Configuración Técnica

### Base de Datos

```sql
-- El área PIT ya está creada
SELECT * FROM area WHERE ID_Area = 7;
-- Resultado: ID_Area: 7, Nombre: 'PIT'
```

### Constantes del Dashboard

```typescript
// src/constants/areas.ts
export const AREAS = {
  // ... otras áreas
  PIT: 7,
} as const;

export const NOMBRES_AREAS = {
  // ... otros nombres
  [AREAS.PIT]: 'Programa Institucional de Tutorías (PIT)',
} as const;
```

### Componente UTTECAM

```tsx
// src/views/Sigc/PIT.tsx
export const PIT = () => {
  const [secciones, setSecciones] = useState<Seccion[]>([]);
  
  useEffect(() => {
    const loadDocuments = async () => {
      const area = await fetchArea(7); // ID del área PIT
      if (area) {
        // Mapear categorías y documentos
        const seccionesMapped = area.categorias.map(categoria => ({
          id: categoria.ID_Categorias.toString(),
          titulo: categoria.Nombre,
          documentos: categoria.archivos.map(archivo => ({
            id: archivo.ID.toString(),
            titulo: archivo.Nombre,
            ruta: getAssetUrl(archivo.Ruta_Documento),
          })),
        }));
        setSecciones(seccionesMapped);
      }
      setLoading(false);
    };
    loadDocuments();
  }, []);
  
  return (
    <TablaDocumentosReutilizable
      secciones={secciones}
      titulo="Programa Institucional de Tutorías (PIT)"
      descripcion="..."
    />
  );
};
```

## 📡 API Endpoints

### Obtener Área PIT con Categorías y Archivos
```
GET /api/documentos/areas/7
```

**Respuesta:**
```json
{
  "ID_Area": 7,
  "Nombre": "PIT",
  "categorias": [
    {
      "ID_Categorias": 1,
      "Nombre": "2024",
      "ID_Area": 7,
      "archivos": [
        {
          "ID": 1,
          "Nombre": "Formato_Seguimiento.pdf",
          "Ruta_Documento": "uploads/documentos/...",
          "Fecha_Subida": "2025-12-10"
        }
      ]
    }
  ]
}
```

### Crear Categoría
```
POST /api/documentos/categorias
Body: { "Nombre": "2025", "ID_Area": 7 }
```

### Subir Archivo
```
POST /api/documentos/archivos/upload
FormData: 
  - archivo: [File]
  - ID_Categorias: 1
  - Descripcion: "Documento X"
```

## 🎨 Características del Sistema

### Dashboard
✅ Interfaz CRUD completa
✅ Drag & drop para archivos
✅ Selección múltiple
✅ Progreso de subida
✅ Validación de archivos
✅ Gestión de categorías
✅ Eliminación con confirmación

### Sitio Público
✅ Carga dinámica de datos
✅ Organización por categorías
✅ Visualización de PDFs
✅ Descarga de documentos
✅ Diseño responsivo
✅ Loading states

## 🔧 Scripts Útiles

### Verificar Área PIT
```bash
cd BKUTTECAM
npx ts-node scripts/ensure-pit-area.ts
```

### Listar Todas las Áreas
```bash
# En MySQL o phpMyAdmin
SELECT * FROM area ORDER BY ID_Area;
```

### Ver Documentos de PIT
```bash
# En MySQL o phpMyAdmin
SELECT 
  a.Nombre as Area,
  c.Nombre as Categoria,
  ar.Nombre as Archivo
FROM area a
LEFT JOIN categorias c ON c.ID_Area = a.ID_Area
LEFT JOIN archivos ar ON ar.ID_Categorias = c.ID_Categorias
WHERE a.ID_Area = 7
ORDER BY c.Nombre, ar.Nombre;
```

## 📝 Migración de Datos Estáticos

Si tenías datos estáticos en `pit.data.ts`, necesitas:

1. **Acceder al Dashboard**
2. **Ir a Accesos > PIT**
3. **Crear categorías** según tu estructura anterior
4. **Subir los archivos PDF** que tenías en `/public/PIT/`
5. **Eliminar** `pit.data.ts` (ya no se usa)

## 🚀 Ventajas del Sistema Dinámico

1. **Sin Código**: Administradores no técnicos pueden gestionar contenido
2. **Tiempo Real**: Cambios inmediatos sin redespliegue
3. **Escalable**: Agregar documentos ilimitados
4. **Organizado**: Sistema de categorías flexible
5. **Auditable**: Registro de fechas de subida
6. **Seguro**: Solo usuarios autenticados pueden modificar
7. **Consistente**: Mismo sistema que Servicios y Gestión

## 📚 Documentación Relacionada

- **Servicios y Gestión**: Similar implementación
- **Sistema de Documentos**: `docs/DOCUMENTOS_API.md`
- **Autenticación**: `docs/AUTH_DOCUMENTATION.md`

## 🆘 Soporte

Si tienes problemas:

1. Verifica que el área PIT existe: `npx ts-node scripts/ensure-pit-area.ts`
2. Revisa la consola del navegador para errores de API
3. Verifica que el backend está corriendo en puerto 3002
4. Confirma la autenticación JWT en el Dashboard

---

**Última actualización**: Diciembre 10, 2025
**Sistema**: Totalmente operacional ✅
