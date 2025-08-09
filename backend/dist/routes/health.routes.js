"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../config/prisma"));
const asyncHandler_1 = require("../utils/asyncHandler");
const config_1 = require("../config/config");
const router = (0, express_1.Router)();
router.get('/', (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    let dbOk = false;
    try {
        await prisma_1.default.$queryRaw `SELECT 1`;
        dbOk = true;
    }
    catch (_a) {
        dbOk = false;
    }
    return res.json({
        status: 'ok',
        env: config_1.config.env,
        db: dbOk,
        time: new Date().toISOString(),
    });
}));
exports.default = router;
//# sourceMappingURL=health.routes.js.map