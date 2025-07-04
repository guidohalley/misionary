import axios, { InternalAxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import appConfig from '@/configs/app.config';
import AuthService from './AuthService';

const unauthorizedCode = [401];

const BaseService = axios.create({
    timeout: 60000,
    baseURL: appConfig.apiPrefix,
});

BaseService.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = AuthService.getStoredToken();

        if (token) {
            if (!config.headers) {
                config.headers = {};
            }
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    },
);

BaseService.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        const response = error.response;

        if (response && unauthorizedCode.includes(response.status)) {
            AuthService.clearAuthData();
        }

        return Promise.reject(error);
    },
);

export default BaseService;
