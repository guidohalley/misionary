import React from 'react';
import { Item } from '../types';
import { Button, Table } from '@/components/ui';

interface ItemListProps {
  items: Item[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

export function ItemList({ items, onEdit, onDelete }: ItemListProps) {
  const calcularSubtotal = (item: Item) => {
    return item.cantidad * item.precioUnitario;
  };

  return (
    <Table>
      <Table.THead>
        <Table.Tr>
          <Table.Th>Producto/Servicio</Table.Th>
          <Table.Th>Cantidad</Table.Th>
          <Table.Th>Precio Unitario</Table.Th>
          <Table.Th>Subtotal</Table.Th>
          <Table.Th>Acciones</Table.Th>
        </Table.Tr>
      </Table.THead>
      <Table.TBody>
        {items.map((item, index) => (
          <Table.Tr key={index}>
            <Table.Td>
              {item.producto
                ? item.producto.nombre
                : item.servicio
                ? item.servicio.nombre
                : 'N/A'}
            </Table.Td>
            <Table.Td>{item.cantidad}</Table.Td>
            <Table.Td>$ {item.precioUnitario.toFixed(2)}</Table.Td>
            <Table.Td>$ {calcularSubtotal(item).toFixed(2)}</Table.Td>
            <Table.Td>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => onEdit(index)}
                >
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => onDelete(index)}
                >
                  Eliminar
                </Button>
              </div>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.TBody>
    </Table>
  );
}

export default ItemList;
