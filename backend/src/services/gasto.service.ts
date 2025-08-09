import { PrismaClient, CategoriaGasto } from '@prisma/client';
import { HttpError } from '../utils/http-error';

const prisma = new PrismaClient();

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

    return await prisma.gastoOperativo.update({
      where: { id },
      data,
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

    // Si se actualiza el porcentaje, recalcular el monto
    if (data.porcentaje !== undefined) {
      if (data.porcentaje <= 0 || data.porcentaje > 100) {
        throw new HttpError(400, 'El porcentaje debe estar entre 0.01 y 100');
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

    return await prisma.gastoOperativo.groupBy({
      by: ['categoria'],
      where,
      _sum: {
        monto: true
      },
      _count: {
        id: true
      }
    });
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

    const totalPorMoneda = asignaciones.reduce((acc, asignacion) => {
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
