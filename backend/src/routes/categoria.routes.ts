import { Router } from 'express';
import { categoriaController } from '../controllers/categoria.controller';
import { auth } from '../middleware/auth';
import { checkRole } from '../middleware/checkRole';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', [auth], asyncHandler(categoriaController.list));
router.get('/:id', [auth], asyncHandler(categoriaController.getById));
router.post('/', [auth, checkRole(['ADMIN'])], asyncHandler(categoriaController.create));
router.put('/:id', [auth, checkRole(['ADMIN'])], asyncHandler(categoriaController.update));
router.delete('/:id', [auth, checkRole(['ADMIN'])], asyncHandler(categoriaController.remove));

export default router;
