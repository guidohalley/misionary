import React from 'react';
import { Presupuesto, estadoPresupuestoOptions } from '../types';
import { Button, Badge } from '@/components/ui';
import DataTable from '@/components/shared/DataTable';
import { EstadoPresupuesto } from '@prisma/client';

interface PresupuestoListProps {
  presupuestos: Presupuesto[];
  loading: boolean;
  error: string | null;
  onEdit: (presupuesto: Presupuesto) => void;
  onDelete: (id: number) => void;
  onChangeStatus: (id: number, estado: EstadoPresupuesto) => void;
}

const getEstadoBadgeColor = (estado: EstadoPresupuesto) => {
  switch (estado) {
    case 'BORRADOR':
      return 'bg-gray-100 text-gray-800';
    case 'ENVIADO':
      return 'bg-blue-100 text-blue-800';
    case 'APROBADO':
      return 'bg-green-100 text-green-800';
    case 'FACTURADO':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function PresupuestoList({
  presupuestos,
  loading,
  error,
  onEdit,
  onDelete,
  onChangeStatus,
}: PresupuestoListProps) {
  const columns = [
    {
      header: 'Cliente',
      accessorKey: 'cliente.nombre',
    },
    {
      header: 'Subtotal',
      accessorKey: 'subtotal',
      cell: ({ row }: any) => (
        <span>$ {row.original.subtotal.toFixed(2)}</span>
      ),
    },
    {
      header: 'Impuestos',
      accessorKey: 'impuestos',
      cell: ({ row }: any) => (
        <span>$ {row.original.impuestos.toFixed(2)}</span>
      ),
    },
    {
      header: 'Total',
      accessorKey: 'total',
      cell: ({ row }: any) => (
        <span className="font-semibold">$ {row.original.total.toFixed(2)}</span>
      ),
    },
    {
      header: 'Estado',
      accessorKey: 'estado',
      cell: ({ row }: any) => (
        <Badge className={getEstadoBadgeColor(row.original.estado)}>
          {estadoPresupuestoOptions.find(opt => opt.value === row.original.estado)?.label}
        </Badge>
      ),
    },
    {
      header: 'Fecha',
      accessorKey: 'createdAt',
      cell: ({ row }: any) => (
        <span>{new Date(row.original.createdAt).toLocaleDateString()}</span>
      ),
    },
    {
      header: 'Acciones',
      id: 'actions',
      cell: ({ row }: any) => (
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onEdit(row.original)}
          >
            Editar
          </Button>
          {row.original.estado === 'BORRADOR' && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete(row.original.id)}
            >
              Eliminar
            </Button>
          )}
          {row.original.estado === 'BORRADOR' && (
            <Button
              variant="success"
              size="sm"
              onClick={() => onChangeStatus(row.original.id, 'ENVIADO')}
            >
              Enviar
            </Button>
          )}
          {row.original.estado === 'ENVIADO' && (
            <Button
              variant="success"
              size="sm"
              onClick={() => onChangeStatus(row.original.id, 'APROBADO')}
            >
              Aprobar
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded">
        Error: {error}
      </div>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={presupuestos}
      loading={loading}
      searchPlaceholder="Buscar presupuestos..."
    />
  );
}

export default PresupuestoList;
