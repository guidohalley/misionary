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
    try {
      console.log('PresupuestoService.create - Input data:', JSON.stringify(data, null, 2));
      
      // Validar que existe el cliente
      const cliente = await prisma.persona.findUnique({
        where: { id: data.clienteId }
      });
      
      if (!cliente) {
        throw new Error(`Cliente con ID ${data.clienteId} no encontrado`);
      }
      
      console.log('Cliente encontrado:', cliente.nombre);
      
      // Validar items
      for (const item of data.items) {
        if (!item.productoId && !item.servicioId) {
          throw new Error('Cada item debe tener un producto o servicio');
        }
        
        if (item.productoId && item.servicioId) {
          throw new Error('Un item no puede tener producto y servicio al mismo tiempo');
        }
        
        if (item.productoId) {
          const producto = await prisma.producto.findUnique({
            where: { id: item.productoId }
          });
          if (!producto) {
            throw new Error(`Producto con ID ${item.productoId} no encontrado`);
          }
        }
        
        if (item.servicioId) {
          const servicio = await prisma.servicio.findUnique({
            where: { id: item.servicioId }
          });
          if (!servicio) {
            throw new Error(`Servicio con ID ${item.servicioId} no encontrado`);
          }
        }
      }
      
      console.log('Validaciones pasadas, creando presupuesto...');
      
      const presupuesto = await prisma.presupuesto.create({
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
      
      console.log('Presupuesto creado exitosamente:', presupuesto.id);
      return presupuesto;
    } catch (error) {
      console.error('Error en PresupuestoService.create:', error);
      throw error;
    }
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
