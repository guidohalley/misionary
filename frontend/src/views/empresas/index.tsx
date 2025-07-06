import React from 'react';
import { Card } from '@/components/ui';
import { HiOutlineOfficeBuilding } from 'react-icons/hi';

const EmpresasView: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <HiOutlineOfficeBuilding className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Empresas</h1>
            <p className="text-gray-600">Administra las empresas asociadas a tus clientes</p>
          </div>
        </div>
      </div>

      <Card className="p-6">
        <div className="text-center py-12">
          <HiOutlineOfficeBuilding className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Vista de Empresas en Desarrollo
          </h3>
          <p className="text-gray-600 mb-6">
            Esta funcionalidad está en desarrollo. Por ahora puedes:
          </p>
          <div className="text-left max-w-md mx-auto space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-sm text-gray-700">
                Crear empresas al registrar nuevos clientes
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-sm text-gray-700">
                Ver empresas asociadas en la lista de clientes
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-sm text-gray-700">
                Filtrar presupuestos por empresa (próximamente)
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EmpresasView;
