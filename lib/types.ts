// User Types
export interface User {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'teacher' | 'admin' | 'expert';
    roles: ('user' | 'teacher' | 'admin' | 'expert')[];
    avatar?: string;
    title?: string | null;
    isVerified?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
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
    _id: string;
    id?: string; // For backward compatibility
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    coverImage?: string;
    authorId: {
        _id: string;
        name: string;
        email: string;
        avatar?: string;
        bio?: string;
    };
    author?: string; // For backward compatibility
    category?: string;
    tags: string[];
    isPublished: boolean;
    views: number;
    likes?: number;
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
    readTime?: number;
    featured?: boolean;
}

export interface BlogPagination {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
}

export interface BlogResponse {
    blogs: BlogPost[];
    pagination: BlogPagination;
}

export interface CreateBlogPostData {
    title: string;
    content: string;
    coverImage?: string;
    category?: string;
    tags: string[];
    isPublished?: boolean;
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

export interface ForumPostDetail extends ForumPost {
    comments: ForumReply[];
    reactions: {
        id: string;
        userId: string;
        type: string;
        createdAt: string;
    }[];
}

// API Response Types
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    status?: number;
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
    courseImg: string;
}