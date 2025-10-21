import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui';
import { HiOutlineLockClosed, HiOutlineArrowLeft } from 'react-icons/hi';
import useAuth from '@/utils/hooks/useAuth';

interface PermissionGuardProps {
    children: ReactNode;
    allowedRoles: string[]; // ['ADMIN', 'CONTADOR']
    showBlur?: boolean; // Si true, muestra el contenido con blur
    redirectTo?: string; // Ruta a redirigir si no tiene permisos
}

const PermissionGuard = ({
    children,
    allowedRoles,
    showBlur = true,
    redirectTo,
}: PermissionGuardProps) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    // Obtener roles del usuario (soporta tanto roles como authority)
    const userRoles = user?.roles || user?.authority || [];
    
    // Verificar si tiene al menos uno de los roles permitidos
    const hasPermission = allowedRoles.some(role => userRoles.includes(role));

    // Si tiene permisos, mostrar el contenido normalmente
    if (hasPermission) {
        return <>{children}</>;
    }

    // Si no tiene permisos y se especificó redirección, redirigir
    if (redirectTo && !showBlur) {
        navigate(redirectTo);
        return null;
    }

    // Si no tiene permisos, mostrar mensaje con blur
    return (
        <div className="relative min-h-screen">
            {/* Contenido con blur de fondo */}
            {showBlur && (
                <div className="blur-sm pointer-events-none select-none opacity-30">
                    {children}
                </div>
            )}

            {/* Overlay de acceso denegado */}
            <div className={`${showBlur ? 'absolute' : 'relative'} inset-0 flex items-center justify-center p-6`}>
                <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center border-2 border-red-200 dark:border-red-900">
                    {/* Icono */}
                    <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
                        <HiOutlineLockClosed className="h-10 w-10 text-red-600 dark:text-red-400" />
                    </div>

                    {/* Título */}
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        Acceso Restringido
                    </h2>

                    {/* Descripción */}
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                        No tienes los permisos necesarios para acceder a esta sección.
                    </p>

                    {/* Información del usuario */}
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 mb-6 mt-4">
                        <div className="text-sm space-y-2">
                            <div>
                                <span className="text-gray-500 dark:text-gray-400">Usuario:</span>
                                <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                                    {user?.userName || user?.email}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-500 dark:text-gray-400">Tu rol:</span>
                                <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                                    {userRoles.join(', ') || 'Sin rol'}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-500 dark:text-gray-400">Roles requeridos:</span>
                                <span className="ml-2 font-semibold text-red-600 dark:text-red-400">
                                    {allowedRoles.join(' o ')}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex flex-col gap-3">
                        <Button
                            onClick={() => navigate(-1)}
                            icon={<HiOutlineArrowLeft />}
                            className="w-full"
                        >
                            Volver Atrás
                        </Button>
                        <Button
                            onClick={() => navigate('/home')}
                            variant="plain"
                            className="w-full"
                        >
                            Ir al Dashboard
                        </Button>
                    </div>

                    {/* Ayuda */}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">
                        Si crees que deberías tener acceso, contacta al administrador del sistema.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PermissionGuard;

