import { Request, Response } from 'express';
import { ServicioService } from '../services/servicio.service';

export class ServicioController {
  static async create(req: Request, res: Response) {
    try {
      const servicio = await ServicioService.create(req.body);
  return res.status(201).json(servicio);
    } catch (error) {
      console.error('Error en ServicioController.create:', error);
  return res.status(500).json({ error: 'Error al crear el servicio' });
    }
  }

  static async findById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const servicio = await ServicioService.findById(id);
      
      if (!servicio) {
        return res.status(404).json({ error: 'Servicio no encontrado' });
      }
      
  return res.json(servicio);
    } catch (error) {
      console.error('Error en ServicioController.findById:', error);
  return res.status(500).json({ error: 'Error al buscar el servicio' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const servicio = await ServicioService.update(id, req.body);
  return res.json(servicio);
    } catch (error) {
      console.error('Error en ServicioController.update:', error);
  return res.status(500).json({ error: 'Error al actualizar el servicio' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await ServicioService.delete(id);
  return res.status(204).send();
    } catch (error) {
      console.error('Error en ServicioController.delete:', error);
  return res.status(500).json({ error: 'Error al eliminar el servicio' });
    }
  }

  static async findAll(req: Request, res: Response) {
    try {
      const { proveedorId } = req.query;
      const servicios = await ServicioService.findAll(proveedorId ? parseInt(proveedorId as string) : undefined);
  return res.json(servicios);
    } catch (error) {
      console.error('Error en ServicioController.findAll:', error);
  return res.status(500).json({ error: 'Error al obtener los servicios' });
    }
  }
}
