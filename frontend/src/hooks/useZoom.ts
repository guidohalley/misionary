import { useEffect, useState } from 'react'

const ZOOM_STORAGE_KEY = 'misionary_app_zoom'
const DEFAULT_ZOOM = 100 // 100%

/**
 * Hook personalizado para manejar el zoom de la aplicación
 * Aplica zoom a nivel de CSS (zoom property) que respeta el layout del navegador
 * Persiste el valor en localStorage
 * 
 * @returns {Object} { currentZoom, setZoom, resetZoom, increaseZoom, decreaseZoom }
 */
export const useZoom = () => {
  const [currentZoom, setCurrentZoom] = useState<number>(DEFAULT_ZOOM)
  const [isInitialized, setIsInitialized] = useState(false)

  // Recuperar zoom guardado del localStorage al montar
  useEffect(() => {
    const savedZoom = localStorage.getItem(ZOOM_STORAGE_KEY)
    const zoomValue = savedZoom ? parseInt(savedZoom) : DEFAULT_ZOOM

    setCurrentZoom(zoomValue)
    applyZoom(zoomValue)
    setIsInitialized(true)
  }, [])

  // Aplicar zoom usando la propiedad zoom de CSS
  const applyZoom = (zoomValue: number) => {
    // Limitar zoom entre 50% y 150%
    const limitedZoom = Math.max(50, Math.min(150, zoomValue))
    const zoomDecimal = limitedZoom / 100
    
    document.documentElement.style.zoom = zoomDecimal.toString()
  }

  // Actualizar zoom y guardar en localStorage
  const updateZoom = (newZoom: number) => {
    const limitedZoom = Math.max(50, Math.min(150, newZoom))
    setCurrentZoom(limitedZoom)
    applyZoom(limitedZoom)
    localStorage.setItem(ZOOM_STORAGE_KEY, limitedZoom.toString())
  }

  // Aumentar zoom en 10%
  const increaseZoom = () => {
    updateZoom(currentZoom + 10)
  }

  // Disminuir zoom en 10%
  const decreaseZoom = () => {
    updateZoom(currentZoom - 10)
  }

  // Resetear al zoom por defecto (100%)
  const resetZoom = () => {
    updateZoom(DEFAULT_ZOOM)
  }

  return {
    currentZoom,
    setZoom: updateZoom,
    resetZoom,
    increaseZoom,
    decreaseZoom,
    isInitialized,
  }
}
