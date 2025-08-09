import { Router } from 'express';
import { ProductoController } from '../controllers/producto.controller';
import { auth } from '../middleware/auth';
import { checkRole } from '../middleware/checkRole';
import { asyncHandler } from '../utils/asyncHandler';
import { RolUsuario } from '@prisma/client';

const router = Router();

router.post('/', [auth, checkRole([RolUsuario.ADMIN, RolUsuario.PROVEEDOR])], asyncHandler(ProductoController.create));

router.get('/', [auth], asyncHandler(ProductoController.findAll));

router.get('/:id', [auth], asyncHandler(ProductoController.findById));

router.put('/:id', [auth, checkRole([RolUsuario.ADMIN, RolUsuario.PROVEEDOR])], asyncHandler(ProductoController.update));

router.delete('/:id', [auth, checkRole([RolUsuario.ADMIN, RolUsuario.PROVEEDOR])], asyncHandler(ProductoController.delete));

export default router;
