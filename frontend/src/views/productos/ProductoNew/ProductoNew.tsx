import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductoForm from '../ProductoForm/ProductoForm';
import { useProducto } from '@/modules/producto/hooks/useProducto';
import type { ProductoFormData } from '../types';

const ProductoNew: React.FC = () => {
  const navigate = useNavigate();
  const { createProducto } = useProducto();

  const handleSubmit = async (data: ProductoFormData) => {
    try {
      await createProducto(data);
      navigate('/productos');
    } catch (error) {
      console.error('Error creating producto:', error);
      throw error;
    }
  };

  const handleCancel = () => {
    navigate('/productos');
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
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEdit={false}
      />
    </motion.div>
  );
};

export default ProductoNew;
