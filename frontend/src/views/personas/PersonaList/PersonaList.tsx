import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye, HiFilter, HiX } from 'react-icons/hi';
import { Persona, PersonaListProps } from '../types';
import { Button, Badge, Tag, Tooltip, Input, Select, Card } from '@/components/ui';
import DataTablePro, { ColumnDefPro } from '@/components/shared/DataTablePro';
import { providerAreaOptions } from '../schemas';
import PersonaQuickViewModal from './PersonaQuickViewModal';

const PersonaList: React.FC<PersonaListProps> = ({
  personas,
  loading,
  error,
  onEdit,
  onDelete,
  onView,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState<Persona[]>(personas);
  const [tipoFilter, setTipoFilter] = useState<string>('');
  const [rolFilter, setRolFilter] = useState<string>('');
  const [areaFilter, setAreaFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortKey, setSortKey] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Definición de columnas para DataTablePro
  const columns = useMemo<ColumnDefPro<Persona>[]>(() => [
    {
      header: 'ID',
      accessorKey: 'id',
      size: 70,
      enableSorting: false,
      mobileCard: { show: true, label: 'ID' },
    },
    {
      header: 'Nombre',
      accessorKey: 'nombre',
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center">
          <div className="font-medium text-gray-900 dark:text-gray-100">
            {row.nombre}
          </div>
        </div>
      ),
      mobileCard: { show: true, label: 'Nombre' },
    },
    {
      header: 'Email',
      accessorKey: 'email',
      enableSorting: false,
      cell: ({ row }) => (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {row.email}
        </div>
      ),
      mobileCard: { show: true, label: 'Email' },
    },
    {
      header: 'Tipo',
      accessorKey: 'tipo',
      enableSorting: true,
      cell: ({ row }) => {
        const tipo = row.tipo;
        const getBadgeColor = (tipo: string) => {
          switch (tipo) {
            case 'CLIENTE':
              return 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-100';
            case 'PROVEEDOR':
              return 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-100';
            case 'INTERNO':
              return 'bg-purple-100 text-purple-800 dark:bg-purple-800/20 dark:text-purple-100';
            default:
              return 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-100';
          }
        };

        const getDisplayName = (tipo: string) => {
          switch (tipo) {
            case 'CLIENTE':
              return 'Cliente';
            case 'PROVEEDOR':
              return 'Proveedor';
            case 'INTERNO':
              return 'Interno';
            default:
              return tipo;
          }
        };

        return (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
          <Badge className={getBadgeColor(tipo)}>
            {getDisplayName(tipo)}
          </Badge>
          </motion.div>
        );
      },
      mobileCard: {
        show: true,
        label: 'Tipo',
        render: (value) => value,
      },
    },
    {
      header: 'Teléfono',
      accessorKey: 'telefono',
      enableSorting: false,
      cell: ({ row }) => (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {row.telefono || '-'}
        </div>
      ),
      mobileCard: { show: true, label: 'Teléfono' },
    },
    {
      header: 'Áreas',
      accessorKey: 'providerRoles',
      enableSorting: true,
      cell: ({ row }) => {
        const areas = (row as any).providerRoles;
        if (!areas || !Array.isArray(areas) || areas.length === 0 || row.tipo !== 'PROVEEDOR') {
          return <span className="text-xs text-gray-400 dark:text-gray-500">-</span>;
        }
        return (
          <div className="flex flex-wrap gap-1">
            {areas.slice(0, 2).map((area: string, index: number) => (
              <motion.div
                key={`${row.id}-area-${index}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
              >
                <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-800/20 dark:text-indigo-100 text-xs">
                  {area}
                </Badge>
              </motion.div>
            ))}
            {areas.length > 2 && (
              <Tooltip title={areas.slice(2).join(', ')}>
                <Badge className="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 text-xs cursor-help">
                  +{areas.length - 2}
                </Badge>
              </Tooltip>
            )}
          </div>
        );
      },
      size: 160,
      mobileCard: { show: true, label: 'Áreas' },
    },
    {
      header: 'Roles',
      accessorKey: 'roles',
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {Array.isArray(row.roles) && row.roles.length > 0 ? (
            row.roles.map((rol: string, index: number) => {
              const getRoleColor = (role: string) => {
                switch (role) {
                  case 'ADMIN':
                    return 'red';
                  case 'CONTADOR':
                    return 'amber';
                  case 'PROVEEDOR':
                    return 'blue';
                  default:
                    return 'gray';
                }
              };

              const getRoleDisplayName = (role: string) => {
                switch (role) {
                  case 'ADMIN':
                    return 'Admin';
                  case 'CONTADOR':
                    return 'Contador';
                  case 'PROVEEDOR':
                    return 'Proveedor';
                  default:
                    return role;
                }
              };

              return (
                <motion.div
                  key={`${row.id}-${rol}-${index}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <Tag className={`text-xs`} color={getRoleColor(rol)}>
                  {getRoleDisplayName(rol)}
                </Tag>
                </motion.div>
              );
            })
          ) : (
            <span className="text-xs text-gray-500">Sin roles</span>
          )}
        </div>
      ),
      mobileCard: { show: true, label: 'Roles' },
    },
    {
      header: 'Creación',
      accessorKey: 'createdAt',
      enableSorting: true,
      cell: ({ row }) => {
        const date = new Date(row.createdAt);
        const formatDate = (date: Date) => {
          const day = date.getDate().toString().padStart(2, '0');
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const year = date.getFullYear();
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          return `${day}/${month}/${year} ${hours}:${minutes}`;
        };

        const isRecent = (date: Date) => {
          const now = new Date();
          const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
          return diffInHours < 24;
        };

        return (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col"
          >
            <span className={`text-sm ${isRecent(date) ? 'font-semibold text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
              {formatDate(date)}
            </span>
            {isRecent(date) && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xs text-green-600 dark:text-green-400 font-medium"
              >
                ¡Nuevo!
              </motion.span>
            )}
          </motion.div>
        );
      },
      size: 140,
      mobileCard: { show: true, label: 'Creado' },
    },
    {
      header: 'Acciones',
      id: 'actions',
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Tooltip title="Vista rápida">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="p-2 rounded-full transition-all duration-200 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 hover:shadow-md hover:shadow-blue-200 dark:hover:shadow-blue-900/30 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPersona(row);
                setShowDetailsModal(true);
              }}
              >
                <HiOutlineEye className="w-4 h-4" />
            </motion.button>
            </Tooltip>
          <Tooltip title="Editar">
            <motion.button
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="p-2 rounded-full transition-all duration-200 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 hover:shadow-md hover:shadow-amber-200 dark:hover:shadow-amber-900/30 text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(row);
              }}
            >
                <HiOutlinePencil className="w-4 h-4" />
            </motion.button>
          </Tooltip>
          <Tooltip title="Eliminar">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="p-2 rounded-full transition-all duration-200 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 hover:shadow-md hover:shadow-red-200 dark:hover:shadow-red-900/30 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(row.id);
              }}
            >
                <HiOutlineTrash className="w-4 h-4" />
            </motion.button>
          </Tooltip>
        </div>
      ),
      size: 120,
      mobileCard: { show: false },
    },
  ], [onEdit, onDelete]);

  // Ordenar, filtrar y paginar datos
  useEffect(() => {
    let result = [...personas];

    // Ordenar
    result.sort((a, b) => {
      let aValue: any = a[sortKey as keyof Persona];
      let bValue: any = b[sortKey as keyof Persona];

      // Para fechas
      if (sortKey === 'createdAt' || sortKey === 'updatedAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      // Para arrays (roles)
      if (Array.isArray(aValue)) {
        aValue = aValue.join(',');
        bValue = bValue.join(',');
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Aplicar búsqueda
    if (searchTerm) {
      result = result.filter(persona =>
        persona.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        persona.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        persona.tipo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        persona.telefono?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Aplicar filtro de tipo
    if (tipoFilter) {
      result = result.filter(persona => persona.tipo === tipoFilter);
    }

    // Aplicar filtro de rol
    if (rolFilter) {
      result = result.filter(persona => 
        persona.roles && persona.roles.includes(rolFilter as any)
      );
    }

    // Aplicar filtro de área (buscar en providerRoles array)
    if (areaFilter) {
      result = result.filter(persona => {
        const providerRoles = (persona as any).providerRoles;
        return Array.isArray(providerRoles) && providerRoles.includes(areaFilter);
      });
    }

    setFilteredData(result);
    setCurrentPage(1);
  }, [personas, searchTerm, tipoFilter, rolFilter, areaFilter, sortKey, sortDirection]);

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortKey(key);
    setSortDirection(direction);
  };

  const clearFilters = () => {
    setTipoFilter('');
    setRolFilter('');
    setAreaFilter('');
  };

  const hasActiveFilters = tipoFilter || rolFilter || areaFilter;

  // Opciones para filtros
  const tipoOptions = [
    { value: '', label: 'Todos los tipos' },
    { value: 'CLIENTE', label: 'Cliente' },
    { value: 'PROVEEDOR', label: 'Proveedor' },
    { value: 'INTERNO', label: 'Interno' },
  ];

  const rolOptions = [
    { value: '', label: 'Todos los roles' },
    { value: 'ADMIN', label: 'Admin' },
    { value: 'CONTADOR', label: 'Contador' },
    { value: 'PROVEEDOR', label: 'Proveedor' },
  ];

  // Opciones de áreas (usar las predefinidas)
  const areaOptions = useMemo(() => {
    return [
      { value: '', label: 'Todas las áreas' },
      ...providerAreaOptions
    ];
  }, []);

  // Calcular datos de paginación
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <div className="text-red-600 mb-2">Error al cargar personas</div>
        <div className="text-sm text-gray-500">{error}</div>
      </motion.div>
    );
  }

  // Render personalizado para cards mobile
  const renderMobileCard = (persona: Persona, index: number) => {
    const getBadgeColor = (tipo: string) => {
      switch (tipo) {
        case 'CLIENTE':
          return 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-100';
        case 'PROVEEDOR':
          return 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-100';
        case 'INTERNO':
          return 'bg-purple-100 text-purple-800 dark:bg-purple-800/20 dark:text-purple-100';
        default:
          return 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-100';
      }
    };

    const getTipoLabel = (tipo: string) => {
      switch (tipo) {
        case 'CLIENTE':
          return 'Cliente';
        case 'PROVEEDOR':
          return 'Proveedor';
        case 'INTERNO':
          return 'Interno';
        default:
          return tipo;
      }
    };

    return (
      <Card className="overflow-hidden">
        <div className="p-4 space-y-3">
          {/* Header con nombre y tipo */}
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                {persona.nombre}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{persona.email}</p>
            </div>
            <div className="flex-shrink-0">
              <Badge className={getBadgeColor(persona.tipo)}>
                {getTipoLabel(persona.tipo)}
              </Badge>
            </div>
          </div>

          {/* Detalles */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            {persona.telefono && (
              <div className="col-span-2">
                <span className="text-gray-500">Teléfono:</span>
                <p className="font-medium">{persona.telefono}</p>
              </div>
            )}
          </div>

          {/* Áreas de Especialidad */}
          {(persona as any).providerRoles && (persona as any).providerRoles.length > 0 && (
            <div>
              <span className="text-xs text-gray-500 mb-1 block">Áreas de Especialidad:</span>
              <div className="flex flex-wrap gap-1">
                {(persona as any).providerRoles.map((area: string, idx: number) => (
                  <Badge key={idx} className="bg-indigo-100 text-indigo-800 dark:bg-indigo-800/20 dark:text-indigo-100 text-xs">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Roles del Sistema */}
          {persona.roles && persona.roles.length > 0 && (
            <div>
              <span className="text-xs text-gray-500 mb-1 block">Roles:</span>
              <div className="flex flex-wrap gap-1">
                {persona.roles.map((rol, idx) => (
                  <Tag key={idx} size="sm" color="blue">
                    {rol}
                  </Tag>
                ))}
              </div>
            </div>
          )}

          {/* Acciones */}
          <div className="flex justify-end gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
            <Button 
              size="sm" 
              variant="default" 
              onClick={(e) => {
                e.stopPropagation();
                onEdit(persona);
              }}
              className="flex-1 sm:flex-initial"
            >
              <HiOutlinePencil className="w-4 h-4 mr-1" />
              Editar
            </Button>
            <Button 
              size="sm" 
              variant="plain" 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(persona.id);
              }} 
              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex-1 sm:flex-initial"
            >
              <HiOutlineTrash className="w-4 h-4 mr-1" />
              Eliminar
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Barra de búsqueda y filtros */}
      <div className="mb-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          {/* Búsqueda */}
          <div className="flex-1 w-full">
            <Input
              placeholder="Buscar por nombre, email, tipo o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Botón de filtros */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant={hasActiveFilters ? 'solid' : 'default'}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={hasActiveFilters ? 'bg-blue-600 text-white' : ''}
            >
              <HiFilter className="w-4 h-4 mr-2" />
              Filtros
              {hasActiveFilters && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-2 bg-white text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                >
                  {(tipoFilter ? 1 : 0) + (rolFilter ? 1 : 0) + (areaFilter ? 1 : 0)}
                </motion.span>
              )}
            </Button>
          </motion.div>
        </div>

        {/* Panel de filtros expandible */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-visible relative z-10"
            >
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Filtros Activos
                  </h3>
                  {hasActiveFilters && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={clearFilters}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <HiX className="w-3 h-3" />
                      Limpiar filtros
                    </motion.button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Filtro por tipo */}
                  <div>
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                      Tipo de Persona
                    </label>
                    <Select
                      value={tipoOptions.find(o => o.value === tipoFilter)}
                      onChange={(opt: any) => setTipoFilter(opt?.value || '')}
                      options={tipoOptions}
                      placeholder="Seleccionar tipo"
                      isSearchable={false}
                    />
                  </div>

                  {/* Filtro por rol */}
                  <div>
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                      Rol
                    </label>
                    <Select
                      value={rolOptions.find(o => o.value === rolFilter)}
                      onChange={(opt: any) => setRolFilter(opt?.value || '')}
                      options={rolOptions}
                      placeholder="Seleccionar rol"
                      isSearchable={false}
                    />
                  </div>

                  {/* Filtro por área */}
                  <div>
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                      Área (Proveedores)
                    </label>
                    <Select
                      value={areaOptions.find(o => o.value === areaFilter)}
                      onChange={(opt: any) => setAreaFilter(opt?.value || '')}
                      options={areaOptions}
                      placeholder="Seleccionar área"
                      isSearchable={false}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Indicador de resultados */}
      {(searchTerm || hasActiveFilters) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 text-sm text-gray-600 dark:text-gray-400"
        >
          Mostrando <span className="font-semibold text-blue-600 dark:text-blue-400">{filteredData.length}</span> de{' '}
          <span className="font-semibold">{personas.length}</span> personas
        </motion.div>
      )}

      {/* Tabla con DataTablePro */}
      <DataTablePro
        columns={columns}
        data={paginatedData}
        loading={loading}
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={filteredData.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        onSort={handleSort}
        mobileCardRender={renderMobileCard}
      />

      {/* Mensaje cuando no hay resultados */}
      {!loading && filteredData.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          {searchTerm 
            ? 'No se encontraron personas que coincidan con la búsqueda' 
            : 'No hay personas registradas'}
        </div>
      )}

      {/* Modal de Vista Rápida */}
      <PersonaQuickViewModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedPersona(null);
        }}
        persona={selectedPersona}
      />
    </motion.div>
  );
};

export default PersonaList;

