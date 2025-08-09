"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const servicio_controller_1 = require("../controllers/servicio.controller");
const auth_1 = require("../middleware/auth");
const checkRole_1 = require("../middleware/checkRole");
const asyncHandler_1 = require("../utils/asyncHandler");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.post('/', [auth_1.auth, (0, checkRole_1.checkRole)([client_1.RolUsuario.ADMIN, client_1.RolUsuario.PROVEEDOR])], (0, asyncHandler_1.asyncHandler)(servicio_controller_1.ServicioController.create));
router.get('/', [auth_1.auth], (0, asyncHandler_1.asyncHandler)(servicio_controller_1.ServicioController.findAll));
router.get('/:id', [auth_1.auth], (0, asyncHandler_1.asyncHandler)(servicio_controller_1.ServicioController.findById));
router.put('/:id', [auth_1.auth, (0, checkRole_1.checkRole)([client_1.RolUsuario.ADMIN, client_1.RolUsuario.PROVEEDOR])], (0, asyncHandler_1.asyncHandler)(servicio_controller_1.ServicioController.update));
router.delete('/:id', [auth_1.auth, (0, checkRole_1.checkRole)([client_1.RolUsuario.ADMIN])], (0, asyncHandler_1.asyncHandler)(servicio_controller_1.ServicioController.delete));
exports.default = router;
//# sourceMappingURL=servicio.routes.js.map