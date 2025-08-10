import { z } from 'zod';

// Enums locales que coinciden con el backend
export enum EstadoPresupuesto {
  BORRADOR = 'BORRADOR',
  ENVIADO = 'ENVIADO',
  APROBADO = 'APROBADO',
  FACTURADO = 'FACTURADO'
}

// Schema para Item individual
export const itemSchema = z.object({
  productoId: z.number().optional(),
  servicioId: z.number().optional(),
  cantidad: z.coerce.number()
    .min(1, 'La cantidad debe ser mayor a 0')
    .int('La cantidad debe ser un número entero'),
  precioUnitario: z.coerce.number()
    .nonnegative('El precio debe ser mayor o igual a 0'),
}).refine(
  (data) => data.productoId || data.servicioId,
  {
    message: "Debe seleccionar un producto o servicio",
    path: ["productoId"],
  }
);

// Schema de validación principal
export const presupuestoSchema = z.object({
  clienteId: z.number()
    .int('Debe seleccionar un cliente')
    .positive('Debe seleccionar un cliente válido'),
  
  items: z.array(itemSchema)
    .min(1, 'Debe agregar al menos un item'),
  
  impuestosSeleccionados: z.array(z.number()).default([]),
  
  monedaId: z.number()
    .int('Debe seleccionar una moneda')
    .positive('Debe seleccionar una moneda válida')
    .optional(),
  
  estado: z.nativeEnum(EstadoPresupuesto).optional(),
});

// Schema para creación
export const createPresupuestoSchema = presupuestoSchema;

// Schema para actualización
export const updatePresupuestoSchema = presupuestoSchema.partial();

export type CreatePresupuestoFormData = z.infer<typeof createPresupuestoSchema>;
export type UpdatePresupuestoFormData = z.infer<typeof updatePresupuestoSchema>;
export type ItemFormData = z.infer<typeof itemSchema>;

// Tipo genérico para formularios
export type PresupuestoFormData = CreatePresupuestoFormData;
