import React from 'react';
import { Card } from '@/components/ui';
import useProducto from '@/modules/producto/hooks/useProducto';
import { ProductoList } from '@/modules/producto/components/ProductoList';
import { ProductoForm } from '@/modules/producto/components/ProductoForm';
import { CreateProductoDTO, UpdateProductoDTO } from '@/modules/producto/types';

export default function ProductoView() {
  const {
    productos,
    loading,
    error,
    selectedProducto,
    createProducto,
    updateProducto,
    deleteProducto,
    selectProducto,
  } = useProducto();

  const handleSubmit = async (data: CreateProductoDTO | UpdateProductoDTO) => {
    try {
      if (selectedProducto) {
        await updateProducto(selectedProducto.id, data as UpdateProductoDTO);
        selectProducto(null);
      } else {
        await createProducto(data as CreateProductoDTO);
      }
    } catch (err) {
      console.error('Error en operación:', err);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Productos</h1>
      </div>

      <Card>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">
            {selectedProducto ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <ProductoForm
            initialValues={selectedProducto || undefined}
            onSubmit={handleSubmit}
            onCancel={selectedProducto ? () => selectProducto(null) : undefined}
          />
        </div>
      </Card>

      <Card>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Lista de Productos</h2>
          <ProductoList
            productos={productos}
            loading={loading}
            error={error}
            onEdit={selectProducto}
            onDelete={deleteProducto}
          />
        </div>
      </Card>
    </div>
  );
}
