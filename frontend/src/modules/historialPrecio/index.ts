// Re-exports principales del módulo historialPrecio
export * from './types';
export * from './service';
export * from './hooks/useHistorialPrecio';
export * from './hooks/useMonedas';
export * from './hooks/useProductosServicios';

// Exports nombrados para facilitar importación
export { HistorialPrecioService } from './service';
export { 
  useHistorialPrecio,
  useActualizacionMasiva,
  usePreciosDesactualizados,
  useEstadisticasCambios,
  usePrecioUtils
} from './hooks/useHistorialPrecio';

export { useMonedas } from './hooks/useMonedas';
export { useProductos, useServicios } from './hooks/useProductosServicios';
