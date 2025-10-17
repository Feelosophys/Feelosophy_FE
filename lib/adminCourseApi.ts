//lib/adminCourseApi.ts
import { ApiClient } from './api';

// Interface cho CourseAnalytics (dựa trên component, có thể điều chỉnh dựa trên response thực tế từ API admin)
interface CourseAnalytics {
  id: string;
  title: string;
  instructor: string;
  category: 'individual' | 'corporate';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: number;
  originalPrice?: number;
  students: number;
  rating: number;
  revenue: number;
  completionRate: number;
  status: 'active' | 'draft' | 'archived';
  createdDate: string;
  lastUpdated: string;
  duration: string;
  image: string;
}

// Interface cho response của getAdminCourses
interface AdminCoursesResponse {
  courses: CourseAnalytics[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
  };
}

// Interface cho response của getCourseStats (giả sử dựa trên mô tả, điều chỉnh nếu cần)
interface CourseStatsResponse {
  totalCourses: number;
  activeCourses: number;
  totalStudents: number;
  totalRevenue: number;
  averageRating: number;
  averageCompletionRate: number;
  // Thêm các stats khác nếu API cung cấp
}

// AdminApiClient class kế thừa từ ApiClient
export class AdminApiClient extends ApiClient {
  constructor(baseURL?: string) {
    super(baseURL);
  }

  // Phương thức get all courses cho admin
  async getAdminCourses(params: {
    page?: number;
    limit?: number;
    category?: string;
    status?: string;
    level?: string;
    sort_by?: string;
    sort_direction?: string;
  } = {}) {
    return this.authenticatedRequest<AdminCoursesResponse>('/admin/courses', 'GET', params);
  }

  // Phương thức get course stats cho admin
  async getCourseStats() {
    return this.authenticatedRequest<CourseStatsResponse>('/admin/courses/stats', 'GET');
  }

  // Phương thức get course detail cho admin
  async getAdminCourseDetail(courseId: string) {
    return this.authenticatedRequest<CourseAnalytics>(`/admin/courses/${courseId}`, 'GET');
  }

  // Các phương thức khác từ ApiClient vẫn có thể sử dụng, không cần override trừ khi cần thay đổi
}

// Create and export Admin API client instance
export const adminApiClient = new AdminApiClient();