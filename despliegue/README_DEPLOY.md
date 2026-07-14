# Paquete de Deploy — despliegue/

Este directorio contiene los archivos listos para empaquetar y subir a cPanel.

Contenido principal:
- `package.json` — Optimizado para producción (ya renombrado desde `package.deployment.json`).
- `dist/` — Código compilado listo para ejecución
- `.env.example` — Template de variables (crea `.env` en servidor)
- `database_setup.sql` — Script de inicialización de BD (ejecutar en phpMyAdmin o mysql CLI)
- `scripts/create-admin.js` — Script para crear usuario administrador (ejecutar después de instalar dependencias)
- `docs/` — Documentación relevante para deploy

Pasos para desplegar en cPanel:
1. Comprimir el contenido:
   - `cd despliegue && zip -r ../uttecam-api.zip .`
2. Subir `uttecam-api.zip` con File Manager y extraer en `public_html/api/`
3. En cPanel, crear la aplicación Node.js (Startup file: `dist/server.js`, NODE_ENV=production, PORT=3000)
4. Renombrar/crear `.env` con valores reales (no subir `.env` al repo)
5. Ejecutar `NPM Install` desde Node.js Selector o `npm install --production` en Terminal
6. Ejecutar `node scripts/create-admin.js` para crear admin (opcional)
7. Reiniciar la app en Node.js Selector y verificar `/health`

Notas:
- Si tu cPanel no soporta `npm` en UI, usa Terminal con `npm install --production`.
- Asegúrate de ejecutar `database_setup.sql` antes de iniciar la app (phpMyAdmin o mysql CLI).

