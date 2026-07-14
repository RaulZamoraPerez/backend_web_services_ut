# 📚 Índice General de Documentación - UTTECAM API

Bienvenido a la documentación completa de la API UTTECAM. Este índice te ayudará a encontrar rápidamente la información que necesitas.

---

## 🎯 Inicio Rápido

¿Primera vez usando la API? Sigue este orden:

1. **[README.md](../README.md)** - Comienza aquí para una visión general
2. **[INSTALLATION.md](./INSTALLATION.md)** - Instala el proyecto en tu máquina
3. **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Configura tu entorno de desarrollo
4. **[API_REFERENCE.md](./API_REFERENCE.md)** - Explora los endpoints disponibles

---

## 📖 Documentos Principales

### 1. [README.md](../README.md)
**Visión General del Proyecto**

- ✅ Descripción del proyecto
- ✅ Características principales
- ✅ Instalación rápida
- ✅ Módulos disponibles (Textos, Directorios, Nosotros)
- ✅ Ejemplos de uso básico
- ✅ Scripts NPM disponibles
- ✅ Tecnologías utilizadas
- ✅ Estado del proyecto

**Ideal para:** Primera aproximación al proyecto, overview general

---

### 2. [API_REFERENCE.md](./API_REFERENCE.md)
**Referencia Completa de la API** ⭐ Documento más importante

- ✅ Todos los endpoints documentados
- ✅ Parámetros de request y response
- ✅ Códigos de estado HTTP
- ✅ Ejemplos en JavaScript, Python, PHP, cURL
- ✅ Validaciones y reglas de negocio
- ✅ Formato de errores

#### Contenido:
- **Endpoints Sistema** (/, /health)
- **Módulo Textos** (6 endpoints)
  - GET, POST, PUT, DELETE
  - Paginación, búsqueda, estadísticas
- **Módulo Directorios** (5 endpoints)
  - CRUD completo con manejo de imágenes
- **Módulo Nosotros** (6 endpoints)
  - Gestión de contenido institucional
- **Módulo Autenticación** (8 endpoints) 🔒
  - Login, registro, perfiles, gestión de usuarios
- **Módulo Solicitudes de Constancia** (9 endpoints) 🆕
  - Sistema completo de solicitudes académicas
  - Endpoints públicos y protegidos
  - Seguimiento por número de referencia
- **Módulo Directorios** (5 endpoints)
  - CRUD completo con imágenes
  - Validaciones de campos
- **Módulo Nosotros** (6 endpoints)
  - Contenido institucional
  - Upload de imágenes
  - Filtrado por tipo

**Ideal para:** Desarrolladores front-end, integración con la API, referencia técnica

---

### 3. [ARCHITECTURE.md](./ARCHITECTURE.md)
**Arquitectura del Sistema**

- ✅ Diagramas de arquitectura
- ✅ Flujo de datos
- ✅ Capas del sistema (Routes → Controllers → Models → DB)
- ✅ Estructura de archivos
- ✅ Esquema de base de datos
- ✅ Patrones de diseño utilizados
- ✅ Seguridad implementada
- ✅ Plan de escalabilidad
- ✅ Testing y CI/CD (futuro)

**Ideal para:** Arquitectos de software, desarrolladores senior, auditorías técnicas

---

### 4. [INSTALLATION.md](./INSTALLATION.md)
**Guía de Instalación Completa**

- ✅ Requisitos del sistema (mínimos y recomendados)
- ✅ Instalación en Windows, Linux y macOS
- ✅ Configuración de Node.js y MySQL
- ✅ Creación de base de datos
- ✅ Variables de entorno
- ✅ Compilación TypeScript
- ✅ Configuraciones avanzadas (SSL, Docker)
- ✅ Troubleshooting de instalación
- ✅ Checklist de verificación

**Ideal para:** Primera instalación, setup en nuevos entornos, troubleshooting

---

### 5. [DEVELOPMENT.md](./DEVELOPMENT.md)
**Guía de Desarrollo**

- ✅ Inicio rápido para desarrolladores
- ✅ Estructura del proyecto
- ✅ Scripts disponibles
- ✅ Comandos útiles de Sequelize
- ✅ Debugging y logs
- ✅ Archivos de backup
- ✅ Migraciones futuras sugeridas

**Ideal para:** Desarrolladores trabajando en el proyecto, contribuidores

---

### 6. [DEPLOYMENT.md](./DEPLOYMENT.md)
**Guías de Despliegue**

- ✅ Comparación de opciones de hosting
- ✅ cPanel (recomendado para principiantes)
- ✅ VPS/Servidor Dedicado
- ✅ Servicios en la nube (Heroku, DigitalOcean, AWS)
- ✅ Recomendaciones por tipo de proyecto
- ✅ Costos estimados
- ✅ Links a guías específicas

**Ideal para:** Decisiones de infraestructura, comparación de opciones

---

### 7. [CPANEL_DEPLOYMENT.md](./CPANEL_DEPLOYMENT.md)
**Deploy en cPanel Paso a Paso** ⭐ Guía más detallada de deployment

- ✅ Preparación del proyecto
- ✅ Configuración en cPanel
- ✅ Node.js Selector
- ✅ Subida de archivos (File Manager y Git)
- ✅ Configuración de base de datos MySQL
- ✅ Variables de entorno
- ✅ Activación de la aplicación
- ✅ Verificación y testing
- ✅ Solución de problemas comunes
- ✅ Monitoreo y mantenimiento

**Ideal para:** Deploy en hosting compartido, principiantes, proyectos pequeños

---

### 8. [IMAGENES_UPLOAD.md](./IMAGENES_UPLOAD.md)
**Sistema de Manejo de Imágenes**

- ✅ Características del sistema de upload
- ✅ Formatos soportados
- ✅ Tamaño máximo y validaciones
- ✅ Gestión automática de archivos
- ✅ Endpoints con soporte de imágenes
- ✅ Ejemplos con cURL y PowerShell
- ✅ URLs de acceso
- ✅ Seguridad y validaciones

**Ideal para:** Trabajo con uploads, integración de imágenes, módulos Directorios y Nosotros

---

---

### 10. [SOLICITUDES_CONSTANCIA_KARDEX.md](./SOLICITUDES_CONSTANCIA_KARDEX.md) 🆕
**Módulo de Solicitudes de Constancias y Kardex**

- ✅ Descripción completa del módulo
- ✅ Arquitectura y flujo de datos
- ✅ Modelo de datos detallado
- ✅ API endpoints (públicos y protegidos)
- ✅ Sistema de seguimiento por referencia
- ✅ Validaciones y seguridad
- ✅ Instalación y configuración
- ✅ Scripts de base de datos
- ✅ Ejemplos de uso y pruebas
- ✅ Troubleshooting y mantenimiento

**Ideal para:** Implementación del sistema de solicitudes académicas, administradores educativos

---

### 11. [CHANGELOG.md](../CHANGELOG.md)
**Historial de Versiones**

- ✅ Versión actual (2.0.0-secure)
- ✅ Historial de cambios
- ✅ Nuevas características por versión
- ✅ Correcciones de bugs
- ✅ Roadmap futuro (v2.0, v3.0)
- ✅ Convenciones de versionado

**Ideal para:** Seguimiento de cambios, planificación de actualizaciones, contributors

---

## 🎯 Guías por Caso de Uso

### Quiero desarrollar localmente
1. [INSTALLATION.md](./INSTALLATION.md) - Instalar dependencias
2. [DEVELOPMENT.md](./DEVELOPMENT.md) - Configurar entorno
3. [API_REFERENCE.md](./API_REFERENCE.md) - Conocer endpoints

### Quiero desplegar en producción
1. [DEPLOYMENT.md](./DEPLOYMENT.md) - Elegir plataforma
2. [CPANEL_DEPLOYMENT.md](./CPANEL_DEPLOYMENT.md) - Deploy en cPanel (recomendado)
3. [API_REFERENCE.md](./API_REFERENCE.md) - Verificar endpoints

### Quiero integrar el sistema de solicitudes académicas
1. [SOLICITUDES_CONSTANCIA_KARDEX.md](./SOLICITUDES_CONSTANCIA_KARDEX.md) - Documentación completa del módulo
2. [API_REFERENCE.md](./API_REFERENCE.md) - Endpoints y ejemplos de uso
3. [INSTALLATION.md](./INSTALLATION.md) - Si necesitas configurar desde cero

### Quiero integrar la API en mi frontend
1. [API_REFERENCE.md](./API_REFERENCE.md) - Documentación completa de endpoints
2. [IMAGENES_UPLOAD.md](./IMAGENES_UPLOAD.md) - Si necesitas uploads
3. [README.md](../README.md) - Ejemplos básicos

### Quiero entender la arquitectura
1. [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitectura completa
2. [DEVELOPMENT.md](./DEVELOPMENT.md) - Estructura del proyecto
3. [README.md](../README.md) - Visión general

### Quiero contribuir al proyecto
1. [DEVELOPMENT.md](./DEVELOPMENT.md) - Setup de desarrollo
2. [ARCHITECTURE.md](./ARCHITECTURE.md) - Entender el diseño
3. [CHANGELOG.md](../CHANGELOG.md) - Ver roadmap
4. [README.md](../README.md) - Guía de contribución

---

## 📊 Documentos por Audiencia

### 👨‍💼 Product Managers / Stakeholders
- **[README.md](../README.md)** - Visión general y características
- **[CHANGELOG.md](../CHANGELOG.md)** - Progreso y roadmap
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Opciones de hosting y costos

### 👨‍💻 Desarrolladores Frontend
- **[API_REFERENCE.md](./API_REFERENCE.md)** ⭐ Principal
- **[IMAGENES_UPLOAD.md](./IMAGENES_UPLOAD.md)** - Para uploads
- **[README.md](../README.md)** - Ejemplos básicos

### 👨‍💻 Desarrolladores Backend
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Arquitectura completa
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Setup y estructura
- **[API_REFERENCE.md](./API_REFERENCE.md)** - Endpoints

### 🏗️ DevOps / SysAdmins
- **[SECURITY.md](./SECURITY.md)** - 🔥 **NUEVO** Seguridad OWASP Top 10 ⭐
- **[IMPLEMENTATION.md](./IMPLEMENTATION.md)** - 🔥 **NUEVO** Implementación de seguridad
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Opciones de deploy
- **[CPANEL_DEPLOYMENT.md](./CPANEL_DEPLOYMENT.md)** - Deploy específico
- **[INSTALLATION.md](./INSTALLATION.md)** - Requisitos y setup

### 🧪 QA / Testers
- **[API_REFERENCE.md](./API_REFERENCE.md)** - Casos de prueba
- **[IMAGENES_UPLOAD.md](./IMAGENES_UPLOAD.md)** - Testing de uploads
- **[CHANGELOG.md](../CHANGELOG.md)** - Features a testear

### 👨‍🎓 Estudiantes / Principiantes
- **[README.md](../README.md)** - Comienza aquí
- **[INSTALLATION.md](./INSTALLATION.md)** - Setup paso a paso
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Guía de desarrollo

---

## 🔍 Búsqueda Rápida por Tema

### Instalación y Setup
- [INSTALLATION.md](./INSTALLATION.md) - Guía completa de instalación
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Configuración de desarrollo
- [README.md](../README.md) - Instalación rápida

### API y Endpoints
- [API_REFERENCE.md](./API_REFERENCE.md) - Referencia completa ⭐
- [IMAGENES_UPLOAD.md](./IMAGENES_UPLOAD.md) - Endpoints con imágenes

### Deployment
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Opciones de despliegue
- [CPANEL_DEPLOYMENT.md](./CPANEL_DEPLOYMENT.md) - Deploy en cPanel ⭐

### 🔒 Seguridad y Cumplimiento
- [SECURITY.md](./SECURITY.md) - 🔥 **NUEVO** Documentación completa OWASP Top 10 ⭐
- [IMPLEMENTATION.md](./IMPLEMENTATION.md) - 🔥 **NUEVO** Guía de implementación de seguridad
- [ADMIN_USER.md](./ADMIN_USER.md) - 🔥 **NUEVO** Usuario administrador y credenciales

### Arquitectura y Diseño
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitectura completa
- [README.md](../README.md) - Estructura básica

### Versionado y Cambios
- [CHANGELOG.md](../CHANGELOG.md) - Historial de versiones

---

## 📝 Archivos Adicionales

### En la raíz del proyecto:
- **package.json** - Dependencias y scripts
- **tsconfig.json** - Configuración TypeScript
- **.env.example** - Template de variables de entorno
- **.gitignore** - Archivos excluidos de Git

### En `/sql/`:
- **database_setup.sql** - Script de configuración de BD
- **directorios.sql** - Datos de ejemplo para directorios
- **nosotros_contenido.sql** - Datos de ejemplo para nosotros
- **sqlExample.sql** - Ejemplos de consultas

### En `/scripts/`:
- **create-production-package.js** - Script para empaquetar producción

---

## 🆘 Preguntas Frecuentes

### ¿Por dónde empiezo?
Lee el [README.md](../README.md) y luego la [guía de instalación](./INSTALLATION.md).

### ¿Cómo uso un endpoint específico?
Consulta el [API_REFERENCE.md](./API_REFERENCE.md) con ejemplos completos.

### ¿Cómo despliego en producción?
Revisa [DEPLOYMENT.md](./DEPLOYMENT.md) para elegir plataforma, y [CPANEL_DEPLOYMENT.md](./CPANEL_DEPLOYMENT.md) para cPanel.

### ¿Cómo contribuyo al proyecto?
Lee la sección de contribución en [README.md](../README.md) y el [DEVELOPMENT.md](./DEVELOPMENT.md).

### ¿Cómo subo imágenes?
Revisa [IMAGENES_UPLOAD.md](./IMAGENES_UPLOAD.md) para documentación completa del sistema de uploads.

### ¿Cuál es la arquitectura del sistema?
Todo está documentado en [ARCHITECTURE.md](./ARCHITECTURE.md) con diagramas.

---

## 📈 Estadísticas de Documentación

- **Total de documentos:** 9 archivos principales
- **Páginas totales:** ~100+ páginas equivalentes
- **Ejemplos de código:** 50+ ejemplos
- **Lenguajes de ejemplo:** JavaScript, Python, PHP, cURL, PowerShell
- **Diagramas:** Arquitectura, flujo de datos, estructura
- **Cobertura:** 100% de endpoints documentados
- **Última actualización:** Octubre 2025

---

## 🔄 Mantenimiento de la Documentación

Esta documentación se mantiene actualizada con cada versión. Si encuentras errores o mejoras:

1. Abre un issue en GitHub
2. Propón cambios vía Pull Request
3. Contacta al equipo de desarrollo

---

## 🎓 Universidad Tecnológica de Tecamachalco

**API UTTECAM v1.0**  
**Documentación completa y profesional**  
**Actualizada: Octubre 2025**

---

**¿Necesitas ayuda?** Consulta los documentos apropiados según tu caso de uso o contáctanos.

---

## 🔒 Rutas Públicas y Protegidas

Consulta el listado actualizado de endpoints públicos y protegidos:
- **[RUTAS_PUBLICAS_PROTEGIDAS.md](./RUTAS_PUBLICAS_PROTEGIDAS.md)**

---
