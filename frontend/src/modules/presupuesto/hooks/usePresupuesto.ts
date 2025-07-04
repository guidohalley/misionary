import { useState, useEffect, useCallback } from 'react';
import { EstadoPresupuesto } from '../../views/presupuestos/schemas';
import { 
  Presupuesto, 
  CreatePresupuestoDTO, 
  UpdatePresupuestoDTO 
} from '../types';
import * as presupuestoService from '../service';

export function usePresupuesto(params?: {
  clienteId?: number;
  estado?: EstadoPresupuesto;
}) {
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPresupuesto, setSelectedPresupuesto] = useState<Presupuesto | null>(null);

  const fetchPresupuestos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await presupuestoService.fetchPresupuestos(params);
      setPresupuestos(data);
    } catch (err) {
      setError('Error al cargar los presupuestos');
      console.error('Error fetching presupuestos:', err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchPresupuestos();
  }, [fetchPresupuestos]);

  const createPresupuesto = async (data: CreatePresupuestoDTO) => {
    try {
      setLoading(true);
      setError(null);
      const newPresupuesto = await presupuestoService.createPresupuesto(data);
      setPresupuestos(prev => [...prev, newPresupuesto]);
      return newPresupuesto;
    } catch (err) {
      setError('Error al crear el presupuesto');
      console.error('Error creating presupuesto:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePresupuesto = async (id: number, data: UpdatePresupuestoDTO) => {
    try {
      setLoading(true);
      setError(null);
      const updatedPresupuesto = await presupuestoService.updatePresupuesto(id, data);
      setPresupuestos(prev => 
        prev.map(p => p.id === id ? updatedPresupuesto : p)
      );
      return updatedPresupuesto;
    } catch (err) {
      setError('Error al actualizar el presupuesto');
      console.error('Error updating presupuesto:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePresupuesto = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await presupuestoService.deletePresupuesto(id);
      setPresupuestos(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError('Error al eliminar el presupuesto');
      console.error('Error deleting presupuesto:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEstado = async (id: number, estado: EstadoPresupuesto) => {
    try {
      setLoading(true);
      setError(null);
      const updatedPresupuesto = await presupuestoService.updateEstadoPresupuesto(id, estado);
      setPresupuestos(prev => 
        prev.map(p => p.id === id ? updatedPresupuesto : p)
      );
      return updatedPresupuesto;
    } catch (err) {
      setError('Error al actualizar el estado del presupuesto');
      console.error('Error updating presupuesto estado:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const selectPresupuesto = (presupuesto: Presupuesto | null) => {
    setSelectedPresupuesto(presupuesto);
  };

  return {
    presupuestos,
    loading,
    error,
    selectedPresupuesto,
    createPresupuesto,
    updatePresupuesto,
    deletePresupuesto,
    updateEstado,
    selectPresupuesto,
    refreshPresupuestos: fetchPresupuestos
  };
}

export default usePresupuesto;
