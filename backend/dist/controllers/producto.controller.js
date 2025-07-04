"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductoController = void 0;
const producto_service_1 = require("../services/producto.service");
class ProductoController {
    static async create(req, res) {
        try {
            const producto = await producto_service_1.ProductoService.create(req.body);
            res.status(201).json(producto);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al crear el producto' });
        }
    }
    static async findById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const producto = await producto_service_1.ProductoService.findById(id);
            if (!producto) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            res.json(producto);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al buscar el producto' });
        }
    }
    static async update(req, res) {
        try {
            const id = parseInt(req.params.id);
            const producto = await producto_service_1.ProductoService.update(id, req.body);
            res.json(producto);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al actualizar el producto' });
        }
    }
    static async delete(req, res) {
        try {
            const id = parseInt(req.params.id);
            await producto_service_1.ProductoService.delete(id);
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: 'Error al eliminar el producto' });
        }
    }
    static async findAll(req, res) {
        try {
            const { proveedorId } = req.query;
            const productos = await producto_service_1.ProductoService.findAll(proveedorId ? parseInt(proveedorId) : undefined);
            res.json(productos);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al obtener los productos' });
        }
    }
}
exports.ProductoController = ProductoController;
//# sourceMappingURL=producto.controller.js.map