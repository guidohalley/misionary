import { useState, useEffect } from 'react';
import { fetchPersonas } from '@/modules/persona/service';

export interface Cliente {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
}

export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Obtener todas las personas y filtrar solo los clientes
        const personas = await fetchPersonas();
        const clientesData = personas
          .filter(persona => persona.tipo === 'CLIENTE')
          .map(persona => ({
            id: persona.id,
            nombre: persona.nombre,
            email: persona.email,
            telefono: persona.telefono,
          }));
        
        setClientes(clientesData);
      } catch (err) {
        setError('Error al cargar los clientes');
        console.error('Error fetching clientes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  const refetchClientes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const personas = await fetchPersonas();
      const clientesData = personas
        .filter(persona => persona.tipo === 'CLIENTE')
        .map(persona => ({
          id: persona.id,
          nombre: persona.nombre,
          email: persona.email,
          telefono: persona.telefono,
        }));
      
      setClientes(clientesData);
    } catch (err) {
      setError('Error al cargar los clientes');
      console.error('Error fetching clientes:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    clientes,
    loading,
    error,
    refetchClientes,
  };
}
