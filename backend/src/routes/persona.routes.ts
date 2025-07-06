import { Router } from 'express';
import { PersonaController } from '../controllers/persona.controller';
import { auth } from '../middleware/auth';
import { checkRole } from '../middleware/checkRole';
import { RolUsuario } from '@prisma/client';

const router = Router();

router.post('/', 
  [auth, checkRole([RolUsuario.ADMIN])], 
  PersonaController.create
);

router.get('/', 
  [auth], 
  PersonaController.findAll
);

router.get('/:id', 
  [auth], 
  PersonaController.findById
);

router.put('/:id', 
  [auth, checkRole([RolUsuario.ADMIN])], 
  PersonaController.update
);

router.delete('/:id', 
  [auth, checkRole([RolUsuario.ADMIN])], 
  PersonaController.delete
);

router.post('/cliente-con-empresa', 
  [auth, checkRole([RolUsuario.ADMIN])], 
  PersonaController.createClienteWithEmpresa
);

export default router;
