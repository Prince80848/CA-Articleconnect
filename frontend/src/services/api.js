import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
}, (error) => Promise.reject(error));

// Handle token expiration
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Only attempt refresh if it's actually an auth error (not a server error disguised as 401)
            const message = error.response?.data?.message || '';
            const isAuthError = message.includes('Not authorized') || message.includes('token') || message.includes('Token');
            
            if (isAuthError) {
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken && !error.config._retry) {
                    error.config._retry = true;
                    try {
                        const { data } = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });
                        localStorage.setItem('token', data.data.token);
                        error.config.headers.Authorization = `Bearer ${data.data.token}`;
                        return api(error.config);
                    } catch (err) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('refreshToken');
                        localStorage.removeItem('user');
                        window.location.href = '/login';
                    }
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
