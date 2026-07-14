# Rutas Públicas y Protegidas - UTTECAM API

Este documento especifica claramente qué endpoints de la API son públicos (no requieren autenticación) y cuáles están protegidos (requieren autenticación JWT).

---

## Rutas Públicas (no requieren autenticación)

### Textos
- `GET /api/textos` — Listar textos
- `GET /api/textos/stats` — Estadísticas de textos
- `GET /api/textos/:id` — Obtener texto por ID

### Directorios
- `GET /api/directorios` — Listar directorios
- `GET /api/directorios/:id` — Obtener directorio por ID

### Nosotros
- `GET /api/nosotros/contenido` — Listar todo el contenido institucional
- `GET /api/nosotros/contenido/:id` — Obtener contenido por ID
- `GET /api/nosotros/contenido/tipo/:tipo` — Obtener contenido por tipo

---

## Rutas Protegidas (requieren autenticación JWT)

### Textos
- `POST /api/textos` — Crear texto
- `PUT /api/textos/:id` — Actualizar texto
- `DELETE /api/textos/:id` — Eliminar texto

### Directorios
- `POST /api/directorios` — Crear directorio (con imagen)
- `PUT /api/directorios/:id` — Actualizar directorio (con imagen)
- `DELETE /api/directorios/:id` — Eliminar directorio

### Nosotros
- `POST /api/nosotros/contenido` — Crear contenido (con imagen)
- `PUT /api/nosotros/contenido/:id` — Actualizar contenido (con imagen)
- `DELETE /api/nosotros/contenido/:id` — Eliminar contenido

---

**Notas:**
- Todas las rutas protegidas requieren el header `Authorization: Bearer <token>` con un JWT válido.
- Las rutas públicas pueden ser accedidas por cualquier usuario sin autenticación.

**Última actualización:** Octubre 2025
