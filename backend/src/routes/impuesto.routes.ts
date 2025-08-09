import { Router } from 'express';
import { ImpuestoController } from '../controllers/impuesto.controller';
import { auth } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(auth);

// Rutas para CRUD de impuestos
router.post('/', asyncHandler(ImpuestoController.create));
router.get('/', asyncHandler(ImpuestoController.findAll));
router.get('/:id', asyncHandler(ImpuestoController.findById));
router.put('/:id', asyncHandler(ImpuestoController.update));
router.delete('/:id', asyncHandler(ImpuestoController.delete));
router.patch('/:id/toggle', asyncHandler(ImpuestoController.toggle));

export default router;
