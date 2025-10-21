import React, { useState, useEffect } from 'react';
import { Card, Button, Pagination, Select, Input, Notification, toast, Tooltip } from '@/components/ui';
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye, HiLockClosed, HiChevronDown, HiChevronUp } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProducto } from '@/modules/producto/hooks/useProducto';
import type { Producto } from '@/modules/producto/types';
import { useAuth } from '@/contexts/AuthContext';
import { 
  canEditProductoServicio, 
  canDeleteProductoServicio, 
  canViewPrecios,
  getNoEditTooltip,
  getNoDeleteTooltip,
  getErrorMessage
} from '@/utils/permissions';

interface ProductoListProps {
  className?: string;
}

const ProductoList: React.FC<ProductoListProps> = ({ className }) => {
  const navigate = useNavigate();
  const { productos, loading, error, refreshProductos, deleteProducto } = useProducto();
  const { user: currentUser } = useAuth();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProductos, setFilteredProductos] = useState<Producto[]>([]);
  const [expandedCostos, setExpandedCostos] = useState<Set<number>>(new Set());

  const toggleCosto = (productoId: number) => {
    setExpandedCostos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productoId)) {
        newSet.delete(productoId);
      } else {
        newSet.add(productoId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    refreshProductos();
  }, [refreshProductos]);

  useEffect(() => {
    const filtered = productos.filter(producto =>
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.proveedor?.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProductos(filtered);
    setCurrentPage(1);
  }, [productos, searchTerm]);

  // Opciones de tamaño de página tipadas para Select
  const pageSizeOptions: { value: number; label: string }[] = [
    { value: 10, label: '10 por página' },
    { value: 25, label: '25 por página' },
    { value: 50, label: '50 por página' },
  ];
  const selectedPageSize = pageSizeOptions.find(o => o.value === pageSize) || pageSizeOptions[0];

  const handleEdit = (producto: Producto) => {
    // Validar permisos antes de navegar
    if (!canEditProductoServicio(currentUser, producto.proveedorId)) {
      toast.push(
        <Notification title="Sin permisos" type="danger">
          {getNoEditTooltip(currentUser)}
        </Notification>
      );
      return;
    }
    navigate(`/productos/edit/${producto.id}`);
  };

  const handleDelete = async (producto: Producto) => {
    // Validar permisos antes de eliminar
    if (!canDeleteProductoServicio(currentUser, producto.proveedorId)) {
      toast.push(
        <Notification title="Sin permisos" type="danger">
          {getNoDeleteTooltip(currentUser)}
        </Notification>
      );
      return;
    }

    if (window.confirm('¿Está seguro de que desea eliminar este producto?')) {
      try {
        await deleteProducto(producto.id);
        toast.push(
          <Notification title="Éxito" type="success">
            Producto eliminado correctamente
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

  const handleNewProducto = () => {
    navigate('/productos/new');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  const totalItems = filteredProductos.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentItems = filteredProductos.slice(startIndex, endIndex);

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
        <Button onClick={() => refreshProductos()} className="mt-4">
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Productos</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Gestiona el catálogo de productos</p>
          </div>
          <Button 
            variant="solid" 
            onClick={handleNewProducto}
            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
          >
            Nuevo Producto
          </Button>
        </div>
      </Card>

      <Card className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <Select
              value={selectedPageSize}
              onChange={(opt: { value: number; label: string } | null) => {
                if (opt && typeof opt.value === 'number') setPageSize(opt.value)
              }}
              options={pageSizeOptions}
              isSearchable={false}
            />
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Mostrando {startIndex + 1}-{Math.min(endIndex, totalItems)} de {totalItems} productos
          </div>
        </div>

        {/* Vista Desktop - Tabla */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Nombre</th>
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
              {currentItems.map((producto, index) => (
                <motion.tr
                  key={producto.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900 dark:text-gray-100">{producto.nombre}</div>
                  </td>
                  <td className="py-3 px-4">
                    {(() => {
                      const puedeVerPrecios = canViewPrecios(currentUser, producto.proveedorId);
                      const esPropio = currentUser?.id === producto.proveedorId;
                      const esAdmin = currentUser?.roles?.includes('ADMIN');
                      const esContador = currentUser?.roles?.includes('CONTADOR');
                      const isExpanded = expandedCostos.has(producto.id);
                      
                      if (!puedeVerPrecios) {
                        return (
                          <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-500 px-2.5 py-0.5 text-xs font-medium ring-1 ring-gray-200">
                            —
                          </span>
                        );
                      }

                      // ADMIN ve precio final con botón para expandir costo
                      if (esAdmin) {
                        return (
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1">
                              <span className="inline-flex items-center rounded-full bg-misionary-100 text-misionary-800 px-2.5 py-0.5 text-xs font-medium ring-1 ring-misionary-200">
                                {formatPrice(producto.precio)}
                              </span>
                              <Tooltip title={isExpanded ? "Ocultar costo" : "Ver costo del proveedor"}>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleCosto(producto.id);
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
                              <motion.span
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="inline-flex items-center rounded-full bg-gray-100 text-gray-600 px-2.5 py-0.5 text-xs font-medium ring-1 ring-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:ring-gray-600"
                              >
                                Costo: {formatPrice(producto.costoProveedor)}
                              </motion.span>
                            )}
                          </div>
                        );
                      }

                      // CONTADOR ve precio final
                      if (esContador) {
                        return (
                          <span className="inline-flex items-center rounded-full bg-misionary-100 text-misionary-800 px-2.5 py-0.5 text-xs font-medium ring-1 ring-misionary-200">
                            {formatPrice(producto.precio)}
                          </span>
                        );
                      }

                      // PROVEEDOR ve su costo
                      return (
                        <span className="inline-flex items-center rounded-full bg-misionary-100 text-misionary-800 px-2.5 py-0.5 text-xs font-medium ring-1 ring-misionary-200">
                          {formatPrice(producto.costoProveedor)}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center rounded-full bg-msgray-100 text-msgray-800 px-2 py-0.5 text-xs font-medium ring-1 ring-msgray-200 dark:bg-gray-700 dark:text-gray-200 dark:ring-gray-600">
                      {producto.proveedor?.nombre || 'Sin proveedor'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-gray-600 dark:text-gray-400">
                      {new Date(producto.createdAt).toLocaleDateString('es-AR')}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center items-center gap-2">
                      {(() => {
                        const puedeEditar = canEditProductoServicio(currentUser, producto.proveedorId);
                        const puedeEliminar = canDeleteProductoServicio(currentUser, producto.proveedorId);
                        
                        return (
                          <>
                            <Tooltip title={puedeEditar ? "Ver/Editar" : getNoEditTooltip(currentUser)}>
                              <span>
                                <button
                                  onClick={() => handleEdit(producto)}
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
                                  onClick={() => handleEdit(producto)}
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
                                  onClick={() => handleDelete(producto)}
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
                              <Tooltip title="Producto de otro proveedor">
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
          {currentItems.map((producto, index) => {
            const puedeVerPrecios = canViewPrecios(currentUser, producto.proveedorId);
            const esAdmin = currentUser?.roles?.includes('ADMIN');
            const esContador = currentUser?.roles?.includes('CONTADOR');
            const isExpanded = expandedCostos.has(producto.id);
            const puedeEditar = canEditProductoServicio(currentUser, producto.proveedorId);
            const puedeEliminar = canDeleteProductoServicio(currentUser, producto.proveedorId);

            return (
              <motion.div
                key={producto.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Header con Nombre */}
                <div className="mb-3">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{producto.nombre}</div>
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
                          <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-500 px-2.5 py-0.5 text-xs font-medium ring-1 ring-gray-200">
                            —
                          </span>
                        );
                      }

                      if (esAdmin) {
                        return (
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center rounded-full bg-green-100 text-green-800 px-2.5 py-0.5 text-xs font-medium ring-1 ring-green-200">
                                {formatPrice(producto.precio)}
                              </span>
                              <button
                                onClick={() => toggleCosto(producto.id)}
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
                                <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-600 px-2.5 py-0.5 text-xs font-medium ring-1 ring-gray-200">
                                  Costo: {formatPrice(producto.costoProveedor)}
                                </span>
                              </motion.div>
                            )}
                          </div>
                        );
                      }

                      if (esContador) {
                        return (
                          <span className="inline-flex items-center rounded-full bg-green-100 text-green-800 px-2.5 py-0.5 text-xs font-medium ring-1 ring-green-200">
                            {formatPrice(producto.precio)}
                          </span>
                        );
                      }

                      return (
                        <span className="inline-flex items-center rounded-full bg-green-100 text-green-800 px-2.5 py-0.5 text-xs font-medium ring-1 ring-green-200">
                          {formatPrice(producto.costoProveedor)}
                        </span>
                      );
                    })()}
                  </div>
                </div>

                {/* Proveedor y Fecha */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Proveedor</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {producto.proveedor?.nombre || 'Sin proveedor'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Fecha Creación</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(producto.createdAt).toLocaleDateString('es-AR')}
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex justify-center space-x-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <Tooltip title={puedeEditar ? "Ver/Editar" : getNoEditTooltip(currentUser)}>
                    <span>
                      <button
                        onClick={() => handleEdit(producto)}
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
                        onClick={() => handleEdit(producto)}
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
                        onClick={() => handleDelete(producto)}
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
                    <Tooltip title="Producto de otro proveedor">
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
            <p className="text-gray-600 dark:text-gray-400">No se encontraron productos</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProductoList;
