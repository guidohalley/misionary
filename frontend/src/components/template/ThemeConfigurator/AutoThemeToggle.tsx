import { useState } from 'react';
import { Switcher, Tooltip, Button } from '@/components/ui';
import { HiOutlineSun, HiOutlineMoon, HiOutlineRefresh, HiOutlineInformationCircle } from 'react-icons/hi';
import { useAutoTheme } from '@/utils/hooks/useAutoTheme';
import { motion, AnimatePresence } from 'framer-motion';

const AutoThemeToggle = () => {
  const {
    isAutoEnabled,
    toggleAutoTheme,
    sunsetTime,
    sunriseTime,
    isLoading,
    error,
    refreshSunsetData,
    getThemeInfo,
    shouldBeDarkMode
  } = useAutoTheme();

  const [showDetails, setShowDetails] = useState(false);
  const themeInfo = getThemeInfo();

  const formatTime = (date: Date | null) => {
    if (!date) return '--:--';
    return date.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Argentina/Buenos_Aires'
    });
  };

  const formatNextChange = (date: Date | null) => {
    if (!date) return 'No disponible';
    
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `En ${diffHours}h ${diffMinutes}m`;
    } else if (diffMinutes > 0) {
      return `En ${diffMinutes}m`;
    } else {
      return 'Ahora';
    }
  };

  return (
    <div className="space-y-4">
      {/* Control principal */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {shouldBeDarkMode ? (
              <HiOutlineMoon className="w-5 h-5 text-blue-500" />
            ) : (
              <HiOutlineSun className="w-5 h-5 text-yellow-500" />
            )}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Tema Automático
            </span>
          </div>
          
          <Tooltip title="Cambia automáticamente entre tema claro y oscuro según la hora del atardecer en Posadas, Misiones">
            <HiOutlineInformationCircle className="w-4 h-4 text-gray-400 cursor-help" />
          </Tooltip>
        </div>

        <div className="flex items-center gap-2">
          <Switcher
            checked={isAutoEnabled}
            onChange={toggleAutoTheme}
            disabled={isLoading}
          />
          
          <Tooltip title="Actualizar horarios de amanecer/atardecer">
            <Button
              variant="plain"
              size="sm"
              icon={<HiOutlineRefresh className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />}
              onClick={refreshSunsetData}
              disabled={isLoading}
              className="p-1"
            />
          </Tooltip>

          <Button
            variant="plain"
            size="sm"
            icon={<HiOutlineInformationCircle className="w-4 h-4" />}
            onClick={() => setShowDetails(!showDetails)}
            className="p-1"
          />
        </div>
      </div>

      {/* Estado actual */}
      {isAutoEnabled && (
        <div className="text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <span className={`inline-block w-2 h-2 rounded-full ${
              shouldBeDarkMode ? 'bg-blue-500' : 'bg-yellow-500'
            }`} />
            <span>
              {shouldBeDarkMode ? 'Período nocturno' : 'Período diurno'} • 
              Próximo cambio: {formatNextChange(themeInfo.nextChange)}
            </span>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded">
          ⚠️ {error} (usando horarios aproximados)
        </div>
      )}

      {/* Detalles expandibles */}
      <AnimatePresence>
        {showDetails && isAutoEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-2"
          >
            <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
              📍 Horarios para Posadas, Misiones
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <HiOutlineSun className="w-3 h-3 text-yellow-500" />
                  <span>Amanecer</span>
                </div>
                <div className="font-mono text-gray-900 dark:text-gray-100">
                  {formatTime(sunriseTime)}
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <HiOutlineMoon className="w-3 h-3 text-blue-500" />
                  <span>Atardecer</span>
                </div>
                <div className="font-mono text-gray-900 dark:text-gray-100">
                  {formatTime(sunsetTime)}
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
              Los horarios se actualizan automáticamente cada 12 horas usando la API de sunrise-sunset.org
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AutoThemeToggle;
