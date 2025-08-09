import { Router } from 'express';
import { PersonaController } from '../controllers/persona.controller';
import { auth } from '../middleware/auth';
import { checkRole } from '../middleware/checkRole';
import { RolUsuario } from '@prisma/client';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/', [auth, checkRole([RolUsuario.ADMIN])], asyncHandler(PersonaController.create));

router.get('/', [auth], asyncHandler(PersonaController.findAll));

router.get('/:id', [auth], asyncHandler(PersonaController.findById));

router.put('/:id', [auth, checkRole([RolUsuario.ADMIN])], asyncHandler(PersonaController.update));

router.delete('/:id', [auth, checkRole([RolUsuario.ADMIN])], asyncHandler(PersonaController.delete));

router.post('/cliente-con-empresa', [auth, checkRole([RolUsuario.ADMIN])], asyncHandler(PersonaController.createClienteWithEmpresa));

export default router;
