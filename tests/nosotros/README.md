# Tests de "Nosotros" - Backend

Esta carpeta contiene tests automatizados para las funcionalidades de la sección "Nosotros" del backend.

## 📁 Archivos

- `nosotros.test.js` - Tests principales de funcionalidad
- `nosotros-validation.test.js` - Tests de validación y casos de error
- `generate-test-token.js` - Generador de tokens JWT para pruebas
- `run-nosotros-tests.js` - Script de ejecución rápida
- `README.md` - Documentación (este archivo)

## 🚀 Cómo ejecutar

### Prerrequisitos

1. **Servidor backend ejecutándose** en `http://localhost:3002`
2. **Base de datos configurada** y con datos iniciales
3. **Token de autenticación válido** (reemplaza en los archivos)

### Ejecutar tests principales

```bash
# Desde la raíz del proyecto backend
node tests/nosotros/nosotros.test.js
```

### Ejecutar tests de validación

```bash
node tests/nosotros/nosotros-validation.test.js
```

### Ejecutar todos los tests

```bash
# Opción 1: Script de ejecución rápida (recomendado)
node tests/nosotros/run-nosotros-tests.js

# Opción 2: Ejecutar manualmente
node tests/nosotros/nosotros.test.js && node tests/nosotros/nosotros-validation.test.js
```

## 🔑 Generar token para pruebas

Si necesitas un nuevo token JWT para las pruebas:

```bash
node tests/nosotros/generate-test-token.js
```

Este script genera un token válido usando la misma clave secreta que el backend, con un usuario admin de prueba que expira en 24 horas.

## 🔧 Configuración

### Token de autenticación

Los tests ya incluyen un token JWT válido generado automáticamente. Si el token expira, genera uno nuevo:

```bash
node tests/nosotros/generate-test-token.js
```

Luego reemplaza el token en ambos archivos de test.

### URL del servidor

Si tu servidor no está en `localhost:3002`, modifica:

```javascript
const BASE_URL = 'http://tu-servidor:puerto/api';
```

## 🧪 Tests incluidos

### Tests principales (`nosotros.test.js`)

1. **Obtener contenido** - Verifica que se pueda leer el contenido actual
2. **Actualizar Visión** - Prueba actualizar la sección de visión
3. **Actualizar Misión** - Prueba actualizar la sección de misión
4. **Actualizar Valores** - Prueba actualizar la sección de valores
5. **Verificar cambios** - Confirma que los cambios se guardaron correctamente

### Tests de validación (`nosotros-validation.test.js`)

1. **Sección inválida** - Verifica que se rechacen secciones no existentes
2. **Sin autenticación** - Confirma que se requiera autenticación
3. **Datos incompletos** - Prueba manejo de datos opcionales
4. **Formato inválido** - Verifica validación de tipos de datos
5. **Estructura de respuesta** - Confirma que la respuesta tenga todos los campos requeridos

## 📊 Resultados esperados

### Tests exitosos
```
🧪 Iniciando pruebas de "Nosotros"...

📖 Test: Obtener contenido de Nosotros
✅ Éxito: Contenido obtenido

🎯 Test: Actualizar sección Visión
✅ Éxito: Visión actualizada

🎯 Test: Actualizar sección Misión
✅ Éxito: Misión actualizada

🎯 Test: Actualizar sección Valores
✅ Éxito: Valores actualizados

🔍 Test: Verificar cambios guardados
✅ Contenido actual:
   Visión: Ser una institución líder...
   Misión: Ofrecer educación de calidad...
   Valores: 5 valores

✨ Tests completados!
```

### Posibles errores

- **Error de conexión**: Verifica que el servidor esté ejecutándose
- **Error de autenticación**: Reemplaza el token con uno válido
- **Error de base de datos**: Asegúrate de que la BD esté configurada

## 🔍 Depuración

Si los tests fallan, verifica:

1. **Logs del servidor**: Revisa la consola del backend
2. **Base de datos**: Confirma que las tablas existen y tienen datos
3. **CORS**: Asegúrate de que el backend permita requests desde el origen de los tests
4. **Token JWT**: Verifica que no haya expirado

## 📝 Notas

- Los tests modifican datos reales en la base de datos
- Se recomienda ejecutar en un entorno de desarrollo/pruebas
- Los tests asumen que existe al menos un registro de "Nosotros" en la BD