import { useState, useEffect, useCallback } from 'react';
import { apiClient } from './api';
import { ApiResponse, AuthResponse, User } from './types';

// Hook để quản lý authentication state
export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const initializeSession = (authData: AuthResponse) => {
        apiClient.setAuthTokens(authData.accessToken, authData.refreshToken);
        setUser(authData.user);
        setIsAuthenticated(true);
    };

    useEffect(() => {
        const initializeAuth = async () => {
            const token = apiClient.getAccessToken();
            if (token) {
                setIsAuthenticated(true);
                await fetchProfile();
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await apiClient.getProfile();
            if (response.success && response.data) {
                setUser(response.data);
                setIsAuthenticated(true);
            } else if (response.status === 401) {
                apiClient.clearTokens();
                setUser(null);
                setIsAuthenticated(false);
            }
            return response;
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch profile'
            };
        }
    };

    const login = async (credentials: { email: string; password: string }) => {
        try {
            const response = await apiClient.login(credentials);
            if (response.success && response.data) {
                initializeSession(response.data);
                return response;
            }
            setIsAuthenticated(false);
            return response;
        } catch (error) {
            console.error('Login failed:', error);
            setIsAuthenticated(false);
            return { success: false, error: 'Login failed' };
        }
    };

    const register = async (userData: { email: string; password: string; name: string }) => {
        try {
            const response = await apiClient.register(userData);
            if (response.success && response.data) {
                initializeSession(response.data);
                return response;
            }
            setIsAuthenticated(false);
            return response;
        } catch (error) {
            console.error('Registration failed:', error);
            setIsAuthenticated(false);
            return { success: false, error: 'Registration failed' };
        }
    };

    const logout = async () => {
        try {
            await apiClient.logout();
            apiClient.clearTokens();
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return {
        isAuthenticated,
        user,
        loading,
        login,
        register,
        logout,
        fetchProfile,
        initializeSession,
    };
}

// Hook để fetch data với loading state
export function useApi<T>(
    apiCall: () => Promise<ApiResponse<T>>
) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiCall();

            if (response.success && response.data) {
                setData(response.data);
            } else {
                setError(response.error || 'Failed to fetch data');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    }, [apiCall]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        data,
        loading,
        error,
        refetch: fetchData,
    };
}

// Hook cho courses
export function useCourses() {
    return useApi(() => apiClient.getCourses());
}

// Hook cho experts
export function useExperts() {
    return useApi(() => apiClient.getExperts());
}

// Hook cho blog posts
export function useBlogPosts() {
    return useApi(() => apiClient.getBlogPosts());
}

// Hook cho single course
export function useCourse(id: string) {
    return useApi(() => apiClient.getCourse(id));
}

// Hook cho single expert
export function useExpert(id: string) {
    return useApi(() => apiClient.getExpert(id));
}

// Hook cho single blog post
export function useBlogPost(id: string) {
    return useApi(() => apiClient.getBlogPost(id));
}