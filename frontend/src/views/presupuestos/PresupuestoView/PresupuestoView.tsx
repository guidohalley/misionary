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
        className="max-w-4xl mx-auto print-container"
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

      {/* Items del Presupuesto */}
      <Card className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Items</h2>
        <div className="overflow-x-auto">
          <table className="w-full print-table">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Tipo</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Descripción</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Cantidad</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Precio Unit.</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {selectedPresupuesto.items.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    {item.productoId ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Producto
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Servicio
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">
                      {item.producto?.nombre || item.servicio?.nombre || 'N/A'}
                    </div>
                    {item.producto?.nombre && (
                      <div className="text-sm text-gray-600">{item.producto.nombre}</div>
                    )}
                    {item.servicio?.descripcion && (
                      <div className="text-sm text-gray-600">{item.servicio.descripcion}</div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {item.cantidad}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {formatPrice(item.precioUnitario)}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold">
                    {formatPrice(item.cantidad * item.precioUnitario)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Totales */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumen</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">{formatPrice(selectedPresupuesto.subtotal)}</span>
          </div>
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
