import { PrismaClient, Prisma } from '@prisma/client';
import { roundCurrency, toNumber } from '../utils/currency';

const prisma = new PrismaClient();

// Inferir tipos desde Prisma
type HistorialPrecio = Prisma.HistorialPrecioGetPayload<{
  include: {
    moneda: true;
    usuario: {
      select: {
        id: true;
        nombre: true;
        email: true;
      };
    };
  };
}>;

export interface CreateHistorialPrecioData {
  productoId?: number;
  servicioId?: number;
  monedaId: number;
  precio: number;
  fechaDesde: Date;
  fechaHasta?: Date;
  motivoCambio?: string;
  usuarioId?: number;
}

export interface UpdateHistorialPrecioData {
  precio?: number;
  fechaHasta?: Date;
  motivoCambio?: string;
  activo?: boolean;
}

export interface HistorialPrecioFilters {
  productoId?: number;
  servicioId?: number;
  monedaId?: number;
  fechaDesde?: Date;
  fechaHasta?: Date;
  activo?: boolean;
}

export class HistorialPrecioService {
  /**
   * Obtener historial de precios para un producto específico
   */
  static async getHistorialProducto(
    productoId: number,
    monedaId?: number,
    limit?: number
  ): Promise<HistorialPrecio[]> {
    const whereConditions: any = {
      productoId,
      activo: true
    };

    if (monedaId) {
      whereConditions.monedaId = monedaId;
    }

    return await prisma.historialPrecio.findMany({
      where: whereConditions,
      include: {
        moneda: true,
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true
          }
        }
      },
      orderBy: { fechaDesde: 'desc' },
      take: limit
    });
  }

  /**
   * Obtener historial de precios para un servicio específico
   */
  static async getHistorialServicio(
    servicioId: number,
    monedaId?: number,
    limit?: number
  ): Promise<HistorialPrecio[]> {
    const whereConditions: any = {
      servicioId,
      activo: true
    };

    if (monedaId) {
      whereConditions.monedaId = monedaId;
    }

    return await prisma.historialPrecio.findMany({
      where: whereConditions,
      include: {
        moneda: true,
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true
          }
        }
      },
      orderBy: { fechaDesde: 'desc' },
      take: limit
    });
  }

  /**
   * Obtener precio actual vigente para un producto
   */
  static async getPrecioActualProducto(
    productoId: number,
    monedaId: number
  ): Promise<HistorialPrecio | null> {
    return await prisma.historialPrecio.findFirst({
      where: {
        productoId,
        monedaId,
        activo: true,
        fechaHasta: null // Precio vigente actual
      },
      include: {
        moneda: true,
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true
          }
        }
      }
    });
  }

  /**
   * Obtener precio actual vigente para un servicio
   */
  static async getPrecioActualServicio(
    servicioId: number,
    monedaId: number
  ): Promise<HistorialPrecio | null> {
    return await prisma.historialPrecio.findFirst({
      where: {
        servicioId,
        monedaId,
        activo: true,
        fechaHasta: null // Precio vigente actual
      },
      include: {
        moneda: true,
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true
          }
        }
      }
    });
  }

  /**
   * Crear nuevo precio para producto (versiona automáticamente el anterior)
   */
  static async actualizarPrecioProducto(
    productoId: number,
    monedaId: number,
    nuevoPrecio: number,
    motivoCambio: string,
    usuarioId: number
  ): Promise<HistorialPrecio> {
    return await prisma.$transaction(async (tx) => {
      const ahora = new Date();

      // 1. Cerrar el precio actual (si existe)
      await tx.historialPrecio.updateMany({
        where: {
          productoId,
          monedaId,
          fechaHasta: null,
          activo: true
        },
        data: {
          fechaHasta: ahora
        }
      });

      // 2. Crear el nuevo precio vigente
      const nuevoHistorial = await tx.historialPrecio.create({
        data: {
          productoId,
          monedaId,
          precio: new Prisma.Decimal(nuevoPrecio),
          fechaDesde: ahora,
          fechaHasta: null, // Precio vigente
          motivoCambio,
          usuarioId,
          activo: true
        },
        include: {
          moneda: true,
          usuario: {
            select: {
              id: true,
              nombre: true,
              email: true
            }
          }
        }
      });

      // 3. Actualizar el precio en la tabla Producto también
      await tx.producto.update({
        where: { id: productoId },
        data: { precio: new Prisma.Decimal(nuevoPrecio) }
      });

      return nuevoHistorial;
    });
  }

  /**
   * Crear nuevo precio para servicio (versiona automáticamente el anterior)
   */
  static async actualizarPrecioServicio(
    servicioId: number,
    monedaId: number,
    nuevoPrecio: number,
    motivoCambio: string,
    usuarioId: number
  ): Promise<HistorialPrecio> {
    return await prisma.$transaction(async (tx) => {
      const ahora = new Date();

      // 1. Cerrar el precio actual (si existe)
      await tx.historialPrecio.updateMany({
        where: {
          servicioId,
          monedaId,
          fechaHasta: null,
          activo: true
        },
        data: {
          fechaHasta: ahora
        }
      });

      // 2. Crear el nuevo precio vigente
      const nuevoHistorial = await tx.historialPrecio.create({
        data: {
          servicioId,
          monedaId,
          precio: new Prisma.Decimal(nuevoPrecio),
          fechaDesde: ahora,
          fechaHasta: null, // Precio vigente
          motivoCambio,
          usuarioId,
          activo: true
        },
        include: {
          moneda: true,
          usuario: {
            select: {
              id: true,
              nombre: true,
              email: true
            }
          }
        }
      });

      // 3. Actualizar el precio en la tabla Servicio también
      await tx.servicio.update({
        where: { id: servicioId },
        data: { precio: new Prisma.Decimal(nuevoPrecio) }
      });

      return nuevoHistorial;
    });
  }

  /**
   * Actualización masiva de precios por inflación/devaluación
   */
  static async actualizacionMasivaPorcentaje(
    tipo: 'PRODUCTO' | 'SERVICIO',
    monedaId: number,
    porcentajeAumento: number,
    motivoCambio: string,
    usuarioId: number,
    filtros?: {
      proveedorId?: number;
      ids?: number[];
    }
  ): Promise<{ actualizados: number; errores: string[] }> {
    const errores: string[] = [];
    let actualizados = 0;

    return await prisma.$transaction(async (tx) => {
      // Obtener items a actualizar
      let items: any[] = [];
      
      if (tipo === 'PRODUCTO') {
        const whereConditions: any = { monedaId };
        if (filtros?.proveedorId) whereConditions.proveedorId = filtros.proveedorId;
        if (filtros?.ids) whereConditions.id = { in: filtros.ids };

        items = await tx.producto.findMany({
          where: whereConditions,
          select: { id: true, precio: true }
        });
      } else {
        const whereConditions: any = { monedaId };
        if (filtros?.proveedorId) whereConditions.proveedorId = filtros.proveedorId;
        if (filtros?.ids) whereConditions.id = { in: filtros.ids };

        items = await tx.servicio.findMany({
          where: whereConditions,
          select: { id: true, precio: true }
        });
      }

      const ahora = new Date();

      for (const item of items) {
        try {
          const precioActual = toNumber(item.precio);
          const nuevoPrecio = roundCurrency(precioActual * (1 + porcentajeAumento / 100), 2);

          if (tipo === 'PRODUCTO') {
            // Cerrar precio actual
            await tx.historialPrecio.updateMany({
              where: {
                productoId: item.id,
                monedaId,
                fechaHasta: null,
                activo: true
              },
              data: { fechaHasta: ahora }
            });

            // Crear nuevo precio
            await tx.historialPrecio.create({
              data: {
                productoId: item.id,
                monedaId,
                precio: new Prisma.Decimal(nuevoPrecio),
                fechaDesde: ahora,
                fechaHasta: null,
                motivoCambio,
                usuarioId,
                activo: true
              }
            });

            // Actualizar tabla principal
            await tx.producto.update({
              where: { id: item.id },
              data: { precio: new Prisma.Decimal(nuevoPrecio) }
            });
          } else {
            // Cerrar precio actual
            await tx.historialPrecio.updateMany({
              where: {
                servicioId: item.id,
                monedaId,
                fechaHasta: null,
                activo: true
              },
              data: { fechaHasta: ahora }
            });

            // Crear nuevo precio
            await tx.historialPrecio.create({
              data: {
                servicioId: item.id,
                monedaId,
                precio: new Prisma.Decimal(nuevoPrecio),
                fechaDesde: ahora,
                fechaHasta: null,
                motivoCambio,
                usuarioId,
                activo: true
              }
            });

            // Actualizar tabla principal
            await tx.servicio.update({
              where: { id: item.id },
              data: { precio: new Prisma.Decimal(nuevoPrecio) }
            });
          }

          actualizados++;
        } catch (error) {
          errores.push(`Error actualizando ${tipo.toLowerCase()} ${item.id}: ${error}`);
        }
      }

      return { actualizados, errores };
    });
  }

  /**
   * Obtener items con precios desactualizados (más de X días sin cambios)
   */
  static async obtenerPreciosDesactualizados(
    diasLimite: number = 30,
    monedaId?: number
  ): Promise<Array<{ tipo: string; id: number; nombre: string; ultimaActualizacion: Date; diasSinActualizar: number }>> {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - diasLimite);

    const whereConditions: any = {
      fechaDesde: { lt: fechaLimite },
      fechaHasta: null, // Solo precios vigentes
      activo: true
    };

    if (monedaId) {
      whereConditions.monedaId = monedaId;
    }

    const historialDesactualizado = await prisma.historialPrecio.findMany({
      where: whereConditions,
      include: {
        producto: {
          select: { id: true, nombre: true }
        },
        servicio: {
          select: { id: true, nombre: true }
        }
      }
    });

    return historialDesactualizado.map(h => {
      const ahora = new Date();
      const diasSinActualizar = Math.floor((ahora.getTime() - h.fechaDesde.getTime()) / (1000 * 60 * 60 * 24));
      
      return {
        tipo: h.producto ? 'PRODUCTO' : 'SERVICIO',
        id: h.producto?.id || h.servicio?.id || 0,
        nombre: h.producto?.nombre || h.servicio?.nombre || '',
        ultimaActualizacion: h.fechaDesde,
        diasSinActualizar
      };
    });
  }

  /**
   * Obtener estadísticas de cambios de precios
   */
  static async obtenerEstadisticasCambios(
    fechaDesde: Date,
    fechaHasta: Date,
    monedaId?: number
  ): Promise<{
    totalCambios: number;
    cambiosPorMotivo: Record<string, number>;
    promedioAumentoPorcentaje: number;
    cambiosPorDia: Array<{ fecha: string; cantidad: number }>;
  }> {
    const whereConditions: any = {
      fechaDesde: {
        gte: fechaDesde,
        lte: fechaHasta
      },
      activo: true
    };

    if (monedaId) {
      whereConditions.monedaId = monedaId;
    }

    const cambios = await prisma.historialPrecio.findMany({
      where: whereConditions,
      orderBy: { fechaDesde: 'asc' }
    });

    const totalCambios = cambios.length;
    
    // Agrupar por motivo
    const cambiosPorMotivo: Record<string, number> = {};
    cambios.forEach(cambio => {
      const motivo = cambio.motivoCambio || 'Sin especificar';
      cambiosPorMotivo[motivo] = (cambiosPorMotivo[motivo] || 0) + 1;
    });

    // Calcular promedio de aumento (simplificado)
    let sumaAumentos = 0;
    let contadorAumentos = 0;
    
    // Agrupar por día
    const cambiosPorDia: Record<string, number> = {};
    cambios.forEach(cambio => {
      const fecha = cambio.fechaDesde.toISOString().split('T')[0];
      cambiosPorDia[fecha] = (cambiosPorDia[fecha] || 0) + 1;
    });

    return {
      totalCambios,
      cambiosPorMotivo,
      promedioAumentoPorcentaje: contadorAumentos > 0 ? sumaAumentos / contadorAumentos : 0,
      cambiosPorDia: Object.entries(cambiosPorDia).map(([fecha, cantidad]) => ({
        fecha,
        cantidad
      }))
    };
  }
}
