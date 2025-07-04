import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ImpuestoForm from '../ImpuestoForm/ImpuestoForm';
import { useImpuesto } from '@/modules/impuesto/hooks/useImpuesto';
import { Button } from '@/components/ui';
import type { ImpuestoFormData } from '../schemas';

const ImpuestoEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { updateImpuesto, getImpuestoById } = useImpuesto();
  const [initialData, setInitialData] = useState<ImpuestoFormData | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImpuesto = async () => {
      if (id) {
        try {
          setLoading(true);
          const impuesto = await getImpuestoById(parseInt(id));
          if (impuesto) {
            setInitialData({
              nombre: impuesto.nombre,
              porcentaje: impuesto.porcentaje,
              descripcion: impuesto.descripcion || '',
              activo: impuesto.activo,
            });
          } else {
            setError('Impuesto no encontrado');
          }
        } catch (err) {
          setError('Error al cargar el impuesto');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchImpuesto();
  }, [id, getImpuestoById]);

  const handleSubmit = async (data: ImpuestoFormData) => {
    if (id) {
      await updateImpuesto(parseInt(id), data);
      navigate('/impuestos');
    }
  };

  const handleCancel = () => {
    navigate('/impuestos');
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
      <div className="text-center py-8">
        <p className="text-red-600">Error: {error}</p>
        <Button onClick={handleCancel} className="mt-4">
          Volver a Impuestos
        </Button>
      </div>
    );
  }

  return (
    <ImpuestoForm
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isEdit={true}
    />
  );
};

export default ImpuestoEdit;
