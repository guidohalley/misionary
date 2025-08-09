import ApiService from '@/services/ApiService'
import type { FacturaDTO, PresupuestoDTO, GastoResumenCategoriaDTO, GastoDTO } from './types'

export async function fetchFacturas(params?: Record<string, string>): Promise<FacturaDTO[]> {
  const query = params ? '?' + new URLSearchParams(params).toString() : ''
  const res = await ApiService.fetchData<FacturaDTO[]>({ url: `/facturas${query}`, method: 'GET' })
  return res.data
}

export async function fetchPresupuestos(params?: Record<string, string>): Promise<PresupuestoDTO[]> {
  const query = params ? '?' + new URLSearchParams(params).toString() : ''
  const res = await ApiService.fetchData<PresupuestoDTO[]>({ url: `/presupuestos${query}`, method: 'GET' })
  return res.data
}

export async function fetchGastos(params?: Record<string, string>): Promise<GastoDTO[]> {
  const query = params ? '?' + new URLSearchParams(params).toString() : ''
  const res = await ApiService.fetchData<{ success?: boolean, data: GastoDTO[] }>({ url: `/gastos-operativos${query}`, method: 'GET' })
  return (res.data as any)?.data || (res.data as unknown as GastoDTO[])
}

export async function fetchGastosResumen(params?: Record<string, string>) {
  const query = params ? '?' + new URLSearchParams(params).toString() : ''
  const res = await ApiService.fetchData<{ success?: boolean, data: GastoResumenCategoriaDTO[] }>({ url: `/gastos-operativos/resumen${query}`, method: 'GET' })
  return (res.data as any)?.data || (res.data as unknown as GastoResumenCategoriaDTO[])
}
