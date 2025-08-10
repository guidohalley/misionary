import { Request, Response } from 'express';
import { PresupuestoService } from '../services/presupuesto.service';

export class PresupuestoController {
  static async create(req: Request, res: Response) {
    try {
      console.log('Creating presupuesto with data:', JSON.stringify(req.body, null, 2));
      const presupuesto = await PresupuestoService.create(req.body);
      console.log('Presupuesto created successfully:', presupuesto.id);
  return res.status(201).json(presupuesto);
    } catch (error) {
      console.error('Error creating presupuesto:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'Unknown error');
  return res.status(500).json({ error: 'Error al crear el presupuesto', details: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  static async findById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const presupuesto = await PresupuestoService.findById(id);
      
      if (!presupuesto) {
        return res.status(404).json({ error: 'Presupuesto no encontrado' });
      }
      
  return res.json(presupuesto);
    } catch (error) {
  return res.status(500).json({ error: 'Error al buscar el presupuesto' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const presupuesto = await PresupuestoService.update(id, req.body);
  return res.json(presupuesto);
    } catch (error) {
  return res.status(500).json({ error: 'Error al actualizar el presupuesto' });
    }
  }

  static async updateEstado(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { estado } = req.body;
      
      // Validación laxa del estado; el servicio/migraciones garantizan valores válidos
      const allowedEstados = ['BORRADOR','ENVIADO','APROBADO','FACTURADO']
      if (!allowedEstados.includes(estado)) {
        return res.status(400).json({ error: 'Estado inválido' });
      }

      const presupuesto = await PresupuestoService.updateEstado(id, estado);
  return res.json(presupuesto);
    } catch (error) {
  return res.status(500).json({ error: 'Error al actualizar el estado del presupuesto' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await PresupuestoService.delete(id);
  return res.status(204).send();
    } catch (error) {
  return res.status(500).json({ error: 'Error al eliminar el presupuesto' });
    }
  }

  static async findAll(req: Request, res: Response) {
    try {
      const { clienteId, estado } = req.query;
      const presupuestos = await PresupuestoService.findAll(
        clienteId ? parseInt(clienteId as string) : undefined,
        (estado as string | undefined)
      );
  return res.json(presupuestos);
    } catch (error) {
  return res.status(500).json({ error: 'Error al obtener los presupuestos' });
    }
  }
}
