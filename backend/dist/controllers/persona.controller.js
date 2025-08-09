"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonaController = void 0;
const persona_service_1 = require("../services/persona.service");
const bcrypt_1 = __importDefault(require("bcrypt"));
class PersonaController {
    static async create(req, res) {
        try {
            const { password, tipo, roles, ...rest } = req.body;
            const esUsuario = tipo === 'INTERNO' || tipo === 'PROVEEDOR';
            let rolesFinales = [];
            if (tipo === 'CLIENTE') {
                rolesFinales = [];
            }
            else if (tipo === 'PROVEEDOR') {
                rolesFinales = ['PROVEEDOR'];
            }
            else if (tipo === 'INTERNO') {
                rolesFinales = roles || ['ADMIN'];
            }
            let hashedPassword = null;
            if (password && esUsuario) {
                hashedPassword = await bcrypt_1.default.hash(password, 10);
            }
            const persona = await persona_service_1.PersonaService.create({
                ...rest,
                tipo,
                roles: rolesFinales,
                password: hashedPassword,
                esUsuario,
                activo: true
            });
            res.status(201).json(persona);
        }
        catch (error) {
            console.error('Error en PersonaController.create:', error);
            res.status(500).json({ error: 'Error al crear la persona' });
        }
    }
    static async findById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const persona = await persona_service_1.PersonaService.findById(id);
            if (!persona) {
                return res.status(404).json({ error: 'Persona no encontrada' });
            }
            return res.json(persona);
        }
        catch (error) {
            console.error('Error en PersonaController.findById:', error);
            return res.status(500).json({ error: 'Error al buscar la persona' });
        }
    }
    static async update(req, res) {
        try {
            const id = parseInt(req.params.id);
            const { password, tipo, roles, ...rest } = req.body;
            console.log('Datos recibidos para actualizar persona:', { id, body: req.body });
            let updateData = rest;
            if (tipo) {
                updateData.tipo = tipo;
                updateData.esUsuario = tipo === 'INTERNO' || tipo === 'PROVEEDOR';
                if (tipo === 'CLIENTE') {
                    updateData.roles = [];
                }
                else if (tipo === 'PROVEEDOR') {
                    updateData.roles = ['PROVEEDOR'];
                }
                else if (tipo === 'INTERNO') {
                    updateData.roles = roles || ['ADMIN'];
                }
            }
            if (password && (updateData.tipo === 'INTERNO' || updateData.tipo === 'PROVEEDOR')) {
                const hashedPassword = await bcrypt_1.default.hash(password, 10);
                updateData.password = hashedPassword;
            }
            console.log('Datos para actualizar:', updateData);
            const persona = await persona_service_1.PersonaService.update(id, updateData);
            console.log('Persona actualizada:', persona);
            res.json(persona);
        }
        catch (error) {
            console.error('Error en PersonaController.update:', error);
            res.status(500).json({ error: 'Error al actualizar la persona' });
        }
    }
    static async delete(req, res) {
        try {
            const id = parseInt(req.params.id);
            await persona_service_1.PersonaService.delete(id);
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: 'Error al eliminar la persona' });
        }
    }
    static async findAll(req, res) {
        try {
            const { tipo } = req.query;
            const personas = await persona_service_1.PersonaService.findAll(tipo);
            res.json(personas);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al obtener las personas' });
        }
    }
    static async createClienteWithEmpresa(req, res) {
        try {
            const { cliente, empresa } = req.body;
            const clienteData = {
                ...cliente,
                tipo: 'CLIENTE',
                roles: [],
                esUsuario: false,
                activo: true
            };
            if (cliente.password) {
                clienteData.password = await bcrypt_1.default.hash(cliente.password, 10);
            }
            const result = await persona_service_1.PersonaService.createClienteWithEmpresa(clienteData, empresa);
            res.status(201).json(result);
        }
        catch (error) {
            console.error('Error en PersonaController.createClienteWithEmpresa:', error);
            res.status(500).json({ error: 'Error al crear el cliente con empresa' });
        }
    }
}
exports.PersonaController = PersonaController;
//# sourceMappingURL=persona.controller.js.map