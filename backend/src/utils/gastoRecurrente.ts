import { GastoOperativo } from '@prisma/client';

/**
 * Proyecta un gasto recurrente generando instancias virtuales para un rango de fechas.
 * No crea registros en BD, solo genera objetos proyectados para visualización.
 */

export interface GastoProyectado extends Omit<GastoOperativo, 'id'> {
  id: number;
  esProyeccion: boolean;
  gastoOrigenId: number;
  fechaOriginal: Date;
}

/**
 * Calcula la próxima fecha de ocurrencia según la frecuencia
 */
function calcularProximaFecha(fechaBase: Date, frecuencia: string, iteracion: number): Date {
  const fecha = new Date(fechaBase);
  
  switch (frecuencia?.toUpperCase()) {
    case 'MENSUAL':
      fecha.setMonth(fecha.getMonth() + iteracion);
      break;
    case 'TRIMESTRAL':
      fecha.setMonth(fecha.getMonth() + (iteracion * 3));
      break;
    case 'SEMESTRAL':
      fecha.setMonth(fecha.getMonth() + (iteracion * 6));
      break;
    case 'ANUAL':
      fecha.setFullYear(fecha.getFullYear() + iteracion);
      break;
    case 'SEMANAL':
      fecha.setDate(fecha.getDate() + (iteracion * 7));
      break;
    case 'QUINCENAL':
      fecha.setDate(fecha.getDate() + (iteracion * 15));
      break;
    default:
      // Si no reconocemos la frecuencia, asumimos mensual
      fecha.setMonth(fecha.getMonth() + iteracion);
  }
  
  return fecha;
}

/**
 * Proyecta un gasto recurrente en un rango de fechas
 */
export function proyectarGastoRecurrente(
  gasto: GastoOperativo,
  fechaDesde: Date,
  fechaHasta: Date
): GastoProyectado[] {
  if (!gasto.esRecurrente || !gasto.frecuencia) {
    return [];
  }

  const proyecciones: GastoProyectado[] = [];
  const fechaOriginal = new Date(gasto.fecha);
  
  // Empezamos desde la próxima ocurrencia después de la fecha original
  let iteracion = 1;
  let fechaProyectada = calcularProximaFecha(fechaOriginal, gasto.frecuencia, iteracion);
  
  // Generamos proyecciones mientras estén dentro del rango
  while (fechaProyectada <= fechaHasta) {
    // Solo incluimos si está dentro del rango solicitado
    if (fechaProyectada >= fechaDesde) {
      proyecciones.push({
        ...gasto,
        fecha: fechaProyectada,
        esProyeccion: true,
        gastoOrigenId: gasto.id,
        fechaOriginal: fechaOriginal,
      } as GastoProyectado);
    }
    
    iteracion++;
    fechaProyectada = calcularProximaFecha(fechaOriginal, gasto.frecuencia, iteracion);
    
    // Límite de seguridad: no proyectar más de 100 ocurrencias
    if (iteracion > 100) {
      break;
    }
  }
  
  return proyecciones;
}

/**
 * Proyecta múltiples gastos recurrentes
 */
export function proyectarGastosRecurrentes(
  gastos: GastoOperativo[],
  fechaDesde: Date,
  fechaHasta: Date
): GastoProyectado[] {
  const proyecciones: GastoProyectado[] = [];
  
  for (const gasto of gastos) {
    if (gasto.esRecurrente && gasto.activo) {
      const proyeccionesGasto = proyectarGastoRecurrente(gasto, fechaDesde, fechaHasta);
      proyecciones.push(...proyeccionesGasto);
    }
  }
  
  return proyecciones;
}

/**
 * Combina gastos reales y proyectados, ordenados por fecha
 */
export function combinarGastosRealesYProyectados(
  gastosReales: GastoOperativo[],
  fechaDesde: Date,
  fechaHasta: Date
): (GastoOperativo | GastoProyectado)[] {
  // Gastos recurrentes que podrían tener proyecciones
  const gastosRecurrentes = gastosReales.filter(g => g.esRecurrente && g.activo);
  
  // Generar proyecciones
  const proyecciones = proyectarGastosRecurrentes(gastosRecurrentes, fechaDesde, fechaHasta);
  
  // Combinar gastos reales con proyecciones
  const todosLosGastos = [
    ...gastosReales.map(g => ({ ...g, esProyeccion: false } as any)),
    ...proyecciones
  ];
  
  // Ordenar por fecha descendente
  todosLosGastos.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  
  return todosLosGastos;
}

/**
 * Calcula el total de gastos incluyendo proyecciones
 */
export function calcularTotalConProyecciones(
  gastosReales: GastoOperativo[],
  fechaDesde: Date,
  fechaHasta: Date
): { totalReales: number; totalProyectado: number; total: number } {
  const gastosCompletos = combinarGastosRealesYProyectados(gastosReales, fechaDesde, fechaHasta);
  
  const totalReales = gastosCompletos
    .filter((g: any) => !g.esProyeccion)
    .reduce((sum, g) => sum + Number(g.monto || 0), 0);
  
  const totalProyectado = gastosCompletos
    .filter((g: any) => g.esProyeccion)
    .reduce((sum, g) => sum + Number(g.monto || 0), 0);
  
  return {
    totalReales,
    totalProyectado,
    total: totalReales + totalProyectado
  };
}


