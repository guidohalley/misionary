"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonedaService = void 0;
const client_1 = require("@prisma/client");
const library_1 = require("@prisma/client/runtime/library");
const prisma = new client_1.PrismaClient();
class MonedaService {
    static async getAllMonedas() {
        return await prisma.moneda.findMany({
            where: { activo: true },
            orderBy: { codigo: 'asc' }
        });
    }
    static async getMonedaByCodigo(codigo) {
        return await prisma.moneda.findUnique({
            where: { codigo }
        });
    }
    static async getMonedaById(id) {
        return await prisma.moneda.findUnique({
            where: { id }
        });
    }
    static async getTipoCambioActual(monedaDesdeId, monedaHaciaId) {
        return await prisma.tipoCambio.findFirst({
            where: {
                monedaDesdeId,
                monedaHaciaId
            },
            orderBy: { fecha: 'desc' },
            include: {
                monedaDesde: true,
                monedaHacia: true
            }
        });
    }
    static async getTipoCambioPorFecha(monedaDesdeId, monedaHaciaId, fecha) {
        const fechaNormalizada = new Date(fecha);
        fechaNormalizada.setHours(0, 0, 0, 0);
        return await prisma.tipoCambio.findUnique({
            where: {
                monedaDesdeId_monedaHaciaId_fecha: {
                    monedaDesdeId,
                    monedaHaciaId,
                    fecha: fechaNormalizada
                }
            },
            include: {
                monedaDesde: true,
                monedaHacia: true
            }
        });
    }
    static async upsertTipoCambio(monedaDesdeId, monedaHaciaId, valor, fecha = new Date()) {
        const fechaNormalizada = new Date(fecha);
        fechaNormalizada.setHours(0, 0, 0, 0);
        return await prisma.tipoCambio.upsert({
            where: {
                monedaDesdeId_monedaHaciaId_fecha: {
                    monedaDesdeId,
                    monedaHaciaId,
                    fecha: fechaNormalizada
                }
            },
            update: {
                valor: new library_1.Decimal(valor)
            },
            create: {
                monedaDesdeId,
                monedaHaciaId,
                valor: new library_1.Decimal(valor),
                fecha: fechaNormalizada
            },
            include: {
                monedaDesde: true,
                monedaHacia: true
            }
        });
    }
    static async convertirMoneda(monto, monedaDesdeId, monedaHaciaId, fecha) {
        if (monedaDesdeId === monedaHaciaId) {
            return {
                montoConvertido: monto,
                tipoCambio: null
            };
        }
        let tipoCambio;
        if (fecha) {
            tipoCambio = await this.getTipoCambioPorFecha(monedaDesdeId, monedaHaciaId, fecha);
        }
        else {
            tipoCambio = await this.getTipoCambioActual(monedaDesdeId, monedaHaciaId);
        }
        if (!tipoCambio) {
            throw new Error(`No se encontró tipo de cambio para las monedas especificadas`);
        }
        const montoConvertido = monto * parseFloat(tipoCambio.valor.toString());
        return {
            montoConvertido: Math.round(montoConvertido * 100) / 100,
            tipoCambio
        };
    }
    static async getHistorialTipoCambio(monedaDesdeId, monedaHaciaId, fechaDesde, fechaHasta) {
        const whereConditions = {
            monedaDesdeId,
            monedaHaciaId
        };
        if (fechaDesde || fechaHasta) {
            whereConditions.fecha = {};
            if (fechaDesde) {
                whereConditions.fecha.gte = fechaDesde;
            }
            if (fechaHasta) {
                whereConditions.fecha.lte = fechaHasta;
            }
        }
        return await prisma.tipoCambio.findMany({
            where: whereConditions,
            orderBy: { fecha: 'desc' },
            include: {
                monedaDesde: true,
                monedaHacia: true
            }
        });
    }
    static async getTiposCambioDisponibles() {
        return await prisma.tipoCambio.findMany({
            distinct: ['monedaDesdeId', 'monedaHaciaId'],
            orderBy: [
                { monedaDesdeId: 'asc' },
                { monedaHaciaId: 'asc' }
            ],
            include: {
                monedaDesde: true,
                monedaHacia: true
            }
        });
    }
    static async actualizarTiposCambioMasivo(tiposCambio, fecha = new Date()) {
        const monedas = await this.getAllMonedas();
        const resultados = [];
        for (const tipoCambio of tiposCambio) {
            const monedaDesde = monedas.find(m => m.codigo === tipoCambio.monedaDesde);
            const monedaHacia = monedas.find(m => m.codigo === tipoCambio.monedaHacia);
            if (monedaDesde && monedaHacia) {
                const resultado = await this.upsertTipoCambio(monedaDesde.id, monedaHacia.id, tipoCambio.valor, fecha);
                resultados.push(resultado);
            }
        }
        return resultados;
    }
}
exports.MonedaService = MonedaService;
//# sourceMappingURL=moneda.service.js.map