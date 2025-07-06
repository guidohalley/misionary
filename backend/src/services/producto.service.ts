import prisma from '../config/prisma';
import { Producto } from '@prisma/client';

export class ProductoService {
  static async create(data: {
    nombre: string;
    precio: number;
    proveedorId: number;
    monedaId?: number;
  }) {
    return prisma.producto.create({
      data: {
        ...data,
        monedaId: data.monedaId || 1 // ARS por defecto
      },
      include: {
        proveedor: true,
        moneda: true
      }
    });
  }

  static async findById(id: number) {
    return prisma.producto.findUnique({
      where: { id },
      include: {
        proveedor: true,
        moneda: true,
        items: {
          include: {
            presupuesto: true
          }
        }
      }
    });
  }

  static async update(id: number, data: Partial<Producto>) {
    return prisma.producto.update({
      where: { id },
      data,
      include: {
        proveedor: true,
        moneda: true
      }
    });
  }

  static async delete(id: number) {
    return prisma.producto.delete({
      where: { id }
    });
  }

  static async findAll(proveedorId?: number) {
    const where = proveedorId ? { proveedorId } : {};
    return prisma.producto.findMany({
      where,
      include: {
        proveedor: true,
        moneda: true
      }
    });
  }
}
