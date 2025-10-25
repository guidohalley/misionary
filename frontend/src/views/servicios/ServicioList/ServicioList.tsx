import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Badge, Pagination, Select, Input, Notification, toast, Tooltip } from '@/components/ui';
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye, HiLockClosed, HiChevronDown, HiChevronUp, HiOutlineFilter, HiOutlineViewBoards } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useServicio } from '@/modules/servicio/hooks/useServicio';
import type { Servicio } from '@/modules/servicio/types';
import { useAuth } from '@/contexts/AuthContext';
import { usePersona } from '@/modules/persona/hooks/usePersona';
import { TipoPersona, RolUsuario } from '@/views/personas/schemas';
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
  const { personas } = usePersona();
  const { user: currentUser } = useAuth();
  
  // Estados básicos
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCostos, setExpandedCostos] = useState<Set<number>>(new Set());
  
  // Estados de filtros avanzados
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [proveedorFilter, setProveedorFilter] = useState<number | null>(null);
  const [areaFilter, setAreaFilter] = useState<string>('');
  const [minPrecio, setMinPrecio] = useState<number | null>(null);
  const [maxPrecio, setMaxPrecio] = useState<number | null>(null);
  const [fechaDesde, setFechaDesde] = useState<string>('');
  const [fechaHasta, setFechaHasta] = useState<string>('');
  
  // Estados de ordenamiento
  const [sortBy, setSortBy] = useState<'nombre' | 'precio' | 'proveedor' | 'fechaCreacion' | 'area'>('fechaCreacion');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Estados de agrupación
  const [groupByProveedor, setGroupByProveedor] = useState(false);

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

  // Filtrado avanzado con useMemo para optimización
  const filteredServicios = useMemo(() => {
    let filtered = servicios.filter(servicio => {
      // Filtro de búsqueda
      const matchesSearch = searchTerm === '' || 
        servicio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        servicio.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        servicio.proveedor?.nombre.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtro de proveedor
      const matchesProveedor = proveedorFilter === null || servicio.proveedorId === proveedorFilter;
      
      // Filtro de área
      const matchesArea = areaFilter === '' || 
        (servicio.proveedor?.providerRoles && servicio.proveedor.providerRoles.some((role: string) => 
          role.toLowerCase().includes(areaFilter.toLowerCase())
        ));
      
      // Filtro de precio (solo si el usuario puede ver precios)
      const canSeePrice = canViewPrecios(currentUser, servicio.proveedorId);
      let matchesPrecio = true;
      if (canSeePrice && (minPrecio !== null || maxPrecio !== null)) {
        const precio = currentUser?.roles?.includes('PROVEEDOR') && !currentUser?.roles?.includes('ADMIN') 
          ? servicio.costoProveedor 
          : servicio.precio;
        
        if (minPrecio !== null && precio < minPrecio) matchesPrecio = false;
        if (maxPrecio !== null && precio > maxPrecio) matchesPrecio = false;
      }
      
      // Filtro de fecha
      let matchesFecha = true;
      if (fechaDesde || fechaHasta) {
        const servicioFecha = new Date(servicio.createdAt);
        if (fechaDesde && servicioFecha < new Date(fechaDesde)) matchesFecha = false;
        if (fechaHasta && servicioFecha > new Date(fechaHasta + 'T23:59:59')) matchesFecha = false;
      }
      
      return matchesSearch && matchesProveedor && matchesArea && matchesPrecio && matchesFecha;
    });
    
    // Ordenamiento
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'nombre':
          aValue = a.nombre.toLowerCase();
          bValue = b.nombre.toLowerCase();
          break;
        case 'precio':
          const canSeePrice = canViewPrecios(currentUser, a.proveedorId);
          if (!canSeePrice) return 0;
          aValue = currentUser?.roles?.includes('PROVEEDOR') && !currentUser?.roles?.includes('ADMIN') 
            ? a.costoProveedor : a.precio;
          bValue = currentUser?.roles?.includes('PROVEEDOR') && !currentUser?.roles?.includes('ADMIN') 
            ? b.costoProveedor : b.precio;
          break;
        case 'proveedor':
          aValue = a.proveedor?.nombre?.toLowerCase() || '';
          bValue = b.proveedor?.nombre?.toLowerCase() || '';
          break;
        case 'area':
          aValue = a.proveedor?.providerRoles?.[0]?.toLowerCase() || '';
          bValue = b.proveedor?.providerRoles?.[0]?.toLowerCase() || '';
          break;
        case 'fechaCreacion':
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    return filtered;
  }, [servicios, searchTerm, proveedorFilter, areaFilter, minPrecio, maxPrecio, fechaDesde, fechaHasta, sortBy, sortDirection, currentUser]);

  // Opciones de proveedores para filtro
  const proveedorOptions = useMemo(() => {
    const proveedores = personas.filter(p => p.tipo === TipoPersona.PROVEEDOR || p.roles?.includes(RolUsuario.PROVEEDOR));
    return proveedores.map(p => ({ value: p.id, label: p.nombre }));
  }, [personas]);

  // Opciones de áreas para filtro
  const areaOptions = useMemo(() => {
    const areas = new Set<string>();
    servicios.forEach(servicio => {
      if (servicio.proveedor?.providerRoles) {
        servicio.proveedor.providerRoles.forEach((role: string) => areas.add(role));
      }
    });
    return Array.from(areas).sort().map(area => ({ value: area, label: area }));
  }, [servicios]);

  // Opciones de ordenamiento
  const sortOptions = [
    { value: 'fechaCreacion', label: 'Fecha de Creación' },
    { value: 'nombre', label: 'Nombre' },
    { value: 'proveedor', label: 'Proveedor' },
    { value: 'area', label: 'Área' },
    ...(currentUser?.roles?.includes('ADMIN') || currentUser?.roles?.includes('CONTADOR') 
      ? [{ value: 'precio', label: 'Precio' }] 
      : [])
  ];

  // Agrupación por proveedor
  const groupedServicios = useMemo(() => {
    if (!groupByProveedor) return null;
    
    const groups: Record<string, Servicio[]> = {};
    filteredServicios.forEach(servicio => {
      const proveedorNombre = servicio.proveedor?.nombre || 'Sin proveedor';
      if (!groups[proveedorNombre]) {
        groups[proveedorNombre] = [];
      }
      groups[proveedorNombre].push(servicio);
    });
    
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredServicios, groupByProveedor]);

  // Función para limpiar filtros
  const clearFilters = () => {
    setSearchTerm('');
    setProveedorFilter(null);
    setAreaFilter('');
    setMinPrecio(null);
    setMaxPrecio(null);
    setFechaDesde('');
    setFechaHasta('');
    setSortBy('fechaCreacion');
    setSortDirection('desc');
    setCurrentPage(1);
  };

  // Función para manejar ordenamiento
  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

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

  // Opciones de tamaño de página
  const pageSizeOptions: { value: number; label: string }[] = [
    { value: 5, label: '5 por página' },
    { value: 10, label: '10 por página' },
    { value: 25, label: '25 por página' },
    { value: 50, label: '50 por página' },
    { value: 100, label: '100 por página' },
  ];
  const selectedPageSize = pageSizeOptions.find(o => o.value === pageSize) || pageSizeOptions[1];

  // Paginación
  const totalItems = filteredServicios.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentItems = groupByProveedor ? filteredServicios : filteredServicios.slice(startIndex, endIndex);

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
      {/* Header Card */}
      <Card className="mb-6 p-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Servicios</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Gestiona el catálogo de servicios</p>
          </div>
          <Button 
            variant="solid" 
            onClick={handleNewServicio}
            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
          >
            Nuevo Servicio
          </Button>
        </div>
      </Card>

      <Card className="mb-6">
        <div className="space-y-4">
          {/* Controles principales */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Input
                placeholder="Buscar servicios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64"
              />
              <div className="flex items-center gap-2">
                <Button
                  variant="plain"
                  size="sm"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  icon={<HiOutlineFilter />}
                  className="whitespace-nowrap"
                >
                  Filtros {showAdvancedFilters ? 'Avanzados' : ''}
                </Button>
                <Button
                  variant="plain"
                  size="sm"
                  onClick={() => setGroupByProveedor(!groupByProveedor)}
                  icon={<HiOutlineViewBoards />}
                  className="whitespace-nowrap"
                >
                  {groupByProveedor ? 'Vista Lista' : 'Agrupar'}
                </Button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <Select
                  value={sortOptions.find(opt => opt.value === sortBy)}
                  onChange={(opt) => {
                    if (opt) setSortBy(opt.value as typeof sortBy);
                  }}
                  options={sortOptions}
                  isSearchable={false}
                  className="w-40"
                  placeholder="Ordenar por..."
                />
                <Button
                  variant="plain"
                  size="sm"
                  onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                  className="px-2"
                >
                  {sortDirection === 'asc' ? '↑' : '↓'}
                </Button>
              </div>
              <Select
                value={selectedPageSize}
                onChange={(opt: { value: number; label: string } | null) => {
                  if (opt && typeof opt.value === 'number') {
                    setPageSize(opt.value);
                    setCurrentPage(1);
                  }
                }}
                options={pageSizeOptions}
                isSearchable={false}
                className="w-full sm:w-auto"
              />
              <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                {filteredServicios.length} servicio{filteredServicios.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Filtros avanzados */}
          <AnimatePresence>
            {showAdvancedFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-gray-200 dark:border-gray-700 pt-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Proveedor
                    </label>
                    <Select
                      value={proveedorOptions.find(opt => opt.value === proveedorFilter) || null}
                      onChange={(opt) => setProveedorFilter(opt?.value || null)}
                      options={proveedorOptions}
                      placeholder="Todos los proveedores"
                      isClearable
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Área
                    </label>
                    <Select
                      value={areaOptions.find(opt => opt.value === areaFilter) || null}
                      onChange={(opt) => setAreaFilter(opt?.value || '')}
                      options={areaOptions}
                      placeholder="Todas las áreas"
                      isClearable
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Precio Mínimo
                    </label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={minPrecio || ''}
                      onChange={(e) => setMinPrecio(e.target.value ? Number(e.target.value) : null)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Precio Máximo
                    </label>
                    <Input
                      type="number"
                      placeholder="999999"
                      value={maxPrecio || ''}
                      onChange={(e) => setMaxPrecio(e.target.value ? Number(e.target.value) : null)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fecha Desde
                    </label>
                    <Input
                      type="date"
                      value={fechaDesde}
                      onChange={(e) => setFechaDesde(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fecha Hasta
                    </label>
                    <Input
                      type="date"
                      value={fechaHasta}
                      onChange={(e) => setFechaHasta(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-end">
                    <Button
                      variant="plain"
                      onClick={clearFilters}
                      className="w-full"
                    >
                      Limpiar Filtros
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Vista Desktop - Tabla */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th 
                  className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => handleSort('nombre')}
                >
                  <div className="flex items-center gap-1">
                    Nombre
                    {sortBy === 'nombre' && (
                      <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Descripción</th>
                <th 
                  className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => handleSort('precio')}
                >
                  <div className="flex items-center gap-1">
                    {(currentUser?.roles?.includes('ADMIN') || currentUser?.roles?.includes('CONTADOR'))
                      ? 'Precio Final' 
                      : 'Precio'}
                    {sortBy === 'precio' && (
                      <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => handleSort('proveedor')}
                >
                  <div className="flex items-center gap-1">
                    Proveedor
                    {sortBy === 'proveedor' && (
                      <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => handleSort('area')}
                >
                  <div className="flex items-center gap-1">
                    Área
                    {sortBy === 'area' && (
                      <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => handleSort('fechaCreacion')}
                >
                  <div className="flex items-center gap-1">
                    Fecha Creación
                    {sortBy === 'fechaCreacion' && (
                      <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
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
                    <div className="flex flex-wrap gap-1">
                      {servicio.proveedor?.providerRoles && servicio.proveedor.providerRoles.length > 0 ? (
                        servicio.proveedor.providerRoles.slice(0, 2).map((role: string, idx: number) => (
                          <span
                            key={idx}
                            className="inline-flex items-center rounded-full bg-blue-100 text-blue-800 px-2 py-0.5 text-xs font-medium ring-1 ring-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:ring-blue-800"
                          >
                            {role}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-500 dark:text-gray-400">—</span>
                      )}
                      {servicio.proveedor?.providerRoles && servicio.proveedor.providerRoles.length > 2 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          +{servicio.proveedor.providerRoles.length - 2}
                        </span>
                      )}
                    </div>
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
