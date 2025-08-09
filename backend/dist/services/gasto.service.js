"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gastoService = void 0;
const client_1 = require("@prisma/client");
const http_error_1 = require("../utils/http-error");
const prisma = new client_1.PrismaClient();
class GastoService {
    async getGastosOperativos(filters) {
        const where = {};
        if (filters) {
            if (filters.categoria)
                where.categoria = filters.categoria;
            if (filters.proveedorId)
                where.proveedorId = filters.proveedorId;
            if (filters.monedaId)
                where.monedaId = filters.monedaId;
            if (filters.esRecurrente !== undefined)
                where.esRecurrente = filters.esRecurrente;
            if (filters.activo !== undefined)
                where.activo = filters.activo;
            if (filters.fechaDesde || filters.fechaHasta) {
                where.fecha = {};
                if (filters.fechaDesde)
                    where.fecha.gte = filters.fechaDesde;
                if (filters.fechaHasta)
                    where.fecha.lte = filters.fechaHasta;
            }
            if (filters.search) {
                where.OR = [
                    { concepto: { contains: filters.search, mode: 'insensitive' } },
                    { descripcion: { contains: filters.search, mode: 'insensitive' } },
                    { comprobante: { contains: filters.search, mode: 'insensitive' } }
                ];
            }
        }
        return await prisma.gastoOperativo.findMany({
            where,
            include: {
                moneda: true,
                proveedor: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true,
                        telefono: true
                    }
                },
                asignaciones: {
                    include: {
                        presupuesto: {
                            select: {
                                id: true,
                                cliente: {
                                    select: {
                                        id: true,
                                        nombre: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: { fecha: 'desc' }
        });
    }
    async getGastoOperativoById(id) {
        const gasto = await prisma.gastoOperativo.findUnique({
            where: { id },
            include: {
                moneda: true,
                proveedor: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true,
                        telefono: true
                    }
                },
                asignaciones: {
                    include: {
                        presupuesto: {
                            select: {
                                id: true,
                                cliente: {
                                    select: {
                                        id: true,
                                        nombre: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        if (!gasto) {
            throw new http_error_1.HttpError(404, 'Gasto operativo no encontrado');
        }
        return gasto;
    }
    async createGastoOperativo(data) {
        const moneda = await prisma.moneda.findUnique({
            where: { id: data.monedaId }
        });
        if (!moneda) {
            throw new http_error_1.HttpError(400, 'Moneda no encontrada');
        }
        if (data.proveedorId) {
            const proveedor = await prisma.persona.findUnique({
                where: { id: data.proveedorId }
            });
            if (!proveedor) {
                throw new http_error_1.HttpError(400, 'Proveedor no encontrado');
            }
        }
        return await prisma.gastoOperativo.create({
            data: {
                concepto: data.concepto,
                descripcion: data.descripcion,
                monto: data.monto,
                monedaId: data.monedaId,
                fecha: data.fecha,
                categoria: data.categoria,
                esRecurrente: data.esRecurrente || false,
                frecuencia: data.frecuencia,
                proveedorId: data.proveedorId,
                comprobante: data.comprobante,
                observaciones: data.observaciones
            },
            include: {
                moneda: true,
                proveedor: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true,
                        telefono: true
                    }
                }
            }
        });
    }
    async updateGastoOperativo(id, data) {
        const gastoExistente = await prisma.gastoOperativo.findUnique({
            where: { id }
        });
        if (!gastoExistente) {
            throw new http_error_1.HttpError(404, 'Gasto operativo no encontrado');
        }
        if (data.monedaId) {
            const moneda = await prisma.moneda.findUnique({
                where: { id: data.monedaId }
            });
            if (!moneda) {
                throw new http_error_1.HttpError(400, 'Moneda no encontrada');
            }
        }
        if (data.proveedorId) {
            const proveedor = await prisma.persona.findUnique({
                where: { id: data.proveedorId }
            });
            if (!proveedor) {
                throw new http_error_1.HttpError(400, 'Proveedor no encontrado');
            }
        }
        return await prisma.gastoOperativo.update({
            where: { id },
            data,
            include: {
                moneda: true,
                proveedor: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true,
                        telefono: true
                    }
                }
            }
        });
    }
    async deleteGastoOperativo(id) {
        const gasto = await prisma.gastoOperativo.findUnique({
            where: { id },
            include: {
                asignaciones: true
            }
        });
        if (!gasto) {
            throw new http_error_1.HttpError(404, 'Gasto operativo no encontrado');
        }
        if (gasto.asignaciones.length > 0) {
            throw new http_error_1.HttpError(400, 'No se puede eliminar un gasto que tiene asignaciones a proyectos. Primero elimine las asignaciones.');
        }
        await prisma.gastoOperativo.delete({
            where: { id }
        });
    }
    async getAsignacionesPorGasto(gastoId) {
        return await prisma.asignacionGastoProyecto.findMany({
            where: { gastoId },
            include: {
                presupuesto: {
                    select: {
                        id: true,
                        cliente: {
                            select: {
                                id: true,
                                nombre: true
                            }
                        },
                        total: true,
                        moneda: true
                    }
                }
            }
        });
    }
    async getAsignacionesPorProyecto(presupuestoId) {
        return await prisma.asignacionGastoProyecto.findMany({
            where: { presupuestoId },
            include: {
                gasto: {
                    include: {
                        moneda: true,
                        proveedor: {
                            select: {
                                id: true,
                                nombre: true
                            }
                        }
                    }
                }
            }
        });
    }
    async createAsignacion(data) {
        const gasto = await prisma.gastoOperativo.findUnique({
            where: { id: data.gastoId }
        });
        if (!gasto) {
            throw new http_error_1.HttpError(404, 'Gasto operativo no encontrado');
        }
        const presupuesto = await prisma.presupuesto.findUnique({
            where: { id: data.presupuestoId }
        });
        if (!presupuesto) {
            throw new http_error_1.HttpError(404, 'Presupuesto no encontrado');
        }
        if (data.porcentaje <= 0 || data.porcentaje > 100) {
            throw new http_error_1.HttpError(400, 'El porcentaje debe estar entre 0.01 y 100');
        }
        const asignacionExistente = await prisma.asignacionGastoProyecto.findUnique({
            where: {
                gastoId_presupuestoId: {
                    gastoId: data.gastoId,
                    presupuestoId: data.presupuestoId
                }
            }
        });
        if (asignacionExistente) {
            throw new http_error_1.HttpError(400, 'Ya existe una asignación de este gasto para este proyecto');
        }
        const montoAsignado = (gasto.monto.toNumber() * data.porcentaje) / 100;
        return await prisma.asignacionGastoProyecto.create({
            data: {
                gastoId: data.gastoId,
                presupuestoId: data.presupuestoId,
                porcentaje: data.porcentaje,
                montoAsignado: montoAsignado,
                justificacion: data.justificacion
            },
            include: {
                gasto: {
                    include: {
                        moneda: true
                    }
                },
                presupuesto: {
                    select: {
                        id: true,
                        cliente: {
                            select: {
                                id: true,
                                nombre: true
                            }
                        }
                    }
                }
            }
        });
    }
    async updateAsignacion(id, data) {
        const asignacionExistente = await prisma.asignacionGastoProyecto.findUnique({
            where: { id },
            include: {
                gasto: true
            }
        });
        if (!asignacionExistente) {
            throw new http_error_1.HttpError(404, 'Asignación no encontrada');
        }
        let montoAsignado = asignacionExistente.montoAsignado.toNumber();
        if (data.porcentaje !== undefined) {
            if (data.porcentaje <= 0 || data.porcentaje > 100) {
                throw new http_error_1.HttpError(400, 'El porcentaje debe estar entre 0.01 y 100');
            }
            montoAsignado = (asignacionExistente.gasto.monto.toNumber() * data.porcentaje) / 100;
        }
        return await prisma.asignacionGastoProyecto.update({
            where: { id },
            data: {
                ...data,
                montoAsignado
            },
            include: {
                gasto: {
                    include: {
                        moneda: true
                    }
                },
                presupuesto: {
                    select: {
                        id: true,
                        cliente: {
                            select: {
                                id: true,
                                nombre: true
                            }
                        }
                    }
                }
            }
        });
    }
    async deleteAsignacion(id) {
        const asignacion = await prisma.asignacionGastoProyecto.findUnique({
            where: { id }
        });
        if (!asignacion) {
            throw new http_error_1.HttpError(404, 'Asignación no encontrada');
        }
        await prisma.asignacionGastoProyecto.delete({
            where: { id }
        });
    }
    async getResumenGastosPorCategoria(fechaDesde, fechaHasta) {
        const where = { activo: true };
        if (fechaDesde || fechaHasta) {
            where.fecha = {};
            if (fechaDesde)
                where.fecha.gte = fechaDesde;
            if (fechaHasta)
                where.fecha.lte = fechaHasta;
        }
        return await prisma.gastoOperativo.groupBy({
            by: ['categoria'],
            where,
            _sum: {
                monto: true
            },
            _count: {
                id: true
            }
        });
    }
    async getCostosOperativosPorProyecto(presupuestoId) {
        const asignaciones = await prisma.asignacionGastoProyecto.findMany({
            where: { presupuestoId },
            include: {
                gasto: {
                    include: {
                        moneda: true
                    }
                }
            }
        });
        const totalPorMoneda = asignaciones.reduce((acc, asignacion) => {
            const codigoMoneda = asignacion.gasto.moneda.codigo;
            if (!acc[codigoMoneda]) {
                acc[codigoMoneda] = {
                    total: 0,
                    simbolo: asignacion.gasto.moneda.simbolo,
                    asignaciones: []
                };
            }
            acc[codigoMoneda].total += asignacion.montoAsignado.toNumber();
            acc[codigoMoneda].asignaciones.push(asignacion);
            return acc;
        }, {});
        return {
            presupuestoId,
            totalPorMoneda,
            cantidadAsignaciones: asignaciones.length
        };
    }
}
exports.gastoService = new GastoService();
//# sourceMappingURL=gasto.service.js.map