import { Request, Response } from 'express';
import { PersonaService } from '../services/persona.service';
import bcrypt from 'bcrypt';

export class PersonaController {
  static async create(req: Request, res: Response) {
    try {
      const { password, ...rest } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const persona = await PersonaService.create({
        ...rest,
        password: hashedPassword
      });
      
      res.status(201).json(persona);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear la persona' });
    }
  }

  static async findById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const persona = await PersonaService.findById(id);
      
      if (!persona) {
        return res.status(404).json({ error: 'Persona no encontrada' });
      }
      
      res.json(persona);
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar la persona' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { password, ...rest } = req.body;
      
      console.log('Datos recibidos para actualizar persona:', { id, body: req.body });
      
      let updateData: any = rest;
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateData.password = hashedPassword;
      }
      
      console.log('Datos para actualizar:', updateData);
      
      const persona = await PersonaService.update(id, updateData);
      console.log('Persona actualizada:', persona);
      res.json(persona);
    } catch (error) {
      console.error('Error en PersonaController.update:', error);
      res.status(500).json({ error: 'Error al actualizar la persona' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await PersonaService.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la persona' });
    }
  }

  static async findAll(req: Request, res: Response) {
    try {
      const { tipo } = req.query;
      const personas = await PersonaService.findAll(tipo as any);
      res.json(personas);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las personas' });
    }
  }
}
