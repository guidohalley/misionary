import React from 'react';
import { Card } from '@/components/ui';
import usePresupuesto from '@/modules/presupuesto/hooks/usePresupuesto';
import { PresupuestoList } from '@/modules/presupuesto/components/PresupuestoList';
import { PresupuestoForm } from '@/modules/presupuesto/components/PresupuestoForm';
import { CreatePresupuestoDTO, UpdatePresupuestoDTO } from '@/modules/presupuesto/types';
import { EstadoPresupuesto } from '@prisma/client';

export default function PresupuestoView() {
  const {
    presupuestos,
    loading,
    error,
    selectedPresupuesto,
    createPresupuesto,
    updatePresupuesto,
    deletePresupuesto,
    updateEstado,
    selectPresupuesto,
  } = usePresupuesto();

  const handleSubmit = async (data: CreatePresupuestoDTO | UpdatePresupuestoDTO) => {
    try {
      if (selectedPresupuesto) {
        await updatePresupuesto(selectedPresupuesto.id, data as UpdatePresupuestoDTO);
        selectPresupuesto(null);
      } else {
        await createPresupuesto(data as CreatePresupuestoDTO);
      }
    } catch (err) {
      console.error('Error en operación:', err);
    }
  };

  const handleChangeStatus = async (id: number, estado: EstadoPresupuesto) => {
    try {
      await updateEstado(id, estado);
    } catch (err) {
      console.error('Error al cambiar estado:', err);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Presupuestos</h1>
      </div>

      <Card>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">
            {selectedPresupuesto ? 'Editar Presupuesto' : 'Nuevo Presupuesto'}
          </h2>
          <PresupuestoForm
            initialValues={selectedPresupuesto || undefined}
            onSubmit={handleSubmit}
            onCancel={selectedPresupuesto ? () => selectPresupuesto(null) : undefined}
          />
        </div>
      </Card>

      <Card>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Lista de Presupuestos</h2>
          <PresupuestoList
            presupuestos={presupuestos}
            loading={loading}
            error={error}
            onEdit={selectPresupuesto}
            onDelete={deletePresupuesto}
            onChangeStatus={handleChangeStatus}
          />
        </div>
      </Card>
    </div>
  );
}
