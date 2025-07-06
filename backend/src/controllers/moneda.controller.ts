import { Request, Response } from 'express';
import { MonedaService } from '../services/moneda.service';
import { body, param, query, validationResult } from 'express-validator';

// Enum local para validaciones
enum CodigoMoneda {
  ARS = 'ARS',
  USD = 'USD',
  EUR = 'EUR'
}

export class MonedaController {
  /**
   * Obtener todas las monedas activas
   * GET /api/monedas
   */
  static async getAllMonedas(req: Request, res: Response) {
    try {
      const monedas = await MonedaService.getAllMonedas();
      res.json({
        success: true,
        data: monedas,
        message: 'Monedas obtenidas exitosamente'
      });
    } catch (error) {
      console.error('Error al obtener monedas:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * Obtener una moneda por código
   * GET /api/monedas/:codigo
   */
  static async getMonedaByCodigo(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const { codigo } = req.params;
      const moneda = await MonedaService.getMonedaByCodigo(codigo as CodigoMoneda);

      if (!moneda) {
        return res.status(404).json({
          success: false,
          message: `Moneda con código ${codigo} no encontrada`
        });
      }

      res.json({
        success: true,
        data: moneda,
        message: 'Moneda obtenida exitosamente'
      });
    } catch (error) {
      console.error('Error al obtener moneda por código:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * Obtener tipo de cambio actual entre dos monedas
   * GET /api/monedas/tipo-cambio/:monedaDesde/:monedaHacia
   */
  static async getTipoCambioActual(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const { monedaDesde, monedaHacia } = req.params;

      // Buscar las monedas por código
      const monedaDesdeObj = await MonedaService.getMonedaByCodigo(monedaDesde as CodigoMoneda);
      const monedaHaciaObj = await MonedaService.getMonedaByCodigo(monedaHacia as CodigoMoneda);

      if (!monedaDesdeObj || !monedaHaciaObj) {
        return res.status(404).json({
          success: false,
          message: 'Una o ambas monedas no fueron encontradas'
        });
      }

      const tipoCambio = await MonedaService.getTipoCambioActual(
        monedaDesdeObj.id,
        monedaHaciaObj.id
      );

      if (!tipoCambio) {
        return res.status(404).json({
          success: false,
          message: `No se encontró tipo de cambio para ${monedaDesde} -> ${monedaHacia}`
        });
      }

      res.json({
        success: true,
        data: tipoCambio,
        message: 'Tipo de cambio obtenido exitosamente'
      });
    } catch (error) {
      console.error('Error al obtener tipo de cambio:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * Convertir un monto entre monedas
   * POST /api/monedas/convertir
   */
  static async convertirMoneda(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const { monto, monedaDesde, monedaHacia, fecha } = req.body;

      // Buscar las monedas por código
      const monedaDesdeObj = await MonedaService.getMonedaByCodigo(monedaDesde);
      const monedaHaciaObj = await MonedaService.getMonedaByCodigo(monedaHacia);

      if (!monedaDesdeObj || !monedaHaciaObj) {
        return res.status(404).json({
          success: false,
          message: 'Una o ambas monedas no fueron encontradas'
        });
      }

      const fechaConversion = fecha ? new Date(fecha) : undefined;
      const resultado = await MonedaService.convertirMoneda(
        parseFloat(monto),
        monedaDesdeObj.id,
        monedaHaciaObj.id,
        fechaConversion
      );

      res.json({
        success: true,
        data: {
          montoOriginal: parseFloat(monto),
          monedaDesde: monedaDesdeObj.codigo,
          monedaHacia: monedaHaciaObj.codigo,
          montoConvertido: resultado.montoConvertido,
          tipoCambio: resultado.tipoCambio,
          fecha: fechaConversion || new Date()
        },
        message: 'Conversión realizada exitosamente'
      });
    } catch (error) {
      console.error('Error al convertir moneda:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * Crear o actualizar tipo de cambio
   * POST /api/monedas/tipo-cambio
   */
  static async upsertTipoCambio(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const { monedaDesde, monedaHacia, valor, fecha } = req.body;

      // Buscar las monedas por código
      const monedaDesdeObj = await MonedaService.getMonedaByCodigo(monedaDesde);
      const monedaHaciaObj = await MonedaService.getMonedaByCodigo(monedaHacia);

      if (!monedaDesdeObj || !monedaHaciaObj) {
        return res.status(404).json({
          success: false,
          message: 'Una o ambas monedas no fueron encontradas'
        });
      }

      const fechaTipoCambio = fecha ? new Date(fecha) : new Date();
      const tipoCambio = await MonedaService.upsertTipoCambio(
        monedaDesdeObj.id,
        monedaHaciaObj.id,
        parseFloat(valor),
        fechaTipoCambio
      );

      res.json({
        success: true,
        data: tipoCambio,
        message: 'Tipo de cambio actualizado exitosamente'
      });
    } catch (error) {
      console.error('Error al actualizar tipo de cambio:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * Obtener historial de tipos de cambio
   * GET /api/monedas/historial/:monedaDesde/:monedaHacia
   */
  static async getHistorialTipoCambio(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const { monedaDesde, monedaHacia } = req.params;
      const { fechaDesde, fechaHasta } = req.query;

      // Buscar las monedas por código
      const monedaDesdeObj = await MonedaService.getMonedaByCodigo(monedaDesde as CodigoMoneda);
      const monedaHaciaObj = await MonedaService.getMonedaByCodigo(monedaHacia as CodigoMoneda);

      if (!monedaDesdeObj || !monedaHaciaObj) {
        return res.status(404).json({
          success: false,
          message: 'Una o ambas monedas no fueron encontradas'
        });
      }

      const fechaDesdeDate = fechaDesde ? new Date(fechaDesde as string) : undefined;
      const fechaHastaDate = fechaHasta ? new Date(fechaHasta as string) : undefined;

      const historial = await MonedaService.getHistorialTipoCambio(
        monedaDesdeObj.id,
        monedaHaciaObj.id,
        fechaDesdeDate,
        fechaHastaDate
      );

      res.json({
        success: true,
        data: historial,
        message: 'Historial de tipos de cambio obtenido exitosamente'
      });
    } catch (error) {
      console.error('Error al obtener historial de tipos de cambio:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * Actualizar tipos de cambio masivamente
   * POST /api/monedas/actualizar-masivo
   */
  static async actualizarTiposCambioMasivo(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const { tiposCambio, fecha } = req.body;
      const fechaActualizacion = fecha ? new Date(fecha) : new Date();

      const resultados = await MonedaService.actualizarTiposCambioMasivo(
        tiposCambio,
        fechaActualizacion
      );

      res.json({
        success: true,
        data: resultados,
        message: `${resultados.length} tipos de cambio actualizados exitosamente`
      });
    } catch (error) {
      console.error('Error al actualizar tipos de cambio masivamente:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}

// Validaciones para los endpoints
export const validarCodigoMoneda = [
  param('codigo')
    .isIn(['ARS', 'USD', 'EUR'])
    .withMessage('Código de moneda inválido. Debe ser ARS, USD o EUR')
];

export const validarTipoCambioParams = [
  param('monedaDesde')
    .isIn(['ARS', 'USD', 'EUR'])
    .withMessage('Código de moneda origen inválido'),
  param('monedaHacia')
    .isIn(['ARS', 'USD', 'EUR'])
    .withMessage('Código de moneda destino inválido')
];

export const validarConversionBody = [
  body('monto')
    .isNumeric()
    .withMessage('El monto debe ser un número')
    .isFloat({ min: 0 })
    .withMessage('El monto debe ser mayor a 0'),
  body('monedaDesde')
    .isIn(['ARS', 'USD', 'EUR'])
    .withMessage('Código de moneda origen inválido'),
  body('monedaHacia')
    .isIn(['ARS', 'USD', 'EUR'])
    .withMessage('Código de moneda destino inválido'),
  body('fecha')
    .optional()
    .isISO8601()
    .withMessage('La fecha debe tener formato ISO8601')
];

export const validarTipoCambioBody = [
  body('monedaDesde')
    .isIn(['ARS', 'USD', 'EUR'])
    .withMessage('Código de moneda origen inválido'),
  body('monedaHacia')
    .isIn(['ARS', 'USD', 'EUR'])
    .withMessage('Código de moneda destino inválido'),
  body('valor')
    .isNumeric()
    .withMessage('El valor debe ser un número')
    .isFloat({ min: 0 })
    .withMessage('El valor debe ser mayor a 0'),
  body('fecha')
    .optional()
    .isISO8601()
    .withMessage('La fecha debe tener formato ISO8601')
];

export const validarActualizacionMasiva = [
  body('tiposCambio')
    .isArray({ min: 1 })
    .withMessage('Debe proporcionar al menos un tipo de cambio'),
  body('tiposCambio.*.monedaDesde')
    .isIn(['ARS', 'USD', 'EUR'])
    .withMessage('Código de moneda origen inválido'),
  body('tiposCambio.*.monedaHacia')
    .isIn(['ARS', 'USD', 'EUR'])
    .withMessage('Código de moneda destino inválido'),
  body('tiposCambio.*.valor')
    .isNumeric()
    .withMessage('El valor debe ser un número')
    .isFloat({ min: 0 })
    .withMessage('El valor debe ser mayor a 0'),
  body('fecha')
    .optional()
    .isISO8601()
    .withMessage('La fecha debe tener formato ISO8601')
];

export const validarHistorialQuery = [
  ...validarTipoCambioParams,
  query('fechaDesde')
    .optional()
    .isISO8601()
    .withMessage('La fecha desde debe tener formato ISO8601'),
  query('fechaHasta')
    .optional()
    .isISO8601()
    .withMessage('La fecha hasta debe tener formato ISO8601')
];
