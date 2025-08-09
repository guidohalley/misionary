"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistorialPrecioService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class HistorialPrecioService {
    static async getHistorialProducto(productoId, monedaId, limit) {
        const whereConditions = {
            productoId,
            activo: true
        };
        if (monedaId) {
            whereConditions.monedaId = monedaId;
        }
        return await prisma.historialPrecio.findMany({
            where: whereConditions,
            include: {
                moneda: true,
                usuario: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true
                    }
                }
            },
            orderBy: { fechaDesde: 'desc' },
            take: limit
        });
    }
    static async getHistorialServicio(servicioId, monedaId, limit) {
        const whereConditions = {
            servicioId,
            activo: true
        };
        if (monedaId) {
            whereConditions.monedaId = monedaId;
        }
        return await prisma.historialPrecio.findMany({
            where: whereConditions,
            include: {
                moneda: true,
                usuario: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true
                    }
                }
            },
            orderBy: { fechaDesde: 'desc' },
            take: limit
        });
    }
    static async getPrecioActualProducto(productoId, monedaId) {
        return await prisma.historialPrecio.findFirst({
            where: {
                productoId,
                monedaId,
                activo: true,
                fechaHasta: null
            },
            include: {
                moneda: true,
                usuario: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true
                    }
                }
            }
        });
    }
    static async getPrecioActualServicio(servicioId, monedaId) {
        return await prisma.historialPrecio.findFirst({
            where: {
                servicioId,
                monedaId,
                activo: true,
                fechaHasta: null
            },
            include: {
                moneda: true,
                usuario: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true
                    }
                }
            }
        });
    }
    static async actualizarPrecioProducto(productoId, monedaId, nuevoPrecio, motivoCambio, usuarioId) {
        return await prisma.$transaction(async (tx) => {
            const ahora = new Date();
            await tx.historialPrecio.updateMany({
                where: {
                    productoId,
                    monedaId,
                    fechaHasta: null,
                    activo: true
                },
                data: {
                    fechaHasta: ahora
                }
            });
            const nuevoHistorial = await tx.historialPrecio.create({
                data: {
                    productoId,
                    monedaId,
                    precio: new client_1.Prisma.Decimal(nuevoPrecio),
                    fechaDesde: ahora,
                    fechaHasta: null,
                    motivoCambio,
                    usuarioId,
                    activo: true
                },
                include: {
                    moneda: true,
                    usuario: {
                        select: {
                            id: true,
                            nombre: true,
                            email: true
                        }
                    }
                }
            });
            await tx.producto.update({
                where: { id: productoId },
                data: { precio: new client_1.Prisma.Decimal(nuevoPrecio) }
            });
            return nuevoHistorial;
        });
    }
    static async actualizarPrecioServicio(servicioId, monedaId, nuevoPrecio, motivoCambio, usuarioId) {
        return await prisma.$transaction(async (tx) => {
            const ahora = new Date();
            await tx.historialPrecio.updateMany({
                where: {
                    servicioId,
                    monedaId,
                    fechaHasta: null,
                    activo: true
                },
                data: {
                    fechaHasta: ahora
                }
            });
            const nuevoHistorial = await tx.historialPrecio.create({
                data: {
                    servicioId,
                    monedaId,
                    precio: new client_1.Prisma.Decimal(nuevoPrecio),
                    fechaDesde: ahora,
                    fechaHasta: null,
                    motivoCambio,
                    usuarioId,
                    activo: true
                },
                include: {
                    moneda: true,
                    usuario: {
                        select: {
                            id: true,
                            nombre: true,
                            email: true
                        }
                    }
                }
            });
            await tx.servicio.update({
                where: { id: servicioId },
                data: { precio: new client_1.Prisma.Decimal(nuevoPrecio) }
            });
            return nuevoHistorial;
        });
    }
    static async actualizacionMasivaPorcentaje(tipo, monedaId, porcentajeAumento, motivoCambio, usuarioId, filtros) {
        const errores = [];
        let actualizados = 0;
        return await prisma.$transaction(async (tx) => {
            let items = [];
            if (tipo === 'PRODUCTO') {
                const whereConditions = { monedaId };
                if (filtros === null || filtros === void 0 ? void 0 : filtros.proveedorId)
                    whereConditions.proveedorId = filtros.proveedorId;
                if (filtros === null || filtros === void 0 ? void 0 : filtros.ids)
                    whereConditions.id = { in: filtros.ids };
                items = await tx.producto.findMany({
                    where: whereConditions,
                    select: { id: true, precio: true }
                });
            }
            else {
                const whereConditions = { monedaId };
                if (filtros === null || filtros === void 0 ? void 0 : filtros.proveedorId)
                    whereConditions.proveedorId = filtros.proveedorId;
                if (filtros === null || filtros === void 0 ? void 0 : filtros.ids)
                    whereConditions.id = { in: filtros.ids };
                items = await tx.servicio.findMany({
                    where: whereConditions,
                    select: { id: true, precio: true }
                });
            }
            const ahora = new Date();
            for (const item of items) {
                try {
                    const precioActual = parseFloat(item.precio.toString());
                    const nuevoPrecio = precioActual * (1 + porcentajeAumento / 100);
                    if (tipo === 'PRODUCTO') {
                        await tx.historialPrecio.updateMany({
                            where: {
                                productoId: item.id,
                                monedaId,
                                fechaHasta: null,
                                activo: true
                            },
                            data: { fechaHasta: ahora }
                        });
                        await tx.historialPrecio.create({
                            data: {
                                productoId: item.id,
                                monedaId,
                                precio: new client_1.Prisma.Decimal(nuevoPrecio),
                                fechaDesde: ahora,
                                fechaHasta: null,
                                motivoCambio,
                                usuarioId,
                                activo: true
                            }
                        });
                        await tx.producto.update({
                            where: { id: item.id },
                            data: { precio: new client_1.Prisma.Decimal(nuevoPrecio) }
                        });
                    }
                    else {
                        await tx.historialPrecio.updateMany({
                            where: {
                                servicioId: item.id,
                                monedaId,
                                fechaHasta: null,
                                activo: true
                            },
                            data: { fechaHasta: ahora }
                        });
                        await tx.historialPrecio.create({
                            data: {
                                servicioId: item.id,
                                monedaId,
                                precio: new client_1.Prisma.Decimal(nuevoPrecio),
                                fechaDesde: ahora,
                                fechaHasta: null,
                                motivoCambio,
                                usuarioId,
                                activo: true
                            }
                        });
                        await tx.servicio.update({
                            where: { id: item.id },
                            data: { precio: new client_1.Prisma.Decimal(nuevoPrecio) }
                        });
                    }
                    actualizados++;
                }
                catch (error) {
                    errores.push(`Error actualizando ${tipo.toLowerCase()} ${item.id}: ${error}`);
                }
            }
            return { actualizados, errores };
        });
    }
    static async obtenerPreciosDesactualizados(diasLimite = 30, monedaId) {
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() - diasLimite);
        const whereConditions = {
            fechaDesde: { lt: fechaLimite },
            fechaHasta: null,
            activo: true
        };
        if (monedaId) {
            whereConditions.monedaId = monedaId;
        }
        const historialDesactualizado = await prisma.historialPrecio.findMany({
            where: whereConditions,
            include: {
                producto: {
                    select: { id: true, nombre: true }
                },
                servicio: {
                    select: { id: true, nombre: true }
                }
            }
        });
        return historialDesactualizado.map(h => {
            var _a, _b, _c, _d;
            const ahora = new Date();
            const diasSinActualizar = Math.floor((ahora.getTime() - h.fechaDesde.getTime()) / (1000 * 60 * 60 * 24));
            return {
                tipo: h.producto ? 'PRODUCTO' : 'SERVICIO',
                id: ((_a = h.producto) === null || _a === void 0 ? void 0 : _a.id) || ((_b = h.servicio) === null || _b === void 0 ? void 0 : _b.id) || 0,
                nombre: ((_c = h.producto) === null || _c === void 0 ? void 0 : _c.nombre) || ((_d = h.servicio) === null || _d === void 0 ? void 0 : _d.nombre) || '',
                ultimaActualizacion: h.fechaDesde,
                diasSinActualizar
            };
        });
    }
    static async obtenerEstadisticasCambios(fechaDesde, fechaHasta, monedaId) {
        const whereConditions = {
            fechaDesde: {
                gte: fechaDesde,
                lte: fechaHasta
            },
            activo: true
        };
        if (monedaId) {
            whereConditions.monedaId = monedaId;
        }
        const cambios = await prisma.historialPrecio.findMany({
            where: whereConditions,
            orderBy: { fechaDesde: 'asc' }
        });
        const totalCambios = cambios.length;
        const cambiosPorMotivo = {};
        cambios.forEach(cambio => {
            const motivo = cambio.motivoCambio || 'Sin especificar';
            cambiosPorMotivo[motivo] = (cambiosPorMotivo[motivo] || 0) + 1;
        });
        let sumaAumentos = 0;
        let contadorAumentos = 0;
        const cambiosPorDia = {};
        cambios.forEach(cambio => {
            const fecha = cambio.fechaDesde.toISOString().split('T')[0];
            cambiosPorDia[fecha] = (cambiosPorDia[fecha] || 0) + 1;
        });
        return {
            totalCambios,
            cambiosPorMotivo,
            promedioAumentoPorcentaje: contadorAumentos > 0 ? sumaAumentos / contadorAumentos : 0,
            cambiosPorDia: Object.entries(cambiosPorDia).map(([fecha, cantidad]) => ({
                fecha,
                cantidad
            }))
        };
    }
}
exports.HistorialPrecioService = HistorialPrecioService;
//# sourceMappingURL=historialPrecio.service.js.map