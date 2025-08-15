import { Request, Response } from 'express';
import PresupuestoHistorialService from '../services/presupuesto-historial.service';

export class PresupuestoHistorialController {
  
  /**
   * Obtener historial de un presupuesto específico
   */
  static async obtenerHistorial(req: Request, res: Response) {
    try {
      const presupuestoId = parseInt(req.params.presupuestoId);
      
      if (isNaN(presupuestoId)) {
        return res.status(400).json({ error: 'ID de presupuesto inválido' });
      }

      const historial = await PresupuestoHistorialService.obtenerHistorial(presupuestoId);
      return res.json(historial);
    } catch (error) {
      console.error('Error al obtener historial:', error);
      return res.status(500).json({ error: 'Error al obtener el historial del presupuesto' });
    }
  }

  /**
   * Análisis de cambios de precios para KPIs
   */
  static async analizarCambiosPrecios(req: Request, res: Response) {
    try {
      const {
        fechaDesde,
        fechaHasta,
        clienteId,
        estadoPresupuesto
      } = req.query;

      const params: any = {};
      
      if (fechaDesde) {
        params.fechaDesde = new Date(fechaDesde as string);
      }
      
      if (fechaHasta) {
        params.fechaHasta = new Date(fechaHasta as string);
      }
      
      if (clienteId) {
        params.clienteId = parseInt(clienteId as string);
      }
      
      if (estadoPresupuesto) {
        params.estadoPresupuesto = estadoPresupuesto as string;
      }

      const analisis = await PresupuestoHistorialService.analizarCambiosPrecios(params);
      return res.json(analisis);
    } catch (error) {
      console.error('Error al analizar cambios:', error);
      return res.status(500).json({ error: 'Error al analizar cambios de precios' });
    }
  }

  /**
   * Generar proyecciones empresariales
   */
  static async generarProyecciones(req: Request, res: Response) {
    try {
      const { años = 5 } = req.query;
      
      const proyecciones = await PresupuestoHistorialService.generarProyecciones({
        años: parseInt(años as string) || 5
      });
      
      return res.json(proyecciones);
    } catch (error) {
      console.error('Error al generar proyecciones:', error);
      return res.status(500).json({ error: 'Error al generar proyecciones empresariales' });
    }
  }

  /**
   * Crear snapshot manual de un presupuesto (para testing)
   */
  static async crearSnapshot(req: Request, res: Response) {
    try {
      const presupuestoId = parseInt(req.params.presupuestoId);
      
      if (isNaN(presupuestoId)) {
        return res.status(400).json({ error: 'ID de presupuesto inválido' });
      }

      const snapshot = await PresupuestoHistorialService.crearSnapshot(presupuestoId);
      
      if (!snapshot) {
        return res.status(404).json({ error: 'Presupuesto no encontrado' });
      }

      return res.json(snapshot);
    } catch (error) {
      console.error('Error al crear snapshot:', error);
      return res.status(500).json({ error: 'Error al crear snapshot del presupuesto' });
    }
  }

  /**
   * Dashboard de KPIs empresariales
   */
  static async dashboardKPIs(req: Request, res: Response) {
    try {
      const { período = '12' } = req.query; // Meses por defecto
      const meses = parseInt(período as string);
      
      const fechaDesde = new Date();
      fechaDesde.setMonth(fechaDesde.getMonth() - meses);

      // Obtener múltiples análisis
      const [
        analisisGeneral,
        proyecciones,
        analisisPorCliente
      ] = await Promise.all([
        PresupuestoHistorialService.analizarCambiosPrecios({ fechaDesde }),
        PresupuestoHistorialService.generarProyecciones({ años: 3 }),
        // Análisis por cliente top (se puede expandir)
        PresupuestoHistorialService.analizarCambiosPrecios({ 
          fechaDesde,
          estadoPresupuesto: 'APROBADO' as any
        })
      ]);

      const dashboard = {
        período: `${meses} meses`,
        resumenGeneral: analisisGeneral.analisis,
        proyecciones: proyecciones,
        tendenciasPorMes: analisisGeneral.analisis.cambiosPorMes,
        recomendaciones: proyecciones.recomendaciones,
        ultimaActualizacion: new Date().toISOString()
      };

      return res.json(dashboard);
    } catch (error) {
      console.error('Error al generar dashboard KPIs:', error);
      return res.status(500).json({ error: 'Error al generar dashboard de KPIs' });
    }
  }
}

export default PresupuestoHistorialController;
