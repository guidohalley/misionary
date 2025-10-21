import { Request, Response } from 'express';
import { PersonaService } from '../services/persona.service';
import bcrypt from 'bcrypt';
import { RolUsuario } from '@prisma/client';
import { body, validationResult } from 'express-validator';

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
      
  return res.status(201).json(persona);
    } catch (error) {
      console.error('Error en PersonaController.create:', error);
  return res.status(500).json({ error: 'Error al crear la persona' });
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
      const currentUser = (req as any).user;
      
      console.log('Datos recibidos para actualizar persona:', { id, body: req.body, updatedBy: currentUser.id });
      
      let updateData: any = rest;
      
      // Solo ADMIN puede cambiar tipos y roles
      if (!currentUser.roles.includes('ADMIN')) {
        return res.status(403).json({ 
          error: 'Solo los administradores pueden actualizar usuarios' 
        });
      }
      
      // Si se está cambiando el tipo, actualizar esUsuario y roles
      if (tipo) {
        updateData.tipo = tipo;
        updateData.esUsuario = tipo === 'INTERNO' || tipo === 'PROVEEDOR';
        
        // Actualizar roles según el tipo
        if (tipo === 'CLIENTE') {
          updateData.roles = [];
        } else if (tipo === 'PROVEEDOR') {
          // Para proveedores, permitir roles adicionales si se especifican
          // Por ejemplo, un proveedor podría también ser contador
          updateData.roles = roles && roles.length > 0 ? roles : ['PROVEEDOR'];
          // Asegurar que PROVEEDOR siempre esté incluido
          if (!updateData.roles.includes('PROVEEDOR')) {
            updateData.roles.push('PROVEEDOR');
          }
        } else if (tipo === 'INTERNO') {
          updateData.roles = roles && roles.length > 0 ? roles : ['ADMIN'];
        }
      } else if (roles) {
        // Si no se cambia el tipo pero se especifican roles, actualizarlos
        // (solo para usuarios que ya son del sistema)
        const currentPersona = await PersonaService.findById(id);
        if (currentPersona && currentPersona.esUsuario) {
          if (currentPersona.tipo === 'PROVEEDOR') {
            // Asegurar que PROVEEDOR siempre esté incluido
            updateData.roles = roles.includes('PROVEEDOR') ? roles : [...roles, 'PROVEEDOR'];
          } else {
            updateData.roles = roles;
          }
        }
      }
      
      // Solo procesar contraseña si se proporciona y es un usuario del sistema
      if (password) {
        const currentPersona = await PersonaService.findById(id);
        if (currentPersona && currentPersona.esUsuario) {
          const hashedPassword = await bcrypt.hash(password, 10);
          updateData.password = hashedPassword;
        }
      }
      
      console.log('Datos para actualizar:', updateData);
      
      const persona = await PersonaService.update(id, updateData);
      console.log('Persona actualizada:', persona);
      
      // No devolver la contraseña en la respuesta
      const { password: _, ...personaResponse } = persona;
      return res.json(personaResponse);
    } catch (error) {
      console.error('Error en PersonaController.update:', error);
      return res.status(500).json({ error: 'Error al actualizar la persona' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      // Verificar relaciones para decidir soft/hard delete
      const persona = await PersonaService.findById(id);
      if (!persona) {
        return res.status(404).json({ error: 'Persona no encontrada' });
      }

      const tieneRelaciones = Boolean(
        (persona as any).empresas?.length ||
        (persona as any).productos?.length ||
        (persona as any).servicios?.length ||
        (persona as any).presupuestos?.length ||
        (persona as any).recibos?.length
      );

      if (tieneRelaciones) {
        await PersonaService.update(id, { activo: false } as any);
        return res.status(200).json({ message: 'Persona desactivada exitosamente' });
      }

      await PersonaService.delete(id);
      return res.status(204).send();
    } catch (error) {
  return res.status(500).json({ error: 'Error al eliminar la persona' });
    }
  }

  static async findAll(req: Request, res: Response) {
    try {
      const { tipo } = req.query;
  const personas = await PersonaService.findAll(tipo as any);
  return res.json(personas);
    } catch (error) {
  return res.status(500).json({ error: 'Error al obtener las personas' });
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
      return res.status(201).json(result);
    } catch (error) {
      console.error('Error en PersonaController.createClienteWithEmpresa:', error);
      return res.status(500).json({ error: 'Error al crear el cliente con empresa' });
    }
  }

  /**
   * Actualizar roles específicos de un usuario (solo ADMIN)
   * PATCH /api/personas/:id/roles
   */
  static async updateRoles(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Datos de entrada inválidos',
          details: errors.array()
        });
      }

      const id = parseInt(req.params.id);
      const { roles } = req.body;
      const currentUser = (req as any).user;
      
      // Solo ADMIN puede actualizar roles
      if (!currentUser.roles.includes('ADMIN')) {
        return res.status(403).json({ 
          error: 'Solo los administradores pueden actualizar roles de usuario' 
        });
      }

      const persona = await PersonaService.findById(id);
      if (!persona) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      if (!persona.esUsuario) {
        return res.status(400).json({ 
          error: 'Solo se pueden actualizar roles de usuarios del sistema' 
        });
      }

      // Validar roles según el tipo de persona
      let validatedRoles = roles;
      if (persona.tipo === 'PROVEEDOR') {
        // Los proveedores siempre deben tener el rol PROVEEDOR
        validatedRoles = roles.includes('PROVEEDOR') ? roles : [...roles, 'PROVEEDOR'];
      }

      const updatedPersona = await PersonaService.update(id, { roles: validatedRoles });
      
      // No devolver la contraseña en la respuesta
      const { password: _, ...personaResponse } = updatedPersona;
      
      console.log(`Roles actualizados para usuario ${id}:`, {
        before: persona.roles,
        after: validatedRoles,
        updatedBy: currentUser.id
      });

      return res.json({
        success: true,
        message: 'Roles actualizados correctamente',
        data: personaResponse
      });
    } catch (error) {
      console.error('Error en PersonaController.updateRoles:', error);
      return res.status(500).json({ error: 'Error al actualizar los roles del usuario' });
    }
  }

  /**
   * Resetear contraseña de un usuario (solo ADMIN)
   * POST /api/personas/:id/reset-password
   */
  static async resetPassword(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Datos de entrada inválidos',
          details: errors.array()
        });
      }

      const id = parseInt(req.params.id);
      const { password } = req.body;
      const currentUser = (req as any).user;
      
      // Solo ADMIN puede resetear contraseñas
      if (!currentUser.roles.includes('ADMIN')) {
        return res.status(403).json({ 
          error: 'Solo los administradores pueden resetear contraseñas' 
        });
      }

      const persona = await PersonaService.findById(id);
      if (!persona) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      if (!persona.esUsuario) {
        return res.status(400).json({ 
          error: 'Solo se puede resetear la contraseña de usuarios del sistema' 
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await PersonaService.update(id, { password: hashedPassword });
      
      console.log(`Contraseña reseteada para usuario ${id} por admin ${currentUser.id}`);

      return res.json({
        success: true,
        message: 'Contraseña reseteada correctamente'
      });
    } catch (error) {
      console.error('Error en PersonaController.resetPassword:', error);
      return res.status(500).json({ error: 'Error al resetear la contraseña del usuario' });
    }
  }
}

// Validaciones para los endpoints
export const validarRoles = [
  body('roles')
    .isArray({ min: 1 })
    .withMessage('Se debe proporcionar al menos un rol'),
  body('roles.*')
    .isIn(['ADMIN', 'CONTADOR', 'PROVEEDOR'])
    .withMessage('Rol inválido. Valores permitidos: ADMIN, CONTADOR, PROVEEDOR')
];

export const validarResetPassword = [
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
    .withMessage('La contraseña debe contener al menos una letra y un número')
];
