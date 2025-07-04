# Documentación del Módulo de Presupuestos

## ✅ Estado del Módulo: COMPLETADO

El módulo de presupuestos ha sido implementado exitosamente siguiendo el patrón establecido en personas, productos y servicios.

## 🏗️ Arquitectura

### Backend
- **Controller**: `backend/src/controllers/presupuesto.controller.ts`
- **Service**: `backend/src/services/presupuesto.service.ts`
- **Routes**: `backend/src/routes/presupuesto.routes.ts`
- **Schema**: Definido en `backend/prisma/schema.prisma`

### Frontend
- **Módulo**: `frontend/src/modules/presupuesto/`
  - `types.ts`: Definiciones de tipos
  - `service.ts`: Llamadas a la API
  - `hooks/usePresupuesto.ts`: Hook custom para gestión de estado
- **Vistas**: `frontend/src/views/presupuestos/`
  - `PresupuestosView.tsx`: Vista principal
  - `PresupuestoList/`: Lista con filtros y paginación
  - `PresupuestoForm/`: Formulario complejo con validación
  - `PresupuestoNew/`: Creación de presupuestos
  - `PresupuestoEdit/`: Edición de presupuestos
  - `PresupuestoView/`: Visualización detallada

## 🔧 Funcionalidades Implementadas

### CRUD Completo
- ✅ **Crear**: Formulario con validación y cálculos automáticos
- ✅ **Leer**: Lista con filtros, paginación y vista detallada
- ✅ **Actualizar**: Edición solo en estado BORRADOR
- ✅ **Eliminar**: Eliminación solo en estado BORRADOR

### Workflow de Estados
- **BORRADOR** → **ENVIADO** → **APROBADO** → **FACTURADO**
- Transiciones controladas con botones contextuales
- Permisos por rol (Admin/Contador)

### Formulario Avanzado
- Selección de cliente obligatoria
- Items dinámicos (productos O servicios)
- Autocompletado de precios
- Cálculos automáticos (subtotal, IVA, total)
- Validación con Zod
- Indicadores visuales de tipo de item

### UX/UI
- Animaciones con Framer Motion
- Formateo de precios en pesos argentinos
- Estados de carga y error
- Confirmaciones de eliminación
- Navegación fluida

## 🔗 Integración

### Rutas
```typescript
// routes.config.tsx
/presupuestos           // Lista
/presupuestos/new       // Nuevo
/presupuestos/edit/:id  // Editar
/presupuestos/view/:id  // Ver
```

### Navegación
- Menú principal con ícono `fileText`
- Breadcrumbs automáticos
- Botones de acción contextuales

### API Endpoints
```
GET    /api/presupuestos          // Lista con filtros
POST   /api/presupuestos          // Crear
GET    /api/presupuestos/:id      // Obtener por ID
PUT    /api/presupuestos/:id      // Actualizar
DELETE /api/presupuestos/:id      // Eliminar
PATCH  /api/presupuestos/:id/estado // Cambiar estado
```

## 🐛 Problemas Solucionados

### Bucle Infinito en useEffect
- **Problema**: `getPresupuesto` se regeneraba en cada render
- **Solución**: Agregado `useCallback` a funciones del hook

### Gestión de Estado
- **Problema**: Confusión entre `presupuesto` y `selectedPresupuesto`
- **Solución**: Uso consistente de `selectedPresupuesto` en vistas

### Validación de Formularios
- **Problema**: Selección simultánea de producto y servicio
- **Solución**: Validación mutua excluyente con Zod

### Error de Inicialización de Función
- **Problema**: `Cannot access 'formatPrice' before initialization` en PresupuestoForm
- **Solución**: Movida la función `formatPrice` antes de su uso

## 🚀 Cómo Usar

### 1. Listar Presupuestos
- Navegar a `/presupuestos`
- Filtrar por estado o cliente
- Paginar resultados

### 2. Crear Presupuesto
- Botón "Nuevo Presupuesto"
- Seleccionar cliente
- Agregar items (productos o servicios)
- Precios se autocompletan
- Totales se calculan automáticamente

### 3. Gestionar Estados
- **Borrador**: Permite editar y eliminar
- **Enviado**: Solo cambio de estado
- **Aprobado**: Solo cambio a facturado
- **Facturado**: Estado final

### 4. Ver Detalles
- Click en "Ver" para vista completa
- Información del cliente
- Detalle de items
- Resumen financiero

## 📝 Convenciones Seguidas

1. **Estructura**: Misma organización que personas/productos/servicios
2. **Tipos**: Definidos en módulo y vista
3. **Validación**: Zod para schemas
4. **Estado**: Hook personalizado con useCallback
5. **Animaciones**: Framer Motion consistente
6. **Estilos**: Tailwind CSS siguiendo design system

## 🎯 Próximos Pasos

El módulo está completo y funcional. Para replicar en otros módulos:

1. Copiar estructura de archivos
2. Adaptar tipos y schemas
3. Implementar lógica de negocio específica
4. Agregar rutas y navegación
5. Probar funcionalidades

---

**Resultado**: ✅ **CRUD de Presupuestos 100% funcional**
