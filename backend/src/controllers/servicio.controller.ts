import { Request, Response } from 'express';
import { ServicioService } from '../services/servicio.service';

export class ServicioController {
  static async create(req: Request, res: Response) {
    try {
      const servicio = await ServicioService.create(req.body);
      res.status(201).json(servicio);
    } catch (error) {
      console.error('Error en ServicioController.create:', error);
      res.status(500).json({ error: 'Error al crear el servicio' });
    }
  }

  static async findById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const servicio = await ServicioService.findById(id);
      
      if (!servicio) {
        return res.status(404).json({ error: 'Servicio no encontrado' });
      }
      
      res.json(servicio);
    } catch (error) {
      console.error('Error en ServicioController.findById:', error);
      res.status(500).json({ error: 'Error al buscar el servicio' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const servicio = await ServicioService.update(id, req.body);
      res.json(servicio);
    } catch (error) {
      console.error('Error en ServicioController.update:', error);
      res.status(500).json({ error: 'Error al actualizar el servicio' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await ServicioService.delete(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error en ServicioController.delete:', error);
      res.status(500).json({ error: 'Error al eliminar el servicio' });
    }
  }

  static async findAll(req: Request, res: Response) {
    try {
      const { proveedorId } = req.query;
      const servicios = await ServicioService.findAll(proveedorId ? parseInt(proveedorId as string) : undefined);
      res.json(servicios);
    } catch (error) {
      console.error('Error en ServicioController.findAll:', error);
      res.status(500).json({ error: 'Error al obtener los servicios' });
    }
  }
}
