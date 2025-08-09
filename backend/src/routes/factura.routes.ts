import { Router } from 'express';
import { FacturaController } from '../controllers/factura.controller';
import { auth } from '../middleware/auth';
import { checkRole } from '../middleware/checkRole';
import { RolUsuario } from '@prisma/client';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/',
  [auth, checkRole([RolUsuario.ADMIN, RolUsuario.CONTADOR])],
  asyncHandler(FacturaController.create)
);

router.get('/',
  [auth],
  asyncHandler(FacturaController.findAll)
);

router.get('/:id',
  [auth],
  asyncHandler(FacturaController.findById)
);

router.put('/:id',
  [auth, checkRole([RolUsuario.ADMIN, RolUsuario.CONTADOR])],
  asyncHandler(FacturaController.update)
);

router.post('/:id/anular',
  [auth, checkRole([RolUsuario.ADMIN])],
  asyncHandler(FacturaController.anular)
);

export default router;
