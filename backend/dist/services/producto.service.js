"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductoService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
class ProductoService {
    static async create(data) {
        var _a;
        const precioFinal = (_a = data.precio) !== null && _a !== void 0 ? _a : data.costoProveedor * (1 + data.margenAgencia / 100);
        return prisma_1.default.producto.create({
            data: {
                nombre: data.nombre,
                costoProveedor: data.costoProveedor,
                margenAgencia: data.margenAgencia,
                precio: precioFinal,
                proveedorId: data.proveedorId,
                monedaId: data.monedaId || 1
            },
            include: {
                proveedor: true,
                moneda: true
            }
        });
    }
    static async findById(id) {
        return prisma_1.default.producto.findUnique({
            where: { id },
            include: {
                proveedor: true,
                moneda: true,
                items: {
                    include: {
                        presupuesto: true
                    }
                }
            }
        });
    }
    static async update(id, data) {
        var _a, _b;
        let updateData = { ...data };
        if (data.costoProveedor !== undefined || data.margenAgencia !== undefined) {
            const current = await prisma_1.default.producto.findUnique({ where: { id } });
            if (current) {
                const costoActual = (_a = data.costoProveedor) !== null && _a !== void 0 ? _a : Number(current.costoProveedor);
                const margenActual = (_b = data.margenAgencia) !== null && _b !== void 0 ? _b : Number(current.margenAgencia);
                if (data.precio === undefined) {
                    updateData.precio = costoActual * (1 + margenActual / 100);
                }
            }
        }
        return prisma_1.default.producto.update({
            where: { id },
            data: updateData,
            include: {
                proveedor: true,
                moneda: true
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
                proveedor: true,
                moneda: true
            }
        });
    }
}
exports.ProductoService = ProductoService;
//# sourceMappingURL=producto.service.js.map