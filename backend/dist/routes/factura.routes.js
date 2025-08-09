"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const factura_controller_1 = require("../controllers/factura.controller");
const auth_1 = require("../middleware/auth");
const checkRole_1 = require("../middleware/checkRole");
const client_1 = require("@prisma/client");
const asyncHandler_1 = require("../utils/asyncHandler");
const router = (0, express_1.Router)();
router.post('/', [auth_1.auth, (0, checkRole_1.checkRole)([client_1.RolUsuario.ADMIN, client_1.RolUsuario.CONTADOR])], (0, asyncHandler_1.asyncHandler)(factura_controller_1.FacturaController.create));
router.get('/', [auth_1.auth], (0, asyncHandler_1.asyncHandler)(factura_controller_1.FacturaController.findAll));
router.get('/:id', [auth_1.auth], (0, asyncHandler_1.asyncHandler)(factura_controller_1.FacturaController.findById));
router.put('/:id', [auth_1.auth, (0, checkRole_1.checkRole)([client_1.RolUsuario.ADMIN, client_1.RolUsuario.CONTADOR])], (0, asyncHandler_1.asyncHandler)(factura_controller_1.FacturaController.update));
router.post('/:id/anular', [auth_1.auth, (0, checkRole_1.checkRole)([client_1.RolUsuario.ADMIN])], (0, asyncHandler_1.asyncHandler)(factura_controller_1.FacturaController.anular));
exports.default = router;
//# sourceMappingURL=factura.routes.js.map