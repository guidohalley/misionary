import prisma from '../config/prisma';
import type { Servicio } from '@prisma/client';

export class ServicioService {
  /**
   * Convierte campos Decimal a Number para serialización JSON correcta
   */
  private static transformServicio(servicio: any): any {
    if (!servicio) return null;
    
    return {
      ...servicio,
      precio: servicio.precio ? Number(servicio.precio) : servicio.precio,
      costoProveedor: servicio.costoProveedor ? Number(servicio.costoProveedor) : servicio.costoProveedor,
      margenAgencia: servicio.margenAgencia ? Number(servicio.margenAgencia) : servicio.margenAgencia,
    };
  }

  static async create(data: any): Promise<Servicio> {
    const servicio = await prisma.servicio.create({
      data: {
        ...data,
        monedaId: data.monedaId || 1 // ARS por defecto
      },
      include: {
        proveedor: true,
        moneda: true,
      },
    });
    return this.transformServicio(servicio);
  }

  static async findById(id: number): Promise<Servicio | null> {
    const servicio = await prisma.servicio.findUnique({
      where: { id },
      include: {
        proveedor: true,
        moneda: true,
      },
    });
    return this.transformServicio(servicio);
  }

  static async findAll(proveedorId?: number): Promise<Servicio[]> {
    const servicios = await prisma.servicio.findMany({
      where: proveedorId ? { proveedorId } : {},
      include: {
        proveedor: true,
        moneda: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return servicios.map(s => this.transformServicio(s));
  }

  static async update(id: number, data: any): Promise<Servicio> {
    const servicio = await prisma.servicio.update({
      where: { id },
      data,
      include: {
        proveedor: true,
        moneda: true,
      },
    });
    return this.transformServicio(servicio);
  }

  static async delete(id: number): Promise<void> {
    await prisma.servicio.delete({
      where: { id },
    });
  }
}
