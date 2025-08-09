import { useEffect, useMemo, useState } from 'react'
import { fetchFacturas, fetchGastos, fetchGastosResumen, fetchPresupuestos } from './service'
import type { FacturaDTO, PresupuestoDTO, GastoDTO, GastoResumenCategoriaDTO } from './types'

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

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const [f, p, g] = await Promise.all([
          fetchFacturas({ fechaDesde: isoDaysAgo(30) }),
          fetchPresupuestos({}),
          fetchGastos({ fechaDesde: isoDaysAgo(30) }),
        ])
        setFacturas(f)
        setPresupuestos(p)
        setGastos(g)
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

  const gastosMesPorMoneda = useMemo(() => {
    const acc: Record<string, number> = {}
    for (const g of gastos) {
      const codigo = g.moneda?.codigo || '—'
      acc[codigo] = (acc[codigo] || 0) + Number(g.monto || 0)
    }
    return acc
  }, [gastos])

  return { loading, error, ingresosPorMoneda, pipeline, gastosMesPorMoneda }
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
