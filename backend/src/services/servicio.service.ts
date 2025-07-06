import prisma from '../config/prisma';
import type { Servicio } from '@prisma/client';

export class ServicioService {
  static async create(data: any): Promise<Servicio> {
    return await prisma.servicio.create({
      data: {
        ...data,
        monedaId: data.monedaId || 1 // ARS por defecto
      },
      include: {
        proveedor: true,
        moneda: true,
      },
    });
  }

  static async findById(id: number): Promise<Servicio | null> {
    return await prisma.servicio.findUnique({
      where: { id },
      include: {
        proveedor: true,
        moneda: true,
      },
    });
  }

  static async findAll(proveedorId?: number): Promise<Servicio[]> {
    return await prisma.servicio.findMany({
      where: proveedorId ? { proveedorId } : {},
      include: {
        proveedor: true,
        moneda: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  static async update(id: number, data: any): Promise<Servicio> {
    return await prisma.servicio.update({
      where: { id },
      data,
      include: {
        proveedor: true,
        moneda: true,
      },
    });
  }

  static async delete(id: number): Promise<void> {
    await prisma.servicio.delete({
      where: { id },
    });
  }
}
