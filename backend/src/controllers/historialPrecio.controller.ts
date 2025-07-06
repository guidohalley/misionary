import { Request, Response } from 'express';
import { HistorialPrecioService } from '../services/historialPrecio.service';
import { body, param, query, validationResult } from 'express-validator';

export class HistorialPrecioController {
  /**
   * Obtener historial de precios para un producto
   * GET /api/historial-precios/producto/:id
   */
  static async getHistorialProducto(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const productoId = parseInt(req.params.id);
      const { monedaId, limit } = req.query;

      const historial = await HistorialPrecioService.getHistorialProducto(
        productoId,
        monedaId ? parseInt(monedaId as string) : undefined,
        limit ? parseInt(limit as string) : undefined
      );

      res.json({
        success: true,
        data: historial,
        message: 'Historial de precios obtenido exitosamente'
      });
    } catch (error) {
      console.error('Error al obtener historial de precios del producto:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * Obtener historial de precios para un servicio
   * GET /api/historial-precios/servicio/:id
   */
  static async getHistorialServicio(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const servicioId = parseInt(req.params.id);
      const { monedaId, limit } = req.query;

      const historial = await HistorialPrecioService.getHistorialServicio(
        servicioId,
        monedaId ? parseInt(monedaId as string) : undefined,
        limit ? parseInt(limit as string) : undefined
      );

      res.json({
        success: true,
        data: historial,
        message: 'Historial de precios obtenido exitosamente'
      });
    } catch (error) {
      console.error('Error al obtener historial de precios del servicio:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * Obtener precio actual de un producto
   * GET /api/historial-precios/producto/:id/actual/:monedaId
   */
  static async getPrecioActualProducto(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const productoId = parseInt(req.params.id);
      const monedaId = parseInt(req.params.monedaId);

      const precioActual = await HistorialPrecioService.getPrecioActualProducto(
        productoId,
        monedaId
      );

      if (!precioActual) {
        return res.status(404).json({
          success: false,
          message: 'No se encontró precio actual para el producto en la moneda especificada'
        });
      }

      res.json({
        success: true,
        data: precioActual,
        message: 'Precio actual obtenido exitosamente'
      });
    } catch (error) {
      console.error('Error al obtener precio actual del producto:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * Obtener precio actual de un servicio
   * GET /api/historial-precios/servicio/:id/actual/:monedaId
   */
  static async getPrecioActualServicio(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const servicioId = parseInt(req.params.id);
      const monedaId = parseInt(req.params.monedaId);

      const precioActual = await HistorialPrecioService.getPrecioActualServicio(
        servicioId,
        monedaId
      );

      if (!precioActual) {
        return res.status(404).json({
          success: false,
          message: 'No se encontró precio actual para el servicio en la moneda especificada'
        });
      }

      res.json({
        success: true,
        data: precioActual,
        message: 'Precio actual obtenido exitosamente'
      });
    } catch (error) {
      console.error('Error al obtener precio actual del servicio:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * Actualizar precio de un producto
   * PUT /api/historial-precios/producto/:id
   */
  static async actualizarPrecioProducto(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const productoId = parseInt(req.params.id);
      const { monedaId, precio, motivoCambio } = req.body;
      const usuarioId = (req as any).user.id; // Del middleware de autenticación

      const nuevoHistorial = await HistorialPrecioService.actualizarPrecioProducto(
        productoId,
        monedaId,
        precio,
        motivoCambio,
        usuarioId
      );

      res.json({
        success: true,
        data: nuevoHistorial,
        message: 'Precio del producto actualizado exitosamente'
      });
    } catch (error) {
      console.error('Error al actualizar precio del producto:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * Actualizar precio de un servicio
   * PUT /api/historial-precios/servicio/:id
   */
  static async actualizarPrecioServicio(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const servicioId = parseInt(req.params.id);
      const { monedaId, precio, motivoCambio } = req.body;
      const usuarioId = (req as any).user.id; // Del middleware de autenticación

      const nuevoHistorial = await HistorialPrecioService.actualizarPrecioServicio(
        servicioId,
        monedaId,
        precio,
        motivoCambio,
        usuarioId
      );

      res.json({
        success: true,
        data: nuevoHistorial,
        message: 'Precio del servicio actualizado exitosamente'
      });
    } catch (error) {
      console.error('Error al actualizar precio del servicio:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * Actualización masiva de precios por porcentaje
   * POST /api/historial-precios/actualizacion-masiva
   */
  static async actualizacionMasiva(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const { tipo, monedaId, porcentajeAumento, motivoCambio, filtros } = req.body;
      const usuarioId = (req as any).user.id; // Del middleware de autenticación

      const resultado = await HistorialPrecioService.actualizacionMasivaPorcentaje(
        tipo,
        monedaId,
        porcentajeAumento,
        motivoCambio,
        usuarioId,
        filtros
      );

      res.json({
        success: true,
        data: resultado,
        message: `Actualización masiva completada. ${resultado.actualizados} items actualizados.`
      });
    } catch (error) {
      console.error('Error en actualización masiva:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * Obtener precios desactualizados
   * GET /api/historial-precios/desactualizados
   */
  static async getPreciosDesactualizados(req: Request, res: Response) {
    try {
      const { diasLimite, monedaId } = req.query;

      const preciosDesactualizados = await HistorialPrecioService.obtenerPreciosDesactualizados(
        diasLimite ? parseInt(diasLimite as string) : 30,
        monedaId ? parseInt(monedaId as string) : undefined
      );

      res.json({
        success: true,
        data: preciosDesactualizados,
        message: 'Precios desactualizados obtenidos exitosamente'
      });
    } catch (error) {
      console.error('Error al obtener precios desactualizados:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * Obtener estadísticas de cambios de precios
   * GET /api/historial-precios/estadisticas
   */
  static async getEstadisticasCambios(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const { fechaDesde, fechaHasta, monedaId } = req.query;

      const estadisticas = await HistorialPrecioService.obtenerEstadisticasCambios(
        new Date(fechaDesde as string),
        new Date(fechaHasta as string),
        monedaId ? parseInt(monedaId as string) : undefined
      );

      res.json({
        success: true,
        data: estadisticas,
        message: 'Estadísticas de cambios obtenidas exitosamente'
      });
    } catch (error) {
      console.error('Error al obtener estadísticas de cambios:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}

// Validaciones para los endpoints
export const validarIdNumerico = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID debe ser un número entero positivo')
];

export const validarMonedaId = [
  param('monedaId')
    .isInt({ min: 1 })
    .withMessage('El ID de moneda debe ser un número entero positivo')
];

export const validarActualizacionPrecio = [
  body('monedaId')
    .isInt({ min: 1 })
    .withMessage('El ID de moneda es requerido y debe ser un número entero positivo'),
  body('precio')
    .isFloat({ min: 0.01 })
    .withMessage('El precio debe ser un número positivo'),
  body('motivoCambio')
    .isString()
    .isLength({ min: 3, max: 255 })
    .withMessage('El motivo del cambio es requerido (3-255 caracteres)')
];

export const validarActualizacionMasiva = [
  body('tipo')
    .isIn(['PRODUCTO', 'SERVICIO'])
    .withMessage('El tipo debe ser PRODUCTO o SERVICIO'),
  body('monedaId')
    .isInt({ min: 1 })
    .withMessage('El ID de moneda es requerido y debe ser un número entero positivo'),
  body('porcentajeAumento')
    .isFloat({ min: -100, max: 1000 })
    .withMessage('El porcentaje de aumento debe estar entre -100% y 1000%'),
  body('motivoCambio')
    .isString()
    .isLength({ min: 3, max: 255 })
    .withMessage('El motivo del cambio es requerido (3-255 caracteres)')
];

export const validarFechas = [
  query('fechaDesde')
    .isISO8601()
    .withMessage('La fecha desde debe ser una fecha válida (ISO 8601)'),
  query('fechaHasta')
    .isISO8601()
    .withMessage('La fecha hasta debe ser una fecha válida (ISO 8601)')
];
