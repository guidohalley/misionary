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
  costoProveedor: number;
  margenAgencia: number;
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
  costoProveedor: number;
  margenAgencia: number;
  precio?: number; // Opcional, se calculará automáticamente
  proveedorId: number;
  monedaId?: number; // Opcional, por defecto será ARS
}

export interface UpdateProductoDTO {
  nombre?: string;
  costoProveedor?: number;
  margenAgencia?: number;
  precio?: number;
  proveedorId?: number;
  monedaId?: number;
}
