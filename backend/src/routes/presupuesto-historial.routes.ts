import { Router } from 'express';
import PresupuestoHistorialController from '../controllers/presupuesto-historial.controller';
import { auth } from '../middleware/auth';
import { checkRole } from '../middleware/checkRole';
import { RolUsuario } from '@prisma/client';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

/**
 * @route GET /api/presupuesto-historial/:presupuestoId
 * @desc Obtener historial completo de un presupuesto
 * @access Private
 */
router.get('/:presupuestoId', 
  [auth], 
  asyncHandler(PresupuestoHistorialController.obtenerHistorial)
);

/**
 * @route GET /api/presupuesto-historial/:presupuestoId/snapshot
 * @desc Crear snapshot del estado actual de un presupuesto
 * @access Private
 */
router.get('/:presupuestoId/snapshot', 
  [auth], 
  asyncHandler(PresupuestoHistorialController.crearSnapshot)
);

/**
 * @route GET /api/presupuesto-historial/analisis/cambios-precios
 * @desc Análisis de cambios de precios para KPIs
 * @query fechaDesde, fechaHasta, clienteId, estadoPresupuesto
 * @access Private (requiere ADMIN o CONTADOR)
 */
router.get('/analisis/cambios-precios', 
  [auth, checkRole([RolUsuario.ADMIN, RolUsuario.CONTADOR])], 
  asyncHandler(PresupuestoHistorialController.analizarCambiosPrecios)
);

/**
 * @route GET /api/presupuesto-historial/analisis/proyecciones
 * @desc Generar proyecciones empresariales
 * @query años (default: 5)
 * @access Private (requiere ADMIN)
 */
router.get('/analisis/proyecciones', 
  [auth, checkRole([RolUsuario.ADMIN])], 
  asyncHandler(PresupuestoHistorialController.generarProyecciones)
);

/**
 * @route GET /api/presupuesto-historial/dashboard/kpis
 * @desc Dashboard completo de KPIs empresariales
 * @query período (meses, default: 12)
 * @access Private (requiere ADMIN)
 */
router.get('/dashboard/kpis', 
  [auth, checkRole([RolUsuario.ADMIN])], 
  asyncHandler(PresupuestoHistorialController.dashboardKPIs)
);

export default router;
