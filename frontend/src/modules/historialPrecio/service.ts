import ApiService from '@/services/ApiService';
import type { 
  HistorialPrecio,
  ActualizarPrecioRequest,
  ActualizacionMasivaRequest,
  ActualizacionMasivaResponse,
  PrecioDesactualizado,
  EstadisticasCambios,
  ApiResponse,
  HistorialPrecioFilters,
  PreciosDesactualizadosFilters,
  EstadisticasFilters,
  TipoItem
} from './types';

export class HistorialPrecioService {
  /**
   * Obtener historial de precios para un producto
   */
  static async fetchHistorialProducto(
    productoId: number,
    filtros?: HistorialPrecioFilters
  ): Promise<HistorialPrecio[]> {
    const params = new URLSearchParams();
    if (filtros?.monedaId) params.append('monedaId', filtros.monedaId.toString());
    if (filtros?.limit) params.append('limit', filtros.limit.toString());
    
    const queryString = params.toString();
    const url = `/historial-precios/producto/${productoId}${queryString ? `?${queryString}` : ''}`;

    const response = await ApiService.fetchData<ApiResponse<HistorialPrecio[]>>({
      url,
      method: 'GET'
    });
    return response.data.data;
  }

  /**
   * Obtener historial de precios para un servicio
   */
  static async fetchHistorialServicio(
    servicioId: number,
    filtros?: HistorialPrecioFilters
  ): Promise<HistorialPrecio[]> {
    const params = new URLSearchParams();
    if (filtros?.monedaId) params.append('monedaId', filtros.monedaId.toString());
    if (filtros?.limit) params.append('limit', filtros.limit.toString());
    
    const queryString = params.toString();
    const url = `/historial-precios/servicio/${servicioId}${queryString ? `?${queryString}` : ''}`;

    const response = await ApiService.fetchData<ApiResponse<HistorialPrecio[]>>({
      url,
      method: 'GET'
    });
    return response.data.data;
  }

  /**
   * Obtener precio actual vigente de un producto
   */
  static async fetchPrecioActualProducto(
    productoId: number,
    monedaId: number
  ): Promise<HistorialPrecio> {
    const response = await ApiService.fetchData<ApiResponse<HistorialPrecio>>({
      url: `/historial-precios/producto/${productoId}/actual/${monedaId}`,
      method: 'GET'
    });
    return response.data.data;
  }

  /**
   * Obtener precio actual vigente de un servicio
   */
  static async fetchPrecioActualServicio(
    servicioId: number,
    monedaId: number
  ): Promise<HistorialPrecio> {
    const response = await ApiService.fetchData<ApiResponse<HistorialPrecio>>({
      url: `/historial-precios/servicio/${servicioId}/actual/${monedaId}`,
      method: 'GET'
    });
    return response.data.data;
  }

  /**
   * Actualizar precio de un producto
   */
  static async actualizarPrecioProducto(
    productoId: number,
    data: ActualizarPrecioRequest
  ): Promise<HistorialPrecio> {
    const response = await ApiService.fetchData<ApiResponse<HistorialPrecio>>({
      url: `/historial-precios/producto/${productoId}`,
      method: 'PUT',
      data
    });
    return response.data.data;
  }

  /**
   * Actualizar precio de un servicio
   */
  static async actualizarPrecioServicio(
    servicioId: number,
    data: ActualizarPrecioRequest
  ): Promise<HistorialPrecio> {
    const response = await ApiService.fetchData<ApiResponse<HistorialPrecio>>({
      url: `/historial-precios/servicio/${servicioId}`,
      method: 'PUT',
      data
    });
    return response.data.data;
  }

  /**
   * Actualización masiva de precios por porcentaje
   */
  static async actualizacionMasiva(
    data: ActualizacionMasivaRequest
  ): Promise<ActualizacionMasivaResponse> {
    const response = await ApiService.fetchData<ApiResponse<ActualizacionMasivaResponse>>({
      url: '/historial-precios/actualizacion-masiva',
      method: 'POST',
      data
    });
    return response.data.data;
  }

  /**
   * Obtener items con precios desactualizados
   */
  static async fetchPreciosDesactualizados(
    filtros?: PreciosDesactualizadosFilters
  ): Promise<PrecioDesactualizado[]> {
    const params = new URLSearchParams();
    if (filtros?.diasLimite) params.append('diasLimite', filtros.diasLimite.toString());
    if (filtros?.monedaId) params.append('monedaId', filtros.monedaId.toString());
    
    const queryString = params.toString();
    const url = `/historial-precios/desactualizados${queryString ? `?${queryString}` : ''}`;

    const response = await ApiService.fetchData<ApiResponse<PrecioDesactualizado[]>>({
      url,
      method: 'GET'
    });
    return response.data.data;
  }

  /**
   * Obtener estadísticas de cambios de precios
   */
  static async fetchEstadisticasCambios(
    filtros: EstadisticasFilters
  ): Promise<EstadisticasCambios> {
    const params = new URLSearchParams();
    params.append('fechaDesde', filtros.fechaDesde);
    params.append('fechaHasta', filtros.fechaHasta);
    if (filtros.monedaId) params.append('monedaId', filtros.monedaId.toString());
    
    const url = `/historial-precios/estadisticas?${params.toString()}`;

    const response = await ApiService.fetchData<ApiResponse<EstadisticasCambios>>({
      url,
      method: 'GET'
    });
    return response.data.data;
  }

  /**
   * Formatear precio con símbolo de moneda
   */
  static formatearPrecio(precio: string | number, simboloMoneda: string): string {
    const precioNumerico = typeof precio === 'string' ? parseFloat(precio) : precio;
    return new Intl.NumberFormat('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(precioNumerico) + ' ' + simboloMoneda;
  }

  /**
   * Calcular días desde última actualización
   */
  static calcularDiasDesdeActualizacion(fechaActualizacion: string): number {
    const hoy = new Date();
    const fecha = new Date(fechaActualizacion);
    const diferencia = hoy.getTime() - fecha.getTime();
    return Math.floor(diferencia / (1000 * 60 * 60 * 24));
  }

  /**
   * Formatear motivo de cambio para display
   */
  static formatearMotivoCambio(motivo?: string): string {
    if (!motivo) return 'Sin especificar';
    return motivo.charAt(0).toUpperCase() + motivo.slice(1).toLowerCase();
  }

  /**
   * Obtener color para badge según días sin actualizar
   */
  static getColorAlertaPrecio(diasSinActualizar: number): 'green' | 'yellow' | 'red' {
    if (diasSinActualizar <= 15) return 'green';
    if (diasSinActualizar <= 30) return 'yellow';
    return 'red';
  }

  /**
   * Validar porcentaje de aumento
   */
  static validarPorcentajeAumento(porcentaje: number): boolean {
    return porcentaje >= -100 && porcentaje <= 1000;
  }

  /**
   * Calcular nuevo precio con porcentaje
   */
  static calcularNuevoPrecio(precioActual: number, porcentaje: number): number {
    return precioActual * (1 + porcentaje / 100);
  }
}
