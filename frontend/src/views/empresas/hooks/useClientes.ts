import { useState, useEffect } from 'react';
import ApiService from '@/services/ApiService';

interface Cliente {
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
        
        // Obtener personas con tipo CLIENTE
        const response = await ApiService.fetchData<Cliente[]>({
          url: '/personas?tipo=CLIENTE',
          method: 'GET'
        });
        
        setClientes(response.data);
      } catch (err) {
        setError('Error al cargar los clientes');
        console.error('Error fetching clientes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  return {
    clientes,
    loading,
    error
  };
}
