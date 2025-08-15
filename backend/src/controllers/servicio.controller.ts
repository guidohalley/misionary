import { Request, Response } from 'express';
import { ServicioService } from '../services/servicio.service';
import { RolUsuario } from '@prisma/client';

export class ServicioController {
  static async create(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      
      // Si es PROVEEDOR, asegurar que solo cree servicios para sí mismo
      if (user.roles.includes(RolUsuario.PROVEEDOR) && !user.roles.includes(RolUsuario.ADMIN)) {
        req.body.proveedorId = user.id;
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
      
      // Si es PROVEEDOR, verificar que solo actualice sus propios servicios
      if (user.roles.includes(RolUsuario.PROVEEDOR) && !user.roles.includes(RolUsuario.ADMIN)) {
        const servicio = await ServicioService.findById(id);
        if (!servicio || servicio.proveedorId !== user.id) {
          return res.status(403).json({ error: 'No tienes permiso para actualizar este servicio' });
        }
        // Asegurar que no cambie el proveedor
        delete req.body.proveedorId;
      }
      
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
      const user = (req as any).user;
      
      // Si es PROVEEDOR, verificar que solo elimine sus propios servicios
      if (user.roles.includes(RolUsuario.PROVEEDOR) && !user.roles.includes(RolUsuario.ADMIN)) {
        const servicio = await ServicioService.findById(id);
        if (!servicio || servicio.proveedorId !== user.id) {
          return res.status(403).json({ error: 'No tienes permiso para eliminar este servicio' });
        }
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
      
      // Si es PROVEEDOR, solo mostrar sus propios servicios
      if (user.roles.includes(RolUsuario.PROVEEDOR) && !user.roles.includes(RolUsuario.ADMIN)) {
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
