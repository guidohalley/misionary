import { Prisma } from '@prisma/client';
import { roundCurrency } from './currency';

/**
 * Calcula la ganancia de un presupuesto según su configuración
 * Puede usar ganancia global o calcular por items individuales
 */

export interface PresupuestoConItems {
  id: number;
  subtotal: Prisma.Decimal | number;
  usarGananciaGlobal?: boolean | null;
  margenAgenciaGlobal?: Prisma.Decimal | number | null;
  montoGananciaAgencia?: Prisma.Decimal | number | null;
  items?: Array<{
    cantidad: number;
    precioUnitario: Prisma.Decimal | number;
    producto?: {
      margenAgencia: Prisma.Decimal | number;
    } | null;
    servicio?: {
      margenAgencia: Prisma.Decimal | number;
    } | null;
  }>;
}

/**
 * Calcula ganancia global basada en porcentaje sobre subtotal
 */
export function calcularGananciaPorPorcentaje(
  subtotal: number,
  porcentaje: number
): number {
  return roundCurrency((subtotal * porcentaje) / 100, 2);
}

/**
 * Calcula ganancia sumando márgenes individuales de cada item
 */
export function calcularGananciaPorItems(
  items: PresupuestoConItems['items']
): number {
  if (!items || items.length === 0) return 0;

  const total = items.reduce((total, item) => {
    const cantidad = Number(item.cantidad || 0);
    const precioUnitario = Number(item.precioUnitario || 0);
    
    // Obtener margen del producto o servicio
    let margen = 0;
    if (item.producto) {
      margen = Number(item.producto.margenAgencia || 0);
    } else if (item.servicio) {
      margen = Number(item.servicio.margenAgencia || 0);
    }
    
    // Calcular ganancia del item: precioUnitario * (margen / 100) * cantidad
    const gananciaItem = roundCurrency(precioUnitario * (margen / 100) * cantidad, 2);
    
    return total + gananciaItem;
  }, 0);
  
  return roundCurrency(total, 2);
}

/**
 * Calcula la ganancia total del presupuesto según su configuración
 */
export function calcularGananciaPresupuesto(
  presupuesto: PresupuestoConItems
): {
  gananciaTotal: number;
  tipoCalculo: 'GLOBAL_PORCENTAJE' | 'GLOBAL_MONTO' | 'POR_ITEMS' | 'SIN_GANANCIA';
  detalles?: string;
} {
  const subtotal = Number(presupuesto.subtotal || 0);
  
  // Si usa ganancia global
  if (presupuesto.usarGananciaGlobal) {
    // Si tiene porcentaje definido, calcular por porcentaje
    if (presupuesto.margenAgenciaGlobal !== null && presupuesto.margenAgenciaGlobal !== undefined) {
      const porcentaje = Number(presupuesto.margenAgenciaGlobal);
      const gananciaCalculada = calcularGananciaPorPorcentaje(subtotal, porcentaje);
      
      // Si además tiene monto manual, usar ese (permite override)
      const gananciaFinal = presupuesto.montoGananciaAgencia !== null && presupuesto.montoGananciaAgencia !== undefined
        ? Number(presupuesto.montoGananciaAgencia)
        : gananciaCalculada;
      
      return {
        gananciaTotal: gananciaFinal,
        tipoCalculo: 'GLOBAL_PORCENTAJE',
        detalles: `${porcentaje}% sobre subtotal (${gananciaCalculada.toFixed(2)}${presupuesto.montoGananciaAgencia ? ', ajustado manualmente' : ''})`
      };
    }
    
    // Si solo tiene monto manual (sin porcentaje)
    if (presupuesto.montoGananciaAgencia !== null && presupuesto.montoGananciaAgencia !== undefined) {
      return {
        gananciaTotal: Number(presupuesto.montoGananciaAgencia),
        tipoCalculo: 'GLOBAL_MONTO',
        detalles: 'Monto fijo ingresado manualmente'
      };
    }
  }
  
  // Si no usa ganancia global, calcular por items
  if (presupuesto.items && presupuesto.items.length > 0) {
    const gananciaPorItems = calcularGananciaPorItems(presupuesto.items);
    return {
      gananciaTotal: gananciaPorItems,
      tipoCalculo: 'POR_ITEMS',
      detalles: 'Suma de márgenes individuales de productos/servicios'
    };
  }
  
  // Sin ganancia definida
  return {
    gananciaTotal: 0,
    tipoCalculo: 'SIN_GANANCIA',
    detalles: 'No hay ganancia configurada'
  };
}

/**
 * Valida que la ganancia global no sea negativa o excesiva
 */
export function validarGananciaGlobal(
  margenPorcentaje?: number | null,
  montoGanancia?: number | null,
  subtotal?: number
): { valido: boolean; error?: string } {
  // Validar porcentaje
  if (margenPorcentaje !== null && margenPorcentaje !== undefined) {
    if (margenPorcentaje < 0) {
      return { valido: false, error: 'El porcentaje de margen no puede ser negativo' };
    }
    if (margenPorcentaje > 100) {
      return { valido: false, error: 'El porcentaje de margen no puede exceder el 100%' };
    }
  }
  
  // Validar monto
  if (montoGanancia !== null && montoGanancia !== undefined) {
    if (montoGanancia < 0) {
      return { valido: false, error: 'El monto de ganancia no puede ser negativo' };
    }
    
    // Advertencia si la ganancia excede el subtotal (no es error, puede ser válido)
    if (subtotal && montoGanancia > subtotal) {
      // Solo advertencia en logs, no bloquear
      console.warn(`Ganancia (${montoGanancia}) excede el subtotal (${subtotal})`);
    }
  }
  
  return { valido: true };
}

/**
 * Calcula el monto sugerido basado en porcentaje
 * Útil para el frontend cuando el usuario cambia el porcentaje
 */
export function calcularMontoSugerido(
  subtotal: number,
  porcentaje: number
): number {
  return calcularGananciaPorPorcentaje(subtotal, porcentaje);
}


