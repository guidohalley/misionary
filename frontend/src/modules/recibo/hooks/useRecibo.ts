import { useCallback, useEffect, useState } from 'react'
import { crearRecibo, listarRecibos } from '@/services/reciboService'
import * as gastoService from '@/modules/gasto/service'
import type { Moneda, Persona } from '@/modules/gasto/types'
import type { Presupuesto as PresupuestoFull } from '@/modules/presupuesto/types'

export type Recibo = {
  id: number
  personaId: number
  concepto: string
  monto: number
  fecha: string
  metodoPago: string
  presupuestoId?: number
  monedaId?: number
}

export type CreateReciboDTO = Omit<Recibo, 'id'>

export function useRecibo() {
  const [recibos, setRecibos] = useState<Recibo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRecibos = useCallback(async (personaId?: number, presupuestoId?: number) => {
    try {
      setLoading(true)
      setError(null)
      const data = await listarRecibos(personaId, presupuestoId)
      setRecibos(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error fetching recibos:', err)
      setError('Error al cargar los recibos')
    } finally {
      setLoading(false)
    }
  }, [])

  const createRecibo = async (data: CreateReciboDTO) => {
    try {
      setLoading(true)
      setError(null)
  const nuevo = await crearRecibo(data) as unknown as Recibo
  setRecibos((prev: Recibo[]) => [...prev, nuevo])
      return nuevo
    } catch (err) {
      setError('Error al crear el recibo')
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
  fetchRecibos()
  }, [fetchRecibos])

  return {
    recibos,
    loading,
    error,
    fetchRecibos,
    createRecibo,
    clearError: () => setError(null)
  }
}

export function useReciboAuxiliarData() {
  const [monedas, setMonedas] = useState<Moneda[]>([])
  const [proveedores, setProveedores] = useState<Persona[]>([])
  const [presupuestos, setPresupuestos] = useState<PresupuestoFull[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMonedas = useCallback(async () => {
    try {
      setLoading(true)
      const data = await gastoService.fetchMonedas()
      setMonedas(Array.isArray(data) ? data : [])
    } catch (err) {
      setError('Error al cargar las monedas')
      setMonedas([])
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchProveedores = useCallback(async () => {
    try {
      setLoading(true)
      const data = await gastoService.fetchProveedores()
      setProveedores(Array.isArray(data) ? data : [])
    } catch (err) {
      setError('Error al cargar los proveedores')
      setProveedores([])
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchPresupuestos = useCallback(async () => {
    try {
      setLoading(true)
  const data = await gastoService.fetchPresupuestosActivos()
  setPresupuestos(Array.isArray(data) ? (data as PresupuestoFull[]) : [])
    } catch (err) {
      setError('Error al cargar los presupuestos')
      setPresupuestos([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMonedas()
    fetchProveedores()
    fetchPresupuestos()
  }, [fetchMonedas, fetchProveedores, fetchPresupuestos])

  return {
    monedas,
    proveedores,
    presupuestos,
    loading,
    error,
    refetch: { monedas: fetchMonedas, proveedores: fetchProveedores, presupuestos: fetchPresupuestos }
  }
}
