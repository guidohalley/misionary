import prisma from '../config/prisma';
import { HttpError } from '../utils/http-error';

export interface CreateCategoriaData {
  nombre: string;
  activo?: boolean;
}

import { CategoriaGasto } from '@prisma/client';

export class CategoriaService {
  static async list(activo?: boolean) {
    // Convertir enum a formato compatible con la API existente
    const categorias = Object.values(CategoriaGasto).map((categoria, index) => ({
      id: index + 1,
      nombre: categoria,
      activo: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    if (activo !== undefined) {
      return categorias.filter(cat => cat.activo === activo);
    }
    return categorias;
  }

  static async getById(id: number) {
    const categorias = Object.values(CategoriaGasto);
    const categoria = categorias[id - 1];
    
    if (!categoria) return null;
    
    return {
      id,
      nombre: categoria,
      activo: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  static async create(data: { nombre: string; activo?: boolean }) {
    // Los enums no se pueden crear dinámicamente
    throw new Error('No se pueden crear nuevas categorías. Use las categorías predefinidas del sistema.');
  }

  static async update(id: number, data: any) {
    // Los enums no se pueden actualizar
    throw new Error('No se pueden modificar las categorías del sistema.');
  }

  static async remove(id: number) {
    // Verificar si hay gastos usando esta categoría
    const categorias = Object.values(CategoriaGasto);
    const categoria = categorias[id - 1];
    
    if (!categoria) {
      throw new Error('Categoría no encontrada');
    }

    const prisma = (await import('../config/prisma')).default;
    const count = await prisma.gastoOperativo.count({ where: { categoria } });
    
    if (count > 0) {
      throw new Error('No se puede eliminar la categoría porque tiene gastos asociados');
    }
    
    throw new Error('No se pueden eliminar las categorías del sistema.');
  }

  // Métodos de instancia para compatibilidad
  async list(activo?: boolean) {
    return CategoriaService.list(activo);
  }

  async getById(id: number) {
    return CategoriaService.getById(id);
  }

  async create(data: { nombre: string; activo?: boolean }) {
    return CategoriaService.create(data);
  }

  async update(id: number, data: any) {
    return CategoriaService.update(id, data);
  }

  async remove(id: number) {
    return CategoriaService.remove(id);
  }
}

export const categoriaService = new CategoriaService();
