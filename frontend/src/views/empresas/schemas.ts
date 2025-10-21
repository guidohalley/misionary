import { z } from 'zod';

// Schema para crear empresa
export const createEmpresaSchema = z.object({
  nombre: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  
  razonSocial: z
    .string()
    .max(200, 'La razón social no puede exceder 200 caracteres')
    .optional()
    .or(z.literal('')),
  
  cuit: z
    .string()
    .max(20, 'El CUIT no puede exceder 20 caracteres')
    .optional()
    .or(z.literal('')),
  
  telefono: z
    .string()
    .max(20, 'El teléfono no puede exceder 20 caracteres')
    .optional()
    .or(z.literal('')),
  
  email: z
    .string()
    .email('Debe ser un email válido')
    .optional()
    .or(z.literal('')),
  
  direccion: z
    .string()
    .max(300, 'La dirección no puede exceder 300 caracteres')
    .optional()
    .or(z.literal('')),
  
  clienteId: z
    .number()
    .int('El ID del cliente debe ser un número entero')
    .min(1, 'Debe seleccionar un cliente válido'),

  activo: z.boolean(),
});

// Schema para actualizar empresa
export const updateEmpresaSchema = z.object({
  nombre: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  
  razonSocial: z
    .string()
    .max(200, 'La razón social no puede exceder 200 caracteres')
    .optional()
    .or(z.literal('')),
  
  cuit: z
    .string()
    .max(20, 'El CUIT no puede exceder 20 caracteres')
    .optional()
    .or(z.literal(''))
    .refine((val) => {
      if (!val || val.trim() === '') return true;
      // Permitir CUIT con o sin guiones
      const cuitRegex = /^\d{2}-?\d{8}-?\d{1}$/;
      return cuitRegex.test(val);
    }, 'El CUIT debe tener el formato XX-XXXXXXXX-X'),
  
  telefono: z
    .string()
    .max(20, 'El teléfono no puede exceder 20 caracteres')
    .optional()
    .or(z.literal('')),
  
  email: z
    .string()
    .email('Debe ser un email válido')
    .optional()
    .or(z.literal('')),
   direccion: z
    .string()
    .max(300, 'La dirección no puede exceder 300 caracteres')
    .optional()
    .or(z.literal('')),
  
  clienteId: z
    .number()
    .int('El ID del cliente debe ser un número entero')
    .min(1, 'Debe seleccionar un cliente válido'),

  activo: z.boolean(),
});

// Tipos derivados de los schemas
export type CreateEmpresaFormData = z.infer<typeof createEmpresaSchema>;
export type UpdateEmpresaFormData = z.infer<typeof updateEmpresaSchema>;
