import { Persona } from '../persona/types';
import { Producto } from '../producto/types';
import { Servicio } from '../servicio/types';
import { Moneda } from '../moneda/types';
import { Impuesto } from '../impuesto/types';
import { EstadoPresupuesto } from '../../views/presupuestos/schemas';
import type { Empresa } from '../empresa/types'

export interface Item {
  id: number;
  presupuestoId: number;
  productoId?: number;
  producto?: Producto;
  servicioId?: number;
  servicio?: Servicio;
  cantidad: number;
  precioUnitario: number;
}

export interface PresupuestoImpuesto {
  id: number;
  presupuestoId: number;
  impuestoId: number;
  impuesto: Impuesto;
  monto: number;
  createdAt: string;
  updatedAt: string;
}

export interface Presupuesto {
  id: number;
  clienteId: number;
  cliente: Persona;
  empresaId?: number;
  empresa?: Empresa | null;
  items: Item[];
  subtotal: number;
  impuestos: number;
  total: number;
  estado: EstadoPresupuesto;
  monedaId: number;
  moneda: Moneda;
  presupuestoImpuestos: PresupuestoImpuesto[];
  tipoCambioFecha?: string;
  periodoInicio?: string;
  periodoFin?: string;
  // Campos de ganancia global
  usarGananciaGlobal?: boolean;
  margenAgenciaGlobal?: number;
  montoGanancia?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateItemDTO {
  productoId?: number;
  servicioId?: number;
  cantidad: number;
  precioUnitario: number;
}

export interface CreatePresupuestoDTO {
  clienteId: number;
  items: CreateItemDTO[];
  subtotal: number;
  impuestos: number;
  total: number;
  impuestosSeleccionados?: number[];
  monedaId?: number;
  periodoInicio?: string; // ISO o YYYY-MM-DD
  periodoFin?: string;    // ISO o YYYY-MM-DD
  // Campos de ganancia global
  usarGananciaGlobal?: boolean;
  margenAgenciaGlobal?: number;
  montoGanancia?: number;
}

export interface UpdatePresupuestoDTO {
  clienteId?: number;
  items?: CreateItemDTO[];
  subtotal?: number;
  impuestos?: number;
  total?: number;
  estado?: EstadoPresupuesto;
  impuestosSeleccionados?: number[];
  monedaId?: number;
  periodoInicio?: string;
  periodoFin?: string;
  // Campos de ganancia global
  usarGananciaGlobal?: boolean;
  margenAgenciaGlobal?: number;
  montoGanancia?: number;
}

export const estadoPresupuestoOptions = [
  { value: 'BORRADOR', label: 'Borrador' },
  { value: 'ENVIADO', label: 'Enviado' },
  { value: 'APROBADO', label: 'Aprobado' },
  { value: 'FACTURADO', label: 'Facturado' }
];
