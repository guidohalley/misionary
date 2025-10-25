import prisma from '../config/prisma';
import { HttpError } from '../utils/http-error';
import { CategoriaGasto } from '@prisma/client';
import { combinarGastosRealesYProyectados, calcularTotalConProyecciones } from '../utils/gastoRecurrente';


export interface CreateGastoOperativoData {
  concepto: string;
  descripcion?: string;
  monto: number;
  monedaId: number;
  fecha: Date;
  categoria: CategoriaGasto;
  esRecurrente?: boolean;
  frecuencia?: string;
  proveedorId?: number;
  comprobante?: string;
  observaciones?: string;
}

export interface UpdateGastoOperativoData extends Partial<CreateGastoOperativoData> {
  activo?: boolean;
}

export interface CreateAsignacionData {
  gastoId: number;
  presupuestoId: number;
  porcentaje: number;
  justificacion?: string;
}

export interface GastoOperativoFilter {
  categoria?: CategoriaGasto;
  proveedorId?: number;
  monedaId?: number;
  fechaDesde?: Date;
  fechaHasta?: Date;
  esRecurrente?: boolean;
  activo?: boolean;
  search?: string;
}

class GastoService {
  // ─────────────────── GASTOS OPERATIVOS ─────────────────── 

  async getGastosOperativos(filters?: GastoOperativoFilter) {
    const where: any = {};

    if (filters) {
      if (filters.categoria) where.categoria = filters.categoria;
      if (filters.proveedorId) where.proveedorId = filters.proveedorId;
      if (filters.monedaId) where.monedaId = filters.monedaId;
      if (filters.esRecurrente !== undefined) where.esRecurrente = filters.esRecurrente;
      if (filters.activo !== undefined) where.activo = filters.activo;
      
      if (filters.fechaDesde || filters.fechaHasta) {
        where.fecha = {};
        if (filters.fechaDesde) where.fecha.gte = filters.fechaDesde;
        if (filters.fechaHasta) where.fecha.lte = filters.fechaHasta;
      }

      if (filters.search) {
        where.OR = [
          { concepto: { contains: filters.search, mode: 'insensitive' } },
          { descripcion: { contains: filters.search, mode: 'insensitive' } },
          { comprobante: { contains: filters.search, mode: 'insensitive' } }
        ];
      }
    }

  return await prisma.gastoOperativo.findMany({
      where,
      include: {
        moneda: true,
        proveedor: {
          select: {
            id: true,
            nombre: true,
            email: true,
            telefono: true
          }
        },
        asignaciones: {
          include: {
            presupuesto: {
              select: {
                id: true,
                cliente: {
                  select: {
                    id: true,
                    nombre: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { fecha: 'desc' }
    });
  }

  /**
   * Obtiene gastos operativos incluyendo proyecciones de gastos recurrentes
   * Los gastos proyectados tienen una propiedad adicional: esProyeccion: true
   */
  async getGastosOperativosConProyecciones(filters?: GastoOperativoFilter & { incluirProyecciones?: boolean }) {
    // Si no se solicitan proyecciones, usar método estándar
    if (!filters?.incluirProyecciones) {
      return this.getGastosOperativos(filters);
    }

    // Obtener todos los gastos recurrentes activos (sin filtro de fecha para proyectar correctamente)
    const whereRecurrentes: any = {
      esRecurrente: true,
      activo: true
    };

    if (filters?.categoria) whereRecurrentes.categoria = filters.categoria;
    if (filters?.proveedorId) whereRecurrentes.proveedorId = filters.proveedorId;
    if (filters?.monedaId) whereRecurrentes.monedaId = filters.monedaId;

    const gastosRecurrentes = await prisma.gastoOperativo.findMany({
      where: whereRecurrentes,
      include: {
        moneda: true,
        proveedor: {
          select: {
            id: true,
            nombre: true,
            email: true,
            telefono: true
          }
        },
        asignaciones: {
          include: {
            presupuesto: {
              select: {
                id: true,
                cliente: {
                  select: {
                    id: true,
                    nombre: true
                  }
                }
              }
            }
          }
        }
      }
    });

    // Obtener gastos normales (no recurrentes o recurrentes dentro del rango)
    const whereNormales: any = {};
    if (filters?.categoria) whereNormales.categoria = filters.categoria;
    if (filters?.proveedorId) whereNormales.proveedorId = filters.proveedorId;
    if (filters?.monedaId) whereNormales.monedaId = filters.monedaId;
    if (filters?.activo !== undefined) whereNormales.activo = filters.activo;
    
    if (filters?.fechaDesde || filters?.fechaHasta) {
      whereNormales.fecha = {};
      if (filters.fechaDesde) whereNormales.fecha.gte = filters.fechaDesde;
      if (filters.fechaHasta) whereNormales.fecha.lte = filters.fechaHasta;
    }

    if (filters?.search) {
      whereNormales.OR = [
        { concepto: { contains: filters.search, mode: 'insensitive' } },
        { descripcion: { contains: filters.search, mode: 'insensitive' } },
        { comprobante: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    const gastosNormales = await prisma.gastoOperativo.findMany({
      where: whereNormales,
      include: {
        moneda: true,
        proveedor: {
          select: {
            id: true,
            nombre: true,
            email: true,
            telefono: true
          }
        },
        asignaciones: {
          include: {
            presupuesto: {
              select: {
                id: true,
                cliente: {
                  select: {
                    id: true,
                    nombre: true
                  }
                }
              }
            }
          }
        }
      }
    });

    // Definir rango de proyección
    const fechaDesde = filters?.fechaDesde || new Date();
    const fechaHasta = filters?.fechaHasta || (() => {
      const fecha = new Date();
      fecha.setMonth(fecha.getMonth() + 12); // Proyectar hasta 12 meses por defecto
      return fecha;
    })();

    // Combinar gastos normales con proyecciones de recurrentes
    const todosLosGastos = combinarGastosRealesYProyectados(
      [...gastosNormales, ...gastosRecurrentes],
      fechaDesde,
      fechaHasta
    );

    // Filtrar por rango de fechas final
    const gastosFiltrados = todosLosGastos.filter((g: any) => {
      const fecha = new Date(g.fecha);
      if (filters?.fechaDesde && fecha < filters.fechaDesde) return false;
      if (filters?.fechaHasta && fecha > filters.fechaHasta) return false;
      return true;
    });

    return gastosFiltrados;
  }

  async getGastoOperativoById(id: number) {
  const gasto = await prisma.gastoOperativo.findUnique({
      where: { id },
      include: {
        moneda: true,
        proveedor: {
          select: {
            id: true,
            nombre: true,
            email: true,
            telefono: true
          }
        },
        asignaciones: {
          include: {
            presupuesto: {
              select: {
                id: true,
                cliente: {
                  select: {
                    id: true,
                    nombre: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!gasto) {
      throw new HttpError(404, 'Gasto operativo no encontrado');
    }

    return gasto;
  }

  async createGastoOperativo(data: CreateGastoOperativoData) {
    // Validar que la moneda existe
    const moneda = await prisma.moneda.findUnique({
      where: { id: data.monedaId }
    });

    if (!moneda) {
      throw new HttpError(400, 'Moneda no encontrada');
    }

    // Validar proveedor si se proporciona
    if (data.proveedorId) {
      const proveedor = await prisma.persona.findUnique({
        where: { id: data.proveedorId }
      });

      if (!proveedor) {
        throw new HttpError(400, 'Proveedor no encontrado');
      }
    }

    // Validar que la categoría sea válida
    if (!Object.values(CategoriaGasto).includes(data.categoria)) {
      throw new HttpError(400, 'Categoría no válida');
    }

  return await prisma.gastoOperativo.create({
      data: {
        concepto: data.concepto,
        descripcion: data.descripcion,
        monto: data.monto,
        monedaId: data.monedaId,
        fecha: data.fecha,
        categoria: data.categoria,
        esRecurrente: data.esRecurrente || false,
        frecuencia: data.frecuencia,
        proveedorId: data.proveedorId,
        comprobante: data.comprobante,
        observaciones: data.observaciones
      },
      include: {
        moneda: true,
        proveedor: {
          select: {
            id: true,
            nombre: true,
            email: true,
            telefono: true
          }
        }
      }
    });
  }

  async updateGastoOperativo(id: number, data: UpdateGastoOperativoData) {
    const gastoExistente = await prisma.gastoOperativo.findUnique({
      where: { id }
    });

    if (!gastoExistente) {
      throw new HttpError(404, 'Gasto operativo no encontrado');
    }

  // Validaciones similares al create
    if (data.monedaId) {
      const moneda = await prisma.moneda.findUnique({
        where: { id: data.monedaId }
      });

      if (!moneda) {
        throw new HttpError(400, 'Moneda no encontrada');
      }
    }

    if (data.proveedorId) {
      const proveedor = await prisma.persona.findUnique({
        where: { id: data.proveedorId }
      });

      if (!proveedor) {
        throw new HttpError(400, 'Proveedor no encontrado');
      }
    }

    if (data.categoria) {
      if (!Object.values(CategoriaGasto).includes(data.categoria)) {
        throw new HttpError(400, 'Categoría no válida');
      }
    }

    return await prisma.gastoOperativo.update({
      where: { id },
      data: {
        concepto: data.concepto,
        descripcion: data.descripcion,
        monto: data.monto,
        monedaId: data.monedaId,
        fecha: data.fecha,
        categoria: data.categoria,
        esRecurrente: data.esRecurrente,
        frecuencia: data.frecuencia,
        proveedorId: data.proveedorId,
        comprobante: data.comprobante,
        observaciones: data.observaciones,
        activo: data.activo
      },
      include: {
        moneda: true,
        proveedor: {
          select: {
            id: true,
            nombre: true,
            email: true,
            telefono: true
          }
        }
      }
    });
  }

  async deleteGastoOperativo(id: number) {
    const gasto = await prisma.gastoOperativo.findUnique({
      where: { id },
      include: {
        asignaciones: true
      }
    });

    if (!gasto) {
      throw new HttpError(404, 'Gasto operativo no encontrado');
    }

    // Si tiene asignaciones, no permitir eliminación directa
    if (gasto.asignaciones.length > 0) {
      throw new HttpError(400, 'No se puede eliminar un gasto que tiene asignaciones a proyectos. Primero elimine las asignaciones.');
    }

    await prisma.gastoOperativo.delete({
      where: { id }
    });
  }

  // ─────────────────── ASIGNACIONES A PROYECTOS ─────────────────── 

  async getAsignacionesPorGasto(gastoId: number) {
    return await prisma.asignacionGastoProyecto.findMany({
      where: { gastoId },
      include: {
        presupuesto: {
          select: {
            id: true,
            cliente: {
              select: {
                id: true,
                nombre: true
              }
            },
            total: true,
            moneda: true
          }
        }
      }
    });
  }

  async getAsignacionesPorProyecto(presupuestoId: number) {
    return await prisma.asignacionGastoProyecto.findMany({
      where: { presupuestoId },
      include: {
        gasto: {
          include: {
            moneda: true,
            proveedor: {
              select: {
                id: true,
                nombre: true
              }
            }
          }
        }
      }
    });
  }

  async createAsignacion(data: CreateAsignacionData) {
    // Validar que el gasto existe
    const gasto = await prisma.gastoOperativo.findUnique({
      where: { id: data.gastoId }
    });

    if (!gasto) {
      throw new HttpError(404, 'Gasto operativo no encontrado');
    }

    // Validar que el presupuesto existe
    const presupuesto = await prisma.presupuesto.findUnique({
      where: { id: data.presupuestoId }
    });

    if (!presupuesto) {
      throw new HttpError(404, 'Presupuesto no encontrado');
    }

    // Validar que el porcentaje es válido
    if (data.porcentaje <= 0 || data.porcentaje > 100) {
      throw new HttpError(400, 'El porcentaje debe estar entre 0.01 y 100');
    }

    // Verificar que no existe ya una asignación para este gasto y proyecto
    const asignacionExistente = await prisma.asignacionGastoProyecto.findUnique({
      where: {
        gastoId_presupuestoId: {
          gastoId: data.gastoId,
          presupuestoId: data.presupuestoId
        }
      }
    });

    if (asignacionExistente) {
      throw new HttpError(400, 'Ya existe una asignación de este gasto para este proyecto');
    }

    // Validar que la suma de porcentajes no exceda 100%
    const asignacionesExistentes = await prisma.asignacionGastoProyecto.findMany({
      where: { gastoId: data.gastoId }
    });

    const totalPorcentajeAsignado = asignacionesExistentes.reduce(
      (sum, a) => sum + Number(a.porcentaje),
      0
    );

    if (totalPorcentajeAsignado + data.porcentaje > 100) {
      throw new HttpError(
        400,
        `El total de asignaciones (${(totalPorcentajeAsignado + data.porcentaje).toFixed(2)}%) excede el 100%. Disponible: ${(100 - totalPorcentajeAsignado).toFixed(2)}%`
      );
    }

    // Calcular el monto asignado
    const montoAsignado = (gasto.monto.toNumber() * data.porcentaje) / 100;

    return await prisma.asignacionGastoProyecto.create({
      data: {
        gastoId: data.gastoId,
        presupuestoId: data.presupuestoId,
        porcentaje: data.porcentaje,
        montoAsignado: montoAsignado,
        justificacion: data.justificacion
      },
      include: {
        gasto: {
          include: {
            moneda: true
          }
        },
        presupuesto: {
          select: {
            id: true,
            cliente: {
              select: {
                id: true,
                nombre: true
              }
            }
          }
        }
      }
    });
  }

  async updateAsignacion(id: number, data: Partial<CreateAsignacionData>) {
    const asignacionExistente = await prisma.asignacionGastoProyecto.findUnique({
      where: { id },
      include: {
        gasto: true
      }
    });

    if (!asignacionExistente) {
      throw new HttpError(404, 'Asignación no encontrada');
    }

    let montoAsignado = asignacionExistente.montoAsignado.toNumber();

    // Si se actualiza el porcentaje, recalcular el monto y validar total
    if (data.porcentaje !== undefined) {
      if (data.porcentaje <= 0 || data.porcentaje > 100) {
        throw new HttpError(400, 'El porcentaje debe estar entre 0.01 y 100');
      }

      // Validar que la suma de porcentajes no exceda 100%
      const asignacionesOtras = await prisma.asignacionGastoProyecto.findMany({
        where: {
          gastoId: asignacionExistente.gastoId,
          id: { not: id } // Excluir la asignación actual
        }
      });

      const totalPorcentajeOtros = asignacionesOtras.reduce(
        (sum, a) => sum + Number(a.porcentaje),
        0
      );

      if (totalPorcentajeOtros + data.porcentaje > 100) {
        throw new HttpError(
          400,
          `El total de asignaciones (${(totalPorcentajeOtros + data.porcentaje).toFixed(2)}%) excede el 100%. Disponible: ${(100 - totalPorcentajeOtros).toFixed(2)}%`
        );
      }

      montoAsignado = (asignacionExistente.gasto.monto.toNumber() * data.porcentaje) / 100;
    }

    return await prisma.asignacionGastoProyecto.update({
      where: { id },
      data: {
        ...data,
        montoAsignado
      },
      include: {
        gasto: {
          include: {
            moneda: true
          }
        },
        presupuesto: {
          select: {
            id: true,
            cliente: {
              select: {
                id: true,
                nombre: true
              }
            }
          }
        }
      }
    });
  }

  async deleteAsignacion(id: number) {
    const asignacion = await prisma.asignacionGastoProyecto.findUnique({
      where: { id }
    });

    if (!asignacion) {
      throw new HttpError(404, 'Asignación no encontrada');
    }

    await prisma.asignacionGastoProyecto.delete({
      where: { id }
    });
  }

  // ─────────────────── REPORTES Y ANÁLISIS ─────────────────── 

  async getResumenGastosPorCategoria(fechaDesde?: Date, fechaHasta?: Date) {
    const where: any = { activo: true };

    if (fechaDesde || fechaHasta) {
      where.fecha = {};
      if (fechaDesde) where.fecha.gte = fechaDesde;
      if (fechaHasta) where.fecha.lte = fechaHasta;
    }

    const grouped = await prisma.gastoOperativo.groupBy({
      by: ['categoria'],
      where,
      _sum: { monto: true },
      _count: { id: true }
    });

    type Grouped = { categoria: CategoriaGasto | null; _sum: { monto: any }; _count: { id: number } };

    return (grouped as Grouped[]).map((g) => ({
      categoria: g.categoria,
      categoriaNombre: g.categoria || 'SIN CATEGORÍA',
      _sum: g._sum,
      _count: g._count
    }));
  }

  async getCostosOperativosPorProyecto(presupuestoId: number) {
    const asignaciones = await prisma.asignacionGastoProyecto.findMany({
      where: { presupuestoId },
      include: {
        gasto: {
          include: {
            moneda: true
          }
        }
      }
    });

  const totalPorMoneda = asignaciones.reduce((acc: any, asignacion: any) => {
      const codigoMoneda = asignacion.gasto.moneda.codigo;
      if (!acc[codigoMoneda]) {
        acc[codigoMoneda] = {
          total: 0,
          simbolo: asignacion.gasto.moneda.simbolo,
          asignaciones: []
        };
      }
      acc[codigoMoneda].total += asignacion.montoAsignado.toNumber();
      acc[codigoMoneda].asignaciones.push(asignacion);
      return acc;
    }, {} as any);

    return {
      presupuestoId,
      totalPorMoneda,
      cantidadAsignaciones: asignaciones.length
    };
  }
}

export const gastoService = new GastoService();
