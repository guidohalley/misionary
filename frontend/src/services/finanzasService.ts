import ApiService from './ApiService'

export type ResumenPresupuesto = {
  presupuestoId: number
  moneda: string
  totalPrecio: number
  totalGananciaEmpresa: number
  totalPagadoProveedor: number
  totalPagadoAdmin: number
  disponibleAdmin: number
}

export async function getResumenPresupuesto(id: number) {
  const res = await ApiService.fetchData<{ success: boolean; data: ResumenPresupuesto }>({
    url: `/finanzas/presupuestos/${id}/resumen`,
    method: 'get',
  })
  // La API devuelve { success, data }
  return res.data.data
}

export async function crearPagoAdmin(input: {
  adminId: number
  presupuestoId: number
  monto: number
  fecha: string
  metodoPago: string
  concepto?: string
  monedaId?: number
}) {
  const res = await ApiService.fetchData<{ success: boolean; data: any }>({
    url: '/finanzas/pagos-admin',
    method: 'post',
    data: input,
  })
  // API devuelve { success, data }
  return res.data.data
}

export async function listarPagosAdmin(presupuestoId?: number) {
  const res = await ApiService.fetchData<{ success: boolean; data: any[] }>({
    url: '/finanzas/pagos-admin',
    method: 'get',
    params: presupuestoId ? { presupuestoId } : undefined,
  })
  // API devuelve { success, data }
  return res.data.data
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

export async function getResumenProveedores(presupuestoId: number) {
  const res = await ApiService.fetchData<{ success: boolean; data: ResumenProveedor[]}>({
    url: `/finanzas/presupuestos/${presupuestoId}/proveedores`,
    method: 'get',
  })
  return res.data.data
}
