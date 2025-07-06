import { useState, useMemo, useEffect } from 'react';
import { Button, Input, Select, Tag, Badge } from '@/components/ui';
import DataTable from '@/components/shared/DataTable';
import { HiSearch, HiEye, HiPencil, HiRefresh } from 'react-icons/hi';
import { motion } from 'framer-motion';
import { useHistorialPrecio, useMonedas, useProductos, useServicios } from '@/modules/historialPrecio';
import type { HistorialPrecio } from '../types';
import { ColumnDef } from '@tanstack/react-table';

const HistorialPrecioList = () => {
  const { 
    historial, 
    loading, 
    fetchHistorialProducto, 
    fetchHistorialServicio,
    limpiarEstados
  } = useHistorialPrecio();

  // Hooks auxiliares para datos 
  const { opcionesMonedasActivas } = useMonedas();
  const { opcionesProductosActivos } = useProductos();
  const { opcionesServiciosActivos } = useServicios();

  const [searchTerm, setSearchTerm] = useState('');
  const [filtroMoneda, setFiltroMoneda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [itemSeleccionado, setItemSeleccionado] = useState('');

  // Efecto para limpiar estados al montar
  useEffect(() => {
    limpiarEstados();
  }, [limpiarEstados]);

  // Filtrar datos según búsqueda y filtros
  const filteredData = useMemo(() => {
    let filtered = historial;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.producto?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.servicio?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.motivoCambio?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filtroMoneda) {
      filtered = filtered.filter(item => item.monedaId.toString() === filtroMoneda);
    }

    return filtered;
  }, [historial, searchTerm, filtroMoneda]);

  // Función para cargar historial de un item específico
  const handleCargarHistorial = async () => {
    if (!itemSeleccionado || !filtroTipo) return;

    try {
      const itemId = parseInt(itemSeleccionado);
      const filtros = filtroMoneda ? { monedaId: parseInt(filtroMoneda) } : undefined;

      if (filtroTipo === 'PRODUCTO') {
        await fetchHistorialProducto(itemId, filtros);
      } else if (filtroTipo === 'SERVICIO') {
        await fetchHistorialServicio(itemId, filtros);
      }
    } catch (error) {
      console.error('Error al cargar historial:', error);
    }
  };

  // Configuración de columnas para DataTable
  const columns = useMemo<ColumnDef<HistorialPrecio>[]>(() => [
    {
      header: 'Item',
      accessorKey: 'item',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900 dark:text-white">
            {row.original.producto?.nombre || row.original.servicio?.nombre}
          </span>
          <Badge 
            content={row.original.producto ? 'Producto' : 'Servicio'} 
            className={row.original.producto ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}
          />
        </div>
      ),
    },
    {
      header: 'Precio',
      accessorKey: 'precio',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <span className="font-mono font-semibold text-green-600">
            {row.original.moneda?.simbolo} {parseFloat(row.original.precio).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
          </span>
          <Tag>{row.original.moneda?.codigo}</Tag>
        </div>
      ),
    },
    {
      header: 'Vigencia',
      accessorKey: 'vigencia',
      cell: ({ row }) => (
        <div className="flex flex-col text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Desde: {new Date(row.original.fechaDesde).toLocaleDateString('es-AR')}
          </span>
          {row.original.fechaHasta ? (
            <span className="text-gray-600 dark:text-gray-400">
              Hasta: {new Date(row.original.fechaHasta).toLocaleDateString('es-AR')}
            </span>
          ) : (
            <Badge content="Vigente" className="bg-green-100 text-green-800 w-fit" />
          )}
        </div>
      ),
    },
    {
      header: 'Motivo',
      accessorKey: 'motivoCambio',
      cell: ({ row }) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {row.original.motivoCambio || 'Sin especificar'}
        </span>
      ),
    },
    {
      header: 'Usuario',
      accessorKey: 'usuario',
      cell: ({ row }) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {row.original.usuario?.nombre || 'Sistema'}
        </span>
      ),
    },
    {
      header: 'Estado',
      accessorKey: 'activo',
      cell: ({ row }) => (
        <Badge 
          content={row.original.activo ? 'Activo' : 'Inactivo'}
          className={row.original.activo 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-600'
          }
        />
      ),
    },
    {
      header: 'Acciones',
      accessorKey: 'actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="plain"
            icon={<HiEye />}
            onClick={() => handleView(row.original)}
          />
          <Button
            size="sm"
            variant="plain"
            icon={<HiPencil />}
            onClick={() => handleEdit(row.original)}
          />
        </div>
      ),
    },
  ], []);

  const handleView = (historial: HistorialPrecio) => {
    // TODO: Implementar vista detallada
    console.log('Ver historial:', historial);
  };

  const handleEdit = (historial: HistorialPrecio) => {
    // TODO: Implementar edición
    console.log('Editar historial:', historial);
  };

  const handleRefresh = () => {
    // Recargar datos según los filtros actuales
    if (itemSeleccionado && filtroTipo) {
      handleCargarHistorial();
    } else {
      limpiarEstados();
    }
  };

  // Opciones para los selects
  const tipoOptions = [
    { value: 'PRODUCTO', label: 'Productos' },
    { value: 'SERVICIO', label: 'Servicios' }
  ];

  // Opciones para items según el tipo seleccionado
  const itemOptions = useMemo(() => {
    if (filtroTipo === 'PRODUCTO') {
      return opcionesProductosActivos;
    } else if (filtroTipo === 'SERVICIO') {
      return opcionesServiciosActivos;
    }
    return [];
  }, [filtroTipo, opcionesProductosActivos, opcionesServiciosActivos]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Filtros y búsqueda */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Búsqueda */}
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Buscar por nombre, motivo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={<HiSearch className="text-gray-400" />}
          />
        </div>
        
        {/* Filtros */}
        <div className="flex gap-3 flex-wrap">
          <Select
            placeholder="Tipo de item"
            options={tipoOptions}
            value={tipoOptions.find(opt => opt.value === filtroTipo)}
            onChange={(option) => {
              setFiltroTipo(option?.value || '');
              setItemSeleccionado(''); // Limpiar item seleccionado al cambiar tipo
            }}
            className="min-w-[140px]"
          />

          <Select
            placeholder="Seleccionar item"
            options={itemOptions}
            value={itemOptions.find(opt => opt.value.toString() === itemSeleccionado)}
            onChange={(option) => setItemSeleccionado(option?.value?.toString() || '')}
            className="min-w-[180px]"
            isDisabled={!filtroTipo}
          />

          <Select
            placeholder="Todas las monedas"
            options={opcionesMonedasActivas}
            value={opcionesMonedasActivas.find(opt => opt.value.toString() === filtroMoneda)}
            onChange={(option) => setFiltroMoneda(option?.value?.toString() || '')}
            className="min-w-[140px]"
          />

          <Button
            variant="solid"
            icon={<HiRefresh />}
            onClick={handleCargarHistorial}
            loading={loading}
            disabled={!itemSeleccionado || !filtroTipo}
          >
            Cargar Historial
          </Button>

          <Button
            variant="default"
            icon={<HiRefresh />}
            onClick={handleRefresh}
            loading={loading}
          >
            Actualizar
          </Button>
        </div>
      </div>

      {/* Tabla de datos */}
      {historial.length === 0 && !loading ? (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400">
            <HiSearch className="mx-auto h-12 w-12 mb-4" />
            <h3 className="text-lg font-medium mb-2">No hay historial cargado</h3>
            <p className="text-sm">
              Seleccione un tipo de item y un elemento específico para ver su historial de precios.
            </p>
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredData}
          loading={loading}
        />
      )}

      {/* Información de totales */}
      {filteredData.length > 0 && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Mostrando {filteredData.length} de {historial.length} registros
        </div>
      )}
    </motion.div>
  );
};

export default HistorialPrecioList;
