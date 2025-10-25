import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, Badge } from '@/components/ui';
import { HiOutlinePencil, HiOutlineArrowLeft, HiOutlineCheck, HiOutlineMail, HiOutlinePrinter } from 'react-icons/hi';
import { motion } from 'framer-motion';
import { usePresupuesto } from '@/modules/presupuesto/hooks/usePresupuesto';
import { EstadoPresupuesto } from '../schemas';
import useAuth from '@/utils/hooks/useAuth';

const PresupuestoView: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { selectedPresupuesto, loading, error, getPresupuesto, updateEstado } = usePresupuesto();
  const { user } = useAuth();

  // Determinar si el usuario puede editar este presupuesto
  const canEdit = () => {
    if (!selectedPresupuesto) return false;
    
    const isAdmin = user?.authority?.includes('ADMIN');
    const estado = selectedPresupuesto.estado;
    
    // BORRADOR: cualquier usuario puede editar
    if (estado === EstadoPresupuesto.BORRADOR) return true;
    
    // APROBADO: solo ADMIN puede editar
    if (estado === EstadoPresupuesto.APROBADO && isAdmin) return true;
    
    // FACTURADO: nadie puede editar
    return false;
  };

  useEffect(() => {
    if (id) {
      getPresupuesto(parseInt(id));
    }
  }, [id, getPresupuesto]);

  const handleEdit = () => {
    navigate(`/presupuestos/edit/${id}`);
  };

  const handleBack = () => {
    navigate('/presupuestos');
  };

  const handleChangeEstado = async (nuevoEstado: EstadoPresupuesto) => {
    if (id) {
      try {
        await updateEstado(parseInt(id), nuevoEstado);
      } catch (error) {
        console.error('Error updating estado:', error);
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getEstadoBadge = (estado: EstadoPresupuesto) => {
    const variants = {
      [EstadoPresupuesto.BORRADOR]: 'bg-gray-100 text-gray-800',
      [EstadoPresupuesto.ENVIADO]: 'bg-blue-100 text-blue-800',
      [EstadoPresupuesto.APROBADO]: 'bg-green-100 text-green-800',
      [EstadoPresupuesto.FACTURADO]: 'bg-purple-100 text-purple-800',
    };
    return variants[estado] || 'bg-gray-100 text-gray-800';
  };

  const getNextEstado = (estadoActual: EstadoPresupuesto): EstadoPresupuesto | null => {
    const flow = {
      [EstadoPresupuesto.BORRADOR]: EstadoPresupuesto.ENVIADO,
      [EstadoPresupuesto.ENVIADO]: EstadoPresupuesto.APROBADO,
      [EstadoPresupuesto.APROBADO]: EstadoPresupuesto.FACTURADO,
      [EstadoPresupuesto.FACTURADO]: null,
    };
    return flow[estadoActual] || null;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error: {error}</p>
        <Button onClick={handleBack} className="mt-4">
          Volver a Presupuestos
        </Button>
      </div>
    );
  }

  if (!selectedPresupuesto) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Presupuesto no encontrado</p>
        <Button onClick={handleBack} className="mt-4">
          Volver a Presupuestos
        </Button>
      </div>
    );
  }

  const nextEstado = getNextEstado(selectedPresupuesto.estado);

  return (
    <>
      {/* Estilos para impresión */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          .print-container {
            max-width: none !important;
            margin: 0 !important;
          }
          
          .print-header {
            border-bottom: 2px solid #000;
            padding-bottom: 20px;
            margin-bottom: 20px;
          }
          
          .print-table {
            width: 100%;
            border-collapse: collapse;
          }
          
          .print-table th,
          .print-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          
          .print-table th {
            background-color: #f5f5f5;
            font-weight: bold;
          }
          
          .print-total {
            border-top: 2px solid #000;
            padding-top: 10px;
            margin-top: 20px;
            font-size: 18px;
            font-weight: bold;
          }
        }
      `}</style>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-[98%] sm:max-w-[95%] md:max-w-4xl mx-auto print-container"
      >
      {/* Header */}
      <div className="mb-6 flex justify-between items-start print-header">
        <div className="flex items-center space-x-4">
          <Button
            variant="plain"
            icon={<HiOutlineArrowLeft />}
            onClick={handleBack}
            className="no-print"
          >
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Presupuesto #{selectedPresupuesto.id}
            </h1>
            <p className="text-gray-600 mt-1">
              {new Date(selectedPresupuesto.createdAt).toLocaleDateString('es-AR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3 no-print">
          <Badge className={getEstadoBadge(selectedPresupuesto.estado)}>
            {selectedPresupuesto.estado}
          </Badge>
          <Button
            variant="twoTone"
            icon={<HiOutlinePrinter />}
            onClick={handlePrint}
            className="bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
          >
            Imprimir
          </Button>
          {canEdit() && (
            <Button
              variant="twoTone"
              icon={<HiOutlinePencil />}
              onClick={handleEdit}
            >
              Editar
            </Button>
          )}
          {nextEstado && (
            <Button
              variant="solid"
              icon={nextEstado === EstadoPresupuesto.ENVIADO ? <HiOutlineMail /> : <HiOutlineCheck />}
              onClick={() => handleChangeEstado(nextEstado)}
              className="bg-green-600 hover:bg-green-700"
            >
              {nextEstado === EstadoPresupuesto.ENVIADO ? 'Enviar' : 
               nextEstado === EstadoPresupuesto.APROBADO ? 'Aprobar' : 
               'Facturar'}
            </Button>
          )}
        </div>
      </div>

      {/* Información del Cliente */}
      <Card className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Cliente</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Nombre</p>
            <p className="font-medium">{selectedPresupuesto.cliente.nombre}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Email</p>
            <p className="font-medium">{selectedPresupuesto.cliente.email}</p>
          </div>
          {selectedPresupuesto.cliente.telefono && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Teléfono</p>
              <p className="font-medium">{selectedPresupuesto.cliente.telefono}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Productos */}
      {(() => {
        const productos = selectedPresupuesto.items.filter(item => item.productoId);
        if (productos.length === 0) return null;
        
        return (
      <Card className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                Productos
              </span>
            </h2>
            {/* Vista Desktop - Tabla */}
            <div className="hidden md:block overflow-x-auto">
          <table className="w-full print-table">
            <thead>
                  <tr className="border-b border-gray-200 bg-blue-50 dark:bg-blue-900/10">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Descripción</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Cantidad</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Costo</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Margen %</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Precio Unit.</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Ganancia</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Subtotal</th>
              </tr>
            </thead>
            <tbody>
                  {productos.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">
                          {item.producto?.nombre || 'N/A'}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {item.cantidad}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {formatPrice(Number(item.producto?.costoProveedor || 0))}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {Number(item.producto?.margenAgencia || 0).toFixed(2)}%
                      </td>
                      <td className="py-3 px-4 text-right">
                        {formatPrice(item.precioUnitario)}
                      </td>
                      <td className="py-3 px-4 text-right text-yellow-700 dark:text-yellow-400 font-medium">
                        {(() => {
                          const costo = Number(item.producto?.costoProveedor || 0);
                          const ganancia = (item.precioUnitario - costo) * item.cantidad;
                          return formatPrice(ganancia);
                        })()}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold">
                        {formatPrice(item.cantidad * item.precioUnitario)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Vista Mobile - Cards */}
            <div className="md:hidden space-y-3">
              {productos.map((item, index) => {
                const costo = Number(item.producto?.costoProveedor || 0);
                const ganancia = (item.precioUnitario - costo) * item.cantidad;
                return (
                  <div key={index} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-3">
                    <div className="font-medium text-gray-900 dark:text-white mb-2">
                      {item.producto?.nombre || 'N/A'}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Cantidad:</span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-white">{item.cantidad}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Costo:</span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-white">{formatPrice(costo)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Margen:</span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-white">{Number(item.producto?.margenAgencia || 0).toFixed(2)}%</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">P. Unit.:</span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-white">{formatPrice(item.precioUnitario)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Ganancia:</span>
                        <span className="ml-2 font-medium text-yellow-700 dark:text-yellow-400">{formatPrice(ganancia)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Subtotal:</span>
                        <span className="ml-2 font-bold text-gray-900 dark:text-white">{formatPrice(item.cantidad * item.precioUnitario)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Resumen de Productos */}
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-400">
                    Subtotal Productos:
                  </span>
                  <span className="font-bold text-blue-700 dark:text-blue-400">
                    {(() => {
                      const subtotal = productos.reduce((sum, item) => sum + (item.cantidad * item.precioUnitario), 0);
                      return formatPrice(subtotal);
                    })()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-yellow-800 dark:text-yellow-400">
                    Ganancia Productos:
                  </span>
                  <span className="font-bold text-yellow-700 dark:text-yellow-400">
                    {(() => {
                      const ganancia = productos.reduce((sum, item) => {
                        const costo = Number(item.producto?.costoProveedor || 0);
                        return sum + ((item.precioUnitario - costo) * item.cantidad);
                      }, 0);
                      return formatPrice(ganancia);
                    })()}
                      </span>
                </div>
              </div>
            </div>
          </Card>
        );
      })()}

      {/* Servicios */}
      {(() => {
        const servicios = selectedPresupuesto.items.filter(item => item.servicioId);
        if (servicios.length === 0) return null;
        
        return (
          <Card className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Servicios
                      </span>
            </h2>
            {/* Vista Desktop - Tabla */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full print-table">
                <thead>
                  <tr className="border-b border-gray-200 bg-green-50 dark:bg-green-900/10">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Descripción</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Cantidad</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Costo</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Margen %</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Precio Unit.</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Ganancia</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {servicios.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">
                          {item.servicio?.nombre || 'N/A'}
                    </div>
                    {item.servicio?.descripcion && (
                      <div className="text-sm text-gray-600">{item.servicio.descripcion}</div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {item.cantidad}
                  </td>
                      <td className="py-3 px-4 text-right">
                        {formatPrice(Number(item.servicio?.costoProveedor || 0))}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {Number(item.servicio?.margenAgencia || 0).toFixed(2)}%
                      </td>
                  <td className="py-3 px-4 text-right">
                    {formatPrice(item.precioUnitario)}
                  </td>
                      <td className="py-3 px-4 text-right text-yellow-700 dark:text-yellow-400 font-medium">
                        {(() => {
                          const costo = Number(item.servicio?.costoProveedor || 0);
                          const ganancia = (item.precioUnitario - costo) * item.cantidad;
                          return formatPrice(ganancia);
                        })()}
                      </td>
                  <td className="py-3 px-4 text-right font-semibold">
                    {formatPrice(item.cantidad * item.precioUnitario)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

            {/* Vista Mobile - Cards */}
            <div className="md:hidden space-y-3">
              {servicios.map((item, index) => {
                const costo = Number(item.servicio?.costoProveedor || 0);
                const ganancia = (item.precioUnitario - costo) * item.cantidad;
                return (
                  <div key={index} className="bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 p-3">
                    <div className="font-medium text-gray-900 dark:text-white mb-1">
                      {item.servicio?.nombre || 'N/A'}
                    </div>
                    {item.servicio?.descripcion && (
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.servicio.descripcion}</div>
                    )}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Cantidad:</span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-white">{item.cantidad}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Costo:</span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-white">{formatPrice(costo)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Margen:</span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-white">{Number(item.servicio?.margenAgencia || 0).toFixed(2)}%</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">P. Unit.:</span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-white">{formatPrice(item.precioUnitario)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Ganancia:</span>
                        <span className="ml-2 font-medium text-yellow-700 dark:text-yellow-400">{formatPrice(ganancia)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Subtotal:</span>
                        <span className="ml-2 font-bold text-gray-900 dark:text-white">{formatPrice(item.cantidad * item.precioUnitario)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Resumen de Servicios */}
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-green-800 dark:text-green-400">
                    Subtotal Servicios:
                  </span>
                  <span className="font-bold text-green-700 dark:text-green-400">
                    {(() => {
                      const subtotal = servicios.reduce((sum, item) => sum + (item.cantidad * item.precioUnitario), 0);
                      return formatPrice(subtotal);
                    })()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-yellow-800 dark:text-yellow-400">
                    Ganancia Servicios:
                  </span>
                  <span className="font-bold text-yellow-700 dark:text-yellow-400">
                    {(() => {
                      const ganancia = servicios.reduce((sum, item) => {
                        const costo = Number(item.servicio?.costoProveedor || 0);
                        return sum + ((item.precioUnitario - costo) * item.cantidad);
                      }, 0);
                      return formatPrice(ganancia);
                    })()}
                  </span>
                </div>
              </div>
            </div>
      </Card>
        );
      })()}

      {/* Impuestos Aplicados */}
      {selectedPresupuesto.presupuestoImpuestos && selectedPresupuesto.presupuestoImpuestos.length > 0 && (
        <Card className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
              Impuestos Aplicados
            </span>
          </h2>
          <div className="space-y-3">
            {selectedPresupuesto.presupuestoImpuestos.map((presupuestoImpuesto, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-purple-800 dark:text-purple-400">
                    {presupuestoImpuesto.impuesto?.nombre || 'Impuesto'}
                  </span>
                  <span className="text-xs text-purple-600 dark:text-purple-300">
                    ({Number(presupuestoImpuesto.impuesto?.porcentaje || 0).toFixed(2)}%)
                  </span>
                </div>
                <span className="font-bold text-purple-700 dark:text-purple-300">
                  {formatPrice(Number(presupuestoImpuesto.monto || 0))}
                </span>
              </div>
            ))}
            
            {/* Resumen de Impuestos */}
            <div className="mt-4 p-4 bg-purple-100 dark:bg-purple-900/30 border-l-4 border-purple-500 rounded">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-purple-800 dark:text-purple-400">
                  Total Impuestos:
                </span>
                <span className="text-lg font-bold text-purple-700 dark:text-purple-300">
                  {formatPrice(Number(selectedPresupuesto.impuestos))}
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Totales */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumen</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">{formatPrice(selectedPresupuesto.subtotal)}</span>
          </div>
          
          {/* Ganancia de Agencia Global */}
          {(() => {
            // El backend devuelve montoGananciaAgencia
            let montoGanancia = (selectedPresupuesto as any).montoGananciaAgencia || selectedPresupuesto.montoGanancia;
            
            // Si no hay monto pero sí hay porcentaje, calcular automáticamente
            if (!montoGanancia && selectedPresupuesto.margenAgenciaGlobal) {
              const margen = Number(selectedPresupuesto.margenAgenciaGlobal);
              const subtotal = Number(selectedPresupuesto.subtotal);
              montoGanancia = (subtotal * margen) / 100;
            }
            
            const montoGananciaNum = Number(montoGanancia);
            
            if (montoGananciaNum > 0) {
              return (
                <div className="flex justify-between border-l-4 border-yellow-500 pl-2 bg-yellow-50 dark:bg-yellow-900/20 py-2 my-2 rounded">
                  <span className="text-sm font-medium text-yellow-800 dark:text-yellow-400">
                    Ganancia Agencia Global {selectedPresupuesto.margenAgenciaGlobal ? `(${Number(selectedPresupuesto.margenAgenciaGlobal).toFixed(2)}%)` : ''}:
                  </span>
                  <span className="font-bold text-yellow-700 dark:text-yellow-400">{formatPrice(montoGananciaNum)}</span>
                </div>
              );
            }
            return null;
          })()}
          
          <div className="flex justify-between">
            <span className="text-gray-600">IVA (21%):</span>
            <span className="font-medium">{formatPrice(selectedPresupuesto.impuestos)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold border-t pt-2 print-total">
            <span>Total:</span>
            <span className="text-green-600">{formatPrice(selectedPresupuesto.total)}</span>
          </div>
        </div>
      </Card>
    </motion.div>
    </>
  );
};

export default PresupuestoView;
