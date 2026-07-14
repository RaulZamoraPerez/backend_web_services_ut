# 🚀 Guía de Deploy en cPanel - UTTECAM API con Sequelize

Esta guía te llevará paso a paso para desplegar tu API UTTECAM con Sequelize ORM en un hosting con cPanel.

## 📋 Índice

1. [🎯 Preparación del Proyecto](#-preparación-del-proyecto)
2. [🔧 Configuración en cPanel](#-configuración-en-cpanel)
3. [📁 Subida de Archivos](#-subida-de-archivos)
4. [🗄️ Configuración de Base de Datos](#️-configuración-de-base-de-datos)
5. [⚙️ Variables de Entorno](#️-variables-de-entorno)
6. [🚦 Activación de la Aplicación](#-activación-de-la-aplicación)
7. [✅ Verificación y Testing](#-verificación-y-testing)
8. [🐛 Solución de Problemas](#-solución-de-problemas)
9. [📊 Monitoreo y Mantenimiento](#-monitoreo-y-mantenimiento)

## 🎯 Preparación del Proyecto

### Requisitos del Hosting
- ✅ **cPanel** con soporte para Node.js 16+
- ✅ **MySQL 8.0+** o MariaDB 10.3+
- ✅ **Acceso a File Manager** y **Node.js Selector**
- ✅ **SSL Certificate** (recomendado)
- ✅ **Subdomain o domain** configurado

### 1. Preparar Archivos Localmente

**Paso 1: Compilar la aplicación**
```bash
cd BKUTTECAM
npm run build
```

**Paso 2: Crear package.json para producción**
```bash
# Crear package.json solo con dependencias de producción
npm run build
```

**Paso 3: Verificar archivos necesarios**
✅ Archivos REQUERIDOS:
- `package.json` - Dependencias y scripts
- `dist/` - Código JavaScript compilado
- `.env.example` - Template de variables
- `database_setup.sql` - Script inicial de BD

❌ Archivos a NO incluir:
- `node_modules/` - Se instalarán en el servidor
- `src/` - Código TypeScript fuente
- `tsconfig.json` - Solo para desarrollo
- `.env` - Contiene credenciales sensibles
- `backup/` - Archivos de respaldo

## 🔧 Configuración en cPanel

### 1. Acceder a Node.js Selector

1. **Inicia sesión en cPanel**
2. Busca **"Node.js Selector"** o **"Setup Node.js App"**
3. Haz clic para crear una nueva aplicación

### 2. Configurar Aplicación Node.js

**Configuración inicial:**
```
Application Name: uttecam-api
Node.js Version: 16.x o superior
Application Mode: Production
Application Root: uttecam-api (o tu carpeta preferida)
Application URL: api.tudominio.com (o subdominio)
Startup File: dist/server.js
```

**Ejemplo de configuración:**
```
📱 Nombre: UTTECAM API
🔧 Versión Node.js: 18.17.0
🎯 Modo: Production  
📁 Directorio: public_html/api
🌐 URL: https://tudominio.com/api
🚀 Archivo inicio: dist/server.js
```

### 3. Variables de Entorno Iniciales

En cPanel, en la sección **"Environment variables"**, añade:

```
NODE_ENV=production
PORT=3000
```

## 📁 Subida de Archivos

### Opción 1: File Manager (Recomendado)

**Paso 1: Comprimir archivos**
```bash
# En tu PC, crear ZIP con archivos necesarios
zip -r uttecam-api.zip dist/ package.json .env.example database_setup.sql docs/
```

**Paso 2: Subir en cPanel**
1. Abre **File Manager** en cPanel
2. Navega a la carpeta de tu aplicación (ej: `public_html/api/`)
3. Sube el archivo `uttecam-api.zip`
4. Haz clic derecho → **"Extract"**
5. Elimina el archivo ZIP después de extraer

**Paso 3: Verificar estructura**
```
public_html/api/
├── dist/
│   ├── server.js
│   ├── app.js
│   ├── config/
│   ├── controllers/
│   ├── models/
│   └── routes/
├── package.json
├── .env.example
├── database_setup.sql
└── docs/
```

### Opción 2: Git Deploy (Avanzado)

Si tu hosting soporta Git:

```bash
# En cPanel Terminal o SSH
cd public_html/api
git clone https://github.com/Lisa2900/BKUTTECAM.git .
git checkout version-estable
npm run build
```

## 🗄️ Configuración de Base de Datos

### 1. Crear Base de Datos MySQL

**En cPanel → MySQL Databases:**

1. **Crear nueva base de datos:**
   - Nombre: `tuusuario_uttecam`
   - Charset: `utf8mb4`
   - Collation: `utf8mb4_unicode_ci`

2. **Crear usuario de BD:**
   - Usuario: `tuusuario_api`
   - Contraseña: `TuPassword123!`
   - Privilegios: **ALL PRIVILEGES**

3. **Anotar credenciales:**
```
Host: localhost
Database: tuusuario_uttecam  
User: tuusuario_api
Password: TuPassword123!
Port: 3306
```

### 2. Ejecutar Script de Configuración

**Opción A: phpMyAdmin**
1. Abre **phpMyAdmin** en cPanel
2. Selecciona tu base de datos
3. Ve a la pestaña **"SQL"**
4. Ejecuta el contenido de `database_setup.sql`

**Opción B: Terminal (si disponible)**
```bash
mysql -u tuusuario_api -p tuusuario_uttecam < database_setup.sql
```

### 3. Verificar Tablas Creadas

Deberías ver la tabla:
```sql
-- Tabla creada por Sequelize
CREATE TABLE textos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contenido TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_created_at (created_at)
);
```

## ⚙️ Variables de Entorno

### Configurar .env en Producción

**En cPanel File Manager**, crear archivo `.env`:

```bash
# Variables de Base de Datos
DB_HOST=localhost
DB_PORT=3306
DB_NAME=tuusuario_uttecam
DB_USER=tuusuario_api
DB_PASSWORD=TuPassword123!

# Variables del Servidor
NODE_ENV=production
PORT=3000

# Variables de Sequelize
SEQUELIZE_LOGGING=false
```

### Variables en cPanel Node.js Selector

También añade en **Environment variables** de cPanel:

```
DB_HOST=localhost
DB_NAME=tuusuario_uttecam
DB_USER=tuusuario_api
DB_PASSWORD=TuPassword123!
NODE_ENV=production
PORT=3000
```

## 🚦 Activación de la Aplicación

### 1. Instalar Dependencias

**En cPanel Node.js Selector:**
1. Ve a tu aplicación creada
2. Haz clic en **"NPM Install"**
3. Espera a que termine la instalación

**O en Terminal (si disponible):**
```bash
cd public_html/api
npm install --production
```

### 2. Configurar package.json para Producción

Asegúrate de que `package.json` tenga:

```json
{
  "name": "uttecam-api",
  "version": "2.0.0",
  "main": "dist/server.js",
  "scripts": {
    "start": "node dist/server.js",
    "postinstall": "echo 'Dependencies installed successfully'"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.18.2",
    "mysql2": "^3.15.1",
    "sequelize": "^6.37.7"
  }
}
```

### 3. Iniciar la Aplicación

**En cPanel Node.js Selector:**
1. Haz clic en **"Restart"**
2. Verifica que el estado sea **"Running"**
3. Anota la URL asignada

### 4. Configurar URL Personalizada (Opcional)

**Para subdomain (ej: api.tudominio.com):**
1. En cPanel → **Subdomains**
2. Crear subdomain: `api`
3. Document Root: `public_html/api`
4. En Node.js Selector, cambiar **Application URL**

## ✅ Verificación y Testing

### 1. Verificar Estado de la App

**Revisar logs en cPanel:**
```bash
# En Terminal o File Manager
cat logs/uttecam-api.log
```

**Verificar que Sequelize inicie:**
```
✅ Conexión a base de datos establecida correctamente
✅ Modelos sincronizados con la base de datos
🚀 Servidor corriendo en puerto 3000
```

### 2. Probar Endpoints

**Probar endpoint básico:**
```bash
curl https://tudominio.com/api/textos/stats
```

**Respuesta esperada:**
```json
{
  "totalTextos": 0,
  "textosHoy": 0,
  "ultimoTexto": null
}
```

### 3. Poblar con Datos de Prueba

**Si tienes Terminal SSH:**
```bash
cd public_html/api
node -e "require('./dist/config/syncDatabase').seedDatabase()"
```

**O insertar manualmente en phpMyAdmin:**
```sql
INSERT INTO textos (contenido) VALUES 
('Bienvenido a la Universidad Tecnológica de Tecamachalco'),
('La UTTECAM se compromete con la excelencia académica'),
('Ofrecemos carreras técnicas y de ingeniería de vanguardia');
```

### 4. Probar API Completa

**Listar textos:**
```bash
curl https://tudominio.com/api/textos
```

**Crear texto:**
```bash
curl -X POST https://tudominio.com/api/textos \
  -H "Content-Type: application/json" \
  -d '{"contenido":"Nuevo texto desde producción"}'
```

## 🐛 Solución de Problemas

### Error: "Cannot connect to database"

**Causa:** Credenciales incorrectas
**Solución:**
1. Verificar variables en `.env`
2. Confirmar usuario tiene permisos
3. Verificar que la BD existe

```bash
# Probar conexión manualmente
mysql -u tuusuario_api -p -h localhost tuusuario_uttecam
```

### Error: "Module not found"

**Causa:** Dependencias no instaladas
**Solución:**
```bash
cd public_html/api
npm install --production
```

### Error: "Port already in use"

**Causa:** Puerto ocupado
**Solución:** En cPanel Node.js, cambiar puerto o reiniciar app

### Error: "Sequelize sync failed"

**Causa:** Permisos de BD insuficientes
**Solución:**
1. Verificar que el usuario tenga `CREATE`, `ALTER`, `INSERT` permisos
2. Usar phpMyAdmin para dar permisos completos

### Logs no aparecen

**Ver logs en cPanel:**
```bash
# Ubicaciones comunes de logs
tail -f ~/logs/uttecam-api.log
tail -f ~/public_html/api/app.log
```

## 📊 Monitoreo y Mantenimiento

### 1. Configurar Logs Personalizados

Crear `logger.js` en producción:
```javascript
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../logs/app.log');

function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp}: ${message}\n`;
  fs.appendFileSync(logFile, logMessage);
  console.log(logMessage.trim());
}

module.exports = { log };
```

### 2. Monitoreo de Base de Datos

**Script de verificación de BD:**
```sql
-- Verificar estado de la BD
SELECT 
  COUNT(*) as total_textos,
  MAX(created_at) as ultimo_registro,
  MIN(created_at) as primer_registro
FROM textos;

-- Verificar conexiones activas
SHOW PROCESSLIST;
```

### 3. Backup Automático

**Script de backup (si tienes acceso SSH):**
```bash
#!/bin/bash
# backup-db.sh
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u tuusuario_api -p tuusuario_uttecam > backup_$DATE.sql
```

### 4. Actualización de la Aplicación

**Para actualizar con nuevos cambios:**
```bash
# 1. Hacer backup de BD
# 2. Subir nuevos archivos
# 3. Reinstalar dependencias si es necesario
cd public_html/api
npm install --production
# 4. Reiniciar en cPanel Node.js Selector
```

---

## 🎉 ¡Deploy Completado!

Tu API UTTECAM con Sequelize ahora está ejecutándose en producción.

### 📋 Checklist Final

- ✅ Aplicación Node.js configurada en cPanel
- ✅ Base de datos MySQL creada y configurada  
- ✅ Variables de entorno configuradas
- ✅ Dependencias instaladas
- ✅ Endpoints funcionando correctamente
- ✅ Sequelize sincronizando con BD
- ✅ Logs configurados para monitoreo

### 🔗 URLs de tu API

- **API Base:** `https://tudominio.com/api`
- **Estadísticas:** `https://tudominio.com/api/textos/stats`
- **Textos:** `https://tudominio.com/api/textos`

### 📞 Soporte

Si encuentras problemas:
1. Revisa los logs en cPanel
2. Verifica las variables de entorno
3. Confirma que la BD esté accesible
4. Contacta al soporte de tu hosting si es necesario

**¡Tu API está lista para recibir peticiones en producción!** 🚀