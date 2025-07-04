"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonaService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
class PersonaService {
    static async create(data) {
        return prisma_1.default.persona.create({
            data
        });
    }
    static async findById(id) {
        return prisma_1.default.persona.findUnique({
            where: { id },
            include: {
                productos: true,
                servicios: true,
                presupuestos: true,
                recibos: true
            }
        });
    }
    static async findByEmail(email) {
        return prisma_1.default.persona.findUnique({
            where: { email }
        });
    }
    static async update(id, data) {
        return prisma_1.default.persona.update({
            where: { id },
            data
        });
    }
    static async delete(id) {
        return prisma_1.default.persona.delete({
            where: { id }
        });
    }
    static async findAll(tipo) {
        const where = tipo ? { tipo } : {};
        return prisma_1.default.persona.findMany({
            where,
            include: {
                productos: true,
                servicios: true
            }
        });
    }
}
exports.PersonaService = PersonaService;
//# sourceMappingURL=persona.service.js.map