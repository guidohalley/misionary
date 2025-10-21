import ApiService from '@/services/ApiService';
import type { 
  Empresa, 
  CreateEmpresaRequest, 
  UpdateEmpresaRequest, 
  EmpresaFilters,
  EmpresaResponse,
  SingleEmpresaResponse
} from './types';

const ENDPOINTS = {
  empresas: '/empresas',
  empresaById: (id: number) => `/empresas/${id}`,
  empresasByCliente: (clienteId: number) => `/empresas/cliente/${clienteId}`,
  searchEmpresas: '/empresas/search'
};

// Función auxiliar para construir query params
const buildQueryParams = (filters: EmpresaFilters): string => {
  const params = new URLSearchParams();
  
  if (filters.search) params.append('q', filters.search);
  if (filters.clienteId) params.append('clienteId', filters.clienteId.toString());
  if (filters.activo !== undefined) params.append('activo', filters.activo.toString());
  
  return params.toString();
};

export const empresaService = {
  // Obtener todas las empresas con filtros
  async fetchEmpresas(filters: EmpresaFilters = {}): Promise<Empresa[]> {
    try {
      const queryParams = buildQueryParams(filters);
      const url = queryParams ? `${ENDPOINTS.empresas}?${queryParams}` : ENDPOINTS.empresas;
      
      const response = await ApiService.fetchData<Empresa[]>({
        url,
        method: 'GET'
      });
      
      // Backend devuelve array directo, no wrapper
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching empresas:', error);
      throw new Error('Error al cargar empresas');
    }
  },

  // Obtener empresa por ID
  async fetchEmpresaById(id: number): Promise<Empresa> {
    try {
      const response = await ApiService.fetchData<Empresa>({
        url: ENDPOINTS.empresaById(id),
        method: 'GET'
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching empresa by ID:', error);
      throw new Error('Error al cargar empresa');
    }
  },

  // Obtener empresas por cliente
  async fetchEmpresasByCliente(clienteId: number): Promise<Empresa[]> {
    try {
      const response = await ApiService.fetchData<Empresa[]>({
        url: ENDPOINTS.empresasByCliente(clienteId),
        method: 'GET'
      });
      
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching empresas by cliente:', error);
      throw new Error('Error al cargar empresas del cliente');
    }
  },

  // Crear empresa
  async createEmpresa(data: CreateEmpresaRequest): Promise<Empresa> {
    try {
      const response = await ApiService.fetchData<Empresa>({
        url: ENDPOINTS.empresas,
        method: 'POST',
        data: data as unknown as Record<string, unknown>
      });
      
      return response.data;
    } catch (error) {
      console.error('Error creating empresa:', error);
      throw new Error('Error al crear empresa');
    }
  },

  // Actualizar empresa
  async updateEmpresa(id: number, data: UpdateEmpresaRequest): Promise<Empresa> {
    try {
      console.log('Service: Updating empresa with ID:', id, 'Data:', data);
      
      const response = await ApiService.fetchData<Empresa>({
        url: ENDPOINTS.empresaById(id),
        method: 'PUT',
        data: data as unknown as Record<string, unknown>
      });
      
      console.log('Service: Update response:', response);
      return response.data;
    } catch (error: any) {
      console.error('Error updating empresa:', error);
      
      // Extraer mensaje de error más específico
      let errorMessage = 'Error al actualizar empresa';
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  },

  // Eliminar empresa
  async deleteEmpresa(id: number): Promise<boolean> {
    try {
      await ApiService.fetchData({
        url: ENDPOINTS.empresaById(id),
        method: 'DELETE'
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting empresa:', error);
      throw new Error('Error al eliminar empresa');
    }
  },

  // Buscar empresas
  async searchEmpresas(query: string): Promise<Empresa[]> {
    try {
      const response = await ApiService.fetchData<Empresa[]>({
        url: `${ENDPOINTS.searchEmpresas}?q=${encodeURIComponent(query)}`,
        method: 'GET'
      });
      
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error searching empresas:', error);
      throw new Error('Error al buscar empresas');
    }
  }
};
