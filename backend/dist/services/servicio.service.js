"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicioService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
class ServicioService {
    static async create(data) {
        return await prisma_1.default.servicio.create({
            data: {
                ...data,
                monedaId: data.monedaId || 1
            },
            include: {
                proveedor: true,
                moneda: true,
            },
        });
    }
    static async findById(id) {
        return await prisma_1.default.servicio.findUnique({
            where: { id },
            include: {
                proveedor: true,
                moneda: true,
            },
        });
    }
    static async findAll(proveedorId) {
        return await prisma_1.default.servicio.findMany({
            where: proveedorId ? { proveedorId } : {},
            include: {
                proveedor: true,
                moneda: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    static async update(id, data) {
        return await prisma_1.default.servicio.update({
            where: { id },
            data,
            include: {
                proveedor: true,
                moneda: true,
            },
        });
    }
    static async delete(id) {
        await prisma_1.default.servicio.delete({
            where: { id },
        });
    }
}
exports.ServicioService = ServicioService;
//# sourceMappingURL=servicio.service.js.map