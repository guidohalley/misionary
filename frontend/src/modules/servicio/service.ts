import ApiService from '@/services/ApiService';
import { Servicio, CreateServicioDTO, UpdateServicioDTO, Moneda } from './types';

export async function fetchServicios(): Promise<Servicio[]> {
  const response = await ApiService.fetchData<Servicio[]>({
    url: '/servicios',
    method: 'GET'
  });
  return response.data;
}

export async function fetchServiciosByProveedor(proveedorId: number): Promise<Servicio[]> {
  const response = await ApiService.fetchData<Servicio[]>({
    url: `/servicios?proveedorId=${proveedorId}`,
    method: 'GET'
  });
  return response.data;
}

export async function fetchServicioById(id: number): Promise<Servicio> {
  const response = await ApiService.fetchData<Servicio>({
    url: `/servicios/${id}`,
    method: 'GET'
  });
  return response.data;
}

export async function createServicio(data: CreateServicioDTO): Promise<Servicio> {
  const response = await ApiService.fetchData<Servicio>({
    url: '/servicios',
    method: 'POST',
    data: data as unknown as Record<string, unknown>
  });
  return response.data;
}

export async function updateServicio(id: number, data: UpdateServicioDTO): Promise<Servicio> {
  const response = await ApiService.fetchData<Servicio>({
    url: `/servicios/${id}`,
    method: 'PUT',
    data: data as unknown as Record<string, unknown>
  });
  return response.data;
}

export async function deleteServicio(id: number): Promise<void> {
  await ApiService.fetchData<void>({
    url: `/servicios/${id}`,
    method: 'DELETE'
  });
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
