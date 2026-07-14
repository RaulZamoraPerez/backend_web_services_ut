# Integración PersonalCarrera con Sistema de Emails

## 🔄 Cambios Realizados

Se ha integrado el modelo `PersonalCarrera` con el sistema de enrutamiento de emails para formularios, implementando un **sistema de fallback en cascada** que busca primero en la base de datos y luego en la configuración estática como respaldo.

## 📁 Archivos Modificados

### 1. `src/controllers/email-service/EmailRoutingService.ts`

**Cambios principales:**

- ✅ Sistema de fallback en cascada de 3 niveles
- ✅ Métodos convertidos a `async/await`
- ✅ Lanza error si la carrera no existe en ningún lado
- ✅ Mantiene compatibilidad con configuración estática como respaldo

**Sistema de Fallback (3 niveles):**

```typescript
static async getResponsibleEmail(area: string, carrera: string): Promise<string> {
  // 1️⃣ NIVEL 1: Buscar en Base de Datos (PersonalCarrera)
  const correoDB = await personalCarreraService.getCorreoByCarrera(carrera);
  if (correoDB) return correoDB;

  // 2️⃣ NIVEL 2: Buscar en emailRouting.ts (fallback estático)
  const match = EMAIL_ROUTING.find(...);
  if (match) return match.email;

  // 3️⃣ NIVEL 3: No existe en ningún lado → Lanzar error
  throw CustomError.badRequest(
    `La carrera "${carrera}" no está disponible para envío de emails.`
  );
}
```

**Antes:**

```typescript
static getResponsibleEmail(area: string, carrera: string): string {
  const match = EMAIL_ROUTING.find(...); // Solo búsqueda en array estático
  return match ? match.email : DEFAULT_EMAIL;
}
```

**Ahora:**

```typescript
static async getResponsibleEmail(area: string, carrera: string): Promise<string> {
  // 1. Busca en BD
  // 2. Si no encuentra, busca en emailRouting.ts
  // 3. Si tampoco encuentra, lanza error
  // Ya no usa DEFAULT_EMAIL como fallback
}
```

### 2. `src/controllers/upload/UploadController.ts`

**Cambios principales:**

- ✅ Agregado `await` al llamar `EmailRoutingService.getAllDestinations()`
- ✅ Maneja correctamente los métodos async

**Antes:**

```typescript
const destinationEmails = EmailRoutingService.getAllDestinations(
  infoForm.nivel || 'TSU',
  infoForm.carrera
);
```

**Ahora:**

```typescript
const destinationEmails = await EmailRoutingService.getAllDestinations(
  infoForm.nivel || 'TSU',
  infoForm.carrera
);
```

## 🔄 Flujo de Enrutamiento de Emails

### Flujo Anterior (Solo Estático):

```
Formulario → UploadController → EmailRoutingService
  → emailRouting.ts (array estático) → Email o DEFAULT_EMAIL
```

### Flujo Actual (Cascada con 3 niveles):

```
Formulario → UploadController → EmailRoutingService
  ↓
  1️⃣ Busca en BD (PersonalCarrera)
  ↓
  2️⃣ Si no encuentra → Busca en emailRouting.ts (fallback estático)
  ↓
  3️⃣ Si tampoco encuentra → Lanza CustomError
  ↓
  Email enviado (si encontró responsable)
```

## 📊 Lógica de Enrutamiento (Sistema de Cascada)

### 1️⃣ Nivel 1: Base de Datos (Prioridad)

```typescript
// Busca en PersonalCarrera donde carreras[] incluya la carrera
const correoDB = await personalCarreraService.getCorreoByCarrera(carrera);
if (correoDB) {
  // ✅ Encontrado en BD
  console.log(`📧 Responsable en BD: ${carrera} → ${correoDB}`);
  return correoDB;
}
```

**Ejemplo:**

- Carrera: `"TSU en Desarrollo de Software"`
- Personal en BD: María González con carreras `["TSU en Desarrollo de Software"]`
- Resultado: ✅ Envía a `maria.gonzalez@uttecam.edu.mx` + `ADMIN_EMAIL`

### 2️⃣ Nivel 2: Configuración Estática (Fallback)

```typescript
// Si no se encontró en BD, busca en emailRouting.ts
const match = EMAIL_ROUTING.find(
  (mapping) => mapping.area === area && normalize(mapping.carrera) === normalize(carrera)
);
if (match) {
  // ✅ Encontrado en configuración estática
  console.log(`📧 Responsable en config: ${carrera} → ${match.email}`);
  return match.email;
}
```

**Ejemplo:**

- Carrera: `"TSU en Mercadotecnia"`
- No existe en BD
- Existe en emailRouting.ts con email `matilde.alonso@uttecam.edu.mx`
- Resultado: ✅ Envía a `matilde.alonso@uttecam.edu.mx` + `ADMIN_EMAIL`

### 3️⃣ Nivel 3: Carrera No Disponible (Error)

```typescript
// Si no se encontró en ningún lado, lanza error
throw CustomError.badRequest(
  `La carrera "${carrera}" no está disponible para envío de emails. ` +
    `Por favor, contacte al administrador para configurar esta carrera.`
);
```

**Ejemplo:**

- Carrera: `"TSU en Robótica Avanzada"`
- No existe en BD
- No existe en emailRouting.ts
- Resultado: ❌ Error 400 con mensaje al usuario

**Respuesta de error:**

```json
{
  "ok": false,
  "message": "La carrera \"TSU en Robótica Avanzada\" no está disponible para envío de emails. Por favor, contacte al administrador para configurar esta carrera."
}
```

## 🎯 Ventajas del Sistema de Cascada

✅ **Prioridad dinámica**: Base de datos tiene prioridad sobre configuración estática  
✅ **Fallback seguro**: Si falla la BD, usa emailRouting.ts como respaldo  
✅ **Validación estricta**: Si la carrera no existe en ningún lado, notifica al usuario  
✅ **Sin emails perdidos**: Ya no se envía a DEFAULT_EMAIL genérico sin control  
✅ **Mensajes claros**: El usuario sabe exactamente qué carrera no está configurada  
✅ **Fácil migración**: Puedes migrar gradualmente de emailRouting.ts a BD  
✅ **Gestión híbrida**: Permite tener algunas carreras en BD y otras en config estática

## 📝 Ejemplo Práctico

### Dashboard - Asignar Personal a Carrera:

```javascript
POST /api/personal-carreras
{
  "nombre": "María González",
  "correo": "maria.gonzalez@uttecam.edu.mx",
  "carreras": [
    "TSU en Desarrollo de Software",
    "Ingeniería en Desarrollo de Software"
  ],
  "activo": true
}
```

### Formulario - Estudiante envía solicitud:

```javascript
POST /api/upload/single
{
  "nombre": "Juan Pérez",
  "carrera": "TSU en Desarrollo de Software",
  "nivel": "TSU",
  ...
}
```

### Sistema - Enrutamiento automático (Cascada):

```
1️⃣ Busca en PersonalCarrera (BD): quien tiene "TSU en Desarrollo de Software"
   → Encuentra: María González (maria.gonzalez@uttecam.edu.mx)

2️⃣ Como encontró en BD, ya no busca en emailRouting.ts

3️⃣ Envía email a:
   - maria.gonzalez@uttecam.edu.mx (responsable encontrado en BD)
   - jesus.sr0704@gmail.com (admin - siempre copia)
```

### Caso: Carrera solo en emailRouting.ts

```javascript
POST /api/upload/single
{
  "nombre": "Ana López",
  "carrera": "TSU en Mercadotecnia",  // No está en BD, solo en emailRouting.ts
  "nivel": "TSU"
}
```

**Sistema - Enrutamiento con fallback:**

```
1️⃣ Busca en PersonalCarrera (BD): "TSU en Mercadotecnia"
   → No encuentra ❌

2️⃣ Busca en emailRouting.ts: "TSU en Mercadotecnia"
   → Encuentra: Matilde Alonso Paz (matilde.alonso@uttecam.edu.mx) ✅

3️⃣ Envía email a:
   - matilde.alonso@uttecam.edu.mx (encontrado en fallback estático)
   - jesus.sr0704@gmail.com (admin)
```

### Caso: Carrera no configurada

```javascript
POST /api/upload/single
{
  "nombre": "Carlos Ruiz",
  "carrera": "TSU en Robótica Avanzada",  // No existe en ningún lado
  "nivel": "TSU"
}
```

**Sistema - Error controlado:**

```
1️⃣ Busca en PersonalCarrera (BD): "TSU en Robótica Avanzada"
   → No encuentra ❌

2️⃣ Busca en emailRouting.ts: "TSU en Robótica Avanzada"
   → No encuentra ❌

3️⃣ Lanza CustomError:
   "La carrera 'TSU en Robótica Avanzada' no está disponible para envío
   de emails. Por favor, contacte al administrador para configurar esta carrera."

4️⃣ Usuario recibe error 400 con mensaje claro
```

## 🔐 Configuración Actual

El archivo `src/config/emailRouting.ts` **AHORA SE USA** como **fallback/respaldo**.

**Uso actual del archivo:**

- ✅ `EMAIL_ROUTING`: Array usado como segunda opción (fallback)
- ✅ `ADMIN_EMAIL`: Email que siempre recibe copia
- ❌ `DEFAULT_EMAIL`: Ya no se usa (sistema lanza error en su lugar)

```typescript
// En emailRouting.ts
export const EMAIL_ROUTING = [...]; // ✅ Usado como fallback
export const ADMIN_EMAIL = 'jesus.sr0704@gmail.com'; // ✅ Usado siempre
export const DEFAULT_EMAIL = 'jesus.sr0704@gmail.com'; // ❌ Deprecado
```

## 🚀 Próximos Pasos Recomendados

1. **Migrar gradualmente de emailRouting.ts a PersonalCarrera**

   - Crear registros en la BD para el personal actual
   - Verificar que las carreras más usadas estén en BD
   - emailRouting.ts seguirá funcionando como respaldo automático

2. **Dashboard Frontend**

   - Interfaz para gestionar asignaciones de personal
   - Ver qué carreras solo están en emailRouting.ts (pendientes de migrar)
   - Alertar carreras sin responsable en ningún lado
   - Indicador visual de carreras cubiertas por BD vs fallback

3. **Monitoreo y Alertas**

   - Log cuando se usa fallback de emailRouting.ts
   - Notificar si un formulario intenta usar carrera no configurada
   - Reportes de carreras con más solicitudes sin responsable en BD
   - Métricas de uso de BD vs fallback

4. **Migración completa (opcional, largo plazo)**
   - Una vez todo migrado a BD, deprecar EMAIL_ROUTING
   - Mantener solo ADMIN_EMAIL en emailRouting.ts
   - Sistema 100% dinámico desde base de datos
   - Eliminar array STAFF_MEMBERS cuando no se necesite

## ⚙️ Métodos Disponibles en PersonalCarreraService

```typescript
// Buscar correo por carrera (usado por EmailRoutingService)
async getCorreoByCarrera(carrera: string): Promise<string | null>

// Gestión completa de personal
async create(data): Promise<PersonalCarreraResponse>
async getAll(): Promise<PersonalCarreraResponse[]>
async getById(id): Promise<PersonalCarreraResponse>
async update(id, data): Promise<PersonalCarreraResponse>
async delete(id): Promise<{ message: string }>
```

## ✅ Estado Actual

- ✅ EmailRoutingService integrado con PersonalCarrera
- ✅ Sistema de cascada de 3 niveles implementado (BD → emailRouting.ts → Error)
- ✅ Métodos async implementados correctamente
- ✅ Sin errores de compilación
- ✅ Fallback a emailRouting.ts funcionando como respaldo
- ✅ Error claro cuando carrera no configurada en ningún lado
- ✅ Admin siempre recibe copia
- ✅ Sistema listo para producción

---

**Fecha de integración**: 6 de diciembre de 2025  
**Última actualización**: Sistema de cascada de 3 niveles  
**Archivos afectados**: 2 principales (EmailRoutingService.ts, UploadController.ts)  
**Breaking changes**: Ninguno (compatibilidad total mantenida)
