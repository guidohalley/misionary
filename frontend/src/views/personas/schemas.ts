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

// Schema de validación con Zod
export const personaSchema = z.object({
  nombre: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  
  email: z.string()
    .email('Email inválido')
    .min(1, 'El email es requerido'),
  
  password: z.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .optional(),
  
  telefono: z.string()
    .min(10, 'El teléfono debe tener al menos 10 dígitos')
    .optional()
    .or(z.literal('')),
  
  cvu: z.string()
    .length(22, 'El CVU debe tener exactamente 22 dígitos')
    .optional()
    .or(z.literal('')),
  
  tipo: z.nativeEnum(TipoPersona, {
    required_error: 'El tipo de persona es requerido'
  }),
  
  roles: z.array(z.nativeEnum(RolUsuario))
    .min(1, 'Debe seleccionar al menos un rol')
});

// Schema para creación (incluye password obligatorio)
export const createPersonaSchema = personaSchema.extend({
  password: z.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
});

// Schema para actualización (password opcional)
export const updatePersonaSchema = personaSchema.partial().extend({
  password: z.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .optional()
});

export type CreatePersonaFormData = z.infer<typeof createPersonaSchema>;
export type UpdatePersonaFormData = z.infer<typeof updatePersonaSchema>;
