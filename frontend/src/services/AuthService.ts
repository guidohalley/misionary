import ApiService from './ApiService';
import type { LoginCredentials, RegisterCredentials, AuthResponse, AuthState } from '@/@types/auth';

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
        console.log('🌐 AuthService - Iniciando petición de login:', credentials)
        
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
        try {
            await ApiService.fetchData({
                url: '/auth/logout',
                method: 'post',
            });
        } finally {
            this.clearAuthData();
        }
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
}

export default AuthService;
