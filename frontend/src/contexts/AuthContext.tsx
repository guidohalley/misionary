import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AuthState, LoginCredentials } from '@/@types/auth';
import AuthService from '@/services/AuthService';

interface AuthContextType extends AuthState {
    signIn: (credentials: LoginCredentials) => Promise<{ status: 'success' | 'error', message?: string }>;
    signOut: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [authState, setAuthState] = useState<AuthState>(AuthService.getAuthState());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Verificar el token almacenado al montar el componente
        const state = AuthService.getAuthState();
        setAuthState(state);
        setLoading(false);
    }, []);

    const signIn = async (credentials: LoginCredentials) => {
        try {
            const response = await AuthService.login(credentials);
            setAuthState({
                isAuthenticated: true,
                user: response.user,
                token: response.token
            });
            return { status: 'success' as const };
        } catch (error) {
            return {
                status: 'error' as const,
                message: (error as Error).message
            };
        }
    };

    const signOut = async () => {
        try {
            await AuthService.logout();
            setAuthState({
                isAuthenticated: false,
                user: null,
                token: null
            });
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <AuthContext.Provider
            value={{
                ...authState,
                signIn,
                signOut,
                loading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
