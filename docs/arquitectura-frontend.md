# INSTRUCCIONES PARA EL PRÓXIMO AGENTE DE IA

## ✅ **PERSONAS CRUD: IMPLEMENTACIÓN COMPLETA Y EXITOSA**

### Estado actual del proyecto Misionary ERP

### Tecnologías
- **Backend**: Node.js + Express + Prisma + PostgreSQL
- **Frontend**: React + Vite + Tailwind CSS (Elstar Template)
- **Docker**: Entorno completo containerizado

### 🎉 **LOGRO ALCANZADO: CRUD PERSONAS 100% FUNCIONAL**

**FUNCIONALIDADES OPERATIVAS:**
- ✅ **CREAR**: Formulario completo con validación en `/personas/new`
- ✅ **LISTAR**: DataTable con filtros y paginación en `/personas`
- ✅ **EDITAR**: Formulario pre-poblado con validación en `/personas/edit/:id`
- ✅ **ELIMINAR**: Confirmación y eliminación exitosa
- ✅ **NAVEGACIÓN**: Rutas y sidebar completamente integrados
- ✅ **VALIDACIÓN**: Zod funcionando en tiempo real
- ✅ **ANIMACIONES**: Framer Motion en todas las vistas
- ✅ **ROLES MÚLTIPLES**: Visualización correcta con Tags únicos

### 🚀 **NUEVO LOGRO: CRUD PRODUCTOS IMPLEMENTADO**

**FUNCIONALIDADES IMPLEMENTADAS:**
- ✅ **CREAR**: Formulario con validación en `/productos/new`
- ✅ **LISTAR**: DataTable con filtros y paginación en `/productos`
- ✅ **EDITAR**: Formulario pre-poblado con validación en `/productos/edit/:id`
- ✅ **ELIMINAR**: Confirmación y eliminación
- ✅ **NAVEGACIÓN**: Rutas y sidebar integrados
- ✅ **VALIDACIÓN**: Zod para nombre, precio y proveedorId
- ✅ **RELACIONES**: Select de proveedores funcionando
- ✅ **ANIMACIONES**: Framer Motion en todas las vistas

**ESTRUCTURA PRODUCTOS:**
```
frontend/src/
├── modules/producto/
│   ├── types.ts                   # Tipos de dominio
│   ├── service.ts                 # API calls
│   └── hooks/useProducto.ts       # Hook principal
├── views/productos/
│   ├── schemas.ts                 # Validación Zod
│   ├── types.ts                   # Re-exports + UI types
│   ├── ProductoList/ProductoList.tsx
│   ├── ProductoForm/ProductoForm.tsx
│   ├── ProductoNew/ProductoNew.tsx
│   ├── ProductoEdit/ProductoEdit.tsx
│   ├── ProductosView.tsx          # Vista principal
│   └── index.tsx                  # Exports
```

**RUTAS CONFIGURADAS:**
- `/productos` -> ProductosView (lista)
- `/productos/new` -> ProductoNew
- `/productos/edit/:id` -> ProductoEdit

### Arquitectura implementada (CRÍTICO)

Hemos implementado una **arquitectura híbrida** que separa lógica de negocio de lógica de UI:

```
frontend/src/
├── modules/                           # LÓGICA DE NEGOCIO
│   └── persona/
│       ├── types.ts                   # Tipos de dominio (Persona, DTOs)
│       ├── service.ts                 # Llamadas a API (usando ApiService.fetchData)
│       └── hooks/
│           └── usePersona.ts          # Hook principal con lógica de negocio
├── views/                             # LÓGICA DE UI
│   └── personas/
│       ├── types.ts                   # Re-exports + tipos específicos de UI
│       ├── hooks/
│       │   └── index.ts               # Hooks específicos de UI (filtros, etc.)
│       ├── PersonaList/
│       │   ├── index.tsx              # Export limpio
│       │   └── PersonaList.tsx        # Componente principal
│       ├── PersonaForm/
│       │   ├── index.tsx              # Export limpio
│       │   └── PersonaForm.tsx        # Componente principal
│       └── index.tsx                  # Vista principal que orquesta todo
```

### Principios fundamentales
1. **modules/**: Lógica de negocio, tipos de dominio, servicios API, hooks reutilizables
2. **views/**: Componentes UI, estados de vista, interacciones específicas
3. **Separación clara**: Dominio vs UI para reutilización y mantenimiento
4. **Escalabilidad**: Replicar estructura para cada módulo

### Convenciones establecidas
- Cada vista tiene su carpeta en `views/`
- Cada componente principal: subcarpeta con `index.tsx` + `ComponentName.tsx`
- Tipos se re-exportan desde módulo principal
- Hooks de UI específicos de vista
- Hooks de negocio centralizados en `modules/`
- API calls usan `ApiService.fetchData({ url, method, data })`

### Estado completado
- ✅ **Personas CRUD**: **COMPLETAMENTE FUNCIONAL** - Crear, Listar, Editar, Eliminar
- ✅ **Login y navegación**: Operativo
- ✅ **Sidebar**: Configurado con rutas ERP
- ✅ **DataTable**: Integrado con componentes UI del template
- ✅ **Framer Motion**: Instalado y configurado en módulo Personas
- ✅ **React Hook Form + Zod**: Implementado en PersonaNew y PersonaEdit
- ✅ **Validación con enums locales**: Problema @prisma/client resuelto
- ✅ **Estructura escalable**: Lista para replicar en otros módulos
- ✅ **Edición funcional**: PersonaEdit implementado y funcionando
- ✅ **Roles múltiples**: Visualización corregida con keys únicas
- ✅ **Navegación completa**: Rutas `/personas`, `/personas/new`, `/personas/edit/:id`
- ✅ **Backend integrado**: API endpoints funcionando correctamente

### Detalles de implementación Personas (EJEMPLO COMPLETO)

#### **Archivos clave creados/modificados:**
```
modules/persona/
├── types.ts                    # ✅ Corregido: usa enums de schemas.ts
├── service.ts                  # ✅ Usa ApiService.fetchData
└── hooks/usePersona.ts         # ✅ Lógica de negocio centralizada

views/personas/
├── schemas.ts                  # ✅ Enums locales + validación Zod
├── types.ts                    # ✅ Re-exports + tipos UI
├── hooks/index.ts              # ✅ Hooks UI específicos
├── PersonaList/
│   ├── index.tsx               # ✅ Export limpio
│   └── PersonaList.tsx         # ✅ DataTable con animaciones
├── PersonaForm/
│   ├── index.tsx               # ✅ Export limpio
│   └── PersonaForm.tsx         # ✅ Formulario base reutilizable
├── PersonaNew/
│   ├── index.tsx               # ✅ Export limpio
│   └── PersonaNew.tsx          # ✅ React Hook Form + Zod + Framer Motion
├── PersonaEdit/
│   ├── index.tsx               # ✅ Export limpio
│   └── PersonaEdit.tsx         # ✅ React Hook Form + Zod + Framer Motion
└── index.tsx                   # ✅ Vista principal orquestadora
```

#### **Navegación configurada:**
- `configs/routes.config.tsx`: Rutas /personas, /personas/new
- `configs/navigation.config/index.ts`: Menú sidebar
- `configs/navigation-icon.config.tsx`: Iconos nav
- `locales/lang/es.json`: Traducciones

#### **Componentes UI utilizados:**
- `DataTable`: Listado con filtros y paginación
- `Badge`: Estados y tipos de persona
- `Tag`: Roles de usuario
- `Tooltip`: Información adicional
- `Button`: Acciones CRUD
- `Dialog`: Confirmaciones
- `Drawer`: Formularios laterales (opcional)

#### **Microinteracciones implementadas:**
- Animaciones de entrada/salida con Framer Motion
- Hover effects en botones y filas
- Transiciones suaves entre estados
- Loading states animados

### Próximos pasos
- Aplicar misma estructura a productos y presupuestos
- Agregar más microinteracciones con Framer Motion
- Documentar ejemplos de uso de formularios empresariales
- Optimizar performance de formularios complejos

### Patrones establecidos para replicar

#### **1. Estructura de archivos obligatoria:**
```
views/[modulo]/
├── schemas.ts                  # CRÍTICO: Enums locales + Zod
├── types.ts                    # Re-exports desde modules/
├── hooks/index.ts              # Hooks UI específicos
├── [Modulo]List/
├── [Modulo]Form/
├── [Modulo]New/
└── index.tsx
```

#### **2. Patrón de validación:**
```typescript
// schemas.ts - EJEMPLO
export enum TipoProducto {
  PRODUCTO = 'PRODUCTO',
  SERVICIO = 'SERVICIO'
}

export const productoSchema = z.object({
  nombre: z.string().min(2, 'Mínimo 2 caracteres'),
  tipo: z.nativeEnum(TipoProducto),
  precio: z.number().positive('Debe ser positivo')
});
```

#### **3. Patrón de service:**
```typescript
// service.ts - EJEMPLO
export async function fetchProductos(): Promise<Producto[]> {
  const response = await ApiService.fetchData<Producto[]>({ 
    url: '/productos', 
    method: 'GET' 
  });
  return response.data;
}
```

#### **4. Patrón de componente con animaciones:**
```typescript
// Componente.tsx - EJEMPLO
import { motion } from 'framer-motion';

const ProductoList = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <DataTable />
    </motion.div>
  );
};
```

## 🎓 **LECCIONES APRENDIDAS - PERSONAS CRUD**

### Errores que NO se deben repetir:
1. **❌ Loop infinito en useEffect**: No incluir funciones como dependencias
2. **❌ Keys duplicadas**: Siempre usar índices únicos en map()
3. **❌ @prisma/client en frontend**: Crear enums locales siempre
4. **❌ Dependencias inestables**: Usar useCallback para funciones del hook
5. **❌ Formularios sin validación**: Siempre implementar Zod

### Soluciones que SÍ funcionan:
1. **✅ useEffect simple**: Solo dependencias primitivas (id, string, number)
2. **✅ Keys únicas**: `${id}-${item}-${index}` para arrays
3. **✅ Enums locales**: Copiar valores exactos de Prisma en schemas.ts
4. **✅ ApiService.fetchData**: Patrón consistente para todas las llamadas
5. **✅ React Hook Form + Zod**: Combinación perfecta para formularios

### Flujo de trabajo exitoso:
1. **Backend primero**: Verificar que endpoints funcionan
2. **Tipos y validación**: Crear schemas.ts y types.ts
3. **Service layer**: Implementar con fetchData
4. **Hook de negocio**: useModulo en modules/
5. **Componentes UI**: Crear views/ con estructura estándar
6. **Navegación**: Configurar rutas y sidebar
7. **Testing**: Probar CRUD completo antes de continuar

### Comandos de verificación:
```bash
# Verificar estructura de archivos
ls -la frontend/src/views/personas/
ls -la frontend/src/modules/persona/

# Verificar rutas configuradas
grep -r "personas" frontend/src/configs/

# Verificar que no hay imports de @prisma/client
grep -r "@prisma/client" frontend/src/views/
```

---

### TROUBLESHOOTING - Errores comunes y soluciones

#### **❌ ERROR: "Failed to resolve import @prisma/client"**
**Causa**: Intentar importar tipos de Prisma en el frontend

**Solución**:
```typescript
// ❌ MAL - No hacer esto
import { TipoPersona } from '@prisma/client';

// ✅ BIEN - Crear enums locales
export enum TipoPersona {
  CLIENTE = 'CLIENTE',
  PROVEEDOR = 'PROVEEDOR',
  INTERNO = 'INTERNO'
}
```

#### **❌ ERROR: "Property 'get' does not exist on type ApiService"**
**Causa**: Usar métodos HTTP directos en lugar de fetchData

**Solución**:
```typescript
// ❌ MAL
const response = await ApiService.get('/personas');

// ✅ BIEN
const response = await ApiService.fetchData({ 
  url: '/personas', 
  method: 'GET' 
});
```

#### **❌ ERROR: "Cannot find module 'zod'"**
**Causa**: Dependencia no instalada

**Solución**:
```bash
# Instalar dependencias
./manage.sh frontend npm install zod react-hook-form framer-motion
```

#### **❌ ERROR: Rutas no funcionan**
**Causa**: Configuración incompleta de navegación

**Solución**: Verificar estos archivos:
- `configs/routes.config.tsx`
- `configs/navigation.config/index.ts`
- `configs/navigation-icon.config.tsx`
- `locales/lang/es.json`

#### **❌ ERROR: Componentes UI no encontrados**
**Causa**: Imports incorrectos del template

**Solución**: Usar index.ts centralizado:
```typescript
// ✅ BIEN
import { DataTable, Badge, Tag } from '@/components/ui';
```

### Comandos útiles para desarrollo

```bash
# Instalar dependencias frontend
./manage.sh frontend npm install

# Iniciar desarrollo frontend
./manage.sh frontend npm run dev

# Ver errores en tiempo real
docker-compose logs -f frontend

# Reiniciar frontend sin perder datos
docker-compose restart frontend

# Verificar estado de contenedores
docker ps -a
```

### Checklist para nuevos módulos

#### **Antes de empezar:**
- [ ] Revisar backend: ¿existe el controller y service?
- [ ] Verificar modelo Prisma: ¿está definido?
- [ ] Confirmar endpoints API: ¿están funcionando?

#### **Durante desarrollo:**
- [ ] Crear `schemas.ts` con enums locales
- [ ] Actualizar `service.ts` para usar fetchData
- [ ] Implementar estructura de carpetas
- [ ] Configurar navegación y rutas
- [ ] Integrar componentes UI del template
- [ ] Agregar animaciones con Framer Motion

#### **Después de completar:**
- [ ] Probar CRUD completo
- [ ] Verificar validaciones
- [ ] Testear navegación
- [ ] Documentar cambios

### Recursos y referencias

- **Template Elstar**: https://elstar.themenate.net/app
- **Framer Motion**: https://www.framer.com/motion/
- **React Hook Form**: https://react-hook-form.com/
- **Zod**: https://zod.dev/
- **Tailwind CSS**: https://tailwindcss.com/

### IMPORTANTE
- SIEMPRE mantener la arquitectura híbrida modules/ + views/
- NO duplicar lógica de negocio en views/
- USAR ApiService.fetchData para llamadas API
- MANTENER tipos centralizados en modules/ con re-exports en views/
- NUNCA importar @prisma/client en frontend
- DOCUMENTAR cualquier cambio en esta arquitectura
