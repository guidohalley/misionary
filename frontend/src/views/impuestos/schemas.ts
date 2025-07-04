import { z } from 'zod';

export const impuestoSchema = z.object({
  nombre: z.string()
    .min(1, 'El nombre es obligatorio')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  porcentaje: z.number()
    .min(0, 'El porcentaje debe ser mayor o igual a 0')
    .max(100, 'El porcentaje no puede ser mayor a 100')
    .refine(val => Number.isFinite(val), 'El porcentaje debe ser un número válido'),
  descripcion: z.string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional(),
  activo: z.boolean()
    .optional()
    .default(true),
});

export type ImpuestoFormData = z.infer<typeof impuestoSchema>;
