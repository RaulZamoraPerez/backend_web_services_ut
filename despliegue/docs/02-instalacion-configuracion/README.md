# ⚙️ 02. Instalación y Configuración

## Documentos en esta sección

Todo lo necesario para instalar y configurar el proyecto en tu entorno.

### 📄 Documentos Disponibles

1. **[INSTALLATION.md](./INSTALLATION.md)** ⭐ - Guía Completa de Instalación
   - Requisitos del sistema (mínimos y recomendados)
   - Instalación en Windows, Linux y macOS
   - Configuración de Node.js y MySQL
   - Creación y configuración de base de datos
   - Variables de entorno (.env)
   - Compilación TypeScript
   - Troubleshooting de instalación
   - Checklist de verificación
   - Ideal para: Primera instalación, setup en nuevos entornos

---

## 🚀 Guía Rápida

### Pasos Básicos de Instalación:

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Lisa2900/BKUTTECAM.git
   cd BKUTTECAM
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   - Copiar `.env.example` a `.env`
   - Configurar credenciales de base de datos

4. **Crear base de datos**
   - Ejecutar scripts SQL en `sql/`

5. **Iniciar aplicación**
   ```bash
   npm run dev
   ```

Para detalles completos, consulta **[INSTALLATION.md](./INSTALLATION.md)**

---

## 📋 Documentos Relacionados

- **[DEVELOPMENT.md](../03-desarrollo/DEVELOPMENT.md)** - Configurar entorno de desarrollo
- **[ADMIN_USER.md](../06-seguridad-administracion/ADMIN_USER.md)** - Crear usuario administrador
- **[Troubleshooting](../07-troubleshooting/)** - Si encuentras problemas

---

[← Volver al índice principal](../README.md)
