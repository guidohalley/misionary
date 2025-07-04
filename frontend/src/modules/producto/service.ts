import ApiService from '@/services/ApiService';
import { Producto, CreateProductoDTO, UpdateProductoDTO } from './types';

export async function fetchProductos(): Promise<Producto[]> {
  const response = await ApiService.fetchData<Producto[]>({
    url: '/productos',
    method: 'GET'
  });
  return response.data;
}

export async function fetchProductoById(id: number): Promise<Producto> {
  const response = await ApiService.fetchData<Producto>({
    url: `/productos/${id}`,
    method: 'GET'
  });
  return response.data;
}

export async function createProducto(data: CreateProductoDTO): Promise<Producto> {
  const response = await ApiService.fetchData<Producto>({
    url: '/productos',
    method: 'POST',
    data
  });
  return response.data;
}

export async function updateProducto(id: number, data: UpdateProductoDTO): Promise<Producto> {
  const response = await ApiService.fetchData<Producto>({
    url: `/productos/${id}`,
    method: 'PUT',
    data
  });
  return response.data;
}

export async function deleteProducto(id: number): Promise<void> {
  await ApiService.fetchData<void>({
    url: `/productos/${id}`,
    method: 'DELETE'
  });
}

export async function fetchProductosByProveedor(proveedorId: number): Promise<Producto[]> {
  const response = await ApiService.fetchData<Producto[]>({
    url: `/productos?proveedorId=${proveedorId}`,
    method: 'GET'
  });
  return response.data;
}
