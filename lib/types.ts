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

export interface UserCourseInstructorInfo {
    _id: string;
    name: string;
    avatar?: string | null;
}

export interface UserCourseEnrollment {
    _id: string;
    enrolledAt: string;
    updatedAt?: string;
    status: 'enrolled' | 'completed';
    viaOrganization?: boolean;
    paymentId?: string | null;
    course: {
        _id: string;
        title: string;
        description?: string;
        price?: number;
        originalPrice?: number;
        rating?: number;
        category?: string;
        ageRange?: string;
        courseType?: string;
        totalHours?: number;
        courseDuration?: string;
        students?: number;
        courseImg?: string | null;
        isPublished?: boolean;
        createdAt?: string;
        updatedAt?: string;
        instructorInfo: UserCourseInstructorInfo | null;
        totalLessons: number;
    };
    totalLessons: number;
    completedLessons: number;
    progressPercentage: number;
    enrollmentDuration: number;
    lastAccessed?: string | Date | null;
}

export interface UserCoursesPagination {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
}

export interface UserCoursesSummary {
    totalEnrolled: number;
    completedCourses: number;
    activeCourses: number;
}

export interface UserCoursesResponse {
    courses: UserCourseEnrollment[];
    pagination: UserCoursesPagination;
    summary: UserCoursesSummary;
}

export interface CourseLearningVideo {
    _id: string;
    title: string;
    url: string;
    duration?: number;
}

export interface CourseLearningDocument {
    _id: string;
    name: string;
    fileUrl: string;
}

export interface CourseLearningModule {
    _id: string;
    title: string;
    order: number;
    videos: CourseLearningVideo[];
    documents: CourseLearningDocument[];
}

export interface CourseLearningProgress {
    completedLessons: number;
    totalLessons: number;
    percentage: number;
    lastViewedLessonId: string | null;
}

export interface CourseLearningEnrollment {
    _id: string;
    status: 'enrolled' | 'completed';
    enrolledAt: string;
    updatedAt?: string;
    viaOrganization?: boolean;
    payment?: {
        _id: string;
        status: string;
        amount?: number;
        method?: string;
        createdAt?: string;
        updatedAt?: string;
    } | null;
}

export interface CourseLearningCourse {
    _id: string;
    title: string;
    description: string;
    category?: string;
    courseImg?: string;
    rating?: number;
    totalHours?: number;
    courseDuration?: string;
    totalLessons: number;
    totalVideos: number;
    instructor: {
        _id: string;
        name: string;
        email?: string;
        avatar?: string;
        bio?: string;
        title?: string;
    } | null;
    stats: {
        totalEnrollments: number;
        totalLessons: number;
        totalVideos?: number;
        totalDocuments?: number;
        createdAt?: string;
        lastUpdated?: string;
    };
}

export interface CourseLearningContent {
    course: CourseLearningCourse;
    enrollment: CourseLearningEnrollment;
    progress: CourseLearningProgress;
    curriculum: CourseLearningModule[];
}