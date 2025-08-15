# Gestión Avanzada de Usuarios para ADMIN

## Problema Solucionado
Los usuarios ADMIN no podían gestionar completamente a los proveedores, incluyendo editar sus datos, actualizar roles específicos, o resetear contraseñas. Esto limitaba la capacidad de administración del sistema.

## Nuevas Funcionalidades Implementadas

### 1. Actualización Mejorada de Usuarios
**Endpoint:** `PUT /api/personas/:id`

#### Capacidades del ADMIN:
- **Cambio de tipo de usuario**: CLIENTE ↔ PROVEEDOR ↔ INTERNO
- **Gestión flexible de roles**: Puede asignar múltiples roles a los usuarios
- **Actualización de contraseñas**: Cambio de contraseña para usuarios del sistema
- **Validación de permisos**: Solo ADMIN puede realizar estas operaciones

#### Lógica de Roles por Tipo:
```typescript
// CLIENTE: Sin roles, sin acceso al sistema
updateData.roles = [];
updateData.esUsuario = false;

// PROVEEDOR: Rol PROVEEDOR + roles adicionales opcionales
updateData.roles = ['PROVEEDOR', ...rolesAdicionales];
updateData.esUsuario = true;

// INTERNO: Roles ADMIN/CONTADOR según especificación
updateData.roles = ['ADMIN'] || ['CONTADOR'] || ['ADMIN', 'CONTADOR'];
updateData.esUsuario = true;
```

### 2. Actualización Específica de Roles
**Endpoint:** `PATCH /api/personas/:id/roles`

#### Características:
- **Actualización granular**: Solo modifica roles sin tocar otros datos
- **Validación de tipo**: Respeta las restricciones por tipo de persona
- **Rol PROVEEDOR protegido**: Los proveedores siempre mantienen el rol PROVEEDOR
- **Auditoria**: Logs de cambios con usuario que realizó la modificación

#### Ejemplo de Uso:
```json
PATCH /api/personas/123/roles
{
  "roles": ["PROVEEDOR", "CONTADOR"]
}
```

### 3. Reseteo de Contraseñas
**Endpoint:** `POST /api/personas/:id/reset-password`

#### Capacidades:
- **Solo para usuarios del sistema**: PROVEEDOR e INTERNO
- **Validación de seguridad**: Contraseña con al menos 6 caracteres, letras y números
- **Hash seguro**: Utiliza bcrypt con salt rounds
- **Auditoria completa**: Registro de quién resetea qué contraseña

#### Ejemplo de Uso:
```json
POST /api/personas/123/reset-password
{
  "password": "nuevaContraseña123"
}
```

## Casos de Uso Solucionados

### Escenario 1: Proveedor necesita roles adicionales
**Problema**: Un proveedor también actúa como contador de la empresa
**Solución**: 
```bash
PATCH /api/personas/456/roles
{ "roles": ["PROVEEDOR", "CONTADOR"] }
```

### Escenario 2: Reseteo de contraseña por soporte
**Problema**: Un proveedor olvida su contraseña
**Solución**: 
```bash
POST /api/personas/456/reset-password
{ "password": "temporal123" }
```

### Escenario 3: Cambio de tipo de usuario
**Problema**: Un cliente necesita convertirse en proveedor
**Solución**: 
```bash
PUT /api/personas/789
{
  "tipo": "PROVEEDOR",
  "password": "nuevaPassword123",
  "roles": ["PROVEEDOR"]
}
```

## Validaciones y Seguridad

### Control de Acceso:
- ✅ Solo usuarios con rol `ADMIN` pueden usar estos endpoints
- ✅ Validación de existencia del usuario objetivo
- ✅ Verificación de tipo de usuario para operaciones específicas

### Validaciones de Datos:
```typescript
// Roles válidos
roles: ['ADMIN', 'CONTADOR', 'PROVEEDOR']

// Contraseña segura
password: {
  minLength: 6,
  pattern: /^(?=.*[A-Za-z])(?=.*\d)/,
  description: "Al menos una letra y un número"
}
```

### Integridad de Datos:
- **Proveedores**: Siempre mantienen el rol `PROVEEDOR`
- **Usuarios del sistema**: Solo ellos pueden tener contraseña
- **Clientes**: Automáticamente `esUsuario: false` y `roles: []`

## Compatibilidad

### Backend:
- ✅ **Rutas existentes**: Mantienen funcionalidad original
- ✅ **Nuevos endpoints**: Extensión sin romper compatibilidad
- ✅ **Validaciones**: Robustas y específicas por contexto

### Frontend:
- ✅ **APIs existentes**: Continúan funcionando normalmente
- 🔄 **Nuevas funcionalidades**: Requieren implementación en UI
- 💡 **Sugerencia**: Agregar modales para gestión de roles y reseteo de contraseñas

## Endpoints Añadidos

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| `PATCH` | `/api/personas/:id/roles` | Actualizar roles específicos | ADMIN |
| `POST` | `/api/personas/:id/reset-password` | Resetear contraseña | ADMIN |

## Logs de Auditoria

Todos los cambios sensibles se registran en consola con:
```typescript
console.log(`Roles actualizados para usuario ${id}:`, {
  before: persona.roles,
  after: validatedRoles,
  updatedBy: currentUser.id
});

console.log(`Contraseña reseteada para usuario ${id} por admin ${currentUser.id}`);
```

## Próximos Pasos

1. **Frontend**: Implementar UI para nuevas funcionalidades
2. **Testing**: Probar todos los escenarios de gestión de usuarios
3. **Documentación API**: Actualizar documentación Swagger/OpenAPI
4. **Logs avanzados**: Considerar sistema de auditoria en base de datos
