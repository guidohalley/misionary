import React from 'react';
import { Producto } from '../types';
import { Button } from '@/components/ui';
import DataTable from '@/components/shared/DataTable';

interface ProductoListProps {
  productos: Producto[];
  loading: boolean;
  error: string | null;
  onEdit: (producto: Producto) => void;
  onDelete: (id: number) => void;
}

const columns = [
  {
    header: 'Nombre',
    accessorKey: 'nombre',
  },
  {
    header: 'Precio',
    accessorKey: 'precio',
    cell: ({ row }: any) => (
      <span>$ {row.original.precio.toFixed(2)}</span>
    ),
  },
  {
    header: 'Proveedor',
    accessorKey: 'proveedor.nombre',
  },
  {
    header: 'Acciones',
    id: 'actions',
    cell: ({ row }: any) => (
      <div className="flex gap-2">
        <Button
          variant="solid"
          size="sm"
          onClick={() => row.original.onEdit(row.original)}
        >
          Editar
        </Button>
        <Button
          variant="solid"
          size="sm"
          color="red-600"
          onClick={() => row.original.onDelete(row.original.id)}
        >
          Eliminar
        </Button>
      </div>
    ),
  },
];

export function ProductoList({
  productos,
  loading,
  error,
  onEdit,
  onDelete,
}: ProductoListProps) {
  const data = React.useMemo(
    () =>
      productos.map(producto => ({
        ...producto,
        onEdit,
        onDelete,
      })),
    [productos, onEdit, onDelete]
  );

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
      data={data}
      loading={loading}
    />
  );
}

export default ProductoList;
