import { Request, Response, RequestHandler } from 'express'
import { crearPagoAdmin, listarPagosAdmin, resumenPresupuesto, resumenProveedores, kpisMensuales, cobrosPeriodo, crearCobroCliente, listarCobrosCliente } from '../services/finanzas.service'
import type { AuthRequest } from '../middleware/auth'

export const getResumenPresupuesto: RequestHandler = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const data = await resumenPresupuesto(id)
  res.json({ success: true, data })
}

export const postPagoAdmin: RequestHandler = async (req: Request, res: Response) => {
  const { adminId, presupuestoId, monto, fecha, metodoPago, concepto, monedaId } = req.body
  const pago = await crearPagoAdmin({
    adminId: Number(adminId),
    presupuestoId: Number(presupuestoId),
    monto: Number(monto),
    fecha: new Date(fecha),
    metodoPago,
    concepto,
    monedaId: monedaId ? Number(monedaId) : undefined,
  })
  res.json({ success: true, data: pago })
}

export const getPagosAdmin: RequestHandler = async (req: Request, res: Response) => {
  const presupuestoId = req.query.presupuestoId ? Number(req.query.presupuestoId) : undefined
  const data = await listarPagosAdmin({ presupuestoId })
  res.json({ success: true, data })
}

export const getResumenProveedores: RequestHandler = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const data = await resumenProveedores(id)
  res.json({ success: true, data })
}

export const getKpisMensuales: RequestHandler = async (req: Request, res: Response) => {
  const ahora = new Date()
  const desdeStr = (req.query.desde as string) || new Date(ahora.getFullYear(), ahora.getMonth(), 1).toISOString()
  const hastaStr = (req.query.hasta as string) || new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0, 23, 59, 59).toISOString()
  const desde = new Date(desdeStr)
  const hasta = new Date(hastaStr)
  const adminId = (req as AuthRequest).user?.id as number | undefined
  const data = await kpisMensuales({ desde, hasta, adminId })
  res.json({ success: true, data })
}

export const getCobrosPeriodo: RequestHandler = async (req: Request, res: Response) => {
  const ahora = new Date()
  const desdeStr = (req.query.desde as string) || new Date(ahora.getFullYear(), ahora.getMonth(), 1).toISOString()
  const hastaStr = (req.query.hasta as string) || new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0, 23, 59, 59).toISOString()
  const desde = new Date(desdeStr)
  const hasta = new Date(hastaStr)
  const data = await cobrosPeriodo({ desde, hasta })
  res.json({ success: true, data })
}

export const postCobroCliente: RequestHandler = async (req: Request, res: Response) => {
  const { presupuestoId, monto, monedaId, fecha, metodoPago, concepto } = req.body
  const cobro = await crearCobroCliente({
    presupuestoId: Number(presupuestoId),
    monto: Number(monto),
    monedaId: monedaId ? Number(monedaId) : undefined,
    fecha: new Date(fecha),
    metodoPago,
    concepto,
  })
  res.json({ success: true, data: cobro })
}

export const getCobrosCliente: RequestHandler = async (req: Request, res: Response) => {
  const presupuestoId = req.query.presupuestoId ? Number(req.query.presupuestoId) : undefined
  const desde = req.query.desde ? new Date(String(req.query.desde)) : undefined
  const hasta = req.query.hasta ? new Date(String(req.query.hasta)) : undefined
  const data = await listarCobrosCliente({ presupuestoId, desde, hasta })
  res.json({ success: true, data })
}
