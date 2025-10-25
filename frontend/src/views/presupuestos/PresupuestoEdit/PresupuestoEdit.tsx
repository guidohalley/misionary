import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePresupuesto } from '@/modules/presupuesto/hooks/usePresupuesto';
import PresupuestoForm from '../PresupuestoForm/PresupuestoForm';
import PermissionGuard from '@/components/shared/PermissionGuard';
import type { PresupuestoFormData } from '../types';

const PresupuestoEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { selectedPresupuesto, loading, error, getPresupuesto, updatePresupuesto } = usePresupuesto();
  const [initialData, setInitialData] = useState<PresupuestoFormData | undefined>();
  const [initialItemTypes, setInitialItemTypes] = useState<('producto' | 'servicio')[]>([]);
  const [initialItemProveedores, setInitialItemProveedores] = useState<(number | undefined)[]>([]);

  useEffect(() => {
    if (id) {
      getPresupuesto(parseInt(id));
    }
  }, [id, getPresupuesto]);

  useEffect(() => {
    if (selectedPresupuesto) {
      const impuestosSeleccionados = selectedPresupuesto.presupuestoImpuestos?.map(pi => pi.impuestoId) || [];
      
      // Calcular itemTypes y itemProveedores basados en los items existentes
      const types: ('producto' | 'servicio')[] = [];
      const proveedores: (number | undefined)[] = [];
      
      selectedPresupuesto.items.forEach(item => {
        if (item.productoId && item.producto) {
          types.push('producto');
          proveedores.push(item.producto.proveedorId);
        } else if (item.servicioId && item.servicio) {
          types.push('servicio');
          proveedores.push(item.servicio.proveedorId);
        } else {
          // Fallback si no hay datos completos
          types.push(item.productoId ? 'producto' : 'servicio');
          proveedores.push(undefined);
        }
      });
      
      setInitialItemTypes(types);
      setInitialItemProveedores(proveedores);
      
      setInitialData({
        clienteId: selectedPresupuesto.clienteId,
        items: selectedPresupuesto.items.map(item => ({
          productoId: item.productoId || undefined,
          servicioId: item.servicioId || undefined,
          cantidad: Number(item.cantidad) || 0,
          precioUnitario: Number(item.precioUnitario) || 0
        })),
        monedaId: selectedPresupuesto.monedaId,
        periodoInicio: selectedPresupuesto.periodoInicio,
        periodoFin: selectedPresupuesto.periodoFin,
        margenAgenciaGlobal: selectedPresupuesto.margenAgenciaGlobal ? Number(selectedPresupuesto.margenAgenciaGlobal) : undefined,
        // IMPORTANTE: El backend devuelve montoGananciaAgencia, mapearlo a montoGanancia para el form
        montoGanancia: (selectedPresupuesto as any).montoGananciaAgencia ? Number((selectedPresupuesto as any).montoGananciaAgencia) : undefined,
        impuestosSeleccionados,
      });
    }
  }, [selectedPresupuesto]);

  const handleSubmit = async (data: PresupuestoFormData) => {
    try {
      if (id) {
        await updatePresupuesto(parseInt(id), data);
        navigate('/presupuestos');
      }
    } catch (error) {
      console.error('Error updating presupuesto:', error);
      throw error;
    }
  };

  const handleCancel = () => {
    navigate('/presupuestos');
  };

  return (
    <PermissionGuard allowedRoles={['ADMIN', 'CONTADOR']} showBlur={true}>
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={() => navigate('/presupuestos')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver a Presupuestos
          </button>
        </div>
      )}

      {!loading && !error && !selectedPresupuesto && (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Presupuesto no encontrado</p>
          <button 
            onClick={() => navigate('/presupuestos')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver a Presupuestos
          </button>
        </div>
      )}

      {!loading && !error && selectedPresupuesto && (
        <div className="max-w-full">
          <PresupuestoForm
            initialData={initialData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isEdit={true}
            initialItemTypes={initialItemTypes}
            initialItemProveedores={initialItemProveedores}
            currentEstado={selectedPresupuesto.estado}
          />
        </div>
      )}
    </PermissionGuard>
  );
};

export default PresupuestoEdit;
