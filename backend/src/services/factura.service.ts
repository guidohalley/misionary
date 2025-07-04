import prisma from '../config/prisma';
import { EstadoFactura } from '@prisma/client';
import { HttpError } from '../utils/http-error';

export class FacturaService {
  static async create(data: {
    presupuestoId: number;
    numero: string;
    fecha: Date;
    subtotal: number;
    impuestos: number;
    total: number;
    impuestoAplicadoId: number;
  }) {
    const presupuesto = await prisma.presupuesto.findUnique({
      where: { id: data.presupuestoId }
    });

    if (!presupuesto) {
      throw HttpError.NotFound('Presupuesto no encontrado');
    }

    return prisma.factura.create({
      data: {
        ...data,
        estado: EstadoFactura.EMITIDA
      },
      include: {
        presupuesto: {
          include: {
            cliente: true,
            items: {
              include: {
                producto: true,
                servicio: true
              }
            }
          }
        },
        impuestoAplicado: true
      }
    });
  }

  static async findById(id: number) {
    const factura = await prisma.factura.findUnique({
      where: { id },
      include: {
        presupuesto: {
          include: {
            cliente: true,
            items: {
              include: {
                producto: true,
                servicio: true
              }
            }
          }
        },
        impuestoAplicado: true
      }
    });

    if (!factura) {
      throw HttpError.NotFound('Factura no encontrada');
    }

    return factura;
  }

  static async update(id: number, data: {
    estado?: EstadoFactura;
    fecha?: Date;
  }) {
    return prisma.factura.update({
      where: { id },
      data,
      include: {
        presupuesto: {
          include: {
            cliente: true
          }
        },
        impuestoAplicado: true
      }
    });
  }

  static async findAll(filters?: {
    estado?: EstadoFactura;
    clienteId?: number;
    fechaDesde?: Date;
    fechaHasta?: Date;
  }) {
    const where: any = {};

    if (filters?.estado) {
      where.estado = filters.estado;
    }

    if (filters?.clienteId) {
      where.presupuesto = {
        clienteId: filters.clienteId
      };
    }

    if (filters?.fechaDesde || filters?.fechaHasta) {
      where.fecha = {};
      if (filters.fechaDesde) {
        where.fecha.gte = filters.fechaDesde;
      }
      if (filters.fechaHasta) {
        where.fecha.lte = filters.fechaHasta;
      }
    }

    return prisma.factura.findMany({
      where,
      include: {
        presupuesto: {
          include: {
            cliente: true
          }
        },
        impuestoAplicado: true
      },
      orderBy: {
        fecha: 'desc'
      }
    });
  }

  static async anular(id: number) {
    return prisma.factura.update({
      where: { id },
      data: {
        estado: EstadoFactura.ANULADA
      }
    });
  }
}
