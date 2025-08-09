"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const impuesto_controller_1 = require("../controllers/impuesto.controller");
const auth_1 = require("../middleware/auth");
const asyncHandler_1 = require("../utils/asyncHandler");
const router = (0, express_1.Router)();
router.use(auth_1.auth);
router.post('/', (0, asyncHandler_1.asyncHandler)(impuesto_controller_1.ImpuestoController.create));
router.get('/', (0, asyncHandler_1.asyncHandler)(impuesto_controller_1.ImpuestoController.findAll));
router.get('/:id', (0, asyncHandler_1.asyncHandler)(impuesto_controller_1.ImpuestoController.findById));
router.put('/:id', (0, asyncHandler_1.asyncHandler)(impuesto_controller_1.ImpuestoController.update));
router.delete('/:id', (0, asyncHandler_1.asyncHandler)(impuesto_controller_1.ImpuestoController.delete));
router.patch('/:id/toggle', (0, asyncHandler_1.asyncHandler)(impuesto_controller_1.ImpuestoController.toggle));
exports.default = router;
//# sourceMappingURL=impuesto.routes.js.map