import {
    ApiResponse,
    AuthResponse,
    LoginCredentials,
    RegisterData,
    User,
    Course,
    CreateCourseData,
    Expert,
    BlogPost,
    CreateBlogPostData,
} from './types';

// API Base Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// HTTP Methods
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// API Client Class
class ApiClient {
    private baseURL: string;

    constructor(baseURL: string = API_BASE_URL) {
        this.baseURL = baseURL;
    }

    private async request<T>(
        endpoint: string,
        method: HttpMethod = 'GET',
        data?: unknown,
        headers: Record<string, string> = {}
    ): Promise<ApiResponse<T>> {
        try {
            const config: RequestInit = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
            };

            // Add body for non-GET requests
            if (data && method !== 'GET') {
                config.body = JSON.stringify(data);
            }

            // For GET requests with query parameters
            let url = `${this.baseURL}${endpoint}`;
            if (data && method === 'GET') {
                const params = new URLSearchParams(data as Record<string, string>);
                url += `?${params}`;
            }

            const response = await fetch(url, config);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || `HTTP Error: ${response.status}`);
            }

            return {
                success: true,
                data: result.data || result,
                message: result.message,
            };
        } catch (error) {
            console.error('API Request Error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
            };
        }
    }

    // Authentication methods
    async login(credentials: LoginCredentials) {
        return this.request<AuthResponse>('/auth/login', 'POST', credentials);
    }

    async register(userData: RegisterData) {
        return this.request<AuthResponse>('/auth/register', 'POST', userData);
    }

    async logout() {
        return this.request<void>('/auth/logout', 'POST');
    }

    // User methods
    async getProfile() {
        return this.request<User>('/users/profile', 'GET');
    }

    async updateProfile(data: Partial<User>) {
        return this.request<User>('/users/profile', 'PUT', data);
    }

    async getUsers() {
        return this.request<User[]>('/users', 'GET');
    }

    // Course methods
    async getCourses() {
        return this.request<Course[]>('/courses', 'GET');
    }

    async getCourse(id: string) {
        return this.request<Course>(`/courses/${id}`, 'GET');
    }

    async createCourse(courseData: CreateCourseData) {
        return this.request<Course>('/courses', 'POST', courseData);
    }

    async updateCourse(id: string, courseData: Partial<CreateCourseData>) {
        return this.request<Course>(`/courses/${id}`, 'PUT', courseData);
    }

    async deleteCourse(id: string) {
        return this.request<void>(`/courses/${id}`, 'DELETE');
    }

    // Expert methods
    async getExperts() {
        return this.request<Expert[]>('/experts', 'GET');
    }

    async getExpert(id: string) {
        return this.request<Expert>(`/experts/${id}`, 'GET');
    }

    // Blog/Forum methods
    async getBlogPosts() {
        return this.request<BlogPost[]>('/blog', 'GET');
    }

    async getBlogPost(id: string) {
        return this.request<BlogPost>(`/blog/${id}`, 'GET');
    }

    async createBlogPost(postData: CreateBlogPostData) {
        return this.request<BlogPost>('/blog', 'POST', postData);
    }

    // Generic methods
    async get<T>(endpoint: string, params?: any) {
        return this.request<T>(endpoint, 'GET', params);
    }

    async post<T>(endpoint: string, data?: any) {
        return this.request<T>(endpoint, 'POST', data);
    }

    async put<T>(endpoint: string, data?: any) {
        return this.request<T>(endpoint, 'PUT', data);
    }

    async delete<T>(endpoint: string) {
        return this.request<T>(endpoint, 'DELETE');
    }

    // Set authorization token
    setAuthToken(token: string) {
        // Store token in localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', token);
        }
    }

    // Get authorization token
    getAuthToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('auth_token');
        }
        return null;
    }

    // Remove authorization token
    removeAuthToken() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
        }
    }

    // Make authenticated requests
    async authenticatedRequest<T>(
        endpoint: string,
        method: HttpMethod = 'GET',
        data?: any
    ): Promise<ApiResponse<T>> {
        const token = this.getAuthToken();
        const headers: Record<string, string> = {};

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        return this.request<T>(endpoint, method, data, headers);
    }
}

// Create and export API client instance
export const apiClient = new ApiClient();

// Export default
export default apiClient;