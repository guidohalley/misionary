import { useEffect, useMemo, useState } from 'react'
import { fetchFacturas, fetchGastos, fetchGastosResumen, fetchPresupuestos, fetchClientes, fetchEmpresas } from './service'
import type { FacturaDTO, PresupuestoDTO, GastoDTO, GastoResumenCategoriaDTO, PersonaDTO } from './types'
import { useAppSelector } from '@/store'

function isoDaysAgo(days: number) {
  const d = new Date()
  d.setDate(d.getDate() - days)
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

  const currentUser = useAppSelector(s => s.auth.user)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const [f, p, g, c, e] = await Promise.all([
          fetchFacturas({ fechaDesde: isoDaysAgo(30) }),
          fetchPresupuestos({}),
          fetchGastos({ fechaDesde: isoDaysAgo(30) }),
          fetchClientes(),
          fetchEmpresas(),
        ])
        setFacturas(f)
        setPresupuestos(p)
        setGastos(g)
        setClientes(c)
        setEmpresasCount(e.length)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error cargando KPIs')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

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

  const totalGastos = useMemo(() => gastos.reduce((sum, g) => sum + Number(g.monto || 0), 0), [gastos])

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
    return roles?.includes('PROVEEDOR')
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

  return { loading, error, ingresosPorMoneda, pipeline, clientesActivosCount, totalGastos, clientes, empresasCount, gananciaProveedor30d, tieneRolProveedor }
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
