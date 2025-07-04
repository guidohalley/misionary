"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3001', 10),
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
    databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/misionary',
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    },
};
//# sourceMappingURL=config.js.map