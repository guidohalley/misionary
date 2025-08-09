import { Response, NextFunction, RequestHandler } from 'express';
import { RolUsuario } from '@prisma/client';
import { AuthRequest } from './auth';

export const checkRole = (roles: (RolUsuario | string)[]): RequestHandler => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      const user = req.user;
      if (!user || !user.roles) {
        res.status(403).json({ error: 'Acceso denegado' });
        return;
      }

      const hasRole = user.roles.some((role: RolUsuario | string) =>
        roles.includes(role as any)
      );

      if (!hasRole) {
        res.status(403).json({ error: 'No tienes los permisos necesarios' });
        return;
      }

      next();
    } catch (error) {
      res.status(500).json({ error: 'Error al verificar permisos' });
    }
  };
};
