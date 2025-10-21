import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductoForm from '../ProductoForm/ProductoForm';
import { useProducto } from '@/modules/producto/hooks/useProducto';
import { Button, Notification, toast } from '@/components/ui';
import type { ProductoFormData } from '../types';
import { useAuth } from '@/contexts/AuthContext';
import { canEditProductoServicio, getErrorMessage } from '@/utils/permissions';

const ProductoEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { productos, updateProducto, refreshProductos } = useProducto();
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const producto = productos.find(p => p.id === parseInt(id || '0'));

  useEffect(() => {
    const loadProducto = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!productos.length) {
          await refreshProductos();
        }
        
        // Verificar permisos después de cargar el producto
        const productoEncontrado = productos.find(p => p.id === parseInt(id || '0'));
        if (productoEncontrado && !canEditProductoServicio(currentUser, productoEncontrado.proveedorId)) {
          toast.push(
            <Notification title="Sin permisos" type="danger">
              No tienes permisos para editar este producto
            </Notification>
          );
          navigate('/productos');
          return;
        }
        
        setLoading(false);
      } catch (err: any) {
        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
        setLoading(false);
      }
    };

    loadProducto();
  }, [id, productos.length, refreshProductos, currentUser, navigate]);

  const handleSubmit = async (data: ProductoFormData) => {
    try {
      if (!id) throw new Error('ID de producto no encontrado');
      
      // Validar permisos antes de enviar
      if (!canEditProductoServicio(currentUser, data.proveedorId)) {
        toast.push(
          <Notification title="Sin permisos" type="danger">
            No tienes permisos para editar este producto
          </Notification>
        );
        return;
      }
      
      // Normalizar payload: solo enviar campos relevantes del update
      const payload = {
        nombre: data.nombre,
        costoProveedor: data.costoProveedor,
        margenAgencia: data.margenAgencia,
        // precio es calculado en backend si no se envía; si viene calculado, lo incluimos
        ...(typeof data.precio === 'number' ? { precio: data.precio } : {}),
        proveedorId: data.proveedorId,
        monedaId: data.monedaId,
      };
      
      await updateProducto(parseInt(id), payload);
      navigate('/productos');
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      toast.push(
        <Notification title="Error" type="danger">
          {errorMessage}
        </Notification>
      );
      throw error;
    }
  };

  const handleCancel = () => {
    navigate('/productos');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => navigate('/productos')}>
            Volver a Productos
          </Button>
        </div>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Producto no encontrado</p>
          <Button onClick={() => navigate('/productos')}>
            Volver a Productos
          </Button>
        </div>
      </div>
    );
  }

  const initialData: ProductoFormData = {
    nombre: producto.nombre,
    costoProveedor: Number(producto.costoProveedor) || 0,
    margenAgencia: Number(producto.margenAgencia) || 0,
    precio: Number(producto.precio) || 0,
    proveedorId: producto.proveedorId,
    monedaId: producto.monedaId,
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-8"
    >
      <ProductoForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEdit={true}
      />
    </motion.div>
  );
};

export default ProductoEdit;
