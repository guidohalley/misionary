import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ServicioForm from '../ServicioForm/ServicioForm';
import { useServicio } from '@/modules/servicio/hooks/useServicio';
import { Button, Notification, toast } from '@/components/ui';
import type { ServicioFormData } from '../types';
import { useAuth } from '@/contexts/AuthContext';
import { canEditProductoServicio, getErrorMessage } from '@/utils/permissions';

const ServicioEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { servicios, updateServicio, refreshServicios } = useServicio();
  const { user: currentUser } = useAuth();
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
        
        // Verificar permisos después de cargar el servicio
        const servicioEncontrado = servicios.find(s => s.id === parseInt(id || '0'));
        if (servicioEncontrado && !canEditProductoServicio(currentUser, servicioEncontrado.proveedorId)) {
          toast.push(
            <Notification title="Sin permisos" type="danger">
              No tienes permisos para editar este servicio
            </Notification>
          );
          navigate('/servicios');
          return;
        }
        
        setLoading(false);
      } catch (err: any) {
        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
        setLoading(false);
      }
    };

    loadServicio();
  }, [id, servicios.length, refreshServicios, currentUser, navigate]);

  const handleSubmit = async (data: ServicioFormData) => {
    try {
      if (!id) throw new Error('ID de servicio no encontrado');
      
      // Validar permisos antes de enviar
      if (!canEditProductoServicio(currentUser, data.proveedorId)) {
        toast.push(
          <Notification title="Sin permisos" type="danger">
            No tienes permisos para editar este servicio
          </Notification>
        );
        return;
      }
      
      // No enviar precio: el backend lo calcula
      const { precio, ...dataWithoutPrecio } = data;
      await updateServicio(parseInt(id), dataWithoutPrecio);
      navigate('/servicios');
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
    costoProveedor: Number(servicio.costoProveedor) || 0,
    margenAgencia: Number(servicio.margenAgencia) || 0,
    precio: Number(servicio.precio) || 0,
    proveedorId: servicio.proveedorId,
    monedaId: servicio.monedaId,
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
