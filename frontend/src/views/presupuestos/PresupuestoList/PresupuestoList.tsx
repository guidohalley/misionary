import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Pagination, Select, Input, Notification, toast } from '@/components/ui';
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye, HiOutlineCheck, HiOutlineMail, HiOutlinePrinter } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePresupuesto } from '@/modules/presupuesto/hooks/usePresupuesto';
import { EstadoPresupuesto } from '../schemas';
import type { Presupuesto } from '@/modules/presupuesto/types';
import useAuth from '@/utils/hooks/useAuth';

interface PresupuestoListProps {
  className?: string;
}

const PresupuestoList: React.FC<PresupuestoListProps> = ({ className }) => {
  const navigate = useNavigate();
  const { presupuestos, loading, error, refreshPresupuestos, deletePresupuesto, updateEstado } = usePresupuesto();
  const { user } = useAuth();
  
  // Función para determinar si se puede editar un presupuesto
  const canEditPresupuesto = (estado: EstadoPresupuesto) => {
    const isAdmin = user?.authority?.includes('ADMIN');
    
    // BORRADOR: cualquier usuario puede editar
    if (estado === EstadoPresupuesto.BORRADOR) return true;
    
    // APROBADO: solo ADMIN puede editar
    if (estado === EstadoPresupuesto.APROBADO && isAdmin) return true;
    
    // FACTURADO: nadie puede editar
    return false;
  };
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState<EstadoPresupuesto | ''>('');
  const [filteredPresupuestos, setFilteredPresupuestos] = useState<Presupuesto[]>([]);

  useEffect(() => {
    refreshPresupuestos();
  }, [refreshPresupuestos]);

  useEffect(() => {
    let filtered = presupuestos.filter(presupuesto =>
      presupuesto.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      presupuesto.id.toString().includes(searchTerm)
    );

    if (estadoFilter) {
      filtered = filtered.filter(presupuesto => presupuesto.estado === estadoFilter);
    }

    setFilteredPresupuestos(filtered);
    setCurrentPage(1);
  }, [presupuestos, searchTerm, estadoFilter]);

  const handleEdit = (id: number) => {
    navigate(`/presupuestos/edit/${id}`);
  };

  const handleView = (id: number) => {
    navigate(`/presupuestos/view/${id}`);
  };

  const handlePrint = (id: number) => {
    // Abrir una nueva ventana con el presupuesto para imprimir
    window.open(`/presupuestos/view/${id}`, '_blank');
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar este presupuesto?')) {
      try {
        await deletePresupuesto(id);
        toast.push(
          <Notification title="Éxito" type="success">
            Presupuesto eliminado correctamente
          </Notification>
        );
      } catch (error) {
        toast.push(
          <Notification title="Error" type="danger">
            Error al eliminar el presupuesto
          </Notification>
        );
      }
    }
  };

  const handleChangeEstado = async (id: number, nuevoEstado: EstadoPresupuesto) => {
    try {
      await updateEstado(id, nuevoEstado);
      toast.push(
        <Notification title="Éxito" type="success">
          Estado del presupuesto actualizado
        </Notification>
      );
    } catch (error) {
      toast.push(
        <Notification title="Error" type="danger">
          Error al cambiar el estado
        </Notification>
      );
    }
  };

  const handleNewPresupuesto = () => {
    navigate('/presupuestos/new');
  };

  const getEstadoBadge = (estado: EstadoPresupuesto) => {
    const variants = {
      [EstadoPresupuesto.BORRADOR]: 'bg-gray-100 text-gray-800',
      [EstadoPresupuesto.ENVIADO]: 'bg-blue-100 text-blue-800',
      [EstadoPresupuesto.APROBADO]: 'bg-green-100 text-green-800',
      [EstadoPresupuesto.FACTURADO]: 'bg-purple-100 text-purple-800',
    };
    return variants[estado] || 'bg-gray-100 text-gray-800';
  };

  const getNextEstado = (estadoActual: EstadoPresupuesto): EstadoPresupuesto | null => {
    const flow = {
      [EstadoPresupuesto.BORRADOR]: EstadoPresupuesto.ENVIADO,
      [EstadoPresupuesto.ENVIADO]: EstadoPresupuesto.APROBADO,
      [EstadoPresupuesto.APROBADO]: EstadoPresupuesto.FACTURADO,
      [EstadoPresupuesto.FACTURADO]: null,
    };
    return flow[estadoActual] || null;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  const totalItems = filteredPresupuestos.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentItems = filteredPresupuestos.slice(startIndex, endIndex);

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
        <Button onClick={() => refreshPresupuestos()} className="mt-4">
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Presupuestos</h2>
          <p className="text-gray-600">Gestiona los presupuestos de clientes</p>
        </div>
        <Button 
          variant="solid" 
          onClick={handleNewPresupuesto}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Nuevo Presupuesto
        </Button>
      </div>

      <Card className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Buscar por cliente o número..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <Select
              value={estadoFilter ? { value: estadoFilter, label: estadoFilter } : { value: '', label: 'Todos los estados' }}
              onChange={(opt: any) => setEstadoFilter(opt?.value || '')}
              options={[
                { value: '', label: 'Todos los estados' },
                { value: EstadoPresupuesto.BORRADOR, label: 'Borrador' },
                { value: EstadoPresupuesto.ENVIADO, label: 'Enviado' },
                { value: EstadoPresupuesto.APROBADO, label: 'Aprobado' },
                { value: EstadoPresupuesto.FACTURADO, label: 'Facturado' },
              ]}
            />
            <Select
              value={{ value: pageSize, label: `${pageSize} por página` }}
              onChange={(opt: any) => setPageSize(opt?.value || 10)}
              options={[
                { value: 10, label: '10 por página' },
                { value: 25, label: '25 por página' },
                { value: 50, label: '50 por página' },
              ]}
            />
          </div>
          <div className="text-sm text-gray-600">
            Mostrando {startIndex + 1}-{Math.min(endIndex, totalItems)} de {totalItems} presupuestos
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">#</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Cliente</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Total</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Fecha</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Vigencia</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((presupuesto, index) => {
                const nextEstado = getNextEstado(presupuesto.estado);
                return (
                  <motion.tr
                    key={presupuesto.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">#{presupuesto.id}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{presupuesto.cliente.nombre}</div>
                      <div className="text-sm text-gray-500">{presupuesto.cliente.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-green-600">
                        {formatPrice(presupuesto.total)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getEstadoBadge(presupuesto.estado)}>
                        {presupuesto.estado}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-600">
                        {new Date(presupuesto.createdAt).toLocaleDateString('es-AR')}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {presupuesto.periodoInicio ? (
                        <div className="text-gray-600">
                          {new Date(presupuesto.periodoInicio).toLocaleDateString('es-AR')} {presupuesto.periodoFin ? `→ ${new Date(presupuesto.periodoFin).toLocaleDateString('es-AR')}` : ''}
                        </div>
                      ) : (
                        <div className="text-gray-400">-</div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center space-x-2">
                        <Button
                          size="sm"
                          variant="twoTone"
                          icon={<HiOutlineEye />}
                          onClick={() => handleView(presupuesto.id)}
                          className="text-blue-600 hover:text-blue-700"
                          title="Ver presupuesto"
                        />
                        <Button
                          size="sm"
                          variant="twoTone"
                          icon={<HiOutlinePrinter />}
                          onClick={() => handlePrint(presupuesto.id)}
                          className="text-gray-600 hover:text-gray-700"
                          title="Imprimir presupuesto"
                        />
                        {canEditPresupuesto(presupuesto.estado) && (
                          <Button
                            size="sm"
                            variant="twoTone"
                            icon={<HiOutlinePencil />}
                            onClick={() => handleEdit(presupuesto.id)}
                            className="text-amber-600 hover:text-amber-700"
                            title="Editar presupuesto"
                          />
                        )}
                        {nextEstado && (
                          <Button
                            size="sm"
                            variant="twoTone"
                            icon={nextEstado === EstadoPresupuesto.ENVIADO ? <HiOutlineMail /> : <HiOutlineCheck />}
                            onClick={() => handleChangeEstado(presupuesto.id, nextEstado)}
                            className="text-green-600 hover:text-green-700"
                            title={`Cambiar a ${nextEstado}`}
                          />
                        )}
                        {presupuesto.estado === EstadoPresupuesto.BORRADOR && (
                          <Button
                            size="sm"
                            variant="twoTone"
                            icon={<HiOutlineTrash />}
                            onClick={() => handleDelete(presupuesto.id)}
                            className="text-red-600 hover:text-red-700"
                            title="Eliminar presupuesto"
                          />
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
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
            <p className="text-gray-600">No se encontraron presupuestos</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PresupuestoList;
