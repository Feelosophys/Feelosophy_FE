import { apiClient } from './api';
import { User } from './types';

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  experts: number;
  patients: number;
  admins: number;
}

export async function getUsers(params: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  sortBy?: keyof User;
  sortOrder?: 'asc' | 'desc';
}) {
  try {
    // 💡 Bước 1: Khởi tạo đối tượng tham số sạch
    const queryParams: Record<string, any> = {
      page: params.page,
      limit: params.limit,
      sort_by: params.sortBy,
      sort_direction: params.sortOrder,
    };

    // 💡 Bước 2: Thêm các tham số lọc nếu chúng hợp lệ
    // 1. Tham số Tìm kiếm (Search)
    if (params.search && params.search.trim() !== '') {
      queryParams.search = params.search.trim();
    }

    // 2. Tham số Vai trò (Role)
    if (params.role && params.role !== 'all') {
      queryParams.role = params.role;
    }

    // 3. Tham số Trạng thái (Status)
    if (params.status && params.status !== 'all') {
      // Vì status 'pending' có thể không tồn tại trong logic isVerified
      // chỉ gửi lên nếu nó không phải 'all'
      queryParams.status = params.status;
    }

    // 💡 Bước 3: Gửi đối tượng tham số đã được dọn dẹp
    const response = await apiClient.authenticatedRequest<{
      data: unknown[];
      totalUsers: number;
      totalPages: number;
      currentPage?: number;
    }>('/admin/users', 'GET', queryParams); // Sử dụng queryParams đã dọn dẹp

    console.log('Users API response:', response);

    // ... (Logic kiểm tra và mapping còn lại giữ nguyên)

    if (!response.success || !response.data || !Array.isArray(response.data.data)) {
      console.error('API request failed:', response.error, response.message);
      return {
        success: false,
        error: response.error || 'Không thể tải dữ liệu người dùng',
        message: response.message,
      };
    }

    const users: User[] = response.data.data.map((user: any) => {
      console.log('Mapping user:', user);
      return {
        id: user.id || user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        status: user.isVerified ? 'active' : 'inactive',
        joinDate: user.joinedDate || user.createdAt?.split('T')[0] || '',
        lastLogin: user.updatedAt?.split('T')[0] || user.createdAt?.split('T')[0] || '',
        coursesEnrolled: user.coursesEnrolled || 0,
        totalSpent: user.totalSpent || 0,
        city: user.location || '',
        specialization: user.title || '',
        rating: user.rating || 0,
        consultations: user.consultations || 0,
        avatar: user.avatar || '',
        permissions: user.roles || [],
      };
    });

    return {
      success: true,
      data: {
        users,
        totalUsers: response.data.totalUsers,
        totalPages: response.data.totalPages,
        currentPage: response.data.currentPage || params.page || 1,
      },
    };
  } catch (error) {
    console.error('getUsers error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định',
    };
  }
}

export async function getUserStats() {
  const response = await apiClient.authenticatedRequest<UserStats>('/admin/users/stats', 'GET');
  console.log('Stats API response:', response);
  return response;
}

// Export users to CSV
export async function exportUsers(params: {
  search?: string;
  role?: string;
  status?: string;
  sortBy?: keyof User;
  sortOrder?: 'asc' | 'desc';
}) {
  const response = await apiClient.authenticatedRequest<{ users: User[] }>('/admin/users/export', 'GET', {
    search: params.search || undefined,
    role: params.role !== 'all' ? params.role : undefined,
    status: params.status !== 'all' ? params.status : undefined,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
  });
  return response;
}

// Get user details
export async function getUserDetails(userId: string) {
  const response = await apiClient.authenticatedRequest<void>(`/admin/users/${userId}`, 'GET');
  return response;
}

// Update user details
export async function updateUserDetails(userId: string, data: Partial<User>) {
  const response = await apiClient.authenticatedRequest<void>(`/admin/users/${userId}`, 'PATCH', data);
  return response;
}

// Approve a user
export async function approveUser(userId: string) {
  const response = await apiClient.authenticatedRequest<void>(`/admin/users/${userId}/approve`, 'PATCH');
  return response;
}

// Toggle user status
export async function toggleUserStatus(userId: string) {
  const response = await apiClient.authenticatedRequest<void>(`/admin/users/${userId}/toggle-status`, 'PATCH');
  return response;
}

// Delete a user
export async function deleteUser(userId: string) {
  const response = await apiClient.authenticatedRequest<void>(`/admin/users/${userId}`, 'DELETE');
  return response;
}

export async function getAllCourses() {
  const response = await apiClient.authenticatedRequest<void>('/admin/courses', 'GET');
  return response;
}

