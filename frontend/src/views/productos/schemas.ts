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
  
  costoProveedor: z.number()
    .positive('El costo del proveedor debe ser positivo'),
  
  margenAgencia: z.number()
    .min(0, 'El margen de agencia debe ser mayor o igual a 0')
    .max(1000, 'El margen de agencia no puede exceder 1000%'),
  
  precio: z.number()
    .positive('El precio debe ser positivo'), // Requerido, se calcula automáticamente
  
  proveedorId: z.number()
    .int('Debe seleccionar un proveedor')
    .positive('Debe seleccionar un proveedor válido'),
    
  monedaId: z.number()
    .int('Debe seleccionar una moneda')
    .positive('Debe seleccionar una moneda válida')
    .default(1) // ARS por defecto
    .optional(),
});

// Schema para creación
export const createProductoSchema = productoSchema;

// Schema para actualización
export const updateProductoSchema = productoSchema.partial();

export type CreateProductoFormData = z.infer<typeof createProductoSchema>;
export type UpdateProductoFormData = z.infer<typeof updateProductoSchema>;

// Tipo genérico para formularios que incluye todos los campos
export type ProductoFormData = {
  nombre: string;
  costoProveedor: number;
  margenAgencia: number;
  precio: number; // Requerido, se calcula automáticamente
  proveedorId: number;
  monedaId?: number; // Opcional, ARS por defecto
};
