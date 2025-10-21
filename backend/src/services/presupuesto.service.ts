import prisma from '../config/prisma';
import PresupuestoHistorialService from './presupuesto-historial.service';
import { calcularMontoSugerido, validarGananciaGlobal } from '../utils/presupuestoGanancia';

export class PresupuestoService {
  /**
   * Convierte campos Decimal a Number para serialización JSON correcta
   */
  private static transformPresupuesto(presupuesto: any): any {
    if (!presupuesto) return null;
    
    return {
      ...presupuesto,
      subtotal: presupuesto.subtotal ? Number(presupuesto.subtotal) : presupuesto.subtotal,
      impuestos: presupuesto.impuestos ? Number(presupuesto.impuestos) : presupuesto.impuestos,
      total: presupuesto.total ? Number(presupuesto.total) : presupuesto.total,
      margenAgenciaGlobal: presupuesto.margenAgenciaGlobal ? Number(presupuesto.margenAgenciaGlobal) : presupuesto.margenAgenciaGlobal,
      // IMPORTANTE: El campo en DB es montoGananciaAgencia, pero frontend espera montoGanancia
      montoGanancia: presupuesto.montoGananciaAgencia ? Number(presupuesto.montoGananciaAgencia) : presupuesto.montoGananciaAgencia,
      items: presupuesto.items?.map((item: any) => ({
        ...item,
        cantidad: item.cantidad ? Number(item.cantidad) : item.cantidad,
        precioUnitario: item.precioUnitario ? Number(item.precioUnitario) : item.precioUnitario,
      })) || [],
      presupuestoImpuestos: presupuesto.presupuestoImpuestos?.map((pi: any) => ({
        ...pi,
        monto: pi.monto ? Number(pi.monto) : pi.monto,
      })) || [],
    };
  }

  static async create(data: {
    clienteId: number;
    items: {
      cantidad: number;
      precioUnitario: number;
      productoId?: number;
      servicioId?: number;
    }[];
    subtotal: number;
    impuestos: number;
    total: number;
    impuestosSeleccionados?: number[];
    monedaId?: number;
    periodoInicio?: string | Date;
    periodoFin?: string | Date;
    usarGananciaGlobal?: boolean;
    margenAgenciaGlobal?: number;
    montoGananciaAgencia?: number;
  }) {
    try {
      console.log('PresupuestoService.create - Input data:', JSON.stringify(data, null, 2));
      
      // Validar que existe el cliente
      const cliente = await prisma.persona.findUnique({
        where: { id: data.clienteId }
      });
      
      if (!cliente) {
        throw new Error(`Cliente con ID ${data.clienteId} no encontrado`);
      }
      
      console.log('Cliente encontrado:', cliente.nombre);
      
      // Validar items
      for (const item of data.items) {
        if (!item.productoId && !item.servicioId) {
          throw new Error('Cada item debe tener un producto o servicio');
        }
        
        if (item.productoId && item.servicioId) {
          throw new Error('Un item no puede tener producto y servicio al mismo tiempo');
        }
        
        if (item.productoId) {
          const producto = await prisma.producto.findUnique({
            where: { id: item.productoId }
          });
          if (!producto) {
            throw new Error(`Producto con ID ${item.productoId} no encontrado`);
          }
        }
        
        if (item.servicioId) {
          const servicio = await prisma.servicio.findUnique({
            where: { id: item.servicioId }
          });
          if (!servicio) {
            throw new Error(`Servicio con ID ${item.servicioId} no encontrado`);
          }
        }
      }
      
      console.log('Validaciones pasadas, creando presupuesto...');
      
      // Validar ganancia global si se proporciona
      if (data.usarGananciaGlobal) {
        const validacion = validarGananciaGlobal(
          data.margenAgenciaGlobal,
          data.montoGananciaAgencia,
          data.subtotal
        );
        
        if (!validacion.valido) {
          throw new Error(validacion.error);
        }
        
        // Si tiene porcentaje pero no monto, calcular monto sugerido
        if (data.margenAgenciaGlobal && !data.montoGananciaAgencia) {
          data.montoGananciaAgencia = calcularMontoSugerido(data.subtotal, data.margenAgenciaGlobal);
        }
      }
      
      const presupuesto = await prisma.presupuesto.create({
        data: {
          clienteId: data.clienteId,
          subtotal: data.subtotal,
          impuestos: data.impuestos,
          total: data.total,
          monedaId: data.monedaId || 1,
          estado: 'BORRADOR' as any,
          // Vigencia del presupuesto (opcional)
          periodoInicio: data.periodoInicio ? new Date(data.periodoInicio) : undefined,
          periodoFin: data.periodoFin ? new Date(data.periodoFin) : undefined,
          // Ganancia global (opcional)
          usarGananciaGlobal: data.usarGananciaGlobal || false,
          margenAgenciaGlobal: data.margenAgenciaGlobal,
          montoGananciaAgencia: data.montoGananciaAgencia,
          items: {
            create: data.items
          },
          presupuestoImpuestos: data.impuestosSeleccionados ? {
            create: data.impuestosSeleccionados.map(impuestoId => ({
              impuestoId,
              monto: 0 // Se calculará después con el porcentaje real
            }))
          } : undefined
        },
        include: {
          cliente: true,
          empresa: true,
          moneda: true,
          items: {
            include: {
              producto: true,
              servicio: true
            }
          },
          presupuestoImpuestos: {
            include: {
              impuesto: true
            }
          }
        }
      });

      // Si hay impuestos seleccionados, calcular y actualizar los montos
      if (data.impuestosSeleccionados && data.impuestosSeleccionados.length > 0) {
        for (const impuestoId of data.impuestosSeleccionados) {
          const impuesto = await prisma.impuesto.findUnique({
            where: { id: impuestoId }
          });
          
          if (impuesto) {
            const montoImpuesto = (data.subtotal * Number(impuesto.porcentaje)) / 100;
            await prisma.presupuestoImpuesto.update({
              where: {
                presupuestoId_impuestoId: {
                  presupuestoId: presupuesto.id,
                  impuestoId: impuestoId
                }
              },
              data: {
                monto: montoImpuesto
              }
            });
          }
        }
      }
      
      // Obtener el presupuesto actualizado con los montos de impuestos
      const presupuestoFinal = await prisma.presupuesto.findUnique({
        where: { id: presupuesto.id },
        include: {
          cliente: true,
          empresa: true,
          moneda: true,
          items: {
            include: {
              producto: true,
              servicio: true
            }
          },
          presupuestoImpuestos: {
            include: {
              impuesto: true
            }
          }
        }
      });
      
      console.log('Presupuesto creado exitosamente:', presupuesto.id);
      
      // Registrar en el historial de cambios
      const snapshot = await PresupuestoHistorialService.crearSnapshot(presupuesto.id);
      if (snapshot) {
        await PresupuestoHistorialService.registrarCambio({
          tipo: 'CREATE',
          presupuestoId: presupuesto.id,
          datosNuevos: snapshot
        });
      }
      
      return presupuestoFinal || presupuesto;
    } catch (error) {
      console.error('Error en PresupuestoService.create:', error);
      throw error;
    }
  }

  static async findById(id: number) {
    const presupuesto = await prisma.presupuesto.findUnique({
      where: { id },
      include: {
        cliente: true,
        empresa: true,
        moneda: true,
        items: {
          include: {
            producto: true,
            servicio: true
          }
        },
        presupuestoImpuestos: {
          include: {
            impuesto: true
          }
        },
        facturas: true
      }
    });
    
    return this.transformPresupuesto(presupuesto);
  }

  static async update(id: number, data: any, userId?: number, userRoles?: string[]) {
    // Verificar el presupuesto actual para validar permisos
    const presupuestoExistente = await prisma.presupuesto.findUnique({
      where: { id }
    });

    if (!presupuestoExistente) {
      throw new Error('Presupuesto no encontrado');
    }

    // Validar permisos según el estado del presupuesto
    const { estado } = presupuestoExistente;
    const isAdmin = userRoles?.includes('ADMIN');

    // BORRADOR: cualquier usuario puede editar
    if (estado === 'BORRADOR') {
      // Permitido siempre
    }
    // APROBADO: solo ADMIN puede editar
    else if (estado === 'APROBADO') {
      if (!isAdmin) {
        throw new Error('Solo los administradores pueden editar presupuestos aprobados');
      }
    }
    // FACTURADO: nadie puede editar
    else if (estado === 'FACTURADO') {
      throw new Error('No se pueden editar presupuestos facturados');
    }
    // ENVIADO: por defecto no se permite editar
    else if (estado === 'ENVIADO') {
      if (!isAdmin) {
        throw new Error('Solo los administradores pueden editar presupuestos enviados');
      }
    }

    // Procesar los datos antes de la actualización
    const updateData: any = { ...data };
    
    // Si hay items, necesitamos manejarlos correctamente
    if (data.items && Array.isArray(data.items)) {
      // Primero eliminar los items existentes y luego crear los nuevos
      updateData.items = {
        deleteMany: {}, // Elimina todos los items existentes
        create: data.items.map((item: any) => ({
          descripcion: item.descripcion,
          cantidad: item.cantidad,
          precioUnitario: item.precioUnitario,
          total: item.total,
          productoId: item.productoId || null,
          servicioId: item.servicioId || null
        }))
      };
    }

    // Si hay impuestos seleccionados, manejarlos también
    if (data.impuestosSeleccionados && Array.isArray(data.impuestosSeleccionados)) {
      updateData.presupuestoImpuestos = {
        deleteMany: {}, // Elimina los impuestos existentes
        create: data.impuestosSeleccionados.map((impuestoId: number) => ({
          impuestoId,
          monto: 0 // Se puede calcular después con el porcentaje real
        }))
      };
      delete updateData.impuestosSeleccionados;
    }

    // Validar y procesar ganancia global si se proporciona
    if (data.usarGananciaGlobal !== undefined) {
      updateData.usarGananciaGlobal = data.usarGananciaGlobal;
      
      if (data.usarGananciaGlobal) {
        const validacion = validarGananciaGlobal(
          data.margenAgenciaGlobal,
          data.montoGananciaAgencia,
          data.subtotal || Number(presupuestoExistente.subtotal)
        );
        
        if (!validacion.valido) {
          throw new Error(validacion.error);
        }
        
        // Si tiene porcentaje pero no monto, calcular monto sugerido
        if (data.margenAgenciaGlobal !== undefined && data.montoGananciaAgencia === undefined) {
          updateData.montoGananciaAgencia = calcularMontoSugerido(
            data.subtotal || Number(presupuestoExistente.subtotal),
            data.margenAgenciaGlobal
          );
        }
      }
    }
    
    // Actualizar campos de ganancia si se proporcionan
    if (data.margenAgenciaGlobal !== undefined) {
      updateData.margenAgenciaGlobal = data.margenAgenciaGlobal;
    }
    if (data.montoGananciaAgencia !== undefined) {
      updateData.montoGananciaAgencia = data.montoGananciaAgencia;
    }

    // Crear snapshot del estado anterior
    const snapshotAnterior = await PresupuestoHistorialService.crearSnapshot(id);

    const presupuestoActualizado = await prisma.presupuesto.update({
      where: { id },
      data: updateData,
      include: {
        cliente: true,
        empresa: true,
        moneda: true,
        items: {
          include: {
            producto: true,
            servicio: true
          }
        },
        presupuestoImpuestos: {
          include: {
            impuesto: true
          }
        }
      }
    });
    
    // Registrar el cambio en el historial
    const snapshotNuevo = await PresupuestoHistorialService.crearSnapshot(id);
    if (snapshotAnterior && snapshotNuevo) {
      await PresupuestoHistorialService.registrarCambio({
        tipo: 'UPDATE',
        presupuestoId: id,
        usuarioId: userId,
        datosAnteriores: snapshotAnterior,
        datosNuevos: snapshotNuevo
      });
    }
    
    return this.transformPresupuesto(presupuestoActualizado);
  }
  
  static async updateEstado(id: number, estado: string, usuarioId?: number) {
    // Crear snapshot del estado anterior
    const snapshotAnterior = await PresupuestoHistorialService.crearSnapshot(id);

    return prisma.presupuesto.update({
      where: { id },
      data: { estado: estado as any }
    }).then(async (presupuestoActualizado) => {
      // Registrar el cambio de estado en el historial
      const snapshotNuevo = await PresupuestoHistorialService.crearSnapshot(id);
      if (snapshotAnterior && snapshotNuevo) {
        await PresupuestoHistorialService.registrarCambio({
          tipo: 'STATE_CHANGE',
          presupuestoId: id,
          usuarioId: usuarioId,
          motivoCambio: `Cambio de estado: ${snapshotAnterior.estado} → ${estado}`,
          datosAnteriores: snapshotAnterior,
          datosNuevos: snapshotNuevo
        });
      }
      
      return presupuestoActualizado;
    });
  }

  static async delete(id: number) {
    return prisma.presupuesto.delete({
      where: { id }
    });
  }

  static async findAll(clienteId?: number, estado?: string) {
    const where: any = {};
    if (clienteId) where.clienteId = clienteId;
    if (estado) where.estado = estado as any;

    const presupuestos = await prisma.presupuesto.findMany({
      where,
      include: {
        cliente: true,
        empresa: true,
        moneda: true,
        items: {
          include: {
            producto: true,
            servicio: true
          }
        },
        presupuestoImpuestos: {
          include: {
            impuesto: true
          }
        }
      }
    });
    
    return presupuestos.map(p => this.transformPresupuesto(p));
  }
}
