import { Persona } from '../persona/types';

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  proveedorId: number;
  proveedor: Persona;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductoDTO {
  nombre: string;
  precio: number;
  proveedorId: number;
}

export interface UpdateProductoDTO {
  nombre?: string;
  precio?: number;
  proveedorId?: number;
}
