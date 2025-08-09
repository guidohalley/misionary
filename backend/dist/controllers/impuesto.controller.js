"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImpuestoController = void 0;
const impuesto_service_1 = require("../services/impuesto.service");
class ImpuestoController {
    static async create(req, res) {
        try {
            console.log('Creating impuesto with data:', JSON.stringify(req.body, null, 2));
            const impuesto = await impuesto_service_1.ImpuestoService.create(req.body);
            console.log('Impuesto created successfully:', impuesto.id);
            res.status(201).json(impuesto);
        }
        catch (error) {
            console.error('Error creating impuesto:', error);
            console.error('Error stack:', error instanceof Error ? error.stack : 'Unknown error');
            res.status(500).json({
                error: 'Error al crear el impuesto',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    static async findAll(req, res) {
        try {
            const impuestos = await impuesto_service_1.ImpuestoService.findAll();
            res.json(impuestos);
        }
        catch (error) {
            console.error('Error fetching impuestos:', error);
            res.status(500).json({ error: 'Error al obtener los impuestos' });
        }
    }
    static async findById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const impuesto = await impuesto_service_1.ImpuestoService.findById(id);
            if (!impuesto) {
                return res.status(404).json({ error: 'Impuesto no encontrado' });
            }
            res.json(impuesto);
        }
        catch (error) {
            console.error('Error fetching impuesto:', error);
            res.status(500).json({ error: 'Error al buscar el impuesto' });
        }
    }
    static async update(req, res) {
        try {
            const id = parseInt(req.params.id);
            const impuesto = await impuesto_service_1.ImpuestoService.update(id, req.body);
            res.json(impuesto);
        }
        catch (error) {
            console.error('Error updating impuesto:', error);
            res.status(500).json({ error: 'Error al actualizar el impuesto' });
        }
    }
    static async delete(req, res) {
        try {
            const id = parseInt(req.params.id);
            await impuesto_service_1.ImpuestoService.delete(id);
            res.status(204).send();
        }
        catch (error) {
            console.error('Error deleting impuesto:', error);
            res.status(500).json({ error: 'Error al eliminar el impuesto' });
        }
    }
    static async toggle(req, res) {
        try {
            const id = parseInt(req.params.id);
            const impuesto = await impuesto_service_1.ImpuestoService.toggle(id);
            res.json(impuesto);
        }
        catch (error) {
            console.error('Error toggling impuesto:', error);
            res.status(500).json({ error: 'Error al cambiar estado del impuesto' });
        }
    }
}
exports.ImpuestoController = ImpuestoController;
//# sourceMappingURL=impuesto.controller.js.map