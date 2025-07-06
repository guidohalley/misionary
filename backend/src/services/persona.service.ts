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
    return prisma.persona.findUnique({
      where: { id },
      include: {
        productos: true,
        servicios: true,
        presupuestos: true,
        recibos: true
      }
    });
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
