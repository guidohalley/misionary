import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { HttpError } from './http-error';

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Ejecutar todas las validaciones
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const formattedErrors = errors.array().map(error => ({
      field: error.param,
      message: error.msg
    }));

    throw new HttpError(400, 'Error de validación').withDetails(formattedErrors);
  };
};

// Extensión de HttpError para incluir detalles
declare module './http-error' {
  interface HttpError {
    details?: any;
    withDetails(details: any): HttpError;
  }
}

HttpError.prototype.withDetails = function(details: any) {
  this.details = details;
  return this;
};
