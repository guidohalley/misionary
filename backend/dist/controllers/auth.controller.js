"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../config/prisma"));
const config_1 = require("../config/config");
class AuthController {
    static async register(req, res) {
        try {
            const { email, password, nombre, tipo, roles } = req.body;
            const existingUser = await prisma_1.default.persona.findUnique({
                where: { email }
            });
            if (existingUser) {
                return res.status(400).json({ error: 'El email ya está registrado' });
            }
            const hashedPassword = await bcryptjs_1.default.hash(password, 10);
            const user = await prisma_1.default.persona.create({
                data: {
                    email,
                    password: hashedPassword,
                    nombre,
                    tipo: tipo,
                    roles: roles
                }
            });
            const token = jsonwebtoken_1.default.sign({ id: user.id }, config_1.config.jwtSecret, { expiresIn: config_1.config.jwtExpiresIn });
            res.status(201).json({ user, token });
        }
        catch (error) {
            res.status(500).json({ error: 'Error al registrar usuario' });
        }
    }
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await prisma_1.default.persona.findUnique({
                where: { email }
            });
            if (!user) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }
            const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }
            const token = jsonwebtoken_1.default.sign({ id: user.id }, config_1.config.jwtSecret, { expiresIn: config_1.config.jwtExpiresIn });
            res.json({ user, token });
        }
        catch (error) {
            res.status(500).json({ error: 'Error al iniciar sesión' });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map