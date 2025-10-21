import prisma from '../config/prisma';
import { Empresa } from '@prisma/client';

export class EmpresaService {
  static async create(data: {
    nombre: string;
    razonSocial?: string;
    cuit?: string;
    telefono?: string;
    email?: string;
    direccion?: string;
    clienteId: number;
    activo?: boolean;
  }) {
    return prisma.empresa.create({
      data,
      include: {
        cliente: true
      }
    });
  }

  static async findById(id: number) {
    return prisma.empresa.findUnique({
      where: { id },
      include: {
        cliente: true,
        presupuestos: {
          include: {
            moneda: true
          }
        },
        facturas: {
          include: {
            moneda: true
          }
        }
      }
    });
  }

  static async findByClienteId(clienteId: number) {
    return prisma.empresa.findMany({
      where: { clienteId },
      include: {
        cliente: true
      }
    });
  }

  static async update(id: number, data: Partial<Empresa>) {
    try {
      console.log('EmpresaService.update - ID:', id, 'Data:', data);
      
      // Verificar que la empresa existe antes de actualizar
      const existingEmpresa = await prisma.empresa.findUnique({
        where: { id }
      });
      
      if (!existingEmpresa) {
        throw new Error(`Empresa with ID ${id} not found`);
      }

      const result = await prisma.empresa.update({
        where: { id },
        data,
        include: {
          cliente: true
        }
      });
      
      console.log('EmpresaService.update - Result:', result);
      return result;
    } catch (error) {
      console.error('Error in EmpresaService.update:', error);
      throw error;
    }
  }

  static async delete(id: number) {
    return prisma.empresa.delete({
      where: { id }
    });
  }

  static async findAll(filters?: {
    clienteId?: number;
    activo?: boolean;
  }) {
    const where: any = {};
    
    if (filters?.clienteId) {
      where.clienteId = filters.clienteId;
    }
    
    if (filters?.activo !== undefined) {
      where.activo = filters.activo;
    }

    return prisma.empresa.findMany({
      where,
      include: {
        cliente: true
      },
      orderBy: {
        nombre: 'asc'
      }
    });
  }

  static async findByCuit(cuit: string) {
    return prisma.empresa.findUnique({
      where: { cuit },
      include: {
        cliente: true
      }
    });
  }
}
