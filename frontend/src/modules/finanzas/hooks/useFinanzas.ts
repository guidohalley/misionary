import { useCallback, useState } from 'react'
import { crearPagoAdmin, getResumenPresupuesto, listarPagosAdmin, type ResumenPresupuesto } from '@/services/finanzasService'

export type PagoAdmin = {
  id: number
  adminId: number
  presupuestoId: number
  monto: number
  fecha: string
  metodoPago: string
  concepto?: string
  monedaId?: number
}

export type CreatePagoAdminDTO = Omit<PagoAdmin, 'id'>

export function useFinanzas() {
  const [resumen, setResumen] = useState<ResumenPresupuesto | null>(null)
  const [pagosAdmin, setPagosAdmin] = useState<PagoAdmin[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchResumen = useCallback(async (presupuestoId: number) => {
    try {
      setLoading(true)
      setError(null)
      const data = await getResumenPresupuesto(presupuestoId)
      setResumen(data)
      return data
    } catch (err) {
      setError('Error al cargar el resumen de finanzas')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchPagosAdmin = useCallback(async (presupuestoId?: number) => {
    try {
      setLoading(true)
      setError(null)
      const data = await listarPagosAdmin(presupuestoId)
      setPagosAdmin(Array.isArray(data) ? data : [])
    } catch (err) {
      setError('Error al cargar los pagos a ADMIN')
    } finally {
      setLoading(false)
    }
  }, [])

  const createPagoAdmin = async (payload: CreatePagoAdminDTO) => {
    try {
      setLoading(true)
      setError(null)
      const creado = await crearPagoAdmin(payload)
      setPagosAdmin(prev => [...prev, creado as PagoAdmin])
      return creado
    } catch (err) {
      setError('Error al registrar el pago a ADMIN')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    resumen,
    pagosAdmin,
    loading,
    error,
    fetchResumen,
    fetchPagosAdmin,
    createPagoAdmin,
    clearError: () => setError(null)
  }
}
