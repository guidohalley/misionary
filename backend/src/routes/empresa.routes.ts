import { Router } from 'express';
import { body } from 'express-validator';
import { empresaController } from '../controllers/empresa.controller';
import { auth } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

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
    .isLength({ min: 0, max: 20 })
    .withMessage('El CUIT no puede exceder 20 caracteres'),
  
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
    .custom((value) => {
      const num = parseInt(value);
      if (isNaN(num) || num < 1) {
        throw new Error('El ID del cliente debe ser un número entero positivo');
      }
      return true;
    })
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
    .custom((value) => {
      if (value && value.trim() !== '') {
        // Permitir CUIT con o sin guiones
        const cuitRegex = /^\d{2}-?\d{8}-?\d{1}$/;
        if (!cuitRegex.test(value)) {
          throw new Error('El CUIT debe tener el formato XX-XXXXXXXX-X o XXXXXXXX-X');
        }
      }
      return true;
    }),
  
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
    .optional()
    .custom((value) => {
      if (value !== undefined && value !== null) {
        const num = parseInt(value);
        if (isNaN(num) || num < 1) {
          throw new Error('El ID del cliente debe ser un número entero positivo');
        }
      }
      return true;
    }),
  
  body('activo')
    .optional()
    .isBoolean()
    .withMessage('El campo activo debe ser verdadero o falso')
];

// Aplicar middleware de autenticación a todas las rutas
router.use(auth);

// Rutas CRUD para empresas
router.get('/', asyncHandler(empresaController.getAllEmpresas));
router.get('/search', asyncHandler(empresaController.searchEmpresas));
router.get('/:id', asyncHandler(empresaController.getEmpresaById));
router.get('/cliente/:clienteId', asyncHandler(empresaController.getEmpresasByCliente));
router.post('/', createEmpresaValidation, asyncHandler(empresaController.createEmpresa));
router.put('/:id', updateEmpresaValidation, asyncHandler(empresaController.updateEmpresa));
router.delete('/:id', asyncHandler(empresaController.deleteEmpresa));

export default router;
