import { Router } from 'express';
import { PersonaController, validarRoles, validarResetPassword } from '../controllers/persona.controller';
import { auth } from '../middleware/auth';
import { checkRole } from '../middleware/checkRole';
import { RolUsuario } from '@prisma/client';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// Crear persona (solo ADMIN)
router.post('/', [auth, checkRole([RolUsuario.ADMIN])], asyncHandler(PersonaController.create));

// Obtener todas las personas (todos los usuarios autenticados)
router.get('/', [auth], asyncHandler(PersonaController.findAll));

// Obtener persona por ID (todos los usuarios autenticados)
router.get('/:id', [auth], asyncHandler(PersonaController.findById));

// Actualizar persona completa (solo ADMIN)
router.put('/:id', [auth, checkRole([RolUsuario.ADMIN])], asyncHandler(PersonaController.update));

// Actualizar roles específicos de un usuario (solo ADMIN)
router.patch('/:id/roles', [auth, checkRole([RolUsuario.ADMIN]), ...validarRoles], asyncHandler(PersonaController.updateRoles));

// Resetear contraseña de un usuario (solo ADMIN)
router.post('/:id/reset-password', [auth, checkRole([RolUsuario.ADMIN]), ...validarResetPassword], asyncHandler(PersonaController.resetPassword));

// Eliminar persona (solo ADMIN)
router.delete('/:id', [auth, checkRole([RolUsuario.ADMIN])], asyncHandler(PersonaController.delete));

// Crear cliente con empresa (solo ADMIN)
router.post('/cliente-con-empresa', [auth, checkRole([RolUsuario.ADMIN])], asyncHandler(PersonaController.createClienteWithEmpresa));

export default router;
