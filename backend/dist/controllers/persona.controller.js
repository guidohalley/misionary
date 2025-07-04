"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonaController = void 0;
const persona_service_1 = require("../services/persona.service");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class PersonaController {
    static async create(req, res) {
        try {
            const { password, ...rest } = req.body;
            const hashedPassword = await bcryptjs_1.default.hash(password, 10);
            const persona = await persona_service_1.PersonaService.create({
                ...rest,
                password: hashedPassword
            });
            res.status(201).json(persona);
        }
        catch (error) {
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
            res.json(persona);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al buscar la persona' });
        }
    }
    static async update(req, res) {
        try {
            const id = parseInt(req.params.id);
            const { password, ...rest } = req.body;
            let updateData = rest;
            if (password) {
                const hashedPassword = await bcryptjs_1.default.hash(password, 10);
                updateData.password = hashedPassword;
            }
            const persona = await persona_service_1.PersonaService.update(id, updateData);
            res.json(persona);
        }
        catch (error) {
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
}
exports.PersonaController = PersonaController;
//# sourceMappingURL=persona.controller.js.map