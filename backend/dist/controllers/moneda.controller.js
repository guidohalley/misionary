"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarHistorialQuery = exports.validarActualizacionMasiva = exports.validarTipoCambioBody = exports.validarConversionBody = exports.validarTipoCambioParams = exports.validarCodigoMoneda = exports.MonedaController = void 0;
const moneda_service_1 = require("../services/moneda.service");
const express_validator_1 = require("express-validator");
var CodigoMoneda;
(function (CodigoMoneda) {
    CodigoMoneda["ARS"] = "ARS";
    CodigoMoneda["USD"] = "USD";
    CodigoMoneda["EUR"] = "EUR";
})(CodigoMoneda || (CodigoMoneda = {}));
class MonedaController {
    static async getAllMonedas(_req, res) {
        try {
            const monedas = await moneda_service_1.MonedaService.getAllMonedas();
            return res.json({
                success: true,
                data: monedas,
                message: 'Monedas obtenidas exitosamente'
            });
        }
        catch (error) {
            console.error('Error al obtener monedas:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }
    static async getMonedaByCodigo(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de entrada inválidos',
                    errors: errors.array()
                });
            }
            const { codigo } = req.params;
            const moneda = await moneda_service_1.MonedaService.getMonedaByCodigo(codigo);
            if (!moneda) {
                return res.status(404).json({
                    success: false,
                    message: `Moneda con código ${codigo} no encontrada`
                });
            }
            res.json({
                success: true,
                data: moneda,
                message: 'Moneda obtenida exitosamente'
            });
        }
        catch (error) {
            console.error('Error al obtener moneda por código:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }
    static async getTipoCambioActual(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de entrada inválidos',
                    errors: errors.array()
                });
            }
            const { monedaDesde, monedaHacia } = req.params;
            const monedaDesdeObj = await moneda_service_1.MonedaService.getMonedaByCodigo(monedaDesde);
            const monedaHaciaObj = await moneda_service_1.MonedaService.getMonedaByCodigo(monedaHacia);
            if (!monedaDesdeObj || !monedaHaciaObj) {
                return res.status(404).json({
                    success: false,
                    message: 'Una o ambas monedas no fueron encontradas'
                });
            }
            const tipoCambio = await moneda_service_1.MonedaService.getTipoCambioActual(monedaDesdeObj.id, monedaHaciaObj.id);
            if (!tipoCambio) {
                return res.status(404).json({
                    success: false,
                    message: `No se encontró tipo de cambio para ${monedaDesde} -> ${monedaHacia}`
                });
            }
            res.json({
                success: true,
                data: tipoCambio,
                message: 'Tipo de cambio obtenido exitosamente'
            });
        }
        catch (error) {
            console.error('Error al obtener tipo de cambio:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }
    static async convertirMoneda(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de entrada inválidos',
                    errors: errors.array()
                });
            }
            const { monto, monedaDesde, monedaHacia, fecha } = req.body;
            const monedaDesdeObj = await moneda_service_1.MonedaService.getMonedaByCodigo(monedaDesde);
            const monedaHaciaObj = await moneda_service_1.MonedaService.getMonedaByCodigo(monedaHacia);
            if (!monedaDesdeObj || !monedaHaciaObj) {
                return res.status(404).json({
                    success: false,
                    message: 'Una o ambas monedas no fueron encontradas'
                });
            }
            const fechaConversion = fecha ? new Date(fecha) : undefined;
            const resultado = await moneda_service_1.MonedaService.convertirMoneda(parseFloat(monto), monedaDesdeObj.id, monedaHaciaObj.id, fechaConversion);
            res.json({
                success: true,
                data: {
                    montoOriginal: parseFloat(monto),
                    monedaDesde: monedaDesdeObj.codigo,
                    monedaHacia: monedaHaciaObj.codigo,
                    montoConvertido: resultado.montoConvertido,
                    tipoCambio: resultado.tipoCambio,
                    fecha: fechaConversion || new Date()
                },
                message: 'Conversión realizada exitosamente'
            });
        }
        catch (error) {
            console.error('Error al convertir moneda:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }
    static async upsertTipoCambio(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de entrada inválidos',
                    errors: errors.array()
                });
            }
            const { monedaDesde, monedaHacia, valor, fecha } = req.body;
            const monedaDesdeObj = await moneda_service_1.MonedaService.getMonedaByCodigo(monedaDesde);
            const monedaHaciaObj = await moneda_service_1.MonedaService.getMonedaByCodigo(monedaHacia);
            if (!monedaDesdeObj || !monedaHaciaObj) {
                return res.status(404).json({
                    success: false,
                    message: 'Una o ambas monedas no fueron encontradas'
                });
            }
            const fechaTipoCambio = fecha ? new Date(fecha) : new Date();
            const tipoCambio = await moneda_service_1.MonedaService.upsertTipoCambio(monedaDesdeObj.id, monedaHaciaObj.id, parseFloat(valor), fechaTipoCambio);
            res.json({
                success: true,
                data: tipoCambio,
                message: 'Tipo de cambio actualizado exitosamente'
            });
        }
        catch (error) {
            console.error('Error al actualizar tipo de cambio:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }
    static async getHistorialTipoCambio(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de entrada inválidos',
                    errors: errors.array()
                });
            }
            const { monedaDesde, monedaHacia } = req.params;
            const { fechaDesde, fechaHasta } = req.query;
            const monedaDesdeObj = await moneda_service_1.MonedaService.getMonedaByCodigo(monedaDesde);
            const monedaHaciaObj = await moneda_service_1.MonedaService.getMonedaByCodigo(monedaHacia);
            if (!monedaDesdeObj || !monedaHaciaObj) {
                return res.status(404).json({
                    success: false,
                    message: 'Una o ambas monedas no fueron encontradas'
                });
            }
            const fechaDesdeDate = fechaDesde ? new Date(fechaDesde) : undefined;
            const fechaHastaDate = fechaHasta ? new Date(fechaHasta) : undefined;
            const historial = await moneda_service_1.MonedaService.getHistorialTipoCambio(monedaDesdeObj.id, monedaHaciaObj.id, fechaDesdeDate, fechaHastaDate);
            res.json({
                success: true,
                data: historial,
                message: 'Historial de tipos de cambio obtenido exitosamente'
            });
        }
        catch (error) {
            console.error('Error al obtener historial de tipos de cambio:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }
    static async actualizarTiposCambioMasivo(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de entrada inválidos',
                    errors: errors.array()
                });
            }
            const { tiposCambio, fecha } = req.body;
            const fechaActualizacion = fecha ? new Date(fecha) : new Date();
            const resultados = await moneda_service_1.MonedaService.actualizarTiposCambioMasivo(tiposCambio, fechaActualizacion);
            res.json({
                success: true,
                data: resultados,
                message: `${resultados.length} tipos de cambio actualizados exitosamente`
            });
        }
        catch (error) {
            console.error('Error al actualizar tipos de cambio masivamente:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }
}
exports.MonedaController = MonedaController;
exports.validarCodigoMoneda = [
    (0, express_validator_1.param)('codigo')
        .isIn(['ARS', 'USD', 'EUR'])
        .withMessage('Código de moneda inválido. Debe ser ARS, USD o EUR')
];
exports.validarTipoCambioParams = [
    (0, express_validator_1.param)('monedaDesde')
        .isIn(['ARS', 'USD', 'EUR'])
        .withMessage('Código de moneda origen inválido'),
    (0, express_validator_1.param)('monedaHacia')
        .isIn(['ARS', 'USD', 'EUR'])
        .withMessage('Código de moneda destino inválido')
];
exports.validarConversionBody = [
    (0, express_validator_1.body)('monto')
        .isNumeric()
        .withMessage('El monto debe ser un número')
        .isFloat({ min: 0 })
        .withMessage('El monto debe ser mayor a 0'),
    (0, express_validator_1.body)('monedaDesde')
        .isIn(['ARS', 'USD', 'EUR'])
        .withMessage('Código de moneda origen inválido'),
    (0, express_validator_1.body)('monedaHacia')
        .isIn(['ARS', 'USD', 'EUR'])
        .withMessage('Código de moneda destino inválido'),
    (0, express_validator_1.body)('fecha')
        .optional()
        .isISO8601()
        .withMessage('La fecha debe tener formato ISO8601')
];
exports.validarTipoCambioBody = [
    (0, express_validator_1.body)('monedaDesde')
        .isIn(['ARS', 'USD', 'EUR'])
        .withMessage('Código de moneda origen inválido'),
    (0, express_validator_1.body)('monedaHacia')
        .isIn(['ARS', 'USD', 'EUR'])
        .withMessage('Código de moneda destino inválido'),
    (0, express_validator_1.body)('valor')
        .isNumeric()
        .withMessage('El valor debe ser un número')
        .isFloat({ min: 0 })
        .withMessage('El valor debe ser mayor a 0'),
    (0, express_validator_1.body)('fecha')
        .optional()
        .isISO8601()
        .withMessage('La fecha debe tener formato ISO8601')
];
exports.validarActualizacionMasiva = [
    (0, express_validator_1.body)('tiposCambio')
        .isArray({ min: 1 })
        .withMessage('Debe proporcionar al menos un tipo de cambio'),
    (0, express_validator_1.body)('tiposCambio.*.monedaDesde')
        .isIn(['ARS', 'USD', 'EUR'])
        .withMessage('Código de moneda origen inválido'),
    (0, express_validator_1.body)('tiposCambio.*.monedaHacia')
        .isIn(['ARS', 'USD', 'EUR'])
        .withMessage('Código de moneda destino inválido'),
    (0, express_validator_1.body)('tiposCambio.*.valor')
        .isNumeric()
        .withMessage('El valor debe ser un número')
        .isFloat({ min: 0 })
        .withMessage('El valor debe ser mayor a 0'),
    (0, express_validator_1.body)('fecha')
        .optional()
        .isISO8601()
        .withMessage('La fecha debe tener formato ISO8601')
];
exports.validarHistorialQuery = [
    ...exports.validarTipoCambioParams,
    (0, express_validator_1.query)('fechaDesde')
        .optional()
        .isISO8601()
        .withMessage('La fecha desde debe tener formato ISO8601'),
    (0, express_validator_1.query)('fechaHasta')
        .optional()
        .isISO8601()
        .withMessage('La fecha hasta debe tener formato ISO8601')
];
//# sourceMappingURL=moneda.controller.js.map