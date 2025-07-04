import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Pagination, Select, Input, Notification, toast } from '@/components/ui';
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProducto } from '@/modules/producto/hooks/useProducto';
import type { Producto } from '@/modules/producto/types';

interface ProductoListProps {
  className?: string;
}

const ProductoList: React.FC<ProductoListProps> = ({ className }) => {
  const navigate = useNavigate();
  const { productos, loading, error, refreshProductos, deleteProducto } = useProducto();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProductos, setFilteredProductos] = useState<Producto[]>([]);

  useEffect(() => {
    refreshProductos();
  }, [refreshProductos]);

  useEffect(() => {
    const filtered = productos.filter(producto =>
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.proveedor?.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProductos(filtered);
    setCurrentPage(1);
  }, [productos, searchTerm]);

  const handleEdit = (id: number) => {
    navigate(`/productos/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar este producto?')) {
      try {
        await deleteProducto(id);
        toast.push(
          <Notification title="Éxito" type="success">
            Producto eliminado correctamente
          </Notification>
        );
      } catch (error) {
        toast.push(
          <Notification title="Error" type="danger">
            Error al eliminar el producto
          </Notification>
        );
      }
    }
  };

  const handleNewProducto = () => {
    navigate('/productos/new');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  const totalItems = filteredProductos.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentItems = filteredProductos.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error: {error}</p>
        <Button onClick={() => refreshProductos()} className="mt-4">
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Productos</h2>
          <p className="text-gray-600">Gestiona el catálogo de productos</p>
        </div>
        <Button 
          variant="solid" 
          onClick={handleNewProducto}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Nuevo Producto
        </Button>
      </div>

      <Card className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <Select
              value={pageSize}
              onChange={setPageSize}
              options={[
                { value: 10, label: '10 por página' },
                { value: 25, label: '25 por página' },
                { value: 50, label: '50 por página' },
              ]}
            />
          </div>
          <div className="text-sm text-gray-600">
            Mostrando {startIndex + 1}-{Math.min(endIndex, totalItems)} de {totalItems} productos
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Nombre</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Precio</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Proveedor</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Fecha Creación</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((producto, index) => (
                <motion.tr
                  key={producto.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{producto.nombre}</div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge className="bg-green-100 text-green-800">
                      {formatPrice(producto.precio)}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-gray-900">{producto.proveedor?.nombre || 'Sin proveedor'}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-gray-600">
                      {new Date(producto.createdAt).toLocaleDateString('es-AR')}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center space-x-2">
                      <Button
                        size="sm"
                        variant="twoTone"
                        icon={<HiOutlineEye />}
                        onClick={() => handleEdit(producto.id)}
                        className="text-blue-600 hover:text-blue-700"
                      />
                      <Button
                        size="sm"
                        variant="twoTone"
                        icon={<HiOutlinePencil />}
                        onClick={() => handleEdit(producto.id)}
                        className="text-amber-600 hover:text-amber-700"
                      />
                      <Button
                        size="sm"
                        variant="twoTone"
                        icon={<HiOutlineTrash />}
                        onClick={() => handleDelete(producto.id)}
                        className="text-red-600 hover:text-red-700"
                      />
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <Pagination
              pageSize={pageSize}
              currentPage={currentPage}
              total={totalItems}
              onChange={setCurrentPage}
            />
          </div>
        )}

        {currentItems.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">No se encontraron productos</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProductoList;
