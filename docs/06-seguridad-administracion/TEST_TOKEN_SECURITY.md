# Test de Seguridad y Expiración de Tokens JWT

## 📋 Descripción

Este test completo verifica la seguridad de la implementación de autenticación JWT en la API de UTTECAM. Prueba 10 escenarios diferentes para garantizar que los tokens se generan, validan y expiran correctamente.

## 🎯 Tests Incluidos

### 1. **Generación de Token Válido**
- Verifica que se pueden generar tokens correctamente
- Valida que el payload se codifica correctamente
- Comprueba que el token puede ser verificado

### 2. **Expiración de Token**
- Crea un token con expiración de 2 segundos
- Verifica que el token es válido antes de expirar
- Confirma que el token es rechazado después de expirar

### 3. **Token con Firma Inválida**
- Genera un token con un secret diferente
- Verifica que es rechazado al intentar validarlo
- Previene ataques de falsificación de tokens

### 4. **Token Manipulado**
- Crea un token válido y lo modifica
- Verifica que el token manipulado es rechazado
- Protege contra ataques de manipulación de datos

### 5. **Acceso sin Token**
- Intenta acceder a una ruta protegida sin token
- Verifica que se retorna HTTP 401 (Unauthorized)
- Confirma que las rutas protegidas están aseguradas

### 6. **Acceso con Token Expirado**
- Intenta acceder con un token que ya expiró
- Verifica que se retorna HTTP 403 (Forbidden)
- Confirma que los tokens expirados son rechazados

### 7. **Acceso con Token Válido**
- Obtiene un token mediante login
- Accede a una ruta protegida
- Verifica que se retorna HTTP 200 (OK)

### 8. **Token sin Prefijo Bearer**
- Envía un token sin el prefijo "Bearer "
- Verifica que es rechazado correctamente
- Valida el formato del header Authorization

### 9. **Verificación de Roles**
- Genera tokens con diferentes roles
- Verifica que el rol se mantiene en el payload
- Confirma la integridad de los datos del usuario

### 10. **Decodificación Insegura**
- Demuestra la diferencia entre decodificar y verificar
- Muestra los riesgos de jwt.decode() sin verificación
- Recomienda usar siempre verifyToken()

## 🚀 Cómo Ejecutar

### Prerequisitos
1. El servidor debe estar corriendo en `http://localhost:3002`
2. La base de datos debe estar configurada
3. Las variables de entorno deben estar configuradas

### Ejecución

```bash
# Ejecutar el test de seguridad de tokens
npm run test:tokens
```

O directamente:

```bash
ts-node scripts/test-token-security.ts
```

## 📊 Interpretación de Resultados

El test mostrará resultados con códigos de color:

- ✓ Verde: Test exitoso
- ✗ Rojo: Test fallido (vulnerabilidad detectada)
- ⚠ Amarillo: Advertencia o información importante
- ℹ Azul: Información general

### Ejemplo de Salida Exitosa

```
🔐 TEST DE SEGURIDAD Y EXPIRACIÓN DE TOKENS JWT
════════════════════════════════════════════════════════════════

TEST 1: Generación de Token Válido
✓ Token generado correctamente y verificado
────────────────────────────────────────────────────────────────

TEST 2: Expiración de Token
✓ Token válido antes de expirar
ℹ Esperando 3 segundos...
✓ Token expirado correctamente después de 3 segundos
────────────────────────────────────────────────────────────────

📊 RESUMEN DE TESTS
Total de tests: 10
✓ Tests exitosos: 10
Porcentaje de éxito: 100.00%
```

## 🛡️ Recomendaciones de Seguridad

### 1. Configuración de Expiración
```env
# .env
JWT_EXPIRES_IN=15m  # Para tokens de acceso
REFRESH_TOKEN_EXPIRES_IN=7d  # Para refresh tokens
```

### 2. Secret Seguro
```env
# Generar un secret fuerte
JWT_SECRET=<cadena-aleatoria-de-al-menos-32-caracteres>
```

### 3. Implementaciones Adicionales Recomendadas

#### a) Refresh Tokens
```typescript
// Implementar sistema de refresh tokens
export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  // Validar refresh token
  // Generar nuevo access token
};
```

#### b) Token Blacklist
```typescript
// Lista negra de tokens revocados
const tokenBlacklist = new Set<string>();

export const revokeToken = (token: string) => {
  tokenBlacklist.add(token);
};

export const isTokenRevoked = (token: string): boolean => {
  return tokenBlacklist.has(token);
};
```

#### c) Validación Adicional
```typescript
export const verifyToken = (token: string): JWTPayload | null => {
  try {
    // Verificar si está en blacklist
    if (isTokenRevoked(token)) {
      return null;
    }
    
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    
    // Validaciones adicionales
    if (!decoded.id || !decoded.username || !decoded.role) {
      return null;
    }
    
    return decoded;
  } catch (error) {
    return null;
  }
};
```

## 🔒 Buenas Prácticas

### ✅ HACER
- ✓ Usar `verifyToken()` para validar tokens
- ✓ Configurar expiración corta (15min - 1h)
- ✓ Almacenar JWT_SECRET en variables de entorno
- ✓ Usar HTTPS en producción
- ✓ Implementar rate limiting en endpoints de autenticación
- ✓ Rotar el JWT_SECRET periódicamente
- ✓ Usar refresh tokens para sesiones largas
- ✓ Validar el formato del header Authorization

### ❌ NO HACER
- ✗ Nunca usar `jwt.decode()` sin verificación
- ✗ No incluir información sensible en el payload
- ✗ No usar el mismo secret para desarrollo y producción
- ✗ No ignorar los errores de verificación
- ✗ No almacenar tokens en localStorage (XSS vulnerable)
- ✗ No enviar tokens en URLs (query params)
- ✗ No hardcodear el JWT_SECRET en el código

## 🐛 Troubleshooting

### Error: "Cannot find module 'axios'"
```bash
npm install --save-dev axios @types/axios
```

### Error: "Connection refused"
Asegúrate de que el servidor está corriendo:
```bash
npm run dev
```

### Error: "Login failed"
Crea un usuario admin primero:
```bash
npm run create:admin
```

### Tests fallan al conectar a la API
Verifica la configuración en `.env`:
```env
PORT=3002
API_URL=http://localhost:3002/api
```

## 📝 Notas Técnicas

### Estructura del Token JWT

Un token JWT consta de 3 partes separadas por puntos:

```
header.payload.signature
```

**Header:**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload:**
```json
{
  "id": 1,
  "username": "admin",
  "role": "admin",
  "iat": 1634567890,
  "exp": 1634571490
}
```

**Signature:**
```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

### Tiempo de Expiración

La configuración actual de prueba usa tiempos muy cortos:
```typescript
JWT_EXPIRES_IN = '5 segundos'  // Solo para testing
```

Para producción, usar:
```typescript
JWT_EXPIRES_IN = '15m'  // 15 minutos
JWT_EXPIRES_IN = '1h'   // 1 hora
```

## 🔗 Referencias

- [JWT.io](https://jwt.io/) - Decodificar y debuggear tokens
- [OWASP JWT Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
- [RFC 7519 - JSON Web Token](https://tools.ietf.org/html/rfc7519)

## 📅 Mantenimiento

Este test debe ejecutarse:
- Antes de cada despliegue a producción
- Después de cambios en el middleware de autenticación
- Periódicamente como parte de CI/CD
- Cuando se actualicen las dependencias de seguridad

---

**Última actualización:** 23 de octubre de 2025
**Versión:** 2.0.0-secure
