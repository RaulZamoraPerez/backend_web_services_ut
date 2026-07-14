# 🔧 07. Troubleshooting

## Documentos en esta sección

Soluciones a problemas comunes y guías de resolución de errores.

### 📄 Documentos Disponibles

1. **[INDEX.md](./INDEX.md)** ⭐ - Índice General de Documentación
   - Guía completa de navegación
   - Inicio rápido
   - Índice de todos los documentos del proyecto
   - **Ideal para:** Encontrar cualquier documento rápidamente

---

## 🚨 Problemas Comunes

### 1. ❌ Error: "Cannot connect to database"

**Causa:** Credenciales incorrectas o MySQL no iniciado

**Solución:**
```bash
# Verificar que MySQL esté corriendo
sudo systemctl status mysql  # Linux
# o
brew services list | grep mysql  # macOS

# Verificar credenciales en .env
DB_HOST=localhost
DB_PORT=3306
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=uttecam
```

---

### 2. ❌ Error: "Port already in use"

**Causa:** Puerto 3000 ocupado por otra aplicación

**Solución:**
```bash
# Opción 1: Cambiar puerto en .env
PORT=3001

# Opción 2: Matar proceso en puerto 3000
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F
```

---

### 3. ❌ Error: "Module not found"

**Causa:** Dependencias no instaladas

**Solución:**
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### 2. ❌ Error: "Cannot connect to database"

**Causa:** Credenciales incorrectas o servicio MySQL no iniciado

**Solución:**
```bash
# Verificar que MySQL está corriendo
# Windows:
net start MySQL80

# Linux/Mac:
sudo service mysql start

# Verificar credenciales en .env
cat .env | grep DB_
```

**Verificar variables:**
```env
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=uttecam_db
DB_PORT=3306
```

---

### 3. ❌ Error: "Port 3000 already in use"

**Causa:** Otro proceso está usando el puerto

**Solución:**
```bash
# Ver qué proceso usa el puerto
netstat -ano | findstr :3000

# Matar el proceso (Windows)
taskkill /PID [ID_DEL_PROCESO] /F

# O cambiar el puerto en .env
PORT=3001
```

---

### 4. ❌ Error: "JWT token invalid"

**Causa:** Token expirado o JWT_SECRET incorrecto

**Solución:**
```bash
# 1. Obtener nuevo token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@uttecam.edu.mx","password":"Admin2024!"}'

# 2. Verificar JWT_SECRET en .env
echo $JWT_SECRET
```

---

### 5. ❌ Error: "No such file or directory"

**Causa:** Archivos no compilados o estructura incorrecta

**Solución:**
```bash
# Limpiar y recompilar
npm run clean
npm run build

# Verificar que existe dist/
ls dist/
```

---

### 6. ❌ Error: "Table doesn't exist"

**Causa:** Base de datos no creada o esquema no importado

**Solución:**
```bash
# 1. Verificar que la BD existe
mysql -u root -p -e "SHOW DATABASES;"

# 2. Crear base de datos
mysql -u root -p -e "CREATE DATABASE uttecam_db;"

# 3. Importar esquema
mysql -u root -p uttecam_db < sql/database_setup.sql
```

---

### 7. ❌ Error: "npm install fails"

**Causa:** Dependencias incompatibles o caché corrupto

**Solución:**
```bash
# Limpiar caché y node_modules
rm -rf node_modules package-lock.json
npm cache clean --force

# Reinstalar
npm install
```

---

### 8. ❌ Error: "Permission denied"

**Causa:** Permisos insuficientes en carpetas

**Solución:**
```bash
# Linux/Mac
chmod -R 755 .
chmod -R 777 uploads/

# Windows (como administrador)
icacls . /grant Everyone:(OI)(CI)F /T
```

---

## 🔍 Debugging

### Verificar Estado del Sistema

```bash
# 1. Health check
curl http://localhost:3000/health

# 2. Ver logs
tail -f logs/security-error-$(date +%Y-%m-%d).log

# 3. Verificar base de datos
mysql -u root -p -e "USE uttecam_db; SHOW TABLES;"

# 4. Verificar Node.js
node --version
npm --version
```

### Logs Útiles

```bash
# Ver logs en tiempo real
npm run dev

# Ver logs de error
cat logs/security-error-*.log

# Ver logs de acceso
cat logs/access-*.log
```

---

## 📋 Checklist de Verificación

Cuando algo no funciona, verifica:

- [ ] Node.js está instalado (v16+)
- [ ] MySQL está corriendo
- [ ] Variables de entorno (.env) están configuradas
- [ ] Base de datos existe y tiene las tablas
- [ ] Código está compilado (carpeta dist/ existe)
- [ ] Dependencias están instaladas (node_modules/ existe)
- [ ] Puerto no está en uso
- [ ] Usuario admin está creado
- [ ] Permisos de carpetas son correctos

---

## 🆘 ¿Aún con problemas?

### 1. Revisar documentación relacionada
- [INSTALLATION.md](../02-instalacion-configuracion/INSTALLATION.md)
- [DEPLOYMENT.md](../05-despliegue/DEPLOYMENT.md)
- [CPANEL_DEPLOYMENT.md](../05-despliegue/CPANEL_DEPLOYMENT.md)

### 2. Verificar ejemplos
- [API_REFERENCE.md](../04-api-referencia/API_REFERENCE.md)
- [ADMIN_USER.md](../06-seguridad-administracion/ADMIN_USER.md)

### 3. Crear issue en GitHub
Si ninguna solución funciona, crea un issue con:
- Descripción del problema
- Mensaje de error completo
- Pasos para reproducir
- Sistema operativo y versiones

---

## 💡 Tips de Prevención

### ✅ Buenas Prácticas

1. **Siempre hacer backup** antes de cambios importantes
2. **Leer los logs** cuando algo falla
3. **Verificar requisitos** antes de instalar
4. **Seguir el orden** de las guías
5. **No saltar pasos** de instalación
6. **Documentar cambios** que hagas
7. **Probar en desarrollo** antes de producción

---

[← Volver al índice principal](../README.md)
