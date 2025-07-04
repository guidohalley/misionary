import { TipoPersona, RolUsuario } from '../../views/personas/schemas';

export interface Persona {
  id: number;
  nombre: string;
  tipo: TipoPersona;
  telefono?: string;
  cvu?: string;
  roles: RolUsuario[];
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePersonaDTO {
  nombre: string;
  tipo: TipoPersona;
  telefono?: string;
  cvu?: string;
  roles: RolUsuario[];
  password: string;
  email: string;
}

export interface UpdatePersonaDTO {
  nombre?: string;
  tipo?: TipoPersona;
  telefono?: string;
  cvu?: string;
  roles?: RolUsuario[];
  email?: string;
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
