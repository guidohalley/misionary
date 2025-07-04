import { Request, Response, NextFunction } from 'express';
import { RolUsuario } from '@prisma/client';
import { AuthRequest } from './auth';

export const checkRole = (roles: RolUsuario[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      
      if (!user || !user.roles) {
        return res.status(403).json({ error: 'Acceso denegado' });
      }

      const hasRole = user.roles.some((role: RolUsuario) => roles.includes(role));
      
      if (!hasRole) {
        return res.status(403).json({ error: 'No tienes los permisos necesarios' });
      }

      next();
    } catch (error) {
      res.status(500).json({ error: 'Error al verificar permisos' });
    }
  };
};
