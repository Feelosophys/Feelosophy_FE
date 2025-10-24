"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Progress } from './ui/progress';
import { 
  BookOpen, 
  Search, 
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Users,
  DollarSign,
  Star,
  Clock,
  TrendingUp,
  Award
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { adminApiClient } from '../../lib/adminCourseApi';

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

interface CourseStats {
  totalCourses: number;
  activeCourses: number;
  totalStudents: number;
  totalRevenue: number;
  averageRating: number;
  averageCompletionRate: number;
}

export function AdminCoursesPage() {
  const [courses, setCourses] = useState<CourseAnalytics[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<CourseAnalytics[]>([]);
  const [stats, setStats] = useState<CourseStats>({
    totalCourses: 0,
    activeCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    averageRating: 0,
    averageCompletionRate: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof CourseAnalytics>('students');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
  
      try {
        // Fetch course statistics
        const statsResponse = await adminApiClient.getCourseStats();
        if (statsResponse.success && statsResponse.data) {
          setStats(statsResponse.data);
        } else {
          console.error('Failed to fetch course stats:', {
            error: statsResponse.error || 'No error message provided',
            status: statsResponse.status,
            message: statsResponse.message,
            data: statsResponse.data,
          });
          setError(statsResponse.message || statsResponse.error || 'Không thể tải thống kê khóa học');
        }
  
        // Fetch courses with filters
        const params = {
          page: currentPage,
          limit: itemsPerPage,
          category: categoryFilter,
          status: statusFilter,
          level: levelFilter,
          sort_by: sortField,
          sort_direction: sortDirection,
        };
        const response = await adminApiClient.getAdminCourses(params);
  
        if (response.success && response.data?.data) {
          setCourses(response.data.data);
          setFilteredCourses(response.data.data);
          setTotalPages(response.data.totalPages || 1);
        } else {
          console.error('Failed to fetch courses:', {
            error: response.error || 'No error message provided',
            status: response.status,
            message: response.message,
            data: response.data,
          });
          setError(response.message || response.error || 'Không thể tải danh sách khóa học');
        }
      } catch (err) {
        console.error('Unexpected error during fetchData:', {
          error: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : undefined,
        });
        setError('Lỗi không xác định khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [currentPage, categoryFilter, statusFilter, levelFilter, sortField, sortDirection]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'individual':
        return <Badge className="bg-blue-100 text-blue-800">Cá nhân</Badge>;
      case 'corporate':
        return <Badge className="bg-purple-100 text-purple-800">Doanh nghiệp</Badge>;
      default:
        return <Badge variant="secondary">{category}</Badge>;
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'Beginner':
        return <Badge className="bg-green-100 text-green-800">Cơ bản</Badge>;
      case 'Intermediate':
        return <Badge className="bg-yellow-100 text-yellow-800">Trung cấp</Badge>;
      case 'Advanced':
        return <Badge className="bg-red-100 text-red-800">Nâng cao</Badge>;
      default:
        return <Badge variant="secondary">{level}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800">Bản nháp</Badge>;
      case 'archived':
        return <Badge className="bg-yellow-100 text-yellow-800">Lưu trữ</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterCourses(term, categoryFilter, statusFilter, levelFilter);
  };

  const handleCategoryFilter = (category: string) => {
    setCategoryFilter(category);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleLevelFilter = (level: string) => {
    setLevelFilter(level);
    setCurrentPage(1);
  };

  const filterCourses = (search: string, category: string, status: string, level: string) => {
    let filtered = courses;

    if (search) {
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.instructor.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== 'all') {
      filtered = filtered.filter(course => course.category === category);
    }

    if (status !== 'all') {
      filtered = filtered.filter(course => course.status === status);
    }

    if (level !== 'all') {
      filtered = filtered.filter(course => course.level === level);
    }

    setFilteredCourses(filtered);
    setCurrentPage(1);
  };

  const handleSort = (field: keyof CourseAnalytics) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
  };

  const exportToCSV = () => {
    const headers = [
      'ID',
      'Tên khóa học',
      'Giảng viên',
      'Danh mục',
      'Cấp độ',
      'Giá (VND)',
      'Giá gốc (VND)',
      'Số học viên',
      'Đánh giá',
      'Doanh thu (VND)',
      'Tỷ lệ hoàn thành (%)',
      'Trạng thái',
      'Ngày tạo',
      'Cập nhật lần cuối',
      'Thời lượng'
    ];

    const csvData = filteredCourses.map(course => [
      course.id,
      course.title,
      course.instructor,
      course.category,
      course.level,
      course.price,
      course.originalPrice || '',
      course.students,
      course.rating,
      course.revenue,
      course.completionRate,
      course.status,
      course.createdDate,
      course.lastUpdated,
      course.duration
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `courses_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCourses = filteredCourses.slice(startIndex, endIndex);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <p className="text-red-600">Lỗi: {error}</p>
            <Button
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Thử lại
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý khóa học</h1>
          <p className="text-gray-600">
            Quản lý nội dung và hiệu suất khóa học trong hệ thống
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-bold text-lg">{stats.totalCourses}</div>
                  <div className="text-sm text-gray-600">Tổng khóa học</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-bold text-lg">{stats.activeCourses}</div>
                  <div className="text-sm text-gray-600">Đang hoạt động</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="font-bold text-lg">{formatNumber(stats.totalStudents)}</div>
                  <div className="text-sm text-gray-600">Tổng học viên</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-yellow-600" />
                <div>
                  <div className="font-bold text-sm">{formatCurrency(stats.totalRevenue)}</div>
                  <div className="text-sm text-gray-600">Tổng doanh thu</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-orange-600" />
                <div>
                  <div className="font-bold text-lg">{stats.averageRating.toFixed(1)}</div>
                  <div className="text-sm text-gray-600">Đánh giá TB</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
                <div>
                  <div className="font-bold text-lg">{stats.averageCompletionRate.toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">Hoàn thành TB</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card className="bg-white/90 backdrop-blur-sm border-blue-100 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Tìm kiếm khóa học, giảng viên..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 border-blue-200 focus:border-blue-400"
                  />
                </div>
                
                <Select value={categoryFilter} onValueChange={handleCategoryFilter}>
                  <SelectTrigger className="w-40 border-blue-200">
                    <SelectValue placeholder="Danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả danh mục</SelectItem>
                    <SelectItem value="individual">Cá nhân</SelectItem>
                    <SelectItem value="corporate">Doanh nghiệp</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={levelFilter} onValueChange={handleLevelFilter}>
                  <SelectTrigger className="w-40 border-blue-200">
                    <SelectValue placeholder="Cấp độ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả cấp độ</SelectItem>
                    <SelectItem value="Beginner">Cơ bản</SelectItem>
                    <SelectItem value="Intermediate">Trung cấp</SelectItem>
                    <SelectItem value="Advanced">Nâng cao</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={handleStatusFilter}>
                  <SelectTrigger className="w-40 border-blue-200">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="draft">Bản nháp</SelectItem>
                    <SelectItem value="archived">Lưu trữ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={exportToCSV}
                  variant="outline" 
                  className="border-green-200 text-green-600 hover:bg-green-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Xuất CSV
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm khóa học
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Courses Table */}
        <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-blue-100">
                    <TableHead 
                      className="cursor-pointer hover:bg-blue-50"
                      onClick={() => handleSort('title')}
                    >
                      Khóa học {sortField === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead>Danh mục</TableHead>
                    <TableHead>Cấp độ</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-blue-50"
                      onClick={() => handleSort('students')}
                    >
                      Học viên {sortField === 'students' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-blue-50"
                      onClick={() => handleSort('revenue')}
                    >
                      Doanh thu {sortField === 'revenue' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead>Hiệu suất</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentCourses.map((course) => (
                    <TableRow key={course.id} className="border-blue-50 hover:bg-blue-50/50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <img 
                            src={course.image} 
                            alt={course.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <div className="font-medium text-gray-900 max-w-xs truncate">
                              {course.title}
                            </div>
                            <div className="text-sm text-gray-500">{course.category}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {course.createdDate}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getCategoryBadge(course.category)}
                      </TableCell>
                      <TableCell>
                        {getLevelBadge(course.level)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{formatNumber(course.students)}</div>
                          <div className="text-gray-500">học viên</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{formatCurrency(course.revenue)}</div>
                          <div className="text-gray-500">
                            {formatCurrency(course.price)}
                            {course.originalPrice && (
                              <span className="line-through ml-1 text-xs">
                                {formatCurrency(course.originalPrice)}
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span className="text-sm">{course.rating}/5</span>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs text-gray-600">
                              Hoàn thành: {course.completionRate}%
                            </div>
                            <Progress value={course.completionRate} className="h-1" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(course.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={async () => {
                              try {
                                const response = await adminApiClient.getAdminCourseDetail(course.id);
                                if (response.success && response.data) {
                                  console.log('Course details:', response.data);
                                  // Implement navigation or modal to show course details
                                } else {
                                  console.error('Failed to fetch course details:', {
                                    error: response.error,
                                    status: response.status,
                                    message: response.message,
                                  });
                                }
                              } catch (err) {
                                console.error('Error fetching course details:', {
                                  error: err instanceof Error ? err.message : String(err),
                                  stack: err instanceof Error ? err.stack : undefined,
                                });
                              }
                            }}>
                              <Eye className="h-4 w-4 mr-2" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Users className="h-4 w-4 mr-2" />
                              Quản lý học viên
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <TrendingUp className="h-4 w-4 mr-2" />
                              Xem báo cáo
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-blue-100">
                <div className="text-sm text-gray-500">
                  Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredCourses.length)} trong tổng số {filteredCourses.length} khóa học
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Trước
                  </Button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Sau
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}