"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductoService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
class ProductoService {
    static async create(data) {
        return prisma_1.default.producto.create({
            data,
            include: {
                proveedor: true
            }
        });
    }
    static async findById(id) {
        return prisma_1.default.producto.findUnique({
            where: { id },
            include: {
                proveedor: true,
                items: {
                    include: {
                        presupuesto: true
                    }
                }
            }
        });
    }
    static async update(id, data) {
        return prisma_1.default.producto.update({
            where: { id },
            data,
            include: {
                proveedor: true
            }
        });
    }
    static async delete(id) {
        return prisma_1.default.producto.delete({
            where: { id }
        });
    }
    static async findAll(proveedorId) {
        const where = proveedorId ? { proveedorId } : {};
        return prisma_1.default.producto.findMany({
            where,
            include: {
                proveedor: true
            }
        });
    }
}
exports.ProductoService = ProductoService;
//# sourceMappingURL=producto.service.js.map