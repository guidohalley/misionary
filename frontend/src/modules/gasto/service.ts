import ApiService from '@/services/ApiService';
import { 
  GastoOperativo, 
  AsignacionGastoProyecto,
  CreateGastoOperativoDTO,
  UpdateGastoOperativoDTO,
  CreateAsignacionGastoDTO,
  GastoOperativoFilters,
  AsignacionGastoFilters,
  AnalisisRentabilidad,
  Moneda,
  Persona
} from './types';
import type { Presupuesto as PresupuestoFull } from '@/modules/presupuesto/types'

// ================================
// GASTOS OPERATIVOS
// ================================

export async function fetchGastosOperativos(filters?: GastoOperativoFilters): Promise<GastoOperativo[]> {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (value instanceof Date) {
          params.append(key, value.toISOString().split('T')[0]);
        } else {
          params.append(key, value.toString());
        }
      }
    });
  }

  const url = params.toString() ? `/gastos-operativos?${params.toString()}` : '/gastos-operativos';
  
  const response = await ApiService.fetchData<{success: boolean, data: GastoOperativo[], message: string}>({
    url,
    method: 'GET'
  });
  // La API devuelve { success, data, message }
  return response.data.data;
}

export async function fetchGastoOperativoById(id: number): Promise<GastoOperativo> {
  const response = await ApiService.fetchData<GastoOperativo>({
    url: `/gastos-operativos/${id}`,
    method: 'GET'
  });
  // Para un objeto individual, la API lo devuelve directamente
  return response.data;
}

export async function createGastoOperativo(data: CreateGastoOperativoDTO): Promise<GastoOperativo> {
  const response = await ApiService.fetchData<GastoOperativo>({
    url: '/gastos-operativos',
    method: 'POST',
    data
  });
  // Para un objeto individual, la API lo devuelve directamente
  return response.data;
}

export async function updateGastoOperativo(id: number, data: UpdateGastoOperativoDTO): Promise<GastoOperativo> {
  const response = await ApiService.fetchData<GastoOperativo>({
    url: `/gastos-operativos/${id}`,
    method: 'PUT',
    data
  });
  // Para un objeto individual, la API lo devuelve directamente
  return response.data;
}

export async function deleteGastoOperativo(id: number): Promise<void> {
  await ApiService.fetchData<void>({
    url: `/gastos-operativos/${id}`,
    method: 'DELETE'
  });
}

// ================================
// ASIGNACIONES DE GASTOS
// ================================

export async function fetchAsignacionesGasto(filters?: AsignacionGastoFilters): Promise<AsignacionGastoProyecto[]> {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (value instanceof Date) {
          params.append(key, value.toISOString().split('T')[0]);
        } else {
          params.append(key, value.toString());
        }
      }
    });
  }

  const url = params.toString() ? `/asignaciones-gasto?${params.toString()}` : '/asignaciones-gasto';
  
  const response = await ApiService.fetchData<AsignacionGastoProyecto[]>({
    url,
    method: 'GET'
  });
  return response.data;
}

export async function createAsignacionGasto(data: CreateAsignacionGastoDTO): Promise<AsignacionGastoProyecto> {
  const response = await ApiService.fetchData<AsignacionGastoProyecto>({
    url: '/asignaciones-gasto',
    method: 'POST',
    data
  });
  return response.data;
}

export async function updateAsignacionGasto(id: number, data: Partial<CreateAsignacionGastoDTO>): Promise<AsignacionGastoProyecto> {
  const response = await ApiService.fetchData<AsignacionGastoProyecto>({
    url: `/asignaciones-gasto/${id}`,
    method: 'PUT',
    data
  });
  return response.data;
}

export async function deleteAsignacionGasto(id: number): Promise<void> {
  await ApiService.fetchData<void>({
    url: `/asignaciones-gasto/${id}`,
    method: 'DELETE'
  });
}

// ================================
// ANÁLISIS DE RENTABILIDAD
// ================================

export async function fetchAnalisisRentabilidad(presupuestoId?: number): Promise<AnalisisRentabilidad[]> {
  const url = presupuestoId 
    ? `/gastos-operativos/rentabilidad/${presupuestoId}`
    : '/gastos-operativos/rentabilidad';
  
  const response = await ApiService.fetchData<AnalisisRentabilidad[]>({
    url,
    method: 'GET'
  });
  return response.data;
}

export async function fetchRentabilidadPorFecha(fechaDesde: Date, fechaHasta: Date): Promise<AnalisisRentabilidad[]> {
  const params = new URLSearchParams({
    fechaDesde: fechaDesde.toISOString().split('T')[0],
    fechaHasta: fechaHasta.toISOString().split('T')[0]
  });

  const response = await ApiService.fetchData<AnalisisRentabilidad[]>({
    url: `/gastos-operativos/rentabilidad?${params.toString()}`,
    method: 'GET'
  });
  return response.data;
}

// ================================
// DATOS AUXILIARES
// ================================

export async function fetchMonedas(): Promise<Moneda[]> {
  const response = await ApiService.fetchData<{success: boolean, data: Moneda[], message: string}>({
    url: '/monedas',
    method: 'GET'
  });
  // La API devuelve { success, data, message }
  return response.data.data;
}

export async function fetchProveedores(): Promise<Persona[]> {
  const response = await ApiService.fetchData<Persona[]>({
    url: '/personas?tipo=PROVEEDOR',
    method: 'GET'
  });
  // La API de personas devuelve directamente un array
  return response.data;
}

export async function fetchPresupuestosActivos(): Promise<PresupuestoFull[]> {
  const response = await ApiService.fetchData<PresupuestoFull[]>({
    url: '/presupuestos',
    method: 'GET'
  });
  return response.data as any
}
