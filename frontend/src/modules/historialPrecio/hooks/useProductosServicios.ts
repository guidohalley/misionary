import { useState, useEffect, useCallback } from 'react';
import ApiService from '@/services/ApiService';

export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: string; // Decimal como string
  monedaId: number;
  proveedorId?: number;
  activo: boolean;
  // Relaciones incluidas
  moneda?: {
    id: number;
    codigo: string;
    nombre: string;
    simbolo: string;
  };
  proveedor?: {
    id: number;
    nombre: string;
  };
}

export interface Servicio {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: string; // Decimal como string
  monedaId: number;
  proveedorId?: number;
  activo: boolean;
  // Relaciones incluidas
  moneda?: {
    id: number;
    codigo: string;
    nombre: string;
    simbolo: string;
  };
  proveedor?: {
    id: number;
    nombre: string;
  };
}

// Hook para gestión de productos
export const useProductos = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProductos = useCallback(async (): Promise<Producto[]> => {
    try {
      setLoading(true);
      setError(null);
      
      // Usar formato de respuesta con wrapper (siguiendo patrón de monedas)
      const response = await ApiService.fetchData<{ data: Producto[]; success: boolean; message: string }>({
        url: '/productos',
        method: 'GET'
      });

      const productosData = response.data?.data || [];
      setProductos(productosData);
      return productosData;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al obtener productos';
      setError(message);
      console.error('Error fetching productos:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-cargar productos al montar el hook
  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  // Funciones de utilidad
  const getProductoById = useCallback((id: number): Producto | undefined => {
    return productos.find(producto => producto.id === id);
  }, [productos]);

  const getProductosActivos = useCallback((): Producto[] => {
    return productos.filter(producto => producto.activo);
  }, [productos]);

  const getProductosPorMoneda = useCallback((monedaId: number): Producto[] => {
    return productos.filter(producto => producto.monedaId === monedaId);
  }, [productos]);

  // Convertir a opciones para Select
  const opcionesProductos = productos.map(producto => ({
    value: producto.id,
    label: producto.nombre
  }));

  const opcionesProductosActivos = getProductosActivos().map(producto => ({
    value: producto.id,
    label: producto.nombre
  }));

  return {
    productos,
    loading,
    error,
    fetchProductos,
    getProductoById,
    getProductosActivos,
    getProductosPorMoneda,
    opcionesProductos,
    opcionesProductosActivos
  };
};

// Hook para gestión de servicios
export const useServicios = () => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServicios = useCallback(async (): Promise<Servicio[]> => {
    try {
      setLoading(true);
      setError(null);
      
      // Usar formato de respuesta con wrapper (siguiendo patrón de monedas)
      const response = await ApiService.fetchData<{ data: Servicio[]; success: boolean; message: string }>({
        url: '/servicios',
        method: 'GET'
      });

      const serviciosData = response.data?.data || [];
      setServicios(serviciosData);
      return serviciosData;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al obtener servicios';
      setError(message);
      console.error('Error fetching servicios:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-cargar servicios al montar el hook
  useEffect(() => {
    fetchServicios();
  }, [fetchServicios]);

  // Funciones de utilidad
  const getServicioById = useCallback((id: number): Servicio | undefined => {
    return servicios.find(servicio => servicio.id === id);
  }, [servicios]);

  const getServiciosActivos = useCallback((): Servicio[] => {
    return servicios.filter(servicio => servicio.activo);
  }, [servicios]);

  const getServiciosPorMoneda = useCallback((monedaId: number): Servicio[] => {
    return servicios.filter(servicio => servicio.monedaId === monedaId);
  }, [servicios]);

  // Convertir a opciones para Select
  const opcionesServicios = servicios.map(servicio => ({
    value: servicio.id,
    label: servicio.nombre
  }));

  const opcionesServiciosActivos = getServiciosActivos().map(servicio => ({
    value: servicio.id,
    label: servicio.nombre
  }));

  return {
    servicios,
    loading,
    error,
    fetchServicios,
    getServicioById,
    getServiciosActivos,
    getServiciosPorMoneda,
    opcionesServicios,
    opcionesServiciosActivos
  };
};
