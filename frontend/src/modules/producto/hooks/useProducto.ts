import { useState, useEffect, useCallback } from 'react';
import { Producto, CreateProductoDTO, UpdateProductoDTO, Moneda } from '../types';
import { Persona } from '../../persona/types';
import * as productoService from '../service';
import { fetchPersonas } from '../../persona/service';

export function useProducto(proveedorId?: number) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);

  const fetchProductos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = proveedorId 
        ? await productoService.fetchProductosByProveedor(proveedorId)
        : await productoService.fetchProductos();
      setProductos(data);
    } catch (err) {
      setError('Error al cargar los productos');
      console.error('Error fetching productos:', err);
    } finally {
      setLoading(false);
    }
  }, [proveedorId]);

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  const createProducto = async (data: CreateProductoDTO) => {
    try {
      setLoading(true);
      setError(null);
      const newProducto = await productoService.createProducto(data);
      setProductos(prev => [...prev, newProducto]);
      return newProducto;
    } catch (err) {
      setError('Error al crear el producto');
      console.error('Error creating producto:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProducto = async (id: number, data: UpdateProductoDTO) => {
    try {
      setLoading(true);
      setError(null);
      const updatedProducto = await productoService.updateProducto(id, data);
      setProductos(prev => prev.map(p => p.id === id ? updatedProducto : p));
      return updatedProducto;
    } catch (err) {
      setError('Error al actualizar el producto');
      console.error('Error updating producto:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProducto = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await productoService.deleteProducto(id);
      setProductos(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError('Error al eliminar el producto');
      console.error('Error deleting producto:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const selectProducto = (producto: Producto | null) => {
    setSelectedProducto(producto);
  };

  return {
    productos,
    loading,
    error,
    selectedProducto,
    createProducto,
    updateProducto,
    deleteProducto,
    selectProducto,
    refreshProductos: fetchProductos
  };
}

export default useProducto;

export function useProductoAuxiliarData() {
  const [monedas, setMonedas] = useState<Moneda[]>([]);
  const [proveedores, setProveedores] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMonedas = async () => {
    try {
      setLoading(true);
      const data = await productoService.fetchMonedas();
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
