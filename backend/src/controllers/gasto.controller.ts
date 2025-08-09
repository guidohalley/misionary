import { Request, Response, NextFunction } from 'express';
import { gastoService } from '../services/gasto.service';
import { HttpError } from '../utils/http-error';

// Enum local para evitar problemas de importación
enum CategoriaGasto {
  OFICINA = 'OFICINA',
  PERSONAL = 'PERSONAL',
  MARKETING = 'MARKETING',
  TECNOLOGIA = 'TECNOLOGIA',
  SERVICIOS = 'SERVICIOS',
  TRANSPORTE = 'TRANSPORTE',
  COMUNICACION = 'COMUNICACION',
  OTROS = 'OTROS'
}

export class GastoController {
  // ─────────────────── GASTOS OPERATIVOS ─────────────────── 

  async getGastosOperativos(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        categoria,
        proveedorId,
        monedaId,
        fechaDesde,
        fechaHasta,
        esRecurrente,
        activo,
        search
      } = req.query;

      const filters: any = {};
      
      if (categoria) filters.categoria = categoria as CategoriaGasto;
      if (proveedorId) filters.proveedorId = parseInt(proveedorId as string);
      if (monedaId) filters.monedaId = parseInt(monedaId as string);
      if (fechaDesde) filters.fechaDesde = new Date(fechaDesde as string);
      if (fechaHasta) filters.fechaHasta = new Date(fechaHasta as string);
      if (esRecurrente !== undefined) filters.esRecurrente = esRecurrente === 'true';
      if (activo !== undefined) filters.activo = activo === 'true';
      if (search) filters.search = search as string;

      const gastos = await gastoService.getGastosOperativos(filters);
      
      res.json({
        success: true,
        data: gastos,
        message: 'Gastos operativos obtenidos exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }

  async getGastoOperativoById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const gasto = await gastoService.getGastoOperativoById(parseInt(id));
      
      res.json({
        success: true,
        data: gasto
      });
    } catch (error) {
      next(error);
    }
  }

  async createGastoOperativo(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        concepto,
        descripcion,
        monto,
        monedaId,
        fecha,
        categoria,
        esRecurrente,
        frecuencia,
        proveedorId,
        comprobante,
        observaciones
      } = req.body;

      // Validaciones básicas
      if (!concepto || !monto || !monedaId || !fecha || !categoria) {
        throw new HttpError(400, 'Los campos concepto, monto, monedaId, fecha y categoria son obligatorios');
      }

      if (monto <= 0) {
        throw new HttpError(400, 'El monto debe ser mayor a 0');
      }

      // Validar enum de categoría
      if (!Object.values(CategoriaGasto).includes(categoria)) {
        throw new HttpError(400, 'Categoría de gasto inválida');
      }

      const gastoData = {
        concepto,
        descripcion,
        monto: parseFloat(monto),
        monedaId: parseInt(monedaId),
        fecha: new Date(fecha),
        categoria: categoria as CategoriaGasto,
        esRecurrente: esRecurrente || false,
        frecuencia,
        proveedorId: proveedorId ? parseInt(proveedorId) : undefined,
        comprobante,
        observaciones
      };

      const nuevoGasto = await gastoService.createGastoOperativo(gastoData);
      
  return res.status(201).json({
        success: true,
        data: nuevoGasto,
        message: 'Gasto operativo creado exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }

  async updateGastoOperativo(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };

      // Validaciones si se proporcionan
      if (updateData.monto !== undefined && updateData.monto <= 0) {
        throw new HttpError(400, 'El monto debe ser mayor a 0');
      }

      if (updateData.categoria && !Object.values(CategoriaGasto).includes(updateData.categoria)) {
        throw new HttpError(400, 'Categoría de gasto inválida');
      }

      // Convertir tipos si es necesario
      if (updateData.monto) updateData.monto = parseFloat(updateData.monto);
      if (updateData.monedaId) updateData.monedaId = parseInt(updateData.monedaId);
      if (updateData.proveedorId) updateData.proveedorId = parseInt(updateData.proveedorId);
      if (updateData.fecha) updateData.fecha = new Date(updateData.fecha);

      const gastoActualizado = await gastoService.updateGastoOperativo(parseInt(id), updateData);
      
      res.json({
        success: true,
        data: gastoActualizado,
        message: 'Gasto operativo actualizado exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteGastoOperativo(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await gastoService.deleteGastoOperativo(parseInt(id));
      
      res.json({
        success: true,
        message: 'Gasto operativo eliminado exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }

  // ─────────────────── ASIGNACIONES A PROYECTOS ─────────────────── 

  async getAsignacionesPorGasto(req: Request, res: Response, next: NextFunction) {
    try {
      const { gastoId } = req.params;
      const asignaciones = await gastoService.getAsignacionesPorGasto(parseInt(gastoId));
      
      res.json({
        success: true,
        data: asignaciones,
        count: asignaciones.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getAsignacionesPorProyecto(req: Request, res: Response, next: NextFunction) {
    try {
      const { presupuestoId } = req.params;
      const asignaciones = await gastoService.getAsignacionesPorProyecto(parseInt(presupuestoId));
      
      res.json({
        success: true,
        data: asignaciones,
        count: asignaciones.length
      });
    } catch (error) {
      next(error);
    }
  }

  async createAsignacion(req: Request, res: Response, next: NextFunction) {
    try {
      const { gastoId, presupuestoId, porcentaje, justificacion } = req.body;

      // Validaciones básicas
      if (!gastoId || !presupuestoId || !porcentaje) {
        throw new HttpError(400, 'Los campos gastoId, presupuestoId y porcentaje son obligatorios');
      }

      if (porcentaje <= 0 || porcentaje > 100) {
        throw new HttpError(400, 'El porcentaje debe estar entre 0.01 y 100');
      }

      const asignacionData = {
        gastoId: parseInt(gastoId),
        presupuestoId: parseInt(presupuestoId),
        porcentaje: parseFloat(porcentaje),
        justificacion
      };

      const nuevaAsignacion = await gastoService.createAsignacion(asignacionData);
      
  return res.status(201).json({
        success: true,
        data: nuevaAsignacion,
        message: 'Asignación creada exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }

  async updateAsignacion(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };

      // Validaciones
      if (updateData.porcentaje !== undefined) {
        if (updateData.porcentaje <= 0 || updateData.porcentaje > 100) {
          throw new HttpError(400, 'El porcentaje debe estar entre 0.01 y 100');
        }
        updateData.porcentaje = parseFloat(updateData.porcentaje);
      }

      if (updateData.gastoId) updateData.gastoId = parseInt(updateData.gastoId);
      if (updateData.presupuestoId) updateData.presupuestoId = parseInt(updateData.presupuestoId);

      const asignacionActualizada = await gastoService.updateAsignacion(parseInt(id), updateData);
      
      res.json({
        success: true,
        data: asignacionActualizada,
        message: 'Asignación actualizada exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAsignacion(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await gastoService.deleteAsignacion(parseInt(id));
      
      res.json({
        success: true,
        message: 'Asignación eliminada exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }

  // ─────────────────── REPORTES Y ANÁLISIS ─────────────────── 

  async getResumenGastosPorCategoria(req: Request, res: Response, next: NextFunction) {
    try {
      const { fechaDesde, fechaHasta } = req.query;

      const fechaDesdeDate = fechaDesde ? new Date(fechaDesde as string) : undefined;
      const fechaHastaDate = fechaHasta ? new Date(fechaHasta as string) : undefined;

      const resumen = await gastoService.getResumenGastosPorCategoria(fechaDesdeDate, fechaHastaDate);
      
      res.json({
        success: true,
        data: resumen,
        filters: {
          fechaDesde: fechaDesdeDate,
          fechaHasta: fechaHastaDate
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getCostosOperativosPorProyecto(req: Request, res: Response, next: NextFunction) {
    try {
      const { presupuestoId } = req.params;
      const costos = await gastoService.getCostosOperativosPorProyecto(parseInt(presupuestoId));
      
      res.json({
        success: true,
        data: costos
      });
    } catch (error) {
      next(error);
    }
  }

  // ─────────────────── UTILITARIOS ─────────────────── 

  async getCategoriasGasto(_req: Request, res: Response, next: NextFunction) {
    try {
      const categorias = Object.values(CategoriaGasto).map((categoria: string) => ({
        value: categoria,
        label: categoria.toLowerCase().replace('_', ' ')
      }));
      
      res.json({
        success: true,
        data: categorias
      });
    } catch (error) {
      next(error);
    }
  }
}

export const gastoController = new GastoController();
