import { z } from 'zod';

// Enums locales para el frontend (NO usar @prisma/client)
export enum TipoItem {
  PRODUCTO = 'PRODUCTO',
  SERVICIO = 'SERVICIO'
}

export enum MotivoComun {
  INFLACION = 'Inflación',
  DEVALUACION = 'Devaluación',
  ACTUALIZACION_COSTOS = 'Actualización por costos',
  PROMOCION = 'Promoción',
  AJUSTE_COMPETENCIA = 'Ajuste por competencia',
  REVISION_ANUAL = 'Revisión anual',
  OTROS = 'Otros'
}

// Schema para actualizar precio individual
export const actualizarPrecioSchema = z.object({
  monedaId: z.number().int().positive('Debe seleccionar una moneda'),
  precio: z.number().positive('El precio debe ser mayor a 0'),
  motivoCambio: z.string().min(3, 'El motivo debe tener al menos 3 caracteres').max(255, 'El motivo no puede exceder 255 caracteres')
});

// Schema para actualización masiva
export const actualizacionMasivaSchema = z.object({
  tipo: z.nativeEnum(TipoItem, { required_error: 'Debe seleccionar el tipo de item' }),
  monedaId: z.number().int().positive('Debe seleccionar una moneda'),
  porcentajeAumento: z.number().min(-100, 'El porcentaje no puede ser menor a -100%').max(1000, 'El porcentaje no puede ser mayor a 1000%'),
  motivoCambio: z.string().min(3, 'El motivo debe tener al menos 3 caracteres').max(255, 'El motivo no puede exceder 255 caracteres'),
  filtros: z.object({
    proveedorId: z.number().int().positive().optional(),
    ids: z.array(z.number().int().positive()).optional()
  }).optional()
});

// Schema para filtros de historial
export const historialFiltrosSchema = z.object({
  monedaId: z.number().int().positive().optional(),
  fechaDesde: z.string().optional(),
  fechaHasta: z.string().optional(),
  limit: z.number().int().positive().max(100).optional()
});

// Schema para filtros de precios desactualizados
export const preciosDesactualizadosFiltrosSchema = z.object({
  diasLimite: z.number().int().positive().min(1).max(365).optional(),
  monedaId: z.number().int().positive().optional()
});

// Schema para filtros de estadísticas
export const estadisticasFiltrosSchema = z.object({
  fechaDesde: z.string().min(1, 'La fecha desde es requerida'),
  fechaHasta: z.string().min(1, 'La fecha hasta es requerida'),
  monedaId: z.number().int().positive().optional()
}).refine(data => {
  const fechaDesde = new Date(data.fechaDesde);
  const fechaHasta = new Date(data.fechaHasta);
  return fechaDesde <= fechaHasta;
}, {
  message: 'La fecha desde debe ser anterior o igual a la fecha hasta',
  path: ['fechaHasta']
});

// Schema para configuración de alertas
export const alertasPreciosSchema = z.object({
  diasAlerta: z.number().int().positive().min(1).max(365).default(30),
  notificarPorEmail: z.boolean().default(true),
  notificarEnDashboard: z.boolean().default(true),
  monedas: z.array(z.number().int().positive()).min(1, 'Debe seleccionar al menos una moneda')
});

// Tipos derivados de los schemas
export type ActualizarPrecioFormData = z.infer<typeof actualizarPrecioSchema>;
export type ActualizacionMasivaFormData = z.infer<typeof actualizacionMasivaSchema>;
export type HistorialFiltrosFormData = z.infer<typeof historialFiltrosSchema>;
export type PreciosDesactualizadosFiltrosFormData = z.infer<typeof preciosDesactualizadosFiltrosSchema>;
export type EstadisticasFiltrosFormData = z.infer<typeof estadisticasFiltrosSchema>;
export type AlertasPreciosFormData = z.infer<typeof alertasPreciosSchema>;

// Opciones para selects
export const tipoItemOptions = [
  { value: TipoItem.PRODUCTO, label: 'Productos' },
  { value: TipoItem.SERVICIO, label: 'Servicios' }
];

export const motivoComunOptions = [
  { value: MotivoComun.INFLACION, label: 'Inflación' },
  { value: MotivoComun.DEVALUACION, label: 'Devaluación' },
  { value: MotivoComun.ACTUALIZACION_COSTOS, label: 'Actualización por costos' },
  { value: MotivoComun.PROMOCION, label: 'Promoción' },
  { value: MotivoComun.AJUSTE_COMPETENCIA, label: 'Ajuste por competencia' },
  { value: MotivoComun.REVISION_ANUAL, label: 'Revisión anual' },
  { value: MotivoComun.OTROS, label: 'Otros' }
];

export const diasAlertaOptions = [
  { value: 7, label: '7 días' },
  { value: 15, label: '15 días' },
  { value: 30, label: '30 días' },
  { value: 60, label: '60 días' },
  { value: 90, label: '90 días' },
  { value: 180, label: '180 días' }
];

export const limitHistorialOptions = [
  { value: 10, label: '10 registros' },
  { value: 25, label: '25 registros' },
  { value: 50, label: '50 registros' },
  { value: 100, label: '100 registros' }
];
