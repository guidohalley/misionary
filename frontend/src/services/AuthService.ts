import ApiService from './ApiService';
import type { LoginCredentials, RegisterCredentials, AuthResponse, AuthState } from '@/@types/auth';

export interface AcceptInviteData {
    token: string;
    nombre: string;
    password: string;
    confirmPassword: string;
    providerArea: string;
    providerRoles: string[];
    email?: string;
}

class AuthService {
    private static TOKEN_KEY = 'auth_token';
    private static USER_KEY = 'auth_user';

    static getStoredToken(): string | null {
        const token = localStorage.getItem(this.TOKEN_KEY);
        if (!token || token === 'undefined' || token === 'null') {
            return null;
        }
        return token;
    }

    static getStoredUser(): AuthResponse['user'] | null {
        const userStr = localStorage.getItem(this.USER_KEY);
        if (!userStr || userStr === 'undefined' || userStr === 'null') {
            return null;
        }
        try {
            return JSON.parse(userStr);
        } catch (error) {
            console.warn('Error parsing stored user data:', error);
            localStorage.removeItem(this.USER_KEY);
            return null;
        }
    }

    static async login(credentials: LoginCredentials): Promise<AuthResponse> {
        // Evitar loguear contraseñas en consola
        console.log('🌐 AuthService - Iniciando petición de login para:', (credentials.email || '').toLowerCase());
        
        const response = await ApiService.fetchData<AuthResponse>({
            url: '/auth/login',
            method: 'post',
            data: credentials,
        });

        console.log('🌐 AuthService - Respuesta completa recibida:', response)
        console.log('🌐 AuthService - Datos extraídos:', response.data)
        
        this.storeAuthData(response.data);
        console.log('🌐 AuthService - Datos almacenados en localStorage')
        
        return response.data;
    }

    static async register(data: RegisterCredentials): Promise<AuthResponse> {
        const response = await ApiService.fetchData<AuthResponse>({
            url: '/auth/register',
            method: 'post',
            data,
        });

        this.storeAuthData(response.data);
        return response.data;
    }

    static async logout(): Promise<void> {
        // No dependemos del backend para cerrar sesión; limpiamos localmente.
        this.clearAuthData();
        return Promise.resolve();
    }

    private static storeAuthData(response: AuthResponse): void {
        localStorage.setItem(this.TOKEN_KEY, response.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
    }

    static clearAuthData(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
    }

    static cleanupStorageData(): void {
        // Limpiar datos corruptos del localStorage
        const token = localStorage.getItem(this.TOKEN_KEY);
        const user = localStorage.getItem(this.USER_KEY);
        
        if (token === 'undefined' || token === 'null') {
            localStorage.removeItem(this.TOKEN_KEY);
        }
        
        if (user === 'undefined' || user === 'null') {
            localStorage.removeItem(this.USER_KEY);
        }
    }

    static getAuthState(): AuthState {
        // Limpiar datos corruptos primero
        this.cleanupStorageData();
        
        const token = this.getStoredToken();
        const user = this.getStoredUser();

        return {
            isAuthenticated: Boolean(token),
            user,
            token,
        };
    }

    static async validateInviteToken(token: string): Promise<{ valid: boolean }> {
        const response = await ApiService.fetchData<{ valid: boolean }>({
            url: `/auth/invite/validate?token=${encodeURIComponent(token)}`,
            method: 'get',
        });
        return response.data;
    }

    static async acceptInviteToken(data: AcceptInviteData): Promise<AuthResponse> {
        const response = await ApiService.fetchData<AuthResponse>({
            url: '/auth/invite/accept',
            method: 'post',
            data,
        });

        this.storeAuthData(response.data);
        return response.data;
    }
}

// Export named functions for easier import
export const validateInviteToken = (token: string) => AuthService.validateInviteToken(token);
export const acceptInviteToken = (data: AcceptInviteData) => AuthService.acceptInviteToken(data);

export default AuthService;
