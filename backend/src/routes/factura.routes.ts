import { Router } from 'express';
import { FacturaController } from '../controllers/factura.controller';
import { auth } from '../middleware/auth';
import { checkRole } from '../middleware/checkRole';
import { RolUsuario } from '@prisma/client';

const router = Router();

router.post('/',
  [auth, checkRole([RolUsuario.ADMIN, RolUsuario.CONTADOR])],
  FacturaController.create
);

router.get('/',
  [auth],
  FacturaController.findAll
);

router.get('/:id',
  [auth],
  FacturaController.findById
);

router.put('/:id',
  [auth, checkRole([RolUsuario.ADMIN, RolUsuario.CONTADOR])],
  FacturaController.update
);

router.post('/:id/anular',
  [auth, checkRole([RolUsuario.ADMIN])],
  FacturaController.anular
);

export default router;
