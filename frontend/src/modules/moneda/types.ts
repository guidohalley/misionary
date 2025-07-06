// Enums locales (NO usar @prisma/client en frontend)
export enum CodigoMoneda {
  ARS = 'ARS',
  USD = 'USD',
  EUR = 'EUR'
}

// Tipos de dominio
export interface Moneda {
  id: number;
  codigo: CodigoMoneda;
  nombre: string;
  simbolo: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TipoCambio {
  id: number;
  monedaDesdeId: number;
  monedaHaciaId: number;
  valor: string; // Decimal como string
  fecha: string;
  createdAt: string;
  monedaDesde: Moneda;
  monedaHacia: Moneda;
}

// DTOs para API
export interface ConversionRequest {
  monto: number;
  monedaDesde: CodigoMoneda;
  monedaHacia: CodigoMoneda;
  fecha?: string;
}

export interface ConversionResponse {
  montoOriginal: number;
  monedaDesde: CodigoMoneda;
  monedaHacia: CodigoMoneda;
  montoConvertido: number;
  tipoCambio: TipoCambio | null;
  fecha: string;
}

export interface TipoCambioRequest {
  monedaDesde: CodigoMoneda;
  monedaHacia: CodigoMoneda;
  valor: number;
  fecha?: string;
}

export interface ActualizacionMasivaRequest {
  tiposCambio: Array<{
    monedaDesde: CodigoMoneda;
    monedaHacia: CodigoMoneda;
    valor: number;
  }>;
  fecha?: string;
}

// Respuestas de API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  errors?: any[];
}
