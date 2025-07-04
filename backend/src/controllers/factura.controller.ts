import { Request, Response, NextFunction } from 'express';
import { FacturaService } from '../services/factura.service';
import { EstadoFactura } from '@prisma/client';
import { HttpError } from '../utils/http-error';

export class FacturaController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const factura = await FacturaService.create(req.body);
      res.status(201).json(factura);
    } catch (error) {
      next(error);
    }
  }

  static async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const factura = await FacturaService.findById(id);
      res.json(factura);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const { estado, fecha } = req.body;

      if (estado && !Object.values(EstadoFactura).includes(estado)) {
        throw HttpError.BadRequest('Estado de factura inválido');
      }

      const factura = await FacturaService.update(id, { estado, fecha });
      res.json(factura);
    } catch (error) {
      next(error);
    }
  }

  static async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { estado, clienteId, fechaDesde, fechaHasta } = req.query;
      
      const filters: any = {};
      if (estado) filters.estado = estado as EstadoFactura;
      if (clienteId) filters.clienteId = parseInt(clienteId as string);
      if (fechaDesde) filters.fechaDesde = new Date(fechaDesde as string);
      if (fechaHasta) filters.fechaHasta = new Date(fechaHasta as string);

      const facturas = await FacturaService.findAll(filters);
      res.json(facturas);
    } catch (error) {
      next(error);
    }
  }

  static async anular(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const factura = await FacturaService.anular(id);
      res.json(factura);
    } catch (error) {
      next(error);
    }
  }
}
