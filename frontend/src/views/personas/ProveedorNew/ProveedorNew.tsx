import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import { ProveedorForm } from '../ProveedorForm';
import { usePersona } from '../hooks';
import { ProveedorFormData } from '../schemas';

const ProveedorNew: React.FC = () => {
  const navigate = useNavigate();
  const { createPersona } = usePersona();

  const handleSubmit = async (data: ProveedorFormData | any) => {
    try {
      await createPersona(data as any);
      navigate('/personas');
    } catch (error) {
      console.error('Error al crear proveedor:', error);
      throw error;
    }
  };

  const handleCancel = () => {
    navigate('/personas');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-6"
    >
      {/* Header con navegación */}
      <div className="mb-6">
        <Button
          variant="plain"
          size="sm"
          onClick={() => navigate('/personas')}
          className="mb-4 text-gray-600 hover:text-gray-800"
        >
          <HiOutlineArrowLeft className="mr-2 h-4 w-4" />
          Volver a Personas
        </Button>
        
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-bold text-gray-900">Nuevo Proveedor</h1>
          <p className="text-gray-600 mt-2">
            Registra un nuevo proveedor con acceso al sistema para gestionar sus productos/servicios
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className="max-w-4xl mx-auto">
        <ProveedorForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          mode="create"
        />
      </div>
    </motion.div>
  );
};

export default ProveedorNew;
