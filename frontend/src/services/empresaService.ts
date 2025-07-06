import ApiService from '@/services/ApiService';
import type { Empresa, EmpresaFilters, CreateEmpresaRequest, UpdateEmpresaRequest } from '@/modules/empresa/types';

// Base URL para las APIs de empresa
const EMPRESA_API_URL = '/api/empresas';

export const empresaService = {
  // Obtener todas las empresas con filtros
  async getEmpresas(filters?: EmpresaFilters): Promise<Empresa[]> {
    const params = new URLSearchParams();
    
    if (filters?.search) {
      params.append('q', filters.search);
      // Si hay búsqueda, usar endpoint de search
      const response = await ApiService.fetchData<Empresa[]>({
        url: `${EMPRESA_API_URL}/search`,
        method: 'GET',
        params: Object.fromEntries(params)
      });
      return response.data;
    }
    
    if (filters?.clienteId) params.append('clienteId', filters.clienteId.toString());
    if (filters?.activo !== undefined) params.append('activo', filters.activo.toString());

    const response = await ApiService.fetchData<Empresa[]>({
      url: EMPRESA_API_URL,
      method: 'GET',
      params: Object.fromEntries(params)
    });

    return response.data;
  },

  // Obtener empresa por ID
  async getEmpresaById(id: number): Promise<Empresa> {
    const response = await ApiService.fetchData<Empresa>({
      url: `${EMPRESA_API_URL}/${id}`,
      method: 'GET'
    });

    return response.data;
  },

  // Obtener empresas por cliente
  async getEmpresasByCliente(clienteId: number): Promise<Empresa[]> {
    const response = await ApiService.fetchData<Empresa[]>({
      url: `${EMPRESA_API_URL}/cliente/${clienteId}`,
      method: 'GET'
    });

    return response.data;
  },

  // Crear nueva empresa
  async createEmpresa(data: CreateEmpresaRequest): Promise<Empresa> {
    const response = await ApiService.fetchData<Empresa>({
      url: EMPRESA_API_URL,
      method: 'POST',
      data: { ...data }
    });

    return response.data;
  },

  // Actualizar empresa
  async updateEmpresa(id: number, data: UpdateEmpresaRequest): Promise<Empresa> {
    const response = await ApiService.fetchData<Empresa>({
      url: `${EMPRESA_API_URL}/${id}`,
      method: 'PUT',
      data: { ...data }
    });

    return response.data;
  },

  // Eliminar empresa (soft delete si tiene relaciones)
  async deleteEmpresa(id: number): Promise<{ message: string }> {
    const response = await ApiService.fetchData<{ message: string }>({
      url: `${EMPRESA_API_URL}/${id}`,
      method: 'DELETE'
    });

    return response.data;
  },

  // Buscar empresas
  async searchEmpresas(query: string): Promise<Empresa[]> {
    const response = await ApiService.fetchData<Empresa[]>({
      url: `${EMPRESA_API_URL}/search`,
      method: 'GET',
      params: { q: query }
    });

    return response.data;
  }
};
