"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarFechas = exports.validarActualizacionMasiva = exports.validarActualizacionPrecio = exports.validarMonedaId = exports.validarIdNumerico = exports.HistorialPrecioController = void 0;
const historialPrecio_service_1 = require("../services/historialPrecio.service");
const express_validator_1 = require("express-validator");
class HistorialPrecioController {
    static async getHistorialProducto(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de entrada inválidos',
                    errors: errors.array()
                });
            }
            const productoId = parseInt(req.params.id);
            const { monedaId, limit } = req.query;
            const historial = await historialPrecio_service_1.HistorialPrecioService.getHistorialProducto(productoId, monedaId ? parseInt(monedaId) : undefined, limit ? parseInt(limit) : undefined);
            return res.json({
                success: true,
                data: historial,
                message: 'Historial de precios obtenido exitosamente'
            });
        }
        catch (error) {
            console.error('Error al obtener historial de precios del producto:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }
    static async getHistorialServicio(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de entrada inválidos',
                    errors: errors.array()
                });
            }
            const servicioId = parseInt(req.params.id);
            const { monedaId, limit } = req.query;
            const historial = await historialPrecio_service_1.HistorialPrecioService.getHistorialServicio(servicioId, monedaId ? parseInt(monedaId) : undefined, limit ? parseInt(limit) : undefined);
            return res.json({
                success: true,
                data: historial,
                message: 'Historial de precios obtenido exitosamente'
            });
        }
        catch (error) {
            console.error('Error al obtener historial de precios del servicio:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }
    static async getPrecioActualProducto(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de entrada inválidos',
                    errors: errors.array()
                });
            }
            const productoId = parseInt(req.params.id);
            const monedaId = parseInt(req.params.monedaId);
            const precioActual = await historialPrecio_service_1.HistorialPrecioService.getPrecioActualProducto(productoId, monedaId);
            if (!precioActual) {
                return res.status(404).json({
                    success: false,
                    message: 'No se encontró precio actual para el producto en la moneda especificada'
                });
            }
            return res.json({
                success: true,
                data: precioActual,
                message: 'Precio actual obtenido exitosamente'
            });
        }
        catch (error) {
            console.error('Error al obtener precio actual del producto:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }
    static async getPrecioActualServicio(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de entrada inválidos',
                    errors: errors.array()
                });
            }
            const servicioId = parseInt(req.params.id);
            const monedaId = parseInt(req.params.monedaId);
            const precioActual = await historialPrecio_service_1.HistorialPrecioService.getPrecioActualServicio(servicioId, monedaId);
            if (!precioActual) {
                return res.status(404).json({
                    success: false,
                    message: 'No se encontró precio actual para el servicio en la moneda especificada'
                });
            }
            return res.json({
                success: true,
                data: precioActual,
                message: 'Precio actual obtenido exitosamente'
            });
        }
        catch (error) {
            console.error('Error al obtener precio actual del servicio:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }
    static async actualizarPrecioProducto(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de entrada inválidos',
                    errors: errors.array()
                });
            }
            const productoId = parseInt(req.params.id);
            const { monedaId, precio, motivoCambio } = req.body;
            const usuarioId = req.user.id;
            const nuevoHistorial = await historialPrecio_service_1.HistorialPrecioService.actualizarPrecioProducto(productoId, monedaId, precio, motivoCambio, usuarioId);
            return res.json({
                success: true,
                data: nuevoHistorial,
                message: 'Precio del producto actualizado exitosamente'
            });
        }
        catch (error) {
            console.error('Error al actualizar precio del producto:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }
    static async actualizarPrecioServicio(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de entrada inválidos',
                    errors: errors.array()
                });
            }
            const servicioId = parseInt(req.params.id);
            const { monedaId, precio, motivoCambio } = req.body;
            const usuarioId = req.user.id;
            const nuevoHistorial = await historialPrecio_service_1.HistorialPrecioService.actualizarPrecioServicio(servicioId, monedaId, precio, motivoCambio, usuarioId);
            return res.json({
                success: true,
                data: nuevoHistorial,
                message: 'Precio del servicio actualizado exitosamente'
            });
        }
        catch (error) {
            console.error('Error al actualizar precio del servicio:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }
    static async actualizacionMasiva(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de entrada inválidos',
                    errors: errors.array()
                });
            }
            const { tipo, monedaId, porcentajeAumento, motivoCambio, filtros } = req.body;
            const usuarioId = req.user.id;
            const resultado = await historialPrecio_service_1.HistorialPrecioService.actualizacionMasivaPorcentaje(tipo, monedaId, porcentajeAumento, motivoCambio, usuarioId, filtros);
            return res.json({
                success: true,
                data: resultado,
                message: `Actualización masiva completada. ${resultado.actualizados} items actualizados.`
            });
        }
        catch (error) {
            console.error('Error en actualización masiva:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }
    static async getPreciosDesactualizados(req, res) {
        try {
            const { diasLimite, monedaId } = req.query;
            const preciosDesactualizados = await historialPrecio_service_1.HistorialPrecioService.obtenerPreciosDesactualizados(diasLimite ? parseInt(diasLimite) : 30, monedaId ? parseInt(monedaId) : undefined);
            return res.json({
                success: true,
                data: preciosDesactualizados,
                message: 'Precios desactualizados obtenidos exitosamente'
            });
        }
        catch (error) {
            console.error('Error al obtener precios desactualizados:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }
    static async getEstadisticasCambios(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de entrada inválidos',
                    errors: errors.array()
                });
            }
            const { fechaDesde, fechaHasta, monedaId } = req.query;
            const estadisticas = await historialPrecio_service_1.HistorialPrecioService.obtenerEstadisticasCambios(new Date(fechaDesde), new Date(fechaHasta), monedaId ? parseInt(monedaId) : undefined);
            return res.json({
                success: true,
                data: estadisticas,
                message: 'Estadísticas de cambios obtenidas exitosamente'
            });
        }
        catch (error) {
            console.error('Error al obtener estadísticas de cambios:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }
}
exports.HistorialPrecioController = HistorialPrecioController;
exports.validarIdNumerico = [
    (0, express_validator_1.param)('id')
        .isInt({ min: 1 })
        .withMessage('El ID debe ser un número entero positivo')
];
exports.validarMonedaId = [
    (0, express_validator_1.param)('monedaId')
        .isInt({ min: 1 })
        .withMessage('El ID de moneda debe ser un número entero positivo')
];
exports.validarActualizacionPrecio = [
    (0, express_validator_1.body)('monedaId')
        .isInt({ min: 1 })
        .withMessage('El ID de moneda es requerido y debe ser un número entero positivo'),
    (0, express_validator_1.body)('precio')
        .isFloat({ min: 0.01 })
        .withMessage('El precio debe ser un número positivo'),
    (0, express_validator_1.body)('motivoCambio')
        .isString()
        .isLength({ min: 3, max: 255 })
        .withMessage('El motivo del cambio es requerido (3-255 caracteres)')
];
exports.validarActualizacionMasiva = [
    (0, express_validator_1.body)('tipo')
        .isIn(['PRODUCTO', 'SERVICIO'])
        .withMessage('El tipo debe ser PRODUCTO o SERVICIO'),
    (0, express_validator_1.body)('monedaId')
        .isInt({ min: 1 })
        .withMessage('El ID de moneda es requerido y debe ser un número entero positivo'),
    (0, express_validator_1.body)('porcentajeAumento')
        .isFloat({ min: -100, max: 1000 })
        .withMessage('El porcentaje de aumento debe estar entre -100% y 1000%'),
    (0, express_validator_1.body)('motivoCambio')
        .isString()
        .isLength({ min: 3, max: 255 })
        .withMessage('El motivo del cambio es requerido (3-255 caracteres)')
];
exports.validarFechas = [
    (0, express_validator_1.query)('fechaDesde')
        .isISO8601()
        .withMessage('La fecha desde debe ser una fecha válida (ISO 8601)'),
    (0, express_validator_1.query)('fechaHasta')
        .isISO8601()
        .withMessage('La fecha hasta debe ser una fecha válida (ISO 8601)')
];
//# sourceMappingURL=historialPrecio.controller.js.map