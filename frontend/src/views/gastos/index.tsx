import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '@/components/ui';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import GastoList from './GastoList';
import { useGasto } from '@/modules/gasto/hooks/useGasto';
import { GastoOperativo } from './types';

const GastosView: React.FC = () => {
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [gastoToDelete, setGastoToDelete] = useState<number | null>(null);

  const {
    gastosOperativos,
    loading,
    error,
    deleteGastoOperativo,
  } = useGasto();

  const handleCreate = () => {
    navigate('/gastos/new');
  };

  const handleEdit = (gasto: GastoOperativo) => {
    navigate(`/gastos/edit/${gasto.id}`);
  };

  const handleDelete = (id: number) => {
    setGastoToDelete(id);
    setShowDeleteDialog(true);
  };

  const handleView = (gasto: GastoOperativo) => {
    navigate(`/gastos/view/${gasto.id}`);
  };

  const handleAsignar = (gasto: GastoOperativo) => {
    navigate(`/gastos/asignar/${gasto.id}`);
  };

  const confirmDelete = async () => {
    if (gastoToDelete) {
      try {
        await deleteGastoOperativo(gastoToDelete);
        setShowDeleteDialog(false);
        setGastoToDelete(null);
      } catch (error) {
        console.error('Error al eliminar gasto:', error);
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <GastoList
        gastos={gastosOperativos}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onAsignar={handleAsignar}
      />

      <ConfirmDialog
        isOpen={showDeleteDialog}
        type="danger"
        title="Eliminar Gasto Operativo"
        confirmButtonColor="red-600"
        onClose={() => setShowDeleteDialog(false)}
        onRequestClose={() => setShowDeleteDialog(false)}
        onCancel={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
      >
        <p>
          ¿Estás seguro de que deseas eliminar este gasto operativo? 
          Esta acción también eliminará todas las asignaciones a proyectos relacionadas.
        </p>
        <p className="mt-2 font-semibold text-red-600">
          Esta acción no se puede deshacer.
        </p>
      </ConfirmDialog>
    </motion.div>
  );
};

export default GastosView;
