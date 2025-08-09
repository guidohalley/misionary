"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const asyncHandler_1 = require("../utils/asyncHandler");
const router = (0, express_1.Router)();
router.post('/register', (0, asyncHandler_1.asyncHandler)(auth_controller_1.AuthController.register));
router.post('/login', (0, asyncHandler_1.asyncHandler)(auth_controller_1.AuthController.login));
exports.default = router;
//# sourceMappingURL=auth.routes.js.map