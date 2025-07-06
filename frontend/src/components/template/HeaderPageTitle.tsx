import { useLocation } from 'react-router-dom'
import { useAppSelector } from '@/store'
import { useMemo } from 'react'
import navigationConfig from '@/configs/navigation.config'

const HeaderPageTitle = () => {
    const location = useLocation()
    const currentRouteKey = useAppSelector((state) => state.base.common.currentRouteKey)

    const pageTitle = useMemo(() => {
        // Función recursiva para buscar en el árbol de navegación
        const findPageTitle = (items: any[], routeKey: string): string => {
            for (const item of items) {
                if (item.key === routeKey) {
                    return item.title
                }
                if (item.subMenu && item.subMenu.length > 0) {
                    const found = findPageTitle(item.subMenu, routeKey)
                    if (found) return found
                }
            }
            return ''
        }

        const title = findPageTitle(navigationConfig, currentRouteKey)
        
        // Si no encuentra el título, usar el pathname como fallback
        if (!title) {
            const pathSegments = location.pathname.split('/').filter(Boolean)
            const lastSegment = pathSegments[pathSegments.length - 1]
            return lastSegment ? lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1) : 'Dashboard'
        }
        
        return title
    }, [currentRouteKey, location.pathname])

    return (
        <div className="header-page-title hidden lg:block">
            <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {pageTitle}
            </span>
        </div>
    )
}

export default HeaderPageTitle
