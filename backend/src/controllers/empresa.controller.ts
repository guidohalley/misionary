import { Request, Response, NextFunction } from 'express';
import { EmpresaService } from '../services/empresa.service';
import { HttpError } from '../utils/http-error';
import { validationResult } from 'express-validator';

export const empresaController = {
  async getAllEmpresas(req: Request, res: Response, next: NextFunction) {
    try {
      const { clienteId, activo } = req.query;
      
      const filters: any = {};
      if (clienteId) filters.clienteId = parseInt(clienteId as string);
      if (activo !== undefined) filters.activo = activo === 'true';

      const empresas = await EmpresaService.findAll(filters);
      res.json(empresas);
    } catch (error) {
      next(error);
    }
  },

  async getEmpresaById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const empresa = await EmpresaService.findById(parseInt(id));
      
      if (!empresa) {
        throw new HttpError(404, 'Empresa no encontrada');
      }
      
      res.json(empresa);
    } catch (error) {
      next(error);
    }
  },

  async getEmpresasByCliente(req: Request, res: Response, next: NextFunction) {
    try {
      const { clienteId } = req.params;
      const empresas = await EmpresaService.findByClienteId(parseInt(clienteId));
      res.json(empresas);
    } catch (error) {
      next(error);
    }
  },

  async createEmpresa(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new HttpError(400, 'Datos de entrada inválidos');
      }

      const { nombre, razonSocial, cuit, telefono, email, direccion, clienteId } = req.body;

      // Verificar si ya existe una empresa con el mismo CUIT
      if (cuit) {
        const existingEmpresa = await EmpresaService.findByCuit(cuit);
        if (existingEmpresa) {
          throw new HttpError(400, 'Ya existe una empresa con este CUIT');
        }
      }

      const nuevaEmpresa = await EmpresaService.create({
        nombre,
        razonSocial,
        cuit,
        telefono,
        email,
        direccion,
        clienteId: parseInt(clienteId)
      });

  return res.status(201).json(nuevaEmpresa);
    } catch (error) {
      next(error);
    }
  },

  async updateEmpresa(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.error('Validation errors:', errors.array());
        throw new HttpError(400, 'Datos de entrada inválidos');
      }

      const { id } = req.params;
      const updateData = req.body;

      console.log('Updating empresa with ID:', id, 'Data:', updateData);

      // Verificar si la empresa existe
      const existingEmpresa = await EmpresaService.findById(parseInt(id));
      if (!existingEmpresa) {
        console.error('Empresa not found with ID:', id);
        throw new HttpError(404, 'Empresa no encontrada');
      }

      // Verificar CUIT duplicado si se está actualizando
      if (updateData.cuit && updateData.cuit.trim() !== '' && updateData.cuit !== existingEmpresa.cuit) {
        const duplicateEmpresa = await EmpresaService.findByCuit(updateData.cuit);
        if (duplicateEmpresa) {
          throw new HttpError(400, 'Ya existe una empresa con este CUIT');
        }
      }

      // Limpiar datos vacíos
      const cleanedData = Object.fromEntries(
        Object.entries(updateData).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
      );

      console.log('Cleaned data for update:', cleanedData);

      const empresaActualizada = await EmpresaService.update(parseInt(id), cleanedData);
      console.log('Empresa updated successfully:', empresaActualizada.id);
      res.json(empresaActualizada);
    } catch (error) {
      console.error('Error updating empresa:', error);
      next(error);
    }
  },

  async deleteEmpresa(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      // Verificar si la empresa existe
      const empresa = await EmpresaService.findById(parseInt(id));
      if (!empresa) {
        throw new HttpError(404, 'Empresa no encontrada');
      }

      // Verificar si tiene presupuestos o facturas asociadas
      if (empresa.presupuestos.length > 0 || empresa.facturas.length > 0) {
        // Soft delete si tiene relaciones
        await EmpresaService.update(parseInt(id), { activo: false });
        res.json({ message: 'Empresa desactivada exitosamente' });
      } else {
        // Hard delete si no tiene relaciones
        await EmpresaService.delete(parseInt(id));
        res.json({ message: 'Empresa eliminada exitosamente' });
      }
    } catch (error) {
      next(error);
    }
  },

  async searchEmpresas(req: Request, res: Response, next: NextFunction) {
    try {
      const { q } = req.query;
      
      if (!q || typeof q !== 'string') {
        throw new HttpError(400, 'Parámetro de búsqueda requerido');
      }

      // Implementar búsqueda básica por nombre, razón social o CUIT
      const empresas = await EmpresaService.findAll({});
      const filteredEmpresas = empresas.filter((empresa: any) => 
        empresa.nombre.toLowerCase().includes(q.toLowerCase()) ||
        (empresa.razonSocial && empresa.razonSocial.toLowerCase().includes(q.toLowerCase())) ||
        (empresa.cuit && empresa.cuit.includes(q)) ||
        empresa.cliente.nombre.toLowerCase().includes(q.toLowerCase())
      );

      res.json(filteredEmpresas);
    } catch (error) {
      next(error);
    }
  }
};
