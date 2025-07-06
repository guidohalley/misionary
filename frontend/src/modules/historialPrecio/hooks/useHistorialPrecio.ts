import { useState, useCallback } from 'react';
import { HistorialPrecioService } from '../service';
import type { 
  HistorialPrecio,
  ActualizarPrecioRequest,
  ActualizacionMasivaRequest,
  ActualizacionMasivaResponse,
  PrecioDesactualizado,
  EstadisticasCambios,
  HistorialPrecioFilters,
  PreciosDesactualizadosFilters,
  EstadisticasFilters,
  TipoItem
} from '../types';

// Hook principal para gestión de historial de precios
export const useHistorialPrecio = () => {
  const [historial, setHistorial] = useState<HistorialPrecio[]>([]);
  const [precioActual, setPrecioActual] = useState<HistorialPrecio | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistorialProducto = useCallback(async (
    productoId: number,
    filtros?: HistorialPrecioFilters
  ): Promise<HistorialPrecio[]> => {
    try {
      setLoading(true);
      setError(null);
      const data = await HistorialPrecioService.fetchHistorialProducto(productoId, filtros);
      setHistorial(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al obtener historial de producto';
      setError(message);
      console.error('Error fetching historial producto:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHistorialServicio = useCallback(async (
    servicioId: number,
    filtros?: HistorialPrecioFilters
  ): Promise<HistorialPrecio[]> => {
    try {
      setLoading(true);
      setError(null);
      const data = await HistorialPrecioService.fetchHistorialServicio(servicioId, filtros);
      setHistorial(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al obtener historial de servicio';
      setError(message);
      console.error('Error fetching historial servicio:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPrecioActualProducto = useCallback(async (
    productoId: number,
    monedaId: number
  ): Promise<HistorialPrecio | null> => {
    try {
      setLoading(true);
      setError(null);
      const data = await HistorialPrecioService.fetchPrecioActualProducto(productoId, monedaId);
      setPrecioActual(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al obtener precio actual del producto';
      setError(message);
      console.error('Error fetching precio actual producto:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPrecioActualServicio = useCallback(async (
    servicioId: number,
    monedaId: number
  ): Promise<HistorialPrecio | null> => {
    try {
      setLoading(true);
      setError(null);
      const data = await HistorialPrecioService.fetchPrecioActualServicio(servicioId, monedaId);
      setPrecioActual(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al obtener precio actual del servicio';
      setError(message);
      console.error('Error fetching precio actual servicio:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const actualizarPrecioProducto = useCallback(async (
    productoId: number,
    data: ActualizarPrecioRequest
  ): Promise<HistorialPrecio | null> => {
    try {
      setLoading(true);
      setError(null);
      const resultado = await HistorialPrecioService.actualizarPrecioProducto(productoId, data);
      // Actualizar estados locales
      setPrecioActual(resultado);
      setHistorial(prev => [resultado, ...prev]);
      return resultado;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar precio del producto';
      setError(message);
      console.error('Error updating precio producto:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const actualizarPrecioServicio = useCallback(async (
    servicioId: number,
    data: ActualizarPrecioRequest
  ): Promise<HistorialPrecio | null> => {
    try {
      setLoading(true);
      setError(null);
      const resultado = await HistorialPrecioService.actualizarPrecioServicio(servicioId, data);
      // Actualizar estados locales
      setPrecioActual(resultado);
      setHistorial(prev => [resultado, ...prev]);
      return resultado;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar precio del servicio';
      setError(message);
      console.error('Error updating precio servicio:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const limpiarEstados = useCallback(() => {
    setHistorial([]);
    setPrecioActual(null);
    setError(null);
  }, []);

  return {
    historial,
    precioActual,
    loading,
    error,
    fetchHistorialProducto,
    fetchHistorialServicio,
    fetchPrecioActualProducto,
    fetchPrecioActualServicio,
    actualizarPrecioProducto,
    actualizarPrecioServicio,
    limpiarEstados
  };
};

// Hook para actualización masiva de precios
export const useActualizacionMasiva = () => {
  const [resultado, setResultado] = useState<ActualizacionMasivaResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ejecutarActualizacionMasiva = useCallback(async (
    data: ActualizacionMasivaRequest
  ): Promise<ActualizacionMasivaResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await HistorialPrecioService.actualizacionMasiva(data);
      setResultado(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error en actualización masiva';
      setError(message);
      console.error('Error en actualización masiva:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const limpiarResultado = useCallback(() => {
    setResultado(null);
    setError(null);
  }, []);

  return {
    resultado,
    loading,
    error,
    ejecutarActualizacionMasiva,
    limpiarResultado
  };
};

// Hook para precios desactualizados
export const usePreciosDesactualizados = () => {
  const [preciosDesactualizados, setPreciosDesactualizados] = useState<PrecioDesactualizado[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPreciosDesactualizados = useCallback(async (
    filtros?: PreciosDesactualizadosFilters
  ): Promise<PrecioDesactualizado[]> => {
    try {
      setLoading(true);
      setError(null);
      const data = await HistorialPrecioService.fetchPreciosDesactualizados(filtros);
      setPreciosDesactualizados(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al obtener precios desactualizados';
      setError(message);
      console.error('Error fetching precios desactualizados:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const refrescarDatos = useCallback(async (filtros?: PreciosDesactualizadosFilters) => {
    await fetchPreciosDesactualizados(filtros);
  }, [fetchPreciosDesactualizados]);

  return {
    preciosDesactualizados,
    loading,
    error,
    fetchPreciosDesactualizados,
    refrescarDatos
  };
};

// Hook para estadísticas de cambios
export const useEstadisticasCambios = () => {
  const [estadisticas, setEstadisticas] = useState<EstadisticasCambios | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEstadisticas = useCallback(async (
    filtros: EstadisticasFilters
  ): Promise<EstadisticasCambios | null> => {
    try {
      setLoading(true);
      setError(null);
      const data = await HistorialPrecioService.fetchEstadisticasCambios(filtros);
      setEstadisticas(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al obtener estadísticas';
      setError(message);
      console.error('Error fetching estadísticas:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const limpiarEstadisticas = useCallback(() => {
    setEstadisticas(null);
    setError(null);
  }, []);

  return {
    estadisticas,
    loading,
    error,
    fetchEstadisticas,
    limpiarEstadisticas
  };
};

// Hook combinado para utilidades de precios
export const usePrecioUtils = () => {
  const formatearPrecio = useCallback((precio: string | number, simboloMoneda: string): string => {
    return HistorialPrecioService.formatearPrecio(precio, simboloMoneda);
  }, []);

  const calcularDiasDesdeActualizacion = useCallback((fechaActualizacion: string): number => {
    return HistorialPrecioService.calcularDiasDesdeActualizacion(fechaActualizacion);
  }, []);

  const formatearMotivoCambio = useCallback((motivo?: string): string => {
    return HistorialPrecioService.formatearMotivoCambio(motivo);
  }, []);

  const getColorAlertaPrecio = useCallback((diasSinActualizar: number) => {
    return HistorialPrecioService.getColorAlertaPrecio(diasSinActualizar);
  }, []);

  const validarPorcentajeAumento = useCallback((porcentaje: number): boolean => {
    return HistorialPrecioService.validarPorcentajeAumento(porcentaje);
  }, []);

  const calcularNuevoPrecio = useCallback((precioActual: number, porcentaje: number): number => {
    return HistorialPrecioService.calcularNuevoPrecio(precioActual, porcentaje);
  }, []);

  return {
    formatearPrecio,
    calcularDiasDesdeActualizacion,
    formatearMotivoCambio,
    getColorAlertaPrecio,
    validarPorcentajeAumento,
    calcularNuevoPrecio
  };
};
