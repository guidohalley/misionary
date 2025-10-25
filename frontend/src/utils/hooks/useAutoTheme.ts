import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setMode } from '@/store/slices/theme/themeSlice';
import { MODE_DARK, MODE_LIGHT } from '@/constants/theme.constant';

// Coordenadas de Posadas, Misiones, Argentina
const POSADAS_LAT = -27.3676;
const POSADAS_LNG = -55.8961;

interface SunriseSunsetData {
  sunrise: string;
  sunset: string;
  solar_noon: string;
  day_length: string;
  civil_twilight_begin: string;
  civil_twilight_end: string;
  nautical_twilight_begin: string;
  nautical_twilight_end: string;
  astronomical_twilight_begin: string;
  astronomical_twilight_end: string;
}

interface SunriseSunsetResponse {
  results: SunriseSunsetData;
  status: string;
}

const STORAGE_KEY = 'misionary_auto_theme_enabled';
const CACHE_KEY = 'misionary_sunset_cache';
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 horas en millisegundos

export const useAutoTheme = () => {
  const dispatch = useAppDispatch();
  const currentMode = useAppSelector((state) => state.theme.mode);
  const [isAutoEnabled, setIsAutoEnabled] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : true; // Habilitado por defecto
  });
  const [sunsetTime, setSunsetTime] = useState<Date | null>(null);
  const [sunriseTime, setSunriseTime] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener datos del cache
  const getCachedSunsetData = () => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();
      if (now - timestamp < CACHE_DURATION) {
        return data;
      }
    }
    return null;
  };

  // Función para guardar datos en cache
  const setCachedSunsetData = (data: SunriseSunsetData) => {
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  };

  // Función para obtener datos de sunrise/sunset
  const fetchSunsetData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Primero intentar obtener del cache
      const cachedData = getCachedSunsetData();
      if (cachedData) {
        processSunsetData(cachedData);
        setIsLoading(false);
        return;
      }

      // Si no hay cache válido, hacer petición a la API
      const response = await fetch(
        `https://api.sunrise-sunset.org/json?lat=${POSADAS_LAT}&lng=${POSADAS_LNG}&formatted=0&date=today`
      );

      if (!response.ok) {
        throw new Error('Error al obtener datos de sunset');
      }

      const data: SunriseSunsetResponse = await response.json();
      
      if (data.status === 'OK') {
        processSunsetData(data.results);
        setCachedSunsetData(data.results);
      } else {
        throw new Error('API devolvió estado no válido');
      }
    } catch (err) {
      console.error('Error fetching sunset data:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      
      // Fallback: usar horarios aproximados para Posadas
      const now = new Date();
      const fallbackSunset = new Date(now);
      fallbackSunset.setHours(18, 30, 0, 0); // ~18:30 promedio anual
      const fallbackSunrise = new Date(now);
      fallbackSunrise.setHours(6, 30, 0, 0); // ~6:30 promedio anual
      
      setSunsetTime(fallbackSunset);
      setSunriseTime(fallbackSunrise);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para procesar los datos de sunset
  const processSunsetData = (data: SunriseSunsetData) => {
    // Convertir UTC a hora local de Argentina (UTC-3)
    const sunset = new Date(data.sunset);
    const sunrise = new Date(data.sunrise);
    
    setSunsetTime(sunset);
    setSunriseTime(sunrise);
  };

  // Función para determinar si debería estar en modo oscuro
  const shouldBeDarkMode = () => {
    if (!sunsetTime || !sunriseTime) return false;
    
    const now = new Date();
    const currentTime = now.getTime();
    
    // Si es después del atardecer o antes del amanecer, modo oscuro
    if (currentTime >= sunsetTime.getTime() || currentTime < sunriseTime.getTime()) {
      return true;
    }
    
    return false;
  };

  // Función para aplicar el tema automáticamente
  const applyAutoTheme = () => {
    if (!isAutoEnabled) return;
    
    const shouldBeDark = shouldBeDarkMode();
    const targetMode = shouldBeDark ? MODE_DARK : MODE_LIGHT;
    
    if (currentMode !== targetMode) {
      dispatch(setMode(targetMode));
      console.log(`🌅 Auto-theme: Cambiando a modo ${shouldBeDark ? 'oscuro' : 'claro'}`);
    }
  };

  // Función para habilitar/deshabilitar el tema automático
  const toggleAutoTheme = (enabled: boolean) => {
    setIsAutoEnabled(enabled);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(enabled));
    
    if (enabled) {
      applyAutoTheme();
    }
  };

  // Función para forzar actualización de datos
  const refreshSunsetData = () => {
    localStorage.removeItem(CACHE_KEY);
    fetchSunsetData();
  };

  // Efecto para obtener datos iniciales
  useEffect(() => {
    if (isAutoEnabled) {
      fetchSunsetData();
    }
  }, [isAutoEnabled]);

  // Efecto para aplicar tema cuando cambian los datos
  useEffect(() => {
    if (isAutoEnabled && sunsetTime && sunriseTime) {
      applyAutoTheme();
    }
  }, [sunsetTime, sunriseTime, isAutoEnabled, currentMode]);

  // Efecto para verificar cada minuto si necesita cambiar el tema
  useEffect(() => {
    if (!isAutoEnabled) return;

    const interval = setInterval(() => {
      applyAutoTheme();
    }, 60000); // Verificar cada minuto

    return () => clearInterval(interval);
  }, [isAutoEnabled, sunsetTime, sunriseTime, currentMode]);

  // Función para obtener información del estado actual
  const getThemeInfo = () => {
    if (!sunsetTime || !sunriseTime) {
      return {
        nextChange: null,
        currentPeriod: 'unknown',
        sunsetTime: null,
        sunriseTime: null
      };
    }

    const now = new Date();
    const isDark = shouldBeDarkMode();
    
    let nextChange: Date;
    let currentPeriod: string;
    
    if (isDark) {
      // Estamos en modo oscuro, próximo cambio es al amanecer
      if (now.getTime() >= sunsetTime.getTime()) {
        // Es después del atardecer de hoy, próximo amanecer es mañana
        nextChange = new Date(sunriseTime);
        nextChange.setDate(nextChange.getDate() + 1);
      } else {
        // Es antes del amanecer de hoy
        nextChange = sunriseTime;
      }
      currentPeriod = 'night';
    } else {
      // Estamos en modo claro, próximo cambio es al atardecer
      nextChange = sunsetTime;
      currentPeriod = 'day';
    }

    return {
      nextChange,
      currentPeriod,
      sunsetTime,
      sunriseTime
    };
  };

  return {
    isAutoEnabled,
    toggleAutoTheme,
    sunsetTime,
    sunriseTime,
    isLoading,
    error,
    refreshSunsetData,
    getThemeInfo,
    shouldBeDarkMode: shouldBeDarkMode()
  };
};
