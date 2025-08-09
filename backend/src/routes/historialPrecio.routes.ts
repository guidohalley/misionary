import { Router } from 'express';
import { HistorialPrecioController, validarIdNumerico, validarMonedaId, validarActualizacionPrecio, validarActualizacionMasiva, validarFechas } from '../controllers/historialPrecio.controller';
import { asyncHandler } from '../utils/asyncHandler';
import { auth } from '../middleware/auth';
import { checkRole } from '../middleware/checkRole';

const router = Router();

/**
 * GET /api/historial-precios/producto/:id
 * Obtener historial de precios para un producto
 */
router.get(
  '/producto/:id',
  auth,
  validarIdNumerico,
  asyncHandler(HistorialPrecioController.getHistorialProducto)
);

/**
 * GET /api/historial-precios/servicio/:id
 * Obtener historial de precios para un servicio
 */
router.get(
  '/servicio/:id',
  auth,
  validarIdNumerico,
  asyncHandler(HistorialPrecioController.getHistorialServicio)
);

/**
 * GET /api/historial-precios/producto/:id/actual/:monedaId
 * Obtener precio actual vigente de un producto en una moneda específica
 */
router.get(
  '/producto/:id/actual/:monedaId',
  auth,
  validarIdNumerico,
  validarMonedaId,
  asyncHandler(HistorialPrecioController.getPrecioActualProducto)
);

/**
 * GET /api/historial-precios/servicio/:id/actual/:monedaId
 * Obtener precio actual vigente de un servicio en una moneda específica
 */
router.get(
  '/servicio/:id/actual/:monedaId',
  auth,
  validarIdNumerico,
  validarMonedaId,
  asyncHandler(HistorialPrecioController.getPrecioActualServicio)
);

/**
 * PUT /api/historial-precios/producto/:id
 * Actualizar precio de un producto (requiere permisos ADMIN/CONTADOR)
 */
router.put(
  '/producto/:id',
  auth,
  checkRole(['ADMIN', 'CONTADOR']),
  validarIdNumerico,
  validarActualizacionPrecio,
  asyncHandler(HistorialPrecioController.actualizarPrecioProducto)
);

/**
 * PUT /api/historial-precios/servicio/:id
 * Actualizar precio de un servicio (requiere permisos ADMIN/CONTADOR)
 */
router.put(
  '/servicio/:id',
  auth,
  checkRole(['ADMIN', 'CONTADOR']),
  validarIdNumerico,
  validarActualizacionPrecio,
  asyncHandler(HistorialPrecioController.actualizarPrecioServicio)
);

/**
 * POST /api/historial-precios/actualizacion-masiva
 * Actualización masiva de precios por inflación/devaluación (requiere permisos ADMIN)
 */
router.post(
  '/actualizacion-masiva',
  auth,
  checkRole(['ADMIN']),
  validarActualizacionMasiva,
  asyncHandler(HistorialPrecioController.actualizacionMasiva)
);

/**
 * GET /api/historial-precios/desactualizados
 * Obtener items con precios desactualizados
 */
router.get(
  '/desactualizados',
  auth,
  checkRole(['ADMIN', 'CONTADOR']),
  asyncHandler(HistorialPrecioController.getPreciosDesactualizados)
);

/**
 * GET /api/historial-precios/estadisticas
 * Obtener estadísticas de cambios de precios
 */
router.get(
  '/estadisticas',
  auth,
  checkRole(['ADMIN', 'CONTADOR']),
  validarFechas,
  asyncHandler(HistorialPrecioController.getEstadisticasCambios)
);

export default router;
