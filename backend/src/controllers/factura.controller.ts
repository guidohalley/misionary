import { Request, Response, NextFunction } from 'express';
import { FacturaService } from '../services/factura.service';
import { EstadoFactura } from '@prisma/client';
import { HttpError } from '../utils/http-error';
import { toNumber, isValidCurrencyValue, roundCurrency, currencyEquals } from '../utils/currency';

export class FacturaController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { subtotal, impuestos, total, ...rest } = req.body;
      
      // Validar que sean números válidos
      const subtotalNum = toNumber(subtotal, NaN);
      const impuestosNum = toNumber(impuestos, NaN);
      const totalNum = toNumber(total, NaN);
      
      // Validar rangos
      if (!isValidCurrencyValue(subtotalNum, false, false)) {
        throw HttpError.BadRequest('Subtotal inválido o negativo');
      }
      
      if (!isValidCurrencyValue(impuestosNum, true, false)) {
        throw HttpError.BadRequest('Impuestos inválidos o negativos');
      }
      
      if (!isValidCurrencyValue(totalNum, false, false)) {
        throw HttpError.BadRequest('Total inválido o negativo');
      }
      
      // Validar coherencia: subtotal + impuestos = total
      const totalCalculado = roundCurrency(subtotalNum + impuestosNum, 2);
      if (!currencyEquals(totalCalculado, totalNum, 0.01)) {
        throw HttpError.BadRequest(
          `Total inconsistente. Calculado: ${totalCalculado}, recibido: ${totalNum}`
        );
      }
      
      const factura = await FacturaService.create({
        ...rest,
        subtotal: subtotalNum,
        impuestos: impuestosNum,
        total: totalNum,
      });
      
      return res.status(201).json(factura);
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
