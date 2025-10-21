import { useEffect, useMemo, useState } from 'react'
import { fetchFacturas, fetchGastos, fetchGastosResumen, fetchPresupuestos, fetchClientes, fetchEmpresas, fetchKpisMensuales, fetchCobrosPeriodo } from './service'
import { listarRecibos } from '@/services/reciboService'
import type { FacturaDTO, PresupuestoDTO, GastoDTO, GastoResumenCategoriaDTO, PersonaDTO } from './types'
import { useAppSelector } from '@/store'

function isoDaysAgo(days: number) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

type PeriodoPreset = '30D' | 'MES' | 'TRIMESTRE'

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0)
}

function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999)
}

function toIso(d: Date) {
  return d.toISOString()
}

export function useDashboardKpis() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [facturas, setFacturas] = useState<FacturaDTO[]>([])
  const [presupuestos, setPresupuestos] = useState<PresupuestoDTO[]>([])
  const [gastos, setGastos] = useState<GastoDTO[]>([])
  const [clientes, setClientes] = useState<PersonaDTO[]>([])
  const [empresasCount, setEmpresasCount] = useState<number>(0)
  const [recibosProveedor, setRecibosProveedor] = useState<any[]>([])
  const [kpisAdminMes, setKpisAdminMes] = useState<any | null>(null)
  const [cobrosPeriodo, setCobrosPeriodo] = useState<any | null>(null)
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState<PeriodoPreset>('MES')
  const [rangoFechas, setRangoFechas] = useState<{ desde?: string; hasta?: string; label?: string }>({})

  const currentUser = useAppSelector(s => s.auth.user)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Determinar rol del usuario
        const roles: any[] = (currentUser?.authority || []) as any
        const isAdmin = roles?.includes('ADMIN')
        
        // Para admin: cargar gastos del mes actual por defecto
        // Para otros: cargar últimos 30 días
        let gastosDesde: string
        let gastosHasta: string | undefined
        
        if (isAdmin) {
          const now = new Date()
          gastosDesde = toIso(startOfMonth(now))
          gastosHasta = toIso(endOfMonth(now))
        } else {
          gastosDesde = isoDaysAgo(30)
          gastosHasta = undefined
        }
        
        const [f, p, g, c, e] = await Promise.all([
          fetchFacturas({ fechaDesde: isoDaysAgo(30) }),
          fetchPresupuestos({}),
          fetchGastos({ 
            fechaDesde: gastosDesde, 
            ...(gastosHasta ? { fechaHasta: gastosHasta } : {}),
            incluirProyecciones: true 
          }),
          fetchClientes(),
          fetchEmpresas(),
        ])
        setFacturas(f)
        setPresupuestos(p)
        setGastos(g)
        setClientes(c)
        setEmpresasCount(e.length)
        
        // Si es proveedor, traemos sus recibos (pagos) para mostrar últimos ingresos
        const ls = localStorage.getItem('auth_user')
        let proveedorIdFromLs: number | undefined
        try {
          const parsed = ls ? JSON.parse(ls) : null
          proveedorIdFromLs = parsed?.id as number | undefined
        } catch {}
        const isProveedor = roles?.includes('PROVEEDOR')
        if (isProveedor && proveedorIdFromLs) {
          try {
            const r = await listarRecibos(proveedorIdFromLs)
            setRecibosProveedor(Array.isArray(r) ? r : [])
          } catch (e) {
            // No bloqueamos el dashboard por un error secundario
            console.warn('No se pudieron cargar recibos del proveedor', e)
          }
        } else {
          setRecibosProveedor([])
        }
        
        // Si es ADMIN, obtener KPIs del mes actual por defecto
        if (isAdmin) {
          try {
            // Mes actual por defecto
            const now = new Date()
            const desde = startOfMonth(now)
            const hasta = endOfMonth(now)
            const k = await fetchKpisMensuales({ desde: toIso(desde), hasta: toIso(hasta) })
            setKpisAdminMes(k)
            setPeriodoSeleccionado('MES')
            setRangoFechas({ desde: toIso(desde), hasta: toIso(hasta), label: formatRangeLabel(desde, hasta) })
            // Cobrado / Por cobrar del período (para primera card)
            const c = await fetchCobrosPeriodo({ desde: toIso(desde), hasta: toIso(hasta) })
            setCobrosPeriodo(c)
          } catch (e) {
            console.warn('No se pudieron cargar KPIs mensuales', e)
          }
        } else {
          setKpisAdminMes(null)
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error cargando KPIs')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  function formatRangeLabel(desde: Date, hasta: Date) {
    const fmt = (d: Date) => d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    return `${fmt(desde)} – ${fmt(hasta)}`
  }

  async function seleccionarPeriodo(preset: PeriodoPreset) {
    try {
      setPeriodoSeleccionado(preset)
      const ahora = new Date()
      let desde: Date
      let hasta: Date
      if (preset === '30D') {
        desde = new Date()
        desde.setDate(desde.getDate() - 30)
        desde.setHours(0, 0, 0, 0)
        hasta = new Date()
        hasta.setHours(23, 59, 59, 999)
      } else if (preset === 'TRIMESTRE') {
        // Desde el primer día del mes de hace 2 meses hasta fin de mes actual
        const d = new Date(ahora.getFullYear(), ahora.getMonth() - 2, 1)
        desde = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0)
        hasta = endOfMonth(ahora)
      } else {
        // MES
        desde = startOfMonth(ahora)
        hasta = endOfMonth(ahora)
      }
      setRangoFechas({ desde: toIso(desde), hasta: toIso(hasta), label: formatRangeLabel(desde, hasta) })
      // Cargar KPIs para el rango
      const roles: any[] = (currentUser?.authority || []) as any
      const isAdmin = roles?.includes('ADMIN')
      if (isAdmin) {
        const [k, c, g] = await Promise.all([
          fetchKpisMensuales({ desde: toIso(desde), hasta: toIso(hasta) }),
          fetchCobrosPeriodo({ desde: toIso(desde), hasta: toIso(hasta) }),
          fetchGastos({ fechaDesde: toIso(desde), fechaHasta: toIso(hasta), incluirProyecciones: true }),
        ])
        setKpisAdminMes(k)
        setCobrosPeriodo(c)
        setGastos(g)
      } else {
        setCobrosPeriodo(null)
      }
    } catch (e) {
      console.warn('No se pudieron actualizar KPIs para el período', e)
    }
  }

  const ingresosPorMoneda = useMemo(() => {
    // Backend de facturas incluye presupuesto pero no siempre moneda; agrupamos en "TOTAL" si no hay moneda
    const acc: Record<string, { total: number }> = {}
    for (const f of facturas) {
      const key = 'TOTAL'
      acc[key] = acc[key] || { total: 0 }
      acc[key].total += Number(f.total || 0)
    }
    return acc
  }, [facturas])

  const pipeline = useMemo(() => {
    const acc: Record<string, number> = {}
    for (const p of presupuestos) {
      const est = (p.estado || 'DESCONOCIDO').toString()
      acc[est] = (acc[est] || 0) + 1
    }
    return acc
  }, [presupuestos])

  const clientesActivosCount = useMemo(() => clientes.filter(c => c.activo).length, [clientes])

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

  // Ganancia del proveedor (si el usuario actual tiene rol PROVEEDOR):
  // Sumamos por factura: (precioUnitario - costoProveedor) * cantidad de items donde el proveedor coincide
  const proveedorId = useMemo(() => {
    // Nota: no tenemos id del usuario en el slice, pero AuthService guarda user en localStorage; sin embargo, el slice user no expone id.
    // Intentamos inferir desde localStorage si no está en Redux.
    const ls = localStorage.getItem('auth_user')
    try {
      const parsed = ls ? JSON.parse(ls) : null
      return parsed?.id as number | undefined
    } catch {
      return undefined
    }
  }, [])

  const tieneRolProveedor = useMemo(() => {
    const roles: any[] = (currentUser?.authority || []) as any
    if (roles?.includes('PROVEEDOR')) return true
    // Fallback por si el slice no trae roles de proveedor: usamos tipo del usuario almacenado
    try {
      const uStr = localStorage.getItem('auth_user')
      const u = uStr ? JSON.parse(uStr) : null
      return (u?.tipo || '').toUpperCase() === 'PROVEEDOR'
    } catch {
      return false
    }
  }, [currentUser])

  const gananciaProveedor30d = useMemo(() => {
    if (!tieneRolProveedor || !proveedorId) return 0
    let total = 0
    for (const f of facturas) {
      for (const it of f.presupuesto?.items || []) {
        if (it.producto && it.producto.proveedorId === proveedorId) {
          total += (Number(it.precioUnitario) - Number(it.producto.costoProveedor)) * Number(it.cantidad)
        }
        if (it.servicio && it.servicio.proveedorId === proveedorId) {
          total += (Number(it.precioUnitario) - Number(it.servicio.costoProveedor)) * Number(it.cantidad)
        }
      }
    }
    return total
  }, [facturas, proveedorId, tieneRolProveedor])

  const recibosProveedor30d = useMemo(() => {
    if (!tieneRolProveedor) return [] as any[]
    const desde = new Date(isoDaysAgo(30)).getTime()
    return (recibosProveedor || [])
      .filter((r: any) => {
        const t = r?.fecha ? new Date(r.fecha).getTime() : 0
        return t >= desde
      })
      .sort((a: any, b: any) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
  }, [recibosProveedor, tieneRolProveedor])

  const ultimosIngresosProveedor30d = useMemo(() => {
    return recibosProveedor30d.reduce((acc: number, r: any) => acc + Number(r?.monto || 0), 0)
  }, [recibosProveedor30d])

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
}

export function useGastosPorCategoria() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resumen, setResumen] = useState<GastoResumenCategoriaDTO[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
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
