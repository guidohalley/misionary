"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const presupuesto_controller_1 = require("../controllers/presupuesto.controller");
const auth_1 = require("../middleware/auth");
const checkRole_1 = require("../middleware/checkRole");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.post('/', [auth_1.auth, (0, checkRole_1.checkRole)([client_1.RolUsuario.ADMIN, client_1.RolUsuario.CONTADOR])], presupuesto_controller_1.PresupuestoController.create);
router.get('/', [auth_1.auth], presupuesto_controller_1.PresupuestoController.findAll);
router.get('/:id', [auth_1.auth], presupuesto_controller_1.PresupuestoController.findById);
router.put('/:id', [auth_1.auth, (0, checkRole_1.checkRole)([client_1.RolUsuario.ADMIN, client_1.RolUsuario.CONTADOR])], presupuesto_controller_1.PresupuestoController.update);
router.patch('/:id/estado', [auth_1.auth, (0, checkRole_1.checkRole)([client_1.RolUsuario.ADMIN, client_1.RolUsuario.CONTADOR])], presupuesto_controller_1.PresupuestoController.updateEstado);
router.delete('/:id', [auth_1.auth, (0, checkRole_1.checkRole)([client_1.RolUsuario.ADMIN])], presupuesto_controller_1.PresupuestoController.delete);
exports.default = router;
//# sourceMappingURL=presupuesto.routes.js.map