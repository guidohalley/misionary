import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Pagination, Select, Input, Notification, toast, Tooltip } from '@/components/ui';
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye, HiLockClosed, HiChevronDown, HiChevronUp } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useServicio } from '@/modules/servicio/hooks/useServicio';
import type { Servicio } from '@/modules/servicio/types';
import { useAuth } from '@/contexts/AuthContext';
import { 
  canEditProductoServicio, 
  canDeleteProductoServicio, 
  canViewPrecios,
  getNoEditTooltip,
  getNoDeleteTooltip,
  getErrorMessage
} from '@/utils/permissions';

interface ServicioListProps {
  className?: string;
}

const ServicioList: React.FC<ServicioListProps> = ({ className }) => {
  const navigate = useNavigate();
  const { servicios, loading, error, refreshServicios, deleteServicio } = useServicio();
  const { user: currentUser } = useAuth();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredServicios, setFilteredServicios] = useState<Servicio[]>([]);
  const [expandedCostos, setExpandedCostos] = useState<Set<number>>(new Set());

  const toggleCosto = (servicioId: number) => {
    setExpandedCostos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(servicioId)) {
        newSet.delete(servicioId);
      } else {
        newSet.add(servicioId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    refreshServicios();
  }, [refreshServicios]);

  useEffect(() => {
    const filtered = servicios.filter(servicio =>
      servicio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      servicio.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      servicio.proveedor?.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredServicios(filtered);
    setCurrentPage(1);
  }, [servicios, searchTerm]);

  const handleEdit = (servicio: Servicio) => {
    // Validar permisos antes de navegar
    if (!canEditProductoServicio(currentUser, servicio.proveedorId)) {
      toast.push(
        <Notification title="Sin permisos" type="danger">
          {getNoEditTooltip(currentUser)}
        </Notification>
      );
      return;
    }
    navigate(`/servicios/edit/${servicio.id}`);
  };

  const handleDelete = async (servicio: Servicio) => {
    // Validar permisos antes de eliminar
    if (!canDeleteProductoServicio(currentUser, servicio.proveedorId)) {
      toast.push(
        <Notification title="Sin permisos" type="danger">
          {getNoDeleteTooltip(currentUser)}
        </Notification>
      );
      return;
    }

    if (window.confirm('¿Está seguro de que desea eliminar este servicio?')) {
      try {
        await deleteServicio(servicio.id);
        toast.push(
          <Notification title="Éxito" type="success">
            Servicio eliminado correctamente
          </Notification>
        );
      } catch (error: any) {
        const errorMessage = getErrorMessage(error);
        toast.push(
          <Notification title="Error" type="danger">
            {errorMessage}
          </Notification>
        );
      }
    }
  };

  const handleNewServicio = () => {
    navigate('/servicios/new');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  const totalItems = filteredServicios.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentItems = filteredServicios.slice(startIndex, endIndex);

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
        <Button onClick={() => refreshServicios()} className="mt-4">
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Servicios</h2>
          <p className="text-gray-600 dark:text-gray-400">Gestiona el catálogo de servicios</p>
        </div>
        <Button 
          variant="solid" 
          onClick={handleNewServicio}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Nuevo Servicio
        </Button>
      </div>

      <Card className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Buscar servicios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <Select
              value={pageSize}
              onChange={setPageSize}
              options={[
                { value: 10, label: '10 por página' },
                { value: 25, label: '25 por página' },
                { value: 50, label: '50 por página' },
              ]}
            />
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Mostrando {startIndex + 1}-{Math.min(endIndex, totalItems)} de {totalItems} servicios
          </div>
        </div>

        {/* Vista Desktop - Tabla */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Nombre</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Descripción</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                  {(currentUser?.roles?.includes('ADMIN') || currentUser?.roles?.includes('CONTADOR'))
                    ? 'Precio Final' 
                    : 'Precio'}
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Proveedor</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Fecha Creación</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 min-w-[120px]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((servicio, index) => (
                <motion.tr
                  key={servicio.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900 dark:text-gray-100">{servicio.nombre}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-gray-600 dark:text-gray-400 max-w-xs truncate" title={servicio.descripcion}>
                      {servicio.descripcion}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {(() => {
                      const puedeVerPrecios = canViewPrecios(currentUser, servicio.proveedorId);
                      const esPropio = currentUser?.id === servicio.proveedorId;
                      const esAdmin = currentUser?.roles?.includes('ADMIN');
                      const esContador = currentUser?.roles?.includes('CONTADOR');
                      const isExpanded = expandedCostos.has(servicio.id);
                      
                      if (!puedeVerPrecios) {
                        return (
                          <Badge className="bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                            —
                          </Badge>
                        );
                      }

                      // ADMIN ve precio final con botón para expandir costo
                      if (esAdmin) {
                        return (
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1">
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
                                {formatPrice(servicio.precio)}
                              </Badge>
                              <Tooltip title={isExpanded ? "Ocultar costo" : "Ver costo del proveedor"}>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleCosto(servicio.id);
                                  }}
                                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                  {isExpanded ? (
                                    <HiChevronUp className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                                  ) : (
                                    <HiChevronDown className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                                  )}
                                </button>
                              </Tooltip>
                            </div>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                              >
                                <Badge className="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                  Costo: {formatPrice(servicio.costoProveedor)}
                                </Badge>
                              </motion.div>
                            )}
                          </div>
                        );
                      }

                      // CONTADOR ve precio final
                      if (esContador) {
                        return (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
                            {formatPrice(servicio.precio)}
                          </Badge>
                        );
                      }

                      // PROVEEDOR ve su costo
                      return (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
                          {formatPrice(servicio.costoProveedor)}
                        </Badge>
                      );
                    })()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-gray-900 dark:text-gray-100">{servicio.proveedor?.nombre || 'Sin proveedor'}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-gray-600 dark:text-gray-400">
                      {new Date(servicio.createdAt).toLocaleDateString('es-AR')}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center items-center gap-2">
                      {(() => {
                        const puedeEditar = canEditProductoServicio(currentUser, servicio.proveedorId);
                        const puedeEliminar = canDeleteProductoServicio(currentUser, servicio.proveedorId);
                        
                        return (
                          <>
                            <Tooltip title={puedeEditar ? "Ver/Editar" : getNoEditTooltip(currentUser)}>
                              <span>
                                <button
                                  onClick={() => handleEdit(servicio)}
                                  disabled={!puedeEditar}
                                  className={`p-2 rounded-full transition-all duration-200 ${
                                    puedeEditar
                                      ? 'text-gray-700 dark:text-blue-300 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-700 hover:shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900/50 active:shadow-inner cursor-pointer'
                                      : 'text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-50'
                                  }`}
                                >
                                  <HiOutlineEye className="w-5 h-5" />
                                </button>
                              </span>
                            </Tooltip>
                            
                            <Tooltip title={puedeEditar ? "Editar" : getNoEditTooltip(currentUser)}>
                              <span>
                                <button
                                  onClick={() => handleEdit(servicio)}
                                  disabled={!puedeEditar}
                                  className={`p-2 rounded-full transition-all duration-200 ${
                                    puedeEditar
                                      ? 'text-gray-700 dark:text-amber-300 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-700 hover:shadow-lg hover:shadow-amber-200 dark:hover:shadow-amber-900/50 active:shadow-inner cursor-pointer'
                                      : 'text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-50'
                                  }`}
                                >
                                  <HiOutlinePencil className="w-5 h-5" />
                                </button>
                              </span>
                            </Tooltip>
                            
                            <Tooltip title={puedeEliminar ? "Eliminar" : getNoDeleteTooltip(currentUser)}>
                              <span>
                                <button
                                  onClick={() => handleDelete(servicio)}
                                  disabled={!puedeEliminar}
                                  className={`p-2 rounded-full transition-all duration-200 ${
                                    puedeEliminar
                                      ? 'text-gray-700 dark:text-red-300 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-700 hover:shadow-lg hover:shadow-red-200 dark:hover:shadow-red-900/50 active:shadow-inner cursor-pointer'
                                      : 'text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-50'
                                  }`}
                                >
                                  <HiOutlineTrash className="w-5 h-5" />
                                </button>
                              </span>
                            </Tooltip>
                            
                            {!puedeEditar && (
                              <Tooltip title="Servicio de otro proveedor">
                                <span>
                                  <HiLockClosed className="w-4 h-4 text-gray-400" />
                                </span>
                              </Tooltip>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Vista Mobile - Cards */}
        <div className="md:hidden space-y-4">
          {currentItems.map((servicio, index) => {
            const puedeVerPrecios = canViewPrecios(currentUser, servicio.proveedorId);
            const esAdmin = currentUser?.roles?.includes('ADMIN');
            const esContador = currentUser?.roles?.includes('CONTADOR');
            const isExpanded = expandedCostos.has(servicio.id);
            const puedeEditar = canEditProductoServicio(currentUser, servicio.proveedorId);
            const puedeEliminar = canDeleteProductoServicio(currentUser, servicio.proveedorId);

            return (
              <motion.div
                key={servicio.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Header con Nombre */}
                <div className="mb-3">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{servicio.nombre}</div>
                </div>

                {/* Descripción */}
                <div className="mb-3">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Descripción</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{servicio.descripcion}</div>
                </div>

                {/* Precio */}
                <div className="mb-3">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    {(currentUser?.roles?.includes('ADMIN') || currentUser?.roles?.includes('CONTADOR'))
                      ? 'Precio Final' 
                      : 'Precio'}
                  </div>
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    {(() => {
                      if (!puedeVerPrecios) {
                        return (
                          <Badge className="bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                            —
                          </Badge>
                        );
                      }

                      if (esAdmin) {
                        return (
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
                                {formatPrice(servicio.precio)}
                              </Badge>
                              <button
                                onClick={() => toggleCosto(servicio.id)}
                                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                              >
                                {isExpanded ? (
                                  <HiChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                ) : (
                                  <HiChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                )}
                              </button>
                            </div>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                              >
                                <Badge className="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                  Costo: {formatPrice(servicio.costoProveedor)}
                                </Badge>
                              </motion.div>
                            )}
                          </div>
                        );
                      }

                      if (esContador) {
                        return (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
                            {formatPrice(servicio.precio)}
                          </Badge>
                        );
                      }

                      return (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
                          {formatPrice(servicio.costoProveedor)}
                        </Badge>
                      );
                    })()}
                  </div>
                </div>

                {/* Proveedor y Fecha */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Proveedor</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {servicio.proveedor?.nombre || 'Sin proveedor'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Fecha Creación</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(servicio.createdAt).toLocaleDateString('es-AR')}
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex justify-center space-x-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <Tooltip title={puedeEditar ? "Ver/Editar" : getNoEditTooltip(currentUser)}>
                    <span>
                      <button
                        onClick={() => handleEdit(servicio)}
                        disabled={!puedeEditar}
                        className={`p-2 rounded-full transition-all duration-200 ${
                          puedeEditar
                            ? 'text-gray-700 dark:text-blue-300 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-700 hover:shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900/50 active:shadow-inner cursor-pointer'
                            : 'text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-50'
                        }`}
                      >
                        <HiOutlineEye className="w-5 h-5" />
                      </button>
                    </span>
                  </Tooltip>
                  
                  <Tooltip title={puedeEditar ? "Editar" : getNoEditTooltip(currentUser)}>
                    <span>
                      <button
                        onClick={() => handleEdit(servicio)}
                        disabled={!puedeEditar}
                        className={`p-2 rounded-full transition-all duration-200 ${
                          puedeEditar
                            ? 'text-amber-600 dark:text-amber-300 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-700 hover:shadow-lg hover:shadow-amber-200 dark:hover:shadow-amber-900/50 active:shadow-inner cursor-pointer'
                            : 'text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-50'
                        }`}
                      >
                        <HiOutlinePencil className="w-5 h-5" />
                      </button>
                    </span>
                  </Tooltip>
                  
                  <Tooltip title={puedeEliminar ? "Eliminar" : getNoDeleteTooltip(currentUser)}>
                    <span>
                      <button
                        onClick={() => handleDelete(servicio)}
                        disabled={!puedeEliminar}
                        className={`p-2 rounded-full transition-all duration-200 ${
                          puedeEliminar
                            ? 'text-red-600 dark:text-red-300 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-700 hover:shadow-lg hover:shadow-red-200 dark:hover:shadow-red-900/50 active:shadow-inner cursor-pointer'
                            : 'text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-50'
                        }`}
                      >
                        <HiOutlineTrash className="w-5 h-5" />
                      </button>
                    </span>
                  </Tooltip>
                  
                  {!puedeEditar && (
                    <Tooltip title="Servicio de otro proveedor">
                      <span>
                        <HiLockClosed className="w-4 h-4 text-gray-400" />
                      </span>
                    </Tooltip>
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
            <p className="text-gray-600 dark:text-gray-400">No se encontraron servicios</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ServicioList;
