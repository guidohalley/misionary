import { useState, useEffect, useCallback } from 'react';
import { empresaService } from '../service';
import type { Empresa, EmpresaFilters, CreateEmpresaRequest, UpdateEmpresaRequest } from '../types';

export const useEmpresas = (filters: EmpresaFilters = {}) => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmpresas = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await empresaService.fetchEmpresas(filters);
      setEmpresas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar empresas');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const refetch = useCallback(() => {
    fetchEmpresas();
  }, [fetchEmpresas]);

  useEffect(() => {
    fetchEmpresas();
  }, [fetchEmpresas]);

  return {
    empresas,
    loading,
    error,
    refetch
  };
};

export const useEmpresa = (id?: number) => {
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmpresa = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await empresaService.fetchEmpresaById(id);
      setEmpresa(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar empresa');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEmpresa();
  }, [fetchEmpresa]);

  return {
    empresa,
    loading,
    error,
    refetch: fetchEmpresa
  };
};

export const useCreateEmpresa = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createEmpresa = useCallback(async (data: CreateEmpresaRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await empresaService.createEmpresa(data);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear empresa';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createEmpresa,
    loading,
    error
  };
};

export const useUpdateEmpresa = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateEmpresa = useCallback(async (id: number, data: UpdateEmpresaRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await empresaService.updateEmpresa(id, data);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar empresa';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    updateEmpresa,
    loading,
    error
  };
};

export const useDeleteEmpresa = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteEmpresa = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const success = await empresaService.deleteEmpresa(id);
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar empresa';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    deleteEmpresa,
    loading,
    error
  };
};
