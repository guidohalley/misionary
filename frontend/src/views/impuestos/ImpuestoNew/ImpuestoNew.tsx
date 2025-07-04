import React from 'react';
import { useNavigate } from 'react-router-dom';
import ImpuestoForm from '../ImpuestoForm/ImpuestoForm';
import { useImpuesto } from '@/modules/impuesto/hooks/useImpuesto';
import type { ImpuestoFormData } from '../schemas';

const ImpuestoNew: React.FC = () => {
  const navigate = useNavigate();
  const { createImpuesto } = useImpuesto();

  const handleSubmit = async (data: ImpuestoFormData) => {
    await createImpuesto(data);
    navigate('/impuestos');
  };

  const handleCancel = () => {
    navigate('/impuestos');
  };

  return (
    <ImpuestoForm
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isEdit={false}
    />
  );
};

export default ImpuestoNew;
