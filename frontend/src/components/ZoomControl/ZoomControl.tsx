import { useZoom } from '@/hooks/useZoom'
import { HiOutlineMinusSmall, HiOutlinePlusSmall } from 'react-icons/hi2'

/**
 * Componente de control de zoom
 * Muestra el porcentaje actual y botones para aumentar/disminuir
 * Opcional: agregar a la navbar o panel flotante
 */
export const ZoomControl = () => {
  const { currentZoom, increaseZoom, decreaseZoom, resetZoom } = useZoom()
  const zoomPercentage = Math.round(currentZoom * 100)

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
      <button
        onClick={decreaseZoom}
        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        title="Reducir zoom (Ctrl + -)"
      >
        <HiOutlineMinusSmall className="w-5 h-5" />
      </button>

      <button
        onClick={resetZoom}
        className="text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-2 py-1 transition-colors cursor-pointer"
        title="Restaurar zoom por defecto"
      >
        {zoomPercentage}%
      </button>

      <button
        onClick={increaseZoom}
        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        title="Aumentar zoom (Ctrl + +)"
      >
        <HiOutlinePlusSmall className="w-5 h-5" />
      </button>
    </div>
  )
}
