import { useEffect } from 'react';
import { useAutoTheme } from '@/utils/hooks/useAutoTheme';

/**
 * Componente que inicializa el sistema de tema automático
 * Se ejecuta una sola vez al cargar la aplicación
 */
const AutoThemeInitializer = () => {
  const { isAutoEnabled } = useAutoTheme();

  useEffect(() => {
    if (isAutoEnabled) {
      console.log('🌅 Sistema de tema automático inicializado para Posadas, Misiones');
    }
  }, [isAutoEnabled]);

  return null; // Este componente no renderiza nada
};

export default AutoThemeInitializer;
