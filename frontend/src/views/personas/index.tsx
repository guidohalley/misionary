import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Button, Input, Select, Pagination } from '@/components/ui';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import PersonaList from './PersonaList';
import InviteProviderModal from './InviteProviderModal';
import { usePersona } from './hooks';
import { Persona, UpdatePersonaDTO } from './types';
import { TipoPersona } from './schemas';
import useAuth from '@/utils/hooks/useAuth';
import { HiOutlinePlus, HiOutlineMail, HiOutlineUserAdd } from 'react-icons/hi';

interface PersonasViewProps {
  tipoFiltro?: TipoPersona;
}

const PersonasView: React.FC<PersonasViewProps> = ({ tipoFiltro }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [personaToDelete, setPersonaToDelete] = useState<number | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  
  // Estados para búsqueda y paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPersonas, setFilteredPersonas] = useState<Persona[]>([]);

  // Obtener tipo de filtro desde URL o prop
  const tipoFromUrl = searchParams.get('tipo') as TipoPersona | null;
  const tipoActivo = tipoFromUrl || tipoFiltro;

  const {
    personas,
    loading,
    error,
    updatePersona,
    deletePersona,
  } = usePersona(tipoActivo);

  // Verificar si el usuario es admin
  const isAdmin = user?.authority?.includes('ADMIN');

  // Filtrar personas cuando cambie el término de búsqueda o la lista de personas
  useEffect(() => {
    const filtered = personas.filter(persona =>
      persona.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      persona.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      persona.tipo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      persona.telefono?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPersonas(filtered);
    setCurrentPage(1); // Reset a primera página al filtrar
  }, [personas, searchTerm]);

  // Opciones de tamaño de página
  const pageSizeOptions: { value: number; label: string }[] = [
    { value: 10, label: '10 por página' },
    { value: 25, label: '25 por página' },
    { value: 50, label: '50 por página' },
  ];
  const selectedPageSize = pageSizeOptions.find(o => o.value === pageSize) || pageSizeOptions[0];

  // Calcular paginación
  const totalItems = filteredPersonas.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentItems = filteredPersonas.slice(startIndex, endIndex);

  // Obtener título según el tipo de filtro
  const getTitulo = () => {
    if (tipoActivo === TipoPersona.CLIENTE) return 'Gestión de Clientes';
    if (tipoActivo === TipoPersona.PROVEEDOR) return 'Gestión de Proveedores'; 
    if (tipoActivo === TipoPersona.INTERNO) return 'Gestión de Usuarios Internos';
    return 'Gestión de Personas';
  };

  const getBotonTexto = () => {
    if (tipoActivo === TipoPersona.CLIENTE) return 'Nuevo Cliente';
    if (tipoActivo === TipoPersona.PROVEEDOR) return 'Nuevo Proveedor';
    if (tipoActivo === TipoPersona.INTERNO) return 'Nuevo Usuario Interno';
    return 'Nueva Persona';
  };

  const handleCreate = () => {
    navigate('/personas/new');
  };

  const handleEdit = (persona: Persona) => {
    navigate(`/personas/edit/${persona.id}`);
  };

  const handleDelete = (id: number) => {
    setPersonaToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (personaToDelete) {
      try {
        await deletePersona(personaToDelete);
        setShowDeleteDialog(false);
        setPersonaToDelete(null);
      } catch (error) {
        console.error('Error al eliminar persona:', error);
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="container mx-auto p-4 space-y-6"
    >
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="flex justify-between items-center"
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {getTitulo()}
        </h1>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex gap-3"
        >
          <Button 
            variant="solid" 
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            <HiOutlinePlus className="w-4 h-4 mr-2" />
            {getBotonTexto()}
          </Button>
          
          {/* Botón de invitar proveedor solo para admins y cuando estamos viendo proveedores */}
          {isAdmin && tipoActivo === TipoPersona.PROVEEDOR && (
            <Button 
              variant="outline" 
              onClick={() => setShowInviteModal(true)}
              className="border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >     
              <HiOutlineUserAdd className="w-4 h-4 mr-2" />
              Invitar Proveedor
            </Button>
          )}
        </motion.div>
      </motion.div>

      {/* Lista de personas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <Card>
          <div className="p-6">
            {/* Barra de búsqueda y selector de tamaño */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex-1 w-full sm:w-auto">
                <Input
                  placeholder="Buscar por nombre, email, tipo o teléfono..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="w-full sm:w-auto">
                <Select
                  value={selectedPageSize}
                  onChange={(opt: any) => {
                    if (opt && typeof opt.value === 'number') {
                      setPageSize(opt.value);
                      setCurrentPage(1);
                    }
                  }}
                  options={pageSizeOptions}
                  isSearchable={false}
                  className="w-full sm:w-48"
                />
              </div>
            </div>

            {/* Tabla de personas */}
            <PersonaList
              personas={currentItems}
              loading={loading}
              error={error}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <Pagination
                  total={totalItems}
                  pageSize={pageSize}
                  currentPage={currentPage}
                  onChange={(page) => setCurrentPage(page)}
                />
              </div>
            )}

            {/* Mensaje cuando no hay resultados */}
            {!loading && filteredPersonas.length === 0 && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                {searchTerm 
                  ? 'No se encontraron personas que coincidan con la búsqueda' 
                  : 'No hay personas registradas'}
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Dialog de confirmación para eliminar */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Confirmar eliminación"
        children="¿Estás seguro de que deseas eliminar esta persona? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />

      {/* Modal de invitación */}
      <InviteProviderModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onSuccess={() => {
          setShowInviteModal(false);
          // Podrías refrescar la lista aquí si lo deseas
        }}
      />
    </motion.div>
  );
};

export default PersonasView;

// Exportar también los formularios específicos
export { default as ClienteForm } from './ClienteForm';
export { default as ProveedorForm } from './ProveedorForm';
export { default as InternoForm } from './InternoForm';
