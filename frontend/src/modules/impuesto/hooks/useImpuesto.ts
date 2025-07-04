import { useState, useEffect, useCallback } from 'react';
import { Impuesto, CreateImpuestoDTO, UpdateImpuestoDTO } from '../types';
import * as impuestoService from '../service';

export function useImpuesto() {
  const [impuestos, setImpuestos] = useState<Impuesto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImpuesto, setSelectedImpuesto] = useState<Impuesto | null>(null);

  const fetchImpuestos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await impuestoService.fetchImpuestos();
      setImpuestos(data);
    } catch (err) {
      setError('Error al cargar los impuestos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImpuestos();
  }, [fetchImpuestos]);

  const createImpuesto = async (data: CreateImpuestoDTO) => {
    try {
      setLoading(true);
      setError(null);
      const newImpuesto = await impuestoService.createImpuesto(data);
      setImpuestos(prev => [...prev, newImpuesto]);
      return newImpuesto;
    } catch (err) {
      setError('Error al crear el impuesto');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateImpuesto = async (id: number, data: UpdateImpuestoDTO) => {
    try {
      setLoading(true);
      setError(null);
      const updatedImpuesto = await impuestoService.updateImpuesto(id, data);
      setImpuestos(prev => prev.map(i => i.id === id ? updatedImpuesto : i));
      return updatedImpuesto;
    } catch (err) {
      setError('Error al actualizar el impuesto');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteImpuesto = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await impuestoService.deleteImpuesto(id);
      setImpuestos(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      setError('Error al eliminar el impuesto');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleImpuesto = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const updatedImpuesto = await impuestoService.toggleImpuesto(id);
      setImpuestos(prev => prev.map(i => i.id === id ? updatedImpuesto : i));
      return updatedImpuesto;
    } catch (err) {
      setError('Error al cambiar estado del impuesto');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const selectImpuesto = (impuesto: Impuesto | null) => {
    setSelectedImpuesto(impuesto);
  };

  const getImpuestoById = useCallback(async (id: number): Promise<Impuesto | null> => {
    try {
      // Primero intentar encontrar en la lista existente
      const existingImpuesto = impuestos.find((i: Impuesto) => i.id === id);
      if (existingImpuesto) {
        return existingImpuesto;
      }

      // Si no está en la lista, hacer una petición al servicio
      const impuesto = await impuestoService.fetchImpuestoById(id);
      return impuesto;
    } catch (err) {
      return null;
    }
  }, [impuestos]);

  const getActiveImpuestos = useCallback(async (): Promise<Impuesto[]> => {
    try {
      const activeImpuestos = await impuestoService.fetchActiveImpuestos();
      return activeImpuestos;
    } catch (err) {
      return [];
    }
  }, []);

  return {
    impuestos,
    loading,
    error,
    selectedImpuesto,
    createImpuesto,
    updateImpuesto,
    deleteImpuesto,
    toggleImpuesto,
    selectImpuesto,
    getImpuestoById,
    getActiveImpuestos,
    refreshImpuestos: fetchImpuestos
  };
}

export default useImpuesto;
