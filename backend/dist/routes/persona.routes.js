"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const persona_controller_1 = require("../controllers/persona.controller");
const auth_1 = require("../middleware/auth");
const checkRole_1 = require("../middleware/checkRole");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.post('/', [auth_1.auth, (0, checkRole_1.checkRole)([client_1.RolUsuario.ADMIN])], persona_controller_1.PersonaController.create);
router.get('/', [auth_1.auth], persona_controller_1.PersonaController.findAll);
router.get('/:id', [auth_1.auth], persona_controller_1.PersonaController.findById);
router.put('/:id', [auth_1.auth, (0, checkRole_1.checkRole)([client_1.RolUsuario.ADMIN])], persona_controller_1.PersonaController.update);
router.delete('/:id', [auth_1.auth, (0, checkRole_1.checkRole)([client_1.RolUsuario.ADMIN])], persona_controller_1.PersonaController.delete);
exports.default = router;
//# sourceMappingURL=persona.routes.js.map