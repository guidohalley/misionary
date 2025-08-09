"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const historialPrecio_controller_1 = require("../controllers/historialPrecio.controller");
const asyncHandler_1 = require("../utils/asyncHandler");
const auth_1 = require("../middleware/auth");
const checkRole_1 = require("../middleware/checkRole");
const router = (0, express_1.Router)();
router.get('/producto/:id', auth_1.auth, historialPrecio_controller_1.validarIdNumerico, (0, asyncHandler_1.asyncHandler)(historialPrecio_controller_1.HistorialPrecioController.getHistorialProducto));
router.get('/servicio/:id', auth_1.auth, historialPrecio_controller_1.validarIdNumerico, (0, asyncHandler_1.asyncHandler)(historialPrecio_controller_1.HistorialPrecioController.getHistorialServicio));
router.get('/producto/:id/actual/:monedaId', auth_1.auth, historialPrecio_controller_1.validarIdNumerico, historialPrecio_controller_1.validarMonedaId, (0, asyncHandler_1.asyncHandler)(historialPrecio_controller_1.HistorialPrecioController.getPrecioActualProducto));
router.get('/servicio/:id/actual/:monedaId', auth_1.auth, historialPrecio_controller_1.validarIdNumerico, historialPrecio_controller_1.validarMonedaId, (0, asyncHandler_1.asyncHandler)(historialPrecio_controller_1.HistorialPrecioController.getPrecioActualServicio));
router.put('/producto/:id', auth_1.auth, (0, checkRole_1.checkRole)(['ADMIN', 'CONTADOR']), historialPrecio_controller_1.validarIdNumerico, historialPrecio_controller_1.validarActualizacionPrecio, (0, asyncHandler_1.asyncHandler)(historialPrecio_controller_1.HistorialPrecioController.actualizarPrecioProducto));
router.put('/servicio/:id', auth_1.auth, (0, checkRole_1.checkRole)(['ADMIN', 'CONTADOR']), historialPrecio_controller_1.validarIdNumerico, historialPrecio_controller_1.validarActualizacionPrecio, (0, asyncHandler_1.asyncHandler)(historialPrecio_controller_1.HistorialPrecioController.actualizarPrecioServicio));
router.post('/actualizacion-masiva', auth_1.auth, (0, checkRole_1.checkRole)(['ADMIN']), historialPrecio_controller_1.validarActualizacionMasiva, (0, asyncHandler_1.asyncHandler)(historialPrecio_controller_1.HistorialPrecioController.actualizacionMasiva));
router.get('/desactualizados', auth_1.auth, (0, checkRole_1.checkRole)(['ADMIN', 'CONTADOR']), (0, asyncHandler_1.asyncHandler)(historialPrecio_controller_1.HistorialPrecioController.getPreciosDesactualizados));
router.get('/estadisticas', auth_1.auth, (0, checkRole_1.checkRole)(['ADMIN', 'CONTADOR']), historialPrecio_controller_1.validarFechas, (0, asyncHandler_1.asyncHandler)(historialPrecio_controller_1.HistorialPrecioController.getEstadisticasCambios));
exports.default = router;
//# sourceMappingURL=historialPrecio.routes.js.map