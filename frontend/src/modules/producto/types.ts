import { Persona } from '../persona/types';

// Tipo local para Moneda (sin dependencia de @prisma/client)
export interface Moneda {
  id: number;
  codigo: string;
  nombre: string;
  simbolo: string;
  activo: boolean;
}

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  proveedorId: number;
  proveedor: Persona;
  monedaId: number;
  moneda: Moneda;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductoDTO {
  nombre: string;
  precio: number;
  proveedorId: number;
  monedaId: number;
}

export interface UpdateProductoDTO {
  nombre?: string;
  precio?: number;
  proveedorId?: number;
  monedaId?: number;
}
