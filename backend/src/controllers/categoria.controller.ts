import { Request, Response, NextFunction } from 'express';
import { categoriaService } from '../services/categoria.service';

export class CategoriaController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { activo } = req.query;
      const data = await categoriaService.list(
        activo === undefined ? undefined : activo === 'true'
      );
      res.json({ success: true, data });
    } catch (e) { next(e); }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await categoriaService.getById(parseInt(id));
      res.json({ success: true, data });
    } catch (e) { next(e); }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { nombre, activo } = req.body;
      if (!nombre) return res.status(400).json({ success: false, message: 'Nombre es requerido' });
      const data = await categoriaService.create({ nombre, activo });
      res.status(201).json({ success: true, data });
    } catch (e) { next(e); }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { nombre, activo } = req.body;
      const data = await categoriaService.update(parseInt(id), { nombre, activo });
      res.json({ success: true, data });
    } catch (e) { next(e); }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await categoriaService.remove(parseInt(id));
      res.json({ success: true, message: 'Categoría eliminada' });
    } catch (e) { next(e); }
  }
}

export const categoriaController = new CategoriaController();
