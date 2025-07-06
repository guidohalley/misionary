import { useState, useEffect, useCallback } from 'react';
import ApiService from '@/services/ApiService';

export interface Moneda {
  id: number;
  codigo: string;
  nombre: string;
  simbolo: string;
  activo: boolean;
}

// Hook para gestión de monedas - Siguiendo patrón exitoso de gastos
export const useMonedas = () => {
  const [monedas, setMonedas] = useState<Moneda[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMonedas = useCallback(async (): Promise<Moneda[]> => {
    try {
      setLoading(true);
      setError(null);
      
      // Usar formato de respuesta con wrapper (como gastos y monedas)
      const response = await ApiService.fetchData<{ data: Moneda[]; success: boolean; message: string }>({
        url: '/monedas',
        method: 'GET'
      });

      const monedasData = response.data?.data || [];
      setMonedas(monedasData);
      return monedasData;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al obtener monedas';
      setError(message);
      console.error('Error fetching monedas:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-cargar monedas al montar el hook
  useEffect(() => {
    fetchMonedas();
  }, [fetchMonedas]);

  // Funciones de utilidad
  const getMonedaById = useCallback((id: number): Moneda | undefined => {
    return monedas.find(moneda => moneda.id === id);
  }, [monedas]);

  const getMonedasActivas = useCallback((): Moneda[] => {
    return monedas.filter(moneda => moneda.activo);
  }, [monedas]);

  // Convertir a opciones para Select (patrón del template)
  const opcionesMonedas = monedas.map(moneda => ({
    value: moneda.id,
    label: `${moneda.codigo} - ${moneda.nombre}`
  }));

  const opcionesMonedasActivas = getMonedasActivas().map(moneda => ({
    value: moneda.id,
    label: `${moneda.codigo} - ${moneda.nombre}`
  }));

  return {
    monedas,
    loading,
    error,
    fetchMonedas,
    getMonedaById,
    getMonedasActivas,
    opcionesMonedas,
    opcionesMonedasActivas
  };
};
