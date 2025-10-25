import { Request, Response, NextFunction } from 'express';
import { toNumber, isValidCurrencyValue } from '../utils/currency';
import { HttpError } from '../utils/http-error';

/**
 * Middleware para validar campos monetarios en el body de la petición
 * 
 * @param fields Array de nombres de campos a validar
 * @returns Middleware de Express
 * 
 * @example
 * router.post('/recibos', validateMoneyFields(['monto']), postRecibo);
 * router.post('/facturas', validateMoneyFields(['subtotal', 'total']), createFactura);
 */
export function validateMoneyFields(fields: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      for (const field of fields) {
        if (req.body[field] !== undefined && req.body[field] !== null) {
          const value = toNumber(req.body[field], NaN);
          
          if (!isValidCurrencyValue(value, false, false)) {
            throw HttpError.BadRequest(
              `El campo "${field}" debe ser un número positivo válido. Recibido: ${req.body[field]}`
            );
          }
          
          // Normalizar el valor a número en el body
          req.body[field] = value;
        }
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Middleware para validar campos monetarios opcionales
 * Permite valores undefined/null pero valida si están presentes
 * 
 * @param fields Array de nombres de campos a validar
 * @returns Middleware de Express
 */
export function validateOptionalMoneyFields(fields: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      for (const field of fields) {
        if (req.body[field] !== undefined && req.body[field] !== null && req.body[field] !== '') {
          const value = toNumber(req.body[field], NaN);
          
          if (!isValidCurrencyValue(value, true, false)) {
            throw HttpError.BadRequest(
              `El campo opcional "${field}" debe ser un número válido no negativo. Recibido: ${req.body[field]}`
            );
          }
          
          req.body[field] = value;
        }
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Middleware para validar porcentajes (0-100)
 * 
 * @param fields Array de nombres de campos a validar
 * @returns Middleware de Express
 */
export function validatePercentageFields(fields: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      for (const field of fields) {
        if (req.body[field] !== undefined && req.body[field] !== null) {
          const value = toNumber(req.body[field], NaN);
          
          if (!Number.isFinite(value) || value < 0 || value > 100) {
            throw HttpError.BadRequest(
              `El campo "${field}" debe ser un porcentaje entre 0 y 100. Recibido: ${req.body[field]}`
            );
          }
          
          req.body[field] = value;
        }
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}


