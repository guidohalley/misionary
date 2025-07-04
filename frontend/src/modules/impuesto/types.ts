export interface Impuesto {
  id: number;
  nombre: string;
  porcentaje: number;
  descripcion?: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    presupuestoImpuestos: number;
    facturas: number;
  };
}

export interface CreateImpuestoDTO {
  nombre: string;
  porcentaje: number;
  descripcion?: string;
  activo?: boolean;
}

export interface UpdateImpuestoDTO {
  nombre?: string;
  porcentaje?: number;
  descripcion?: string;
  activo?: boolean;
}
