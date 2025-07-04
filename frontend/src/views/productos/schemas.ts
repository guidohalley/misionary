import { z } from 'zod';

// Enums locales que coinciden con el backend
// Para productos no hay enums específicos en el schema, pero podríamos agregar algunos útiles
export enum EstadoProducto {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
  DESCONTINUADO = 'DESCONTINUADO'
}

// Schema de validación con Zod
export const productoSchema = z.object({
  nombre: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  
  precio: z.number()
    .min(0, 'El precio debe ser mayor o igual a 0')
    .positive('El precio debe ser positivo'),
  
  proveedorId: z.number()
    .int('Debe seleccionar un proveedor')
    .positive('Debe seleccionar un proveedor válido'),
});

// Schema para creación
export const createProductoSchema = productoSchema;

// Schema para actualización
export const updateProductoSchema = productoSchema.partial();

export type CreateProductoFormData = z.infer<typeof createProductoSchema>;
export type UpdateProductoFormData = z.infer<typeof updateProductoSchema>;

// Tipo genérico para formularios
export type ProductoFormData = CreateProductoFormData;
