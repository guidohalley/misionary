export type EstadoPresupuesto = 'BORRADOR' | 'ENVIADO' | 'ACEPTADO' | 'RECHAZADO' | string

export interface FacturaDTO {
  id: number
  numero: string
  fecha: string
  subtotal: number
  impuestos: number
  total: number
  presupuesto?: {
    id: number
    cliente?: { id: number; nombre: string }
  }
}

export interface PresupuestoDTO {
  id: number
  estado: EstadoPresupuesto
  total: number
  cliente?: { id: number; nombre: string }
  moneda?: { id: number; codigo: string; simbolo: string }
  items?: Array<{ cantidad: number; precioUnitario: number }>
}

export interface GastoResumenCategoriaDTO {
  categoria: string
  _sum?: { monto?: number }
  _count?: { id?: number }
}

export interface GastoDTO {
  id: number
  monto: number
  moneda: { id: number; codigo: string; simbolo: string }
  categoria: string
  fecha: string
}

export interface PersonaDTO {
  id: number
  nombre: string
  email?: string
  activo: boolean
  tipo: string
}
