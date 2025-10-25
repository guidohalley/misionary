import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Pagination, Select, Input, Notification, toast } from '@/components/ui';
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye, HiOutlineCheck, HiOutlineMail, HiOutlinePrinter, HiOutlineFilter, HiOutlineViewBoards } from 'react-icons/hi';
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
  const [minTotal, setMinTotal] = useState<number | ''>('');
  const [maxTotal, setMaxTotal] = useState<number | ''>('');
  const [clienteFilter, setClienteFilter] = useState<number | ''>('');
  const [groupByCliente, setGroupByCliente] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  useEffect(() => {
    refreshPresupuestos();
  }, [refreshPresupuestos]);

  useEffect(() => {
    let filtered = presupuestos.filter(presupuesto => {
      // Validación defensiva: verificar que cliente existe
      const clienteNombre = presupuesto.cliente?.nombre || '';
      const matchesSearch = (
        clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      presupuesto.id.toString().includes(searchTerm)
    );

      // Filtro por estado
      const matchesEstado = !estadoFilter || presupuesto.estado === estadoFilter;

      // Filtro por cliente
      const matchesCliente = !clienteFilter || presupuesto.clienteId === clienteFilter;

      // Filtro por rango de totales
      const matchesMinTotal = minTotal === '' || presupuesto.total >= minTotal;
      const matchesMaxTotal = maxTotal === '' || presupuesto.total <= maxTotal;

      return matchesSearch && matchesEstado && matchesCliente && matchesMinTotal && matchesMaxTotal;
    });

    setFilteredPresupuestos(filtered);
    setCurrentPage(1);
  }, [presupuestos, searchTerm, estadoFilter, clienteFilter, minTotal, maxTotal]);

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

  // Obtener clientes únicos para el selector
  const uniqueClientes = Array.from(
    new Map(presupuestos.map(p => [p.clienteId, { id: p.clienteId, nombre: p.cliente.nombre }])).values()
  );

  // Agrupar por cliente si está activado
  const groupedPresupuestos = groupByCliente 
    ? filteredPresupuestos.reduce((groups, presupuesto) => {
        const clienteId = presupuesto.clienteId;
        if (!groups[clienteId]) {
          groups[clienteId] = {
            cliente: presupuesto.cliente,
            presupuestos: [],
            totalGeneral: 0
          };
        }
        groups[clienteId].presupuestos.push(presupuesto);
        groups[clienteId].totalGeneral += presupuesto.total;
        return groups;
      }, {} as Record<number, { cliente: any; presupuestos: Presupuesto[]; totalGeneral: number }>)
    : null;

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
      {/* Header Card */}
      <Card className="mb-6 p-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Presupuestos</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Gestiona los presupuestos de clientes</p>
        </div>
        <Button 
          variant="solid" 
          onClick={handleNewPresupuesto}
            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
        >
          Nuevo Presupuesto
        </Button>
      </div>
      </Card>

      <Card className="mb-6">
        {/* Filtros básicos */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-1">
            <Input
              placeholder="Buscar por cliente o número..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64"
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
              className="w-full sm:w-auto"
            />
            <Select
              value={{ value: pageSize, label: `${pageSize} por página` }}
              onChange={(opt: any) => setPageSize(opt?.value || 10)}
              options={[
                { value: 10, label: '10 por página' },
                { value: 25, label: '25 por página' },
                { value: 50, label: '50 por página' },
              ]}
              className="w-full sm:w-auto"
            />
            <Button
              variant="plain"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              icon={<HiOutlineFilter />}
              className="w-full sm:w-auto"
            >
              {showAdvancedFilters ? 'Ocultar' : 'Más filtros'}
            </Button>
            <Button
              variant={groupByCliente ? 'solid' : 'plain'}
              size="sm"
              onClick={() => setGroupByCliente(!groupByCliente)}
              icon={<HiOutlineViewBoards />}
              className="w-full sm:w-auto"
            >
              Agrupar
            </Button>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 text-center sm:text-right">
            Mostrando {startIndex + 1}-{Math.min(endIndex, totalItems)} de {totalItems} presupuestos
          </div>
        </div>

        {/* Filtros avanzados */}
        {showAdvancedFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cliente específico
                </label>
                <Select
                  value={clienteFilter ? { value: clienteFilter, label: uniqueClientes.find(c => c.id === clienteFilter)?.nombre || '' } : { value: '', label: 'Todos los clientes' }}
                  onChange={(opt: any) => setClienteFilter(opt?.value || '')}
                  options={[
                    { value: '', label: 'Todos los clientes' },
                    ...uniqueClientes.map(c => ({ value: c.id, label: c.nombre }))
                  ]}
                  isSearchable={true}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Total mínimo
                </label>
                <Input
                  type="number"
                  placeholder="$ 0"
                  value={minTotal}
                  onChange={(e) => setMinTotal(e.target.value ? Number(e.target.value) : '')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Total máximo
                </label>
                <Input
                  type="number"
                  placeholder="$ 999999"
                  value={maxTotal}
                  onChange={(e) => setMaxTotal(e.target.value ? Number(e.target.value) : '')}
                />
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <Button
                variant="plain"
                size="sm"
                onClick={() => {
                  setClienteFilter('');
                  setMinTotal('');
                  setMaxTotal('');
                }}
              >
                Limpiar filtros avanzados
              </Button>
            </div>
          </motion.div>
        )}

        {/* Vista agrupada por cliente */}
        {groupByCliente && groupedPresupuestos && (
          <div className="space-y-4 mb-6">
            {Object.values(groupedPresupuestos).map((group, groupIndex) => (
              <motion.div
                key={group.cliente.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: groupIndex * 0.1 }}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                {/* Header del grupo */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{group.cliente.nombre}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{group.cliente.email}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total acumulado</div>
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {formatPrice(group.totalGeneral)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-500">
                        {group.presupuestos.length} presupuesto{group.presupuestos.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Listado de presupuestos del grupo */}
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {group.presupuestos.map((presupuesto) => {
                    const nextEstado = getNextEstado(presupuesto.estado);
                    return (
                      <div key={presupuesto.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-semibold text-gray-900 dark:text-white">#{presupuesto.id}</span>
                              <Badge className={getEstadoBadge(presupuesto.estado)}>
                                {presupuesto.estado}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                              <span>
                                Total: <span className="font-semibold text-green-600 dark:text-green-400">{formatPrice(presupuesto.total)}</span>
                              </span>
                              <span>
                                Fecha: {new Date(presupuesto.createdAt).toLocaleDateString('es-AR')}
                              </span>
                              {presupuesto.periodoInicio && (
                                <span>
                                  Vigencia: {new Date(presupuesto.periodoInicio).toLocaleDateString('es-AR')}
                                  {presupuesto.periodoFin && ` → ${new Date(presupuesto.periodoFin).toLocaleDateString('es-AR')}`}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleView(presupuesto.id)}
                              className="p-2 rounded-full text-blue-600 dark:text-blue-300 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-700 hover:shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900/50 active:shadow-inner transition-all duration-200"
                              title="Ver presupuesto"
                            >
                              <HiOutlineEye className="w-5 h-5" />
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
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Vista Desktop - Tabla */}
        {!groupByCliente && (
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
        )}

        {/* Vista Mobile - Cards */}
        {!groupByCliente && (
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
        )}

        {totalPages > 1 && !groupByCliente && (
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
