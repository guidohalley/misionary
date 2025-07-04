import { Router } from 'express';
import { ServicioController } from '../controllers/servicio.controller';
import { auth } from '../middleware/auth';
import { checkRole } from '../middleware/checkRole';
import { RolUsuario } from '@prisma/client';

const router = Router();

router.post('/', 
  [auth, checkRole([RolUsuario.ADMIN, RolUsuario.PROVEEDOR])], 
  ServicioController.create
);

router.get('/', 
  [auth], 
  ServicioController.findAll
);

router.get('/:id', 
  [auth], 
  ServicioController.findById
);

router.put('/:id', 
  [auth, checkRole([RolUsuario.ADMIN, RolUsuario.PROVEEDOR])], 
  ServicioController.update
);

router.delete('/:id', 
  [auth, checkRole([RolUsuario.ADMIN])], 
  ServicioController.delete
);

export default router;
