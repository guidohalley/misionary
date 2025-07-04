import { Router } from 'express';
import { PresupuestoController } from '../controllers/presupuesto.controller';
import { auth } from '../middleware/auth';
import { checkRole } from '../middleware/checkRole';
import { RolUsuario } from '@prisma/client';

const router = Router();

router.post('/', 
  [auth, checkRole([RolUsuario.ADMIN, RolUsuario.CONTADOR])], 
  PresupuestoController.create
);

router.get('/', 
  [auth], 
  PresupuestoController.findAll
);

router.get('/:id', 
  [auth], 
  PresupuestoController.findById
);

router.put('/:id', 
  [auth, checkRole([RolUsuario.ADMIN, RolUsuario.CONTADOR])], 
  PresupuestoController.update
);

router.patch('/:id/estado', 
  [auth, checkRole([RolUsuario.ADMIN, RolUsuario.CONTADOR])], 
  PresupuestoController.updateEstado
);

router.delete('/:id', 
  [auth, checkRole([RolUsuario.ADMIN])], 
  PresupuestoController.delete
);

export default router;
