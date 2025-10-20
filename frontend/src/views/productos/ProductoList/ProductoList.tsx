import React, { useState, useEffect } from 'react';
import { Card, Button, Pagination, Select, Input, Notification, toast } from '@/components/ui';
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

  // Opciones de tamaño de página tipadas para Select
  const pageSizeOptions: { value: number; label: string }[] = [
    { value: 10, label: '10 por página' },
    { value: 25, label: '25 por página' },
    { value: 50, label: '50 por página' },
  ];
  const selectedPageSize = pageSizeOptions.find(o => o.value === pageSize) || pageSizeOptions[0];

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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Productos</h2>
          <p className="text-gray-600 dark:text-gray-400">Gestiona el catálogo de productos</p>
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
              value={selectedPageSize}
              onChange={(opt: { value: number; label: string } | null) => {
                if (opt && typeof opt.value === 'number') setPageSize(opt.value)
              }}
              options={pageSizeOptions}
              isSearchable={false}
            />
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Mostrando {startIndex + 1}-{Math.min(endIndex, totalItems)} de {totalItems} productos
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Nombre</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Precio</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Proveedor</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Fecha Creación</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 min-w-[120px]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((producto, index) => (
                <motion.tr
                  key={producto.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900 dark:text-gray-100">{producto.nombre}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center rounded-full bg-misionary-100 text-misionary-800 px-2.5 py-0.5 text-xs font-medium ring-1 ring-misionary-200">
                      {formatPrice(producto.precio)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center rounded-full bg-msgray-100 text-msgray-800 px-2 py-0.5 text-xs font-medium ring-1 ring-msgray-200 dark:bg-gray-700 dark:text-gray-200 dark:ring-gray-600">
                      {producto.proveedor?.nombre || 'Sin proveedor'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-gray-600 dark:text-gray-400">
                      {new Date(producto.createdAt).toLocaleDateString('es-AR')}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => handleEdit(producto.id)}
                        className="p-2 rounded-full text-gray-700 dark:text-blue-300 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-700 hover:shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900/50 active:shadow-inner transition-all duration-200"
                        title="Ver/Editar"
                      >
                        <HiOutlineEye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(producto.id)}
                        className="p-2 rounded-full text-gray-700 dark:text-amber-300 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-700 hover:shadow-lg hover:shadow-amber-200 dark:hover:shadow-amber-900/50 active:shadow-inner transition-all duration-200"
                        title="Editar"
                      >
                        <HiOutlinePencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(producto.id)}
                        className="p-2 rounded-full text-gray-700 dark:text-red-300 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-700 hover:shadow-lg hover:shadow-red-200 dark:hover:shadow-red-900/50 active:shadow-inner transition-all duration-200"
                        title="Eliminar"
                      >
                        <HiOutlineTrash className="w-5 h-5" />
                      </button>
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
            <p className="text-gray-600 dark:text-gray-400">No se encontraron productos</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProductoList;
