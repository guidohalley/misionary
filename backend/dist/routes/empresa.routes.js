"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const empresa_controller_1 = require("../controllers/empresa.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const createEmpresaValidation = [
    (0, express_validator_1.body)('nombre')
        .notEmpty()
        .withMessage('El nombre de la empresa es obligatorio')
        .isLength({ min: 2, max: 100 })
        .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    (0, express_validator_1.body)('razonSocial')
        .optional()
        .isLength({ max: 200 })
        .withMessage('La razón social no puede exceder 200 caracteres'),
    (0, express_validator_1.body)('cuit')
        .optional()
        .isLength({ min: 0, max: 20 })
        .withMessage('El CUIT no puede exceder 20 caracteres'),
    (0, express_validator_1.body)('telefono')
        .optional()
        .isLength({ max: 20 })
        .withMessage('El teléfono no puede exceder 20 caracteres'),
    (0, express_validator_1.body)('email')
        .optional()
        .isEmail()
        .withMessage('Debe ser un email válido'),
    (0, express_validator_1.body)('direccion')
        .optional()
        .isLength({ max: 300 })
        .withMessage('La dirección no puede exceder 300 caracteres'),
    (0, express_validator_1.body)('clienteId')
        .custom((value) => {
        const num = parseInt(value);
        if (isNaN(num) || num < 1) {
            throw new Error('El ID del cliente debe ser un número entero positivo');
        }
        return true;
    })
];
const updateEmpresaValidation = [
    (0, express_validator_1.body)('nombre')
        .optional()
        .notEmpty()
        .withMessage('El nombre de la empresa es obligatorio')
        .isLength({ min: 2, max: 100 })
        .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    (0, express_validator_1.body)('razonSocial')
        .optional()
        .isLength({ max: 200 })
        .withMessage('La razón social no puede exceder 200 caracteres'),
    (0, express_validator_1.body)('cuit')
        .optional()
        .matches(/^\d{2}-\d{8}-\d{1}$/)
        .withMessage('El CUIT debe tener el formato XX-XXXXXXXX-X'),
    (0, express_validator_1.body)('telefono')
        .optional()
        .isLength({ max: 20 })
        .withMessage('El teléfono no puede exceder 20 caracteres'),
    (0, express_validator_1.body)('email')
        .optional()
        .isEmail()
        .withMessage('Debe ser un email válido'),
    (0, express_validator_1.body)('direccion')
        .optional()
        .isLength({ max: 300 })
        .withMessage('La dirección no puede exceder 300 caracteres'),
    (0, express_validator_1.body)('activo')
        .optional()
        .isBoolean()
        .withMessage('El campo activo debe ser verdadero o falso')
];
router.use(auth_1.auth);
router.get('/', empresa_controller_1.empresaController.getAllEmpresas);
router.get('/search', empresa_controller_1.empresaController.searchEmpresas);
router.get('/:id', empresa_controller_1.empresaController.getEmpresaById);
router.get('/cliente/:clienteId', empresa_controller_1.empresaController.getEmpresasByCliente);
router.post('/', createEmpresaValidation, empresa_controller_1.empresaController.createEmpresa);
router.put('/:id', updateEmpresaValidation, empresa_controller_1.empresaController.updateEmpresa);
router.delete('/:id', empresa_controller_1.empresaController.deleteEmpresa);
exports.default = router;
//# sourceMappingURL=empresa.routes.js.map