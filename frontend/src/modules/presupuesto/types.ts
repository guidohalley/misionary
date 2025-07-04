import { Persona } from '../persona/types';
import { Producto } from '../producto/types';
import { Servicio } from '../servicio/types';
import { EstadoPresupuesto } from '../../views/presupuestos/schemas';

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

export interface Presupuesto {
  id: number;
  clienteId: number;
  cliente: Persona;
  items: Item[];
  subtotal: number;
  impuestos: number;
  total: number;
  estado: EstadoPresupuesto;
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
}

export interface UpdatePresupuestoDTO {
  clienteId?: number;
  items?: CreateItemDTO[];
  subtotal?: number;
  impuestos?: number;
  total?: number;
  estado?: EstadoPresupuesto;
}

export const estadoPresupuestoOptions = [
  { value: 'BORRADOR', label: 'Borrador' },
  { value: 'ENVIADO', label: 'Enviado' },
  { value: 'APROBADO', label: 'Aprobado' },
  { value: 'FACTURADO', label: 'Facturado' }
];
