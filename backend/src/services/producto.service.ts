import prisma from '../config/prisma';
import { Producto } from '@prisma/client';

export class ProductoService {
  static async create(data: {
    nombre: string;
    precio: number;
    proveedorId: number;
  }) {
    return prisma.producto.create({
      data,
      include: {
        proveedor: true
      }
    });
  }

  static async findById(id: number) {
    return prisma.producto.findUnique({
      where: { id },
      include: {
        proveedor: true,
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
        proveedor: true
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
        proveedor: true
      }
    });
  }
}
