import prisma from '../config/prisma';
import { EstadoPresupuesto } from '@prisma/client';

// Compatibilidad temporal: usar cast a any para acceder a modelos añadidos recientemente
// en el cliente Prisma si los tipos no se regeneraron correctamente.
// Se debe eliminar esta solución cuando `@prisma/client` incluya el modelo en sus tipos.

export interface PresupuestoSnapshot {
  id: number;
  clienteId: number;
  subtotal: number;
  impuestos: number;
  total: number;
  estado: EstadoPresupuesto;
  monedaId: number;
  periodoInicio?: string;
  periodoFin?: string;
  items: Array<{
    id: number;
    productoId?: number;
    servicioId?: number;
    cantidad: number;
    precioUnitario: number;
    total: number;
    descripcion?: string;
  }>;
  presupuestoImpuestos: Array<{
    impuestoId: number;
    monto: number;
  }>;
}

export interface CambioPresupuesto {
  tipo: 'CREATE' | 'UPDATE' | 'STATE_CHANGE' | 'DELETE';
  presupuestoId: number;
  usuarioId?: number;
  motivoCambio?: string;
  datosAnteriores?: Partial<PresupuestoSnapshot>;
  datosNuevos: PresupuestoSnapshot;
}

export class PresupuestoHistorialService {
  
  /**
   * Registrar un cambio en el historial del presupuesto
   */
  static async registrarCambio(cambio: CambioPresupuesto): Promise<void> {
    try {
      // Obtener el último número de versión
      const ultimaVersion = await (prisma as any).presupuestoVersion.findFirst({
        where: { presupuestoId: cambio.presupuestoId },
        orderBy: { versionNumero: 'desc' },
        select: { versionNumero: true }
      });

      const nuevoNumeroVersion = (ultimaVersion?.versionNumero || 0) + 1;

      // Crear el registro de historial
      await (prisma as any).presupuestoVersion.create({
        data: {
          presupuestoId: cambio.presupuestoId,
          versionNumero: nuevoNumeroVersion,
          subtotalAnterior: cambio.datosAnteriores?.subtotal,
          subtotalNuevo: cambio.datosNuevos.subtotal,
          impuestosAnterior: cambio.datosAnteriores?.impuestos,
          impuestosNuevo: cambio.datosNuevos.impuestos,
          totalAnterior: cambio.datosAnteriores?.total,
          totalNuevo: cambio.datosNuevos.total,
          estadoAnterior: cambio.datosAnteriores?.estado,
          estadoNuevo: cambio.datosNuevos.estado,
          usuarioModificacionId: cambio.usuarioId,
          motivoCambio: cambio.motivoCambio,
          tipoOperacion: cambio.tipo,
          snapshotData: cambio.datosNuevos as any
        }
      });

      console.log(`✅ Historial registrado: Presupuesto ${cambio.presupuestoId}, versión ${nuevoNumeroVersion}, tipo: ${cambio.tipo}`);
    } catch (error) {
      console.error('❌ Error al registrar cambio en historial:', error);
      // No lanzar error para no interrumpir operación principal
    }
  }

  /**
   * Crear snapshot del estado actual del presupuesto
   */
  static async crearSnapshot(presupuestoId: number): Promise<PresupuestoSnapshot | null> {
    try {
      const presupuesto = await prisma.presupuesto.findUnique({
        where: { id: presupuestoId },
        include: {
          items: {
            include: {
              producto: { select: { nombre: true } },
              servicio: { select: { nombre: true } }
            }
          },
          presupuestoImpuestos: {
            include: {
              impuesto: { select: { nombre: true, porcentaje: true } }
            }
          }
        }
      });

      if (!presupuesto) return null;

      return {
        id: presupuesto.id,
        clienteId: presupuesto.clienteId,
        subtotal: Number(presupuesto.subtotal),
        impuestos: Number(presupuesto.impuestos),
        total: Number(presupuesto.total),
        estado: presupuesto.estado,
        monedaId: presupuesto.monedaId,
        periodoInicio: presupuesto.periodoInicio?.toISOString(),
        periodoFin: presupuesto.periodoFin?.toISOString(),
        items: presupuesto.items.map((item: any) => ({
          id: item.id,
          productoId: item.productoId || undefined,
          servicioId: item.servicioId || undefined,
          cantidad: item.cantidad,
          precioUnitario: Number(item.precioUnitario),
          total: item.cantidad * Number(item.precioUnitario),
          descripcion: (item.producto?.nombre || item.servicio?.nombre)
        })),
        presupuestoImpuestos: presupuesto.presupuestoImpuestos.map((pi: any) => ({
          impuestoId: pi.impuestoId,
          monto: Number(pi.monto)
        }))
      };
    } catch (error) {
      console.error('❌ Error al crear snapshot:', error);
      return null;
    }
  }

  /**
   * Obtener historial completo de un presupuesto
   */
  static async obtenerHistorial(presupuestoId: number) {
    return (prisma as any).presupuestoVersion.findMany({
      where: { presupuestoId },
      orderBy: { versionNumero: 'asc' },
      include: {
        usuarioModificacion: {
          select: { id: true, nombre: true, email: true }
        }
      }
    });
    console.log(`📊 Obteniendo historial de presupuesto ${presupuestoId} (temporal)`);
    return [];
  }

  /**
   * Análisis de cambios para KPIs
   */
  static async analizarCambiosPrecios(params: {
    fechaDesde?: Date;
    fechaHasta?: Date;
    clienteId?: number;
    estadoPresupuesto?: EstadoPresupuesto;
  }) {
    // TODO: Descomentar cuando se ejecute la migración
    /*
    const where: any = {};
    
    if (params.fechaDesde || params.fechaHasta) {
      where.fechaCambio = {};
      if (params.fechaDesde) where.fechaCambio.gte = params.fechaDesde;
      if (params.fechaHasta) where.fechaCambio.lte = params.fechaHasta;
    }

    if (params.clienteId) {
      where.presupuesto = { clienteId: params.clienteId };
    }

    if (params.estadoPresupuesto) {
      where.estadoNuevo = params.estadoPresupuesto;
    }

    const cambios = await (prisma as any).presupuestoVersion.findMany({
      where,
      include: {
        presupuesto: {
          include: {
            cliente: { select: { nombre: true } }
          }
        },
        usuarioModificacion: {
          select: { nombre: true }
        }
      },
      orderBy: { fechaCambio: 'desc' }
    });
    */

    // Datos temporales de ejemplo para desarrollo
    const cambios: any[] = [];

    // Análisis de tendencias
    const analisis = {
      totalCambios: cambios.length,
      aumentosPrecios: 0,
      disminucionesPrecios: 0,
      cambiosEstado: 0,
      impactoTotalMonetario: 0,
      promedioVariacion: 0,
      cambiosPorMes: {} as Record<string, number>
    };

    console.log(`📊 Análisis temporal - esperando migración para datos reales`);

    return {
      analisis,
      cambiosDetallados: cambios
    };
  }

  /**
   * Proyecciones empresariales basadas en historial
   */
  static async generarProyecciones(periodos: { años: number }) {
    const fechaDesde = new Date();
    fechaDesde.setFullYear(fechaDesde.getFullYear() - 2); // 2 años de historial

    const historial = await this.analizarCambiosPrecios({
      fechaDesde,
      estadoPresupuesto: EstadoPresupuesto.APROBADO
    });

    // Calcular tendencias anuales
    const proyecciones = {
      año1: this.calcularProyeccion(historial.analisis, 1),
      año3: this.calcularProyeccion(historial.analisis, 3),
      año5: this.calcularProyeccion(historial.analisis, 5),
      volatilidad: this.calcularVolatilidad(historial.cambiosDetallados),
      recomendaciones: this.generarRecomendaciones(historial.analisis)
    };

    return proyecciones;
  }

  private static calcularProyeccion(analisis: any, años: number) {
    const crecimientoPromedio = analisis.promedioVariacion * 12; // Mensual a anual
    const proyeccionAnual = Math.pow(1 + (crecimientoPromedio / 100), años);
    
    return {
      crecimientoEsperado: (proyeccionAnual - 1) * 100,
      impactoMonetarioEstimado: analisis.impactoTotalMonetario * años,
      confianza: this.calcularConfianza(analisis.totalCambios)
    };
  }

  private static calcularVolatilidad(cambios: any[]) {
    if (cambios.length < 2) return 0;
    
    const variaciones = cambios
      .filter(c => c.totalAnterior && c.totalNuevo)
      .map(c => {
        const anterior = Number(c.totalAnterior);
        const nuevo = Number(c.totalNuevo);
        return anterior > 0 ? ((nuevo - anterior) / anterior) * 100 : 0;
      });

    if (variaciones.length === 0) return 0;

    const promedio = variaciones.reduce((sum, v) => sum + v, 0) / variaciones.length;
    const varianza = variaciones.reduce((sum, v) => sum + Math.pow(v - promedio, 2), 0) / variaciones.length;
    
    return Math.sqrt(varianza);
  }

  private static calcularConfianza(totalCambios: number): number {
    if (totalCambios < 10) return 0.3;
    if (totalCambios < 50) return 0.6;
    if (totalCambios < 100) return 0.8;
    return 0.9;
  }

  private static generarRecomendaciones(analisis: any): string[] {
    const recomendaciones: string[] = [];
    
    if (analisis.aumentosPrecios > analisis.disminucionesPrecios * 2) {
      recomendaciones.push('Tendencia alcista sostenida - considerar estrategias de valor agregado');
    }
    
    if (analisis.disminucionesPrecios > analisis.aumentosPrecios) {
      recomendaciones.push('Presión a la baja en precios - revisar márgenes y eficiencias');
    }
    
    if (analisis.cambiosEstado > analisis.totalCambios * 0.3) {
      recomendaciones.push('Alta actividad de cambios de estado - optimizar proceso de aprobación');
    }

    return recomendaciones;
  }
}

export default PresupuestoHistorialService;
