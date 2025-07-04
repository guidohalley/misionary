import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductoForm from '../ProductoForm/ProductoForm';
import { useProducto } from '@/modules/producto/hooks/useProducto';
import { Button } from '@/components/ui';
import type { ProductoFormData } from '../types';

const ProductoEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { productos, updateProducto, refreshProductos } = useProducto();
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
        
        setLoading(false);
      } catch (err) {
        setError('Error al cargar el producto');
        setLoading(false);
      }
    };

    loadProducto();
  }, [id, productos.length, refreshProductos]);

  const handleSubmit = async (data: ProductoFormData) => {
    try {
      if (!id) throw new Error('ID de producto no encontrado');
      await updateProducto(parseInt(id), data);
      navigate('/productos');
    } catch (error) {
      console.error('Error updating producto:', error);
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
    precio: producto.precio,
    proveedorId: producto.proveedorId,
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
