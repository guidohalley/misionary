import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { HttpError } from '../utils/http-error';

export class TipoGastoController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { activo } = req.query;
      
      const where: any = {};
      if (activo !== undefined) {
        where.activo = activo === 'true';
      }

      const tipos = await prisma.tipoGasto.findMany({
        where,
        orderBy: { nombre: 'asc' }
      });

      res.json({
        success: true,
        data: tipos
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      const tipo = await prisma.tipoGasto.findUnique({
        where: { id: parseInt(id) }
      });

      if (!tipo) {
        throw new HttpError(404, 'Tipo de gasto no encontrado');
      }

      res.json({
        success: true,
        data: tipo
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { nombre, slug, color, descripcion } = req.body;

      if (!nombre || !slug) {
        throw new HttpError(400, 'Los campos nombre y slug son requeridos');
      }

      // Verificar si el slug ya existe
      const existente = await prisma.tipoGasto.findUnique({
        where: { slug }
      });

      if (existente) {
        throw new HttpError(400, 'El slug ya existe');
      }

      const tipo = await prisma.tipoGasto.create({
        data: {
          nombre,
          slug,
          color,
          descripcion,
          activo: true,
          updatedAt: new Date()
        }
      });

      res.status(201).json({
        success: true,
        data: tipo,
        message: 'Tipo de gasto creado exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { nombre, slug, color, descripcion, activo } = req.body;

      const tipo = await prisma.tipoGasto.findUnique({
        where: { id: parseInt(id) }
      });

      if (!tipo) {
        throw new HttpError(404, 'Tipo de gasto no encontrado');
      }

      // Si se intenta cambiar el slug, verificar que no exista otro con ese slug
      if (slug && slug !== tipo.slug) {
        const existente = await prisma.tipoGasto.findUnique({
          where: { slug }
        });
        if (existente) {
          throw new HttpError(400, 'El slug ya existe');
        }
      }

      const tipoActualizado = await prisma.tipoGasto.update({
        where: { id: parseInt(id) },
        data: {
          ...(nombre && { nombre }),
          ...(slug && { slug }),
          ...(color !== undefined && { color }),
          ...(descripcion !== undefined && { descripcion }),
          ...(activo !== undefined && { activo }),
          updatedAt: new Date()
        }
      });

      res.json({
        success: true,
        data: tipoActualizado,
        message: 'Tipo de gasto actualizado exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const tipo = await prisma.tipoGasto.findUnique({
        where: { id: parseInt(id) }
      });

      if (!tipo) {
        throw new HttpError(404, 'Tipo de gasto no encontrado');
      }

      await prisma.tipoGasto.delete({
        where: { id: parseInt(id) }
      });

      res.json({
        success: true,
        message: 'Tipo de gasto eliminado exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }
}

export const tipoGastoController = new TipoGastoController();
