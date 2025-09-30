// import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
// import { Course } from '../data/mockData';

// // Base URL từ environment (đặt trong .env: NEXT_PUBLIC_API_URL=http://your-api.com/api)
// const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// // Tạo instance axios với cấu hình chung
// const api: AxiosInstance = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   timeout: 10000, // Timeout 10 giây
// });

// // Interceptor cho request: Thêm token auth nếu có (ví dụ: từ localStorage)
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('authToken'); // Giả sử lưu token ở localStorage
//     if (token) {
//       config.headers = config.headers || {};
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error: AxiosError) => Promise.reject(error)
// );

// // Interceptor cho response: Xử lý lỗi toàn cục
// api.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   (error: AxiosError) => {
//     if (error.response) {
//       // Xử lý lỗi cụ thể, ví dụ: 401 -> logout, 500 -> thông báo server error
//       console.error('API Error:', error.response.data);
//       // Có thể tích hợp toast: toast.error(error.response.data.message || 'Lỗi server');
//     }
//     return Promise.reject(error);
//   }
// );

// // Hàm chung để gọi API (tái sử dụng cho GET/POST/etc.)
// async function apiRequest<T>(
//   method: 'GET' | 'POST' | 'PUT' | 'DELETE',
//   endpoint: string,
//   data?: unknown,
//   params?: unknown
// ): Promise<T> {
//   try {
//     const response = await api({
//       method,
//       url: endpoint,
//       data,
//       params,
//     });
//     return response.data;
//   } catch (error) {
//     throw error; // Để component gọi hàm xử lý lỗi
//   }
// }

// // --- Các hàm cụ thể cho Courses ---

// // Lấy danh sách khóa học theo loại
// export async function getCoursesByType(type: 'individual' | 'corporate'): Promise<Course[]> {
//   return apiRequest<Course[]>('GET', '/courses/type/:courseType', null, { type });
// }

// // Lấy danh sách wishlist
// // export async function getWishlist(): Promise<string[]> {
// //   return apiRequest<string[]>('GET', '/wishlist');
// // }

// // Toggle wishlist (thêm/xóa khóa học)
// // export async function toggleWishlist(courseId: string): Promise<string[]> {
// //   return apiRequest<string[]>('POST', '/wishlist', { courseId });
// // }

// // Mua khóa học hoặc gửi yêu cầu tư vấn
// // export async function purchaseCourse(courseId: string, type: 'individual' | 'corporate'): Promise<void> {
// //   return apiRequest<void>('POST', '/purchase', { courseId, type });
// // }

// // --- Các hàm mở rộng cho các phần khác của dự án (ví dụ) ---

// // Đăng nhập user (thêm khi cần)
// export async function loginUser(email: string, password: string): Promise<{ token: string }> {
//   return apiRequest<{ token: string }>('POST', '/auth/login', { email, password });
// }

// // Lấy thông tin user
// export async function getUserProfile(): Promise<{ id: string; name: string; email: string }> {
//   return apiRequest<{ id: string; name: string; email: string }>('GET', '/user/profile');
// }

// // Thêm hàm khác ở đây khi dự án mở rộng, ví dụ: getPayments, updateCourse, etc.

// export default api; // Export instance axios nếu cần gọi trực tiếp endpoint không định nghĩa