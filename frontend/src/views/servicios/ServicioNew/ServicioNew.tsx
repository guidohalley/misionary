import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ServicioForm from '../ServicioForm/ServicioForm';
import { useServicio } from '@/modules/servicio/hooks/useServicio';
import type { ServicioFormData } from '../types';

const ServicioNew: React.FC = () => {
  const navigate = useNavigate();
  const { createServicio } = useServicio();

  const handleSubmit = async (data: ServicioFormData) => {
    try {
      // No enviar precio: el backend lo calculará automáticamente
      const { precio, ...dataWithoutPrecio } = data;
      await createServicio(dataWithoutPrecio);
      navigate('/servicios');
    } catch (error) {
      console.error('Error creating servicio:', error);
      throw error;
    }
  };

  const handleCancel = () => {
    navigate('/servicios');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-8"
    >
      <ServicioForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEdit={false}
      />
    </motion.div>
  );
};

export default ServicioNew;
