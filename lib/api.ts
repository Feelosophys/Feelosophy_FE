import axios from 'axios';
import { User } from './types';

// API Base Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
const ACCESS_TOKEN_STORAGE_KEY = 'access_token';
const REFRESH_TOKEN_STORAGE_KEY = 'refresh_token';

// HTTP Methods
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// API Response Type
interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  status?: number;
}

// API Client Class
export class ApiClient {
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
      
      let payload: any = {};

      if (contentType && contentType.includes('application/json')) {
        payload = await response.json();
      } else {
        const text = await response.text();
        payload = text ? { message: text } : {};
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
  async login(credentials: { email: string; password: string }) {
    return this.request<{ accessToken: string; refreshToken: string; user: any }>('/auth/login', 'POST', credentials);
  }

  async register(userData: { email: string; password: string; name: string }) {
    return this.request<{ accessToken: string; refreshToken: string; user: any }>('/auth/register', 'POST', userData);
  }

  // Token management
  setTokens(accessToken: string, refreshToken: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
    }
  }
  
  setAuthTokens(accessToken: string, refreshToken: string) {
    this.setTokens(accessToken, refreshToken);
  }

  getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
    }
    return null;
  }

  clearTokens() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
      localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    }
  }

  // Authenticated requests
  async authenticatedRequest<T>(
    endpoint: string,
    method: HttpMethod = 'GET',
    data?: unknown
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {};
    const accessToken = this.getAccessToken();

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    return this.request<T>(endpoint, method, data, headers);
  }

  // User methods
  async getProfile() {
    return this.authenticatedRequest<User>('/users/profile', 'GET');
  }
  
  async logout() {
    const response = await this.request<void>('/auth/logout', 'POST');
    this.clearTokens();
    return response;
  }
  
  // Course methods
  async getCourse(id: string) {
    return this.request<any>(`/courses/${id}`, 'GET');
  }
  
  async getCourses() {
    return this.request<any[]>('/courses', 'GET');
  }
  
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
    return this.request<{
      courses: any[];
      pagination: {
        currentPage: number;
        totalPages: number;
        totalCount: number;
      }
    }>('/courses', 'GET', params);
  }
  
  async getAvailableCategories() {
    return this.request<{
      categories: {
        _id: string;
        name: string;
        count: number;
      }[]
    }>('/courses/categories', 'GET');
  }
  
  // Expert methods
  async getExpert(id: string) {
    return this.request<any>(`/experts/${id}`, 'GET');
  }
  
  async getExperts() {
    return this.request<any[]>('/experts', 'GET');
  }
  
  // Blog methods
  async getBlogPost(id: string) {
    return this.request<any>(`/blogs/${id}`, 'GET');
  }
  
  async getBlogPosts() {
    return this.request<any>('/blogs', 'GET');
  }

  // Payment methods
  async createCoursePayment(courseId: string) {
    return this.authenticatedRequest<{
      orderId: string;
      checkoutUrl: string;
      qrCode: string;
      amount: number;
      expiredAt: string;
    }>(`/payments/course/${courseId}`, 'POST');
  }

  async checkPaymentStatus(orderId: string) {
    return this.request<{
      orderId: string;
      status: string;
      paymentData: any;
    }>(`/payments/check/${orderId}`, 'GET');
  }
}

// Create and export API client instance
export const apiClient = new ApiClient();