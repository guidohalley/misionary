import prisma from '../config/prisma';

export class ImpuestoService {
  static async create(data: {
    nombre: string;
    porcentaje: number;
    descripcion?: string;
    activo?: boolean;
  }) {
    try {
      console.log('ImpuestoService.create - Input data:', JSON.stringify(data, null, 2));
      
      // Validar que el porcentaje sea válido
      if (data.porcentaje < 0 || data.porcentaje > 100) {
        throw new Error('El porcentaje debe estar entre 0 y 100');
      }
      
      // Verificar que no exista un impuesto con el mismo nombre
      const existingImpuesto = await prisma.impuesto.findUnique({
        where: { nombre: data.nombre }
      });
      
      if (existingImpuesto) {
        throw new Error(`Ya existe un impuesto con el nombre "${data.nombre}"`);
      }
      
      console.log('Validaciones pasadas, creando impuesto...');
      
      const impuesto = await prisma.impuesto.create({
        data: {
          nombre: data.nombre,
          porcentaje: data.porcentaje,
          descripcion: data.descripcion,
          activo: data.activo ?? true
        }
      });
      
      console.log('Impuesto creado exitosamente:', impuesto.id);
      return impuesto;
    } catch (error) {
      console.error('Error en ImpuestoService.create:', error);
      throw error;
    }
  }

  static async findAll() {
    return prisma.impuesto.findMany({
      orderBy: [
        { activo: 'desc' },
        { nombre: 'asc' }
      ]
    });
  }

  static async findById(id: number) {
    return prisma.impuesto.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            presupuestoImpuestos: true,
            facturas: true
          }
        }
      }
    });
  }

  static async update(id: number, data: {
    nombre?: string;
    porcentaje?: number;
    descripcion?: string;
    activo?: boolean;
  }) {
    try {
      // Validar que el porcentaje sea válido si se está actualizando
      if (data.porcentaje !== undefined && (data.porcentaje < 0 || data.porcentaje > 100)) {
        throw new Error('El porcentaje debe estar entre 0 y 100');
      }
      
      // Si se está actualizando el nombre, verificar que no exista otro con el mismo nombre
      if (data.nombre) {
        const existingImpuesto = await prisma.impuesto.findFirst({
          where: { 
            nombre: data.nombre,
            NOT: { id }
          }
        });
        
        if (existingImpuesto) {
          throw new Error(`Ya existe otro impuesto con el nombre "${data.nombre}"`);
        }
      }
      
      return prisma.impuesto.update({
        where: { id },
        data
      });
    } catch (error) {
      console.error('Error en ImpuestoService.update:', error);
      throw error;
    }
  }

  static async delete(id: number) {
    try {
      // Verificar si el impuesto está siendo usado
      const impuestoWithUsage = await prisma.impuesto.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              presupuestoImpuestos: true,
              facturas: true
            }
          }
        }
      });
      
      if (!impuestoWithUsage) {
        throw new Error('Impuesto no encontrado');
      }
      
      const totalUsage = impuestoWithUsage._count.presupuestoImpuestos + impuestoWithUsage._count.facturas;
      
      if (totalUsage > 0) {
        throw new Error('No se puede eliminar el impuesto porque está siendo usado en presupuestos o facturas');
      }
      
      return prisma.impuesto.delete({
        where: { id }
      });
    } catch (error) {
      console.error('Error en ImpuestoService.delete:', error);
      throw error;
    }
  }

  static async toggle(id: number) {
    try {
      const impuesto = await prisma.impuesto.findUnique({
        where: { id }
      });
      
      if (!impuesto) {
        throw new Error('Impuesto no encontrado');
      }
      
      return prisma.impuesto.update({
        where: { id },
        data: { activo: !impuesto.activo }
      });
    } catch (error) {
      console.error('Error en ImpuestoService.toggle:', error);
      throw error;
    }
  }

  static async getActive() {
    return prisma.impuesto.findMany({
      where: { activo: true },
      orderBy: { nombre: 'asc' }
    });
  }
}
