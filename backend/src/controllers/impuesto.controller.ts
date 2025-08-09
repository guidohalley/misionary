import { Request, Response } from 'express';
import { ImpuestoService } from '../services/impuesto.service';

export class ImpuestoController {
  static async create(req: Request, res: Response) {
    try {
      console.log('Creating impuesto with data:', JSON.stringify(req.body, null, 2));
      const impuesto = await ImpuestoService.create(req.body);
      console.log('Impuesto created successfully:', impuesto.id);
  return res.status(201).json(impuesto);
    } catch (error) {
      console.error('Error creating impuesto:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'Unknown error');
  return res.status(500).json({ 
        error: 'Error al crear el impuesto', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  static async findAll(_req: Request, res: Response) {
    try {
      const impuestos = await ImpuestoService.findAll();
  return res.json(impuestos);
    } catch (error) {
      console.error('Error fetching impuestos:', error);
  return res.status(500).json({ error: 'Error al obtener los impuestos' });
    }
  }

  static async findById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const impuesto = await ImpuestoService.findById(id);
      
      if (!impuesto) {
        return res.status(404).json({ error: 'Impuesto no encontrado' });
      }
      
  return res.json(impuesto);
    } catch (error) {
      console.error('Error fetching impuesto:', error);
  return res.status(500).json({ error: 'Error al buscar el impuesto' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const impuesto = await ImpuestoService.update(id, req.body);
  return res.json(impuesto);
    } catch (error) {
      console.error('Error updating impuesto:', error);
  return res.status(500).json({ error: 'Error al actualizar el impuesto' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await ImpuestoService.delete(id);
  return res.status(204).send();
    } catch (error) {
      console.error('Error deleting impuesto:', error);
  return res.status(500).json({ error: 'Error al eliminar el impuesto' });
    }
  }

  static async toggle(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const impuesto = await ImpuestoService.toggle(id);
  return res.json(impuesto);
    } catch (error) {
      console.error('Error toggling impuesto:', error);
  return res.status(500).json({ error: 'Error al cambiar estado del impuesto' });
    }
  }
}
