# Privacidad de Precios para Proveedores

## Problema Identificado
Los proveedores podían ver los precios (costoProveedor, margenAgencia, precio) de productos y servicios de otros proveedores, lo cual representa una brecha de confidencialidad empresarial.

## Solución Implementada

### 1. Control de Acceso por Roles

#### ADMIN
- **Permisos completos**: Ve todos los productos, servicios y precios
- **Puede**: Crear, leer, actualizar y eliminar cualquier producto/servicio
- **Acceso a**: Historial de precios completo de todos los productos/servicios

#### CONTADOR
- **Permisos de lectura completos**: Ve todos los productos, servicios y precios (necesario para análisis financieros)
- **Acceso a**: Historial de precios completo de todos los productos/servicios
- **No puede**: Crear/actualizar/eliminar productos/servicios (solo los roles asignados en rutas específicas)

#### PROVEEDOR
- **Permisos restrictivos**:
  - **Sus propios productos/servicios**: Ve información completa incluyendo precios
  - **Productos/servicios de otros**: Ve información básica SIN precios (costoProveedor, margenAgencia, precio = null)
  - **Solo puede crear/actualizar/eliminar**: Sus propios productos/servicios
  - **Historial de precios**: Solo de sus propios productos/servicios

### 2. Cambios en Controladores

#### ProductoController
- `create()`: Los proveedores solo pueden crear productos para sí mismos
- `findAll()`: Los proveedores solo ven sus propios productos (filtrado automático)
- `findById()`: Filtra información sensible según el rol del usuario
- `update()`: Los proveedores solo pueden actualizar sus propios productos
- `delete()`: Los proveedores solo pueden eliminar sus propios productos

#### ServicioController
- Misma lógica que ProductoController pero aplicada a servicios
- Control total de acceso basado en proveedorId

#### HistorialPrecioController
- `getHistorialProducto()`: Verificación de permisos antes de mostrar historial
- `getHistorialServicio()`: Verificación de permisos antes de mostrar historial
- `getPrecioActualProducto()`: Solo si tiene permisos para ver precios
- `getPrecioActualServicio()`: Solo si tiene permisos para ver precios

### 3. Funciones Auxiliares

#### HistorialPrecioControllerHelper
- `canAccessProductPricing()`: Verifica si un usuario puede ver precios de un producto
- `canAccessServicePricing()`: Verifica si un usuario puede ver precios de un servicio

### 4. Filtrado de Información Sensible

Para usuarios PROVEEDOR que ven productos/servicios de otros:
```json
{
  "id": 1,
  "nombre": "Producto Ejemplo",
  "proveedorId": 2,
  "costoProveedor": null,    // OCULTO
  "margenAgencia": null,     // OCULTO
  "precio": null,            // OCULTO
  "proveedor": { ... },
  "moneda": { ... }
}
```

## Beneficios de Seguridad

1. **Confidencialidad**: Los precios de cada proveedor son privados
2. **Competencia Justa**: Los proveedores no pueden ver estrategias de precios de competidores
3. **Integridad**: Los proveedores no pueden modificar datos de otros
4. **Auditabilidad**: Los admins y contadores mantienen acceso completo para gestión

## Compatibilidad

- **Frontend**: No requiere cambios inmediatos (la API devuelve null para campos sensibles)
- **Clientes Existentes**: Continuarán funcionando con datos filtrados
- **Migración**: No se requiere migración de base de datos

## Casos de Uso

### Escenario 1: Proveedor A consulta lista de productos
- Ve sus propios productos con precios completos
- Ve productos de Proveedor B/C sin precios
- No puede modificar productos de otros proveedores

### Escenario 2: Admin gestiona presupuestos
- Ve todos los productos con precios completos
- Puede crear/modificar cualquier producto/servicio
- Acceso completo al historial de precios

### Escenario 3: Contador analiza costos
- Ve todos los productos con precios completos (para análisis financiero)
- Acceso completo al historial de precios
- No puede modificar productos (según permisos de rutas)

## Próximos Pasos

1. **Testing**: Probar todos los escenarios con diferentes roles
2. **Frontend**: Actualizar UI para manejar campos null apropiadamente
3. **Documentación API**: Actualizar documentación con nuevos comportamientos
4. **Logging**: Considerar agregar logs de auditoria para accesos a información sensible
