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
        try {
            console.log('PresupuestoService.create - Input data:', JSON.stringify(data, null, 2));
            const cliente = await prisma_1.default.persona.findUnique({
                where: { id: data.clienteId }
            });
            if (!cliente) {
                throw new Error(`Cliente con ID ${data.clienteId} no encontrado`);
            }
            console.log('Cliente encontrado:', cliente.nombre);
            for (const item of data.items) {
                if (!item.productoId && !item.servicioId) {
                    throw new Error('Cada item debe tener un producto o servicio');
                }
                if (item.productoId && item.servicioId) {
                    throw new Error('Un item no puede tener producto y servicio al mismo tiempo');
                }
                if (item.productoId) {
                    const producto = await prisma_1.default.producto.findUnique({
                        where: { id: item.productoId }
                    });
                    if (!producto) {
                        throw new Error(`Producto con ID ${item.productoId} no encontrado`);
                    }
                }
                if (item.servicioId) {
                    const servicio = await prisma_1.default.servicio.findUnique({
                        where: { id: item.servicioId }
                    });
                    if (!servicio) {
                        throw new Error(`Servicio con ID ${item.servicioId} no encontrado`);
                    }
                }
            }
            console.log('Validaciones pasadas, creando presupuesto...');
            const presupuesto = await prisma_1.default.presupuesto.create({
                data: {
                    clienteId: data.clienteId,
                    subtotal: data.subtotal,
                    impuestos: data.impuestos,
                    total: data.total,
                    monedaId: data.monedaId || 1,
                    estado: client_1.EstadoPresupuesto.BORRADOR,
                    items: {
                        create: data.items
                    },
                    presupuestoImpuestos: data.impuestosSeleccionados ? {
                        create: data.impuestosSeleccionados.map(impuestoId => ({
                            impuestoId,
                            monto: 0
                        }))
                    } : undefined
                },
                include: {
                    cliente: true,
                    moneda: true,
                    items: {
                        include: {
                            producto: true,
                            servicio: true
                        }
                    },
                    presupuestoImpuestos: {
                        include: {
                            impuesto: true
                        }
                    }
                }
            });
            if (data.impuestosSeleccionados && data.impuestosSeleccionados.length > 0) {
                for (const impuestoId of data.impuestosSeleccionados) {
                    const impuesto = await prisma_1.default.impuesto.findUnique({
                        where: { id: impuestoId }
                    });
                    if (impuesto) {
                        const montoImpuesto = (data.subtotal * Number(impuesto.porcentaje)) / 100;
                        await prisma_1.default.presupuestoImpuesto.update({
                            where: {
                                presupuestoId_impuestoId: {
                                    presupuestoId: presupuesto.id,
                                    impuestoId: impuestoId
                                }
                            },
                            data: {
                                monto: montoImpuesto
                            }
                        });
                    }
                }
            }
            const presupuestoFinal = await prisma_1.default.presupuesto.findUnique({
                where: { id: presupuesto.id },
                include: {
                    cliente: true,
                    moneda: true,
                    items: {
                        include: {
                            producto: true,
                            servicio: true
                        }
                    },
                    presupuestoImpuestos: {
                        include: {
                            impuesto: true
                        }
                    }
                }
            });
            console.log('Presupuesto creado exitosamente:', presupuesto.id);
            return presupuestoFinal || presupuesto;
        }
        catch (error) {
            console.error('Error en PresupuestoService.create:', error);
            throw error;
        }
    }
    static async findById(id) {
        return prisma_1.default.presupuesto.findUnique({
            where: { id },
            include: {
                cliente: true,
                moneda: true,
                items: {
                    include: {
                        producto: true,
                        servicio: true
                    }
                },
                presupuestoImpuestos: {
                    include: {
                        impuesto: true
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
                moneda: true,
                items: {
                    include: {
                        producto: true,
                        servicio: true
                    }
                },
                presupuestoImpuestos: {
                    include: {
                        impuesto: true
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
                moneda: true,
                items: {
                    include: {
                        producto: true,
                        servicio: true
                    }
                },
                presupuestoImpuestos: {
                    include: {
                        impuesto: true
                    }
                }
            }
        });
    }
}
exports.PresupuestoService = PresupuestoService;
//# sourceMappingURL=presupuesto.service.js.map