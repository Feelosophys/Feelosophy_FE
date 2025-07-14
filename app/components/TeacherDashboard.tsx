"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  DollarSign, 
  Users, 
  BookOpen, 
  TrendingUp, 
  Plus,
  Edit,
  Eye,
  BarChart3,
  Calendar,
  Star,
  Award,
  Clock,
  Download,
  PlayCircle,
  FileText
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface TeacherDashboardProps {
  onCreateCourse: () => void;
  onEditCourse: (courseId: string) => void;
}

// Mock teacher data
const teacherStats = {
  totalRevenue: 45600000, // VND
  monthlyRevenue: 8900000,
  totalStudents: 1247,
  totalCourses: 6,
  averageRating: 4.8,
  totalReviews: 342,
  totalHoursTeaching: 48,
  certificatesIssued: 892
};

const teacherCourses = [
  {
    id: 'tc-1',
    title: 'Tâm lý học Ứng dụng trong Đời sống',
    description: 'Khóa học toàn diện về tâm lý học ứng dụng trong cuộc sống hàng ngày',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    price: 599000,
    students: 456,
    rating: 4.9,
    reviews: 89,
    revenue: 27244400,
    status: 'published',
    createdDate: '2024-01-15',
    lastUpdated: '2024-12-10',
    totalLessons: 24,
    totalDuration: '8.5 giờ',
    category: 'Tâm lý ứng dụng'
  },
  {
    id: 'tc-2',
    title: 'Quản lý Stress và Anxiety',
    description: 'Học cách nhận diện và quản lý stress, anxiety hiệu quả',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    price: 749000,
    students: 342,
    rating: 4.7,
    reviews: 73,
    revenue: 25625800,
    status: 'published',
    createdDate: '2024-02-20',
    lastUpdated: '2024-12-08',
    totalLessons: 18,
    totalDuration: '6.2 giờ',
    category: 'Sức khỏe tinh thần'
  },
  {
    id: 'tc-3',
    title: 'Kỹ năng Giao tiếp Hiệu quả',
    description: 'Phát triển kỹ năng giao tiếp trong cuộc sống và công việc',
    image: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    price: 699000,
    students: 289,
    rating: 4.8,
    reviews: 61,
    revenue: 20201100,
    status: 'published',
    createdDate: '2024-03-10',
    lastUpdated: '2024-11-25',
    totalLessons: 20,
    totalDuration: '7.1 giờ',
    category: 'Kỹ năng xã hội'
  },
  {
    id: 'tc-4',
    title: 'Mindfulness và Thiền định Cơ bản',
    description: 'Khóa học thiền định và mindfulness cho người mới bắt đầu',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    price: 549000,
    students: 156,
    rating: 4.6,
    reviews: 34,
    revenue: 8564400,
    status: 'draft',
    createdDate: '2024-11-01',
    lastUpdated: '2024-12-15',
    totalLessons: 15,
    totalDuration: '5.3 giờ',
    category: 'Thiền định'
  }
];

const revenueData = [
  { month: 'T7', revenue: 5600000 },
  { month: 'T8', revenue: 6800000 },
  { month: 'T9', revenue: 7200000 },
  { month: 'T10', revenue: 8100000 },
  { month: 'T11', revenue: 7900000 },
  { month: 'T12', revenue: 8900000 }
];

export function TeacherDashboard({ onCreateCourse, onEditCourse }: TeacherDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Đã xuất bản</Badge>;
      case 'draft':
        return <Badge variant="secondary">Bản nháp</Badge>;
      case 'under_review':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Đang duyệt</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Giáo viên</h1>
            <p className="text-gray-600 mt-1">
              Quản lý khóa học và theo dõi hiệu suất giảng dạy
            </p>
          </div>
          <Button onClick={onCreateCourse} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Tạo khóa học mới
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm border border-blue-100">
            <TabsTrigger value="overview" className="flex items-center space-x-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              <BarChart3 className="h-4 w-4" />
              <span>Tổng quan</span>
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center space-x-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              <BookOpen className="h-4 w-4" />
              <span>Khóa học của tôi</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              <TrendingUp className="h-4 w-4" />
              <span>Phân tích</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Tổng doanh thu</p>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(teacherStats.totalRevenue)}</p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600">+12.5%</span>
                        <span className="text-sm text-gray-500 ml-1">tháng này</span>
                      </div>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Tổng học viên</p>
                      <p className="text-2xl font-bold text-gray-900">{teacherStats.totalStudents.toLocaleString()}</p>
                      <div className="flex items-center mt-2">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm text-gray-600">Đánh giá: {teacherStats.averageRating}</span>
                      </div>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Tổng khóa học</p>
                      <p className="text-2xl font-bold text-gray-900">{teacherStats.totalCourses}</p>
                      <div className="flex items-center mt-2">
                        <Award className="h-4 w-4 text-purple-500 mr-1" />
                        <span className="text-sm text-gray-600">{teacherStats.certificatesIssued} chứng chỉ</span>
                      </div>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-full">
                      <BookOpen className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Giờ giảng dạy</p>
                      <p className="text-2xl font-bold text-gray-900">{teacherStats.totalHoursTeaching}</p>
                      <div className="flex items-center mt-2">
                        <Clock className="h-4 w-4 text-orange-500 mr-1" />
                        <span className="text-sm text-gray-600">{teacherStats.totalReviews} đánh giá</span>
                      </div>
                    </div>
                    <div className="bg-orange-100 p-3 rounded-full">
                      <Clock className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
                <CardHeader>
                  <CardTitle>Khóa học nổi bật</CardTitle>
                  <CardDescription>Top khóa học có doanh thu cao nhất</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teacherCourses
                      .filter(course => course.status === 'published')
                      .sort((a, b) => b.revenue - a.revenue)
                      .slice(0, 3)
                      .map((course) => (
                        <div key={course.id} className="flex items-center space-x-4 p-3 bg-blue-50/50 rounded-lg">
                          <ImageWithFallback
                            src={course.image}
                            alt={course.title}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{course.title}</h4>
                            <div className="flex items-center space-x-2 text-xs text-gray-600">
                              <span>{course.students} học viên</span>
                              <span>•</span>
                              <span>{formatCurrency(course.revenue)}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{course.rating}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
                <CardHeader>
                  <CardTitle>Doanh thu 6 tháng gần đây</CardTitle>
                  <CardDescription>Xu hướng doanh thu theo tháng</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {revenueData.map((data, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{data.month}</span>
                        <div className="flex items-center space-x-2 flex-1 mx-4">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${(data.revenue / Math.max(...revenueData.map(d => d.revenue))) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-sm font-medium">{formatCurrency(data.revenue)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Khóa học của tôi</CardTitle>
                    <CardDescription>
                      Quản lý tất cả khóa học bạn đã tạo ({teacherCourses.length} khóa học)
                    </CardDescription>
                  </div>
                  <Button onClick={onCreateCourse} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo khóa học mới
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teacherCourses.map((course) => (
                    <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                      <div className="relative">
                        <ImageWithFallback
                          src={course.image}
                          alt={course.title}
                          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2">
                          {getStatusBadge(course.status)}
                        </div>
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="bg-white/90 text-gray-700">
                            {course.category}
                          </Badge>
                        </div>
                      </div>
                      
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div>
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                              {course.title}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2 mt-1">{course.description}</p>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Users className="h-3 w-3" />
                              <span>{course.students}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span>{course.rating}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{course.totalDuration}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Doanh thu</span>
                              <span className="font-semibold text-green-600">{formatCurrency(course.revenue)}</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              Cập nhật: {formatDate(course.lastUpdated)}
                            </div>
                          </div>
                          
                          <div className="flex space-x-2 pt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() => onEditCourse(course.id)}
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Chỉnh sửa
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Xem
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
                <CardHeader>
                  <CardTitle>Hiệu suất khóa học</CardTitle>
                  <CardDescription>So sánh các chỉ số khóa học</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teacherCourses.filter(c => c.status === 'published').map((course) => (
                      <div key={course.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium truncate">{course.title}</span>
                          <span className="text-sm text-gray-600">{course.students} học viên</span>
                        </div>
                        <Progress value={(course.students / teacherStats.totalStudents) * 100} className="h-2" />
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Đánh giá: {course.rating}/5</span>
                          <span>{formatCurrency(course.revenue)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
                <CardHeader>
                  <CardTitle>Thống kê tháng này</CardTitle>
                  <CardDescription>Doanh thu và học viên mới</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-green-700">Doanh thu tháng này</p>
                          <p className="text-2xl font-bold text-green-800">{formatCurrency(teacherStats.monthlyRevenue)}</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-green-600" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-blue-50 rounded-lg text-center">
                        <p className="text-lg font-bold text-blue-800">89</p>
                        <p className="text-xs text-blue-600">Học viên mới</p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg text-center">
                        <p className="text-lg font-bold text-purple-800">23</p>
                        <p className="text-xs text-purple-600">Đánh giá mới</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}