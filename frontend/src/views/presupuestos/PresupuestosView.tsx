import React from 'react';
import PresupuestoList from './PresupuestoList';
import PermissionGuard from '@/components/shared/PermissionGuard';

const PresupuestosView: React.FC = () => {
  return (
    <PermissionGuard allowedRoles={['ADMIN', 'CONTADOR']} showBlur={true}>
      <div className="h-full">
        <PresupuestoList />
      </div>
    </PermissionGuard>
  );
};

export default PresupuestosView;
