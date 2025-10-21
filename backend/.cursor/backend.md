Perfecto. Voy a ponerme en contexto completo del sistema Misionary. Déjame explorar la estructura del proyecto, el schema de Prisma, la arquitectura actual y todos los componentes relevantes.

[35 tools called]

Perfecto. He analizado completamente el sistema **Misionary ERP** y ahora tengo contexto total de la arquitectura, el schema de datos, los servicios, controladores y toda la estructura del backend. A continuación te proporciono un **documento de contexto técnico detallado** que puedes usar como prompt para un agente IA especializado.

---

## 📋 CONTEXTO TÉCNICO COMPLETO: MISIONARY ERP BACKEND

### 1. INFORMACIÓN GENERAL DEL SISTEMA

**Nombre:** MISIONARY CRM/ERP  
**Propósito:** Sistema integral de gestión empresarial para administrar clientes, presupuestos, facturación, productos, servicios, personas, empresas, proveedores y finanzas.

**Ubicación del proyecto:** `/home/guido/workspace/misionary`

---

### 2. STACK TECNOLÓGICO

**Backend:**
- **Runtime:** Node.js + TypeScript (ES2018)
- **Framework:** Express 5.x
- **ORM:** Prisma 6.9.0 con PostgreSQL
- **Autenticación:** JWT (jsonwebtoken 9.x) + bcrypt para hashing de passwords
- **Validación:** express-validator 7.x
- **Seguridad:** helmet, cors
- **Email:** nodemailer
- **Logging:** morgan

**Infraestructura:**
- **Base de datos:** PostgreSQL 16 (Alpine)
- **Deployment:** Railway (producción)
- **Development:** Docker Compose (local)
- **Puerto backend:** 3001
- **Puerto PostgreSQL (local):** 5459

**Frontend:**
- React + Vite + TailwindCSS (separado del backend)
- URL producción: `https://ad.misionary.com`
- Puerto desarrollo: 5173

---

### 3. ARQUITECTURA DEL BACKEND

**Patrón arquitectónico:** Capas separadas (Layered Architecture)

```
backend/
├── src/
│   ├── config/           # Configuración centralizada
│   │   ├── config.ts     # Variables de entorno y configuración general
│   │   ├── prisma.ts     # Cliente de Prisma (singleton)
│   │   └── mailer.ts     # Configuración de nodemailer
│   ├── middleware/       # Middlewares de Express
│   │   ├── auth.ts       # Middleware de autenticación JWT
│   │   ├── checkRole.ts  # Middleware de autorización por roles
│   │   └── error.ts      # Manejo centralizado de errores (errorHandler)
│   ├── controllers/      # Controladores (capa de presentación)
│   ├── services/         # Lógica de negocio (capa de servicio)
│   ├── routes/           # Definición de rutas y endpoints
│   ├── utils/            # Utilidades transversales
│   │   ├── asyncHandler.ts  # Wrapper para async/await en controladores
│   │   ├── http-error.ts    # Clase para errores HTTP tipados
│   │   └── validator.ts     # (posible validación adicional)
│   ├── templates/        # Plantillas (posiblemente email)
│   ├── types/            # Tipos TypeScript personalizados
│   └── index.ts          # Punto de entrada de la aplicación
├── prisma/
│   ├── schema.prisma     # Definición del schema de datos
│   ├── migrations/       # Migraciones generadas por Prisma
│   ├── seed.ts           # Script de semillas (datos iniciales)
│   └── seed.sql          # SQL de semillas
└── package.json
```

---

### 4. FLUJO DE ARQUITECTURA

**Request Flow:**

```
Cliente HTTP
    ↓
Express Router (routes/*.routes.ts)
    ↓
Middleware auth.ts (verifica JWT)
    ↓
Middleware checkRole.ts (verifica roles)
    ↓
asyncHandler (wrapper para manejo de promesas)
    ↓
Controller (controllers/*.controller.ts) - validación de entrada
    ↓
Service (services/*.service.ts) - lógica de negocio
    ↓
Prisma Client - acceso a base de datos
    ↓
PostgreSQL
    ↓
Response JSON
```

---

### 5. MODELO DE DATOS (SCHEMA PRISMA)

#### **5.1. Entidades principales**

##### **Persona** (multirrol: cliente, proveedor, usuario interno)
- `id`, `nombre`, `email`, `password` (hashed con bcrypt)
- `tipo`: `CLIENTE` | `PROVEEDOR` | `INTERNO`
- `roles[]`: `ADMIN` | `CONTADOR` | `PROVEEDOR`
- `esUsuario`: boolean (indica si puede loguearse)
- `activo`: boolean
- `providerArea`, `providerRoles[]`: campos adicionales para proveedores
- **Relaciones:**
  - `empresas[]`: empresas asociadas (como cliente)
  - `productos[]`, `servicios[]`: como proveedor
  - `presupuestos[]`: como cliente
  - `recibos[]`, `pagosAdmin[]`: pagos recibidos o realizados
  - `authTokens[]`: tokens de invitación/reset

##### **Empresa** (entidad jurídica del cliente)
- `id`, `nombre`, `razonSocial`, `cuit`, `telefono`, `email`, `direccion`
- `clienteId` → `Persona`
- `activo`: boolean
- **Relaciones:**
  - `presupuestos[]`, `facturas[]`

##### **Producto**
- `id`, `nombre`, `precio`, `costoProveedor`, `margenAgencia`
- `proveedorId` → `Persona`
- `monedaId` → `Moneda`
- **Relaciones:**
  - `items[]`: ítems de presupuestos
  - `historialPrecios[]`

##### **Servicio**
- `id`, `nombre`, `descripcion`, `precio`, `costoProveedor`, `margenAgencia`
- `proveedorId` → `Persona`
- `monedaId` → `Moneda`
- **Relaciones:**
  - `items[]`: ítems de presupuestos
  - `historialPrecios[]`

##### **Presupuesto** (entidad central del sistema)
- `id`, `clienteId`, `empresaId` (opcional)
- `subtotal`, `impuestos`, `total`
- `estado`: `BORRADOR` | `ENVIADO` | `APROBADO` | `FACTURADO`
- `monedaId`, `tipoCambioFecha`
- **Contratos recurrentes:**
  - `esRecurrente`, `frecuencia`, `periodoInicio`, `periodoFin`, `precioPeriodo`, `renovacionAutomatica`
- **Relaciones:**
  - `items[]` → `Item` (productos/servicios incluidos)
  - `presupuestoImpuestos[]` → `PresupuestoImpuesto`
  - `facturas[]`, `cobrosCliente[]`, `pagosAdmin[]`
  - `versiones[]` → `PresupuestoVersion` (historial de cambios)
  - `asignacionesGasto[]`: gastos operativos asignados al proyecto

##### **Item** (línea de presupuesto)
- `id`, `presupuestoId`, `productoId` | `servicioId`, `cantidad`, `precioUnitario`

##### **PresupuestoVersion** (auditoría de cambios)
- `id`, `presupuestoId`, `versionNumero`
- `subtotalAnterior`, `subtotalNuevo`, `impuestosAnterior`, `impuestosNuevo`
- `estadoAnterior`, `estadoNuevo`
- `usuarioModificacionId`, `motivoCambio`, `fechaCambio`
- `snapshotData`: JSON completo del presupuesto
- `tipoOperacion`: `CREATE` | `UPDATE` | `STATE_CHANGE`

##### **Factura**
- `id`, `numero` (único), `presupuestoId`, `empresaId`
- `fecha`, `subtotal`, `impuestos`, `total`
- `estado`: `EMITIDA` | `PAGADA` | `ANULADA`
- `impuestoAplicadoId` → `Impuesto`
- `monedaId`, `tipoCambioFecha`

##### **Impuesto**
- `id`, `nombre` (único), `porcentaje`, `descripcion`, `activo`
- **Relación con presupuestos:** tabla intermedia `PresupuestoImpuesto` con `monto` calculado

##### **Moneda**
- `id`, `codigo`: `ARS` | `USD` | `EUR`
- `nombre`, `simbolo`, `activo`

##### **TipoCambio**
- `id`, `monedaDesdeId`, `monedaHaciaId`, `valor`, `fecha`
- `tipo`: `OFICIAL` | `BLUE` | `TARJETA`
- `fuente`: string opcional

##### **GastoOperativo**
- `id`, `concepto`, `descripcion`, `monto`, `monedaId`, `fecha`
- `categoria`: enum `CategoriaGasto` (OFICINA, PERSONAL, MARKETING, etc.)
- `esRecurrente`, `frecuencia`
- `proveedorId` → `Persona`
- `tipoId` → `TipoGasto`
- **Asignaciones a proyectos:** `asignaciones[]` → `AsignacionGastoProyecto`

##### **AsignacionGastoProyecto**
- Relaciona un gasto operativo con un presupuesto (proyecto)
- `gastoId`, `presupuestoId`, `porcentaje`, `montoAsignado`, `justificacion`

##### **Recibo** (pagos a proveedores)
- `id`, `personaId` (proveedor), `presupuestoId` (opcional)
- `concepto`, `monto`, `fecha`, `metodoPago`
- `tipo`: `PROVEEDOR` | `ADMIN`

##### **PagoAdmin** (retiros de ganancia de la empresa por parte de admins)
- `id`, `adminId` → `Persona`, `presupuestoId`, `monto`, `fecha`, `metodoPago`

##### **CobroCliente** (pagos recibidos del cliente, pueden estar o no asociados a una factura)
- `id`, `presupuestoId`, `monto`, `monedaId`, `fecha`, `metodoPago`, `concepto`

##### **AuthToken** (tokens de invitación y reset de contraseña)
- `id`, `tipo`: `INVITE` | `RESET`
- `tokenHash` (hash del token), `email`, `personaId`
- `usado`, `expiresAt`

##### **TipoGasto**
- `id`, `nombre`, `slug`, `color`, `descripcion`, `activo`

##### **HistorialPrecio**
- `id`, `productoId` | `servicioId`, `monedaId`, `precio`
- `fechaDesde`, `fechaHasta`, `motivoCambio`, `usuarioId`, `activo`

---

### 6. ENDPOINTS Y RUTAS PRINCIPALES

**Base URL:** `http://localhost:3001/api` (desarrollo)  
**Autenticación:** Header `Authorization: Bearer <token>`

#### **6.1. Autenticación** (`/api/auth`)

- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Login (devuelve JWT)
- `POST /api/auth/invite` - Crear invitación de usuario (solo ADMIN)
- `GET /api/auth/invite/validate?token=...` - Validar token de invitación
- `POST /api/auth/invite/accept` - Aceptar invitación y crear usuario
- `POST /api/auth/invite/complete-provider` - Completar registro de proveedor

#### **6.2. Personas** (`/api/personas`)

- `GET /api/personas` - Listar todas (filtros opcionales)
- `GET /api/personas/:id` - Obtener por ID
- `POST /api/personas` - Crear persona
- `PUT /api/personas/:id` - Actualizar persona
- `DELETE /api/personas/:id` - Eliminar persona

#### **6.3. Empresas** (`/api/empresas`)

- `GET /api/empresas` - Listar todas
- `GET /api/empresas/:id` - Obtener por ID
- `POST /api/empresas` - Crear empresa
- `PUT /api/empresas/:id` - Actualizar empresa
- `DELETE /api/empresas/:id` - Eliminar empresa

#### **6.4. Productos** (`/api/productos`)

- `GET /api/productos` - Listar todos
- `GET /api/productos/:id` - Obtener por ID
- `POST /api/productos` - Crear producto (ADMIN, CONTADOR, PROVEEDOR)
- `PUT /api/productos/:id` - Actualizar producto
- `DELETE /api/productos/:id` - Eliminar producto

#### **6.5. Servicios** (`/api/servicios`)

- `GET /api/servicios` - Listar todos
- `GET /api/servicios/:id` - Obtener por ID
- `POST /api/servicios` - Crear servicio (ADMIN, CONTADOR, PROVEEDOR)
- `PUT /api/servicios/:id` - Actualizar servicio
- `DELETE /api/servicios/:id` - Eliminar servicio

#### **6.6. Presupuestos** (`/api/presupuestos`)

- `GET /api/presupuestos` - Listar todos (con filtros: `clienteId`, `estado`)
- `GET /api/presupuestos/:id` - Obtener por ID (incluye items, impuestos, facturas, etc.)
- `POST /api/presupuestos` - Crear presupuesto
- `PUT /api/presupuestos/:id` - Actualizar presupuesto (con validaciones según estado)
- `PATCH /api/presupuestos/:id/estado` - Cambiar estado (ADMIN, CONTADOR)
- `DELETE /api/presupuestos/:id` - Eliminar presupuesto (solo ADMIN)

**Lógica especial de presupuestos:**
- **Estados y permisos:**
  - `BORRADOR`: cualquier usuario con rol puede editar
  - `ENVIADO`: solo ADMIN puede editar
  - `APROBADO`: solo ADMIN puede editar
  - `FACTURADO`: nadie puede editar (bloqueado)
- Al crear/actualizar, se registra automáticamente en `PresupuestoVersion` (historial completo)

#### **6.7. Presupuesto Historial** (`/api/presupuesto-historial`)

- `GET /api/presupuesto-historial/:presupuestoId` - Historial de versiones de un presupuesto

#### **6.8. Facturas** (`/api/facturas`)

- `GET /api/facturas` - Listar todas (filtros: `estado`, `clienteId`, `fechaDesde`, `fechaHasta`)
- `GET /api/facturas/:id` - Obtener por ID
- `POST /api/facturas` - Crear factura (vinculada a presupuesto)
- `PUT /api/facturas/:id` - Actualizar factura
- `PATCH /api/facturas/:id/anular` - Anular factura

#### **6.9. Impuestos** (`/api/impuestos`)

- `GET /api/impuestos` - Listar todos
- `GET /api/impuestos/:id` - Obtener por ID
- `POST /api/impuestos` - Crear impuesto (ADMIN)
- `PUT /api/impuestos/:id` - Actualizar impuesto (ADMIN)
- `DELETE /api/impuestos/:id` - Eliminar impuesto (ADMIN)

#### **6.10. Monedas** (`/api/monedas`)

- `GET /api/monedas` - Listar todas
- `GET /api/monedas/:id` - Obtener por ID
- `POST /api/monedas` - Crear moneda (ADMIN)
- `PUT /api/monedas/:id` - Actualizar moneda (ADMIN)

#### **6.11. Gastos Operativos** (`/api/gastos-operativos`)

- `GET /api/gastos-operativos` - Listar todos
- `GET /api/gastos-operativos/:id` - Obtener por ID
- `POST /api/gastos-operativos` - Crear gasto
- `PUT /api/gastos-operativos/:id` - Actualizar gasto
- `DELETE /api/gastos-operativos/:id` - Eliminar gasto

#### **6.12. Recibos** (`/api/recibos`)

- Pagos registrados a proveedores

#### **6.13. Finanzas** (`/api/finanzas`)

- `GET /api/finanzas/resumen/:presupuestoId` - Resumen financiero de un presupuesto (ganancia, pagado a proveedor, pagado a admin, disponible)
- `POST /api/finanzas/pago-admin` - Crear pago a admin (retiro de ganancia)
- `GET /api/finanzas/pagos-admin` - Listar pagos a admins
- `GET /api/finanzas/proveedores/:presupuestoId` - Resumen por proveedor (costo proveedor, pagado, pendiente)
- `GET /api/finanzas/kpis` - KPIs mensuales (ganancia empresa, pagado a admins, disponible)
- `GET /api/finanzas/cobros` - Cobros del periodo (facturado, cobrado, por cobrar)
- `POST /api/finanzas/cobro-cliente` - Registrar cobro de cliente
- `GET /api/finanzas/cobros-cliente` - Listar cobros de clientes

#### **6.14. Otros**

- `GET /api/health` - Health check del backend

---

### 7. REGLAS DE NEGOCIO IMPORTANTES

#### **7.1. Impuestos en presupuestos**

- La tabla `PresupuestoImpuesto` relaciona presupuestos con impuestos aplicados
- Al crear un presupuesto con impuestos, primero se crea la relación con `monto = 0`, luego se calcula el monto real según el porcentaje del impuesto y el subtotal
- **Impuesto por defecto:** En Misiones, Argentina, se aplica 2,45% de impuestos (debes crear este impuesto en la tabla `Impuesto`)

#### **7.2. Márgenes de ganancia**

- Cada producto/servicio tiene:
  - `costoProveedor`: lo que se paga al proveedor
  - `margenAgencia`: porcentaje de ganancia de la empresa
  - `precio`: precio final al cliente (incluye costo + margen)
- La ganancia de la empresa se calcula automáticamente en el servicio de finanzas:
  ```typescript
  ganancia = precioUnitario * (margenAgencia / 100) * cantidad
  ```

#### **7.3. Flujo de pagos**

1. **Cliente paga a la empresa:** Se registra en `CobroCliente` o al marcar una factura como `PAGADA`
2. **Empresa paga a proveedores:** Se registra en `Recibo` con `tipo = PROVEEDOR`
3. **Empresa paga a admins (retiros):** Se registra en `PagoAdmin`
4. **Validación:** No se puede pagar a un admin más de la ganancia disponible en un presupuesto

#### **7.4. Auditoría de presupuestos**

- Cada cambio en un presupuesto genera un registro en `PresupuestoVersion`
- Se almacena un snapshot JSON completo del presupuesto antes y después del cambio
- Se registra el usuario que hizo la modificación

#### **7.5. Autenticación e invitaciones**

- Los passwords se hashean con bcrypt (10 rounds)
- Los tokens de invitación se generan con `crypto.randomBytes(32).toString('hex')` y se almacenan hasheados en `AuthToken`
- El campo `password` de `Persona` nunca se expone en las respuestas API (se excluye con `{ password: _pwd, ...safeUser }`)

---

### 8. SERVICIOS PRINCIPALES Y SU LÓGICA

#### **8.1. PresupuestoService** (`services/presupuesto.service.ts`)

**Métodos:**
- `create(data)`: Crea presupuesto, valida cliente, valida productos/servicios, crea items, crea relaciones con impuestos, registra en historial
- `findById(id)`: Devuelve presupuesto con todas las relaciones (cliente, empresa, items, impuestos, facturas)
- `update(id, data, userId, userRoles)`: Actualiza presupuesto, valida permisos según estado, regenera items e impuestos, registra cambio en historial
- `updateEstado(id, estado, usuarioId)`: Cambia solo el estado, registra en historial
- `delete(id)`: Elimina presupuesto
- `findAll(clienteId?, estado?)`: Lista presupuestos con filtros opcionales

**Validaciones de permisos en update:**
- `BORRADOR`: permite edición a cualquier usuario autenticado con rol
- `ENVIADO`: solo ADMIN puede editar
- `APROBADO`: solo ADMIN puede editar
- `FACTURADO`: bloqueado, nadie puede editar (lanza error)

#### **8.2. FinanzasService** (`services/finanzas.service.ts`)

**Métodos principales:**
- `resumenPresupuesto(presupuestoId)`: Calcula:
  - Total precio al cliente
  - Total ganancia empresa (suma de márgenes)
  - Total pagado a proveedores
  - Total pagado a admins
  - Disponible para pagar a admins
- `resumenProveedores(presupuestoId)`: Por cada proveedor del presupuesto:
  - Total costo proveedor
  - Total pagado
  - Pendiente por pagar
- `kpisMensuales(desde, hasta, adminId?)`: KPIs del periodo:
  - Ganancia total empresa
  - Total pagado a admins
  - Disponible
  - Ganancia por moneda
- `cobrosPeriodo(desde, hasta)`: Cobros del periodo:
  - Total facturado
  - Total cobrado (facturas PAGADAS)
  - Total por cobrar (facturas EMITIDAS)
  - Cobros directos (sin factura)
- `crearPagoAdmin(input)`: Crea pago a admin, valida que sea ADMIN, valida que no exceda ganancia disponible
- `crearCobroCliente(input)`: Registra cobro de cliente

#### **8.3. FacturaService** (`services/factura.service.ts`)

**Métodos:**
- `create(data)`: Crea factura vinculada a presupuesto, estado inicial `EMITIDA`
- `findById(id)`: Devuelve factura con presupuesto, cliente e items
- `update(id, data)`: Actualiza factura (estado, fecha)
- `findAll(filters)`: Lista facturas con filtros (estado, clienteId, rango de fechas)
- `anular(id)`: Cambia estado a `ANULADA`

#### **8.4. AuthTokenService** (`services/authToken.service.ts`)

**Métodos:**
- `createToken(tipo, email, personaId, horasExpiracion)`: Genera token aleatorio, lo hashea, lo almacena en BD
- `validateToken(token, tipo)`: Valida que el token exista, no esté usado y no haya expirado
- `markUsed(tokenId)`: Marca token como usado

---

### 9. MIDDLEWARES

#### **9.1. auth.ts**

- Extrae token del header `Authorization: Bearer <token>`
- Verifica el token JWT con `jwt.verify(token, config.jwtSecret)`
- Busca el usuario en la BD por el `id` decodificado del token
- Asigna el usuario a `req.user`
- Si falla, responde `401 Unauthorized`

**Interfaz:**
```typescript
export interface AuthRequest extends Request {
  user?: any;
}
```

#### **9.2. checkRole.ts**

- Recibe un array de roles permitidos
- Verifica que `req.user.roles` contenga al menos uno de los roles permitidos
- Si no tiene permisos, responde `403 Forbidden`

**Uso:**
```typescript
checkRole([RolUsuario.ADMIN, RolUsuario.CONTADOR])
```

#### **9.3. errorHandler**

- Captura errores lanzados en la aplicación
- Si es instancia de `ApiError` o `HttpError`, devuelve el código y mensaje correspondiente
- Si es error genérico, devuelve `500 Internal Server Error`

---

### 10. UTILIDADES

#### **10.1. asyncHandler**

Wrapper para controladores asíncronos que captura errores automáticamente:

```typescript
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).then(() => undefined).catch(next)
  }
}
```

**Uso:**
```typescript
router.get('/', [auth], asyncHandler(PresupuestoController.findAll));
```

#### **10.2. HttpError**

Clase de error personalizada con métodos estáticos para errores comunes:

```typescript
HttpError.BadRequest('Datos inválidos')
HttpError.Unauthorized()
HttpError.Forbidden()
HttpError.NotFound('Recurso no encontrado')
HttpError.InternalServer()
```

---

### 11. CONFIGURACIÓN

#### **11.1. Variables de entorno** (archivo `backend/.env`)

```bash
# General
NODE_ENV=development
PORT=3001

# Database
DATABASE_URL=postgresql://user:password@host:port/dbname

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1d

# CORS
CORS_ORIGIN=http://localhost:5173

# Frontend URL (para links en emails)
FRONTEND_URL=https://ad.misionary.com

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-password
SMTP_FROM=no-reply@misionary.com
```

#### **11.2. Configuración centralizada** (`config/config.ts`)

```typescript
export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  databaseUrl: process.env.DATABASE_URL,
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },
  frontendUrl: 'https://ad.misionary.com',
};
```

---

### 12. COMANDOS ÚTILES

```bash
# Desarrollo
npm run start:dev              # Inicia servidor con ts-node-dev (hot reload)

# Producción
npm run build                  # Compila TypeScript a JavaScript
npm start                      # Inicia servidor compilado

# Base de datos
npx prisma generate            # Genera cliente de Prisma
npx prisma migrate dev         # Crea y aplica migración en desarrollo
npx prisma migrate deploy      # Aplica migraciones en producción
npx prisma db seed             # Ejecuta seed (datos iniciales)
npx prisma studio              # Abre interfaz gráfica de la BD

# Docker
docker-compose up --build      # Levanta todo el stack (postgres, backend, frontend)
docker-compose down            # Detiene y elimina contenedores
```

---

### 13. PATRONES Y BUENAS PRÁCTICAS APLICADAS

1. **Separación de capas:** Router → Controller → Service → Prisma
2. **Single Responsibility:** Cada servicio maneja una entidad
3. **DRY (Don't Repeat Yourself):** Lógica de negocio centralizada en servicios
4. **Error handling centralizado:** Middleware `errorHandler`
5. **Async/await con manejo de errores:** `asyncHandler` para evitar try-catch en cada controller
6. **Tipado fuerte con TypeScript:** Uso de interfaces y tipos de Prisma
7. **Seguridad:**
   - Passwords hasheados con bcrypt
   - JWT para autenticación stateless
   - Helmet para headers de seguridad
   - CORS configurado
   - Validación de entrada con express-validator
8. **Auditoría:** Historial completo de cambios en presupuestos con `PresupuestoVersion`
9. **Relaciones bien definidas:** Uso correcto de relaciones en Prisma (1:N, N:M)
10. **Soft deletes donde corresponde:** Campo `activo` en entidades críticas

---

### 14. ENUMERACIONES (ENUMS) IMPORTANTES

```typescript
enum TipoPersona {
  CLIENTE
  PROVEEDOR
  INTERNO
}

enum RolUsuario {
  ADMIN
  CONTADOR
  PROVEEDOR
}

enum EstadoPresupuesto {
  BORRADOR
  ENVIADO
  APROBADO
  FACTURADO
}

enum EstadoFactura {
  EMITIDA
  PAGADA
  ANULADA
}

enum CodigoMoneda {
  ARS
  USD
  EUR
}

enum TipoCotizacion {
  OFICIAL
  BLUE
  TARJETA
}

enum ReciboTipo {
  PROVEEDOR
  ADMIN
}

enum FrecuenciaContrato {
  UNICO
  MENSUAL
  TRIMESTRAL
  ANUAL
}

enum CategoriaGasto {
  OFICINA
  PERSONAL
  MARKETING
  TECNOLOGIA
  SERVICIOS
  TRANSPORTE
  COMUNICACION
  OTROS
}

enum TokenTipo {
  INVITE
  RESET
}
```

---

### 15. CONTEXTO FISCAL Y DE NEGOCIO

- **Jurisdicción:** Misiones, Argentina
- **Impuesto provincial obligatorio:** 2,45% sobre presupuestos facturados
- **Monedas soportadas:** ARS (Peso Argentino), USD (Dólar), EUR (Euro)
- **Tipos de cambio:** Se mantiene historial de tipos de cambio con fuente y tipo (oficial, blue, tarjeta)

---

### 16. INSTRUCCIONES PARA EL AGENTE IA

Como agente especializado en el backend de Misionary, debes:

1. **Comprender el dominio:** Estudiar las relaciones entre entidades, los flujos de negocio (presupuesto → factura → cobro → pago) y las reglas de permisos.

2. **Mantener la arquitectura:** Respetar la separación de capas (routes → controllers → services → prisma).

3. **Seguir los patrones existentes:** Usar `asyncHandler`, `HttpError`, middleware de autenticación y autorización.

4. **Validar siempre:** Verificar permisos según roles, validar datos de entrada, manejar errores correctamente.

5. **Documentar cambios:** Comentar código cuando introduzcas lógica compleja o reglas de negocio.

6. **Generar migraciones correctas:** Si modificas el schema, usar `npx prisma migrate dev --name descripcion-del-cambio`.

7. **Mantener integridad referencial:** No romper relaciones existentes, usar `onDelete: Cascade` o `SetNull` según corresponda.

8. **Optimizar consultas:** Usar `include` de Prisma para cargar relaciones en una sola query, evitar N+1.

9. **Respetar reglas de negocio:**
   - Presupuestos facturados son inmutables
   - Impuesto del 2,45% en presupuestos de Misiones
   - Validar márgenes de ganancia antes de permitir pagos a admins

10. **Producir código limpio:** TypeScript bien tipado, nombres descriptivos, funciones pequeñas y cohesivas.

---

### 17. EJEMPLO DE FEATURE COMPLETA

**Caso:** Crear endpoint para obtener resumen de cobros pendientes por cliente.

**1. Servicio** (`services/cliente.service.ts`):
```typescript
export class ClienteService {
  static async resumenCobrosPendientes(clienteId: number) {
    // Buscar presupuestos del cliente
    const presupuestos = await prisma.presupuesto.findMany({
      where: { clienteId },
      include: {
        facturas: true,
        cobrosCliente: true
      }
    });

    // Calcular total facturado, cobrado y pendiente
    let totalFacturado = 0;
    let totalCobrado = 0;

    for (const p of presupuestos) {
      for (const f of p.facturas) {
        totalFacturado += Number(f.total);
        if (f.estado === 'PAGADA') {
          totalCobrado += Number(f.total);
        }
      }
      
      for (const c of p.cobrosCliente) {
        totalCobrado += Number(c.monto);
      }
    }

    return {
      clienteId,
      totalFacturado,
      totalCobrado,
      totalPendiente: totalFacturado - totalCobrado
    };
  }
}
```

**2. Controller** (`controllers/cliente.controller.ts`):
```typescript
export class ClienteController {
  static async resumenCobros(req: Request, res: Response) {
    const clienteId = parseInt(req.params.id);
    const resumen = await ClienteService.resumenCobrosPendientes(clienteId);
    return res.json(resumen);
  }
}
```

**3. Route** (`routes/cliente.routes.ts`):
```typescript
import { Router } from 'express';
import { ClienteController } from '../controllers/cliente.controller';
import { auth } from '../middleware/auth';
import { checkRole } from '../middleware/checkRole';
import { RolUsuario } from '@prisma/client';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/:id/cobros-pendientes', 
  [auth, checkRole([RolUsuario.ADMIN, RolUsuario.CONTADOR])], 
  asyncHandler(ClienteController.resumenCobros)
);

export default router;
```

**4. Registrar en `index.ts`:**
```typescript
import clienteRoutes from './routes/cliente.routes';
app.use('/api/clientes', clienteRoutes);
```

---

## ✅ RESUMEN FINAL

Ahora posees el contexto completo del backend de **Misionary ERP**:

- **Stack:** Node.js + TypeScript + Express + Prisma + PostgreSQL
- **Arquitectura:** Capas separadas (routes, controllers, services)
- **Entidades principales:** Persona, Empresa, Producto, Servicio, Presupuesto, Factura, Impuesto, Moneda, Gastos, Cobros, Pagos
- **Reglas de negocio:** Márgenes de ganancia, impuestos del 2,45%, auditoría de presupuestos, permisos según roles y estados
- **Servicios clave:** Presupuestos, Facturas, Finanzas (resúmenes, KPIs, pagos, cobros)
- **Autenticación:** JWT + bcrypt, sistema de invitaciones con tokens
- **Infraestructura:** Docker Compose (local), Railway (producción)

Estás listo para **analizar, diseñar, implementar y optimizar features backend complejas** en el ecosistema de Misionary.

