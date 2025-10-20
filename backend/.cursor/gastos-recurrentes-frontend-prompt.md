# 🎯 PROMPT PARA IMPLEMENTAR PROYECCIÓN DE GASTOS RECURRENTES EN FRONTEND

## 📋 Contexto

Se ha implementado en el **backend** la funcionalidad de **proyección automática de gastos recurrentes**. Ahora los gastos que se marcan como recurrentes (mensual, trimestral, anual, etc.) se proyectan automáticamente en los períodos futuros cuando se solicitan al API.

### ✅ Cambios realizados en el backend:

1. **Nueva utilidad:** `/backend/src/utils/gastoRecurrente.ts`
   - Funciones para proyectar gastos según frecuencia (MENSUAL, TRIMESTRAL, SEMESTRAL, ANUAL, SEMANAL, QUINCENAL)
   - Combina gastos reales con proyecciones virtuales
   - Los gastos proyectados tienen la propiedad `esProyeccion: true`

2. **Nuevo método en servicio:** `getGastosOperativosConProyecciones()`
   - Ubicación: `/backend/src/services/gasto.service.ts`
   - Acepta el parámetro `incluirProyecciones: true`

3. **Controlador actualizado:** `/backend/src/controllers/gasto.controller.ts`
   - Endpoint: `GET /api/gastos-operativos?incluirProyecciones=true`
   - Acepta query param `incluirProyecciones` (boolean)

### 🔧 Cómo funciona el backend ahora:

**Endpoint sin proyecciones (comportamiento anterior):**
```
GET /api/gastos-operativos?fechaDesde=2025-01-01&fechaHasta=2025-12-31
```
→ Solo retorna gastos REALES dentro del rango de fechas

**Endpoint CON proyecciones (NUEVO):**
```
GET /api/gastos-operativos?fechaDesde=2025-01-01&fechaHasta=2025-12-31&incluirProyecciones=true
```
→ Retorna:
- Gastos reales dentro del rango
- Gastos proyectados de gastos recurrentes (con `esProyeccion: true`)

**Ejemplo de respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "concepto": "Alquiler oficina",
      "monto": 50000,
      "fecha": "2025-01-15T00:00:00.000Z",
      "esRecurrente": true,
      "frecuencia": "MENSUAL",
      "esProyeccion": false,  // ← Gasto REAL
      "moneda": { "codigo": "ARS", "simbolo": "$" },
      // ... resto de campos
    },
    {
      "id": 1,  // ← Mismo ID que el original
      "concepto": "Alquiler oficina",
      "monto": 50000,
      "fecha": "2025-02-15T00:00:00.000Z",  // ← Proyectado para febrero
      "esRecurrente": true,
      "frecuencia": "MENSUAL",
      "esProyeccion": true,  // ← PROYECCIÓN (no existe en BD)
      "gastoOrigenId": 1,
      "fechaOriginal": "2025-01-15T00:00:00.000Z",
      "moneda": { "codigo": "ARS", "simbolo": "$" },
      // ... resto de campos
    },
    {
      "id": 1,
      "concepto": "Alquiler oficina",
      "monto": 50000,
      "fecha": "2025-03-15T00:00:00.000Z",  // ← Proyectado para marzo
      "esProyeccion": true,
      // ... etc
    }
  ]
}
```

---

## 🎯 TAREA PARA EL FRONTEND

Actualizar el frontend para que:

1. **Use proyecciones en el dashboard** para mostrar gastos del mes incluyendo recurrentes
2. **Diferencie visualmente** entre gastos reales y proyectados
3. **Actualice los cálculos** de totales y KPIs para incluir proyecciones
4. **Permita filtrar** entre ver solo reales o incluir proyecciones

---

## 📝 IMPLEMENTACIÓN PASO A PASO

### 1. Actualizar el servicio de dashboard (`/frontend/src/modules/dashboard/service.ts`)

**Modificar `fetchGastos` para aceptar parámetro de proyecciones:**

```typescript
export async function fetchGastos(params?: Record<string, string> & { incluirProyecciones?: boolean }): Promise<GastoDTO[]> {
  const { incluirProyecciones, ...otherParams } = params || {};
  
  const queryParams: Record<string, string> = { ...otherParams };
  if (incluirProyecciones) {
    queryParams.incluirProyecciones = 'true';
  }
  
  const qs = Object.keys(queryParams).length > 0 ? new URLSearchParams(queryParams).toString() : '';
  const query = qs ? `?${qs}` : '';
  const res = await ApiService.fetchData<{ success?: boolean, data: GastoDTO[] }>({ url: `/gastos-operativos${query}`, method: 'GET' });
  return (res.data as any)?.data || (res.data as unknown as GastoDTO[]);
}
```

---

### 2. Actualizar tipos (`/frontend/src/modules/dashboard/types.ts`)

**Agregar tipo para gastos proyectados:**

```typescript
export interface GastoDTO {
  id: number;
  concepto: string;
  descripcion?: string;
  monto: number;
  monedaId: number;
  fecha: string;
  categoria: string;
  esRecurrente: boolean;
  frecuencia?: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
  // Nuevos campos para proyecciones
  esProyeccion?: boolean;
  gastoOrigenId?: number;
  fechaOriginal?: string;
  moneda?: {
    id: number;
    codigo: string;
    simbolo: string;
    nombre: string;
  };
  proveedor?: {
    id: number;
    nombre: string;
    email?: string;
    telefono?: string;
  };
}
```

---

### 3. Actualizar el hook del dashboard (`/frontend/src/modules/dashboard/hooks.ts`)

**Modificar `useDashboardKpis` para incluir proyecciones:**

```typescript
// En la línea 51, cambiar:
// fetchGastos({ fechaDesde: isoDaysAgo(30) }),

// Por:
fetchGastos({ fechaDesde: isoDaysAgo(30), incluirProyecciones: true }),
```

**Modificar el cálculo de `totalGastos` para diferenciar reales de proyectados:**

```typescript
// Reemplazar la línea 178:
// const totalGastos = useMemo(() => gastos.reduce((sum, g) => sum + Number(g.monto || 0), 0), [gastos])

// Por:
const totalGastos = useMemo(() => {
  const reales = gastos.filter(g => !g.esProyeccion).reduce((sum, g) => sum + Number(g.monto || 0), 0);
  const proyectados = gastos.filter(g => g.esProyeccion).reduce((sum, g) => sum + Number(g.monto || 0), 0);
  return reales + proyectados;
}, [gastos]);

const totalGastosReales = useMemo(() => 
  gastos.filter(g => !g.esProyeccion).reduce((sum, g) => sum + Number(g.monto || 0), 0), 
  [gastos]
);

const totalGastosProyectados = useMemo(() => 
  gastos.filter(g => g.esProyeccion).reduce((sum, g) => sum + Number(g.monto || 0), 0), 
  [gastos]
);
```

**Exportar los nuevos valores:**

```typescript
// En la línea 238, reemplazar el return por:
return { 
  loading, 
  error, 
  ingresosPorMoneda, 
  pipeline, 
  clientesActivosCount, 
  totalGastos, 
  totalGastosReales,
  totalGastosProyectados,
  clientes, 
  empresasCount, 
  gananciaProveedor30d, 
  tieneRolProveedor, 
  ultimosIngresosProveedor30d, 
  recibosProveedor30d, 
  kpisAdminMes, 
  periodoSeleccionado, 
  rangoFechas, 
  seleccionarPeriodo, 
  cobrosPeriodo 
}
```

---

### 4. Actualizar el componente Home (`/frontend/src/views/Home.tsx`)

**Usar los nuevos valores del hook:**

```typescript
// En la línea 9, agregar los nuevos valores:
const { 
  loading, 
  error, 
  ingresosPorMoneda, 
  clientesActivosCount, 
  totalGastos, 
  totalGastosReales,
  totalGastosProyectados,
  empresasCount, 
  gananciaProveedor30d, 
  tieneRolProveedor, 
  ultimosIngresosProveedor30d, 
  recibosProveedor30d, 
  kpisAdminMes, 
  periodoSeleccionado, 
  rangoFechas, 
  seleccionarPeriodo, 
  cobrosPeriodo 
} = useDashboardKpis()
```

**Actualizar el Card de gastos (líneas 176-191) para mostrar desglose:**

```tsx
<motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
  <Card className="p-4 sm:p-5 border-misionary-200/60 dark:border-gray-700/60 rounded-xl shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between gap-2">
      <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
        Gastos últimos 30 días
      </div>
      <Tooltip title="Suma de gastos operativos de los últimos 30 días, incluyendo proyecciones de gastos recurrentes.">
        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help shrink-0 p-1 -mt-1" aria-label="Información">
          <FiInfo />
        </button>
      </Tooltip>
    </div>
    <div className="mt-3 text-3xl sm:text-4xl font-extrabold text-rose-700 dark:text-rose-600">
      {loading ? '—' : Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(totalGastos)}
    </div>
    
    {/* Nuevo desglose */}
    {!loading && totalGastosProyectados > 0 && (
      <div className="mt-2 flex flex-col gap-1 text-xs">
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Reales:</span>
          <span className="font-semibold">
            {Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(totalGastosReales)}
          </span>
        </div>
        <div className="flex justify-between text-gray-500 dark:text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-300 dark:bg-rose-500"></span>
            Proyectados:
          </span>
          <span className="font-semibold">
            {Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(totalGastosProyectados)}
          </span>
        </div>
      </div>
    )}
    
    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
      {totalGastosProyectados > 0 
        ? 'Incluye gastos recurrentes proyectados' 
        : 'Suma de gastos operativos'}
    </div>
  </Card>
</motion.div>
```

---

### 5. Actualizar el hook de gastos por categoría (`useGastosPorCategoria`)

**Modificar para incluir proyecciones (línea 241-271 en hooks.ts):**

```typescript
export function useGastosPorCategoria() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resumen, setResumen] = useState<GastoResumenCategoriaDTO[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Nota: El endpoint de resumen no acepta incluirProyecciones aún
        // Si quieres proyecciones aquí, necesitas implementar lógica adicional
        // o usar fetchGastos con proyecciones y agrupar en el frontend
        
        const data = await fetchGastosResumen({})
        setResumen(data)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error cargando gastos por categoría')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const dataset = useMemo(() => {
    return resumen.map(r => ({
      categoria: r.categoria,
      total: Number(r._sum?.monto || 0),
      cantidad: Number(r._count?.id || 0),
    }))
  }, [resumen])

  return { loading, error, dataset }
}
```

---

### 6. OPCIONAL: Crear componente visual para distinguir gastos proyectados

**Crear badge para gastos proyectados:**

```tsx
// Donde se listen gastos (si tienes una tabla o lista), agregar:
{gasto.esProyeccion && (
  <Tag className="ml-2 text-xs bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300">
    Proyectado
  </Tag>
)}

// O un tooltip:
{gasto.esProyeccion && (
  <Tooltip title={`Proyección de gasto recurrente. Original: ${new Date(gasto.fechaOriginal).toLocaleDateString()}`}>
    <span className="text-xs text-rose-500">●</span>
  </Tooltip>
)}
```

---

### 7. Actualizar vista de lista de gastos (si existe)

**Si tienes una página de listado de gastos (`/frontend/src/views/GastosOperativos` o similar):**

1. Agregar toggle para activar/desactivar proyecciones
2. Agregar indicador visual (ícono o badge) para gastos proyectados
3. No permitir editar/eliminar gastos proyectados (son virtuales)

**Ejemplo de toggle:**

```tsx
const [incluirProyecciones, setIncluirProyecciones] = useState(true);

// En el fetch:
useEffect(() => {
  fetchGastos({ 
    fechaDesde: rangoDesde, 
    fechaHasta: rangoHasta,
    incluirProyecciones 
  });
}, [incluirProyecciones, rangoDesde, rangoHasta]);

// En el UI:
<div className="flex items-center gap-2">
  <input 
    type="checkbox" 
    checked={incluirProyecciones}
    onChange={(e) => setIncluirProyecciones(e.target.checked)}
    id="toggle-proyecciones"
  />
  <label htmlFor="toggle-proyecciones" className="text-sm">
    Incluir gastos recurrentes proyectados
  </label>
</div>
```

---

## 🎨 CONSIDERACIONES DE UX

1. **Diferenciar visualmente:**
   - Gastos reales: color normal
   - Gastos proyectados: color más claro o con badge "Proyectado"

2. **Tooltips informativos:**
   - Mostrar fecha original del gasto recurrente
   - Explicar que es una proyección automática

3. **No editar proyecciones:**
   - Las proyecciones no son editables (son virtuales)
   - Solo se puede editar el gasto original

4. **Mensajes claros:**
   - Indicar cuando los totales incluyen proyecciones
   - Mostrar desglose: Reales vs Proyectados

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

- [ ] Actualizar `fetchGastos` en `service.ts` para aceptar `incluirProyecciones`
- [ ] Agregar tipos `esProyeccion`, `gastoOrigenId`, `fechaOriginal` en `GastoDTO`
- [ ] Modificar `useDashboardKpis` para usar `incluirProyecciones: true`
- [ ] Calcular `totalGastosReales` y `totalGastosProyectados` en el hook
- [ ] Actualizar Card de gastos en `Home.tsx` con desglose
- [ ] Agregar indicadores visuales para gastos proyectados
- [ ] Actualizar tooltips con información de proyecciones
- [ ] (Opcional) Agregar toggle en vista de lista de gastos
- [ ] (Opcional) Prevenir edición de gastos proyectados
- [ ] Probar con diferentes frecuencias: MENSUAL, TRIMESTRAL, ANUAL

---

## 🧪 PRUEBAS RECOMENDADAS

1. **Crear un gasto recurrente mensual** de $10,000 con fecha 15/01/2025
2. **Verificar en el dashboard** que aparezca para:
   - Enero: como gasto real
   - Febrero: como proyección
   - Marzo: como proyección
3. **Verificar el total** incluye reales + proyectados
4. **Verificar el desglose** muestra correctamente cada tipo
5. **Cambiar la frecuencia** a TRIMESTRAL y verificar proyecciones cada 3 meses
6. **Desactivar el gasto original** (`activo: false`) y verificar que no se proyecte

---

## 📚 REFERENCIA RÁPIDA DEL BACKEND

**Endpoint:**
```
GET /api/gastos-operativos?incluirProyecciones=true&fechaDesde=YYYY-MM-DD&fechaHasta=YYYY-MM-DD
```

**Frecuencias soportadas:**
- `MENSUAL` → cada mes
- `TRIMESTRAL` → cada 3 meses
- `SEMESTRAL` → cada 6 meses
- `ANUAL` → cada año
- `SEMANAL` → cada 7 días
- `QUINCENAL` → cada 15 días

**Propiedades de gastos proyectados:**
```typescript
{
  esProyeccion: true,         // Indica que es una proyección
  gastoOrigenId: number,      // ID del gasto original
  fechaOriginal: Date,        // Fecha del gasto original
  id: number,                 // Mismo ID que el original
  fecha: Date,                // Fecha proyectada
  // ... resto de campos del gasto original
}
```

---

## 🚀 RESULTADO ESPERADO

Después de implementar estos cambios, el sistema:

✅ Mostrará gastos recurrentes proyectados automáticamente en los períodos correspondientes  
✅ Diferenciará visualmente entre gastos reales y proyectados  
✅ Calculará correctamente los totales incluyendo proyecciones  
✅ Permitirá a los usuarios ver el impacto futuro de gastos recurrentes  
✅ Solucionará el problema de "no veo gastos del mes" cuando se cargaron como recurrentes  

---

## 📞 NOTAS FINALES

- Los gastos proyectados **NO se guardan en la base de datos**, son calculados en tiempo real
- Solo los gastos marcados como `esRecurrente: true` y `activo: true` se proyectan
- Las proyecciones se generan hasta un máximo de 100 ocurrencias (límite de seguridad)
- Si el gasto original se elimina o desactiva, las proyecciones desaparecen automáticamente
- El endpoint sin `incluirProyecciones` sigue funcionando igual (compatibilidad hacia atrás)

---

**¡Buena suerte con la implementación! 🚀**

