// Tipos de dominio para gastos operativos
export interface GastoOperativo {
  id: number;
  concepto: string;
  descripcion?: string;
  monto: number;
  monedaId: number;
  fecha: Date;
  categoria: string;
  tipoId?: number;
  esRecurrente: boolean;
  frecuencia?: string;
  proveedorId?: number;
  comprobante?: string;
  observaciones?: string;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Relaciones
  moneda: Moneda;
  proveedor?: Persona;
  asignaciones: AsignacionGastoProyecto[];
  tipo?: TipoGasto;
}

export interface AsignacionGastoProyecto {
  id: number;
  gastoId: number;
  presupuestoId: number;
  porcentaje: number;
  montoAsignado: number;
  justificacion?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Relaciones
  gasto: GastoOperativo;
  presupuesto: Presupuesto;
}

export interface Moneda {
  id: number;
  codigo: string;
  nombre: string;
  simbolo: string;
  activo: boolean;
}

export interface Persona {
  id: number;
  nombre: string;
  email: string;
  tipo: string;
  activo: boolean;
}

export interface Presupuesto {
  id: number;
  clienteId: number;
  subtotal: number;
  impuestos: number;
  total: number;
  estado: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Relaciones
  cliente: Persona;
  moneda: Moneda;
}

// DTOs para API
export interface CreateGastoOperativoDTO extends Record<string, unknown> {
  concepto: string;
  descripcion?: string;
  monto: number;
  monedaId: number;
  fecha: Date;
  categoria: string;
  tipoId?: number;
  esRecurrente?: boolean;
  frecuencia?: string;
  proveedorId?: number;
  comprobante?: string;
  observaciones?: string;
}

export interface UpdateGastoOperativoDTO extends Partial<CreateGastoOperativoDTO> {
  activo?: boolean;
}

export interface CreateAsignacionGastoDTO extends Record<string, unknown> {
  gastoId: number;
  presupuestoId: number;
  porcentaje: number;
  justificacion?: string;
}

// Filtros para consultas
export interface GastoOperativoFilters {
  categoriaId?: number;
  proveedorId?: number;
  monedaId?: number;
  fechaDesde?: Date;
  fechaHasta?: Date;
  esRecurrente?: boolean;
  activo?: boolean;
  search?: string;
}

export interface AsignacionGastoFilters {
  gastoId?: number;
  presupuestoId?: number;
  fechaDesde?: Date;
  fechaHasta?: Date;
}

// Respuesta de análisis de rentabilidad
export interface AnalisisRentabilidad {
  presupuestoId: number;
  presupuesto: Presupuesto;
  ingresosBrutos: number;
  gastosAsignados: number;
  margenBruto: number;
  porcentajeMargen: number;
  moneda: Moneda;
  detalleGastos: DetalleGastoRentabilidad[];
}

export interface DetalleGastoRentabilidad {
  gastoId: number;
  gasto: GastoOperativo;
  porcentajeAsignado: number;
  montoAsignado: number;
  categoria: string;
}

// Respuesta de API estándar
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TipoGasto {
  id: number;
  nombre: string;
  slug: string;
  color?: string | null;
  descripcion?: string | null;
  activo: boolean;
}

export interface Categoria {
  id: number;
  nombre: string;
  activo: boolean;
}
