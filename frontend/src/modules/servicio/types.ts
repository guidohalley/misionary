// Tipos que coinciden con el backend/prisma
export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  proveedorId: number;
  proveedor?: {
    id: number;
    nombre: string;
    email: string;
    tipo: string;
  };
  createdAt: string;
  updatedAt: string;
}

// DTOs para requests
export interface CreateServicioDTO {
  nombre: string;
  descripcion: string;
  precio: number;
  proveedorId: number;
}

export interface UpdateServicioDTO extends Partial<CreateServicioDTO> {}
