import prisma from '../config/prisma'

function toNumber(d: any): number {
  if (d === null || d === undefined) return 0
  return typeof d === 'number' ? d : Number(d)
}

export async function resumenPresupuesto(presupuestoId: number) {
  const presupuesto = await prisma.presupuesto.findUnique({
    where: { id: presupuestoId },
    include: {
      items: {
        include: {
          producto: true,
          servicio: true,
        },
      },
      moneda: true,
    },
  })
  if (!presupuesto) throw new Error('Presupuesto no encontrado')

  const totalPrecio = presupuesto.items.reduce((acc: number, it: any) => acc + toNumber(it.precioUnitario) * it.cantidad, 0)
  const totalGananciaEmpresa = presupuesto.items.reduce((acc: number, it: any) => {
    const pct = it.producto ? toNumber(it.producto.margenAgencia) : it.servicio ? toNumber(it.servicio.margenAgencia) : 0
    const gain = toNumber(it.precioUnitario) * (pct / 100) * it.cantidad
    return acc + gain
  }, 0)

  const pagosProveedor = await prisma.recibo.aggregate({
    _sum: { monto: true },
    where: { presupuestoId },
  })
  const totalPagadoProveedor = toNumber(pagosProveedor._sum.monto)

  const pagosAdmin = await prisma.pagoAdmin.aggregate({
    _sum: { monto: true },
    where: { presupuestoId },
  })
  const totalPagadoAdmin = toNumber(pagosAdmin._sum.monto)

  const disponibleAdmin = Math.max(0, totalGananciaEmpresa - totalPagadoAdmin)

  return {
    presupuestoId,
    moneda: presupuesto.moneda.codigo,
    totalPrecio,
    totalGananciaEmpresa,
    totalPagadoProveedor,
    totalPagadoAdmin,
    disponibleAdmin,
  }
}

export async function crearPagoAdmin(input: {
  adminId: number
  presupuestoId: number
  monto: number
  fecha: Date
  metodoPago: string
  concepto?: string
  monedaId?: number
}) {
  const admin = await prisma.persona.findUnique({ where: { id: input.adminId } })
  if (!admin) throw new Error('Admin no encontrado')
  if (!admin.roles.includes('ADMIN' as any)) throw new Error('El receptor no es ADMIN')

  const resumen = await resumenPresupuesto(input.presupuestoId)
  if (input.monto > resumen.disponibleAdmin) throw new Error('Monto excede la ganancia disponible')

  const pago = await prisma.pagoAdmin.create({
    data: {
      adminId: input.adminId,
      presupuestoId: input.presupuestoId,
      monto: input.monto as any,
      monedaId: input.monedaId || 1,
      fecha: input.fecha,
      metodoPago: input.metodoPago,
      concepto: input.concepto,
    },
  })
  return pago
}

export async function listarPagosAdmin(params: { presupuestoId?: number }) {
  return prisma.pagoAdmin.findMany({
    where: { presupuestoId: params.presupuestoId },
    include: { admin: true, moneda: true },
    orderBy: { fecha: 'desc' },
  })
}

export type ResumenProveedor = {
  proveedorId: number
  proveedorNombre: string
  proveedorEmail?: string | null
  moneda: string
  totalCostoProveedor: number
  totalPagadoProveedor: number
  pendienteProveedor: number
}

export async function resumenProveedores(presupuestoId: number): Promise<ResumenProveedor[]> {
  const presupuesto = await prisma.presupuesto.findUnique({
    where: { id: presupuestoId },
    include: {
      items: {
        include: { producto: true, servicio: true },
      },
      moneda: true,
    },
  })
  if (!presupuesto) throw new Error('Presupuesto no encontrado')

  // Agrupar costo proveedor por personaId
  const map = new Map<number, { total: number; nombre: string; email?: string | null }>()
  for (const it of presupuesto.items as any[]) {
    const cantidad = Number(it?.cantidad || 1)
    if (it?.producto?.proveedorId) {
      const pid = Number(it.producto.proveedorId)
      const parte = Number(it.producto.costoProveedor || 0) * cantidad
      const prev = map.get(pid) || { total: 0, nombre: it.producto.proveedor?.nombre || `Prov ${pid}`, email: it.producto.proveedor?.email }
      prev.total += parte
      prev.nombre = it.producto.proveedor?.nombre || prev.nombre
      prev.email = (it.producto.proveedor as any)?.email ?? prev.email
      map.set(pid, prev)
    }
    if (it?.servicio?.proveedorId) {
      const pid = Number(it.servicio.proveedorId)
      const parte = Number(it.servicio.costoProveedor || 0) * cantidad
      const prev = map.get(pid) || { total: 0, nombre: it.servicio.proveedor?.nombre || `Prov ${pid}`, email: it.servicio.proveedor?.email }
      prev.total += parte
      prev.nombre = it.servicio.proveedor?.nombre || prev.nombre
      prev.email = (it.servicio.proveedor as any)?.email ?? prev.email
      map.set(pid, prev)
    }
  }

  const proveedorIds = Array.from(map.keys())
  if (proveedorIds.length === 0) return []

  // Traer datos de proveedores (nombre/email)
  const personas = await prisma.persona.findMany({ where: { id: { in: proveedorIds } } })
  for (const per of personas) {
    const prev = map.get(per.id)
    if (prev) {
      prev.nombre = per.nombre
      prev.email = per.email
      map.set(per.id, prev)
    }
  }

  // Sumas pagadas por proveedor en este presupuesto
  const pagos = await prisma.recibo.groupBy({
    by: ['personaId'],
    _sum: { monto: true },
    where: { presupuestoId, personaId: { in: proveedorIds } },
  })
  const pagosMap = new Map<number, number>()
  for (const p of pagos) pagosMap.set(p.personaId as number, toNumber((p as any)._sum?.monto))

  const moneda = presupuesto.moneda.codigo
  const out: ResumenProveedor[] = proveedorIds.map((pid) => {
    const info = map.get(pid)!
    const total = Number(info.total)
    const pagado = Number(pagosMap.get(pid) || 0)
    return {
      proveedorId: pid,
      proveedorNombre: info.nombre,
      proveedorEmail: info.email ?? null,
      moneda,
      totalCostoProveedor: total,
      totalPagadoProveedor: pagado,
      pendienteProveedor: Math.max(0, total - pagado),
    }
  })
  return out
}

export async function kpisMensuales(params: { desde: Date; hasta: Date; adminId?: number }) {
  const { desde, hasta, adminId } = params

  // Presupuestos del período (usamos createdAt como referencia temporal)
  const presupuestos = await prisma.presupuesto.findMany({
    where: { createdAt: { gte: desde, lte: hasta } },
    include: {
      items: { include: { producto: true, servicio: true } },
      moneda: true,
    },
  })

  let totalGananciaEmpresaPeriodo = 0
  const gananciaPorMoneda: Record<string, number> = {}
  for (const p of presupuestos as any[]) {
    let g = 0
    for (const it of p.items || []) {
      const pct = it.producto ? toNumber(it.producto.margenAgencia) : it.servicio ? toNumber(it.servicio.margenAgencia) : 0
      g += toNumber(it.precioUnitario) * (pct / 100) * Number(it.cantidad || 1)
    }
    totalGananciaEmpresaPeriodo += g
    const code = p.moneda?.codigo || 'TOTAL'
    gananciaPorMoneda[code] = (gananciaPorMoneda[code] || 0) + g
  }

  // Pagos a admin del período
  const pagosTotal = await prisma.pagoAdmin.aggregate({
    _sum: { monto: true },
    where: { fecha: { gte: desde, lte: hasta } },
  })
  const totalPagadoAdminPeriodo = toNumber(pagosTotal._sum.monto)

  // Pagos al admin logueado (si se pasa adminId)
  let totalPagadoAdminUsuario = 0
  if (adminId) {
    const pagosUsuario = await prisma.pagoAdmin.aggregate({
      _sum: { monto: true },
      where: { fecha: { gte: desde, lte: hasta }, adminId },
    })
    totalPagadoAdminUsuario = toNumber(pagosUsuario._sum.monto)
  }

  const disponibleAdminPeriodo = Math.max(0, totalGananciaEmpresaPeriodo - totalPagadoAdminPeriodo)

  return {
    desde,
    hasta,
    totalGananciaEmpresaPeriodo,
    totalPagadoAdminPeriodo,
    totalPagadoAdminUsuario,
    disponibleAdminPeriodo,
    gananciaPorMoneda,
    cantidadPresupuestosPeriodo: presupuestos.length,
  }
}

export async function cobrosPeriodo(params: { desde: Date; hasta: Date }) {
  const { desde, hasta } = params

  // Facturado en el período (todas las facturas emitidas)
  const facturadoAgg = await prisma.factura.aggregate({
    _sum: { total: true },
    where: { fecha: { gte: desde, lte: hasta } },
  })
  const totalFacturado = toNumber(facturadoAgg._sum.total)

  // Cobrado: facturas con estado PAGADA en el período
  const cobradoAgg = await prisma.factura.aggregate({
    _sum: { total: true },
    where: { fecha: { gte: desde, lte: hasta }, estado: 'PAGADA' as any },
  })
  const totalCobrado = toNumber(cobradoAgg._sum.total)

  // Por cobrar: facturas EMITIDA (no pagadas) del período
  const porCobrarAgg = await prisma.factura.aggregate({
    _sum: { total: true },
    where: { fecha: { gte: desde, lte: hasta }, estado: 'EMITIDA' as any },
  })
  const totalPorCobrar = toNumber(porCobrarAgg._sum.total)

  // Cantidades para referencia
  const cntEm = await prisma.factura.count({ where: { fecha: { gte: desde, lte: hasta }, estado: 'EMITIDA' as any } })
  const cntPg = await prisma.factura.count({ where: { fecha: { gte: desde, lte: hasta }, estado: 'PAGADA' as any } })

  // Cobros directos del cliente (sin factura) registrados en el período
  const cobrosDirectosAgg = await prisma.cobroCliente.aggregate({
    _sum: { monto: true },
    where: { fecha: { gte: desde, lte: hasta } },
  })
  const totalCobradoDirecto = toNumber(cobrosDirectosAgg._sum.monto)

  return {
    desde,
    hasta,
    totalFacturado,
    totalCobrado,
    totalCobradoDirecto,
    totalPorCobrar,
    cantidadEmitidas: cntEm,
    cantidadPagadas: cntPg,
  }
}

export async function crearCobroCliente(input: {
  presupuestoId: number
  monto: number
  monedaId?: number
  fecha: Date
  metodoPago: string
  concepto?: string
}) {
  // Validaciones básicas
  const presupuesto = await prisma.presupuesto.findUnique({ where: { id: input.presupuestoId } })
  if (!presupuesto) throw new Error('Presupuesto no encontrado')
  const cobro = await prisma.cobroCliente.create({
    data: {
      presupuestoId: input.presupuestoId,
      monto: input.monto as any,
      monedaId: input.monedaId || presupuesto.monedaId || 1,
      fecha: input.fecha,
      metodoPago: input.metodoPago,
      concepto: input.concepto,
    },
  })
  return cobro
}

export async function listarCobrosCliente(params: { presupuestoId?: number; desde?: Date; hasta?: Date }) {
  const { presupuestoId, desde, hasta } = params
  return prisma.cobroCliente.findMany({
    where: {
      presupuestoId,
      fecha: desde && hasta ? { gte: desde, lte: hasta } : undefined,
    },
    include: { moneda: true, presupuesto: { include: { cliente: true, empresa: true, moneda: true } } },
    orderBy: { fecha: 'desc' },
  })
}
