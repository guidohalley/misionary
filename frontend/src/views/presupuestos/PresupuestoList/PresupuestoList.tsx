import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Pagination, Select, Input, Notification, toast } from '@/components/ui';
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye, HiOutlineCheck, HiOutlineMail, HiOutlinePrinter } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePresupuesto } from '@/modules/presupuesto/hooks/usePresupuesto';
import { EstadoPresupuesto } from '../schemas';
import type { Presupuesto } from '@/modules/presupuesto/types';
import useAuth from '@/utils/hooks/useAuth';

interface PresupuestoListProps {
  className?: string;
}

const PresupuestoList: React.FC<PresupuestoListProps> = ({ className }) => {
  const navigate = useNavigate();
  const { presupuestos, loading, error, refreshPresupuestos, deletePresupuesto, updateEstado } = usePresupuesto();
  const { user } = useAuth();
  
  // Función para determinar si se puede editar un presupuesto
  const canEditPresupuesto = (estado: EstadoPresupuesto) => {
    const isAdmin = user?.authority?.includes('ADMIN');
    
    // BORRADOR: cualquier usuario puede editar
    if (estado === EstadoPresupuesto.BORRADOR) return true;
    
    // APROBADO: solo ADMIN puede editar
    if (estado === EstadoPresupuesto.APROBADO && isAdmin) return true;
    
    // FACTURADO: nadie puede editar
    return false;
  };
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState<EstadoPresupuesto | ''>('');
  const [filteredPresupuestos, setFilteredPresupuestos] = useState<Presupuesto[]>([]);

  useEffect(() => {
    refreshPresupuestos();
  }, [refreshPresupuestos]);

  useEffect(() => {
    let filtered = presupuestos.filter(presupuesto => {
      // Validación defensiva: verificar que cliente existe
      const clienteNombre = presupuesto.cliente?.nombre || '';
      return (
        clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        presupuesto.id.toString().includes(searchTerm)
      );
    });

    if (estadoFilter) {
      filtered = filtered.filter(presupuesto => presupuesto.estado === estadoFilter);
    }

    setFilteredPresupuestos(filtered);
    setCurrentPage(1);
  }, [presupuestos, searchTerm, estadoFilter]);

  const handleEdit = (id: number) => {
    navigate(`/presupuestos/edit/${id}`);
  };

  const handleView = (id: number) => {
    navigate(`/presupuestos/view/${id}`);
  };

  const handlePrint = (id: number) => {
    // Abrir una nueva ventana con el presupuesto para imprimir
    window.open(`/presupuestos/view/${id}`, '_blank');
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar este presupuesto?')) {
      try {
        await deletePresupuesto(id);
        toast.push(
          <Notification title="Éxito" type="success">
            Presupuesto eliminado correctamente
          </Notification>
        );
      } catch (error) {
        toast.push(
          <Notification title="Error" type="danger">
            Error al eliminar el presupuesto
          </Notification>
        );
      }
    }
  };

  const handleChangeEstado = async (id: number, nuevoEstado: EstadoPresupuesto) => {
    try {
      await updateEstado(id, nuevoEstado);
      toast.push(
        <Notification title="Éxito" type="success">
          Estado del presupuesto actualizado
        </Notification>
      );
    } catch (error) {
      toast.push(
        <Notification title="Error" type="danger">
          Error al cambiar el estado
        </Notification>
      );
    }
  };

  const handleNewPresupuesto = () => {
    navigate('/presupuestos/new');
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

  const totalItems = filteredPresupuestos.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentItems = filteredPresupuestos.slice(startIndex, endIndex);

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
        <Button onClick={() => refreshPresupuestos()} className="mt-4">
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Presupuestos</h2>
          <p className="text-gray-600 dark:text-gray-400">Gestiona los presupuestos de clientes</p>
        </div>
        <Button 
          variant="solid" 
          onClick={handleNewPresupuesto}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Nuevo Presupuesto
        </Button>
      </div>

      <Card className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Buscar por cliente o número..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <Select
              value={estadoFilter ? { value: estadoFilter, label: estadoFilter } : { value: '', label: 'Todos los estados' }}
              onChange={(opt: any) => setEstadoFilter(opt?.value || '')}
              options={[
                { value: '', label: 'Todos los estados' },
                { value: EstadoPresupuesto.BORRADOR, label: 'Borrador' },
                { value: EstadoPresupuesto.ENVIADO, label: 'Enviado' },
                { value: EstadoPresupuesto.APROBADO, label: 'Aprobado' },
                { value: EstadoPresupuesto.FACTURADO, label: 'Facturado' },
              ]}
            />
            <Select
              value={{ value: pageSize, label: `${pageSize} por página` }}
              onChange={(opt: any) => setPageSize(opt?.value || 10)}
              options={[
                { value: 10, label: '10 por página' },
                { value: 25, label: '25 por página' },
                { value: 50, label: '50 por página' },
              ]}
            />
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Mostrando {startIndex + 1}-{Math.min(endIndex, totalItems)} de {totalItems} presupuestos
          </div>
        </div>

        {/* Vista Desktop - Tabla */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">#</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Cliente</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Total</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Estado</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Fecha</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Vigencia</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((presupuesto, index) => {
                const nextEstado = getNextEstado(presupuesto.estado);
                return (
                  <motion.tr
                    key={presupuesto.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900 dark:text-gray-100">#{presupuesto.id}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900 dark:text-gray-100">{presupuesto.cliente.nombre}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{presupuesto.cliente.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-green-600 dark:text-green-400">
                        {formatPrice(presupuesto.total)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getEstadoBadge(presupuesto.estado)}>
                        {presupuesto.estado}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-600 dark:text-gray-400">
                        {new Date(presupuesto.createdAt).toLocaleDateString('es-AR')}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {presupuesto.periodoInicio ? (
                        <div className="text-gray-600 dark:text-gray-400">
                          {new Date(presupuesto.periodoInicio).toLocaleDateString('es-AR')} {presupuesto.periodoFin ? `→ ${new Date(presupuesto.periodoFin).toLocaleDateString('es-AR')}` : ''}
                        </div>
                      ) : (
                        <div className="text-gray-400 dark:text-gray-600">-</div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleView(presupuesto.id)}
                          className="p-2 rounded-full text-blue-600 dark:text-blue-300 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-700 hover:shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900/50 active:shadow-inner transition-all duration-200"
                          title="Ver presupuesto"
                        >
                          <HiOutlineEye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handlePrint(presupuesto.id)}
                          className="p-2 rounded-full text-gray-600 dark:text-gray-300 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-700 hover:shadow-lg hover:shadow-gray-200 dark:hover:shadow-gray-900/50 active:shadow-inner transition-all duration-200"
                          title="Imprimir presupuesto"
                        >
                          <HiOutlinePrinter className="w-5 h-5" />
                        </button>
                        {canEditPresupuesto(presupuesto.estado) && (
                          <button
                            onClick={() => handleEdit(presupuesto.id)}
                            className="p-2 rounded-full text-amber-600 dark:text-amber-300 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-700 hover:shadow-lg hover:shadow-amber-200 dark:hover:shadow-amber-900/50 active:shadow-inner transition-all duration-200"
                            title="Editar presupuesto"
                          >
                            <HiOutlinePencil className="w-5 h-5" />
                          </button>
                        )}
                        {nextEstado && (
                          <button
                            onClick={() => handleChangeEstado(presupuesto.id, nextEstado)}
                            className="p-2 rounded-full text-green-600 dark:text-green-300 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-700 hover:shadow-lg hover:shadow-green-200 dark:hover:shadow-green-900/50 active:shadow-inner transition-all duration-200"
                            title={`Cambiar a ${nextEstado}`}
                          >
                            {nextEstado === EstadoPresupuesto.ENVIADO ? <HiOutlineMail className="w-5 h-5" /> : <HiOutlineCheck className="w-5 h-5" />}
                          </button>
                        )}
                        {presupuesto.estado === EstadoPresupuesto.BORRADOR && (
                          <button
                            onClick={() => handleDelete(presupuesto.id)}
                            className="p-2 rounded-full text-red-600 dark:text-red-300 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-700 hover:shadow-lg hover:shadow-red-200 dark:hover:shadow-red-900/50 active:shadow-inner transition-all duration-200"
                            title="Eliminar presupuesto"
                          >
                            <HiOutlineTrash className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Vista Mobile - Cards */}
        <div className="md:hidden space-y-4">
          {currentItems.map((presupuesto, index) => {
            const nextEstado = getNextEstado(presupuesto.estado);
            return (
              <motion.div
                key={presupuesto.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Header con ID y Estado */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">#</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">#{presupuesto.id}</span>
                  </div>
                  <Badge className={getEstadoBadge(presupuesto.estado)}>
                    {presupuesto.estado}
                  </Badge>
                </div>

                {/* Cliente */}
                <div className="mb-3">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Cliente</div>
                  <div className="font-semibold text-gray-900 dark:text-white">{presupuesto.cliente.nombre}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{presupuesto.cliente.email}</div>
                </div>

                {/* Total */}
                <div className="mb-3">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total</div>
                  <div className="text-xl font-bold text-green-600 dark:text-green-400">
                    {formatPrice(presupuesto.total)}
                  </div>
                </div>

                {/* Fecha y Vigencia */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Fecha</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(presupuesto.createdAt).toLocaleDateString('es-AR')}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Vigencia</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {presupuesto.periodoInicio ? (
                        <>
                          {new Date(presupuesto.periodoInicio).toLocaleDateString('es-AR')}
                          {presupuesto.periodoFin && (
                            <><br />→ {new Date(presupuesto.periodoFin).toLocaleDateString('es-AR')}</>
                          )}
                        </>
                      ) : (
                        '-'
                      )}
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex justify-center space-x-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => handleView(presupuesto.id)}
                    className="p-2 rounded-full text-blue-600 dark:text-blue-300 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-700 hover:shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900/50 active:shadow-inner transition-all duration-200"
                    title="Ver presupuesto"
                  >
                    <HiOutlineEye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handlePrint(presupuesto.id)}
                    className="p-2 rounded-full text-gray-600 dark:text-gray-300 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-700 hover:shadow-lg hover:shadow-gray-200 dark:hover:shadow-gray-900/50 active:shadow-inner transition-all duration-200"
                    title="Imprimir presupuesto"
                  >
                    <HiOutlinePrinter className="w-5 h-5" />
                  </button>
                  {canEditPresupuesto(presupuesto.estado) && (
                    <button
                      onClick={() => handleEdit(presupuesto.id)}
                      className="p-2 rounded-full text-amber-600 dark:text-amber-300 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-700 hover:shadow-lg hover:shadow-amber-200 dark:hover:shadow-amber-900/50 active:shadow-inner transition-all duration-200"
                      title="Editar presupuesto"
                    >
                      <HiOutlinePencil className="w-5 h-5" />
                    </button>
                  )}
                  {nextEstado && (
                    <button
                      onClick={() => handleChangeEstado(presupuesto.id, nextEstado)}
                      className="p-2 rounded-full text-green-600 dark:text-green-300 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-700 hover:shadow-lg hover:shadow-green-200 dark:hover:shadow-green-900/50 active:shadow-inner transition-all duration-200"
                      title={`Cambiar a ${nextEstado}`}
                    >
                      {nextEstado === EstadoPresupuesto.ENVIADO ? <HiOutlineMail className="w-5 h-5" /> : <HiOutlineCheck className="w-5 h-5" />}
                    </button>
                  )}
                  {presupuesto.estado === EstadoPresupuesto.BORRADOR && (
                    <button
                      onClick={() => handleDelete(presupuesto.id)}
                      className="p-2 rounded-full text-red-600 dark:text-red-300 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-700 hover:shadow-lg hover:shadow-red-200 dark:hover:shadow-red-900/50 active:shadow-inner transition-all duration-200"
                      title="Eliminar presupuesto"
                    >
                      <HiOutlineTrash className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <Pagination
              pageSize={pageSize}
              currentPage={currentPage}
              total={totalItems}
              onChange={setCurrentPage}
            />
          </div>
        )}

        {currentItems.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">No se encontraron presupuestos</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PresupuestoList;
