import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ServicioForm from '../ServicioForm/ServicioForm';
import { useServicio } from '@/modules/servicio/hooks/useServicio';
import { Button } from '@/components/ui';
import type { ServicioFormData } from '../types';

const ServicioEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { servicios, updateServicio, refreshServicios } = useServicio();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const servicio = servicios.find(s => s.id === parseInt(id || '0'));

  useEffect(() => {
    const loadServicio = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!servicios.length) {
          await refreshServicios();
        }
        
        setLoading(false);
      } catch (err) {
        setError('Error al cargar el servicio');
        setLoading(false);
      }
    };

    loadServicio();
  }, [id, servicios.length, refreshServicios]);

  const handleSubmit = async (data: ServicioFormData) => {
    try {
      if (!id) throw new Error('ID de servicio no encontrado');
      await updateServicio(parseInt(id), data);
      navigate('/servicios');
    } catch (error) {
      console.error('Error updating servicio:', error);
      throw error;
    }
  };

  const handleCancel = () => {
    navigate('/servicios');
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
          <Button onClick={() => navigate('/servicios')}>
            Volver a Servicios
          </Button>
        </div>
      </div>
    );
  }

  if (!servicio) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Servicio no encontrado</p>
          <Button onClick={() => navigate('/servicios')}>
            Volver a Servicios
          </Button>
        </div>
      </div>
    );
  }

  const initialData: ServicioFormData = {
    nombre: servicio.nombre,
    descripcion: servicio.descripcion,
    precio: servicio.precio,
    proveedorId: servicio.proveedorId,
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
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEdit={true}
      />
    </motion.div>
  );
};

export default ServicioEdit;
