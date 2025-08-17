import { Request, Response } from 'express';
import { ServicioService } from '../services/servicio.service';
import { RolUsuario } from '@prisma/client';

export class ServicioController {
  static async create(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      
      // Lógica de permisos para creación de servicios
      if (user.roles.includes(RolUsuario.ADMIN)) {
        // ADMIN puede crear servicios para cualquier proveedor
        // No modificamos req.body.proveedorId, respetamos lo enviado
      } else if (user.roles.includes(RolUsuario.PROVEEDOR)) {
        // PROVEEDOR solo puede crear servicios para sí mismo
        if (req.body.proveedorId && req.body.proveedorId !== user.id) {
          return res.status(403).json({ 
            error: 'No tienes permiso para crear servicios para otros proveedores' 
          });
        }
        // Asegurar que el servicio sea para el usuario actual
        req.body.proveedorId = user.id;
      } else {
        return res.status(403).json({ 
          error: 'No tienes permisos para crear servicios' 
        });
      }
      
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
      const user = (req as any).user;
      
      const servicio = await ServicioService.findById(id);
      
      if (!servicio) {
        return res.status(404).json({ error: 'Servicio no encontrado' });
      }
      
      // Filtrar información sensible según el rol
      const servicioResponse = ServicioController.filterSensitiveData(servicio, user);
      
      return res.json(servicioResponse);
    } catch (error) {
      console.error('Error en ServicioController.findById:', error);
      return res.status(500).json({ error: 'Error al buscar el servicio' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const user = (req as any).user;
      
      const servicio = await ServicioService.findById(id);
      if (!servicio) {
        return res.status(404).json({ error: 'Servicio no encontrado' });
      }
      
      // Lógica de permisos para actualización
      if (user.roles.includes(RolUsuario.ADMIN)) {
        // ADMIN puede actualizar cualquier servicio
        // No aplicamos restricciones
      } else if (user.roles.includes(RolUsuario.PROVEEDOR)) {
        // PROVEEDOR solo puede actualizar sus propios servicios
        if (servicio.proveedorId !== user.id) {
          return res.status(403).json({ 
            error: 'No tienes permiso para actualizar este servicio' 
          });
        }
        // Verificar que no intente cambiar el proveedor a otro
        if (req.body.proveedorId && req.body.proveedorId !== user.id) {
          return res.status(403).json({ 
            error: 'No puedes cambiar el proveedor a otro usuario' 
          });
        }
        // Asegurar que el proveedor siga siendo el usuario actual
        req.body.proveedorId = user.id;
      } else {
        return res.status(403).json({ 
          error: 'No tienes permisos para actualizar servicios' 
        });
      }
      
      const servicioActualizado = await ServicioService.update(id, req.body);
      return res.json(servicioActualizado);
    } catch (error) {
      console.error('Error en ServicioController.update:', error);
      return res.status(500).json({ error: 'Error al actualizar el servicio' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const user = (req as any).user;
      
      const servicio = await ServicioService.findById(id);
      if (!servicio) {
        return res.status(404).json({ error: 'Servicio no encontrado' });
      }
      
      // Lógica de permisos para eliminación
      if (user.roles.includes(RolUsuario.ADMIN)) {
        // ADMIN puede eliminar cualquier servicio
        // No aplicamos restricciones
      } else if (user.roles.includes(RolUsuario.PROVEEDOR)) {
        // PROVEEDOR solo puede eliminar sus propios servicios
        if (servicio.proveedorId !== user.id) {
          return res.status(403).json({ 
            error: 'No tienes permiso para eliminar este servicio' 
          });
        }
      } else {
        return res.status(403).json({ 
          error: 'No tienes permisos para eliminar servicios' 
        });
      }
      
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
      const user = (req as any).user;
      
      let efectiveProveedorId = proveedorId ? parseInt(proveedorId as string) : undefined;
      
      // Lógica de permisos para listado
      if (user.roles.includes(RolUsuario.ADMIN)) {
        // ADMIN puede ver todos los servicios, respetar filtro enviado
        // efectiveProveedorId ya está configurado del query param
      } else if (user.roles.includes(RolUsuario.PROVEEDOR)) {
        // PROVEEDOR solo puede ver sus propios servicios
        efectiveProveedorId = user.id;
      }
      
      const servicios = await ServicioService.findAll(efectiveProveedorId);
      
      // Filtrar información sensible según el rol
      const serviciosResponse = servicios.map(servicio => 
        ServicioController.filterSensitiveData(servicio, user)
      );
      
      return res.json(serviciosResponse);
    } catch (error) {
      console.error('Error en ServicioController.findAll:', error);
      return res.status(500).json({ error: 'Error al obtener los servicios' });
    }
  }

  /**
   * Filtra información sensible de servicios según el rol del usuario
   */
  private static filterSensitiveData(servicio: any, user: any) {
    // ADMIN y CONTADOR ven toda la información
    if (user.roles.includes(RolUsuario.ADMIN) || user.roles.includes(RolUsuario.CONTADOR)) {
      return servicio;
    }
    
    // PROVEEDOR ve precios solo de sus propios servicios
    if (user.roles.includes(RolUsuario.PROVEEDOR)) {
      if (servicio.proveedorId === user.id) {
        // Es su propio servicio, puede ver toda la información
        return servicio;
      } else {
        // No es su servicio, ocultar información sensible
        const { costoProveedor, margenAgencia, precio, ...servicioSinPrecios } = servicio;
        return {
          ...servicioSinPrecios,
          costoProveedor: null,
          margenAgencia: null,
          precio: null
        };
      }
    }
    
    // Para otros roles, devolver sin precios por seguridad
    const { costoProveedor, margenAgencia, precio, ...servicioSinPrecios } = servicio;
    return {
      ...servicioSinPrecios,
      costoProveedor: null,
      margenAgencia: null,
      precio: null
    };
  }
}
