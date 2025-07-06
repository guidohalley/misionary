import { Persona } from '../persona/types';

// Tipo local para Moneda (sin dependencia de @prisma/client)
export interface Moneda {
  id: number;
  codigo: string;
  nombre: string;
  simbolo: string;
  activo: boolean;
}

// Tipos que coinciden con el backend/prisma
export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
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

// DTOs para requests
export interface CreateServicioDTO {
  nombre: string;
  descripcion: string;
  costoProveedor: number;
  margenAgencia: number;
  precio?: number; // Opcional, se calculará automáticamente
  proveedorId: number;
  monedaId?: number; // Opcional, por defecto será ARS
}

export interface UpdateServicioDTO {
  nombre?: string;
  descripcion?: string;
  costoProveedor?: number;
  margenAgencia?: number;
  precio?: number;
  proveedorId?: number;
  monedaId?: number;
}
