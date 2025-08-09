"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicioController = void 0;
const servicio_service_1 = require("../services/servicio.service");
class ServicioController {
    static async create(req, res) {
        try {
            const servicio = await servicio_service_1.ServicioService.create(req.body);
            res.status(201).json(servicio);
        }
        catch (error) {
            console.error('Error en ServicioController.create:', error);
            res.status(500).json({ error: 'Error al crear el servicio' });
        }
    }
    static async findById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const servicio = await servicio_service_1.ServicioService.findById(id);
            if (!servicio) {
                return res.status(404).json({ error: 'Servicio no encontrado' });
            }
            res.json(servicio);
        }
        catch (error) {
            console.error('Error en ServicioController.findById:', error);
            res.status(500).json({ error: 'Error al buscar el servicio' });
        }
    }
    static async update(req, res) {
        try {
            const id = parseInt(req.params.id);
            const servicio = await servicio_service_1.ServicioService.update(id, req.body);
            res.json(servicio);
        }
        catch (error) {
            console.error('Error en ServicioController.update:', error);
            res.status(500).json({ error: 'Error al actualizar el servicio' });
        }
    }
    static async delete(req, res) {
        try {
            const id = parseInt(req.params.id);
            await servicio_service_1.ServicioService.delete(id);
            res.status(204).send();
        }
        catch (error) {
            console.error('Error en ServicioController.delete:', error);
            res.status(500).json({ error: 'Error al eliminar el servicio' });
        }
    }
    static async findAll(req, res) {
        try {
            const { proveedorId } = req.query;
            const servicios = await servicio_service_1.ServicioService.findAll(proveedorId ? parseInt(proveedorId) : undefined);
            res.json(servicios);
        }
        catch (error) {
            console.error('Error en ServicioController.findAll:', error);
            res.status(500).json({ error: 'Error al obtener los servicios' });
        }
    }
}
exports.ServicioController = ServicioController;
//# sourceMappingURL=servicio.controller.js.map