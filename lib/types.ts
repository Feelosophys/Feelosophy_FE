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
    id?: string; // For backward compatibility
    _id: string;
    title: string;
    description: string;
    instructor: string;
    instructorImage?: string;
    duration: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    price: number;
    originalPrice?: number;
    rating: number;
    students: number;
    image: string;
    category: string;
    topics?: string[];
    objectives?: string[];
    requirements?: string[];
    curriculum?: {
        module: string;
        lessons: {
            title: string;
            duration: string;
            type: 'video' | 'reading' | 'quiz' | 'assignment';
        }[];
    }[];
    reviews?: {
        id: string;
        studentName: string;
        avatar: string;
        rating: number;
        comment: string;
        date: string;
        verified: boolean;
    }[];
    ageRange: string;
    courseDuration: string;
    courseType: 'individual' | 'corporate' | 'group';
    features: string[];
    corporateFeatures?: string[];
    minParticipants?: number;
    maxParticipants?: number;
    totalHours: number;
    lessons: number;
    createdAt?: string;
    updatedAt?: string;
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

// Forum Types
export interface ForumPost {
    id: string;
    title: string;
    content: string;
    author: string;
    authorAvatar: string;
    category: string;
    tags: string[];
    likes: number;
    replies: number;
    views: number;
    createdAt: string;
    lastActivity: string;
    isPinned?: boolean;
    isResolved?: boolean;
}

export interface ForumReply {
    id: string;
    postId: string;
    content: string;
    author: string;
    authorAvatar: string;
    likes: number;
    createdAt: string;
    isAccepted?: boolean;
}

export interface CreateForumPostData {
    title: string;
    content: string;
    category: string;
    tags: string[];
}

export interface CreateForumCommentData {
    content: string;
}

export interface ForumReactionData {
    type: 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry';
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

// Course API Response Types
export interface CourseInstructor {
    _id: string;
    name: string;
    email: string;
    bio?: string;
    avatar?: string;
}

export interface CourseStats {
    totalEnrollments: number;
    totalLessons: number;
}

export interface CourseAPIResponse {
    _id: string;
    title: string;
    description: string;
    price: number;
    category: string | { _id: string; name: string };
    instructor: CourseInstructor;
    stats: CourseStats;
    createdAt: string;
    updatedAt: string;
}