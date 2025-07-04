"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacturaController = void 0;
const factura_service_1 = require("../services/factura.service");
const client_1 = require("@prisma/client");
const http_error_1 = require("../utils/http-error");
class FacturaController {
    static async create(req, res, next) {
        try {
            const factura = await factura_service_1.FacturaService.create(req.body);
            res.status(201).json(factura);
        }
        catch (error) {
            next(error);
        }
    }
    static async findById(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const factura = await factura_service_1.FacturaService.findById(id);
            res.json(factura);
        }
        catch (error) {
            next(error);
        }
    }
    static async update(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const { estado, fecha } = req.body;
            if (estado && !Object.values(client_1.EstadoFactura).includes(estado)) {
                throw http_error_1.HttpError.BadRequest('Estado de factura inválido');
            }
            const factura = await factura_service_1.FacturaService.update(id, { estado, fecha });
            res.json(factura);
        }
        catch (error) {
            next(error);
        }
    }
    static async findAll(req, res, next) {
        try {
            const { estado, clienteId, fechaDesde, fechaHasta } = req.query;
            const filters = {};
            if (estado)
                filters.estado = estado;
            if (clienteId)
                filters.clienteId = parseInt(clienteId);
            if (fechaDesde)
                filters.fechaDesde = new Date(fechaDesde);
            if (fechaHasta)
                filters.fechaHasta = new Date(fechaHasta);
            const facturas = await factura_service_1.FacturaService.findAll(filters);
            res.json(facturas);
        }
        catch (error) {
            next(error);
        }
    }
    static async anular(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const factura = await factura_service_1.FacturaService.anular(id);
            res.json(factura);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.FacturaController = FacturaController;
//# sourceMappingURL=factura.controller.js.map