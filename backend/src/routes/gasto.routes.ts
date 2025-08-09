import { Router } from 'express';
import { gastoController } from '../controllers/gasto.controller';
import { auth } from '../middleware/auth';
import { checkRole } from '../middleware/checkRole';
import { RolUsuario } from '@prisma/client';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// ─────────────────── GASTOS OPERATIVOS ─────────────────── 

// GET /api/gastos - Obtener todos los gastos operativos con filtros
router.get('/', 
  [auth], 
  asyncHandler(gastoController.getGastosOperativos)
);

// GET /api/gastos/categorias - Obtener categorías disponibles
router.get('/categorias', 
  [auth], 
  asyncHandler(gastoController.getCategoriasGasto)
);

// GET /api/gastos/resumen - Resumen de gastos por categoría
router.get('/resumen', 
  [auth], 
  asyncHandler(gastoController.getResumenGastosPorCategoria)
);

// GET /api/gastos/:id - Obtener gasto operativo por ID
router.get('/:id', 
  [auth], 
  asyncHandler(gastoController.getGastoOperativoById)
);

// POST /api/gastos - Crear nuevo gasto operativo (solo ADMIN y CONTADOR)
router.post('/', 
  [auth, checkRole([RolUsuario.ADMIN, RolUsuario.CONTADOR])], 
  asyncHandler(gastoController.createGastoOperativo)
);

// PUT /api/gastos/:id - Actualizar gasto operativo (solo ADMIN y CONTADOR)
router.put('/:id', 
  [auth, checkRole([RolUsuario.ADMIN, RolUsuario.CONTADOR])], 
  asyncHandler(gastoController.updateGastoOperativo)
);

// DELETE /api/gastos/:id - Eliminar gasto operativo (solo ADMIN)
router.delete('/:id', 
  [auth, checkRole([RolUsuario.ADMIN])], 
  asyncHandler(gastoController.deleteGastoOperativo)
);

// ─────────────────── ASIGNACIONES A PROYECTOS ─────────────────── 

// GET /api/gastos/:gastoId/asignaciones - Obtener asignaciones de un gasto específico
router.get('/:gastoId/asignaciones', 
  [auth], 
  asyncHandler(gastoController.getAsignacionesPorGasto)
);

// POST /api/gastos/asignaciones - Crear nueva asignación (solo ADMIN y CONTADOR)
router.post('/asignaciones', 
  [auth, checkRole([RolUsuario.ADMIN, RolUsuario.CONTADOR])], 
  asyncHandler(gastoController.createAsignacion)
);

// PUT /api/gastos/asignaciones/:id - Actualizar asignación (solo ADMIN y CONTADOR)
router.put('/asignaciones/:id', 
  [auth, checkRole([RolUsuario.ADMIN, RolUsuario.CONTADOR])], 
  asyncHandler(gastoController.updateAsignacion)
);

// DELETE /api/gastos/asignaciones/:id - Eliminar asignación (solo ADMIN)
router.delete('/asignaciones/:id', 
  [auth, checkRole([RolUsuario.ADMIN])], 
  asyncHandler(gastoController.deleteAsignacion)
);

// ─────────────────── REPORTES Y ANÁLISIS ─────────────────── 

// GET /api/gastos/proyecto/:presupuestoId/asignaciones - Obtener asignaciones de un proyecto
router.get('/proyecto/:presupuestoId/asignaciones', 
  [auth], 
  asyncHandler(gastoController.getAsignacionesPorProyecto)
);

// GET /api/gastos/proyecto/:presupuestoId/costos - Obtener costos operativos de un proyecto
router.get('/proyecto/:presupuestoId/costos', 
  [auth], 
  asyncHandler(gastoController.getCostosOperativosPorProyecto)
);

export { router as gastoRoutes };
