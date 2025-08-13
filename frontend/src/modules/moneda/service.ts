import ApiService from '@/services/ApiService';
import type { 
  Moneda, 
  TipoCambio, 
  ConversionRequest, 
  ConversionResponse,
  TipoCambioRequest,
  ActualizacionMasivaRequest,
  ApiResponse,
  CodigoMoneda
} from './types';

export class MonedaService {
  /**
  static async fetchTipoCambioActual(
    monedaDesde: CodigoMoneda, 
    monedaHacia: CodigoMoneda,
    tipo?: 'OFICIAL' | 'BLUE' | 'TARJETA'
  ): Promise<TipoCambio> {
    const qs = tipo ? `?tipo=${tipo}` : '';
    const response = await ApiService.fetchData<ApiResponse<TipoCambio>>({
      url: `/monedas/tipo-cambio/${monedaDesde}/${monedaHacia}${qs}`,
      method: 'GET'
      method: 'GET'
    });
    return response.data.data;
  }

  /**
   * Obtener una moneda por código
   */
  static async fetchMonedaByCodigo(codigo: CodigoMoneda): Promise<Moneda> {
    const response = await ApiService.fetchData<ApiResponse<Moneda>>({
      url: `/monedas/${codigo}`,
      method: 'GET'
    });
    return response.data.data;
  }

  /**
   * Obtener tipo de cambio actual entre dos monedas
   */
  static async fetchTipoCambioActual(
    monedaDesde: CodigoMoneda, 
    monedaHacia: CodigoMoneda,
    tipo?: import('./types').TipoCotizacion
  ): Promise<TipoCambio> {
    const qs = tipo ? `?tipo=${tipo}` : ''
    const response = await ApiService.fetchData<ApiResponse<TipoCambio>>({
      url: `/monedas/tipo-cambio/${monedaDesde}/${monedaHacia}${qs}`,
      method: 'GET'
    });
    return response.data.data;
  }

  /**
   * Convertir un monto entre monedas
   */
  static async convertirMoneda(data: ConversionRequest): Promise<ConversionResponse> {
    const response = await ApiService.fetchData<ApiResponse<ConversionResponse>>({
      url: '/monedas/convertir',
      method: 'POST',
      data
    });
    return response.data.data;
  }

  /**
   * Crear o actualizar tipo de cambio (requiere autenticación ADMIN/CONTADOR)
   */
  static async upsertTipoCambio(data: TipoCambioRequest): Promise<TipoCambio> {
    const response = await ApiService.fetchData<ApiResponse<TipoCambio>>({
      url: '/monedas/tipo-cambio',
      method: 'POST',
      data
    });
    return response.data.data;
  }

  /**
   * Obtener historial de tipos de cambio
   */
  static async fetchHistorialTipoCambio(
    monedaDesde: CodigoMoneda,
    monedaHacia: CodigoMoneda,
    fechaDesde?: string,
    fechaHasta?: string
  ): Promise<TipoCambio[]> {
    const params = new URLSearchParams();
    if (fechaDesde) params.append('fechaDesde', fechaDesde);
    if (fechaHasta) params.append('fechaHasta', fechaHasta);
    
    const queryString = params.toString();
    const url = `/monedas/historial/${monedaDesde}/${monedaHacia}${queryString ? `?${queryString}` : ''}`;

    const response = await ApiService.fetchData<ApiResponse<TipoCambio[]>>({
      url,
      method: 'GET'
    });
    return response.data.data;
  }

  /**
   * Actualizar tipos de cambio masivamente (requiere autenticación ADMIN/CONTADOR)
   */
  static async actualizarTiposCambioMasivo(data: ActualizacionMasivaRequest): Promise<TipoCambio[]> {
    const response = await ApiService.fetchData<ApiResponse<TipoCambio[]>>({
      url: '/monedas/actualizar-masivo',
      method: 'POST',
      data
    });
    return response.data.data;
  }

  /**
   * Formatear moneda para display
   */
  static formatearMoneda(monto: number, moneda: Moneda): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: moneda.codigo,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(monto);
  }

  /**
   * Formatear monto simple con símbolo
   */
  static formatearMontoSimple(monto: number, simbolo: string): string {
    const montoFormateado = new Intl.NumberFormat('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(monto);
    
    return `${simbolo} ${montoFormateado}`;
  }

  /**
   * Obtener configuración de moneda para NumberFormat
   */
  static getConfiguracionMoneda(codigo: CodigoMoneda) {
    const configuraciones = {
      ARS: { locale: 'es-AR', currency: 'ARS' },
      USD: { locale: 'en-US', currency: 'USD' },
      EUR: { locale: 'es-ES', currency: 'EUR' }
    };
    return configuraciones[codigo] || configuraciones.ARS;
  }
}
