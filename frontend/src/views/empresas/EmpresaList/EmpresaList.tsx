import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Select, Input, Notification, toast, Avatar, Dialog } from '@/components/ui';
import { 
  HiOutlinePencil, 
  HiOutlineTrash, 
  HiOutlineEye, 
  HiOutlineOfficeBuilding,
  HiOutlineSearch,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineIdentification
} from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEmpresa } from '@/modules/empresa/hooks/useEmpresa';
import type { Empresa } from '@/modules/empresa/types';

interface EmpresaListProps {
  className?: string;
}

const EmpresaList: React.FC<EmpresaListProps> = ({ className }) => {
  const navigate = useNavigate();
  const { empresas, loading, error, refreshEmpresas, deleteEmpresa } = useEmpresa();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [filteredEmpresas, setFilteredEmpresas] = useState<Empresa[]>([]);
  
  // Estado para modal de confirmación de eliminación
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    empresa: Empresa | null;
  }>({
    isOpen: false,
    empresa: null
  });

  useEffect(() => {
    refreshEmpresas();
  }, [refreshEmpresas]);

  useEffect(() => {
    let filtered = empresas.filter(empresa => {
      const matchesSearch = searchTerm === '' || 
        empresa.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        empresa.razonSocial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        empresa.cuit?.includes(searchTerm) ||
        empresa.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && empresa.activo) ||
        (statusFilter === 'inactive' && !empresa.activo);
      
      return matchesSearch && matchesStatus;
    });
    
    setFilteredEmpresas(filtered);
    setCurrentPage(1);
  }, [empresas, searchTerm, statusFilter]);

  const handleEdit = (id: number) => {
    navigate(`/empresas/edit/${id}`);
  };

  const handleView = (id: number) => {
    navigate(`/empresas/${id}`);
  };

  const handleDeleteClick = (empresa: Empresa) => {
    setDeleteModal({ isOpen: true, empresa });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.empresa) return;
    
    try {
      await deleteEmpresa(deleteModal.empresa.id);
      toast.push(
        <Notification title="Éxito" type="success">
          Empresa eliminada correctamente
        </Notification>
      );
    } catch (error) {
      toast.push(
        <Notification title="Error" type="danger">
          Error al eliminar la empresa
        </Notification>
      );
    } finally {
      setDeleteModal({ isOpen: false, empresa: null });
    }
  };

  const handleNewEmpresa = () => {
    navigate('/empresas/new');
  };

  const totalItems = filteredEmpresas.length;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentItems = filteredEmpresas.slice(startIndex, endIndex);

  if (loading && empresas.length === 0) {
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
        <Button onClick={() => refreshEmpresas()} className="mt-4">
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header Card */}
      <Card className="mb-6 p-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Empresas</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Gestiona las empresas y sus datos comerciales</p>
          </div>
          <Button 
            variant="solid" 
            onClick={handleNewEmpresa}
            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
          >
            Nueva Empresa
          </Button>
        </div>
      </Card>

      <Card className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Buscar empresas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
              prefix={<HiOutlineSearch className="h-4 w-4 text-gray-400" />}
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: 'all', label: 'Todas' },
                { value: 'active', label: 'Activas' },
                { value: 'inactive', label: 'Inactivas' },
              ]}
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
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Mostrando {startIndex + 1}-{Math.min(endIndex, totalItems)} de {totalItems} empresas
          </div>
        </div>

        {/* Vista Desktop - Tabla */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Empresa</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Cliente</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">CUIT</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Contacto</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Estado</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8">
                    <div className="text-gray-500 dark:text-gray-400">
                      <HiOutlineOfficeBuilding className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                      <p>No se encontraron empresas</p>
                      {searchTerm && (
                        <p className="text-sm mt-1">
                          Intenta ajustar los filtros de búsqueda
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                currentItems.map((empresa, index) => (
                  <motion.tr
                    key={empresa.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    {/* Empresa */}
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <Avatar
                          size="sm"
                          shape="circle"
                          className="bg-blue-100 text-blue-600"
                        >
                          {empresa.nombre.charAt(0).toUpperCase()}
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">{empresa.nombre}</div>
                          {empresa.razonSocial && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">{empresa.razonSocial}</div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Cliente */}
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{empresa.cliente.nombre}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{empresa.cliente.email}</div>
                      </div>
                    </td>

                    {/* CUIT */}
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <HiOutlineIdentification className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                        <span className="font-mono text-sm text-gray-700 dark:text-gray-300">
                          {empresa.cuit || 'No registrado'}
                        </span>
                      </div>
                    </td>

                    {/* Contacto */}
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        {empresa.email && (
                          <div className="flex items-center space-x-2 text-sm">
                            <HiOutlineMail className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                            <span className="text-gray-600 dark:text-gray-400">{empresa.email}</span>
                          </div>
                        )}
                        {empresa.telefono && (
                          <div className="flex items-center space-x-2 text-sm">
                            <HiOutlinePhone className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                            <span className="text-gray-600 dark:text-gray-400">{empresa.telefono}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Estado */}
                    <td className="py-3 px-4">
                      <Badge 
                        className={empresa.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                      >
                        {empresa.activo ? 'Activa' : 'Inactiva'}
                      </Badge>
                    </td>

                    {/* Acciones */}
                    <td className="py-3 px-4">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => handleView(empresa.id)}
                          className="p-2 rounded-full text-gray-700 dark:text-blue-300 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-700 hover:shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900/50 active:shadow-inner transition-all duration-200"
                          title="Ver"
                        >
                          <HiOutlineEye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(empresa.id)}
                          className="p-2 rounded-full text-gray-700 dark:text-amber-300 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-700 hover:shadow-lg hover:shadow-amber-200 dark:hover:shadow-amber-900/50 active:shadow-inner transition-all duration-200"
                          title="Editar"
                        >
                          <HiOutlinePencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(empresa)}
                          className="p-2 rounded-full text-gray-700 dark:text-red-300 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-700 hover:shadow-lg hover:shadow-red-200 dark:hover:shadow-red-900/50 active:shadow-inner transition-all duration-200"
                          title="Eliminar"
                        >
                          <HiOutlineTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Vista Mobile - Cards */}
        <div className="md:hidden space-y-4">
          {currentItems.map((empresa, index) => (
            <motion.div
              key={empresa.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Header con Nombre */}
              <div className="mb-3">
                <div className="text-lg font-bold text-gray-900 dark:text-white">{empresa.nombre}</div>
                {empresa.razonSocial && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">{empresa.razonSocial}</div>
                )}
              </div>

              {/* Cliente */}
              <div className="mb-3">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Cliente</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {empresa.cliente?.nombre || 'Sin cliente'}
                </div>
              </div>

              {/* CUIT */}
              <div className="mb-3">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">CUIT</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {empresa.cuit || 'Sin CUIT'}
                </div>
              </div>

              {/* Contacto */}
              <div className="mb-3">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Contacto</div>
                <div className="space-y-1">
                  {empresa.email && (
                    <div className="flex items-center space-x-2 text-sm">
                      <HiOutlineMail className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">{empresa.email}</span>
                    </div>
                  )}
                  {empresa.telefono && (
                    <div className="flex items-center space-x-2 text-sm">
                      <HiOutlinePhone className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">{empresa.telefono}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Estado */}
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Estado</div>
                <Badge 
                  className={empresa.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                >
                  {empresa.activo ? 'Activa' : 'Inactiva'}
                </Badge>
              </div>

              {/* Acciones */}
              <div className="flex justify-center space-x-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => handleView(empresa.id)}
                  className="p-2 rounded-full text-gray-700 dark:text-blue-300 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-700 hover:shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900/50 active:shadow-inner transition-all duration-200"
                  title="Ver"
                >
                  <HiOutlineEye className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleEdit(empresa.id)}
                  className="p-2 rounded-full text-gray-700 dark:text-amber-300 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-700 hover:shadow-lg hover:shadow-amber-200 dark:hover:shadow-amber-900/50 active:shadow-inner transition-all duration-200"
                  title="Editar"
                >
                  <HiOutlinePencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeleteClick(empresa)}
                  className="p-2 rounded-full text-gray-700 dark:text-red-300 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-700 hover:shadow-lg hover:shadow-red-200 dark:hover:shadow-red-900/50 active:shadow-inner transition-all duration-200"
                  title="Eliminar"
                >
                  <HiOutlineTrash className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Modal de confirmación de eliminación */}
      <Dialog
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, empresa: null })}
        onRequestClose={() => setDeleteModal({ isOpen: false, empresa: null })}
      >
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <HiOutlineTrash className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Eliminar Empresa
              </h3>
              <p className="text-gray-600">
                Esta acción no se puede deshacer
              </p>
            </div>
          </div>
          
          {deleteModal.empresa && (
            <div className="mb-6">
              <p className="text-gray-700">
                ¿Estás seguro de que deseas eliminar la empresa{' '}
                <span className="font-semibold">{deleteModal.empresa.nombre}</span>?
              </p>
              {deleteModal.empresa._count && 
               (deleteModal.empresa._count.presupuestos > 0 || deleteModal.empresa._count.facturas > 0) && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Esta empresa tiene presupuestos o facturas asociadas. 
                    Se desactivará en lugar de eliminarse completamente.
                  </p>
                </div>
              )}
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="plain"
              onClick={() => setDeleteModal({ isOpen: false, empresa: null })}
            >
              Cancelar
            </Button>
            <Button
              variant="solid"
              className="bg-red-600 hover:bg-red-700"
              onClick={handleConfirmDelete}
            >
              Eliminar
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default EmpresaList;
