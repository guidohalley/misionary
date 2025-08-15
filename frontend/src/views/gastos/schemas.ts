import { z } from 'zod';

export enum CodigoMoneda {
  ARS = 'ARS',
  USD = 'USD',
  EUR = 'EUR'
}

// ====================================
// SCHEMA PARA GASTOS OPERATIVOS
// ====================================

export const gastoOperativoSchema = z.object({
  concepto: z.string()
    .min(3, 'El concepto debe tener al menos 3 caracteres')
    .max(200, 'El concepto no puede exceder 200 caracteres'),
  
  descripcion: z.string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional()
    .or(z.literal('')),
  
  monto: z.number()
    .positive('El monto debe ser positivo')
    .min(0.01, 'El monto mínimo es 0.01'),
  
  monedaId: z.number()
    .int('La moneda es requerida')
    .positive('Seleccione una moneda válida'),
  
  fecha: z.date({
    required_error: 'La fecha es requerida'
  }),
  
  categoriaId: z.number().int('Debe seleccionar una categoría').positive('Debe seleccionar una categoría'),
  
  esRecurrente: z.boolean().default(false),
  
  frecuencia: z.string()
    .optional()
    .or(z.literal('')),
  
  proveedorId: z.number()
    .int()
    .positive()
    .optional(),
  
  comprobante: z.string()
    .max(100, 'El número de comprobante no puede exceder 100 caracteres')
    .optional()
    .or(z.literal('')),
  
  observaciones: z.string()
    .max(1000, 'Las observaciones no pueden exceder 1000 caracteres')
    .optional()
    .or(z.literal('')),
  
  activo: z.boolean().default(true)
});

// ====================================
// SCHEMA PARA ASIGNACIÓN DE GASTOS A PROYECTOS
// ====================================

export const asignacionGastoSchema = z.object({
  gastoId: z.number()
    .int('El gasto es requerido')
    .positive('Seleccione un gasto válido'),
  
  presupuestoId: z.number()
    .int('El proyecto es requerido')
    .positive('Seleccione un proyecto válido'),
  
  porcentaje: z.number()
    .min(0.01, 'El porcentaje mínimo es 0.01%')
    .max(100, 'El porcentaje máximo es 100%'),
  
  justificacion: z.string()
    .max(500, 'La justificación no puede exceder 500 caracteres')
    .optional()
    .or(z.literal(''))
});

// ====================================
// SCHEMAS DERIVADOS
// ====================================

export const createGastoOperativoSchema = gastoOperativoSchema;
export const updateGastoOperativoSchema = gastoOperativoSchema.partial();

export const createAsignacionGastoSchema = asignacionGastoSchema;

// ====================================
// TIPOS DE DATOS PARA FORMULARIOS
// ====================================

export type CreateGastoOperativoFormData = z.infer<typeof createGastoOperativoSchema>;
export type UpdateGastoOperativoFormData = z.infer<typeof updateGastoOperativoSchema>;
export type CreateAsignacionGastoFormData = z.infer<typeof createAsignacionGastoSchema>;

// ====================================
// OPCIONES PARA SELECTS
// ====================================

// categorias se consumen desde API
export const categoriasGastoOptions: never[] = [] as never[];

export const frecuenciaOptions = [
  { value: 'MENSUAL', label: 'Mensual' },
  { value: 'BIMESTRAL', label: 'Bimestral' },
  { value: 'TRIMESTRAL', label: 'Trimestral' },
  { value: 'SEMESTRAL', label: 'Semestral' },
  { value: 'ANUAL', label: 'Anual' }
];

// ====================================
// HELPERS DE VALIDACIÓN
// ====================================

export const getMontoConFormato = (monto: number, simboloMoneda: string): string => {
  return `${simboloMoneda} ${monto.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const validatePorcentajesAsignacion = (asignaciones: CreateAsignacionGastoFormData[]): boolean => {
  const totalPorcentaje = asignaciones.reduce((sum, asignacion) => sum + asignacion.porcentaje, 0);
  return totalPorcentaje <= 100;
};
