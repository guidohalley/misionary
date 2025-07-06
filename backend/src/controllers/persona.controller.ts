import { Request, Response } from 'express';
import { PersonaService } from '../services/persona.service';
import bcrypt from 'bcrypt';

export class PersonaController {
  static async create(req: Request, res: Response) {
    try {
      const { password, tipo, roles, ...rest } = req.body;
      
      // Determinar si es usuario del sistema según el tipo
      const esUsuario = tipo === 'INTERNO' || tipo === 'PROVEEDOR';
      
      // Determinar roles automáticamente según el tipo
      let rolesFinales = [];
      if (tipo === 'CLIENTE') {
        rolesFinales = []; // Clientes no tienen roles
      } else if (tipo === 'PROVEEDOR') {
        rolesFinales = ['PROVEEDOR']; // Proveedores automáticamente tienen rol PROVEEDOR
      } else if (tipo === 'INTERNO') {
        rolesFinales = roles || ['ADMIN']; // Internos pueden tener ADMIN o CONTADOR
      }
      
      let hashedPassword = null;
      if (password && esUsuario) {
        hashedPassword = await bcrypt.hash(password, 10);
      }
      
      const persona = await PersonaService.create({
        ...rest,
        tipo,
        roles: rolesFinales,
        password: hashedPassword,
        esUsuario,
        activo: true
      });
      
      res.status(201).json(persona);
    } catch (error) {
      console.error('Error en PersonaController.create:', error);
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
      
      return res.json(persona);
    } catch (error) {
      console.error('Error en PersonaController.findById:', error);
      return res.status(500).json({ error: 'Error al buscar la persona' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { password, tipo, roles, ...rest } = req.body;
      
      console.log('Datos recibidos para actualizar persona:', { id, body: req.body });
      
      let updateData: any = rest;
      
      // Si se está cambiando el tipo, actualizar esUsuario y roles
      if (tipo) {
        updateData.tipo = tipo;
        updateData.esUsuario = tipo === 'INTERNO' || tipo === 'PROVEEDOR';
        
        // Actualizar roles según el tipo
        if (tipo === 'CLIENTE') {
          updateData.roles = [];
        } else if (tipo === 'PROVEEDOR') {
          updateData.roles = ['PROVEEDOR'];
        } else if (tipo === 'INTERNO') {
          updateData.roles = roles || ['ADMIN'];
        }
      }
      
      // Solo procesar contraseña si se proporciona y es un usuario del sistema
      if (password && (updateData.tipo === 'INTERNO' || updateData.tipo === 'PROVEEDOR')) {
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

  static async createClienteWithEmpresa(req: Request, res: Response) {
    try {
      const { cliente, empresa } = req.body;
      
      // Preparar datos del cliente
      const clienteData = {
        ...cliente,
        tipo: 'CLIENTE' as const,
        roles: [] as any[],
        esUsuario: false,
        activo: true
      };

      // Hashear password si se proporciona
      if (cliente.password) {
        clienteData.password = await bcrypt.hash(cliente.password, 10);
      }

      const result = await PersonaService.createClienteWithEmpresa(clienteData, empresa);
      res.status(201).json(result);
    } catch (error) {
      console.error('Error en PersonaController.createClienteWithEmpresa:', error);
      res.status(500).json({ error: 'Error al crear el cliente con empresa' });
    }
  }
}
