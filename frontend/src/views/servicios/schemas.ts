import { z } from 'zod';

// Schema de validación con Zod para servicios
export const servicioSchema = z.object({
  nombre: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  
  descripcion: z.string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'La descripción no puede exceder 500 caracteres'),
  
  precio: z.number()
    .min(0, 'El precio debe ser mayor o igual a 0')
    .positive('El precio debe ser positivo'),
  
  proveedorId: z.number()
    .int('Debe seleccionar un proveedor')
    .positive('Debe seleccionar un proveedor válido'),
    
  monedaId: z.number()
    .int('Debe seleccionar una moneda')
    .positive('Debe seleccionar una moneda válida')
    .default(1), // ARS por defecto
});

// Schema para creación
export const createServicioSchema = servicioSchema;

// Schema para actualización
export const updateServicioSchema = servicioSchema.partial();

export type CreateServicioFormData = z.infer<typeof createServicioSchema>;
export type UpdateServicioFormData = z.infer<typeof updateServicioSchema>;

// Tipo genérico para formularios que incluye monedaId
export type ServicioFormData = {
  nombre: string;
  descripcion: string;
  precio: number;
  proveedorId: number;
  monedaId: number;
};
