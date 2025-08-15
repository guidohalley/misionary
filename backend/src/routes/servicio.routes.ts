import { Router } from 'express';
import { ServicioController } from '../controllers/servicio.controller';
import { auth } from '../middleware/auth';
import { checkRole } from '../middleware/checkRole';
import { asyncHandler } from '../utils/asyncHandler';
import { RolUsuario } from '@prisma/client';

const router = Router();

// POST /servicios - Crear servicio (ADMIN y PROVEEDOR)
router.post('/', [auth, checkRole([RolUsuario.ADMIN, RolUsuario.PROVEEDOR])], asyncHandler(ServicioController.create));

// GET /servicios - Obtener servicios (todos los usuarios autenticados)
router.get('/', [auth], asyncHandler(ServicioController.findAll));

// GET /servicios/:id - Obtener servicio por ID (todos los usuarios autenticados)
router.get('/:id', [auth], asyncHandler(ServicioController.findById));

// PUT /servicios/:id - Actualizar servicio (ADMIN y PROVEEDOR - con restricciones)
router.put('/:id', [auth, checkRole([RolUsuario.ADMIN, RolUsuario.PROVEEDOR])], asyncHandler(ServicioController.update));

// DELETE /servicios/:id - Eliminar servicio (ADMIN - sin restricciones, PROVEEDOR - solo sus propios servicios)
router.delete('/:id', [auth, checkRole([RolUsuario.ADMIN, RolUsuario.PROVEEDOR])], asyncHandler(ServicioController.delete));

export default router;
