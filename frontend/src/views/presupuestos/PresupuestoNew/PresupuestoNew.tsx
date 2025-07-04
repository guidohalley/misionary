import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePresupuesto } from '@/modules/presupuesto/hooks/usePresupuesto';
import PresupuestoForm from '../PresupuestoForm/PresupuestoForm';
import type { PresupuestoFormData } from '../types';

const PresupuestoNew: React.FC = () => {
  const navigate = useNavigate();
  const { createPresupuesto } = usePresupuesto();

  const handleSubmit = async (data: PresupuestoFormData) => {
    try {
      await createPresupuesto(data);
      navigate('/presupuestos');
    } catch (error) {
      console.error('Error creating presupuesto:', error);
      throw error;
    }
  };

  const handleCancel = () => {
    navigate('/presupuestos');
  };

  return (
    <div className="max-w-full">
      <PresupuestoForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEdit={false}
      />
    </div>
  );
};

export default PresupuestoNew;
