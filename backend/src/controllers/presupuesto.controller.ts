import { Request, Response } from 'express';
import { PresupuestoService } from '../services/presupuesto.service';
import { EstadoPresupuesto } from '@prisma/client';

export class PresupuestoController {
  static async create(req: Request, res: Response) {
    try {
      console.log('Creating presupuesto with data:', JSON.stringify(req.body, null, 2));
      const presupuesto = await PresupuestoService.create(req.body);
      console.log('Presupuesto created successfully:', presupuesto.id);
      res.status(201).json(presupuesto);
    } catch (error) {
      console.error('Error creating presupuesto:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'Unknown error');
      res.status(500).json({ error: 'Error al crear el presupuesto', details: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  static async findById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const presupuesto = await PresupuestoService.findById(id);
      
      if (!presupuesto) {
        return res.status(404).json({ error: 'Presupuesto no encontrado' });
      }
      
      res.json(presupuesto);
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar el presupuesto' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const presupuesto = await PresupuestoService.update(id, req.body);
      res.json(presupuesto);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el presupuesto' });
    }
  }

  static async updateEstado(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { estado } = req.body;
      
      if (!Object.values(EstadoPresupuesto).includes(estado)) {
        return res.status(400).json({ error: 'Estado inválido' });
      }

      const presupuesto = await PresupuestoService.updateEstado(id, estado);
      res.json(presupuesto);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el estado del presupuesto' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await PresupuestoService.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el presupuesto' });
    }
  }

  static async findAll(req: Request, res: Response) {
    try {
      const { clienteId, estado } = req.query;
      const presupuestos = await PresupuestoService.findAll(
        clienteId ? parseInt(clienteId as string) : undefined,
        estado as EstadoPresupuesto | undefined
      );
      res.json(presupuestos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los presupuestos' });
    }
  }
}
