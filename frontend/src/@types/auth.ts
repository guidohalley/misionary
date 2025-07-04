export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials extends LoginCredentials {
    nombre: string;
    tipo: 'CLIENTE' | 'PROVEEDOR' | 'EMPLEADO';
    roles: ('ADMIN' | 'USER' | 'MANAGER')[];
}

export interface AuthResponse {
    user: {
        id: number;
        email: string;
        nombre: string;
        tipo: string;
        roles: string[];
    };
    token: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: AuthResponse['user'] | null;
    token: string | null;
}
