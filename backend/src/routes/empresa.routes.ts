import { Router } from 'express';
import { body } from 'express-validator';
import { empresaController } from '../controllers/empresa.controller';
import { auth } from '../middleware/auth';

const router = Router();

// Validaciones para crear empresa
const createEmpresaValidation = [
  body('nombre')
    .notEmpty()
    .withMessage('El nombre de la empresa es obligatorio')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  
  body('razonSocial')
    .optional()
    .isLength({ max: 200 })
    .withMessage('La razón social no puede exceder 200 caracteres'),
  
  body('cuit')
    .optional()
    .matches(/^\d{2}-\d{8}-\d{1}$/)
    .withMessage('El CUIT debe tener el formato XX-XXXXXXXX-X'),
  
  body('telefono')
    .optional()
    .isLength({ max: 20 })
    .withMessage('El teléfono no puede exceder 20 caracteres'),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Debe ser un email válido'),
  
  body('direccion')
    .optional()
    .isLength({ max: 300 })
    .withMessage('La dirección no puede exceder 300 caracteres'),
  
  body('clienteId')
    .isInt({ min: 1 })
    .withMessage('El ID del cliente debe ser un número entero positivo')
];

// Validaciones para actualizar empresa
const updateEmpresaValidation = [
  body('nombre')
    .optional()
    .notEmpty()
    .withMessage('El nombre de la empresa es obligatorio')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  
  body('razonSocial')
    .optional()
    .isLength({ max: 200 })
    .withMessage('La razón social no puede exceder 200 caracteres'),
  
  body('cuit')
    .optional()
    .matches(/^\d{2}-\d{8}-\d{1}$/)
    .withMessage('El CUIT debe tener el formato XX-XXXXXXXX-X'),
  
  body('telefono')
    .optional()
    .isLength({ max: 20 })
    .withMessage('El teléfono no puede exceder 20 caracteres'),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Debe ser un email válido'),
  
  body('direccion')
    .optional()
    .isLength({ max: 300 })
    .withMessage('La dirección no puede exceder 300 caracteres'),
  
  body('activo')
    .optional()
    .isBoolean()
    .withMessage('El campo activo debe ser verdadero o falso')
];

// Aplicar middleware de autenticación a todas las rutas
router.use(auth);

// Rutas CRUD para empresas
router.get('/', empresaController.getAllEmpresas);
router.get('/search', empresaController.searchEmpresas);
router.get('/:id', empresaController.getEmpresaById);
router.get('/cliente/:clienteId', empresaController.getEmpresasByCliente);
router.post('/', createEmpresaValidation, empresaController.createEmpresa);
router.put('/:id', updateEmpresaValidation, empresaController.updateEmpresa);
router.delete('/:id', empresaController.deleteEmpresa);

export default router;
