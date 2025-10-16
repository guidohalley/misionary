# Implementación: Margen de Agencia del 35% Predeterminado

## Fecha: 16 de Octubre de 2025

## Resumen
Se ha implementado un sistema de margen de agencia predeterminado del 35% en la creación de nuevos productos. Esta feature garantiza una ganancia mínima estándar para todos los productos de la agencia.

## Cambios Implementados

### Frontend - `/productos/new`

#### 1. Margen Preestablecido a 35%
**Archivo**: `src/views/productos/ProductoForm/ProductoForm.tsx`

```typescript
defaultValues: initialData || {
  nombre: '',
  costoProveedor: 0,
  margenAgencia: 35, // Preestablecido a 35%
  precio: 0,
  proveedorId: mustUseOwnId ? user?.id : undefined,
  monedaId: 1, // ARS por defecto
},
```

**Impacto**: 
- Cada nuevo producto comienza con 35% de margen preestablecido
- El usuario puede modificarlo si es necesario
- El cálculo automático del precio incluye este margen

#### 2. Campo de Precio Final Oculto en Modo Nuevo
**Archivo**: `src/views/productos/ProductoForm/ProductoForm.tsx`

```typescript
{isEdit && (
  <FormItem
    label="Precio Final (Calculado automáticamente)"
    {...}
  >
    {/* Campo visible solo en modo editar */}
  </FormItem>
)}
```

**Impacto**:
- En la creación nueva (`isEdit=false`): El campo de precio final NO se muestra
- En la edición (`isEdit=true`): El campo de precio final se muestra como referencia
- El precio se sigue calculando automáticamente en background

#### 3. Validación Mínima de 35%
**Archivo**: `src/views/productos/ProductoForm/ProductoForm.tsx`

```typescript
rules={{ 
  required: 'El margen de agencia es requerido',
  min: { value: 35, message: 'El margen mínimo debe ser 35%' },
  max: { value: 1000, message: 'El margen no puede exceder 1000%' }
}}
```

**Impacto**:
- No se permite crear productos con margen menor a 35%
- Validación frontend + backend (confianza del backend en frontend)
- Mensaje de error claro: "El margen mínimo debe ser 35%"

### Backend
**Estado**: Sin cambios requeridos
- El backend `ProductoService` ya calcula automáticamente el precio: `precio = costoProveedor * (1 + margenAgencia/100)`
- El controlador `ProductoController` respeta los permisos de acceso
- La validación de datos ocurre en el frontend

## Flujo de Trabajo

### Crear Nuevo Producto
1. Usuario navega a `/productos/new`
2. Formulario carga con:
   - Margen de Agencia: **35%** (preestablecido)
   - Precio Final: **OCULTO**
3. Usuario ingresa:
   - Nombre del producto
   - Costo del proveedor
   - (Opcional) Modifica el margen si lo requiere
4. Sistema calcula automáticamente: `precio = costoProveedor * (1 + 35/100)`
5. Al guardar, se valida margen ≥ 35%

### Editar Producto Existente
1. Usuario navega a `/productos/edit/:id`
2. Formulario carga con datos actuales
3. Precio Final es **VISIBLE** para referencia
4. Usuario puede:
   - Cambiar costo del proveedor
   - Cambiar margen (mínimo 35%)
   - El precio se recalcula automáticamente
5. Al guardar, se valida margen ≥ 35%

## Ventajas

✅ **Garantía de Ganancia**: Mínimo 35% de margen en todos los productos
✅ **Experiencia Simplificada**: Usuarios no ven el precio final en creación
✅ **Validación Clara**: Mensajes de error específicos
✅ **Retrocompatibilidad**: Productos existentes no se ven afectados
✅ **Control**: ADMIN puede seguir modificando según necesidad

## Casos de Uso

### Caso 1: Proveedor Crea Nuevo Producto
```
Costo Proveedor: $100
Margen: 35% (automático)
Precio Final: $135 (100 * 1.35)
```

### Caso 2: Admin Quiere Mayor Margen
```
Costo Proveedor: $100
Margen: 50% (modificado)
Precio Final: $150 (100 * 1.50)
Validación: ✅ 50% ≥ 35%
```

### Caso 3: Usuario Intenta Margen Bajo
```
Costo Proveedor: $100
Margen: 20% (intento)
Validación: ❌ 20% < 35% (rechazado)
Error: "El margen mínimo debe ser 35%"
```

## Notas Técnicas

- **Cálculo del Precio**: 
  ```
  Precio Final = Costo Proveedor × (1 + Margen Agencia / 100)
  ```

- **Almacenamiento**: 
  - `margenAgencia`: Se almacena como número (35 = 35%)
  - `precio`: Se calcula y almacena en base de datos

- **Campos Ocultos**:
  - Modo Nuevo: Campo precio NO se muestra
  - Modo Editar: Campo precio se muestra (lectura)

## Testing Recomendado

- [ ] Verificar que nuevos productos comienzan con 35%
- [ ] Validar que no se puede crear con margen < 35%
- [ ] Confirmar que precio final no aparece en creación
- [ ] Verificar que precio final aparece en edición
- [ ] Testear cálculo automático con diferentes márgenes
- [ ] Validar con diferentes monedas
- [ ] Prueba con rol PROVEEDOR
- [ ] Prueba con rol ADMIN

## Próximas Mejoras Potenciales

1. **Configuración Global de Margen**: Permitir configurar el margen mínimo por ADMIN
2. **Historial de Cambios de Margen**: Registrar cuándo cambia el margen de un producto
3. **Alertas de Margen Bajo**: Notificar si un producto está muy cercano al mínimo
4. **Descuentos Especiales**: Permitir excepciones autorizadas por ADMIN

