// Enums locales (NO usar @prisma/client en frontend)
export enum TipoItem {
  PRODUCTO = 'PRODUCTO',
  SERVICIO = 'SERVICIO'
}

export enum MotivoComun {
  INFLACION = 'Inflación',
  DEVALUACION = 'Devaluación',
  ACTUALIZACION_COSTOS = 'Actualización por costos',
  PROMOCION = 'Promoción',
  AJUSTE_COMPETENCIA = 'Ajuste por competencia',
  REVISION_ANUAL = 'Revisión anual',
  OTROS = 'Otros'
}

// Tipos de dominio
export interface HistorialPrecio {
  id: number;
  productoId?: number;
  servicioId?: number;
  monedaId: number;
  precio: string; // Decimal como string
  fechaDesde: string; // ISO date string
  fechaHasta?: string; // ISO date string
  motivoCambio?: string;
  usuarioId?: number;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
  // Relaciones incluidas
  producto?: {
    id: number;
    nombre: string;
  };
  servicio?: {
    id: number;
    nombre: string;
    descripcion: string;
  };
  moneda: {
    id: number;
    codigo: string;
    nombre: string;
    simbolo: string;
  };
  usuario?: {
    id: number;
    nombre: string;
    email: string;
  };
}

// DTOs para API
export interface ActualizarPrecioRequest {
  monedaId: number;
  precio: number;
  motivoCambio: string;
}

export interface ActualizacionMasivaRequest {
  tipo: TipoItem;
  monedaId: number;
  porcentajeAumento: number;
  motivoCambio: string;
  filtros?: {
    proveedorId?: number;
    ids?: number[];
  };
}

export interface ActualizacionMasivaResponse {
  actualizados: number;
  errores: string[];
}

export interface PrecioDesactualizado {
  tipo: string;
  id: number;
  nombre: string;
  ultimaActualizacion: string; // ISO date string
  diasSinActualizar: number;
}

export interface EstadisticasCambios {
  totalCambios: number;
  cambiosPorMotivo: Record<string, number>;
  promedioAumentoPorcentaje: number;
  cambiosPorDia: Array<{
    fecha: string;
    cantidad: number;
  }>;
}

// Respuestas de API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  errors?: any[];
}

// Tipos para filtros y queries
export interface HistorialPrecioFilters {
  monedaId?: number;
  fechaDesde?: string;
  fechaHasta?: string;
  limit?: number;
}

export interface PreciosDesactualizadosFilters {
  diasLimite?: number;
  monedaId?: number;
}

export interface EstadisticasFilters {
  fechaDesde: string;
  fechaHasta: string;
  monedaId?: number;
}
