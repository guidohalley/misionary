import { TipoPersona, RolUsuario } from '../../views/personas/schemas';

export interface Persona {
  id: number;
  nombre: string;
  tipo: TipoPersona;
  telefono?: string;
  cvu?: string;
  roles: RolUsuario[];
  email: string;
  password?: string;  // Opcional - solo para usuarios del sistema
  activo: boolean;
  esUsuario: boolean;  // Define si puede acceder al sistema
  createdAt: string;
  updatedAt: string;
}

export interface CreatePersonaDTO {
  nombre: string;
  tipo: TipoPersona;
  telefono?: string;
  cvu?: string;
  roles: RolUsuario[];
  password?: string;  // Opcional según el tipo
  email: string;
  activo?: boolean;
  esUsuario?: boolean;  // Se determina automáticamente
}

export interface UpdatePersonaDTO {
  nombre?: string;
  tipo?: TipoPersona;
  telefono?: string;
  cvu?: string;
  roles?: RolUsuario[];
  email?: string;
  password?: string;
  activo?: boolean;
  esUsuario?: boolean;
}

export const tipoPersonaOptions = [
  { value: TipoPersona.CLIENTE, label: 'Cliente' },
  { value: TipoPersona.PROVEEDOR, label: 'Proveedor' },
  { value: TipoPersona.INTERNO, label: 'Interno' }
];

export const rolUsuarioOptions = [
  { value: RolUsuario.ADMIN, label: 'Administrador' },
  { value: RolUsuario.CONTADOR, label: 'Contador' },
  { value: RolUsuario.PROVEEDOR, label: 'Proveedor' }
];
