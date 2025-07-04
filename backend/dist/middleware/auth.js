"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const prisma_1 = __importDefault(require("../config/prisma"));
const auth = async (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        if (!token) {
            throw new Error();
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
        const user = await prisma_1.default.persona.findUnique({
            where: { id: decoded.id }
        });
        if (!user) {
            throw new Error();
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Por favor autentícate' });
    }
};
exports.auth = auth;
//# sourceMappingURL=auth.js.map