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

// Áreas predefinidas para proveedores
export const PROVIDER_AREAS = [
  'Desarrollador de Software',
  'Backend',
  'Frontend',
  'Tester',
  'Analista',
  'Paid Media',
  'Social Media',
  'Data Entry',
  'Productor Audiovisual',
  'Edición de Video',
  'Diseñador Gráfico',
] as const;

export const providerAreaOptions = PROVIDER_AREAS.map(area => ({
  value: area,
  label: area
}));

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

// 🏢 SCHEMA PARA EMPRESA
export const empresaSchema = z.object({
  nombre: z.string()
    .min(2, 'El nombre de la empresa debe tener al menos 2 caracteres')
    .max(100, 'El nombre de la empresa no puede exceder 100 caracteres'),
  
  razonSocial: z.string()
    .min(2, 'La razón social debe tener al menos 2 caracteres')
    .max(200, 'La razón social no puede exceder 200 caracteres')
    .optional()
    .or(z.literal('')),
  
  cuit: z.string()
    .regex(/^\d{2}-\d{8}-\d{1}$/, 'El CUIT debe tener el formato XX-XXXXXXXX-X')
    .optional()
    .or(z.literal('')),
  
  telefono: z.string()
    .min(10, 'El teléfono debe tener al menos 10 dígitos')
    .optional()
    .or(z.literal('')),
  
  email: z.string()
    .email('Email inválido')
    .optional()
    .or(z.literal('')),
  
  direccion: z.string()
    .max(500, 'La dirección no puede exceder 500 caracteres')
    .optional()
    .or(z.literal('')),
  
  activo: z.boolean().default(true),
});

// 🏢📋 SCHEMA PARA CLIENTE CON EMPRESA
export const clienteConEmpresaSchema = z.object({
  cliente: clienteSchema.omit({ tipo: true, roles: true, esUsuario: true, activo: true }).extend({
    tipo: z.literal(TipoPersona.CLIENTE),
    roles: z.array(z.nativeEnum(RolUsuario)).default([]),
    esUsuario: z.literal(false),
    activo: z.boolean().default(true),
  }),
  empresa: empresaSchema.optional(),
  crearEmpresa: z.boolean().default(false)
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
  
  providerArea: z.string()
    .optional()
    .or(z.literal('')),
  
  providerRoles: z.array(z.string())
    .optional()
    .default([]),
  
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

// Schema flexible para edición administrativa (permite cambio de tipo)
export const updatePersonaAdminSchema = z.object({
  nombre: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .optional(),
  
  email: z.string()
    .email('Email inválido')
    .optional(),
  
  password: z.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .optional()
    .or(z.literal('')),
  
  telefono: z.string()
    .min(10, 'El teléfono debe tener al menos 10 dígitos')
    .optional()
    .or(z.literal('')),
  
  providerArea: z.string()
    .optional()
    .or(z.literal('')),
  
  providerRoles: z.array(z.string())
    .optional()
    .default([]),
  
  cvu: z.string()
    .length(22, 'El CVU debe tener exactamente 22 dígitos')
    .optional()
    .or(z.literal('')),
  
  cuit: z.string()
    .regex(/^\d{2}-\d{8}-\d{1}$/, 'El CUIT debe tener el formato XX-XXXXXXXX-X')
    .optional()
    .or(z.literal('')),
  
  direccion: z.string()
    .max(500, 'La dirección no puede exceder 500 caracteres')
    .optional()
    .or(z.literal('')),
  
  // Campos flexibles para edición
  tipo: z.nativeEnum(TipoPersona).optional(),
  roles: z.array(z.nativeEnum(RolUsuario)).optional(),
  esUsuario: z.boolean().optional(),
  activo: z.boolean().optional(),
});

// ====================================
// TIPOS TYPESCRIPT
// ====================================

export type ClienteFormData = z.infer<typeof clienteSchema>;
export type ProveedorFormData = z.infer<typeof proveedorSchema>;
export type InternoFormData = z.infer<typeof internoSchema>;
export type EmpresaFormData = z.infer<typeof empresaSchema>;
export type ClienteConEmpresaFormData = z.infer<typeof clienteConEmpresaSchema>;

export type UpdateClienteFormData = z.infer<typeof updateClienteSchema>;
export type UpdateProveedorFormData = z.infer<typeof updateProveedorSchema>;
export type UpdateInternoFormData = z.infer<typeof updateInternoSchema>;
export type UpdatePersonaAdminFormData = z.infer<typeof updatePersonaAdminSchema>;

// ====================================
// SCHEMAS LEGACY (mantener compatibilidad)
// ====================================

// Schema genérico (mantener para compatibilidad)
export const personaSchema = z.union([clienteSchema, proveedorSchema, internoSchema]);
export const createPersonaSchema = personaSchema;
// Usar el schema flexible para actualización
export const updatePersonaSchema = updatePersonaAdminSchema;

export type CreatePersonaFormData = ClienteFormData | ProveedorFormData | InternoFormData;
export type UpdatePersonaFormData = UpdatePersonaAdminFormData;
