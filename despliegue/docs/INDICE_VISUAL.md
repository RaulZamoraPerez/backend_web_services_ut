# 📖 Índice Visual de Documentación UTTECAM API

## 🎯 Acceso Rápido por Tema

### � Inicio y Navegación

| Documento | Descripción | Propósito |
|-----------|-------------|-----------|
| **[README.md](./README.md)** ⭐ | Documentación principal | Punto de entrada |
| **[INDICE_VISUAL.md](./INDICE_VISUAL.md)** ⭐ | Este índice visual | Navegación rápida |
| **[GETTING_STARTED.md](./01-inicio/GETTING_STARTED.md)** | Guía de inicio | Primeros pasos |
| **[NAVIGATION.md](./01-inicio/NAVIGATION.md)** | Mapa de navegación | Guía detallada |

### 🧪 Testing de Seguridad

| Documento | Descripción | Comando |
|-----------|-------------|---------|
| **[RESUMEN_TEST_TOKENS.md](./06-seguridad-administracion/RESUMEN_TEST_TOKENS.md)** ⭐ | Resumen ejecutivo de tests | `npm run test:tokens` |
| **[TEST_TOKEN_SECURITY.md](./06-seguridad-administracion/TEST_TOKEN_SECURITY.md)** | Documentación completa de tests | Ver detalles técnicos |
| **[GUIA_VISUAL_TEST_TOKENS.md](./06-seguridad-administracion/GUIA_VISUAL_TEST_TOKENS.md)** | Interpretación visual | Entender resultados |

### 🔌 API y Endpoints

| Documento | Descripción | Uso Principal |
|-----------|-------------|---------------|
| **[API_REFERENCE.md](./04-api-referencia/API_REFERENCE.md)** ⭐ | Referencia completa de todos los endpoints | Consulta constante |
| **[NOSOTROS_API.md](./04-api-referencia/NOSOTROS_API.md)** 🆕 | API de contenido institucional | Gestión de visión, misión, valores |
| **[DIRECTORIOS_API.md](./04-api-referencia/DIRECTORIOS_API.md)** | API de directorios | CRUD de directorio |
| **[FORMULARIOS_API.md](./04-api-referencia/FORMULARIOS_API.md)** | API de formularios | Gestión de formularios |
| **[DOCUMENTOS_API.md](./04-api-referencia/DOCUMENTOS_API.md)** | API de documentos | Gestión de documentos |
| **[SOLICITUDES_CONSTANCIA_KARDEX.md](./04-api-referencia/SOLICITUDES_CONSTANCIA_KARDEX.md)** | Sistema de solicitudes | Constancias y kárdex |
| **[IMAGENES_UPLOAD.md](./04-api-referencia/IMAGENES_UPLOAD.md)** | Upload de imágenes | Manejo de archivos |

### ⚙️ Instalación y Configuración

| Documento | Descripción | Cuándo |
|-----------|-------------|--------|
| **[INSTALLATION.md](./02-instalacion-configuracion/INSTALLATION.md)** ⭐ | Guía completa de instalación | Primera vez |
| **[DEVELOPMENT.md](./03-desarrollo/DEVELOPMENT.md)** | Configuración de desarrollo | Setup inicial |
| **[IMPLEMENTATION.md](./03-desarrollo/IMPLEMENTATION.md)** | Detalles de implementación | Desarrollo avanzado |

### 🚀 Deployment

| Documento | Descripción | Plataforma |
|-----------|-------------|------------|
| **[DEPLOYMENT.md](./05-despliegue/DEPLOYMENT.md)** | Comparación de opciones | Decidir hosting |
| **[CPANEL_DEPLOYMENT.md](./05-despliegue/CPANEL_DEPLOYMENT.md)** ⭐ | Deploy en cPanel | Shared hosting |
| **[PRODUCTION_DEPLOYMENT.md](./05-despliegue/PRODUCTION_DEPLOYMENT.md)** | Deploy en producción | VPS/Cloud |
| **[CPANEL_DEPLOYMENT.md](./05-despliegue/CPANEL_DEPLOYMENT.md)** | Guía paso a paso | Deploy cPanel completo |

### 🔧 Troubleshooting

| Documento | Descripción | Problema |
|-----------|-------------|----------|
| **[PROBLEMA_RESUELTO.md](./07-troubleshooting/PROBLEMA_RESUELTO.md)** | Problemas comunes | Errores generales |
| **[SOLUCION_DEPLOYMENT.md](./07-troubleshooting/SOLUCION_DEPLOYMENT.md)** | Errores de deploy | Deployment |
| **[UPDATE_SUMMARY.md](./07-troubleshooting/UPDATE_SUMMARY.md)** | Resumen de updates | Actualizaciones |
| **[CHANGES_NUMERO_REFERENCIA.md](./07-troubleshooting/CHANGES_NUMERO_REFERENCIA.md)** | Cambios realizados | Historial de cambios |
| **[MIGRATION_INSTRUCTIONS.md](./07-troubleshooting/MIGRATION_INSTRUCTIONS.md)** | Instrucciones de migración | Base de datos |
| **[REORGANIZATION.md](./07-troubleshooting/REORGANIZATION.md)** | Reorganización docs | Documentación |

### 🏗️ Arquitectura

| Documento | Descripción | Para |
|-----------|-------------|------|
| **[ARCHITECTURE.md](./08-arquitectura/ARCHITECTURE.md)** ⭐ | Arquitectura completa del sistema | Entender estructura |

---

## 📋 Guías por Escenario

### 🆕 Primera Vez Usando el Proyecto

```
1. README.md (raíz del proyecto)
2. INSTALLATION.md
3. DEVELOPMENT.md
4. ADMIN_USER.md
5. AUTENTICACION_JWT.md
6. API_REFERENCE.md
```

### 🔐 Implementar Autenticación

```
1. AUTENTICACION_JWT.md ⭐
2. SECURITY.md
3. RUTAS_PUBLICAS_PROTEGIDAS.md
4. Ejecutar: npm run test:tokens
5. Ver: RESUMEN_TEST_TOKENS.md
```

### 🧪 Validar Seguridad de Tokens

```
1. VERIFICACION_TOKENS.md (Índice rápido)
2. Ejecutar: npm run test:tokens
3. GUIA_VISUAL_TEST_TOKENS.md (Interpretar resultados)
4. AUTENTICACION_JWT.md#verificación-de-tokens (Métodos)
```

### 🔌 Desarrollar con la API

```
1. API_REFERENCE.md (Consulta constante)
2. AUTENTICACION_JWT.md (Obtener token)
3. IMAGENES_UPLOAD.md (Si usas archivos)
4. Módulo específico: DIRECTORIOS_API.md, FORMULARIOS_API.md, etc.
```

### 🚀 Hacer Deployment

```
1. DEPLOYMENT.md (Decidir plataforma)
2. CPANEL_DEPLOYMENT.md (Para cPanel)
   O PRODUCTION_DEPLOYMENT.md (Para VPS)
3. Si hay errores: SOLUCION_DEPLOYMENT.md
```

### 🔍 Resolver Problemas

```
1. PROBLEMA_RESUELTO.md (Problemas comunes)
2. AUTENTICACION_JWT.md#troubleshooting (Auth)
3. SOLUCION_DEPLOYMENT.md (Deploy)
4. Ejecutar: npm run test:tokens (Validar)
```

---

## 🎓 Flujos de Trabajo Comunes

### Login y Verificación de Token

```bash
# 1. Login
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 2. Guardar token de la respuesta
TOKEN="eyJhbGci..."

# 3. Verificar token
curl http://localhost:3002/api/auth/profile \
  -H "Authorization: Bearer $TOKEN"

# 4. Ejecutar tests automáticos
npm run test:tokens
```

📖 [Ver guía completa](./06-seguridad-administracion/AUTENTICACION_JWT.md)

### Crear Usuario y Testear

```bash
# 1. Crear usuario admin
npm run create:admin

# 2. Testear seguridad
npm run test:tokens

# 3. Verificar en API
curl -X POST http://localhost:3002/api/auth/login ...
```

📖 [Ver guía de admin](./06-seguridad-administracion/ADMIN_USER.md)

### Desarrollo Full Stack

```bash
# Backend
1. npm run dev           # Servidor desarrollo
2. npm run db:reset      # Reset BD si necesario
3. npm run test:tokens   # Validar seguridad

# Frontend
4. Consultar API_REFERENCE.md
5. Implementar con AUTENTICACION_JWT.md
6. Testear endpoints
```

📖 [Ver guía de desarrollo](./03-desarrollo/DEVELOPMENT.md)

---

## 🔍 Búsqueda Rápida

### Por Palabra Clave

- **JWT / Token** → [AUTENTICACION_JWT.md](./06-seguridad-administracion/AUTENTICACION_JWT.md), [VERIFICACION_TOKENS.md](./06-seguridad-administracion/VERIFICACION_TOKENS.md)
- **Login / Auth** → [AUTENTICACION_JWT.md](./06-seguridad-administracion/AUTENTICACION_JWT.md), [ADMIN_USER.md](./06-seguridad-administracion/ADMIN_USER.md)
- **Test / Testing** → [RESUMEN_TEST_TOKENS.md](./06-seguridad-administracion/RESUMEN_TEST_TOKENS.md), [TEST_TOKEN_SECURITY.md](./06-seguridad-administracion/TEST_TOKEN_SECURITY.md)
- **API / Endpoints** → [API_REFERENCE.md](./04-api-referencia/API_REFERENCE.md)
- **Deploy / Producción** → [CPANEL_DEPLOYMENT.md](./05-despliegue/CPANEL_DEPLOYMENT.md), [PRODUCTION_DEPLOYMENT.md](./05-despliegue/PRODUCTION_DEPLOYMENT.md)
- **Error / Problema** → [PROBLEMA_RESUELTO.md](./07-troubleshooting/PROBLEMA_RESUELTO.md), [SOLUCION_DEPLOYMENT.md](./07-troubleshooting/SOLUCION_DEPLOYMENT.md)
- **Seguridad** → [SECURITY.md](./06-seguridad-administracion/SECURITY.md), [AUTENTICACION_JWT.md](./06-seguridad-administracion/AUTENTICACION_JWT.md)
- **Instalación** → [INSTALLATION.md](./02-instalacion-configuracion/INSTALLATION.md)
- **Arquitectura** → [ARCHITECTURE.md](./08-arquitectura/ARCHITECTURE.md)

### Por Acción

- **Instalar** → [INSTALLATION.md](./02-instalacion-configuracion/INSTALLATION.md)
- **Configurar** → [DEVELOPMENT.md](./03-desarrollo/DEVELOPMENT.md)
- **Autenticar** → [AUTENTICACION_JWT.md](./06-seguridad-administracion/AUTENTICACION_JWT.md)
- **Verificar Token** → [VERIFICACION_TOKENS.md](./06-seguridad-administracion/VERIFICACION_TOKENS.md)
- **Testear** → `npm run test:tokens` + [RESUMEN_TEST_TOKENS.md](./06-seguridad-administracion/RESUMEN_TEST_TOKENS.md)
- **Hacer Deploy** → [CPANEL_DEPLOYMENT.md](./05-despliegue/CPANEL_DEPLOYMENT.md)
- **Resolver Error** → [PROBLEMA_RESUELTO.md](./07-troubleshooting/PROBLEMA_RESUELTO.md)
- **Entender Sistema** → [ARCHITECTURE.md](./08-arquitectura/ARCHITECTURE.md)

---

## 📊 Mapa de Documentación

```
docs/
├── 📘 README.md (Punto de entrada principal)
├── 📖 INDICE_VISUAL.md (Este documento - Índice visual)
│
├── 01-inicio/
│   ├── README.md (Información general)
│   ├── GETTING_STARTED.md (Guía de inicio)
│   └── NAVIGATION.md (Mapa de navegación)
│
├── 02-instalacion-configuracion/
│   └── INSTALLATION.md ⭐ (Instalación completa)
│
├── 03-desarrollo/
│   ├── DEVELOPMENT.md ⭐ (Entorno de desarrollo)
│   └── IMPLEMENTATION.md (Detalles de implementación)
│
├── 04-api-referencia/
│   ├── API_REFERENCE.md ⭐
│   ├── DIRECTORIOS_API.md
│   ├── FORMULARIOS_API.md
│   ├── DOCUMENTOS_API.md
│   ├── SOLICITUDES_CONSTANCIA_KARDEX.md
│   └── IMAGENES_UPLOAD.md
│
├── 05-despliegue/
│   ├── DEPLOYMENT.md
│   ├── CPANEL_DEPLOYMENT.md ⭐
│   ├── PRODUCTION_DEPLOYMENT.md
│   └── deploy.md
│
├── 06-seguridad-administracion/ 🔐
│   ├── AUTENTICACION_JWT.md ⭐⭐⭐ (Autenticación JWT)
│   ├── VERIFICACION_TOKENS.md 🆕 (Índice de verificación)
│   ├── SECURITY.md (Características de seguridad)
│   ├── ADMIN_USER.md (Gestión de usuarios)
│   ├── RUTAS_PUBLICAS_PROTEGIDAS.md (Control de acceso)
│   ├── RESUMEN_TEST_TOKENS.md ⭐ (Resumen de tests)
│   ├── TEST_TOKEN_SECURITY.md (Tests completos)
│   └── GUIA_VISUAL_TEST_TOKENS.md (Interpretación visual)
│
├── 07-troubleshooting/
│   ├── PROBLEMA_RESUELTO.md (Problemas comunes)
│   ├── SOLUCION_DEPLOYMENT.md (Errores de deploy)
│   ├── UPDATE_SUMMARY.md (Resumen de updates)
│   ├── CHANGES_NUMERO_REFERENCIA.md (Historial de cambios)
│   ├── MIGRATION_INSTRUCTIONS.md (Migraciones BD)
│   └── REORGANIZATION.md (Reorganización docs)
│
└── 08-arquitectura/
    └── ARCHITECTURE.md ⭐
```

**Leyenda:**
- ⭐ = Documento importante
- ⭐⭐⭐ = Documento esencial
- 🆕 NUEVO = Recién creado/actualizado

---

## 🚀 Comandos Rápidos

```bash
# Desarrollo
npm run dev              # Iniciar servidor desarrollo
npm run build           # Compilar TypeScript

# Base de Datos
npm run db:reset        # Reset completo
npm run db:seed         # Seed datos

# Usuarios
npm run create:admin    # Crear admin

# Testing
npm run test:tokens     # Test seguridad JWT ⭐

# Producción
npm run start           # Servidor producción
```

---

## 💡 Consejos

### Para Desarrolladores Nuevos
1. Empieza con **README.md** (raíz del proyecto)
2. Sigue **INSTALLATION.md**
3. Lee **AUTENTICACION_JWT.md** para autenticación
4. Usa **API_REFERENCE.md** como referencia constante

### Para Desarrolladores Experimentados
1. **API_REFERENCE.md** - Consulta rápida
2. **AUTENTICACION_JWT.md** - Implementación de auth
3. `npm run test:tokens` - Validar seguridad
4. **ARCHITECTURE.md** - Entender estructura

### Para Administradores
1. **AUTENTICACION_JWT.md** - Sistema de auth
2. `npm run test:tokens` - Validar seguridad
3. **SECURITY.md** - Características de seguridad
4. **CPANEL_DEPLOYMENT.md** - Deploy y monitoreo

---

**Última actualización:** 23 de octubre de 2025  
**Versión:** 2.0.0-secure

**Documentación Nueva:**
- ✅ AUTENTICACION_JWT.md (Guía completa de JWT)
- ✅ VERIFICACION_TOKENS.md (Índice rápido)
- ✅ RESUMEN_TEST_TOKENS.md (Resumen de tests)
- ✅ TEST_TOKEN_SECURITY.md (Tests completos)
- ✅ GUIA_VISUAL_TEST_TOKENS.md (Guía visual)
- ✅ INDICE_VISUAL.md (Este documento)
