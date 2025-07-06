// Re-export de tipos del módulo principal
export type {
  HistorialPrecio,
  ActualizarPrecioRequest,
  ActualizacionMasivaRequest,
  ActualizacionMasivaResponse,
  PrecioDesactualizado,
  EstadisticasCambios,
  ApiResponse,
  HistorialPrecioFilters,
  PreciosDesactualizadosFilters,
  EstadisticasFilters
} from '@/modules/historialPrecio/types';

// Re-export de schemas
export * from './schemas';

// Importaciones necesarias para usar en tipos
import type { HistorialPrecio, PrecioDesactualizado, EstadisticasCambios } from '@/modules/historialPrecio/types';

// Tipos específicos para la vista de historial de precios
export interface HistorialPrecioViewState {
  historialVisible: HistorialPrecio[];
  filtros: {
    monedaId?: number;
    fechaDesde?: string;
    fechaHasta?: string;
    limit?: number;
  };
  loading: boolean;
  error: string | null;
}

export interface ActualizacionMasivaViewState {
  modalVisible: boolean;
  procesando: boolean;
  resultado: {
    actualizados: number;
    errores: string[];
  } | null;
}

export interface PreciosDesactualizadosViewState {
  items: PrecioDesactualizado[];
  filtros: {
    diasLimite: number;
    monedaId?: number;
  };
  loading: boolean;
  seleccionados: number[];
}

export interface EstadisticasViewState {
  datos: EstadisticasCambios | null;
  periodo: {
    fechaDesde: string;
    fechaHasta: string;
    monedaId?: number;
  };
  loading: boolean;
}

// Tipos para componentes específicos
export interface HistorialPrecioListProps {
  historial: HistorialPrecio[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onFiltrar?: (filtros: any) => void;
}

export interface ActualizarPrecioFormProps {
  tipoItem: 'PRODUCTO' | 'SERVICIO';
  itemId: number;
  itemNombre: string;
  precioActual?: string;
  monedaActual?: {
    id: number;
    codigo: string;
    simbolo: string;
  };
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export interface ActualizacionMasivaFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export interface PreciosDesactualizadosListProps {
  items: PrecioDesactualizado[];
  loading: boolean;
  onSeleccionar?: (ids: number[]) => void;
  onActualizarMasivo?: (ids: number[]) => void;
  onActualizarIndividual?: (id: number, tipo: string) => void;
}

export interface EstadisticasChartProps {
  datos: EstadisticasCambios;
  tipo: 'cambios-por-motivo' | 'cambios-por-dia' | 'resumen';
}

export interface AlertaPrecioProps {
  diasSinActualizar: number;
  className?: string;
}

// Tipos para acciones
export interface HistorialPrecioActions {
  onVerDetalle: (historial: HistorialPrecio) => void;
  onActualizarPrecio: (tipoItem: 'PRODUCTO' | 'SERVICIO', itemId: number) => void;
  onVerHistorialCompleto: (tipoItem: 'PRODUCTO' | 'SERVICIO', itemId: number) => void;
  onExportarDatos: (filtros: any) => void;
}

// Options para selects específicos de la vista
export const periodoPredefinidoOptions = [
  { value: 'ultima-semana', label: 'Última semana' },
  { value: 'ultimo-mes', label: 'Último mes' },
  { value: 'ultimo-trimestre', label: 'Último trimestre' },
  { value: 'ultimo-semestre', label: 'Último semestre' },
  { value: 'ultimo-año', label: 'Último año' },
  { value: 'personalizado', label: 'Período personalizado' }
];

export const tipoGraficoOptions = [
  { value: 'cambios-por-motivo', label: 'Cambios por motivo' },
  { value: 'cambios-por-dia', label: 'Cambios por día' },
  { value: 'resumen', label: 'Resumen general' }
];

// Utilidades para la vista
export interface ViewHelpers {
  formatearFecha: (fecha: string) => string;
  formatearPorcentaje: (valor: number) => string;
  obtenerColorPorMotivo: (motivo: string) => string;
  calcularPeriodoPredefinido: (tipo: string) => { fechaDesde: string; fechaHasta: string };
}
