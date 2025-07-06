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
  cliente: {
    id: number;
    nombre: string;
    email: string;
    telefono?: string;
  };
  _count?: {
    presupuestos: number;
    facturas: number;
  };
  presupuestos?: Array<{
    id: number;
    total: number;
    estado: string;
    createdAt: string;
  }>;
  facturas?: Array<{
    id: number;
    numero: string;
    total: number;
    estado: string;
    fecha: string;
  }>;
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
  search?: string;
  clienteId?: number;
  activo?: boolean;
}

// Request/Response types
export interface CreateEmpresaRequest {
  nombre: string;
  razonSocial?: string;
  cuit?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  clienteId: number;
}

export interface UpdateEmpresaRequest extends Partial<CreateEmpresaRequest> {
  activo?: boolean;
}

export interface EmpresaResponse {
  success: boolean;
  data: Empresa[];
  message: string;
}

export interface SingleEmpresaResponse {
  success: boolean;
  data: Empresa;
  message: string;
}
