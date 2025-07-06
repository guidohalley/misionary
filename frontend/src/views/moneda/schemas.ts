import { z } from 'zod';

// Enums locales (NO usar @prisma/client)
export enum CodigoMoneda {
  ARS = 'ARS',
  USD = 'USD',
  EUR = 'EUR',
  BRL = 'BRL',
  CLP = 'CLP',
  UYU = 'UYU'
}

// Schema base para tipo de cambio
const baseTipoCambioSchema = z.object({
  monedaDesde: z.nativeEnum(CodigoMoneda, { required_error: 'Seleccione moneda origen' }),
  monedaHacia: z.nativeEnum(CodigoMoneda, { required_error: 'Seleccione moneda destino' }),
  valor: z.number().positive('El valor debe ser positivo'),
  fecha: z.string().min(1, 'La fecha es requerida')
});

// Schema para tipo de cambio con validación
export const tipoCambioSchema = baseTipoCambioSchema.refine(data => data.monedaDesde !== data.monedaHacia, {
  message: 'Las monedas deben ser diferentes',
  path: ['monedaHacia']
});

// Schema para conversión
export const conversionSchema = z.object({
  monto: z.number().positive('El monto debe ser positivo'),
  monedaDesde: z.nativeEnum(CodigoMoneda, { required_error: 'Seleccione moneda origen' }),
  monedaHacia: z.nativeEnum(CodigoMoneda, { required_error: 'Seleccione moneda destino' }),
  fecha: z.string().optional()
}).refine(data => data.monedaDesde !== data.monedaHacia, {
  message: 'Las monedas deben ser diferentes',
  path: ['monedaHacia']
});

export const createTipoCambioSchema = tipoCambioSchema;
export const updateTipoCambioSchema = baseTipoCambioSchema.partial().refine(data => {
  if (data.monedaDesde && data.monedaHacia) {
    return data.monedaDesde !== data.monedaHacia;
  }
  return true;
}, {
  message: 'Las monedas deben ser diferentes',
  path: ['monedaHacia']
});

export type TipoCambioFormData = z.infer<typeof tipoCambioSchema>;
export type ConversionFormData = z.infer<typeof conversionSchema>;
export type CreateTipoCambioFormData = z.infer<typeof createTipoCambioSchema>;
export type UpdateTipoCambioFormData = z.infer<typeof updateTipoCambioSchema>;
