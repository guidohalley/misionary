import { useMemo } from 'react';
import { Impuesto } from '@/modules/impuesto/types';
import { ItemFormData } from '../schemas';

export interface PresupuestoTotals {
  subtotal: number;
  impuestos: number;
  total: number;
  detalleImpuestos: Array<{
    impuesto: Impuesto;
    monto: number;
  }>;
}

export const usePresupuestoCalculations = (
  items: ItemFormData[] = [],
  impuestosSeleccionados: Impuesto[] = []
): PresupuestoTotals => {
  return useMemo(() => {
    // Calcular subtotal - forzar recalculo cada vez
    const subtotal = (items || []).reduce((sum, item) => {
      if (!item) return sum;
      const cantidad = Number(item.cantidad) || 0;
      const precio = Number(item.precioUnitario) || 0;
      return sum + (cantidad * precio);
    }, 0);

    // Calcular impuestos seleccionados
    const detalleImpuestos = (impuestosSeleccionados || []).map(impuesto => {
      const monto = (subtotal * Number(impuesto.porcentaje)) / 100;
      return {
        impuesto,
        monto
      };
    });

    const totalImpuestos = detalleImpuestos.reduce((sum, detalle) => sum + detalle.monto, 0);
    const total = subtotal + totalImpuestos;


    return {
      subtotal,
      impuestos: totalImpuestos,
      total,
      detalleImpuestos
    };
  }, [
    // Crear un hash más específico de solo los datos que importan para el cálculo
    items?.map(item => `${item?.cantidad || 0}-${item?.precioUnitario || 0}`).join('|'),
    impuestosSeleccionados?.map(imp => `${imp.id}-${imp.porcentaje}`).join('|')
  ]);
};

export default usePresupuestoCalculations;
