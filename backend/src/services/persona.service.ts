import prisma from '../config/prisma';
import { Persona, TipoPersona, RolUsuario } from '@prisma/client';
import { EmpresaService } from './empresa.service';

export class PersonaService {
  static async create(data: {
    nombre: string;
    tipo: TipoPersona;
    telefono?: string;
    cvu?: string;
    roles: RolUsuario[];
    password: string;
    email: string;
  }) {
    return prisma.persona.create({
      data
    });
  }

  static async findById(id: number) {
    const persona = await prisma.persona.findUnique({
      where: { id },
      include: {
        productos: {
          include: {
            moneda: true
          }
        },
        servicios: {
          include: {
            moneda: true
          }
        },
        presupuestos: {
          include: {
            cliente: {
              select: {
                id: true,
                nombre: true
              }
            },
            empresa: {
              select: {
                id: true,
                nombre: true,
                razonSocial: true
              }
            },
            moneda: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        empresas: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        recibos: true
      }
    });

    if (!persona) return null;

    // Para proveedores, buscar presupuestos donde participan sus productos/servicios
    let presupuestosRelacionados: any[] = [];
    if (persona.tipo === 'PROVEEDOR') {
      const items = await prisma.item.findMany({
        where: {
          OR: [
            { productoId: { in: persona.productos.map(p => p.id) } },
            { servicioId: { in: persona.servicios.map(s => s.id) } }
          ]
        },
        include: {
          presupuesto: {
            include: {
              cliente: {
                select: {
                  id: true,
                  nombre: true
                }
              },
              empresa: {
                select: {
                  id: true,
                  nombre: true,
                  razonSocial: true
                }
              },
              moneda: true
            }
          },
          producto: true,
          servicio: true
        }
      });

      // Agrupar por presupuesto único
      const presupuestosMap = new Map();
      items.forEach(item => {
        if (!presupuestosMap.has(item.presupuesto.id)) {
          presupuestosMap.set(item.presupuesto.id, {
            ...item.presupuesto,
            items: []
          });
        }
        presupuestosMap.get(item.presupuesto.id).items.push(item);
      });

      presupuestosRelacionados = Array.from(presupuestosMap.values());
    }

    // Transform Decimal to Number
    return {
      ...persona,
      productos: persona.productos.map(p => ({
        ...p,
        precio: p.precio ? Number(p.precio) : p.precio,
        costoProveedor: p.costoProveedor ? Number(p.costoProveedor) : p.costoProveedor,
        margenAgencia: p.margenAgencia ? Number(p.margenAgencia) : p.margenAgencia,
      })),
      servicios: persona.servicios.map(s => ({
        ...s,
        precio: s.precio ? Number(s.precio) : s.precio,
        costoProveedor: s.costoProveedor ? Number(s.costoProveedor) : s.costoProveedor,
        margenAgencia: s.margenAgencia ? Number(s.margenAgencia) : s.margenAgencia,
      })),
      presupuestos: persona.tipo === 'CLIENTE' 
        ? persona.presupuestos.map(pr => ({
            ...pr,
            subtotal: pr.subtotal ? Number(pr.subtotal) : pr.subtotal,
            impuestos: pr.impuestos ? Number(pr.impuestos) : pr.impuestos,
            total: pr.total ? Number(pr.total) : pr.total,
          }))
        : presupuestosRelacionados.map(pr => ({
            ...pr,
            subtotal: pr.subtotal ? Number(pr.subtotal) : pr.subtotal,
            impuestos: pr.impuestos ? Number(pr.impuestos) : pr.impuestos,
            total: pr.total ? Number(pr.total) : pr.total,
          })),
    };
  }

  static async findByEmail(email: string) {
    return prisma.persona.findUnique({
      where: { email }
    });
  }

  static async update(id: number, data: Partial<Persona>) {
    console.log('PersonaService.update - ID:', id, 'Data:', data);
    const result = await prisma.persona.update({
      where: { id },
      data
    });
    console.log('PersonaService.update - Result:', result);
    return result;
  }

  static async delete(id: number) {
    return prisma.persona.delete({
      where: { id }
    });
  }

  static async findAll(tipo?: TipoPersona) {
    const where = tipo ? { tipo } : {};
    return prisma.persona.findMany({
      where,
      include: {
        productos: true,
        servicios: true,
        empresas: true
      }
    });
  }

  static async createClienteWithEmpresa(clienteData: {
    nombre: string;
    tipo: TipoPersona;
    telefono?: string;
    cvu?: string;
    roles: RolUsuario[];
    password: string;
    email: string;
  }, empresaData?: {
    nombre: string;
    razonSocial?: string;
    cuit?: string;
    telefono?: string;
    email?: string;
    direccion?: string;
  }) {
    // Crear el cliente primero
    const cliente = await prisma.persona.create({
      data: clienteData
    });

    // Si se proporcionan datos de empresa, crear la empresa
    if (empresaData) {
      const empresa = await EmpresaService.create({
        ...empresaData,
        clienteId: cliente.id
      });

      return {
        cliente,
        empresa
      };
    }

    return { cliente };
  }
}
