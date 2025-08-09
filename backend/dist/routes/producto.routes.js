"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const producto_controller_1 = require("../controllers/producto.controller");
const auth_1 = require("../middleware/auth");
const checkRole_1 = require("../middleware/checkRole");
const asyncHandler_1 = require("../utils/asyncHandler");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.post('/', [auth_1.auth, (0, checkRole_1.checkRole)([client_1.RolUsuario.ADMIN, client_1.RolUsuario.PROVEEDOR])], (0, asyncHandler_1.asyncHandler)(producto_controller_1.ProductoController.create));
router.get('/', [auth_1.auth], (0, asyncHandler_1.asyncHandler)(producto_controller_1.ProductoController.findAll));
router.get('/:id', [auth_1.auth], (0, asyncHandler_1.asyncHandler)(producto_controller_1.ProductoController.findById));
router.put('/:id', [auth_1.auth, (0, checkRole_1.checkRole)([client_1.RolUsuario.ADMIN, client_1.RolUsuario.PROVEEDOR])], (0, asyncHandler_1.asyncHandler)(producto_controller_1.ProductoController.update));
router.delete('/:id', [auth_1.auth, (0, checkRole_1.checkRole)([client_1.RolUsuario.ADMIN, client_1.RolUsuario.PROVEEDOR])], (0, asyncHandler_1.asyncHandler)(producto_controller_1.ProductoController.delete));
exports.default = router;
//# sourceMappingURL=producto.routes.js.map