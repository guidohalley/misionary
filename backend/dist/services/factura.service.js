"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacturaService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const client_1 = require("@prisma/client");
const http_error_1 = require("../utils/http-error");
class FacturaService {
    static async create(data) {
        const presupuesto = await prisma_1.default.presupuesto.findUnique({
            where: { id: data.presupuestoId }
        });
        if (!presupuesto) {
            throw http_error_1.HttpError.NotFound('Presupuesto no encontrado');
        }
        return prisma_1.default.factura.create({
            data: {
                ...data,
                estado: client_1.EstadoFactura.EMITIDA
            },
            include: {
                presupuesto: {
                    include: {
                        cliente: true,
                        items: {
                            include: {
                                producto: true,
                                servicio: true
                            }
                        }
                    }
                },
                impuestoAplicado: true
            }
        });
    }
    static async findById(id) {
        const factura = await prisma_1.default.factura.findUnique({
            where: { id },
            include: {
                presupuesto: {
                    include: {
                        cliente: true,
                        items: {
                            include: {
                                producto: true,
                                servicio: true
                            }
                        }
                    }
                },
                impuestoAplicado: true
            }
        });
        if (!factura) {
            throw http_error_1.HttpError.NotFound('Factura no encontrada');
        }
        return factura;
    }
    static async update(id, data) {
        return prisma_1.default.factura.update({
            where: { id },
            data,
            include: {
                presupuesto: {
                    include: {
                        cliente: true
                    }
                },
                impuestoAplicado: true
            }
        });
    }
    static async findAll(filters) {
        const where = {};
        if (filters === null || filters === void 0 ? void 0 : filters.estado) {
            where.estado = filters.estado;
        }
        if (filters === null || filters === void 0 ? void 0 : filters.clienteId) {
            where.presupuesto = {
                clienteId: filters.clienteId
            };
        }
        if ((filters === null || filters === void 0 ? void 0 : filters.fechaDesde) || (filters === null || filters === void 0 ? void 0 : filters.fechaHasta)) {
            where.fecha = {};
            if (filters.fechaDesde) {
                where.fecha.gte = filters.fechaDesde;
            }
            if (filters.fechaHasta) {
                where.fecha.lte = filters.fechaHasta;
            }
        }
        return prisma_1.default.factura.findMany({
            where,
            include: {
                presupuesto: {
                    include: {
                        cliente: true
                    }
                },
                impuestoAplicado: true
            },
            orderBy: {
                fecha: 'desc'
            }
        });
    }
    static async anular(id) {
        return prisma_1.default.factura.update({
            where: { id },
            data: {
                estado: client_1.EstadoFactura.ANULADA
            }
        });
    }
}
exports.FacturaService = FacturaService;
//# sourceMappingURL=factura.service.js.map