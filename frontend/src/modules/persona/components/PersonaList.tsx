import React, { useMemo } from 'react';
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from 'react-icons/hi';
import { Persona } from '../types';
import { Button, Badge, Tag, Tooltip } from '@/components/ui';
import DataTable from '@/components/shared/DataTable';
import { ColumnDef } from '@tanstack/react-table';

interface PersonaListProps {
  personas: Persona[];
  loading: boolean;
  error: string | null;
  onEdit: (persona: Persona) => void;
  onDelete: (id: number) => void;
  onView?: (persona: Persona) => void;
}

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
          {row.original.roles.map((rol: string) => {
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
              <Tag key={rol} className={`text-xs`} color={getRoleColor(rol)}>
                {getRoleDisplayName(rol)}
              </Tag>
            );
          })}
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
              <Button
                shape="circle"
                variant="plain"
                size="sm"
                icon={<HiOutlineEye />}
                onClick={() => onView(row.original)}
              />
            </Tooltip>
          )}
          <Tooltip title="Editar">
            <Button
              shape="circle"
              variant="plain"
              size="sm"
              icon={<HiOutlinePencil />}
              onClick={() => onEdit(row.original)}
            />
          </Tooltip>
          <Tooltip title="Eliminar">
            <Button
              shape="circle"
              variant="plain"
              size="sm"
              color="red-600"
              icon={<HiOutlineTrash />}
              onClick={() => onDelete(row.original.id)}
            />
          </Tooltip>
        </div>
      ),
      size: 120,
    },
  ], [onEdit, onDelete, onView]);

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-2">Error al cargar personas</div>
        <div className="text-sm text-gray-500">{error}</div>
      </div>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={personas}
      loading={loading}
      skeletonAvatarColumns={[1]}
      selectable={false}
    />
  );
};

export default PersonaList;
