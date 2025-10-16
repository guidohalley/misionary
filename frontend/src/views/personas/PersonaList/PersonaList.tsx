import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from 'react-icons/hi';
import { Persona, PersonaListProps } from '../types';
import { Button, Badge, Tag, Tooltip } from '@/components/ui';
import DataTable from '@/components/shared/DataTable';
import { ColumnDef } from '@tanstack/react-table';

const PersonaList: React.FC<PersonaListProps> = ({
  personas,
  loading,
  error,
  onEdit,
  onDelete,
  onView,
}) => {
  const columns = useMemo<ColumnDef<Persona>[]>(() => [
    {
      header: 'ID',
      accessorKey: 'id',
      size: 70,
    },
    {
      header: 'Nombre',
      accessorKey: 'nombre',
      cell: ({ row }) => (
        <div className="flex items-center">
          <div className="font-medium text-gray-900 dark:text-gray-100">
            {row.original.nombre}
          </div>
        </div>
      ),
    },
    {
      header: 'Email',
      accessorKey: 'email',
      cell: ({ row }) => (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {row.original.email}
        </div>
      ),
    },
    {
      header: 'Tipo',
      accessorKey: 'tipo',
      cell: ({ row }) => {
        const tipo = row.original.tipo;
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
          <Badge className={getBadgeColor(tipo)}>
            {getDisplayName(tipo)}
          </Badge>
        );
      },
    },
    {
      header: 'Teléfono',
      accessorKey: 'telefono',
      cell: ({ row }) => (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {row.original.telefono || '-'}
        </div>
      ),
    },
    {
      header: 'Roles',
      accessorKey: 'roles',
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {Array.isArray(row.original.roles) && row.original.roles.length > 0 ? (
            row.original.roles.map((rol: string, index: number) => {
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
                <Tag key={`${row.original.id}-${rol}-${index}`} className={`text-xs`} color={getRoleColor(rol)}>
                  {getRoleDisplayName(rol)}
                </Tag>
              );
            })
          ) : (
            <span className="text-xs text-gray-500">Sin roles</span>
          )}
        </div>
      ),
    },
    {
      header: 'Acciones',
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {onView && (
            <Tooltip title="Ver detalles">
              <button
                className="p-2 rounded-full transition-all duration-200 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 hover:shadow-md hover:shadow-blue-200 dark:hover:shadow-blue-900/30 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => onView(row.original)}
              >
                <HiOutlineEye className="w-4 h-4" />
              </button>
            </Tooltip>
          )}
          <Tooltip title="Editar">
            <button
              className="p-2 rounded-full transition-all duration-200 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 hover:shadow-md hover:shadow-amber-200 dark:hover:shadow-amber-900/30 text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400"
              onClick={() => onEdit(row.original)}
            >
                <HiOutlinePencil className="w-4 h-4" />
              </button>
          </Tooltip>
          <Tooltip title="Eliminar">
            <button
              className="p-2 rounded-full transition-all duration-200 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 hover:shadow-md hover:shadow-red-200 dark:hover:shadow-red-900/30 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400"
              onClick={() => onDelete(row.original.id)}
            >
                <HiOutlineTrash className="w-4 h-4" />
              </button>
          </Tooltip>
        </div>
      ),
      size: 120,
    },
  ], [onEdit, onDelete, onView]);

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <DataTable
        columns={columns}
        data={personas}
        loading={loading}
        skeletonAvatarColumns={[1]}
        selectable={false}
      />
    </motion.div>
  );
};

export default PersonaList;
