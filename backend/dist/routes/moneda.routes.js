"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const moneda_controller_1 = require("../controllers/moneda.controller");
const auth_1 = require("../middleware/auth");
const checkRole_1 = require("../middleware/checkRole");
const asyncHandler_1 = require("../utils/asyncHandler");
const router = (0, express_1.Router)();
router.get('/', (0, asyncHandler_1.asyncHandler)(moneda_controller_1.MonedaController.getAllMonedas));
router.get('/:codigo', moneda_controller_1.validarCodigoMoneda, (0, asyncHandler_1.asyncHandler)(moneda_controller_1.MonedaController.getMonedaByCodigo));
router.get('/tipo-cambio/:monedaDesde/:monedaHacia', moneda_controller_1.validarTipoCambioParams, (0, asyncHandler_1.asyncHandler)(moneda_controller_1.MonedaController.getTipoCambioActual));
router.get('/historial/:monedaDesde/:monedaHacia', moneda_controller_1.validarHistorialQuery, (0, asyncHandler_1.asyncHandler)(moneda_controller_1.MonedaController.getHistorialTipoCambio));
router.post('/convertir', auth_1.auth, moneda_controller_1.validarConversionBody, (0, asyncHandler_1.asyncHandler)(moneda_controller_1.MonedaController.convertirMoneda));
router.post('/tipo-cambio', auth_1.auth, (0, checkRole_1.checkRole)(['ADMIN', 'CONTADOR']), moneda_controller_1.validarTipoCambioBody, (0, asyncHandler_1.asyncHandler)(moneda_controller_1.MonedaController.upsertTipoCambio));
router.post('/actualizar-masivo', auth_1.auth, (0, checkRole_1.checkRole)(['ADMIN', 'CONTADOR']), moneda_controller_1.validarActualizacionMasiva, (0, asyncHandler_1.asyncHandler)(moneda_controller_1.MonedaController.actualizarTiposCambioMasivo));
exports.default = router;
//# sourceMappingURL=moneda.routes.js.map