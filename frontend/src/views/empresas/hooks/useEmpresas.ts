import { useState, useEffect } from 'react';
import { empresaService } from '../services/empresaService';
import type { Empresa, EmpresaFilters, CreateEmpresaRequest, UpdateEmpresaRequest } from '../types';

// Hook para listar empresas
export const useEmpresas = (filters?: EmpresaFilters) => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmpresas = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching empresas with filters:', filters);
      const data = await empresaService.getEmpresas(filters);
      console.log('Empresas fetched:', data);
      setEmpresas(data);
    } catch (err) {
      console.error('Error fetching empresas:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar empresas';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpresas();
  }, [JSON.stringify(filters)]); // Usar JSON.stringify para comparar objetos

  return {
    empresas,
    loading,
    error,
    refetch: fetchEmpresas
  };
};

// Hook para obtener una empresa por ID
export const useEmpresa = (id: number | undefined) => {
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchEmpresa = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await empresaService.getEmpresaById(id);
        setEmpresa(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar empresa');
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresa();
  }, [id]);

  return { empresa, loading, error };
};

// Hook para crear empresa
export const useCreateEmpresa = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createEmpresa = async (data: CreateEmpresaRequest): Promise<Empresa | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await empresaService.createEmpresa(data);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear empresa');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createEmpresa, loading, error };
};

// Hook para actualizar empresa
export const useUpdateEmpresa = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateEmpresa = async (id: number, data: UpdateEmpresaRequest): Promise<Empresa | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await empresaService.updateEmpresa(id, data);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar empresa');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateEmpresa, loading, error };
};

// Hook para eliminar empresa
export const useDeleteEmpresa = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteEmpresa = async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await empresaService.deleteEmpresa(id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar empresa');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteEmpresa, loading, error };
};

// Hook para buscar empresas
export const useSearchEmpresas = () => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchEmpresas = async (query: string) => {
    if (!query.trim()) {
      setEmpresas([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await empresaService.searchEmpresas(query);
      setEmpresas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al buscar empresas');
      setEmpresas([]);
    } finally {
      setLoading(false);
    }
  };

  return { empresas, searchEmpresas, loading, error };
};
