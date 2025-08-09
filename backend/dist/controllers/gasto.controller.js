"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gastoController = exports.GastoController = void 0;
const gasto_service_1 = require("../services/gasto.service");
const http_error_1 = require("../utils/http-error");
var CategoriaGasto;
(function (CategoriaGasto) {
    CategoriaGasto["OFICINA"] = "OFICINA";
    CategoriaGasto["PERSONAL"] = "PERSONAL";
    CategoriaGasto["MARKETING"] = "MARKETING";
    CategoriaGasto["TECNOLOGIA"] = "TECNOLOGIA";
    CategoriaGasto["SERVICIOS"] = "SERVICIOS";
    CategoriaGasto["TRANSPORTE"] = "TRANSPORTE";
    CategoriaGasto["COMUNICACION"] = "COMUNICACION";
    CategoriaGasto["OTROS"] = "OTROS";
})(CategoriaGasto || (CategoriaGasto = {}));
class GastoController {
    async getGastosOperativos(req, res, next) {
        try {
            const { categoria, proveedorId, monedaId, fechaDesde, fechaHasta, esRecurrente, activo, search } = req.query;
            const filters = {};
            if (categoria)
                filters.categoria = categoria;
            if (proveedorId)
                filters.proveedorId = parseInt(proveedorId);
            if (monedaId)
                filters.monedaId = parseInt(monedaId);
            if (fechaDesde)
                filters.fechaDesde = new Date(fechaDesde);
            if (fechaHasta)
                filters.fechaHasta = new Date(fechaHasta);
            if (esRecurrente !== undefined)
                filters.esRecurrente = esRecurrente === 'true';
            if (activo !== undefined)
                filters.activo = activo === 'true';
            if (search)
                filters.search = search;
            const gastos = await gasto_service_1.gastoService.getGastosOperativos(filters);
            res.json({
                success: true,
                data: gastos,
                message: 'Gastos operativos obtenidos exitosamente'
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getGastoOperativoById(req, res, next) {
        try {
            const { id } = req.params;
            const gasto = await gasto_service_1.gastoService.getGastoOperativoById(parseInt(id));
            res.json({
                success: true,
                data: gasto
            });
        }
        catch (error) {
            next(error);
        }
    }
    async createGastoOperativo(req, res, next) {
        try {
            const { concepto, descripcion, monto, monedaId, fecha, categoria, esRecurrente, frecuencia, proveedorId, comprobante, observaciones } = req.body;
            if (!concepto || !monto || !monedaId || !fecha || !categoria) {
                throw new http_error_1.HttpError(400, 'Los campos concepto, monto, monedaId, fecha y categoria son obligatorios');
            }
            if (monto <= 0) {
                throw new http_error_1.HttpError(400, 'El monto debe ser mayor a 0');
            }
            if (!Object.values(CategoriaGasto).includes(categoria)) {
                throw new http_error_1.HttpError(400, 'Categoría de gasto inválida');
            }
            const gastoData = {
                concepto,
                descripcion,
                monto: parseFloat(monto),
                monedaId: parseInt(monedaId),
                fecha: new Date(fecha),
                categoria: categoria,
                esRecurrente: esRecurrente || false,
                frecuencia,
                proveedorId: proveedorId ? parseInt(proveedorId) : undefined,
                comprobante,
                observaciones
            };
            const nuevoGasto = await gasto_service_1.gastoService.createGastoOperativo(gastoData);
            res.status(201).json({
                success: true,
                data: nuevoGasto,
                message: 'Gasto operativo creado exitosamente'
            });
        }
        catch (error) {
            next(error);
        }
    }
    async updateGastoOperativo(req, res, next) {
        try {
            const { id } = req.params;
            const updateData = { ...req.body };
            if (updateData.monto !== undefined && updateData.monto <= 0) {
                throw new http_error_1.HttpError(400, 'El monto debe ser mayor a 0');
            }
            if (updateData.categoria && !Object.values(CategoriaGasto).includes(updateData.categoria)) {
                throw new http_error_1.HttpError(400, 'Categoría de gasto inválida');
            }
            if (updateData.monto)
                updateData.monto = parseFloat(updateData.monto);
            if (updateData.monedaId)
                updateData.monedaId = parseInt(updateData.monedaId);
            if (updateData.proveedorId)
                updateData.proveedorId = parseInt(updateData.proveedorId);
            if (updateData.fecha)
                updateData.fecha = new Date(updateData.fecha);
            const gastoActualizado = await gasto_service_1.gastoService.updateGastoOperativo(parseInt(id), updateData);
            res.json({
                success: true,
                data: gastoActualizado,
                message: 'Gasto operativo actualizado exitosamente'
            });
        }
        catch (error) {
            next(error);
        }
    }
    async deleteGastoOperativo(req, res, next) {
        try {
            const { id } = req.params;
            await gasto_service_1.gastoService.deleteGastoOperativo(parseInt(id));
            res.json({
                success: true,
                message: 'Gasto operativo eliminado exitosamente'
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getAsignacionesPorGasto(req, res, next) {
        try {
            const { gastoId } = req.params;
            const asignaciones = await gasto_service_1.gastoService.getAsignacionesPorGasto(parseInt(gastoId));
            res.json({
                success: true,
                data: asignaciones,
                count: asignaciones.length
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getAsignacionesPorProyecto(req, res, next) {
        try {
            const { presupuestoId } = req.params;
            const asignaciones = await gasto_service_1.gastoService.getAsignacionesPorProyecto(parseInt(presupuestoId));
            res.json({
                success: true,
                data: asignaciones,
                count: asignaciones.length
            });
        }
        catch (error) {
            next(error);
        }
    }
    async createAsignacion(req, res, next) {
        try {
            const { gastoId, presupuestoId, porcentaje, justificacion } = req.body;
            if (!gastoId || !presupuestoId || !porcentaje) {
                throw new http_error_1.HttpError(400, 'Los campos gastoId, presupuestoId y porcentaje son obligatorios');
            }
            if (porcentaje <= 0 || porcentaje > 100) {
                throw new http_error_1.HttpError(400, 'El porcentaje debe estar entre 0.01 y 100');
            }
            const asignacionData = {
                gastoId: parseInt(gastoId),
                presupuestoId: parseInt(presupuestoId),
                porcentaje: parseFloat(porcentaje),
                justificacion
            };
            const nuevaAsignacion = await gasto_service_1.gastoService.createAsignacion(asignacionData);
            res.status(201).json({
                success: true,
                data: nuevaAsignacion,
                message: 'Asignación creada exitosamente'
            });
        }
        catch (error) {
            next(error);
        }
    }
    async updateAsignacion(req, res, next) {
        try {
            const { id } = req.params;
            const updateData = { ...req.body };
            if (updateData.porcentaje !== undefined) {
                if (updateData.porcentaje <= 0 || updateData.porcentaje > 100) {
                    throw new http_error_1.HttpError(400, 'El porcentaje debe estar entre 0.01 y 100');
                }
                updateData.porcentaje = parseFloat(updateData.porcentaje);
            }
            if (updateData.gastoId)
                updateData.gastoId = parseInt(updateData.gastoId);
            if (updateData.presupuestoId)
                updateData.presupuestoId = parseInt(updateData.presupuestoId);
            const asignacionActualizada = await gasto_service_1.gastoService.updateAsignacion(parseInt(id), updateData);
            res.json({
                success: true,
                data: asignacionActualizada,
                message: 'Asignación actualizada exitosamente'
            });
        }
        catch (error) {
            next(error);
        }
    }
    async deleteAsignacion(req, res, next) {
        try {
            const { id } = req.params;
            await gasto_service_1.gastoService.deleteAsignacion(parseInt(id));
            res.json({
                success: true,
                message: 'Asignación eliminada exitosamente'
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getResumenGastosPorCategoria(req, res, next) {
        try {
            const { fechaDesde, fechaHasta } = req.query;
            const fechaDesdeDate = fechaDesde ? new Date(fechaDesde) : undefined;
            const fechaHastaDate = fechaHasta ? new Date(fechaHasta) : undefined;
            const resumen = await gasto_service_1.gastoService.getResumenGastosPorCategoria(fechaDesdeDate, fechaHastaDate);
            res.json({
                success: true,
                data: resumen,
                filters: {
                    fechaDesde: fechaDesdeDate,
                    fechaHasta: fechaHastaDate
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getCostosOperativosPorProyecto(req, res, next) {
        try {
            const { presupuestoId } = req.params;
            const costos = await gasto_service_1.gastoService.getCostosOperativosPorProyecto(parseInt(presupuestoId));
            res.json({
                success: true,
                data: costos
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getCategoriasGasto(_req, res, next) {
        try {
            const categorias = Object.values(CategoriaGasto).map((categoria) => ({
                value: categoria,
                label: categoria.toLowerCase().replace('_', ' ')
            }));
            res.json({
                success: true,
                data: categorias
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.GastoController = GastoController;
exports.gastoController = new GastoController();
//# sourceMappingURL=gasto.controller.js.map