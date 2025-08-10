import prisma from '../config/prisma'
import { sendMail } from '../config/mailer'
import { buildReciboEmail } from '../templates/reciboEmail'

export async function crearRecibo(input: {
  personaId: number
  presupuestoId?: number
  concepto: string
  monto: number
  fecha: Date
  metodoPago: string
  emailNotificacion?: string
  monedaId?: number
}) {
  // validar persona y tipo PROVEEDOR
  const persona = await prisma.persona.findUnique({ where: { id: input.personaId } })
  if (!persona) {
    throw new Error('Persona no encontrada')
  }
  if (persona.tipo !== 'PROVEEDOR') {
    throw new Error('Solo se pueden registrar pagos a PROVEEDOR')
  }

  const recibo = await prisma.recibo.create({
    data: {
      personaId: input.personaId,
      concepto: input.concepto,
      monto: input.monto as any,
      fecha: input.fecha,
      metodoPago: input.metodoPago,
  presupuestoId: input.presupuestoId,
  monedaId: input.monedaId || 1,
    },
  })

  const toEmail = input.emailNotificacion || persona.email || ''
  if (toEmail) {
    try {
      // Datos adicionales para el template
      const presupuesto = input.presupuestoId
        ? await prisma.presupuesto.findUnique({
            where: { id: input.presupuestoId },
            include: { cliente: true },
          })
        : null

  // Emisor fijo: Misionary (configurable por APP_NAME)
  const emisorNombre = process.env.APP_NAME || 'Misionary'
      const emisorEmail = process.env.SMTP_FROM || process.env.MAIL_FROM || process.env.SMTP_USER

      // Receptor: proveedor
      const receptorNombre = persona.nombre
      const receptorEmail = persona.email || undefined

      // Moneda
      const moneda = await prisma.moneda.findUnique({ where: { id: input.monedaId || 1 } })
      const currency = moneda?.codigo || 'ARS'
      const montoFormateado = new Intl.NumberFormat('es-AR', { style: 'currency', currency }).format(Number(input.monto))
      const fechaFormateada = new Date(input.fecha).toLocaleString('es-AR', { dateStyle: 'medium', timeStyle: 'short' })

      const concepto = input.concepto || (presupuesto ? `Pago a proveedor - Presupuesto #${presupuesto.id}` : 'Pago a proveedor')

      const html = buildReciboEmail({
        emisorNombre,
        emisorEmail,
        receptorNombre,
        receptorEmail,
        montoFormateado,
        concepto,
        fechaFormateada,
        clienteNombre: presupuesto?.cliente?.nombre,
        clienteEmail: presupuesto?.cliente?.email ?? undefined,
      })

      const subject = presupuesto?.cliente?.nombre
        ? `Recibo de pago — Cliente: ${presupuesto.cliente.nombre}`
        : 'Recibo de pago'

      await sendMail({ to: toEmail, subject, html })
    } catch (err) {
      // loguear y no romper flujo
      console.error('Error enviando email de recibo:', err)
    }
  }

  return recibo
}

export async function listarRecibos(params: { personaId?: number; presupuestoId?: number }) {
  return prisma.recibo.findMany({
    where: {
  personaId: params.personaId,
  presupuestoId: params.presupuestoId,
    },
    orderBy: { fecha: 'desc' },
  })
}
