import { useState, useEffect, useCallback } from 'react';
import { Empresa, EmpresaFilters, CreateEmpresaRequest, UpdateEmpresaRequest } from '../types';
import * as empresaService from '../service';

export function useEmpresa() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);

  const fetchEmpresas = useCallback(async (filters?: EmpresaFilters) => {
    try {
      setLoading(true);
      setError(null);
      const data = await empresaService.fetchEmpresas(filters);
      setEmpresas(data);
    } catch (err) {
      setError('Error al cargar las empresas');
      console.error('Error fetching empresas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshEmpresas = useCallback(() => {
    fetchEmpresas();
  }, [fetchEmpresas]);

  useEffect(() => {
    fetchEmpresas();
  }, [fetchEmpresas]);

  const createEmpresa = async (data: CreateEmpresaRequest) => {
    try {
      setLoading(true);
      setError(null);
      const newEmpresa = await empresaService.createEmpresa(data);
      setEmpresas(prev => [...prev, newEmpresa]);
      return newEmpresa;
    } catch (err) {
      setError('Error al crear la empresa');
      console.error('Error creating empresa:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEmpresa = async (id: number, data: UpdateEmpresaRequest) => {
    try {
      setLoading(true);
      setError(null);
      const updatedEmpresa = await empresaService.updateEmpresa(id, data);
      setEmpresas(prev => prev.map(empresa => 
        empresa.id === id ? updatedEmpresa : empresa
      ));
      return updatedEmpresa;
    } catch (err) {
      setError('Error al actualizar la empresa');
      console.error('Error updating empresa:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteEmpresa = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await empresaService.deleteEmpresa(id);
      setEmpresas(prev => prev.filter(empresa => empresa.id !== id));
    } catch (err) {
      setError('Error al eliminar la empresa');
      console.error('Error deleting empresa:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchEmpresaById = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const empresa = await empresaService.fetchEmpresaById(id);
      setSelectedEmpresa(empresa);
      return empresa;
    } catch (err) {
      setError('Error al cargar la empresa');
      console.error('Error fetching empresa by id:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    empresas,
    loading,
    error,
    selectedEmpresa,
    refreshEmpresas,
    createEmpresa,
    updateEmpresa,
    deleteEmpresa,
    fetchEmpresaById,
    fetchEmpresas
  };
}
