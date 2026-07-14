# 🔌 04. API Referencia

## Documentos en esta sección

Documentación completa de todos los endpoints y módulos de la API.

### 📄 Documentos Disponibles

1. **[API_REFERENCE.md](./API_REFERENCE.md)** ⭐ - Referencia Completa de la API
   - Todos los endpoints documentados
   - Parámetros de request y response
   - Códigos de estado HTTP
   - Ejemplos en JavaScript, Python, PHP, cURL
   - Validaciones y reglas de negocio
   - **Ideal para:** Integración con la API, desarrollo frontend

2. **[DIRECTORIOS_API.md](./DIRECTORIOS_API.md)** - Módulo de Directorios
   - CRUD completo de directorios
   - Manejo de imágenes
   - Validaciones específicas

3. **[FORMULARIOS_API.md](./FORMULARIOS_API.md)** - Módulo de Formularios
   - Gestión de formularios dinámicos
   - Campos y validaciones

4. **[SOLICITUDES_CONSTANCIA_KARDEX.md](./SOLICITUDES_CONSTANCIA_KARDEX.md)** 🆕 - Sistema de Solicitudes
   - Sistema completo de solicitudes académicas
   - Endpoints públicos y protegidos
   - Seguimiento por número de referencia
   - Workflow completo

5. **[IMAGENES_UPLOAD.md](./IMAGENES_UPLOAD.md)** - Sistema de Upload de Imágenes
   - Configuración de Multer
   - Formatos soportados
   - Validaciones de tamaño
   - URLs de acceso
   - Ejemplos de uso

---

## 🚀 Módulos Principales

### 🔐 Autenticación
- Login y registro
- JWT tokens
- Gestión de usuarios
- Perfiles de usuario

### 📝 Textos
- CRUD completo
- Paginación
- Búsqueda
- Estadísticas

### 👥 Directorios
- CRUD con imágenes
- Filtrado y búsqueda
- Validaciones de campos

### ℹ️ Nosotros (Contenido Institucional)
- Misión, visión, valores
- Upload de imágenes
- Filtrado por tipo

### 📋 Formularios
- Formularios dinámicos
- Validación personalizada

### 📄 Solicitudes
- Constancias y kardex
- Seguimiento en tiempo real
- Sistema de referencia único

---

## 📖 Ejemplo Rápido

### Obtener todos los textos (público)
```bash
curl http://localhost:3000/api/textos
```

### Login (obtener token)
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@uttecam.edu.mx","password":"Admin2024!"}'
```

### Crear texto (requiere autenticación)
```bash
curl -X POST http://localhost:3000/api/textos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_JWT" \
  -d '{"titulo":"Mi título","contenido":"Mi contenido"}'
```

---

## 📋 Documentos Relacionados

- **[RUTAS_PUBLICAS_PROTEGIDAS.md](../06-seguridad-administracion/RUTAS_PUBLICAS_PROTEGIDAS.md)** - Control de acceso
- **[ADMIN_USER.md](../06-seguridad-administracion/ADMIN_USER.md)** - Autenticación con admin
- **[SECURITY.md](../06-seguridad-administracion/SECURITY.md)** - Seguridad de la API

---

[← Volver al índice principal](../README.md)
