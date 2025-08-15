import { Request, Response } from 'express';
import { ProductoService } from '../services/producto.service';
import { RolUsuario } from '@prisma/client';

export class ProductoController {
  static async create(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      
      // Si es PROVEEDOR, asegurar que solo cree productos para sí mismo
      if (user.roles.includes(RolUsuario.PROVEEDOR) && !user.roles.includes(RolUsuario.ADMIN)) {
        req.body.proveedorId = user.id;
      }
      
      const producto = await ProductoService.create(req.body);
      return res.status(201).json(producto);
    } catch (error) {
      return res.status(500).json({ error: 'Error al crear el producto' });
    }
  }

  static async findById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const user = (req as any).user;
      
      const producto = await ProductoService.findById(id);
      
      if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      
      // Filtrar información sensible según el rol
      const productoResponse = ProductoController.filterSensitiveData(producto, user);
      
      return res.json(productoResponse);
    } catch (error) {
      return res.status(500).json({ error: 'Error al buscar el producto' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const user = (req as any).user;
      
      // Si es PROVEEDOR, verificar que solo actualice sus propios productos
      if (user.roles.includes(RolUsuario.PROVEEDOR) && !user.roles.includes(RolUsuario.ADMIN)) {
        const producto = await ProductoService.findById(id);
        if (!producto || producto.proveedorId !== user.id) {
          return res.status(403).json({ error: 'No tienes permiso para actualizar este producto' });
        }
        // Asegurar que no cambie el proveedor
        delete req.body.proveedorId;
      }
      
      const producto = await ProductoService.update(id, req.body);
      return res.json(producto);
    } catch (error) {
      return res.status(500).json({ error: 'Error al actualizar el producto' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const user = (req as any).user;
      
      // Si es PROVEEDOR, verificar que solo elimine sus propios productos
      if (user.roles.includes(RolUsuario.PROVEEDOR) && !user.roles.includes(RolUsuario.ADMIN)) {
        const producto = await ProductoService.findById(id);
        if (!producto || producto.proveedorId !== user.id) {
          return res.status(403).json({ error: 'No tienes permiso para eliminar este producto' });
        }
      }
      
      await ProductoService.delete(id);
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: 'Error al eliminar el producto' });
    }
  }

  static async findAll(req: Request, res: Response) {
    try {
      const { proveedorId } = req.query;
      const user = (req as any).user;
      
      let efectiveProveedorId = proveedorId ? parseInt(proveedorId as string) : undefined;
      
      // Si es PROVEEDOR, solo mostrar sus propios productos
      if (user.roles.includes(RolUsuario.PROVEEDOR) && !user.roles.includes(RolUsuario.ADMIN)) {
        efectiveProveedorId = user.id;
      }
      
      const productos = await ProductoService.findAll(efectiveProveedorId);
      
      // Filtrar información sensible según el rol
      const productosResponse = productos.map(producto => 
        ProductoController.filterSensitiveData(producto, user)
      );
      
      return res.json(productosResponse);
    } catch (error) {
      return res.status(500).json({ error: 'Error al obtener los productos' });
    }
  }

  /**
   * Filtra información sensible de productos según el rol del usuario
   */
  private static filterSensitiveData(producto: any, user: any) {
    // ADMIN y CONTADOR ven toda la información
    if (user.roles.includes(RolUsuario.ADMIN) || user.roles.includes(RolUsuario.CONTADOR)) {
      return producto;
    }
    
    // PROVEEDOR ve precios solo de sus propios productos
    if (user.roles.includes(RolUsuario.PROVEEDOR)) {
      if (producto.proveedorId === user.id) {
        // Es su propio producto, puede ver toda la información
        return producto;
      } else {
        // No es su producto, ocultar información sensible
        const { costoProveedor, margenAgencia, precio, ...productoSinPrecios } = producto;
        return {
          ...productoSinPrecios,
          costoProveedor: null,
          margenAgencia: null,
          precio: null
        };
      }
    }
    
    // Para otros roles, devolver sin precios por seguridad
    const { costoProveedor, margenAgencia, precio, ...productoSinPrecios } = producto;
    return {
      ...productoSinPrecios,
      costoProveedor: null,
      margenAgencia: null,
      precio: null
    };
  }
}
