import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '@/services/AuthService';
import type { LoginCredentials, AuthState } from '@/@types/auth';
import appConfig from '@/configs/app.config';
import { REDIRECT_URL_KEY } from '@/constants/app.constant';
import { useAppDispatch, useAppSelector } from '@/store';
import { signInSuccess, signOutSuccess, setUser } from '@/store/slices/auth';

function useAuth() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    
    // Usar el estado de Redux
    const signedIn = useAppSelector((state) => state.auth.session.signedIn);
    const token = useAppSelector((state) => state.auth.session.token);
    const user = useAppSelector((state) => state.auth.user);
    
    // Calcular authenticated correctamente
    const authenticated = Boolean(token && signedIn);

    // Efecto para verificar el estado de autenticación al montar el componente
    useEffect(() => {
        const checkAuthState = () => {
            const currentState = AuthService.getAuthState();
            
            // Sincronizar con Redux si hay diferencias
            if (currentState.isAuthenticated && currentState.token && !signedIn) {
                dispatch(signInSuccess(currentState.token));
                if (currentState.user) {
                    dispatch(setUser({
                        avatar: '',
                        userName: currentState.user.nombre || '',
                        email: currentState.user.email || '',
                        authority: currentState.user.roles || [],
                    }));
                }
            } else if (!currentState.isAuthenticated && signedIn) {
                console.log('🔑 useAuth - Cerrando sesión en Redux');
                dispatch(signOutSuccess());
            }
        };

        // Verificar inmediatamente
        checkAuthState();
    }, [dispatch, signedIn]);

    const signIn = async (credentials: LoginCredentials) => {
        try {
            // console.log('🔑 useAuth - Iniciando login con email:', (credentials.email || '').toLowerCase());
            const response = await AuthService.login(credentials);
            // console.log('🔑 useAuth - Respuesta del AuthService:', response);
            // console.log('🔑 useAuth - Token extraído:', response.token);
            // console.log('🔑 useAuth - Usuario extraído:', response.user);

            // Actualizar Redux
            dispatch(signInSuccess(response.token));
            console.log('🔑 useAuth - Despachado signInSuccess con token:', response.token);
            
            dispatch(setUser({
                avatar: '',
                userName: response.user.nombre || '',
                email: response.user.email || '',
                authority: response.user.roles || [],
            }));
            // console.log('🔑 useAuth - Usuario despachado:', response.user);

            const redirectUrl = new URLSearchParams(window.location.search).get(REDIRECT_URL_KEY);
            const targetUrl = redirectUrl || appConfig.authenticatedEntryPath;
            // console.log('🔑 useAuth - Navegando a:', targetUrl);
            navigate(targetUrl);
            
            return { status: 'success' as const, message: '' };
        } catch (error) {
            // console.error('🔑 useAuth - Error en signIn:', error);
            return {
                status: 'failed' as const,
                message: (error as Error).message || 'Error al iniciar sesión'
            };
        }
    };

    const signOut = async () => {
        try {
            console.log('🔑 useAuth - Cerrando sesión');
            await AuthService.logout();
            
            // Actualizar Redux
            dispatch(signOutSuccess());
            dispatch(setUser({
                avatar: '',
                userName: '',
                email: '',
                authority: [],
            }));
            
            navigate(appConfig.unAuthenticatedEntryPath);
            return { status: 'success' as const };
        } catch (error) {
            // console.error('🔑 useAuth - Error en signOut:', error);
            return {
                status: 'failed' as const,
                message: (error as Error).message
            };
        }
    };

    return {
        authenticated,
        user,
        signIn,
        signOut
    };
}

export default useAuth;
