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
    BlogResponse,
    CreateBlogPostData,
    ForumPost,
    ForumReply,
    CreateForumPostData,
    CreateForumCommentData,
    ForumReactionData,
} from './types';

// API Base Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
const ACCESS_TOKEN_STORAGE_KEY = 'access_token';
const REFRESH_TOKEN_STORAGE_KEY = 'refresh_token';

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
            const contentType = response.headers.get('content-type');
            type ApiPayload = {
                data?: T;
                message?: string;
                [key: string]: unknown;
            };

            let payload: ApiPayload = {};

            if (contentType && contentType.includes('application/json')) {
                payload = (await response.json()) as ApiPayload;
            } else {
                const text = await response.text();
                payload = text ? {
                    message: text
                } : {};
            }

            const message = typeof payload.message === 'string' ? payload.message : undefined;
            const resolvedData = payload.data !== undefined ? payload.data : (payload as unknown as T | undefined);

            if (response.ok) {
                return {
                    success: true,
                    data: resolvedData,
                    message,
                    status: response.status,
                };
            }

            return {
                success: false,
                error: message || `HTTP Error: ${response.status}`,
                data: resolvedData,
                message,
                status: response.status,
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
        const refreshToken = this.getRefreshToken();
        const response = await this.request<void>('/auth/logout', 'POST', refreshToken ? {
            refreshToken
        } : {});
        this.clearTokens();
        return response;
    }

    // User methods
    async getProfile() {
        return this.authenticatedRequest<User>('/users/profile', 'GET');
    }

    async updateProfile(data: Partial<User>) {
        return this.authenticatedRequest<User>('/users/profile', 'PUT', data);
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
        return this.authenticatedRequest<Course>('/courses', 'POST', courseData);
    }

    async updateCourse(id: string, courseData: Partial<CreateCourseData>) {
        return this.authenticatedRequest<Course>(`/courses/${id}`, 'PUT', courseData);
    }

    async deleteCourse(id: string) {
        return this.authenticatedRequest<void>(`/courses/${id}`, 'DELETE');
    }

    // Additional Course methods
    async getAllCourses(params?: {
        page?: number;
        limit?: number;
        search?: string;
        category?: string;
        minPrice?: number;
        maxPrice?: number;
        sortBy?: string;
        sortOrder?: string;
        featured?: boolean;
    }) {
        return this.request<unknown>('/courses', 'GET', params);
    }

    async getCoursesByType(courseType: string, params?: {
        page?: number;
        limit?: number;
        search?: string;
        category?: string;
        sortBy?: string;
        sortOrder?: string;
    }) {
        return this.request<unknown>(`/courses/type/${courseType}`, 'GET', params);
    }

    async getAvailableCategories() {
        return this.request<unknown>('/courses/categories', 'GET');
    }

    async getTopRatedCourses() {
        return this.request<unknown>('/courses/top-rated', 'GET');
    }

    // Expert methods
    async getExperts() {
        return this.request<Expert[]>('/experts', 'GET');
    }

    async getExpert(id: string) {
        return this.request<Expert>(`/experts/${id}`, 'GET');
    }

    // Blog/Forum methods
    async getBlogPosts(params?: {
        page?: number;
        limit?: number;
        search?: string;
        tags?: string;
        isPublished?: boolean;
        sortBy?: string;
        sortOrder?: string;
    }) {
        const queryParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) {
                    queryParams.append(key, value.toString());
                }
            });
        }
        const queryString = queryParams.toString();
        const endpoint = queryString ? `/blogs?${queryString}` : '/blogs';
        return this.request<BlogResponse>(endpoint, 'GET');
    }

    async getBlogPost(id: string) {
        return this.request<BlogPost>(`/blogs/${id}`, 'GET');
    }

    async getBlogBySlug(slug: string) {
        return this.request<BlogPost>(`/blogs/slug/${slug}`, 'GET');
    }

    async createBlogPost(postData: CreateBlogPostData) {
        return this.authenticatedRequest<BlogPost>('/blogs', 'POST', postData);
    }

    // Forum methods
    async getForumPosts(params?: {
        status?: 'open' | 'closed';
        tags?: string[];
        limit?: number;
        skip?: number;
        search?: string;
        category?: string;
        sortBy?: string;
        sortOrder?: string;
    }) {
        return this.authenticatedRequest<ForumPost[]>('/forum', 'GET', params);
    }

    async getForumPost(id: string) {
        return this.authenticatedRequest<ForumPost>(`/forum/${id}`, 'GET');
    }

    async createForumPost(postData: CreateForumPostData) {
        return this.authenticatedRequest<ForumPost>('/forum', 'POST', postData);
    }

    async updateForumPost(id: string, postData: Partial<CreateForumPostData & { status?: 'open' | 'closed' }>) {
        return this.authenticatedRequest<ForumPost>(`/forum/${id}`, 'PUT', postData);
    }

    async deleteForumPost(id: string) {
        return this.authenticatedRequest<void>(`/forum/${id}`, 'DELETE');
    }

    async addForumComment(postId: string, commentData: CreateForumCommentData) {
        return this.authenticatedRequest<ForumReply>(`/forum/${postId}/comments`, 'POST', commentData);
    }

    async addForumReaction(postId: string, reactionData: ForumReactionData) {
        return this.authenticatedRequest<unknown>(`/forum/${postId}/reactions`, 'POST', reactionData);
    }

    // Generic methods
    async get<T>(endpoint: string, params?: unknown) {
        return this.request<T>(endpoint, 'GET', params);
    }

    async post<T>(endpoint: string, data?: unknown) {
        return this.request<T>(endpoint, 'POST', data);
    }

    async put<T>(endpoint: string, data?: unknown) {
        return this.request<T>(endpoint, 'PUT', data);
    }

    async delete<T>(endpoint: string) {
        return this.request<T>(endpoint, 'DELETE');
    }

    setAuthTokens(accessToken: string, refreshToken: string) {
        this.setAccessToken(accessToken);
        this.setRefreshToken(refreshToken);
    }

    setAccessToken(token: string) {
        if (typeof window !== 'undefined') {
            localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
        }
    }

    setRefreshToken(token: string) {
        if (typeof window !== 'undefined') {
            localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, token);
        }
    }

    getAccessToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
        }
        return null;
    }

    getRefreshToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
        }
        return null;
    }

    clearTokens() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
            localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
        }
    }

    // Make authenticated requests
    async refreshAccessToken() {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
            return {
                success: false,
                error: 'No refresh token available'
            } satisfies ApiResponse<{ accessToken: string; refreshToken: string }>;
        }

        const response = await this.request<{
            accessToken: string;
            refreshToken: string;
            user: User;
        }>('/auth/refresh-token', 'POST', {
            refreshToken
        });

        if (response.success && response.data) {
            const {
                accessToken,
                refreshToken: newRefreshToken
            } = response.data;
            if (accessToken) {
                this.setAccessToken(accessToken);
            }
            if (newRefreshToken) {
                this.setRefreshToken(newRefreshToken);
            }
        } else if (response.status === 401) {
            this.clearTokens();
        }

        return response;
    }

    // Make authenticated requests
    async authenticatedRequest<T>(
        endpoint: string,
        method: HttpMethod = 'GET',
        data?: unknown,
        attemptRefresh = true
    ): Promise<ApiResponse<T>> {
        const headers: Record<string, string> = {};
        const accessToken = this.getAccessToken();

        if (accessToken) {
            headers.Authorization = `Bearer ${accessToken}`;
        }

        const initialResponse = await this.request<T>(endpoint, method, data, headers);

        if (!initialResponse.success && initialResponse.status === 401 && attemptRefresh) {
            const refreshResponse = await this.refreshAccessToken();

            if (refreshResponse.success) {
                const updatedAccessToken = this.getAccessToken();
                if (updatedAccessToken) {
                    headers.Authorization = `Bearer ${updatedAccessToken}`;
                } else {
                    delete headers.Authorization;
                }

                return this.request<T>(endpoint, method, data, headers);
            }

            this.clearTokens();
        }

        return initialResponse;
    }
}

// Create and export API client instance
export const apiClient = new ApiClient();

// Export default
export default apiClient;