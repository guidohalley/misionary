import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Pagination, Input, Notification, toast, Switcher } from '@/components/ui';
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye, HiOutlinePlus } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useImpuesto } from '@/modules/impuesto/hooks/useImpuesto';
import type { Impuesto } from '@/modules/impuesto/types';

interface ImpuestoListProps {
  className?: string;
}

const ImpuestoList: React.FC<ImpuestoListProps> = ({ className }) => {
  const navigate = useNavigate();
  const { impuestos, loading, error, deleteImpuesto, toggleImpuesto, refreshImpuestos } = useImpuesto();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredImpuestos, setFilteredImpuestos] = useState<Impuesto[]>([]);

  useEffect(() => {
    refreshImpuestos();
  }, [refreshImpuestos]);

  useEffect(() => {
    let filtered = impuestos.filter(impuesto =>
      impuesto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      impuesto.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredImpuestos(filtered);
    setCurrentPage(1);
  }, [impuestos, searchTerm]);

  const handleEdit = (id: number) => {
    navigate(`/impuestos/editar/${id}`);
  };

  const handleView = (id: number) => {
    navigate(`/impuestos/view/${id}`);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteImpuesto(id);
      toast.push(
        <Notification title="Éxito" type="success">
          Impuesto eliminado correctamente
        </Notification>
      );
    } catch (error) {
      toast.push(
        <Notification title="Error" type="danger">
          Error al eliminar el impuesto
        </Notification>
      );
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await toggleImpuesto(id);
      toast.push(
        <Notification title="Éxito" type="success">
          Estado del impuesto actualizado
        </Notification>
      );
    } catch (error) {
      toast.push(
        <Notification title="Error" type="danger">
          Error al cambiar el estado del impuesto
        </Notification>
      );
    }
  };

  const handleNewImpuesto = () => {
    navigate('/impuestos/nuevo');
  };

  const formatPorcentaje = (porcentaje: number) => {
    return `${porcentaje}%`;
  };

  const totalItems = filteredImpuestos.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentItems = filteredImpuestos.slice(startIndex, endIndex);

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
        <Button onClick={refreshImpuestos} className="mt-4">
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Impuestos</h2>
          <p className="text-gray-600 dark:text-gray-400">Gestiona los impuestos del sistema</p>
        </div>
        <Button 
          variant="solid" 
          icon={<HiOutlinePlus />}
          onClick={handleNewImpuesto}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Nuevo Impuesto
        </Button>
      </div>

      <Card className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Buscar por nombre o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
        </div>

        {/* Vista Desktop - Tabla */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Nombre</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Porcentaje</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Descripción</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Estado</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((impuesto, index) => (
                <motion.tr
                  key={impuesto.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900 dark:text-gray-100">{impuesto.nombre}</div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="font-semibold text-blue-600 dark:text-blue-400">
                      {formatPorcentaje(impuesto.porcentaje)}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-gray-600 dark:text-gray-400 truncate max-w-xs">
                      {impuesto.descripcion || '-'}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Switcher
                      checked={impuesto.activo}
                      onChange={() => handleToggle(impuesto.id)}
                      size="sm"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => handleView(impuesto.id)}
                        className="p-2 rounded-full text-gray-700 dark:text-blue-300 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-700 hover:shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900/50 active:shadow-inner transition-all duration-200"
                        title="Ver impuesto"
                      >
                        <HiOutlineEye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(impuesto.id)}
                        className="p-2 rounded-full text-gray-700 dark:text-amber-300 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-700 hover:shadow-lg hover:shadow-amber-200 dark:hover:shadow-amber-900/50 active:shadow-inner transition-all duration-200"
                        title="Editar impuesto"
                      >
                        <HiOutlinePencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(impuesto.id)}
                        className="p-2 rounded-full text-gray-700 dark:text-red-300 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-700 hover:shadow-lg hover:shadow-red-200 dark:hover:shadow-red-900/50 active:shadow-inner transition-all duration-200"
                        title="Eliminar impuesto"
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

        {/* Vista Mobile - Cards */}
        <div className="md:hidden space-y-4">
          {currentItems.map((impuesto, index) => (
            <motion.div
              key={impuesto.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Header con Nombre */}
              <div className="mb-3">
                <div className="text-lg font-bold text-gray-900 dark:text-white">{impuesto.nombre}</div>
              </div>

              {/* Porcentaje */}
              <div className="mb-3">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Porcentaje</div>
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {impuesto.porcentaje}%
                </div>
              </div>

              {/* Descripción */}
              <div className="mb-3">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Descripción</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {impuesto.descripcion || 'Sin descripción'}
                </div>
              </div>

              {/* Estado */}
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Estado</div>
                <Badge 
                  className={impuesto.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                >
                  {impuesto.activo ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>

              {/* Acciones */}
              <div className="flex justify-center space-x-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => handleEdit(impuesto.id)}
                  className="p-2 rounded-full text-gray-700 dark:text-amber-300 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-700 hover:shadow-lg hover:shadow-amber-200 dark:hover:shadow-amber-900/50 active:shadow-inner transition-all duration-200"
                  title="Editar"
                >
                  <HiOutlinePencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(impuesto.id)}
                  className="p-2 rounded-full text-gray-700 dark:text-red-300 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-700 hover:shadow-lg hover:shadow-red-200 dark:hover:shadow-red-900/50 active:shadow-inner transition-all duration-200"
                  title="Eliminar"
                >
                  <HiOutlineTrash className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
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
            <p className="text-gray-600 dark:text-gray-400">No se encontraron impuestos</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ImpuestoList;
