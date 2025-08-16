import { Navigate, Outlet, useLocation } from 'react-router-dom'
import appConfig from '@/configs/app.config'
import useAuth from '@/utils/hooks/useAuth'

const { authenticatedEntryPath } = appConfig

const PublicRoute = () => {
    const { authenticated } = useAuth()
    const location = useLocation()
    
    // Permitir rutas de invitación y registro de proveedor siempre (para invitados)
    const providerRegistrationRoutes = [
        '/accept-invite',
        '/complete-provider-registration',
        '/provider-registration-success'
    ];
    
    if (providerRegistrationRoutes.includes(location.pathname)) {
        return <Outlet />
    }
    
    return authenticated ? <Navigate to={authenticatedEntryPath} /> : <Outlet />
}

export default PublicRoute
