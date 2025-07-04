import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '@/components/ui';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import PersonaList from './PersonaList';
import { usePersona } from './hooks';
import { Persona, UpdatePersonaDTO } from './types';

const PersonasView: React.FC = () => {
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [personaToDelete, setPersonaToDelete] = useState<number | null>(null);

  const {
    personas,
    loading,
    error,
    updatePersona,
    deletePersona,
  } = usePersona();

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
          Gestión de Personas
        </h1>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            variant="solid" 
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Nueva Persona
          </Button>
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
            <PersonaList
              personas={personas}
              loading={loading}
              error={error}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </Card>
      </motion.div>

      {/* Dialog de confirmación para eliminar */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Confirmar eliminación"
        message="¿Estás seguro de que deseas eliminar esta persona? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </motion.div>
  );
};

export default PersonasView;
