"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImpuestoService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
class ImpuestoService {
    static async create(data) {
        var _a;
        try {
            console.log('ImpuestoService.create - Input data:', JSON.stringify(data, null, 2));
            if (data.porcentaje < 0 || data.porcentaje > 100) {
                throw new Error('El porcentaje debe estar entre 0 y 100');
            }
            const existingImpuesto = await prisma_1.default.impuesto.findUnique({
                where: { nombre: data.nombre }
            });
            if (existingImpuesto) {
                throw new Error(`Ya existe un impuesto con el nombre "${data.nombre}"`);
            }
            console.log('Validaciones pasadas, creando impuesto...');
            const impuesto = await prisma_1.default.impuesto.create({
                data: {
                    nombre: data.nombre,
                    porcentaje: data.porcentaje,
                    descripcion: data.descripcion,
                    activo: (_a = data.activo) !== null && _a !== void 0 ? _a : true
                }
            });
            console.log('Impuesto creado exitosamente:', impuesto.id);
            return impuesto;
        }
        catch (error) {
            console.error('Error en ImpuestoService.create:', error);
            throw error;
        }
    }
    static async findAll() {
        return prisma_1.default.impuesto.findMany({
            orderBy: [
                { activo: 'desc' },
                { nombre: 'asc' }
            ]
        });
    }
    static async findById(id) {
        return prisma_1.default.impuesto.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        presupuestoImpuestos: true,
                        facturas: true
                    }
                }
            }
        });
    }
    static async update(id, data) {
        try {
            if (data.porcentaje !== undefined && (data.porcentaje < 0 || data.porcentaje > 100)) {
                throw new Error('El porcentaje debe estar entre 0 y 100');
            }
            if (data.nombre) {
                const existingImpuesto = await prisma_1.default.impuesto.findFirst({
                    where: {
                        nombre: data.nombre,
                        NOT: { id }
                    }
                });
                if (existingImpuesto) {
                    throw new Error(`Ya existe otro impuesto con el nombre "${data.nombre}"`);
                }
            }
            return prisma_1.default.impuesto.update({
                where: { id },
                data
            });
        }
        catch (error) {
            console.error('Error en ImpuestoService.update:', error);
            throw error;
        }
    }
    static async delete(id) {
        try {
            const impuestoWithUsage = await prisma_1.default.impuesto.findUnique({
                where: { id },
                include: {
                    _count: {
                        select: {
                            presupuestoImpuestos: true,
                            facturas: true
                        }
                    }
                }
            });
            if (!impuestoWithUsage) {
                throw new Error('Impuesto no encontrado');
            }
            const totalUsage = impuestoWithUsage._count.presupuestoImpuestos + impuestoWithUsage._count.facturas;
            if (totalUsage > 0) {
                throw new Error('No se puede eliminar el impuesto porque está siendo usado en presupuestos o facturas');
            }
            return prisma_1.default.impuesto.delete({
                where: { id }
            });
        }
        catch (error) {
            console.error('Error en ImpuestoService.delete:', error);
            throw error;
        }
    }
    static async toggle(id) {
        try {
            const impuesto = await prisma_1.default.impuesto.findUnique({
                where: { id }
            });
            if (!impuesto) {
                throw new Error('Impuesto no encontrado');
            }
            return prisma_1.default.impuesto.update({
                where: { id },
                data: { activo: !impuesto.activo }
            });
        }
        catch (error) {
            console.error('Error en ImpuestoService.toggle:', error);
            throw error;
        }
    }
    static async getActive() {
        return prisma_1.default.impuesto.findMany({
            where: { activo: true },
            orderBy: { nombre: 'asc' }
        });
    }
}
exports.ImpuestoService = ImpuestoService;
//# sourceMappingURL=impuesto.service.js.map