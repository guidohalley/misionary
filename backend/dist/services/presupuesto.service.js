"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresupuestoService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const client_1 = require("@prisma/client");
class PresupuestoService {
    static async create(data) {
        return prisma_1.default.presupuesto.create({
            data: {
                ...data,
                estado: client_1.EstadoPresupuesto.BORRADOR,
                items: {
                    create: data.items
                }
            },
            include: {
                cliente: true,
                items: {
                    include: {
                        producto: true,
                        servicio: true
                    }
                }
            }
        });
    }
    static async findById(id) {
        return prisma_1.default.presupuesto.findUnique({
            where: { id },
            include: {
                cliente: true,
                items: {
                    include: {
                        producto: true,
                        servicio: true
                    }
                },
                factura: true
            }
        });
    }
    static async update(id, data) {
        return prisma_1.default.presupuesto.update({
            where: { id },
            data,
            include: {
                cliente: true,
                items: {
                    include: {
                        producto: true,
                        servicio: true
                    }
                }
            }
        });
    }
    static async updateEstado(id, estado) {
        return prisma_1.default.presupuesto.update({
            where: { id },
            data: { estado }
        });
    }
    static async delete(id) {
        return prisma_1.default.presupuesto.delete({
            where: { id }
        });
    }
    static async findAll(clienteId, estado) {
        const where = {};
        if (clienteId)
            where.clienteId = clienteId;
        if (estado)
            where.estado = estado;
        return prisma_1.default.presupuesto.findMany({
            where,
            include: {
                cliente: true,
                items: {
                    include: {
                        producto: true,
                        servicio: true
                    }
                }
            }
        });
    }
}
exports.PresupuestoService = PresupuestoService;
//# sourceMappingURL=presupuesto.service.js.map