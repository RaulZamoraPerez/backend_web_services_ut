# 💻 03. Desarrollo

## Documentos en esta sección

Guías y recursos para desarrolladores trabajando en el proyecto.

### 📄 Documentos Disponibles

1. **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Guía de Desarrollo
   - Inicio rápido para desarrolladores
   - Estructura del proyecto
   - Scripts NPM disponibles
   - Comandos útiles de Sequelize
   - Debugging y logs
   - Flujo de trabajo
   - Ideal para: Desarrollo activo, contribuidores

2. **[IMPLEMENTATION.md](./IMPLEMENTATION.md)** - Detalles de Implementación
   - Patrones de diseño utilizados
   - Decisiones técnicas
   - Flujos de implementación
   - Ideal para: Entender el código, añadir funcionalidades

---

## 🛠️ Scripts Útiles

```bash
# Desarrollo con hot-reload
npm run dev

# Compilar TypeScript
npm run build

# Producción
npm start

# Crear usuario admin
npm run create-admin

# Limpiar y recompilar
npm run clean && npm run build
```

---

## 📁 Estructura del Proyecto

```
src/
├── app.ts              # Aplicación Express
├── server.ts           # Servidor HTTP
├── config/             # Configuraciones
│   ├── database.ts
│   └── syncDatabase.ts
├── controllers/        # Lógica de negocio
├── middleware/         # Middleware personalizado
├── models/             # Modelos Sequelize
└── routes/             # Definición de rutas
```

---

## 📋 Documentos Relacionados

- **[ARCHITECTURE.md](../08-arquitectura/ARCHITECTURE.md)** - Arquitectura del sistema
- **[API_REFERENCE.md](../04-api-referencia/API_REFERENCE.md)** - Referencia de API
- **[SECURITY.md](../06-seguridad-administracion/SECURITY.md)** - Implementar seguridad

---

[← Volver al índice principal](../README.md)
