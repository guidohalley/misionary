import prisma from '../config/prisma';

export class ProductoService {
  static async create(data: {
    nombre: string;
    costoProveedor: number;
    margenAgencia: number;
    precio?: number; // Opcional, se calculará automáticamente si no se proporciona
    proveedorId: number;
    monedaId?: number;
  }) {
    // Calcular precio automáticamente si no se proporciona
    const precioFinal = data.precio ?? data.costoProveedor * (1 + data.margenAgencia / 100);
    
    return prisma.producto.create({
      data: {
        nombre: data.nombre,
        costoProveedor: data.costoProveedor,
        margenAgencia: data.margenAgencia,
        precio: precioFinal,
        proveedorId: data.proveedorId,
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

  static async update(id: number, data: {
    nombre?: string;
    costoProveedor?: number;
    margenAgencia?: number;
    precio?: number;
    proveedorId?: number;
    monedaId?: number;
  }) {
    // Si se actualizan costoProveedor o margenAgencia, recalcular precio
    let updateData: any = { ...data };
    
    if (data.costoProveedor !== undefined || data.margenAgencia !== undefined) {
      // Obtener valores actuales si no se proporcionan
      const current = await prisma.producto.findUnique({ where: { id } });
      if (current) {
        const costoActual = data.costoProveedor ?? Number(current.costoProveedor);
        const margenActual = data.margenAgencia ?? Number(current.margenAgencia);
        
        // Recalcular precio solo si no se proporciona manualmente
        if (data.precio === undefined) {
          updateData.precio = costoActual * (1 + margenActual / 100);
        }
      }
    }
    
    return prisma.producto.update({
      where: { id },
      data: updateData,
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
