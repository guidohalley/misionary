import ApiService from '@/services/ApiService';
import { Presupuesto, CreatePresupuestoDTO, UpdatePresupuestoDTO } from './types';
import { EstadoPresupuesto } from '../../views/presupuestos/schemas';

export async function fetchPresupuestos(params?: {
  clienteId?: number;
  estado?: EstadoPresupuesto;
}): Promise<Presupuesto[]> {
  const queryParams = new URLSearchParams();
  if (params?.clienteId) queryParams.append('clienteId', params.clienteId.toString());
  if (params?.estado) queryParams.append('estado', params.estado);
  
  const url = `/presupuestos${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await ApiService.fetchData<Presupuesto[]>({ url, method: 'GET' });
  return response.data;
}

export async function fetchPresupuestoById(id: number): Promise<Presupuesto> {
  const response = await ApiService.fetchData<Presupuesto>({ 
    url: `/presupuestos/${id}`, 
    method: 'GET' 
  });
  return response.data;
}

export async function createPresupuesto(data: CreatePresupuestoDTO): Promise<Presupuesto> {
  const response = await ApiService.fetchData<Presupuesto>({ 
    url: '/presupuestos', 
    method: 'POST', 
    data 
  });
  return response.data;
}

export async function updatePresupuesto(
  id: number,
  data: UpdatePresupuestoDTO
): Promise<Presupuesto> {
  const response = await ApiService.fetchData<Presupuesto>({ 
    url: `/presupuestos/${id}`, 
    method: 'PUT', 
    data 
  });
  return response.data;
}

export async function deletePresupuesto(id: number): Promise<void> {
  await ApiService.fetchData({ 
    url: `/presupuestos/${id}`, 
    method: 'DELETE' 
  });
}

export async function updateEstadoPresupuesto(
  id: number,
  estado: EstadoPresupuesto
): Promise<Presupuesto> {
  const response = await ApiService.fetchData<Presupuesto>({ 
    url: `/presupuestos/${id}/estado`, 
    method: 'PATCH', 
    data: { estado } 
  });
  return response.data;
}
