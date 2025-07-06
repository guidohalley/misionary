import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import ClienteConEmpresaForm from '../ClienteForm/ClienteConEmpresaForm';
import { usePersona } from '../hooks';
import { ClienteConEmpresaFormData } from '../schemas';

const ClienteConEmpresaNew: React.FC = () => {
  const navigate = useNavigate();
  const { createClienteWithEmpresa } = usePersona();

  const handleSubmit = async (data: ClienteConEmpresaFormData) => {
    try {
      const payload = {
        cliente: data.cliente,
        empresa: data.crearEmpresa ? data.empresa : undefined
      };
      
      await createClienteWithEmpresa(payload);
      navigate('/personas');
    } catch (error) {
      console.error('Error al crear cliente con empresa:', error);
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
          <h1 className="text-3xl font-bold text-gray-900">Nuevo Cliente</h1>
          <p className="text-gray-600 mt-2">
            Registra un nuevo cliente en el sistema y opcionalmente su empresa
          </p>
        </div>
      </div>

      {/* Formulario */}
      <ClienteConEmpresaForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </motion.div>
  );
};

export default ClienteConEmpresaNew;
