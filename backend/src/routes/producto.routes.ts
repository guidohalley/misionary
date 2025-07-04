import { Router } from 'express';
import { ProductoController } from '../controllers/producto.controller';
import { auth } from '../middleware/auth';
import { checkRole } from '../middleware/checkRole';
import { RolUsuario } from '@prisma/client';

const router = Router();

router.post('/', 
  [auth, checkRole([RolUsuario.ADMIN, RolUsuario.PROVEEDOR])], 
  ProductoController.create
);

router.get('/', 
  [auth], 
  ProductoController.findAll
);

router.get('/:id', 
  [auth], 
  ProductoController.findById
);

router.put('/:id', 
  [auth, checkRole([RolUsuario.ADMIN, RolUsuario.PROVEEDOR])], 
  ProductoController.update
);

router.delete('/:id', 
  [auth, checkRole([RolUsuario.ADMIN, RolUsuario.PROVEEDOR])], 
  ProductoController.delete
);

export default router;
