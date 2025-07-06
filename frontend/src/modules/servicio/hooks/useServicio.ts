import { useState, useEffect, useCallback } from 'react';
import { Servicio, CreateServicioDTO, UpdateServicioDTO, Moneda } from '../types';
import { Persona } from '../../persona/types';
import * as servicioService from '../service';
import { fetchPersonas } from '../../persona/service';

export function useServicio(proveedorId?: number) {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedServicio, setSelectedServicio] = useState<Servicio | null>(null);

  const fetchServicios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = proveedorId 
        ? await servicioService.fetchServiciosByProveedor(proveedorId)
        : await servicioService.fetchServicios();
      setServicios(data);
    } catch (err) {
      setError('Error al cargar los servicios');
      console.error('Error fetching servicios:', err);
    } finally {
      setLoading(false);
    }
  }, [proveedorId]);

  useEffect(() => {
    fetchServicios();
  }, [fetchServicios]);

  const createServicio = async (data: CreateServicioDTO) => {
    try {
      setLoading(true);
      setError(null);
      const newServicio = await servicioService.createServicio(data);
      setServicios(prev => [...prev, newServicio]);
      return newServicio;
    } catch (err) {
      setError('Error al crear el servicio');
      console.error('Error creating servicio:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateServicio = async (id: number, data: UpdateServicioDTO) => {
    try {
      setLoading(true);
      setError(null);
      const updatedServicio = await servicioService.updateServicio(id, data);
      setServicios(prev => prev.map(s => s.id === id ? updatedServicio : s));
      return updatedServicio;
    } catch (err) {
      setError('Error al actualizar el servicio');
      console.error('Error updating servicio:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteServicio = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await servicioService.deleteServicio(id);
      setServicios(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      setError('Error al eliminar el servicio');
      console.error('Error deleting servicio:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const selectServicio = (servicio: Servicio | null) => {
    setSelectedServicio(servicio);
  };

  return {
    servicios,
    loading,
    error,
    selectedServicio,
    createServicio,
    updateServicio,
    deleteServicio,
    selectServicio,
    refreshServicios: fetchServicios
  };
}

export default useServicio;

export function useServicioAuxiliarData() {
  const [monedas, setMonedas] = useState<Moneda[]>([]);
  const [proveedores, setProveedores] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMonedas = async () => {
    try {
      setLoading(true);
      const data = await servicioService.fetchMonedas();
      setMonedas(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar monedas');
      setMonedas([]);
    } finally {
      setLoading(false);
    }
  };

  const loadProveedores = async () => {
    try {
      setLoading(true);
      const data = await fetchPersonas();
      // Filtrar solo los proveedores
      const proveedoresList = data.filter(p => p.tipo === 'PROVEEDOR');
      setProveedores(Array.isArray(proveedoresList) ? proveedoresList : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar proveedores');
      setProveedores([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMonedas();
    loadProveedores();
  }, []);

  return {
    monedas,
    proveedores,
    loading,
    error,
    loadMonedas,
    loadProveedores
  };
}
