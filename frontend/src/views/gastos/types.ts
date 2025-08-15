// Re-export de tipos de dominio desde modules/
export type {
  GastoOperativo,
  AsignacionGastoProyecto,
  Moneda,
  Persona,
  Presupuesto,
  AnalisisRentabilidad,
  DetalleGastoRentabilidad,
  CreateGastoOperativoDTO,
  UpdateGastoOperativoDTO,
  CreateAsignacionGastoDTO,
  GastoOperativoFilters,
  AsignacionGastoFilters
} from '@/modules/gasto/types';

// Re-export de enums y schemas desde schemas.ts
export {
  CodigoMoneda,
  gastoOperativoSchema,
  asignacionGastoSchema,
  createGastoOperativoSchema,
  updateGastoOperativoSchema,
  createAsignacionGastoSchema,
  frecuenciaOptions,
  type CreateGastoOperativoFormData,
  type UpdateGastoOperativoFormData,
  type CreateAsignacionGastoFormData
} from './schemas';
