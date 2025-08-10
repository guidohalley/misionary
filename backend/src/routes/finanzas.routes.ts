import { Router } from 'express'
import { auth } from '../middleware/auth'
import { checkRole } from '../middleware/checkRole'
import { getResumenPresupuesto, getPagosAdmin, postPagoAdmin, getResumenProveedores, getKpisMensuales, getCobrosPeriodo, postCobroCliente, getCobrosCliente } from '../controllers/finanzas.controller'

const router = Router()

router.use(auth)
router.get('/presupuestos/:id/resumen', getResumenPresupuesto)
router.get('/presupuestos/:id/proveedores', getResumenProveedores)
router.get('/pagos-admin', getPagosAdmin)
router.post('/pagos-admin', checkRole(['ADMIN']), postPagoAdmin)
router.get('/kpis-mensuales', getKpisMensuales)
router.get('/cobros', getCobrosPeriodo)
router.get('/cobros-cliente', getCobrosCliente)
router.post('/cobros-cliente', postCobroCliente)

export default router
