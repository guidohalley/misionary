import { Request, Response, NextFunction } from 'express';

export class ApiError extends Error {
  statusCode: number;
  
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: err.message
    });
  }

  console.error(err.stack);
  return res.status(500).json({
    error: 'Error interno del servidor'
  });
};
