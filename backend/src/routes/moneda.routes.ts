import { Router } from 'express';
import { 
  MonedaController,
  validarCodigoMoneda,
  validarTipoCambioParams,
  validarConversionBody,
  validarTipoCambioBody,
  validarActualizacionMasiva,
  validarHistorialQuery
} from '../controllers/moneda.controller';
import { auth } from '../middleware/auth';
import { checkRole } from '../middleware/checkRole';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// ─────────────────── RUTAS PÚBLICAS (solo lectura) ─────────────────── 

/**
 * GET /api/monedas
 * Obtener todas las monedas activas
 */
router.get('/', asyncHandler(MonedaController.getAllMonedas));

/**
 * GET /api/monedas/:codigo
 * Obtener una moneda por código
 */
router.get('/:codigo', validarCodigoMoneda, asyncHandler(MonedaController.getMonedaByCodigo));

/**
 * GET /api/monedas/tipo-cambio/:monedaDesde/:monedaHacia
 * Obtener tipo de cambio actual entre dos monedas
 */
router.get(
  '/tipo-cambio/:monedaDesde/:monedaHacia',
  validarTipoCambioParams,
  asyncHandler(MonedaController.getTipoCambioActual)
);

/**
 * GET /api/monedas/historial/:monedaDesde/:monedaHacia
 * Obtener historial de tipos de cambio
 */
router.get(
  '/historial/:monedaDesde/:monedaHacia',
  validarHistorialQuery,
  asyncHandler(MonedaController.getHistorialTipoCambio)
);

// ─────────────────── RUTAS PROTEGIDAS (requieren autenticación) ─────────────────── 

/**
 * POST /api/monedas/convertir
 * Convertir un monto entre monedas
 */
router.post(
  '/convertir',
  auth,
  validarConversionBody,
  asyncHandler(MonedaController.convertirMoneda)
);

// ─────────────────── RUTAS ADMINISTRATIVAS (solo ADMIN/CONTADOR) ─────────────────── 

/**
 * POST /api/monedas/tipo-cambio
 * Crear o actualizar tipo de cambio
 */
router.post(
  '/tipo-cambio',
  auth,
  checkRole(['ADMIN', 'CONTADOR']),
  validarTipoCambioBody,
  asyncHandler(MonedaController.upsertTipoCambio)
);

/**
 * POST /api/monedas/actualizar-masivo
 * Actualizar tipos de cambio masivamente
 */
router.post(
  '/actualizar-masivo',
  auth,
  checkRole(['ADMIN', 'CONTADOR']),
  validarActualizacionMasiva,
  asyncHandler(MonedaController.actualizarTiposCambioMasivo)
);

export default router;
