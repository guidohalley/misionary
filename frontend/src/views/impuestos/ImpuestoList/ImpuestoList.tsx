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
          <h2 className="text-2xl font-bold text-gray-900">Impuestos</h2>
          <p className="text-gray-600">Gestiona los impuestos del sistema</p>
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

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Nombre</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Porcentaje</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Descripción</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Estado</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((impuesto, index) => (
                <motion.tr
                  key={impuesto.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{impuesto.nombre}</div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="font-semibold text-blue-600">
                      {formatPorcentaje(impuesto.porcentaje)}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-gray-600 truncate max-w-xs">
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
                    <div className="flex justify-center space-x-2">
                      <Button
                        size="sm"
                        variant="twoTone"
                        icon={<HiOutlineEye />}
                        onClick={() => handleView(impuesto.id)}
                        className="text-blue-600 hover:text-blue-700"
                        title="Ver impuesto"
                      />
                      <Button
                        size="sm"
                        variant="twoTone"
                        icon={<HiOutlinePencil />}
                        onClick={() => handleEdit(impuesto.id)}
                        className="text-amber-600 hover:text-amber-700"
                        title="Editar impuesto"
                      />
                      <Button
                        size="sm"
                        variant="twoTone"
                        icon={<HiOutlineTrash />}
                        onClick={() => handleDelete(impuesto.id)}
                        className="text-red-600 hover:text-red-700"
                        title="Eliminar impuesto"
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
            <p className="text-gray-600">No se encontraron impuestos</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ImpuestoList;
