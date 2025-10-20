import { useState, useEffect, useMemo } from 'react';
import { Card, Button, Input, Select, Badge, Alert } from '@/components/ui';
import DataTable from '@/components/shared/DataTable';
import { HiSearch, HiRefresh, HiExclamationCircle } from 'react-icons/hi';
import { motion } from 'framer-motion';
import { ColumnDef } from '@tanstack/react-table';
import { usePreciosDesactualizados, useMonedas } from '@/modules/historialPrecio';
import type { PrecioDesactualizado } from '@/modules/historialPrecio/types';

const PreciosDesactualizados = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [diasLimite, setDiasLimite] = useState('30');
  const [filtroMoneda, setFiltroMoneda] = useState('');

  // Hooks
  const { 
    preciosDesactualizados, 
    loading, 
    fetchPreciosDesactualizados,
    refrescarDatos 
  } = usePreciosDesactualizados();
  
  const { opcionesMonedasActivas } = useMonedas();

  // Cargar datos iniciales
  useEffect(() => {
    const filtros = {
      diasLimite: parseInt(diasLimite),
      ...(filtroMoneda && { monedaId: parseInt(filtroMoneda) })
    };
    fetchPreciosDesactualizados(filtros);
  }, [fetchPreciosDesactualizados, diasLimite, filtroMoneda]);

  // Filtrar datos por búsqueda
  const filteredData = useMemo(() => {
    if (!searchTerm) return preciosDesactualizados;
    
    return preciosDesactualizados.filter(item =>
      item.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [preciosDesactualizados, searchTerm]);

  const columns: ColumnDef<PrecioDesactualizado>[] = [
    {
      header: 'Tipo',
      accessorKey: 'tipo',
      cell: ({ row }) => (
        <Badge 
          content={row.original.tipo === 'PRODUCTO' ? 'Producto' : 'Servicio'}
          className={row.original.tipo === 'PRODUCTO' 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-purple-100 text-purple-800'
          }
        />
      ),
    },
    {
      header: 'Nombre',
      accessorKey: 'nombre',
      cell: ({ row }) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {row.original.nombre}
        </span>
      ),
    },
    {
      header: 'Última Actualización',
      accessorKey: 'ultimaActualizacion',
      cell: ({ row }) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {new Date(row.original.ultimaActualizacion).toLocaleDateString('es-AR')}
        </span>
      ),
    },
    {
      header: 'Días sin Actualizar',
      accessorKey: 'diasSinActualizar',
      cell: ({ row }) => {
        const dias = row.original.diasSinActualizar;
        const getColor = () => {
          if (dias > 60) return 'bg-red-100 text-red-800';
          if (dias > 30) return 'bg-yellow-100 text-yellow-800';
          return 'bg-green-100 text-green-800';
        };
        
        return (
          <Badge 
            content={`${dias} días`}
            className={getColor()}
          />
        );
      },
    },
    {
      header: 'Acciones',
      accessorKey: 'actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            className="px-4 py-2 rounded-lg transition-all duration-200 bg-gradient-to-br from-blue-500 to-blue-600 hover:shadow-lg hover:shadow-blue-300 dark:hover:shadow-blue-900/50 text-white hover:from-blue-600 hover:to-blue-700"
            onClick={() => handleActualizar(row.original)}
          >
            Actualizar Precio
          </button>
        </div>
      ),
    },
  ];

  const handleActualizar = (item: PrecioDesactualizado) => {
    // TODO: Implementar actualización de precio individual
    console.log('Actualizar precio:', item);
  };

  const handleRefresh = async () => {
    const filtros = {
      diasLimite: parseInt(diasLimite),
      ...(filtroMoneda && { monedaId: parseInt(filtroMoneda) })
    };
    await refrescarDatos(filtros);
  };

  const diasLimiteOptions = [
    { value: '15', label: '15 días' },
    { value: '30', label: '30 días' },
    { value: '45', label: '45 días' },
    { value: '60', label: '60 días' },
    { value: '90', label: '90 días' }
  ];

  // Estadísticas de resumen
  const resumen = useMemo(() => {
    const total = filteredData.length;
    const criticos = filteredData.filter(item => item.diasSinActualizar > 60).length;
    const advertencia = filteredData.filter(item => item.diasSinActualizar > 30 && item.diasSinActualizar <= 60).length;
    
    return { total, criticos, advertencia };
  }, [filteredData]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Alerta informativa */}
      <Alert type="info" title="Precios Desactualizados">
        <div className="flex items-start space-x-2">
          <HiExclamationCircle className="text-blue-500 mt-0.5" />
          <div>
            <p>Los precios que no han sido actualizados por más del límite establecido aparecerán aquí.</p>
            <p className="mt-1 text-sm">Se recomienda revisar y actualizar estos precios regularmente.</p>
          </div>
        </div>
      </Alert>

      {/* Estadísticas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{resumen.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Desactualizados</div>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{resumen.criticos}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Críticos (+60 días)</div>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{resumen.advertencia}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Advertencia (30-60 días)</div>
          </div>
        </Card>
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={<HiSearch className="text-gray-400" />}
          />
        </div>
        
        <div className="flex gap-3">
          <Select
            placeholder="Días límite"
            options={diasLimiteOptions}
            value={diasLimiteOptions.find(opt => opt.value === diasLimite)}
            onChange={(option) => setDiasLimite(option?.value || '30')}
            className="min-w-[120px]"
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
            onClick={handleRefresh}
            loading={loading}
          >
            Actualizar
          </Button>
        </div>
      </div>

      {/* Tabla de datos */}
      <DataTable
        columns={columns}
        data={filteredData}
        loading={loading}
      />

      {/* Información de totales */}
      {filteredData.length > 0 && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Mostrando {filteredData.length} de {preciosDesactualizados.length} elementos con precios desactualizados
        </div>
      )}
    </motion.div>
  );
};

export default PreciosDesactualizados;
