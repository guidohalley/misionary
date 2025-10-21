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
    items?: Array<{
      cantidad: number
      precioUnitario: number
      producto?: { id: number; proveedorId: number; costoProveedor: number }
      servicio?: { id: number; proveedorId: number; costoProveedor: number }
    }>
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
  concepto: string
  descripcion?: string
  monto: number
  monedaId: number
  fecha: string
  categoria: string
  esRecurrente: boolean
  frecuencia?: string
  activo: boolean
  createdAt: string
  updatedAt: string
  // Campos para proyecciones
  esProyeccion?: boolean
  gastoOrigenId?: number
  fechaOriginal?: string
  moneda?: {
    id: number
    codigo: string
    simbolo: string
    nombre: string
  }
  proveedor?: {
    id: number
    nombre: string
    email?: string
    telefono?: string
  }
}

export interface PersonaDTO {
  id: number
  nombre: string
  email?: string
  activo: boolean
  tipo: string
}

export interface EmpresaDTO {
  id: number
  nombre: string
  activo: boolean
}
