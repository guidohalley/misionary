import prisma from '../config/prisma';
import type { Servicio } from '@prisma/client';
import { calcularPrecioConMargen } from '../utils/currency';

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

  static async create(data: {
    nombre: string;
    descripcion: string;
    costoProveedor: number;
    margenAgencia: number;
    precio?: number; // Opcional, se calculará automáticamente si no se proporciona
    proveedorId: number;
    monedaId?: number;
  }): Promise<Servicio> {
    // Calcular precio automáticamente si no se proporciona
    const precioFinal = data.precio ?? calcularPrecioConMargen(data.costoProveedor, data.margenAgencia);
    
    const servicio = await prisma.servicio.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        costoProveedor: data.costoProveedor,
        margenAgencia: data.margenAgencia,
        precio: precioFinal,
        proveedorId: data.proveedorId,
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

  static async update(id: number, data: {
    nombre?: string;
    descripcion?: string;
    costoProveedor?: number;
    margenAgencia?: number;
    precio?: number;
    proveedorId?: number;
    monedaId?: number;
  }): Promise<Servicio> {
    // Si se actualizan costoProveedor o margenAgencia, recalcular precio
    let updateData: any = { ...data };
    
    if (data.costoProveedor !== undefined || data.margenAgencia !== undefined) {
      // Obtener valores actuales si no se proporcionan
      const current = await prisma.servicio.findUnique({ where: { id } });
      if (current) {
        const costoActual = data.costoProveedor ?? Number(current.costoProveedor);
        const margenActual = data.margenAgencia ?? Number(current.margenAgencia);
        
        // Recalcular precio solo si no se proporciona manualmente
        if (data.precio === undefined) {
          updateData.precio = calcularPrecioConMargen(costoActual, margenActual);
        }
      }
    }
    
    const servicio = await prisma.servicio.update({
      where: { id },
      data: updateData,
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
