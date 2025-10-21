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

// Schema base para creación (todos requeridos salvo opcionales)
const createBase = z.object({
  clienteId: z.number()
    .int('Debe seleccionar un cliente')
    .positive('Debe seleccionar un cliente válido'),
  
  items: z.array(itemSchema)
    .min(1, 'Debe agregar al menos un item'),
  
  impuestosSeleccionados: z.array(z.number()).optional(),
  
  monedaId: z.number()
    .int('Debe seleccionar una moneda')
    .positive('Debe seleccionar una moneda válida')
    .optional(),
  // Fechas como string (YYYY-MM-DD o ISO). Se validan más abajo.
  periodoInicio: z.string().optional(),
  periodoFin: z.string().optional(),
  
  estado: z.nativeEnum(EstadoPresupuesto).optional(),
  
  // Campos de ganancia global
  usarGananciaGlobal: z.boolean().optional(),
  margenAgenciaGlobal: z.number()
    .min(0, 'El margen debe ser mayor o igual a 0')
    .max(100, 'El margen no puede exceder 100%')
    .optional(),
  montoGanancia: z.number()
    .min(0, 'El monto de ganancia debe ser mayor o igual a 0')
    .optional(),
});

// Efectos/refinements para create
const createPresupuestoSchemaInternal = createBase
  .refine((data) => {
    if (data.periodoInicio && data.periodoFin) {
      return new Date(data.periodoInicio) <= new Date(data.periodoFin);
    }
    return true;
  }, {
    message: 'La fecha desde debe ser anterior o igual a la fecha hasta',
    path: ['periodoFin']
  }).refine((data) => {
    // Si están presentes, deben ser fechas válidas
    const valid = (v?: string) => !v || !isNaN(new Date(v).getTime());
    return valid(data.periodoInicio) && valid(data.periodoFin);
  }, {
    message: 'Fecha inválida',
    path: ['periodoInicio']
  }).refine((data) => {
    // Validar que tenga vigencia mínima para proyecciones
    if (data.periodoInicio && data.periodoFin) {
      const inicio = new Date(data.periodoInicio);
      const fin = new Date(data.periodoFin);
      const diffTime = Math.abs(fin.getTime() - inicio.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Mínimo 7 días para proyecciones válidas
      return diffDays >= 7;
    }
    return true;
  }, {
    message: 'La vigencia debe ser de al menos 1 semana para permitir análisis y proyecciones',
    path: ['periodoFin']
  }).refine((data) => {
    // Advertir sobre vigencias muy largas sin revisión
    if (data.periodoInicio && data.periodoFin) {
      const inicio = new Date(data.periodoInicio);
      const fin = new Date(data.periodoFin);
      const diffTime = Math.abs(fin.getTime() - inicio.getTime());
      const diffMonths = diffTime / (1000 * 60 * 60 * 24 * 30);
      
      // Más de 2 años es demasiado sin revisión
      return diffMonths <= 24;
    }
    return true;
  }, {
    message: 'Vigencias superiores a 2 años requieren revisión periódica. Considera dividir en etapas.',
    path: ['periodoFin']
  });

// Schema de validación principal (create) para formularios
export const presupuestoSchema = createPresupuestoSchemaInternal;

// Schema para creación
export const createPresupuestoSchema = presupuestoSchema;

// Schema para actualización
const updateBase = createBase.partial();
export const updatePresupuestoSchema = updateBase
  .refine((data) => {
    if (data.periodoInicio && data.periodoFin) {
      return new Date(data.periodoInicio) <= new Date(data.periodoFin);
    }
    return true;
  }, {
    message: 'La fecha desde debe ser anterior o igual a la fecha hasta',
    path: ['periodoFin']
  }).refine((data) => {
    const valid = (v?: string) => !v || !isNaN(new Date(v).getTime());
    return valid(data.periodoInicio) && valid(data.periodoFin);
  }, {
    message: 'Fecha inválida',
    path: ['periodoInicio']
  });

export type CreatePresupuestoFormData = z.infer<typeof createPresupuestoSchema>;
export type UpdatePresupuestoFormData = z.infer<typeof updatePresupuestoSchema>;
export type ItemFormData = z.infer<typeof itemSchema>;

// Tipo genérico para formularios
export type PresupuestoFormData = CreatePresupuestoFormData;
