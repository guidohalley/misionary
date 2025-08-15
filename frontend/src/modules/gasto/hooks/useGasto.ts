import { useState, useEffect, useCallback } from 'react';
import { 
  GastoOperativo, 
  AsignacionGastoProyecto, 
  CreateGastoOperativoDTO, 
  UpdateGastoOperativoDTO,
  CreateAsignacionGastoDTO,
  GastoOperativoFilters,
  AnalisisRentabilidad,
  Moneda,
  Persona,
  Presupuesto
} from '../types';
import * as gastoService from '../service';

export function useGasto() {
  const [gastosOperativos, setGastosOperativos] = useState<GastoOperativo[]>([]);
  const [asignaciones, setAsignaciones] = useState<AsignacionGastoProyecto[]>([]);
  const [analisisRentabilidad, setAnalisisRentabilidad] = useState<AnalisisRentabilidad[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedGasto, setSelectedGasto] = useState<GastoOperativo | null>(null);

  // ================================
  // GASTOS OPERATIVOS
  // ================================

  const fetchGastosOperativos = useCallback(async (filters?: GastoOperativoFilters) => {
    try {
      setLoading(true);
      setError(null);
      const data = await gastoService.fetchGastosOperativos(filters);
      setGastosOperativos(data);
    } catch (err) {
      console.error('Error fetching gastos operativos:', err);
      setError('Error al cargar los gastos operativos');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchGastoById = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
  const gasto = await gastoService.fetchGastoOperativoById(id);
      setSelectedGasto(gasto);
      return gasto;
    } catch (err) {
      setError('Error al cargar el gasto');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createGastoOperativo = async (data: CreateGastoOperativoDTO) => {
    try {
      setLoading(true);
      setError(null);
  const newGasto = await gastoService.createGastoOperativo(data);
      setGastosOperativos(prev => [...prev, newGasto]);
      return newGasto;
    } catch (err) {
      setError('Error al crear el gasto operativo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateGastoOperativo = async (id: number, data: UpdateGastoOperativoDTO) => {
    try {
      setLoading(true);
      setError(null);
  const updatedGasto = await gastoService.updateGastoOperativo(id, data);
      setGastosOperativos(prev => prev.map(g => g.id === id ? updatedGasto : g));
      if (selectedGasto?.id === id) {
        setSelectedGasto(updatedGasto);
      }
      return updatedGasto;
    } catch (err) {
      setError('Error al actualizar el gasto operativo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteGastoOperativo = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await gastoService.deleteGastoOperativo(id);
      setGastosOperativos(prev => prev.filter(g => g.id !== id));
      if (selectedGasto?.id === id) {
        setSelectedGasto(null);
      }
    } catch (err) {
      setError('Error al eliminar el gasto operativo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // ASIGNACIONES DE GASTOS
  // ================================

  const fetchAsignacionesGasto = useCallback(async (filters?: any) => {
    try {
      setLoading(true);
      setError(null);
      const data = await gastoService.fetchAsignacionesGasto(filters);
      setAsignaciones(data);
    } catch (err) {
      setError('Error al cargar las asignaciones de gastos');
    } finally {
      setLoading(false);
    }
  }, []);

  const createAsignacionGasto = async (data: CreateAsignacionGastoDTO) => {
    try {
      setLoading(true);
      setError(null);
      const newAsignacion = await gastoService.createAsignacionGasto(data);
      setAsignaciones(prev => [...prev, newAsignacion]);
      return newAsignacion;
    } catch (err) {
      setError('Error al crear la asignación de gasto');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAsignacionGasto = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await gastoService.deleteAsignacionGasto(id);
      setAsignaciones(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      setError('Error al eliminar la asignación de gasto');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // ANÁLISIS DE RENTABILIDAD
  // ================================

  const fetchAnalisisRentabilidad = useCallback(async (presupuestoId?: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await gastoService.fetchAnalisisRentabilidad(presupuestoId);
      setAnalisisRentabilidad(data);
    } catch (err) {
      setError('Error al cargar el análisis de rentabilidad');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRentabilidadPorFecha = useCallback(async (fechaDesde: Date, fechaHasta: Date) => {
    try {
      setLoading(true);
      setError(null);
      const data = await gastoService.fetchRentabilidadPorFecha(fechaDesde, fechaHasta);
      setAnalisisRentabilidad(data);
    } catch (err) {
      setError('Error al cargar el análisis de rentabilidad por fecha');
    } finally {
      setLoading(false);
    }
  }, []);

  // ================================
  // INICIALIZACIÓN
  // ================================

  useEffect(() => {
    fetchGastosOperativos();
  }, [fetchGastosOperativos]);

  return {
    // Estado
    gastosOperativos,
    asignaciones,
    analisisRentabilidad,
    loading,
    error,
    selectedGasto,
    
    // Acciones - Gastos Operativos
    fetchGastosOperativos,
    fetchGastoById,
    createGastoOperativo,
    updateGastoOperativo,
    deleteGastoOperativo,
    setSelectedGasto,
    
    // Acciones - Asignaciones
    fetchAsignacionesGasto,
    createAsignacionGasto,
    deleteAsignacionGasto,
    
    // Acciones - Rentabilidad
    fetchAnalisisRentabilidad,
    fetchRentabilidadPorFecha,
    
    // Utilidades
    clearError: () => setError(null)
  };
}

// Hook separado para datos auxiliares
export function useGastoAuxiliarData() {
  const [monedas, setMonedas] = useState<Moneda[]>([]);
  const [proveedores, setProveedores] = useState<Persona[]>([]);
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMonedas = useCallback(async () => {
    try {
      setLoading(true);
      const data = await gastoService.fetchMonedas();
      
      // Verificar que los datos sean un array válido
      if (Array.isArray(data)) {
        setMonedas(data);
      } else {
        console.error('Monedas no es un array:', data);
        setMonedas([]);
        setError('Datos de monedas inválidos');
      }
    } catch (err) {
      console.error('Error fetching monedas:', err);
      setError('Error al cargar las monedas');
      setMonedas([]); // Array vacío por defecto
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProveedores = useCallback(async () => {
    try {
      setLoading(true);
      const data = await gastoService.fetchProveedores();
      
      // Verificar que los datos sean un array válido
      if (Array.isArray(data)) {
        setProveedores(data);
      } else {
        console.error('Proveedores no es un array:', data);
        setProveedores([]);
        setError('Datos de proveedores inválidos');
      }
    } catch (err) {
      console.error('Error fetching proveedores:', err);
      setError('Error al cargar los proveedores');
      setProveedores([]); // Array vacío por defecto
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPresupuestos = useCallback(async () => {
    try {
      setLoading(true);
  const data = await gastoService.fetchPresupuestosActivos();
  setPresupuestos(data as any);
    } catch (err) {
      setError('Error al cargar los presupuestos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMonedas();
    fetchProveedores();
    fetchPresupuestos();
  }, [fetchMonedas, fetchProveedores, fetchPresupuestos]);

  return {
    monedas,
    proveedores,
    presupuestos,
    loading,
    error,
    refetch: {
      monedas: fetchMonedas,
      proveedores: fetchProveedores,
      presupuestos: fetchPresupuestos
    }
  };
}
