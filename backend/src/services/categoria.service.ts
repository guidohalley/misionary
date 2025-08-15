import prisma from '../config/prisma';
import { HttpError } from '../utils/http-error';

export interface CreateCategoriaData {
  nombre: string;
  activo?: boolean;
}

export class CategoriaService {
  async list(activo?: boolean) {
    return prisma.categoria.findMany({
      where: activo === undefined ? {} : { activo },
      orderBy: { nombre: 'asc' }
    });
  }

  async getById(id: number) {
    const cat = await prisma.categoria.findUnique({ where: { id } });
    if (!cat) throw new HttpError(404, 'Categoría no encontrada');
    return cat;
  }

  async create(data: CreateCategoriaData) {
    const nombre = data.nombre.trim().toUpperCase();
    return prisma.categoria.create({ data: { nombre, activo: data.activo ?? true } });
  }

  async update(id: number, data: Partial<CreateCategoriaData>) {
    if (data.nombre !== undefined) data.nombre = data.nombre.trim().toUpperCase();
    try {
      return await prisma.categoria.update({ where: { id }, data });
    } catch (e) {
      throw new HttpError(404, 'Categoría no encontrada');
    }
  }

  async remove(id: number) {
    // Validar que no tenga gastos asociados activos
    const count = await prisma.gastoOperativo.count({ where: { categoriaId: id } });
    if (count > 0) throw new HttpError(400, 'No se puede eliminar: tiene gastos asociados');
    await prisma.categoria.delete({ where: { id } });
  }
}

export const categoriaService = new CategoriaService();
