import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '@/components/ui';
import ImpuestoList from '../ImpuestoList/ImpuestoList';
import { HiOutlinePlus } from 'react-icons/hi';

const ImpuestoMain: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Gestión de Impuestos
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Administra los impuestos del sistema
          </p>
        </div>
        <Button
          onClick={() => navigate('/impuestos/nuevo')}
          className="flex items-center gap-2"
        >
          <HiOutlinePlus className="w-5 h-5" />
          Nuevo Impuesto
        </Button>
      </div>

      {/* Lista de Impuestos */}
      <div className="w-full">
        <ImpuestoList />
      </div>
    </div>
  );
};

export default ImpuestoMain;
