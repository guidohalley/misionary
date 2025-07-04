import prisma from '../config/prisma';
import { Presupuesto, EstadoPresupuesto } from '@prisma/client';

export class PresupuestoService {
  static async create(data: {
    clienteId: number;
    items: {
      cantidad: number;
      precioUnitario: number;
      productoId?: number;
      servicioId?: number;
    }[];
    subtotal: number;
    impuestos: number;
    total: number;
  }) {
    return prisma.presupuesto.create({
      data: {
        ...data,
        estado: EstadoPresupuesto.BORRADOR,
        items: {
          create: data.items
        }
      },
      include: {
        cliente: true,
        items: {
          include: {
            producto: true,
            servicio: true
          }
        }
      }
    });
  }

  static async findById(id: number) {
    return prisma.presupuesto.findUnique({
      where: { id },
      include: {
        cliente: true,
        items: {
          include: {
            producto: true,
            servicio: true
          }
        },
        factura: true
      }
    });
  }

  static async update(id: number, data: Partial<Presupuesto>) {
    return prisma.presupuesto.update({
      where: { id },
      data,
      include: {
        cliente: true,
        items: {
          include: {
            producto: true,
            servicio: true
          }
        }
      }
    });
  }

  static async updateEstado(id: number, estado: EstadoPresupuesto) {
    return prisma.presupuesto.update({
      where: { id },
      data: { estado }
    });
  }

  static async delete(id: number) {
    return prisma.presupuesto.delete({
      where: { id }
    });
  }

  static async findAll(clienteId?: number, estado?: EstadoPresupuesto) {
    const where: any = {};
    if (clienteId) where.clienteId = clienteId;
    if (estado) where.estado = estado;

    return prisma.presupuesto.findMany({
      where,
      include: {
        cliente: true,
        items: {
          include: {
            producto: true,
            servicio: true
          }
        }
      }
    });
  }
}
