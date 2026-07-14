# Guía de Desarrollo - UTTECAM API con Sequelize

## 🚀 Inicio rápido

1. **Clonar el repositorio:**
```bash
git clone https://github.com/Lisa2900/BKUTTECAM.git
cd BKUTTECAM
git checkout version-estable
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar variables de entorno:**
```bash
cp .env.example .env
# Editar .env con tus credenciales de MySQL
```

4. **Configurar base de datos:**
```sql
-- Conectar a MySQL y ejecutar:
CREATE DATABASE uttecam CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

5. **Ejecutar en desarrollo:**
```bash
npm run dev
```

## 🗂️ Estructura limpia del proyecto

```
src/
├── config/
│   ├── database.ts       # Configuración Sequelize
│   └── syncDatabase.ts   # Sincronización y seeds
├── models/
│   └── Texto.ts         # Modelo Sequelize
├── controllers/
│   └── textoController.ts
├── routes/
│   └── textos.ts
├── middleware/
│   └── errorHandler.ts
├── app.ts              # Configuración Express
└── server.ts          # Punto de entrada
```

## 🔧 Scripts disponibles

```bash
npm run dev        # Desarrollo con auto-recarga y Sequelize
npm run build      # Limpiar y compilar TypeScript
npm run start      # Ejecutar en producción
npm run clean      # Limpiar archivos compilados
npm run db:reset   # Resetear BD + insertar datos de prueba
npm run db:seed    # Solo insertar datos de ejemplo
```

## 🗃️ Comandos útiles de Sequelize

### Resetear la base de datos completamente:
```bash
npm run db:reset
```

### Solo añadir datos de prueba:
```bash
npm run db:seed
```

### Verificar conexión:
El servidor iniciará aunque MySQL no esté disponible, mostrando advertencias.

## 🐛 Debugging y desarrollo

### Ver logs de Sequelize:
Los logs SQL aparecerán en desarrollo automáticamente.

### Estructura de respuestas de la API:
```javascript
// Éxito
{
  "textos": [...],
  "pagination": {...}
}

// Error
{
  "error": "Tipo de error",
  "message": "Descripción detallada"
}
```

## 📁 Archivos de backup

Los archivos de la implementación anterior están en `/backup/` para referencia:
- `db.backup.ts` - Configuración MySQL directa
- `textoModel.backup.ts` - Modelo con consultas SQL manuales
- `README_old.md` - Documentación anterior

## 🔄 Migraciones futuras

Para futuras funcionalidades, considera:
- Autenticación JWT
- Roles y permisos
- Categorías de textos
- Historial de cambios
- Tests automatizados