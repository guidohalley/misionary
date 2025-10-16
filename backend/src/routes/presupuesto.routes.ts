import { Router } from 'express';
import { PresupuestoController } from '../controllers/presupuesto.controller';
import { auth } from '../middleware/auth';
import { checkRole } from '../middleware/checkRole';
import { RolUsuario } from '@prisma/client';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/', 
  [auth, checkRole([RolUsuario.ADMIN, RolUsuario.CONTADOR, RolUsuario.PROVEEDOR])], 
  asyncHandler(PresupuestoController.create)
);

router.get('/', 
  [auth], 
  asyncHandler(PresupuestoController.findAll)
);

router.get('/:id', 
  [auth], 
  asyncHandler(PresupuestoController.findById)
);

router.put('/:id', 
  [auth, checkRole([RolUsuario.ADMIN, RolUsuario.CONTADOR, RolUsuario.PROVEEDOR])], 
  asyncHandler(PresupuestoController.update)
);

router.patch('/:id/estado', 
  [auth, checkRole([RolUsuario.ADMIN, RolUsuario.CONTADOR])], 
  asyncHandler(PresupuestoController.updateEstado)
);

router.delete('/:id', 
  [auth, checkRole([RolUsuario.ADMIN])], 
  asyncHandler(PresupuestoController.delete)
);

export default router;
