# Tests - Backend BKUTTECAM

Esta carpeta contiene tests automatizados para las diferentes funcionalidades del backend.

## 📁 Estructura

```
tests/
├── nosotros/
│   ├── nosotros.test.js              # Tests principales de funcionalidad
│   ├── nosotros-validation.test.js   # Tests de validación y casos de error
│   ├── generate-test-token.js        # Generador de tokens JWT para pruebas
│   ├── run-nosotros-tests.js         # Script de ejecución rápida
│   └── README.md                     # Documentación específica
└── README.md                         # Este archivo
```

## 🚀 Cómo ejecutar

### Tests de "Nosotros"

```bash
# Ejecutar todos los tests de "Nosotros"
node tests/nosotros/run-nosotros-tests.js

# O ejecutar individualmente
node tests/nosotros/nosotros.test.js
node tests/nosotros/nosotros-validation.test.js
```

## 🔑 Generar tokens para pruebas

Para generar tokens JWT válidos para las pruebas:

```bash
node tests/nosotros/generate-test-token.js
```

Este script crea un token con un usuario admin de prueba que expira en 24 horas.

### Prerrequisitos

1. **Servidor backend ejecutándose** en `http://localhost:3002`
2. **Base de datos configurada** con datos iniciales
3. **Token de autenticación válido** configurado en los archivos de test

## 📋 Tests disponibles

### 🏢 "Nosotros" (nosotros/)
- **Funcionalidad**: CRUD completo de contenido de la página "Nosotros"
- **Validación**: Casos de error, autenticación, formato de datos
- **Cobertura**: Visión, Misión, Valores, títulos fijos

## 🔧 Configuración

### Token de autenticación

Antes de ejecutar cualquier test, configura un token JWT válido:

1. Inicia sesión en el dashboard
2. Copia el token JWT del localStorage o cookies
3. Reemplaza `tu-token-de-prueba-aqui` en los archivos de test

### Variables de entorno

Asegúrate de que el backend tenga configuradas las variables necesarias:
- `JWT_SECRET`
- `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`
- `PORT` (por defecto 3000)

## 📊 Resultados

Los tests mostrarán resultados detallados en consola:
- ✅ Éxito: Operación completada correctamente
- ❌ Error: Falló la operación con detalles del error

## 🔍 Depuración

Si los tests fallan:

1. **Verifica el servidor**: `http://localhost:3000/api/health`
2. **Revisa logs del backend**
3. **Confirma la base de datos**: Conexión y datos existentes
4. **Token válido**: No expirado y con permisos adecuados

## 📝 Notas importantes

- Los tests modifican datos reales en la base de datos
- Se recomienda ejecutar en entornos de desarrollo/pruebas
- Algunos tests requieren datos iniciales en la BD
- Los títulos de "Nosotros" están fijos y no se pueden modificar

## 🚀 Próximos tests

Próximamente se agregarán tests para:
- Sistema de eventos y countdown
- Reloj digital y configuración
- Autenticación y middleware
- Gestión de archivos y uploads