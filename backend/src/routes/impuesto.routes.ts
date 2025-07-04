import { Router } from 'express';
import { ImpuestoController } from '../controllers/impuesto.controller';
import { auth } from '../middleware/auth';

const router = Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(auth);

// Rutas para CRUD de impuestos
router.post('/', ImpuestoController.create);
router.get('/', ImpuestoController.findAll);
router.get('/:id', ImpuestoController.findById);
router.put('/:id', ImpuestoController.update);
router.delete('/:id', ImpuestoController.delete);
router.patch('/:id/toggle', ImpuestoController.toggle);

export default router;
