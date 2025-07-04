import ApiService from '@/services/ApiService';
import type { Impuesto, CreateImpuestoDTO, UpdateImpuestoDTO } from './types';

export const fetchImpuestos = async (): Promise<Impuesto[]> => {
  const response = await ApiService.fetchData<Impuesto[]>({
    url: '/impuestos',
    method: 'GET'
  });
  return response.data;
};

export const fetchImpuestoById = async (id: number): Promise<Impuesto> => {
  const response = await ApiService.fetchData<Impuesto>({
    url: `/impuestos/${id}`,
    method: 'GET'
  });
  return response.data;
};

export const createImpuesto = async (data: CreateImpuestoDTO): Promise<Impuesto> => {
  const response = await ApiService.fetchData<Impuesto>({
    url: '/impuestos',
    method: 'POST',
    data
  });
  return response.data;
};

export const updateImpuesto = async (id: number, data: UpdateImpuestoDTO): Promise<Impuesto> => {
  const response = await ApiService.fetchData<Impuesto>({
    url: `/impuestos/${id}`,
    method: 'PUT',
    data
  });
  return response.data;
};

export const deleteImpuesto = async (id: number): Promise<void> => {
  await ApiService.fetchData({
    url: `/impuestos/${id}`,
    method: 'DELETE'
  });
};

export const toggleImpuesto = async (id: number): Promise<Impuesto> => {
  const response = await ApiService.fetchData<Impuesto>({
    url: `/impuestos/${id}/toggle`,
    method: 'PATCH'
  });
  return response.data;
};

export const fetchActiveImpuestos = async (): Promise<Impuesto[]> => {
  const impuestos = await fetchImpuestos();
  return impuestos.filter((impuesto: Impuesto) => impuesto.activo);
};
