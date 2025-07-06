import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye, HiOutlinePlus } from 'react-icons/hi';
import { Button, Badge, Tooltip } from '@/components/ui';
import DataTable from '@/components/shared/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { GastoOperativo, CategoriaGasto, categoriasGastoOptions } from '../types';
import { useNavigate } from 'react-router-dom';

interface GastoListProps {
  gastos: GastoOperativo[];
  loading: boolean;
  error: string | null;
  onEdit: (gasto: GastoOperativo) => void;
  onDelete: (id: number) => void;
  onView: (gasto: GastoOperativo) => void;
  onAsignar: (gasto: GastoOperativo) => void;
}

const GastoList: React.FC<GastoListProps> = ({
  gastos,
  loading,
  error,
  onEdit,
  onDelete,
  onView,
  onAsignar,
}) => {
  const navigate = useNavigate();

  const columns = useMemo<ColumnDef<GastoOperativo>[]>(() => [
    {
      header: 'ID',
      accessorKey: 'id',
      size: 70,
    },
    {
      header: 'Concepto',
      accessorKey: 'concepto',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="font-medium text-gray-900 dark:text-gray-100">
            {row.original.concepto}
          </div>
          {row.original.descripcion && (
            <div className="text-xs text-gray-500 truncate max-w-xs">
              {row.original.descripcion}
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Monto',
      accessorKey: 'monto',
      cell: ({ row }) => (
        <div className="text-right">
          <div className="font-semibold text-gray-900 dark:text-gray-100">
            {row.original.moneda?.simbolo} {row.original.monto.toLocaleString('es-AR', { 
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </div>
          <div className="text-xs text-gray-500">
            {row.original.moneda?.codigo}
          </div>
        </div>
      ),
    },
    {
      header: 'Categoría',
      accessorKey: 'categoria',
      cell: ({ row }) => {
        const categoria = categoriasGastoOptions.find(c => c.value === row.original.categoria);
        return (
          <Tooltip title={categoria?.description || ''}>
            <div className="flex items-center gap-2">
              <span className="text-lg">{categoria?.icon}</span>
              <Badge
                className={getBadgeColorByCategoria(row.original.categoria)}
              >
                {categoria?.label || row.original.categoria}
              </Badge>
            </div>
          </Tooltip>
        );
      },
    },
    {
      header: 'Fecha',
      accessorKey: 'fecha',
      cell: ({ row }) => (
        <div className="text-sm">
          {new Date(row.original.fecha).toLocaleDateString('es-AR')}
        </div>
      ),
    },
    {
      header: 'Proveedor',
      accessorKey: 'proveedor',
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.proveedor?.nombre || 'Sin proveedor'}
        </div>
      ),
    },
    {
      header: 'Recurrente',
      accessorKey: 'esRecurrente',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.esRecurrente ? (
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {row.original.frecuencia || 'Sí'}
            </Badge>
          ) : (
            <span className="text-gray-400">No</span>
          )}
        </div>
      ),
    },
    {
      header: 'Estado',
      accessorKey: 'activo',
      cell: ({ row }) => (
        <Badge
          className={row.original.activo 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }
        >
          {row.original.activo ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
    {
      header: 'Acciones',
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Tooltip title="Ver detalles">
            <Button
              size="xs"
              variant="plain"
              icon={<HiOutlineEye />}
              onClick={() => onView(row.original)}
            />
          </Tooltip>
          <Tooltip title="Editar">
            <Button
              size="xs"
              variant="plain"
              icon={<HiOutlinePencil />}
              onClick={() => onEdit(row.original)}
            />
          </Tooltip>
          <Tooltip title="Asignar a proyectos">
            <Button
              size="xs"
              variant="plain"
              className="text-blue-600 hover:text-blue-800"
              onClick={() => onAsignar(row.original)}
            >
              Asignar
            </Button>
          </Tooltip>
          <Tooltip title="Eliminar">
            <Button
              size="xs"
              variant="plain"
              icon={<HiOutlineTrash />}
              className="text-red-600 hover:text-red-800"
              onClick={() => onDelete(row.original.id)}
            />
          </Tooltip>
        </div>
      ),
    },
  ], [onEdit, onDelete, onView, onAsignar]);

  const getBadgeColorByCategoria = (categoria: string): string => {
    switch (categoria) {
      case CategoriaGasto.OFICINA:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case CategoriaGasto.PERSONAL:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case CategoriaGasto.MARKETING:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case CategoriaGasto.TECNOLOGIA:
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      case CategoriaGasto.SERVICIOS:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case CategoriaGasto.TRANSPORTE:
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case CategoriaGasto.COMUNICACION:
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200';
      case CategoriaGasto.OTROS:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header con acciones */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Gastos Operativos
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestión de costos operativos de la empresa
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="solid"
            icon={<HiOutlinePlus />}
            onClick={() => navigate('/gastos/new')}
          >
            Nuevo Gasto
          </Button>
        </div>
      </div>

      {/* Mostrar error si existe */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <p className="text-red-600">Error: {error}</p>
        </motion.div>
      )}

      {/* Tabla de datos */}
      <DataTable
        columns={columns}
        data={gastos}
        loading={loading}
        skeletonAvatarColumns={[1]}
        pagingData={{
          total: gastos.length,
          pageIndex: 0,
          pageSize: 10,
        }}
      />
    </motion.div>
  );
};

export default GastoList;
