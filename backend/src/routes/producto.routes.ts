import { Router } from 'express';
import { ProductoController } from '../controllers/producto.controller';
import { auth } from '../middleware/auth';
import { checkRole } from '../middleware/checkRole';
import { asyncHandler } from '../utils/asyncHandler';
import { RolUsuario } from '@prisma/client';

const router = Router();

// POST /productos - Crear producto (ADMIN y PROVEEDOR)
router.post('/', [auth, checkRole([RolUsuario.ADMIN, RolUsuario.PROVEEDOR])], asyncHandler(ProductoController.create));

// GET /productos - Obtener productos (todos los usuarios autenticados)
router.get('/', [auth], asyncHandler(ProductoController.findAll));

// GET /productos/:id - Obtener producto por ID (todos los usuarios autenticados)
router.get('/:id', [auth], asyncHandler(ProductoController.findById));

// PUT /productos/:id - Actualizar producto (ADMIN y PROVEEDOR - con restricciones)
router.put('/:id', [auth, checkRole([RolUsuario.ADMIN, RolUsuario.PROVEEDOR])], asyncHandler(ProductoController.update));

// DELETE /productos/:id - Eliminar producto (ADMIN - sin restricciones, PROVEEDOR - solo sus propios productos)
router.delete('/:id', [auth, checkRole([RolUsuario.ADMIN, RolUsuario.PROVEEDOR])], asyncHandler(ProductoController.delete));

export default router;
