"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresupuestoController = void 0;
const presupuesto_service_1 = require("../services/presupuesto.service");
const client_1 = require("@prisma/client");
class PresupuestoController {
    static async create(req, res) {
        try {
            const presupuesto = await presupuesto_service_1.PresupuestoService.create(req.body);
            res.status(201).json(presupuesto);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al crear el presupuesto' });
        }
    }
    static async findById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const presupuesto = await presupuesto_service_1.PresupuestoService.findById(id);
            if (!presupuesto) {
                return res.status(404).json({ error: 'Presupuesto no encontrado' });
            }
            res.json(presupuesto);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al buscar el presupuesto' });
        }
    }
    static async update(req, res) {
        try {
            const id = parseInt(req.params.id);
            const presupuesto = await presupuesto_service_1.PresupuestoService.update(id, req.body);
            res.json(presupuesto);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al actualizar el presupuesto' });
        }
    }
    static async updateEstado(req, res) {
        try {
            const id = parseInt(req.params.id);
            const { estado } = req.body;
            if (!Object.values(client_1.EstadoPresupuesto).includes(estado)) {
                return res.status(400).json({ error: 'Estado inválido' });
            }
            const presupuesto = await presupuesto_service_1.PresupuestoService.updateEstado(id, estado);
            res.json(presupuesto);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al actualizar el estado del presupuesto' });
        }
    }
    static async delete(req, res) {
        try {
            const id = parseInt(req.params.id);
            await presupuesto_service_1.PresupuestoService.delete(id);
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: 'Error al eliminar el presupuesto' });
        }
    }
    static async findAll(req, res) {
        try {
            const { clienteId, estado } = req.query;
            const presupuestos = await presupuesto_service_1.PresupuestoService.findAll(clienteId ? parseInt(clienteId) : undefined, estado);
            res.json(presupuestos);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al obtener los presupuestos' });
        }
    }
}
exports.PresupuestoController = PresupuestoController;
//# sourceMappingURL=presupuesto.controller.js.map