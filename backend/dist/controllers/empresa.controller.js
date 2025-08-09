"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.empresaController = void 0;
const empresa_service_1 = require("../services/empresa.service");
const http_error_1 = require("../utils/http-error");
const express_validator_1 = require("express-validator");
exports.empresaController = {
    async getAllEmpresas(req, res, next) {
        try {
            const { clienteId, activo } = req.query;
            const filters = {};
            if (clienteId)
                filters.clienteId = parseInt(clienteId);
            if (activo !== undefined)
                filters.activo = activo === 'true';
            const empresas = await empresa_service_1.EmpresaService.findAll(filters);
            res.json(empresas);
        }
        catch (error) {
            next(error);
        }
    },
    async getEmpresaById(req, res, next) {
        try {
            const { id } = req.params;
            const empresa = await empresa_service_1.EmpresaService.findById(parseInt(id));
            if (!empresa) {
                throw new http_error_1.HttpError(404, 'Empresa no encontrada');
            }
            res.json(empresa);
        }
        catch (error) {
            next(error);
        }
    },
    async getEmpresasByCliente(req, res, next) {
        try {
            const { clienteId } = req.params;
            const empresas = await empresa_service_1.EmpresaService.findByClienteId(parseInt(clienteId));
            res.json(empresas);
        }
        catch (error) {
            next(error);
        }
    },
    async createEmpresa(req, res, next) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                throw new http_error_1.HttpError(400, 'Datos de entrada inválidos');
            }
            const { nombre, razonSocial, cuit, telefono, email, direccion, clienteId } = req.body;
            if (cuit) {
                const existingEmpresa = await empresa_service_1.EmpresaService.findByCuit(cuit);
                if (existingEmpresa) {
                    throw new http_error_1.HttpError(400, 'Ya existe una empresa con este CUIT');
                }
            }
            const nuevaEmpresa = await empresa_service_1.EmpresaService.create({
                nombre,
                razonSocial,
                cuit,
                telefono,
                email,
                direccion,
                clienteId: parseInt(clienteId)
            });
            res.status(201).json(nuevaEmpresa);
        }
        catch (error) {
            next(error);
        }
    },
    async updateEmpresa(req, res, next) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                throw new http_error_1.HttpError(400, 'Datos de entrada inválidos');
            }
            const { id } = req.params;
            const updateData = req.body;
            const existingEmpresa = await empresa_service_1.EmpresaService.findById(parseInt(id));
            if (!existingEmpresa) {
                throw new http_error_1.HttpError(404, 'Empresa no encontrada');
            }
            if (updateData.cuit && updateData.cuit !== existingEmpresa.cuit) {
                const duplicateEmpresa = await empresa_service_1.EmpresaService.findByCuit(updateData.cuit);
                if (duplicateEmpresa) {
                    throw new http_error_1.HttpError(400, 'Ya existe una empresa con este CUIT');
                }
            }
            const empresaActualizada = await empresa_service_1.EmpresaService.update(parseInt(id), updateData);
            res.json(empresaActualizada);
        }
        catch (error) {
            next(error);
        }
    },
    async deleteEmpresa(req, res, next) {
        try {
            const { id } = req.params;
            const empresa = await empresa_service_1.EmpresaService.findById(parseInt(id));
            if (!empresa) {
                throw new http_error_1.HttpError(404, 'Empresa no encontrada');
            }
            if (empresa.presupuestos.length > 0 || empresa.facturas.length > 0) {
                await empresa_service_1.EmpresaService.update(parseInt(id), { activo: false });
                res.json({ message: 'Empresa desactivada exitosamente' });
            }
            else {
                await empresa_service_1.EmpresaService.delete(parseInt(id));
                res.json({ message: 'Empresa eliminada exitosamente' });
            }
        }
        catch (error) {
            next(error);
        }
    },
    async searchEmpresas(req, res, next) {
        try {
            const { q } = req.query;
            if (!q || typeof q !== 'string') {
                throw new http_error_1.HttpError(400, 'Parámetro de búsqueda requerido');
            }
            const empresas = await empresa_service_1.EmpresaService.findAll({});
            const filteredEmpresas = empresas.filter((empresa) => empresa.nombre.toLowerCase().includes(q.toLowerCase()) ||
                (empresa.razonSocial && empresa.razonSocial.toLowerCase().includes(q.toLowerCase())) ||
                (empresa.cuit && empresa.cuit.includes(q)) ||
                empresa.cliente.nombre.toLowerCase().includes(q.toLowerCase()));
            res.json(filteredEmpresas);
        }
        catch (error) {
            next(error);
        }
    }
};
//# sourceMappingURL=empresa.controller.js.map