// src/api/AdminApiClient.ts
import { ApiClient, ApiResponse } from './api'; // Điều chỉnh đường dẫn đến file ApiClient gốc

// Types cho response (tùy chỉnh theo dữ liệu thực tế từ backend)
interface DashboardStats {
  totalUsers: number;
  totalExperts: number;
  totalCourses: number;
  totalRevenue: number;
  monthlyRevenue: number;
  growthRate: number;
  activeUsers: number;
  coursesCompleted: number;
  averageRating: number;
  responseTime: string;
}

interface UserGrowthData {
  month: string;
  users: number;
  experts: number;
  revenue: number;
}

interface CourseStats {
  category: string;
  students: number;
  revenue: number;
}

interface UserTypeDistribution {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

interface RecentActivity {
  id: string;
  type: string;
  user: string;
  time: string;
  description: string;
}

export class AdminApiClient extends ApiClient {
  async getDashboardStats(timeRange: string = '12months'): Promise<ApiResponse<DashboardStats>> {
    return this.authenticatedRequest<DashboardStats>(`/admin-dashboard/stats?timeRange=${timeRange}`);
  }

  async getUserGrowth(timeRange: string = '12months'): Promise<ApiResponse<UserGrowthData[]>> {
    return this.authenticatedRequest<UserGrowthData[]>(`/admin-dashboard/user-growth?timeRange=${timeRange}`);
  }

  async getCourseStats(timeRange: string = '12months', limit: number = 6): Promise<ApiResponse<CourseStats[]>> {
    return this.authenticatedRequest<CourseStats[]>(`/admin-dashboard/courses/stats?timeRange=${timeRange}&limit=${limit}`);
  }

  async getUserTypeDistribution(timeRange: string = '12months'): Promise<ApiResponse<UserTypeDistribution[]>> {
    return this.authenticatedRequest<UserTypeDistribution[]>(`/admin-dashboard/users/distribution?timeRange=${timeRange}`);
  }

  async getRecentActivities(limit: number = 5, type: string = 'all'): Promise<ApiResponse<RecentActivity[]>> {
    return this.authenticatedRequest<RecentActivity[]>(`/admin-dashboard/activities/recent?limit=${limit}&type=${type}`);
  }
}

// Export instance để sử dụng
export const adminApiClient = new AdminApiClient();