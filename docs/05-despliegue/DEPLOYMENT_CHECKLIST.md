# 🚀 UTTECAM API - Guía de Deployment a Producción

## 📋 Checklist Pre-Deployment

### 1. Preparación del Servidor

#### 1.1 Requisitos del Sistema
- [ ] Ubuntu/Debian 20.04+ o CentOS/RHEL 8+
- [ ] Mínimo 2GB RAM (4GB recomendado)
- [ ] Mínimo 20GB espacio en disco
- [ ] CPU: 2 cores mínimo
- [ ] Acceso SSH con permisos sudo

#### 1.2 Software Base
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependencias esenciales
sudo apt install -y curl git build-essential nginx mysql-server
```

- [ ] Node.js 18+ instalado
- [ ] npm 9+ instalado
- [ ] MySQL/MariaDB 8.0+ instalado
- [ ] Nginx instalado
- [ ] PM2 instalado globalmente: `npm install -g pm2`
- [ ] Git instalado

### 2. Configuración de Base de Datos

#### 2.1 Crear Base de Datos
```sql
-- Conectar a MySQL
mysql -u root -p

-- Crear base de datos
CREATE DATABASE uttecam CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Crear usuario con permisos mínimos
CREATE USER 'uttecam_user'@'localhost' IDENTIFIED BY 'PASSWORD_SEGURA_AQUI';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX ON uttecam.* TO 'uttecam_user'@'localhost';
FLUSH PRIVILEGES;
```

- [ ] Base de datos `uttecam` creada
- [ ] Usuario de base de datos creado con permisos apropiados
- [ ] Contraseña segura generada (min 16 caracteres)
- [ ] Conexión de prueba exitosa

#### 2.2 Optimización MySQL
```bash
# Editar configuración MySQL
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf

# Agregar/modificar:
max_connections = 200
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M
```

- [ ] Configuración MySQL optimizada
- [ ] MySQL reiniciado: `sudo systemctl restart mysql`

### 3. Configuración de la Aplicación

#### 3.1 Clonar Repositorio
```bash
cd /var/www
sudo git clone https://github.com/Lisa2900/BKUTTECAM.git uttecam-api
cd uttecam-api
sudo chown -R $USER:$USER .
```

- [ ] Repositorio clonado en `/var/www/uttecam-api`
- [ ] Branch `version-estable` checkeado
- [ ] Permisos correctos asignados

#### 3.2 Variables de Entorno
```bash
# Copiar template
cp .env.example .env

# Editar con valores de producción
nano .env
```

**Variables críticas a configurar:**
- [ ] `NODE_ENV=production`
- [ ] `PORT=3002`
- [ ] `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` configurados
- [ ] `JWT_SECRET` generado: `openssl rand -base64 64`
- [ ] `SESSION_SECRET` generado: `openssl rand -hex 32`
- [ ] `CORS_ORIGIN` con dominio(s) de producción
- [ ] `API_BASE_URL` con URL real
- [ ] `EMAIL_USER`, `EMAIL_PASSWORD` configurados
- [ ] `COOKIE_SECURE=true`
- [ ] `TRUST_PROXY=true`
- [ ] `LOG_LEVEL=warn`

#### 3.3 Instalar Dependencias
```bash
npm ci --only=production
```

- [ ] Dependencias instaladas
- [ ] No hay vulnerabilidades críticas: `npm audit`

#### 3.4 Build de Producción
```bash
npm run build
```

- [ ] Build exitoso
- [ ] Directorio `dist/` creado
- [ ] `dist/server.js` existe

#### 3.5 Crear Directorios Necesarios
```bash
mkdir -p uploads logs public backups
chmod 755 uploads logs backups
```

- [ ] Directorios creados
- [ ] Permisos correctos asignados

### 4. Sincronización de Base de Datos

#### 4.1 Ejecutar Sincronización
```bash
# Sincronizar esquema (primera vez)
npm run db:sync

# Verificar tablas
mysql -u uttecam_user -p uttecam -e "SHOW TABLES;"
```

- [ ] Tablas creadas correctamente
- [ ] Migraciones ejecutadas sin errores

#### 4.2 Crear Usuario Administrador
```bash
npm run create:admin

# Seguir prompts:
# Email: admin@uttecam.edu.mx
# Password: [CONTRASEÑA SEGURA]
# Role: admin
```

- [ ] Usuario admin creado
- [ ] Credenciales guardadas en lugar seguro (gestor de contraseñas)

### 5. Configuración de Nginx

#### 5.1 Crear Configuración
```bash
sudo nano /etc/nginx/sites-available/uttecam-api
```

```nginx
# Configuración básica
upstream uttecam_api {
    server 127.0.0.1:3002;
    keepalive 64;
}

server {
    listen 80;
    server_name api.uttecam.edu.mx;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.uttecam.edu.mx;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/api.uttecam.edu.mx/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.uttecam.edu.mx/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Logs
    access_log /var/log/nginx/uttecam-api-access.log;
    error_log /var/log/nginx/uttecam-api-error.log;

    # Client settings
    client_max_body_size 200M;
    client_body_timeout 300s;

    # Proxy settings
    location / {
        proxy_pass http://uttecam_api;
        proxy_http_version 1.1;
        
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_cache_bypass $http_upgrade;
        proxy_buffering off;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Static files (uploads)
    location /uploads {
        alias /var/www/uttecam-api/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Health check
    location /health {
        proxy_pass http://uttecam_api/health;
        access_log off;
    }
}
```

- [ ] Archivo de configuración creado
- [ ] Symlink creado: `sudo ln -s /etc/nginx/sites-available/uttecam-api /etc/nginx/sites-enabled/`
- [ ] Configuración validada: `sudo nginx -t`
- [ ] Nginx recargado: `sudo systemctl reload nginx`

#### 5.2 Configurar SSL con Let's Encrypt
```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d api.uttecam.edu.mx

# Verificar auto-renovación
sudo certbot renew --dry-run
```

- [ ] Certificado SSL instalado
- [ ] HTTPS funcionando
- [ ] Auto-renovación configurada

### 6. Configuración de PM2

#### 6.1 Iniciar Aplicación
```bash
# Iniciar con PM2
pm2 start ecosystem.config.json

# Verificar estado
pm2 status

# Ver logs
pm2 logs uttecam-api
```

- [ ] Aplicación iniciada exitosamente
- [ ] Sin errores en logs
- [ ] Health check respondiendo: `curl https://api.uttecam.edu.mx/health`

#### 6.2 Configurar Auto-inicio
```bash
# Guardar configuración PM2
pm2 save

# Generar script de inicio
pm2 startup

# Ejecutar el comando que PM2 muestra
```

- [ ] PM2 configurado para auto-inicio en reboot
- [ ] Probado reiniciando servidor: `sudo reboot`

### 7. Seguridad

#### 7.1 Firewall
```bash
# UFW
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

- [ ] Firewall configurado
- [ ] Solo puertos necesarios abiertos

#### 7.2 Fail2ban
```bash
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

- [ ] Fail2ban instalado y activo

#### 7.3 Permisos de Archivos
```bash
# Permisos seguros
chmod 600 .env
chmod -R 755 uploads
chmod -R 755 logs
```

- [ ] `.env` con permisos 600
- [ ] Directorios con permisos apropiados

### 8. Backups

#### 8.1 Configurar Backup Automático
```bash
# Crear script de backup
chmod +x scripts/devops/backup.sh

# Agregar a crontab
crontab -e
# Agregar línea:
# 0 2 * * * /var/www/uttecam-api/scripts/devops/backup.sh
```

- [ ] Script de backup configurado
- [ ] Cron job programado
- [ ] Primer backup manual ejecutado y verificado

### 9. Monitoreo

#### 9.1 PM2 Monitoring
```bash
# Instalar PM2 Plus (opcional)
pm2 link [PUBLIC_KEY] [SECRET_KEY]
```

- [ ] Monitoreo configurado
- [ ] Alertas configuradas

#### 9.2 Logs
```bash
# Rotación de logs de Nginx
sudo nano /etc/logrotate.d/nginx

# Verificar logs de aplicación
tail -f logs/combined.log
```

- [ ] Log rotation configurado
- [ ] Logs accesibles y legibles

### 10. Testing Post-Deployment

#### 10.1 Tests Funcionales
- [ ] Health check: `curl https://api.uttecam.edu.mx/health`
- [ ] Login de admin: `POST /api/auth/login`
- [ ] CORS funcionando desde frontend
- [ ] Upload de archivos funciona
- [ ] Base de datos respondiendo

#### 10.2 Tests de Seguridad
- [ ] HTTPS forzado (HTTP redirect funciona)
- [ ] Headers de seguridad presentes
- [ ] Rate limiting activo
- [ ] JWT validation funciona
- [ ] CORS restrictivo

#### 10.3 Tests de Performance
- [ ] Tiempo de respuesta < 200ms (health check)
- [ ] Carga de archivos funciona
- [ ] Sin memory leaks: `pm2 monit`

### 11. Documentación

- [ ] Credenciales documentadas en gestor seguro
- [ ] IPs y dominios documentados
- [ ] Procedimientos de rollback documentados
- [ ] Contactos de emergencia documentados

## 🔄 Procedimiento de Rollback

Si algo sale mal:

```bash
# 1. Parar aplicación
pm2 stop uttecam-api

# 2. Restaurar backup
scripts/devops/restore.sh [BACKUP_FILE]

# 3. Revertir código
git checkout [COMMIT_ANTERIOR]
npm ci
npm run build

# 4. Reiniciar
pm2 restart uttecam-api
```

## 📞 Soporte Post-Deploy

### Comandos Útiles

```bash
# Ver logs en tiempo real
pm2 logs uttecam-api

# Reiniciar aplicación
pm2 restart uttecam-api

# Ver estado
pm2 status

# Monitorear recursos
pm2 monit

# Ver logs de Nginx
sudo tail -f /var/log/nginx/uttecam-api-error.log

# Verificar MySQL
sudo systemctl status mysql

# Espacio en disco
df -h
```

### Troubleshooting Común

**Problema:** Aplicación no inicia
- Verificar: `pm2 logs uttecam-api --err`
- Revisar: `.env` configurado correctamente
- Verificar: Base de datos accesible

**Problema:** 502 Bad Gateway
- Verificar: Aplicación corriendo en puerto 3002
- Revisar: Nginx configurado correctamente
- Verificar: Firewall no bloquea puerto

**Problema:** Error de base de datos
- Verificar: Credenciales en `.env`
- Revisar: MySQL corriendo: `sudo systemctl status mysql`
- Verificar: Usuario tiene permisos

## ✅ Sign-off Final

Una vez completado todo:

- [ ] Todas las secciones del checklist marcadas
- [ ] Tests post-deployment pasando
- [ ] Equipo notificado del deployment
- [ ] Documentación actualizada
- [ ] Backups verificados
- [ ] Monitoreo activo

**Deployado por:** _______________  
**Fecha:** _______________  
**Versión:** _______________  
**Commit:** _______________  

---

🎉 **¡Deployment exitoso!**
