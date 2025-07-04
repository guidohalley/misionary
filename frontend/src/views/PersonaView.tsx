import React from 'react';
import { Card } from '@/components/ui';
import usePersona from '@/modules/persona/hooks/usePersona';
import PersonaList from '@/views/personas/PersonaList';
import PersonaForm from '@/views/personas/PersonaForm';
import { CreatePersonaDTO, UpdatePersonaDTO } from '@/views/personas/types';

export default function PersonaView() {
  const {
    personas,
    loading,
    error,
    selectedPersona,
    createPersona,
    updatePersona,
    deletePersona,
    selectPersona,
  } = usePersona();

  const handleSubmit = async (data: CreatePersonaDTO | UpdatePersonaDTO) => {
    try {
      if (selectedPersona) {
        await updatePersona(selectedPersona.id, data as UpdatePersonaDTO);
        selectPersona(null);
      } else {
        await createPersona(data as CreatePersonaDTO);
      }
    } catch (err) {
      console.error('Error en operación:', err);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Personas</h1>

      <Card>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">
            {selectedPersona ? 'Editar Persona' : 'Nueva Persona'}
          </h2>
          <PersonaForm
            initialValues={selectedPersona || undefined}
            onSubmit={handleSubmit}
            onCancel={selectedPersona ? () => selectPersona(null) : undefined}
          />
        </div>
      </Card>

      <Card>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Lista de Personas</h2>
          <PersonaList
            personas={personas}
            loading={loading}
            error={error}
            onEdit={selectPersona}
            onDelete={deletePersona}
          />
        </div>
      </Card>
    </div>
  );
}
