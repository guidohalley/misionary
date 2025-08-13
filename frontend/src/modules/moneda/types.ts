// Enums locales (NO usar @prisma/client en frontend)
export enum CodigoMoneda {
  ARS = 'ARS',
  USD = 'USD',
  EUR = 'EUR'
}

export enum TipoCotizacion {
  OFICIAL = 'OFICIAL',
  BLUE = 'BLUE',
  TARJETA = 'TARJETA',
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
  tipo?: TipoCotizacion;
  fuente?: string | null;
}

// DTOs para API
export interface ConversionRequest {
  monto: number;
  monedaDesde: CodigoMoneda;
  monedaHacia: CodigoMoneda;
  fecha?: string;
  tipo?: TipoCotizacion;
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
  tipo?: TipoCotizacion;
  fuente?: string;
}

export interface ActualizacionMasivaRequest {
  tiposCambio: Array<{
    monedaDesde: CodigoMoneda;
    monedaHacia: CodigoMoneda;
    valor: number;
  tipo?: TipoCotizacion;
  fuente?: string;
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
