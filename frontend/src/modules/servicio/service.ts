import ApiService from '@/services/ApiService';
import { Servicio, CreateServicioDTO, UpdateServicioDTO } from './types';

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
    data
  });
  return response.data;
}

export async function updateServicio(id: number, data: UpdateServicioDTO): Promise<Servicio> {
  const response = await ApiService.fetchData<Servicio>({
    url: `/servicios/${id}`,
    method: 'PUT',
    data
  });
  return response.data;
}

export async function deleteServicio(id: number): Promise<void> {
  await ApiService.fetchData<void>({
    url: `/servicios/${id}`,
    method: 'DELETE'
  });
}
