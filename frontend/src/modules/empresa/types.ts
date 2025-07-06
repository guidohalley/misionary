export interface Empresa {
  id: number;
  nombre: string;
  razonSocial?: string;
  cuit?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  clienteId: number;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
  cliente?: {
    id: number;
    nombre: string;
    email: string;
  };
}

export interface EmpresaFormData {
  nombre: string;
  razonSocial?: string;
  cuit?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  clienteId: number;
  activo: boolean;
}

export interface EmpresaFilters {
  nombre?: string;
  clienteId?: number;
  activo?: boolean;
}
