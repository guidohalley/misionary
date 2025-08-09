import { Router } from 'express';
import { ServicioController } from '../controllers/servicio.controller';
import { auth } from '../middleware/auth';
import { checkRole } from '../middleware/checkRole';
import { asyncHandler } from '../utils/asyncHandler';
import { RolUsuario } from '@prisma/client';

const router = Router();

router.post('/', [auth, checkRole([RolUsuario.ADMIN, RolUsuario.PROVEEDOR])], asyncHandler(ServicioController.create));

router.get('/', [auth], asyncHandler(ServicioController.findAll));

router.get('/:id', [auth], asyncHandler(ServicioController.findById));

router.put('/:id', [auth, checkRole([RolUsuario.ADMIN, RolUsuario.PROVEEDOR])], asyncHandler(ServicioController.update));

router.delete('/:id', [auth, checkRole([RolUsuario.ADMIN])], asyncHandler(ServicioController.delete));

export default router;
