import React, { useState, useEffect } from 'react';
import { Card, Input, Select, Pagination } from '@/components/ui';
import usePersona from '@/modules/persona/hooks/usePersona';
import PersonaList from '@/views/personas/PersonaList';
import PersonaForm from '@/views/personas/PersonaForm';
import { CreatePersonaDTO, UpdatePersonaDTO } from '@/views/personas/types';
import { Persona } from '@/views/personas/types';

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

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPersonas, setFilteredPersonas] = useState<Persona[]>([]);

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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h2 className="text-lg font-semibold">Lista de Personas</h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
              <Input
                placeholder="Buscar personas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64"
              />
              <Select
                value={selectedPageSize}
                onChange={(opt: { value: number; label: string } | null) => {
                  if (opt && typeof opt.value === 'number') setPageSize(opt.value);
                }}
                options={pageSizeOptions}
                isSearchable={false}
                className="w-full sm:w-40"
              />
            </div>
          </div>

          <PersonaList
            personas={currentItems}
            loading={loading}
            error={error}
            onEdit={selectPersona}
            onDelete={deletePersona}
          />

          {totalPages > 1 && (
            <div className="mt-4 flex justify-center">
              <Pagination
                total={totalItems}
                pageSize={pageSize}
                currentPage={currentPage}
                onChange={setCurrentPage}
              />
            </div>
          )}

          {!loading && filteredPersonas.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {searchTerm ? 'No se encontraron personas que coincidan con la búsqueda' : 'No hay personas registradas'}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
