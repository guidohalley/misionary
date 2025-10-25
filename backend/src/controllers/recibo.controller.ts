import { Request, Response, RequestHandler } from 'express'
import { crearRecibo, listarRecibos } from '../services/recibo.service'
import { toNumber, isValidCurrencyValue } from '../utils/currency'

export const postRecibo: RequestHandler = async (req: Request, res: Response) => {
  const { personaId, concepto, monto, fecha, metodoPago, emailNotificacion, presupuestoId, monedaId } = req.body
  
  // Validar campos obligatorios
  if (!personaId || !concepto || !monto || !fecha || !metodoPago) {
    res.status(400).json({ success: false, message: 'Datos incompletos' })
    return
  }
  
  // Validar y convertir monto
  const montoNumber = toNumber(monto, NaN)
  if (!isValidCurrencyValue(montoNumber, false, false)) {
    res.status(400).json({ success: false, message: 'El monto debe ser un número positivo válido' })
    return
  }
  
  const recibo = await crearRecibo({
    personaId: Number(personaId),
    concepto,
    monto: montoNumber,
    fecha: new Date(fecha),
    metodoPago,
    emailNotificacion,
    presupuestoId: presupuestoId ? Number(presupuestoId) : undefined,
    monedaId: monedaId ? Number(monedaId) : undefined,
  })
  res.json({ success: true, data: recibo })
}

export const getRecibos: RequestHandler = async (req: Request, res: Response) => {
  const personaId = req.query.personaId ? Number(req.query.personaId) : undefined
  const presupuestoId = req.query.presupuestoId ? Number(req.query.presupuestoId) : undefined
  const recibos = await listarRecibos({ personaId, presupuestoId })
  res.json({ success: true, data: recibos })
}
