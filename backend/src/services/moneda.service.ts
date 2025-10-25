import { PrismaClient, Moneda, TipoCambio, CodigoMoneda, TipoCotizacion } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { roundCurrency, toNumber } from '../utils/currency';

const prisma = new PrismaClient();

export class MonedaService {
  /**
   * Obtener todas las monedas activas
   */
  static async getAllMonedas(): Promise<Moneda[]> {
    return await prisma.moneda.findMany({
      where: { activo: true },
      orderBy: { codigo: 'asc' }
    });
  }

  /**
   * Obtener una moneda por código
   */
  static async getMonedaByCodigo(codigo: CodigoMoneda): Promise<Moneda | null> {
    return await prisma.moneda.findUnique({
      where: { codigo }
    });
  }

  /**
   * Obtener una moneda por ID
   */
  static async getMonedaById(id: number): Promise<Moneda | null> {
    return await prisma.moneda.findUnique({
      where: { id }
    });
  }

  /**
   * Obtener el tipo de cambio más reciente entre dos monedas
   */
  static async getTipoCambioActual(
    monedaDesdeId: number,
    monedaHaciaId: number,
    tipo: TipoCotizacion = 'OFICIAL'
  ): Promise<TipoCambio | null> {
    return await prisma.tipoCambio.findFirst({
      where: {
        monedaDesdeId,
        monedaHaciaId,
        tipo
      },
      orderBy: { fecha: 'desc' },
      include: {
        monedaDesde: true,
        monedaHacia: true
      }
    });
  }

  /**
   * Obtener tipos de cambio por fecha específica
   */
  static async getTipoCambioPorFecha(
    monedaDesdeId: number,
    monedaHaciaId: number,
    fecha: Date,
    tipo: TipoCotizacion = 'OFICIAL'
  ): Promise<TipoCambio | null> {
    // Normalizar fecha al inicio del día
    const fechaNormalizada = new Date(fecha);
    fechaNormalizada.setHours(0, 0, 0, 0);

    return await prisma.tipoCambio.findUnique({
      where: {
        monedaDesdeId_monedaHaciaId_tipo_fecha: {
          monedaDesdeId,
          monedaHaciaId,
          tipo,
          fecha: fechaNormalizada
        }
      },
      include: {
        monedaDesde: true,
        monedaHacia: true
      }
    });
  }

  /**
   * Crear o actualizar tipo de cambio
   */
  static async upsertTipoCambio(
    monedaDesdeId: number,
    monedaHaciaId: number,
    valor: number,
    fecha: Date = new Date(),
    tipo: TipoCotizacion = 'OFICIAL',
    fuente?: string
  ): Promise<TipoCambio> {
    // Normalizar fecha al inicio del día
    const fechaNormalizada = new Date(fecha);
    fechaNormalizada.setHours(0, 0, 0, 0);

    return await prisma.tipoCambio.upsert({
      where: {
        monedaDesdeId_monedaHaciaId_tipo_fecha: {
          monedaDesdeId,
          monedaHaciaId,
          tipo,
          fecha: fechaNormalizada
        }
      },
      update: {
        valor: new Decimal(valor),
        fuente
      },
      create: {
        monedaDesdeId,
        monedaHaciaId,
        valor: new Decimal(valor),
        fecha: fechaNormalizada,
        tipo,
        fuente
      },
      include: {
        monedaDesde: true,
        monedaHacia: true
      }
    });
  }

  /**
   * Convertir un monto de una moneda a otra
   */
  static async convertirMoneda(
    monto: number,
    monedaDesdeId: number,
    monedaHaciaId: number,
    fecha?: Date,
    tipo: TipoCotizacion = 'OFICIAL'
  ): Promise<{ montoConvertido: number; tipoCambio: TipoCambio | null }> {
    // Si es la misma moneda, no hay conversión
    if (monedaDesdeId === monedaHaciaId) {
      return {
        montoConvertido: monto,
        tipoCambio: null
      };
    }

    let tipoCambio: TipoCambio | null;

    if (fecha) {
      tipoCambio = await this.getTipoCambioPorFecha(monedaDesdeId, monedaHaciaId, fecha, tipo);
    } else {
      tipoCambio = await this.getTipoCambioActual(monedaDesdeId, monedaHaciaId, tipo);
    }

    if (!tipoCambio) {
      throw new Error(`No se encontró tipo de cambio para las monedas especificadas`);
    }

    const tipoCambioNumber = toNumber(tipoCambio.valor);
    const montoConvertido = roundCurrency(monto * tipoCambioNumber, 2);

    return {
      montoConvertido,
      tipoCambio
    };
  }

  /**
   * Obtener historial de tipos de cambio
   */
  static async getHistorialTipoCambio(
    monedaDesdeId: number,
    monedaHaciaId: number,
    fechaDesde?: Date,
    fechaHasta?: Date
  ): Promise<TipoCambio[]> {
    const whereConditions: any = {
      monedaDesdeId,
      monedaHaciaId
    };

    if (fechaDesde || fechaHasta) {
      whereConditions.fecha = {};
      if (fechaDesde) {
        whereConditions.fecha.gte = fechaDesde;
      }
      if (fechaHasta) {
        whereConditions.fecha.lte = fechaHasta;
      }
    }

    return await prisma.tipoCambio.findMany({
      where: whereConditions,
      orderBy: { fecha: 'desc' },
      include: {
        monedaDesde: true,
        monedaHacia: true
      }
    });
  }

  /**
   * Obtener todas las combinaciones de tipos de cambio disponibles
   */
  static async getTiposCambioDisponibles(): Promise<TipoCambio[]> {
    return await prisma.tipoCambio.findMany({
      distinct: ['monedaDesdeId', 'monedaHaciaId'],
      orderBy: [
        { monedaDesdeId: 'asc' },
        { monedaHaciaId: 'asc' }
      ],
      include: {
        monedaDesde: true,
        monedaHacia: true
      }
    });
  }

  /**
   * Actualizar tipos de cambio masivamente (útil para APIs externas)
   */
  static async actualizarTiposCambioMasivo(
    tiposCambio: Array<{
      monedaDesde: CodigoMoneda;
      monedaHacia: CodigoMoneda;
      valor: number;
      tipo?: TipoCotizacion;
      fuente?: string;
    }>,
    fecha: Date = new Date()
  ): Promise<TipoCambio[]> {
    const monedas = await this.getAllMonedas();
    const resultados: TipoCambio[] = [];

    for (const tipoCambio of tiposCambio) {
      const monedaDesde = monedas.find(m => m.codigo === tipoCambio.monedaDesde);
      const monedaHacia = monedas.find(m => m.codigo === tipoCambio.monedaHacia);

      if (monedaDesde && monedaHacia) {
        const resultado = await this.upsertTipoCambio(
          monedaDesde.id,
          monedaHacia.id,
          tipoCambio.valor,
          fecha,
          tipoCambio.tipo || 'OFICIAL',
          tipoCambio.fuente
        );
        resultados.push(resultado);
      }
    }

    return resultados;
  }
}
