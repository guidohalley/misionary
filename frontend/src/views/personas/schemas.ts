import { z } from 'zod';

// Enums locales que coinciden con el backend
export enum TipoPersona {
  CLIENTE = 'CLIENTE',
  PROVEEDOR = 'PROVEEDOR',
  INTERNO = 'INTERNO'
}

export enum RolUsuario {
  ADMIN = 'ADMIN',
  CONTADOR = 'CONTADOR',
  PROVEEDOR = 'PROVEEDOR'
}

// ====================================
// SCHEMAS ESPECÍFICOS POR TIPO
// ====================================

// 📋 SCHEMA PARA CLIENTES (solo datos básicos)
export const clienteSchema = z.object({
  nombre: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  
  email: z.string()
    .email('Email inválido')
    .min(1, 'El email es requerido'),
  
  telefono: z.string()
    .min(10, 'El teléfono debe tener al menos 10 dígitos')
    .optional()
    .or(z.literal('')),
  
  cvu: z.string()
    .length(22, 'El CVU debe tener exactamente 22 dígitos')
    .optional()
    .or(z.literal('')),
  
  // Campos fijos para clientes
  tipo: z.literal(TipoPersona.CLIENTE),
  roles: z.array(z.nativeEnum(RolUsuario)).default([]),
  esUsuario: z.literal(false),
  activo: z.boolean().default(true),
});

// 🏢 SCHEMA PARA PROVEEDORES (datos + acceso al sistema)
export const proveedorSchema = z.object({
  nombre: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  
  email: z.string()
    .email('Email inválido')
    .min(1, 'El email es requerido'),
  
  password: z.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  
  telefono: z.string()
    .min(10, 'El teléfono debe tener al menos 10 dígitos')
    .optional()
    .or(z.literal('')),
  
  cvu: z.string()
    .length(22, 'El CVU debe tener exactamente 22 dígitos')
    .optional()
    .or(z.literal('')),
  
  // Campos fijos para proveedores
  tipo: z.literal(TipoPersona.PROVEEDOR),
  roles: z.array(z.literal(RolUsuario.PROVEEDOR)).default([RolUsuario.PROVEEDOR]),
  esUsuario: z.literal(true),
  activo: z.boolean().default(true),
});

// 👥 SCHEMA PARA INTERNOS (datos + contraseña + roles administrativos)
export const internoSchema = z.object({
  nombre: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  
  email: z.string()
    .email('Email inválido')
    .min(1, 'El email es requerido'),
  
  password: z.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  
  telefono: z.string()
    .min(10, 'El teléfono debe tener al menos 10 dígitos')
    .optional()
    .or(z.literal('')),
  
  cvu: z.string()
    .length(22, 'El CVU debe tener exactamente 22 dígitos')
    .optional()
    .or(z.literal('')),
  
  roles: z.array(z.enum([RolUsuario.ADMIN, RolUsuario.CONTADOR]))
    .min(1, 'Debe seleccionar al menos un rol administrativo'),
  
  // Campos fijos para internos
  tipo: z.literal(TipoPersona.INTERNO),
  esUsuario: z.literal(true),
  activo: z.boolean().default(true),
});

// ====================================
// SCHEMAS DE ACTUALIZACIÓN
// ====================================

export const updateClienteSchema = clienteSchema.partial();
export const updateProveedorSchema = proveedorSchema.partial().extend({
  password: z.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .optional()
    .or(z.literal(''))
});
export const updateInternoSchema = internoSchema.partial().extend({
  password: z.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .optional()
    .or(z.literal(''))
});

// ====================================
// TIPOS TYPESCRIPT
// ====================================

export type ClienteFormData = z.infer<typeof clienteSchema>;
export type ProveedorFormData = z.infer<typeof proveedorSchema>;
export type InternoFormData = z.infer<typeof internoSchema>;

export type UpdateClienteFormData = z.infer<typeof updateClienteSchema>;
export type UpdateProveedorFormData = z.infer<typeof updateProveedorSchema>;
export type UpdateInternoFormData = z.infer<typeof updateInternoSchema>;

// ====================================
// SCHEMAS LEGACY (mantener compatibilidad)
// ====================================

// Schema genérico (mantener para compatibilidad)
export const personaSchema = z.union([clienteSchema, proveedorSchema, internoSchema]);
export const createPersonaSchema = personaSchema;
export const updatePersonaSchema = z.union([updateClienteSchema, updateProveedorSchema, updateInternoSchema]);

export type CreatePersonaFormData = ClienteFormData | ProveedorFormData | InternoFormData;
export type UpdatePersonaFormData = UpdateClienteFormData | UpdateProveedorFormData | UpdateInternoFormData;
