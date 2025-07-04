import { useState, useEffect, useCallback } from 'react';
import { Persona, CreatePersonaDTO, UpdatePersonaDTO } from '../types';
import * as personaService from '../service';

export function usePersona() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);

  const fetchPersonas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await personaService.fetchPersonas();
      console.log('Personas fetched:', data);
      setPersonas(data);
    } catch (err) {
      setError('Error al cargar las personas');
      console.error('Error fetching personas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPersonas();
  }, [fetchPersonas]);

  const createPersona = async (data: CreatePersonaDTO) => {
    try {
      setLoading(true);
      setError(null);
      const newPersona = await personaService.createPersona(data);
      setPersonas(prev => [...prev, newPersona]);
      return newPersona;
    } catch (err) {
      setError('Error al crear la persona');
      console.error('Error creating persona:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePersona = async (id: number, data: UpdatePersonaDTO) => {
    try {
      setLoading(true);
      setError(null);
      const updatedPersona = await personaService.updatePersona(id, data);
      setPersonas(prev => prev.map(p => p.id === id ? updatedPersona : p));
      return updatedPersona;
    } catch (err) {
      setError('Error al actualizar la persona');
      console.error('Error updating persona:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePersona = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await personaService.deletePersona(id);
      setPersonas(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError('Error al eliminar la persona');
      console.error('Error deleting persona:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const selectPersona = (persona: Persona | null) => {
    setSelectedPersona(persona);
  };

  const getPersonaById = useCallback(async (id: number): Promise<Persona | null> => {
    try {
      // Primero intentar encontrar en la lista existente
      const existingPersona = personas.find((p: Persona) => p.id === id);
      if (existingPersona) {
        return existingPersona;
      }

      // Si no está en la lista, hacer una petición al servicio
      const persona = await personaService.fetchPersonaById(id);
      return persona;
    } catch (err) {
      console.error('Error getting persona by id:', err);
      return null;
    }
  }, [personas]);

  return {
    personas,
    loading,
    error,
    selectedPersona,
    createPersona,
    updatePersona,
    deletePersona,
    selectPersona,
    getPersonaById,
    refreshPersonas: fetchPersonas
  };
}

export default usePersona;
