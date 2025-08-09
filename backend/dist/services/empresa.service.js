"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmpresaService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
class EmpresaService {
    static async create(data) {
        return prisma_1.default.empresa.create({
            data,
            include: {
                cliente: true
            }
        });
    }
    static async findById(id) {
        return prisma_1.default.empresa.findUnique({
            where: { id },
            include: {
                cliente: true,
                presupuestos: {
                    include: {
                        moneda: true
                    }
                },
                facturas: {
                    include: {
                        moneda: true
                    }
                }
            }
        });
    }
    static async findByClienteId(clienteId) {
        return prisma_1.default.empresa.findMany({
            where: { clienteId },
            include: {
                cliente: true
            }
        });
    }
    static async update(id, data) {
        console.log('EmpresaService.update - ID:', id, 'Data:', data);
        const result = await prisma_1.default.empresa.update({
            where: { id },
            data,
            include: {
                cliente: true
            }
        });
        console.log('EmpresaService.update - Result:', result);
        return result;
    }
    static async delete(id) {
        return prisma_1.default.empresa.delete({
            where: { id }
        });
    }
    static async findAll(filters) {
        const where = {};
        if (filters === null || filters === void 0 ? void 0 : filters.clienteId) {
            where.clienteId = filters.clienteId;
        }
        if ((filters === null || filters === void 0 ? void 0 : filters.activo) !== undefined) {
            where.activo = filters.activo;
        }
        return prisma_1.default.empresa.findMany({
            where,
            include: {
                cliente: true
            },
            orderBy: {
                nombre: 'asc'
            }
        });
    }
    static async findByCuit(cuit) {
        return prisma_1.default.empresa.findUnique({
            where: { cuit },
            include: {
                cliente: true
            }
        });
    }
}
exports.EmpresaService = EmpresaService;
//# sourceMappingURL=empresa.service.js.map