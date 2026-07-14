# 🚀 UTTECAM API - Documentación DevOps Completa

## 📋 Índice

1. [Arquitectura de Producción](#arquitectura)
2. [Preparación Pre-Deployment](#preparación)
3. [Deployment Paso a Paso](#deployment)
4. [Configuración Nginx](#nginx)
5. [Monitoreo y Logs](#monitoreo)
6. [Backup y Recuperación](#backup)
7. [Troubleshooting](#troubleshooting)
8. [Mantenimiento](#mantenimiento)

---

## 🏗️ Arquitectura de Producción {#arquitectura}

```
┌─────────────────────────────────────────────────────────────┐
│                        Internet                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                  ┌──────▼──────┐
                  │   Firewall  │
                  │   (UFW)     │
                  └──────┬──────┘
                         │
                  ┌──────▼──────┐
                  │   Nginx     │ ← SSL/TLS (Let's Encrypt)
                  │  (Reverse   │
                  │   Proxy)    │
                  └──────┬──────┘
                         │
              ┌──────────┴──────────┐
              │                     │
       ┌──────▼──────┐      ┌──────▼──────┐
       │   PM2       │      │   PM2       │
       │  Instance 1 │      │  Instance 2 │
       │  (Node.js)  │      │  (Node.js)  │
       └──────┬──────┘      └──────┬──────┘
              │                     │
              └──────────┬──────────┘
                         │
                  ┌──────▼──────┐
                  │   MySQL     │
                  │  Database   │
                  └─────────────┘
```

### Componentes

- **Nginx**: Reverse proxy, SSL termination, static files
- **PM2**: Process manager, clustering, auto-restart
- **Node.js**: API backend (TypeScript compilado)
- **MySQL**: Base de datos relacional
- **Let's Encrypt**: Certificados SSL gratuitos

---

## 🔧 Preparación Pre-Deployment {#preparación}

### 1. Checklist del Servidor

```bash
# Ejecutar script de validación
cd /var/www/uttecam-api
./scripts/devops/pre-deploy-check.sh
```

El script verificará:
- ✅ Node.js 18+ instalado
- ✅ Variables de entorno configuradas
- ✅ Base de datos accesible
- ✅ Dependencias instaladas
- ✅ Build compilado
- ✅ Permisos correctos

### 2. Generar Secrets de Producción

```bash
# JWT Secret (64 caracteres)
openssl rand -base64 64

# Session Secret (32 bytes hex)
openssl rand -hex 32

# Password seguro (32 caracteres)
openssl rand -base64 32
```

### 3. Configurar .env de Producción

Copiar `.env.example` como `.env` y configurar:

```bash
NODE_ENV=production
PORT=3002

# Database
DB_HOST=localhost
DB_NAME=uttecam
DB_USER=uttecam_user
DB_PASSWORD=[GENERADO CON OPENSSL]

# Security
JWT_SECRET=[GENERADO CON OPENSSL]
SESSION_SECRET=[GENERADO CON OPENSSL]

# CORS (solo dominios de producción)
CORS_ORIGIN=https://uttecam.edu.mx,https://www.uttecam.edu.mx

# SSL/Cookies
COOKIE_SECURE=true
TRUST_PROXY=true

# Logs
LOG_LEVEL=warn
```

---

## 📦 Deployment Paso a Paso {#deployment}

### Opción A: Deployment Manual

```bash
# 1. Clonar repositorio
cd /var/www
sudo git clone https://github.com/Lisa2900/BKUTTECAM.git uttecam-api
cd uttecam-api
sudo chown -R $USER:$USER .

# 2. Instalar dependencias
npm ci --only=production

# 3. Configurar entorno
cp .env.example .env
nano .env  # Configurar variables

# 4. Build
npm run build

# 5. Crear usuario admin
npm run create:admin

# 6. Iniciar con PM2
pm2 start ecosystem.config.json
pm2 save
pm2 startup

# 7. Verificar
curl http://localhost:3002/health
```

### Opción B: Deployment con Script Automatizado

```bash
# Crear y ejecutar script de deploy
./scripts/devops/deploy.sh
```

---

## 🌐 Configuración Nginx {#nginx}

### 1. Instalar Nginx

```bash
sudo apt update
sudo apt install -y nginx
```

### 2. Configurar Sitio

```bash
# Copiar configuración
sudo cp docs/05-despliegue/nginx.conf /etc/nginx/sites-available/uttecam-api

# Crear symlink
sudo ln -s /etc/nginx/sites-available/uttecam-api /etc/nginx/sites-enabled/

# Validar configuración
sudo nginx -t

# Recargar Nginx
sudo systemctl reload nginx
```

### 3. Configurar SSL con Let's Encrypt

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d api.uttecam.edu.mx

# Verificar auto-renovación
sudo certbot renew --dry-run

# Programar renovación automática (ya configurado por Certbot)
sudo systemctl status certbot.timer
```

### 4. Configuración de Firewall

```bash
# Permitir puertos necesarios
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS

# Activar firewall
sudo ufw enable

# Verificar status
sudo ufw status
```

---

## 📊 Monitoreo y Logs {#monitoreo}

### PM2 Monitoring

```bash
# Ver status de procesos
pm2 status

# Monitorear en tiempo real
pm2 monit

# Ver logs
pm2 logs uttecam-api

# Ver solo errores
pm2 logs uttecam-api --err

# Logs con timestamp
pm2 logs uttecam-api --timestamp

# Dashboard web (opcional)
pm2 plus
```

### Logs de Aplicación

```bash
# Logs combinados
tail -f logs/combined.log

# Solo errores
tail -f logs/error.log

# Logs de seguridad
tail -f logs/security.log

# Logs de acceso HTTP
tail -f logs/http.log
```

### Logs de Nginx

```bash
# Access logs
sudo tail -f /var/log/nginx/uttecam-api-access.log

# Error logs
sudo tail -f /var/log/nginx/uttecam-api-error.log

# Analizar logs con goaccess (opcional)
sudo apt install goaccess
sudo goaccess /var/log/nginx/uttecam-api-access.log -o report.html --log-format=COMBINED
```

### Métricas del Sistema

```bash
# Uso de CPU y memoria
htop

# Espacio en disco
df -h

# Inodes disponibles
df -i

# Procesos de Node.js
ps aux | grep node

# Conexiones activas
netstat -tulpn | grep :3002
```

### Health Checks

```bash
# Health check básico
curl https://api.uttecam.edu.mx/health

# Health check detallado
curl https://api.uttecam.edu.mx/health/detailed

# Metrics (Prometheus format)
curl https://api.uttecam.edu.mx/metrics
```

---

## 💾 Backup y Recuperación {#backup}

### Backup Manual

```bash
# Ejecutar backup completo
./scripts/devops/backup.sh

# Ver backups disponibles
ls -lh backups/database/
ls -lh backups/files/
ls -lh backups/config/
```

### Backup Automático

```bash
# Programar backup diario a las 2 AM
crontab -e

# Agregar línea:
0 2 * * * /var/www/uttecam-api/scripts/devops/backup.sh

# Verificar cron
crontab -l
```

### Restauración

```bash
# Listar backups disponibles
./scripts/devops/restore.sh

# Restaurar desde fecha específica
./scripts/devops/restore.sh 20260114

# Reiniciar después de restaurar
pm2 restart uttecam-api
```

### Backup Offsite (Recomendado)

```bash
# Sincronizar backups a servidor remoto con rsync
rsync -avz --delete backups/ user@backup-server:/backups/uttecam-api/

# O usar rclone para cloud storage
rclone sync backups/ remote:uttecam-api-backups/
```

---

## 🔧 Troubleshooting {#troubleshooting}

### Aplicación no inicia

```bash
# Ver logs de error
pm2 logs uttecam-api --err

# Verificar .env
cat .env | grep -v PASSWORD

# Verificar permisos
ls -la .env
ls -la uploads/
ls -la logs/

# Probar inicio manual
npm start
```

### Error de Base de Datos

```bash
# Verificar MySQL corriendo
sudo systemctl status mysql

# Probar conexión
mysql -u uttecam_user -p uttecam

# Ver logs de MySQL
sudo tail -f /var/log/mysql/error.log

# Verificar credenciales en .env
source .env
echo $DB_USER $DB_NAME
```

### 502 Bad Gateway (Nginx)

```bash
# Verificar que la app esté corriendo
pm2 status

# Verificar puerto correcto
netstat -tulpn | grep 3002

# Verificar configuración Nginx
sudo nginx -t

# Ver logs de Nginx
sudo tail -f /var/log/nginx/uttecam-api-error.log

# Reiniciar servicios
pm2 restart uttecam-api
sudo systemctl reload nginx
```

### Disco Lleno

```bash
# Ver uso de disco
df -h

# Encontrar directorios grandes
du -sh /* | sort -h

# Limpiar logs antiguos
find logs/ -name "*.log" -mtime +30 -delete

# Limpiar backups antiguos
find backups/ -name "*.gz" -mtime +30 -delete

# Limpiar cache de npm
npm cache clean --force

# Limpiar uploads temporales
find uploads/temp/ -type f -mtime +1 -delete
```

### Memoria Agotada

```bash
# Ver uso de memoria
free -h

# Ver procesos por memoria
ps aux --sort=-%mem | head -10

# Reiniciar PM2 con límite de memoria
pm2 restart uttecam-api --max-memory-restart 512M

# Ver configuración de PM2
pm2 show uttecam-api
```

### Certificado SSL Expirado

```bash
# Verificar expiración
sudo certbot certificates

# Renovar manualmente
sudo certbot renew

# Forzar renovación
sudo certbot renew --force-renewal

# Verificar timer de renovación
sudo systemctl status certbot.timer
```

---

## 🔄 Mantenimiento {#mantenimiento}

### Actualizaciones de Código

```bash
# 1. Hacer backup
./scripts/devops/backup.sh

# 2. Pull latest changes
git fetch origin
git checkout version-estable
git pull origin version-estable

# 3. Actualizar dependencias
npm ci --only=production

# 4. Rebuild
npm run build

# 5. Restart (sin downtime con PM2)
pm2 reload uttecam-api

# 6. Verificar
curl https://api.uttecam.edu.mx/health
pm2 logs uttecam-api --lines 50
```

### Actualizaciones de Seguridad

```bash
# Sistema operativo
sudo apt update
sudo apt upgrade -y

# Node.js (si es necesario)
nvm install 18
nvm use 18

# npm packages
npm audit
npm audit fix

# Nginx
sudo apt update nginx
```

### Rotación de Logs

```bash
# Configurar logrotate para Nginx
sudo nano /etc/logrotate.d/nginx

# Rotar logs de aplicación (ya configurado por winston)
# Ver: src/middleware/logging.ts

# Rotar logs manualmente
pm2 flush
```

### Limpieza Regular

```bash
# Crear script de limpieza
cat > scripts/devops/cleanup.sh << 'EOF'
#!/bin/bash
# Limpiar logs antiguos (>30 días)
find logs/ -name "*.log" -mtime +30 -delete

# Limpiar backups antiguos (>30 días)
find backups/ -type f -mtime +30 -delete

# Limpiar uploads temporales (>1 día)
find uploads/temp/ -type f -mtime +1 -delete

echo "Limpieza completada"
EOF

chmod +x scripts/devops/cleanup.sh

# Programar limpieza semanal
crontab -e
# Agregar: 0 3 * * 0 /var/www/uttecam-api/scripts/devops/cleanup.sh
```

### Monitoreo de Salud

```bash
# Configurar healthcheck con cron
cat > scripts/devops/healthcheck.sh << 'EOF'
#!/bin/bash
HEALTH=$(curl -s https://api.uttecam.edu.mx/health | jq -r '.status')
if [ "$HEALTH" != "ok" ]; then
    echo "API unhealthy" | mail -s "UTTECAM API Alert" admin@uttecam.edu.mx
    pm2 restart uttecam-api
fi
EOF

chmod +x scripts/devops/healthcheck.sh

# Ejecutar cada 5 minutos
crontab -e
# Agregar: */5 * * * * /var/www/uttecam-api/scripts/devops/healthcheck.sh
```

---

## 📚 Referencias Adicionales

- [Checklist de Deployment](./DEPLOYMENT_CHECKLIST.md)
- [Configuración de Seguridad](../06-seguridad-administracion/SECURITY.md)
- [Documentación de API](../04-api-referencia/)
- [PM2 Documentation](https://pm2.keymetrics.io/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)

---

## 🆘 Soporte

Para problemas críticos en producción:
- Email: soporte@uttecam.edu.mx
- Logs: `/var/www/uttecam-api/logs/`
- Monitoreo: `pm2 monit`
- Health: `https://api.uttecam.edu.mx/health/detailed`
