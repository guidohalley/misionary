import { Request, Response } from 'express';
import { ProductoService } from '../services/producto.service';

export class ProductoController {
  static async create(req: Request, res: Response) {
    try {
      const producto = await ProductoService.create(req.body);
      res.status(201).json(producto);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el producto' });
    }
  }

  static async findById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const producto = await ProductoService.findById(id);
      
      if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      
      res.json(producto);
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar el producto' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const producto = await ProductoService.update(id, req.body);
      res.json(producto);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el producto' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await ProductoService.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el producto' });
    }
  }

  static async findAll(req: Request, res: Response) {
    try {
      const { proveedorId } = req.query;
      const productos = await ProductoService.findAll(proveedorId ? parseInt(proveedorId as string) : undefined);
      res.json(productos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los productos' });
    }
  }
}
