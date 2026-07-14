# 📚 Documentación UTTECAM API

Bienvenido a la documentación completa y organizada de la API UTTECAM. Esta guía te ayudará a navegar de manera eficiente por toda la información del proyecto.

## 🚀 Acceso Rápido

- 📖 **[INDICE_VISUAL.md](./INDICE_VISUAL.md)** - Índice visual completo de toda la documentación
- 🔍 **[VERIFICACION_TOKENS.md](./06-seguridad-administracion/VERIFICACION_TOKENS.md)** - Índice rápido para verificar tokens JWT
- 🔐 **[AUTENTICACION_JWT.md](./06-seguridad-administracion/AUTENTICACION_JWT.md)** - Guía completa de autenticación
- 🧪 **Testing:** `npm run test:tokens` - Validar seguridad de tokens

---

## 🗂️ Estructura de Documentación

La documentación está organizada en **8 categorías principales** para facilitar el acceso a la información:

### 📖 [01. Inicio](./01-inicio/)
Documentos introductorios y guías rápidas
- **[README.md](./01-inicio/README.md)** - Información general del proyecto

### ⚙️ [02. Instalación y Configuración](./02-instalacion-configuracion/)
Todo sobre la instalación y configuración inicial
- **[INSTALLATION.md](./02-instalacion-configuracion/INSTALLATION.md)** - Guía completa de instalación
  - Requisitos del sistema
  - Instalación en Windows, Linux y macOS
  - Configuración de Node.js y MySQL
  - Variables de entorno
  - Troubleshooting

### 💻 [03. Desarrollo](./03-desarrollo/)
Guías para desarrolladores
- **[DEVELOPMENT.md](./03-desarrollo/DEVELOPMENT.md)** - Entorno de desarrollo
  - Estructura del proyecto
  - Scripts disponibles
  - Comandos útiles de Sequelize
  - Debugging y logs
- **[IMPLEMENTATION.md](./03-desarrollo/IMPLEMENTATION.md)** - Detalles de implementación
  - Patrones de diseño
  - Flujos de trabajo

### 🔌 [04. API Referencia](./04-api-referencia/)
Documentación completa de la API
- **[API_REFERENCE.md](./04-api-referencia/API_REFERENCE.md)** ⭐ - Referencia completa de todos los endpoints
  - Autenticación
  - Textos
  - Directorios
  - Nosotros
  - Formularios
  - Solicitudes
- **[DIRECTORIOS_API.md](./04-api-referencia/DIRECTORIOS_API.md)** - Módulo de Directorios
- **[FORMULARIOS_API.md](./04-api-referencia/FORMULARIOS_API.md)** - Módulo de Formularios
- **[SOLICITUDES_CONSTANCIA_KARDEX.md](./04-api-referencia/SOLICITUDES_CONSTANCIA_KARDEX.md)** - Sistema de solicitudes
- **[IMAGENES_UPLOAD.md](./04-api-referencia/IMAGENES_UPLOAD.md)** - Manejo de imágenes y uploads

### 🚀 [05. Despliegue](./05-despliegue/)
Guías de deployment en diferentes entornos
- **[DEPLOYMENT.md](./05-despliegue/DEPLOYMENT.md)** - Comparación de opciones de hosting
- **[CPANEL_DEPLOYMENT.md](./05-despliegue/CPANEL_DEPLOYMENT.md)** ⭐ - Deploy en cPanel (paso a paso)
- **[PRODUCTION_DEPLOYMENT.md](./05-despliegue/PRODUCTION_DEPLOYMENT.md)** - Despliegue en producción
- **[CPANEL_DEPLOYMENT.md](./05-despliegue/CPANEL_DEPLOYMENT.md)** - Guía completa de deployment en cPanel

### 🔒 [06. Seguridad y Administración](./06-seguridad-administracion/)
Seguridad, autenticación, verificación de tokens y administración
- **[AUTENTICACION_JWT.md](./06-seguridad-administracion/AUTENTICACION_JWT.md)** ⭐ **NUEVO** - Guía completa de JWT
  - Login y obtención de tokens
  - **Verificación de tokens** (3 métodos diferentes)
  - Uso de tokens en requests
  - Testing de seguridad
  - Troubleshooting completo
- **[SECURITY.md](./06-seguridad-administracion/SECURITY.md)** - Características de seguridad
  - JWT Authentication
  - Rate Limiting
  - Input Validation
  - SQL Injection Protection
- **[ADMIN_USER.md](./06-seguridad-administracion/ADMIN_USER.md)** - Usuario administrador
  - Credenciales por defecto
  - Cómo usar el token JWT
  - Permisos del administrador
- **[RUTAS_PUBLICAS_PROTEGIDAS.md](./06-seguridad-administracion/RUTAS_PUBLICAS_PROTEGIDAS.md)** - Control de acceso a rutas
- **Testing de Seguridad:**
  - **[RESUMEN_TEST_TOKENS.md](./06-seguridad-administracion/RESUMEN_TEST_TOKENS.md)** - Resumen ejecutivo
  - **[TEST_TOKEN_SECURITY.md](./06-seguridad-administracion/TEST_TOKEN_SECURITY.md)** - Test completo
  - **[GUIA_VISUAL_TEST_TOKENS.md](./06-seguridad-administracion/GUIA_VISUAL_TEST_TOKENS.md)** - Guía visual

### 🔧 [07. Troubleshooting](./07-troubleshooting/)
Solución de problemas comunes
- **[PROBLEMA_RESUELTO.md](./07-troubleshooting/PROBLEMA_RESUELTO.md)** - Problemas comunes y soluciones
- **[SOLUCION_DEPLOYMENT.md](./07-troubleshooting/SOLUCION_DEPLOYMENT.md)** - Errores de deployment
- **[UPDATE_SUMMARY.md](./07-troubleshooting/UPDATE_SUMMARY.md)** - Resumen de actualizaciones

### 🏗️ [08. Arquitectura](./08-arquitectura/)
Arquitectura técnica del sistema
- **[ARCHITECTURE.md](./08-arquitectura/ARCHITECTURE.md)** - Arquitectura completa del sistema
  - Diagramas de arquitectura
  - Flujo de datos
  - Capas del sistema
  - Esquema de base de datos
  - Patrones de diseño

---

## 🎯 Guías Rápidas por Rol

### 👨‍💻 Soy Desarrollador Frontend
1. Lee el [README.md](../README.md) principal
2. Consulta [API_REFERENCE.md](./04-api-referencia/API_REFERENCE.md) para los endpoints
3. **Lee [AUTENTICACION_JWT.md](./06-seguridad-administracion/AUTENTICACION_JWT.md) para autenticación**
4. Revisa [RUTAS_PUBLICAS_PROTEGIDAS.md](./06-seguridad-administracion/RUTAS_PUBLICAS_PROTEGIDAS.md) para control de acceso
5. Consulta [IMAGENES_UPLOAD.md](./04-api-referencia/IMAGENES_UPLOAD.md) si trabajas con imágenes

### 🔧 Soy Desarrollador Backend
1. Comienza con [INSTALLATION.md](./02-instalacion-configuracion/INSTALLATION.md)
2. Configura el entorno con [DEVELOPMENT.md](./03-desarrollo/DEVELOPMENT.md)
3. Estudia [ARCHITECTURE.md](./08-arquitectura/ARCHITECTURE.md)
4. **Revisa [AUTENTICACION_JWT.md](./06-seguridad-administracion/AUTENTICACION_JWT.md) y [SECURITY.md](./06-seguridad-administracion/SECURITY.md)**
5. **Ejecuta tests de seguridad:** `npm run test:tokens`

### 🚀 Necesito Hacer Deployment
1. Compara opciones en [DEPLOYMENT.md](./05-despliegue/DEPLOYMENT.md)
2. Sigue [CPANEL_DEPLOYMENT.md](./05-despliegue/CPANEL_DEPLOYMENT.md) para cPanel
3. O [PRODUCTION_DEPLOYMENT.md](./05-despliegue/PRODUCTION_DEPLOYMENT.md) para VPS
4. Si hay errores, consulta [SOLUCION_DEPLOYMENT.md](./07-troubleshooting/SOLUCION_DEPLOYMENT.md)

### 📊 Soy Administrador de Sistema
1. Lee [AUTENTICACION_JWT.md](./06-seguridad-administracion/AUTENTICACION_JWT.md) para entender la autenticación
2. Ejecuta [tests de seguridad](./06-seguridad-administracion/RESUMEN_TEST_TOKENS.md): `npm run test:tokens`
3. Revisa [SECURITY.md](./06-seguridad-administracion/SECURITY.md)
4. Configura usuarios en [ADMIN_USER.md](./06-seguridad-administracion/ADMIN_USER.md)
5. Monitorea con las guías de [CPANEL_DEPLOYMENT.md](./05-despliegue/CPANEL_DEPLOYMENT.md)

### 📖 Soy Estudiante o Aprendiz
1. Empieza por el [README.md](../README.md) principal
2. Lee [INDICE_VISUAL.md](./INDICE_VISUAL.md) para una visión general
3. Sigue [INSTALLATION.md](./02-instalacion-configuracion/INSTALLATION.md) paso a paso
4. Experimenta con [API_REFERENCE.md](./04-api-referencia/API_REFERENCE.md)

---

## 📋 Orden Recomendado de Lectura

### Para Primer Uso (Principiantes)
1. **[README.md](../README.md)** - Visión general del proyecto
2. **[INSTALLATION.md](./02-instalacion-configuracion/INSTALLATION.md)** - Instalar el proyecto
3. **[DEVELOPMENT.md](./03-desarrollo/DEVELOPMENT.md)** - Configurar entorno
4. **[ADMIN_USER.md](./06-seguridad-administracion/ADMIN_USER.md)** - Crear usuario admin
5. **[AUTENTICACION_JWT.md](./06-seguridad-administracion/AUTENTICACION_JWT.md)** - Entender autenticación
6. **[API_REFERENCE.md](./04-api-referencia/API_REFERENCE.md)** - Explorar la API

### Para Desarrollo Activo
1. **[DEVELOPMENT.md](./03-desarrollo/DEVELOPMENT.md)** - Comandos y flujo de trabajo
2. **[API_REFERENCE.md](./04-api-referencia/API_REFERENCE.md)** - Referencia constante
3. **[AUTENTICACION_JWT.md](./06-seguridad-administracion/AUTENTICACION_JWT.md)** - Verificar tokens
4. **Testing:** `npm run test:tokens` - Validar seguridad
3. **[ARCHITECTURE.md](./08-arquitectura/ARCHITECTURE.md)** - Entender la estructura
4. **[SECURITY.md](./06-seguridad-administracion/SECURITY.md)** - Implementar seguridad

### Para Producción
1. **[DEPLOYMENT.md](./05-despliegue/DEPLOYMENT.md)** - Elegir hosting
2. **[CPANEL_DEPLOYMENT.md](./05-despliegue/CPANEL_DEPLOYMENT.md)** - Deploy paso a paso
3. **[SECURITY.md](./06-seguridad-administracion/SECURITY.md)** - Asegurar producción
4. **[SOLUCION_DEPLOYMENT.md](./07-troubleshooting/SOLUCION_DEPLOYMENT.md)** - Si hay problemas

---

## 🔍 Búsqueda Rápida

### ¿Necesitas información sobre...?

| Tema | Documento |
|------|-----------|
| Instalación | [02-instalacion-configuracion/INSTALLATION.md](./02-instalacion-configuracion/INSTALLATION.md) |
| API Endpoints | [04-api-referencia/API_REFERENCE.md](./04-api-referencia/API_REFERENCE.md) |
| Deployment | [05-despliegue/CPANEL_DEPLOYMENT.md](./05-despliegue/CPANEL_DEPLOYMENT.md) |
| Seguridad | [06-seguridad-administracion/SECURITY.md](./06-seguridad-administracion/SECURITY.md) |
| Autenticación | [06-seguridad-administracion/ADMIN_USER.md](./06-seguridad-administracion/ADMIN_USER.md) |
| Arquitectura | [08-arquitectura/ARCHITECTURE.md](./08-arquitectura/ARCHITECTURE.md) |
| Problemas | [07-troubleshooting/SOLUCION_DEPLOYMENT.md](./07-troubleshooting/SOLUCION_DEPLOYMENT.md) |
| Uploads | [04-api-referencia/IMAGENES_UPLOAD.md](./04-api-referencia/IMAGENES_UPLOAD.md) |
| Desarrollo | [03-desarrollo/DEVELOPMENT.md](./03-desarrollo/DEVELOPMENT.md) |
| Solicitudes | [04-api-referencia/SOLICITUDES_CONSTANCIA_KARDEX.md](./04-api-referencia/SOLICITUDES_CONSTANCIA_KARDEX.md) |

---

## 📊 Estadísticas de Documentación

- **Total de documentos:** 20
- **Categorías:** 8
- **Guías de deployment:** 4
- **Referencias de API:** 5
- **Guías de troubleshooting:** 3

---

## 🆕 Últimas Actualizaciones

- ✅ Reorganización completa de documentación por categorías
- ✅ Sistema de navegación mejorado
- ✅ Guías rápidas por rol de usuario
- ✅ Índice de búsqueda rápida

---

## 💡 Consejos de Uso

1. **Usa el buscador:** Presiona `Ctrl+F` (o `Cmd+F` en Mac) para buscar palabras clave
2. **Sigue los enlaces:** Todos los documentos están interconectados
3. **Consulta el índice:** [INDICE_VISUAL.md](./INDICE_VISUAL.md) tiene un desglose detallado
4. **Marca tus favoritos:** Guarda los documentos que más uses

---

## 📞 Recursos Adicionales

- **[CHANGELOG.md](../CHANGELOG.md)** - Historial de versiones
- **[README.md](../README.md)** - Documento principal del proyecto
- **Repositorio:** [GitHub - BKUTTECAM](https://github.com/Lisa2900/BKUTTECAM)

---

## 🎓 Convenciones de Documentación

- 📖 = Documento informativo
- ⚙️ = Documento técnico
- 🚀 = Guía práctica
- 🔒 = Seguridad
- ⭐ = Documento importante/destacado
- 🆕 = Contenido nuevo o actualizado
- 🔧 = Troubleshooting

---

**Última actualización:** Octubre 2025  
**Versión de la API:** 2.0.0-secure  
**Mantenido por:** Equipo UTTECAM

---

¿Tienes preguntas o sugerencias sobre la documentación? ¡Crea un issue en el repositorio!
