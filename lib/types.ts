// User Types
export interface User {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'creator' | 'admin';
    avatar?: string;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    name: string;
}

// Course Types
export interface Course {
    id: string;
    title: string;
    description: string;
    instructor: string;
    instructorId: string;
    price: number;
    duration: number;
    level: 'beginner' | 'intermediate' | 'advanced';
    category: string;
    thumbnail?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCourseData {
    title: string;
    description: string;
    price: number;
    duration: number;
    level: 'beginner' | 'intermediate' | 'advanced';
    category: string;
    thumbnail?: string;
}

// Expert Types
export interface Expert {
    id: string;
    name: string;
    expertise: string[];
    bio: string;
    rating: number;
    avatar?: string;
    hourlyRate: number;
    availableSlots: string[];
    createdAt: string;
    updatedAt: string;
}

// Blog/Forum Types
export interface BlogPost {
    id: string;
    title: string;
    content: string;
    author: string;
    authorId: string;
    category: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateBlogPostData {
    title: string;
    content: string;
    category: string;
    tags: string[];
}

// API Response Types
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface ApiError {
    message: string;
    status: number;
    code?: string;
}

// Generic Types
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface QueryParams {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}