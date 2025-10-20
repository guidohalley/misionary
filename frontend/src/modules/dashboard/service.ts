import ApiService from '@/services/ApiService'
import type { FacturaDTO, PresupuestoDTO, GastoResumenCategoriaDTO, GastoDTO, PersonaDTO, EmpresaDTO } from './types'

export async function fetchFacturas(params?: Record<string, string>): Promise<FacturaDTO[]> {
  const qs = params ? new URLSearchParams(params).toString() : ''
  const query = qs ? `?${qs}` : ''
  const res = await ApiService.fetchData<FacturaDTO[]>({ url: `/facturas${query}`, method: 'GET' })
  return res.data
}

export async function fetchPresupuestos(params?: Record<string, string>): Promise<PresupuestoDTO[]> {
  const qs = params ? new URLSearchParams(params).toString() : ''
  const query = qs ? `?${qs}` : ''
  const res = await ApiService.fetchData<PresupuestoDTO[]>({ url: `/presupuestos${query}`, method: 'GET' })
  return res.data
}

export async function fetchGastos(params?: Record<string, string> & { incluirProyecciones?: boolean }): Promise<GastoDTO[]> {
  const { incluirProyecciones, ...otherParams } = params || {};
  
  const queryParams: Record<string, string> = { ...otherParams };
  if (incluirProyecciones) {
    queryParams.incluirProyecciones = 'true';
  }
  
  const qs = Object.keys(queryParams).length > 0 ? new URLSearchParams(queryParams).toString() : '';
  const query = qs ? `?${qs}` : '';
  const res = await ApiService.fetchData<{ success?: boolean, data: GastoDTO[] }>({ url: `/gastos-operativos${query}`, method: 'GET' })
  return (res.data as any)?.data || (res.data as unknown as GastoDTO[])
}

export async function fetchGastosResumen(params?: Record<string, string>) {
  const qs = params ? new URLSearchParams(params).toString() : ''
  const query = qs ? `?${qs}` : ''
  const res = await ApiService.fetchData<{ success?: boolean, data: GastoResumenCategoriaDTO[] }>({ url: `/gastos-operativos/resumen${query}`, method: 'GET' })
  return (res.data as any)?.data || (res.data as unknown as GastoResumenCategoriaDTO[])
}

export async function fetchClientes(): Promise<PersonaDTO[]> {
  // Backend expone /api/personas con filtro por tipo
  const res = await ApiService.fetchData<PersonaDTO[]>({ url: `/personas?tipo=CLIENTE`, method: 'GET' })
  return res.data
}

export async function fetchEmpresas(): Promise<EmpresaDTO[]> {
  const res = await ApiService.fetchData<EmpresaDTO[]>({ url: `/empresas`, method: 'GET' })
  return res.data
}

export async function fetchKpisMensuales(params?: { desde?: string; hasta?: string }) {
  const qs = params ? new URLSearchParams(params as any).toString() : ''
  const query = qs ? `?${qs}` : ''
  const res = await ApiService.fetchData<{ success: boolean; data: any }>({ url: `/finanzas/kpis-mensuales${query}`, method: 'GET' })
  return (res.data as any)?.data || (res.data as unknown as any)
}

export async function fetchCobrosPeriodo(params?: { desde?: string; hasta?: string }) {
  const qs = params ? new URLSearchParams(params as any).toString() : ''
  const query = qs ? `?${qs}` : ''
  const res = await ApiService.fetchData<{ success: boolean; data: any }>({ url: `/finanzas/cobros${query}`, method: 'GET' })
  return (res.data as any)?.data || (res.data as unknown as any)
}

export async function crearCobroClienteApi(payload: { presupuestoId: number; monto: number; fecha: string; metodoPago: string; concepto?: string; monedaId?: number }) {
  const res = await ApiService.fetchData<{ success: boolean; data: any }>({ url: `/finanzas/cobros-cliente`, method: 'POST', data: payload })
  return (res.data as any)?.data
}

export async function listarCobrosClienteApi(params?: { presupuestoId?: number; desde?: string; hasta?: string }) {
  const qs = params ? new URLSearchParams(params as any).toString() : ''
  const query = qs ? `?${qs}` : ''
  const res = await ApiService.fetchData<{ success: boolean; data: any[] }>({ url: `/finanzas/cobros-cliente${query}`, method: 'GET' })
  return (res.data as any)?.data || []
}
