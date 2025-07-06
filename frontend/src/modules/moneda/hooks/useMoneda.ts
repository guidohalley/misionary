import { useState, useEffect, useCallback } from 'react';
import { Notification, toast } from '@/components/ui';
import { MonedaService } from '../service';
import type { 
  Moneda, 
  TipoCambio, 
  ConversionRequest, 
  ConversionResponse,
  TipoCambioRequest,
  CodigoMoneda 
} from '../types';

export const useMoneda = () => {
  const [monedas, setMonedas] = useState<Moneda[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar monedas iniciales
  const fetchMonedas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await MonedaService.fetchMonedas();
      setMonedas(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar monedas';
      setError(message);
      console.error('Error fetching monedas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar monedas al montar el hook
  useEffect(() => {
    fetchMonedas();
  }, [fetchMonedas]);

  const getMonedaByCode = useCallback((codigo: CodigoMoneda): Moneda | undefined => {
    return monedas.find(m => m.codigo === codigo);
  }, [monedas]);

  const getMonedaById = useCallback((id: number): Moneda | undefined => {
    return monedas.find(m => m.id === id);
  }, [monedas]);

  return {
    monedas,
    loading,
    error,
    fetchMonedas,
    getMonedaByCode,
    getMonedaById,
    refreshMonedas: fetchMonedas
  };
};

export const useTipoCambio = () => {
  const [tiposCambio, setTiposCambio] = useState<TipoCambio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTipoCambioActual = useCallback(async (
    monedaDesde: CodigoMoneda, 
    monedaHacia: CodigoMoneda
  ): Promise<TipoCambio | null> => {
    try {
      setLoading(true);
      setError(null);
      const tipoCambio = await MonedaService.fetchTipoCambioActual(monedaDesde, monedaHacia);
      return tipoCambio;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al obtener tipo de cambio';
      setError(message);
      console.error('Error fetching tipo de cambio:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHistorial = useCallback(async (
    monedaDesde: CodigoMoneda,
    monedaHacia: CodigoMoneda,
    fechaDesde?: string,
    fechaHasta?: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      const historial = await MonedaService.fetchHistorialTipoCambio(
        monedaDesde, 
        monedaHacia, 
        fechaDesde, 
        fechaHasta
      );
      setTiposCambio(historial);
      return historial;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar historial';
      setError(message);
      console.error('Error fetching historial:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const upsertTipoCambio = useCallback(async (data: TipoCambioRequest): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await MonedaService.upsertTipoCambio(data);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar tipo de cambio';
      setError(message);
      console.error('Error updating tipo de cambio:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    tiposCambio,
    loading,
    error,
    fetchTipoCambioActual,
    fetchHistorial,
    upsertTipoCambio,
    refreshTiposCambio: fetchHistorial
  };
};

export const useConversion = () => {
  const [ultimaConversion, setUltimaConversion] = useState<ConversionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const convertirMoneda = useCallback(async (data: ConversionRequest): Promise<ConversionResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      const resultado = await MonedaService.convertirMoneda(data);
      setUltimaConversion(resultado);
      return resultado;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al convertir moneda';
      setError(message);
      console.error('Error converting moneda:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const limpiarConversion = useCallback(() => {
    setUltimaConversion(null);
    setError(null);
  }, []);

  return {
    ultimaConversion,
    loading,
    error,
    convertirMoneda,
    limpiarConversion
  };
};
