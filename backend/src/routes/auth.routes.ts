import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { asyncHandler } from '../utils/asyncHandler';
import { auth } from '../middleware/auth';
import { checkRole } from '../middleware/checkRole';

const router = Router();

router.post('/register', asyncHandler(AuthController.register));
router.post('/login', asyncHandler(AuthController.login));

router.post('/invite', [auth, checkRole(['ADMIN'])], asyncHandler(AuthController.invite));
router.get('/invite/validate', asyncHandler(AuthController.validateInvite));
router.post('/invite/accept', asyncHandler(AuthController.acceptInvite));
router.post('/invite/complete-provider', asyncHandler(AuthController.completeProviderRegistration));

export default router;
