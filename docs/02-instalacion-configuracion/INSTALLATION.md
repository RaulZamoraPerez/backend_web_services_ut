# Guía de Instalación - UTTECAM API

## Requisitos del Sistema

### Mínimos
- **Node.js**: 16.x o superior
- **NPM**: 8.x o superior  
- **MySQL**: 5.7 o superior (o MariaDB 10.2+)
- **RAM**: 512MB mínimo
- **Espacio en disco**: 100MB

### Recomendados
- **Node.js**: 18.x LTS
- **NPM**: 9.x
- **MySQL**: 8.0+
- **RAM**: 1GB o más
- **Espacio en disco**: 500MB

## Instalación Paso a Paso

### 1. Preparación del Entorno

#### Windows
```powershell
# Verificar Node.js instalado
node --version
npm --version

# Si no está instalado, descargar desde nodejs.org
# Instalar MySQL desde mysql.com o usar XAMPP
```

#### Linux (Ubuntu/Debian)
```bash
# Actualizar sistema
sudo apt update

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar MySQL
sudo apt install mysql-server
sudo mysql_secure_installation
```

#### macOS
```bash
# Usar Homebrew
brew install node mysql

# O descargar instaladores desde las páginas oficiales
```

### 2. Configuración de Base de Datos

#### Crear Usuario y Base de Datos
```sql
-- Conectar como root
mysql -u root -p

-- Crear base de datos
CREATE DATABASE uttecam CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Crear usuario específico (recomendado)
CREATE USER 'uttecam_user'@'localhost' IDENTIFIED BY 'password_seguro_123';

-- Otorgar permisos
GRANT ALL PRIVILEGES ON uttecam.* TO 'uttecam_user'@'localhost';
FLUSH PRIVILEGES;

-- Salir
EXIT;
```

#### Ejecutar Script de Configuración
```bash
# Opción 1: Desde línea de comandos
mysql -u uttecam_user -p uttecam < database_setup.sql

# Opción 2: Desde MySQL Workbench o phpMyAdmin
# - Abrir database_setup.sql
# - Ejecutar el script
```

### 3. Instalación de la Aplicación

#### Descargar Proyecto
```bash
# Opción 1: Git clone
git clone <repositorio>
cd BKUTTECAM

# Opción 2: Descargar ZIP y extraer
# Descomprimir en carpeta deseada
```

#### Instalar Dependencias
```bash
# Instalar todas las dependencias
npm install

# Verificar instalación
npm list --depth=0
```

### 4. Configuración de Variables de Entorno

#### Crear archivo .env
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar con editor de texto
nano .env  # Linux/Mac
notepad .env  # Windows
```

#### Configurar variables
```env
# Base de datos
DB_HOST=localhost
DB_USER=uttecam_user
DB_PASSWORD=password_seguro_123
DB_NAME=uttecam
DB_PORT=3306

# Servidor
PORT=3000
NODE_ENV=development
```

### 5. Compilación y Ejecución

#### Compilar TypeScript
```bash
# Compilar una vez
npm run build

# Verificar carpeta dist/ creada
ls dist/  # Linux/Mac
dir dist\  # Windows
```

#### Ejecutar aplicación
```bash
# Modo desarrollo (con hot reload)
npm run dev

# Modo producción
npm start
```

#### Verificar funcionamiento
```bash
# Desde otra terminal/navegador
curl http://localhost:3000/health

# O abrir en navegador: http://localhost:3000
```

## Configuraciones Avanzadas

### SSL/HTTPS (Producción)

#### Generar certificados
```bash
# Certificado autofirmado (desarrollo)
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
```

#### Configurar HTTPS en código
```typescript
// En server.ts
import https from 'https';
import fs from 'fs';

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

https.createServer(options, app).listen(443, () => {
  console.log('HTTPS Server running on port 443');
});
```

### Variables de Entorno Adicionales

```env
# Configuración de conexión DB
DB_CONNECTION_LIMIT=10
DB_TIMEOUT=60000
DB_RETRY_ATTEMPTS=3

# Configuración del servidor
MAX_REQUEST_SIZE=1mb
CORS_ORIGIN=http://localhost:3001,https://tu-frontend.com

# Logs
LOG_LEVEL=info
LOG_FILE=./logs/app.log

# Seguridad
API_KEY=tu_api_key_secreta
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000
```

### Configuración con Docker

#### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist/ ./dist/
COPY app.js ./

EXPOSE 3000

CMD ["node", "app.js"]
```

#### docker-compose.yml
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=mysql
      - DB_USER=uttecam_user
      - DB_PASSWORD=password123
      - DB_NAME=uttecam
    depends_on:
      - mysql
    
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: uttecam
      MYSQL_USER: uttecam_user
      MYSQL_PASSWORD: password123
    volumes:
      - mysql_data:/var/lib/mysql
      - ./database_setup.sql:/docker-entrypoint-initdb.d/init.sql
    
volumes:
  mysql_data:
```

#### Ejecutar con Docker
```bash
# Construir y ejecutar
docker-compose up --build

# En background
docker-compose up -d
```

## Instalación en Diferentes Entornos

### Desarrollo Local
```bash
# Instalación completa con dev dependencies
npm install
npm run dev
```

### Servidor de Pruebas
```bash
# Solo dependencias de producción
npm ci --only=production
npm run build
NODE_ENV=testing npm start
```

### Producción
```bash
# Optimizada para producción
npm ci --only=production --no-audit --no-fund
npm run build
NODE_ENV=production npm start
```

### cPanel (Hosting Compartido)

#### Preparación
```bash
# Local - preparar archivos
npm run build
zip -r uttecam-api.zip dist/ package.json app.js database_setup.sql .env.example
```

#### En cPanel
1. **File Manager** → Subir ZIP → Extraer
2. **Node.js Apps** → Create Application
3. **Configurar**:
   - Node.js version: 18.x
   - Application mode: Production  
   - Application root: /public_html/api
   - Application startup file: app.js
4. **Environment Variables** → Añadir variables DB
5. **Run NPM Install**
6. **Restart Application**

## Resolución de Problemas de Instalación

### Error: No se puede conectar a MySQL
```bash
# Verificar servicio MySQL
sudo systemctl status mysql  # Linux
net start mysql  # Windows

# Verificar puerto
netstat -an | grep 3306

# Resetear password root (si es necesario)
sudo mysql_secure_installation
```

### Error: Puerto 3000 ocupado
```bash
# Encontrar proceso usando puerto
lsof -ti:3000 | xargs kill -9  # Linux/Mac
netstat -ano | findstr :3000  # Windows

# O cambiar puerto en .env
PORT=3001
```

### Error: Módulos no encontrados
```bash
# Limpiar caché npm
npm cache clean --force

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error: Permisos TypeScript
```bash
# Instalar TypeScript globalmente
npm install -g typescript

# O usar npx
npx tsc --version
```

### Error: Variables de entorno no se cargan
```bash
# Verificar archivo .env existe y tiene formato correcto
cat .env

# Instalar dotenv si falta
npm install dotenv
```

## Verificación Post-Instalación

### Lista de Verificación
- [ ] Node.js y npm funcionando
- [ ] MySQL/MariaDB iniciado
- [ ] Base de datos y usuario creados
- [ ] Dependencias npm instaladas
- [ ] Archivo .env configurado
- [ ] Código TypeScript compilado (carpeta dist/)
- [ ] Aplicación inicia sin errores
- [ ] Endpoint /health responde correctamente
- [ ] API endpoints funcionan

### Scripts de Verificación
```bash
# Crear script verify.sh (Linux/Mac) o verify.bat (Windows)
#!/bin/bash

echo "🔍 Verificando instalación..."

# Verificar Node.js
if command -v node &> /dev/null; then
    echo "✅ Node.js: $(node --version)"
else
    echo "❌ Node.js no instalado"
fi

# Verificar npm
if command -v npm &> /dev/null; then
    echo "✅ NPM: $(npm --version)"
else
    echo "❌ NPM no instalado"
fi

# Verificar MySQL
if command -v mysql &> /dev/null; then
    echo "✅ MySQL disponible"
else
    echo "❌ MySQL no encontrado"
fi

# Verificar archivos del proyecto
if [ -f "package.json" ]; then
    echo "✅ package.json existe"
else
    echo "❌ package.json no encontrado"
fi

if [ -f ".env" ]; then
    echo "✅ .env configurado"
else
    echo "⚠️  .env no encontrado (copiar de .env.example)"
fi

if [ -d "dist" ]; then
    echo "✅ Código compilado en dist/"
else
    echo "⚠️  Ejecutar 'npm run build'"
fi

echo "🔍 Verificación completa"
```

Para soporte adicional, consultar:
- [README.md](./README.md) - Documentación completa
- [API_REFERENCE.md](./API_REFERENCE.md) - Referencia de API
- Logs de la aplicación
- Documentación de Node.js y MySQL