import ApiService from './ApiService'

export async function crearRecibo(input: {
  personaId: number
  concepto: string
  monto: number
  fecha: string
  metodoPago: string
  presupuestoId?: number
  emailNotificacion?: string
  monedaId?: number
}) {
  const res = await ApiService.fetchData({
    url: '/recibos',
    method: 'post',
    data: input,
  })
  return res.data
}

export async function listarRecibos(personaId?: number, presupuestoId?: number) {
  const params: Record<string, any> = {}
  if (personaId) params.personaId = personaId
  if (presupuestoId) params.presupuestoId = presupuestoId

  const res = await ApiService.fetchData<{ success: boolean; data: any[] }>({
    url: '/recibos',
    method: 'get',
    params: Object.keys(params).length ? params : undefined,
  })
  // La API devuelve { success, data }
  return res.data.data
}
