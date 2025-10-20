import { Router } from 'express';
import { tipoGastoController } from '../controllers/tipoGasto.controller';
import { auth } from '../middleware/auth';
import { checkRole } from '../middleware/checkRole';
import { RolUsuario } from '@prisma/client';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// GET /api/tipos-gasto - Obtener todos los tipos de gasto
router.get('/', 
  [auth], 
  asyncHandler(tipoGastoController.getAll)
);

// GET /api/tipos-gasto/:id - Obtener tipo de gasto por ID
router.get('/:id', 
  [auth], 
  asyncHandler(tipoGastoController.getById)
);

// POST /api/tipos-gasto - Crear nuevo tipo de gasto (solo ADMIN)
router.post('/', 
  [auth, checkRole([RolUsuario.ADMIN])], 
  asyncHandler(tipoGastoController.create)
);

// PUT /api/tipos-gasto/:id - Actualizar tipo de gasto (solo ADMIN)
router.put('/:id', 
  [auth, checkRole([RolUsuario.ADMIN])], 
  asyncHandler(tipoGastoController.update)
);

// DELETE /api/tipos-gasto/:id - Eliminar tipo de gasto (solo ADMIN)
router.delete('/:id', 
  [auth, checkRole([RolUsuario.ADMIN])], 
  asyncHandler(tipoGastoController.delete)
);

export default router;
