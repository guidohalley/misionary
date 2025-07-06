import { Router } from 'express';
import { HistorialPrecioController, validarIdNumerico, validarMonedaId, validarActualizacionPrecio, validarActualizacionMasiva, validarFechas } from '../controllers/historialPrecio.controller';
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
  HistorialPrecioController.getHistorialProducto
);

/**
 * GET /api/historial-precios/servicio/:id
 * Obtener historial de precios para un servicio
 */
router.get(
  '/servicio/:id',
  auth,
  validarIdNumerico,
  HistorialPrecioController.getHistorialServicio
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
  HistorialPrecioController.getPrecioActualProducto
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
  HistorialPrecioController.getPrecioActualServicio
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
  HistorialPrecioController.actualizarPrecioProducto
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
  HistorialPrecioController.actualizarPrecioServicio
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
  HistorialPrecioController.actualizacionMasiva
);

/**
 * GET /api/historial-precios/desactualizados
 * Obtener items con precios desactualizados
 */
router.get(
  '/desactualizados',
  auth,
  checkRole(['ADMIN', 'CONTADOR']),
  HistorialPrecioController.getPreciosDesactualizados
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
  HistorialPrecioController.getEstadisticasCambios
);

export default router;
