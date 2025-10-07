"use client"

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { User, History, Lock, CreditCard, BookOpen, Users, Calendar, Edit3, Clock, Heart, Star, ShoppingCart, Trash2, Play, CheckCircle, Award, MapPin, Video } from 'lucide-react';
import { mockUser, mockTransactions, mockCourses, mockWishlist, toggleWishlist } from '../data/mockData';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useAuthContext } from '@/lib/auth-context';
import { apiClient } from '@/lib/api';
import type { UserCourseEnrollment, UserCoursesSummary } from '@/lib/types';

const DEFAULT_COURSE_SUMMARY: UserCoursesSummary = {
  totalEnrolled: 0,
  completedCourses: 0,
  activeCourses: 0
};


interface ProfilePageProps {
  defaultTab?: string;
  onCourseSelect?: (courseId: string) => void;
}

// Mock appointments/schedule data
const mockAppointments = [
  {
    id: '1',
    title: 'Tư vấn cá nhân với Dr. Nguyễn Văn A',
    date: '2024-01-25',
    time: '10:00',
    duration: 60,
    expert: 'Dr. Nguyễn Văn A',
    expertImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop',
    type: 'Tư vấn trực tuyến',
    status: 'upcoming',
    meetingLink: 'https://meet.feelosophy.com/session-123',
    notes: 'Tư vấn về quản lý stress trong công việc'
  },
  {
    id: '2',
    title: 'Buổi workshop "Mindfulness cơ bản"',
    date: '2024-01-22',
    time: '14:30',
    duration: 90,
    expert: 'Dr. Trần Thị B',
    expertImage: 'https://images.unsplash.com/photo-1594824792696-9c62e80bb2ce?w=150&h=150&fit=crop',
    type: 'Workshop nhóm',
    status: 'completed',
    notes: 'Workshop giới thiệu các kỹ thuật mindfulness cơ bản'
  },
  {
    id: '3',
    title: 'Tư vấn gia đình với Dr. Lê Minh C',
    date: '2024-01-20',
    time: '16:00',
    duration: 75,
    expert: 'Dr. Lê Minh C',
    expertImage: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop',
    type: 'Tư vấn trực tuyến',
    status: 'completed',
    notes: 'Tư vấn về giao tiếp trong gia đình'
  },
  {
    id: '4',
    title: 'Tái khám với Dr. Nguyễn Văn A',
    date: '2024-02-01',
    time: '09:00',
    duration: 45,
    expert: 'Dr. Nguyễn Văn A',
    expertImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop',
    type: 'Tư vấn trực tuyến',
    status: 'upcoming',
    meetingLink: 'https://meet.feelosophy.com/session-456',
    notes: 'Theo dõi tiến triển sau 2 tuần tư vấn'
  }
];

export function ProfilePage({ defaultTab = 'profile', onCourseSelect }: ProfilePageProps) {
  const { isAuthenticated } = useAuthContext();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(mockUser);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [wishlistItems, setWishlistItems] = useState(mockWishlist);
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [enrolledCourses, setEnrolledCourses] = useState<UserCourseEnrollment[]>([]);
  const [coursesSummary, setCoursesSummary] = useState<UserCoursesSummary>({ ...DEFAULT_COURSE_SUMMARY });
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [coursesError, setCoursesError] = useState<string | null>(null);

  const loadEnrolledCourses = useCallback(async () => {
    if (!isAuthenticated) {
      setEnrolledCourses([]);
      setCoursesSummary({ ...DEFAULT_COURSE_SUMMARY });
      return;
    }

    setCoursesLoading(true);
    setCoursesError(null);

    try {
      const response = await apiClient.getMyCourses({ status: 'all', limit: 50, sortBy: 'enrolledAt', sortOrder: 'desc' });
      if (response.success && response.data) {
        setEnrolledCourses(response.data.courses || []);
        setCoursesSummary(response.data.summary || { ...DEFAULT_COURSE_SUMMARY });
      } else {
        setEnrolledCourses([]);
        setCoursesSummary({ ...DEFAULT_COURSE_SUMMARY });
        setCoursesError(response.error || response.message || 'Không thể tải danh sách khóa học.');
      }
    } catch (error) {
      setEnrolledCourses([]);
      setCoursesSummary({ ...DEFAULT_COURSE_SUMMARY });
      setCoursesError(error instanceof Error ? error.message : 'Không thể tải danh sách khóa học.');
    } finally {
      setCoursesLoading(false);
    }
  }, [isAuthenticated]);

  // Update active tab when defaultTab changes
  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  useEffect(() => {
    loadEnrolledCourses();
  }, [loadEnrolledCourses]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateInput: string | Date) => {
    const dateObj = dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (Number.isNaN(dateObj.getTime())) {
      return '--';
    }
    return dateObj.toLocaleDateString('vi-VN');
  };

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(`${date} ${time}`);
    return {
      date: dateObj.toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: dateObj.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Hoàn thành</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Đang xử lý</Badge>;
      case 'cancelled':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Đã hủy</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getAppointmentStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Sắp tới</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Đã hoàn thành</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-700 border-red-200">Đã hủy</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getCourseStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Hoàn thành</Badge>;
      case 'enrolled':
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Đang học</Badge>;
      case 'not_started':
        return <Badge variant="secondary">Chưa bắt đầu</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTransactionDetails = (transaction: (typeof mockTransactions)[number]) => {
    if (transaction.type === 'consultation') {
      // Try to extract duration from description or title, with fallback
      const textToSearch = transaction.description || transaction.expertName || '';
      const hourMatch = textToSearch.match(/(\d+)\s*giờ/);
      const duration = hourMatch ? parseInt(hourMatch[1]) : 1;
      return {
        duration,
        type: 'Tư vấn',
        icon: <Users className="h-4 w-4" />
      };
    }
    return { duration: null, type: 'Khóa học', icon: <BookOpen className="h-4 w-4" /> };
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleRemoveFromWishlist = (courseId: string) => {
    toggleWishlist(courseId);
    setWishlistItems(wishlistItems.filter(id => id !== courseId));
  };

  const handleCourseClick = (courseId: string) => {
    if (onCourseSelect) {
      onCourseSelect(courseId);
    }
  };

  // const openLearnerPage = (courseId: string) => {
  //   router.push(`/learner/${courseId}`);
  //   if (onCourseSelect) {
  //     onCourseSelect(courseId);
  //   }
  // };

  // const handleContinueCourse = (courseId: string) => {
  //   openLearnerPage(courseId);
  // };

  const handleContinueCourse = (courseId: string) => {
    router.push(`/learner/${courseId}`);
  };

  const handleJoinMeeting = (meetingLink: string) => {
    window.open(meetingLink, '_blank');
  };

  const wishlistedCourses = mockCourses.filter(course => wishlistItems.includes(course.id));

  // Learning stats
  const totalCoursesEnrolled = coursesSummary.totalEnrolled ?? enrolledCourses.length;
  const completedCoursesCount = coursesSummary.completedCourses ?? enrolledCourses.filter(course => course.status === 'completed').length;
  const totalHoursStudied = useMemo(() => {
    return enrolledCourses.reduce((sum, enrollment) => {
      const courseHours = enrollment.course.totalHours || 0;
      const progressRatio = (enrollment.progressPercentage || 0) / 100;
      return sum + Math.round(courseHours * progressRatio);
    }, 0);
  }, [enrolledCourses]);
  const certificatesEarned = 0;

  // Schedule stats
  const upcomingAppointments = mockAppointments.filter(app => app.status === 'upcoming').length;
  const completedAppointments = mockAppointments.filter(app => app.status === 'completed').length;
  const totalAppointments = mockAppointments.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Thông tin cá nhân</h1>
          <p className="text-gray-600">Quản lý thông tin tài khoản, khóa học và lịch hẹn</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-sm border border-blue-100">
            <TabsTrigger value="profile" className="flex items-center space-x-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Tài khoản</span>
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center space-x-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Khóa học</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center space-x-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Lịch hẹn</span>
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="flex items-center space-x-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Wishlist</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center space-x-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">Lịch sử</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile & Security Tab - Combined */}
          <TabsContent value="profile" className="space-y-6">
            {/* Profile Information Card */}
            <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Thông tin cá nhân</CardTitle>
                    <CardDescription>
                      Cập nhật thông tin tài khoản của bạn
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                    className="border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    {isEditing ? 'Lưu' : 'Chỉnh sửa'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20 ring-4 ring-blue-100">
                    <AvatarImage src={userData.avatar} alt={userData.name} />
                    <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                      Thay đổi ảnh
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Họ và tên</Label>
                    <Input
                      id="name"
                      value={userData.name}
                      onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                      disabled={!isEditing}
                      className="border-blue-200 focus:border-blue-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userData.email}
                      onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                      disabled={!isEditing}
                      className="border-blue-200 focus:border-blue-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Ngày tham gia</Label>
                  <Input
                    value={formatDate(userData.createdAt)}
                    disabled
                    className="bg-blue-50/50"
                  />
                </div>

                {isEditing && (
                  <div className="flex space-x-2">
                    <Button onClick={handleSaveProfile} className="bg-blue-600 hover:bg-blue-700">
                      Lưu thay đổi
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)} className="border-blue-300 text-blue-700 hover:bg-blue-50">
                      Hủy
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Password Change Card */}
            <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Lock className="h-5 w-5 text-blue-600" />
                  <div>
                    <CardTitle>Đổi mật khẩu</CardTitle>
                    <CardDescription>
                      Cập nhật mật khẩu để bảo mật tài khoản
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value
                    })}
                    className="border-blue-200 focus:border-blue-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Mật khẩu mới</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value
                    })}
                    className="border-blue-200 focus:border-blue-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value
                    })}
                    className="border-blue-200 focus:border-blue-400"
                  />
                </div>
                <Button onClick={handleChangePassword} className="bg-blue-600 hover:bg-blue-700">
                  <Lock className="h-4 w-4 mr-2" />
                  Đổi mật khẩu
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            {/* Learning Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="text-2xl font-bold text-blue-700">{totalCoursesEnrolled}</div>
                      <div className="text-sm text-blue-600">Khóa học đã đăng ký</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="text-2xl font-bold text-green-700">{completedCoursesCount}</div>
                      <div className="text-sm text-green-600">Hoàn thành</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="text-2xl font-bold text-purple-700">{totalHoursStudied}</div>
                      <div className="text-sm text-purple-600">Giờ học</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-yellow-600" />
                    <div>
                      <div className="text-2xl font-bold text-yellow-700">{certificatesEarned}</div>
                      <div className="text-sm text-yellow-600">Chứng chỉ</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Courses List */}
            <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
              <CardHeader>
                <CardTitle>Khóa học của tôi</CardTitle>
                <CardDescription>
                  Quản lý và tiếp tục học các khóa học đã đăng ký ({totalCoursesEnrolled} khóa học)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {coursesLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <div className="h-10 w-10 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mb-4" />
                    <p>Đang tải khóa học của bạn...</p>
                  </div>
                ) : coursesError ? (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Không thể tải danh sách khóa học
                    </h3>
                    <p className="text-gray-600 mb-4 max-w-md mx-auto">
                      {coursesError}
                    </p>
                    <Button onClick={loadEnrolledCourses} className="bg-blue-600 hover:bg-blue-700">
                      Thử lại
                    </Button>
                  </div>
                ) : enrolledCourses.length > 0 ? (
                  <div className="space-y-4">
                    {enrolledCourses.map((enrollment) => {
                      const course = enrollment.course;
                      const progress = Math.round(enrollment.progressPercentage || 0);
                      const completedLessons = enrollment.completedLessons ?? (progress >= 100 ? enrollment.totalLessons : Math.round((progress / 100) * enrollment.totalLessons));
                      const lastAccessed = enrollment.lastAccessed ? formatDate(enrollment.lastAccessed) : formatDate(enrollment.enrolledAt);
                      const fallbackImage = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80';
                      const courseImage = course.courseImg || fallbackImage;
                      const instructorName = course.instructorInfo?.name || 'Chuyên gia Feelosophy';
                      const totalHours = course.totalHours || 0;
                      const rating = course.rating || 0;
                      const status = enrollment.status;
                      return (
                        <Card key={enrollment._id} className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm border-blue-100 hover:border-blue-200 group">
                          <div className="flex flex-col md:flex-row">
                            <div className="relative md:w-48 h-32 md:h-auto overflow-hidden flex-shrink-0">
                              <ImageWithFallback
                                src={courseImage}
                                alt={course.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute top-2 left-2">
                                <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                                  {course.category || 'Khóa học'}
                                </Badge>
                              </div>
                              <div className="absolute top-2 right-2">
                                {getCourseStatusBadge(status)}
                              </div>
                            </div>

                            <div className="flex-1 p-4">
                              <div className="space-y-3">
                                <div>
                                  <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                                    {course.title}
                                  </h3>
                                  <p className="text-blue-600 font-medium text-sm">{instructorName}</p>
                                </div>

                                <div className="flex items-center justify-between text-sm text-gray-600">
                                  <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-1">
                                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                      <span>{rating.toFixed(1)}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <BookOpen className="h-3 w-3" />
                                      <span>{completedLessons}/{enrollment.totalLessons} bài</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Clock className="h-3 w-3" />
                                      <span>{totalHours}h</span>
                                    </div>
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Truy cập: {lastAccessed}
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Tiến độ học tập</span>
                                    <span className="font-medium text-blue-600">{progress}%</span>
                                  </div>
                                  <Progress value={progress} className="h-2" />
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xs text-gray-500">
                                      Đăng ký: {formatDate(enrollment.enrolledAt)}
                                    </span>
                                  </div>
                                  <div className="flex space-x-2">
                                    {status === 'completed' ? (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => openLearnerPage(course._id)}
                                        className="border-green-300 text-green-700 hover:bg-green-50"
                                      >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Xem lại
                                      </Button>
                                    ) : (
                                      <Button
                                        size="sm"
                                        onClick={() => handleContinueCourse(course._id)}
                                        className="bg-blue-600 hover:bg-blue-700"
                                      >
                                        <Play className="h-4 w-4 mr-2" />
                                        Tiếp tục học
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Chưa có khóa học nào
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Bắt đầu hành trình học tập của bạn bằng cách đăng ký khóa học đầu tiên
                    </p>
                    <Button
                      onClick={() => onCourseSelect && onCourseSelect('courses')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Khám phá khóa học
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6">
            {/* Schedule Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="text-2xl font-bold text-blue-700">{upcomingAppointments}</div>
                      <div className="text-sm text-blue-600">Lịch hẹn sắp tới</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="text-2xl font-bold text-green-700">{completedAppointments}</div>
                      <div className="text-sm text-green-600">Đã hoàn thành</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="text-2xl font-bold text-purple-700">{totalAppointments}</div>
                      <div className="text-sm text-purple-600">Tổng buổi tư vấn</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Appointments List */}
            <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
              <CardHeader>
                <CardTitle>Lịch hẹn của tôi</CardTitle>
                <CardDescription>
                  Quản lý các buổi tư vấn và workshop đã đặt ({totalAppointments} lịch hẹn)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {mockAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {mockAppointments.map((appointment) => {
                      const dateTime = formatDateTime(appointment.date, appointment.time);
                      return (
                        <Card key={appointment.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm border-blue-100 hover:border-blue-200 group">
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                              <div className="flex items-center space-x-3 flex-1">
                                <Avatar className="h-12 w-12 ring-2 ring-blue-100">
                                  <AvatarImage src={appointment.expertImage} alt={appointment.expert} />
                                  <AvatarFallback>{appointment.expert.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {appointment.title}
                                  </h3>
                                  <p className="text-blue-600 font-medium text-sm">{appointment.expert}</p>
                                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                    <div className="flex items-center space-x-1">
                                      <Calendar className="h-3 w-3" />
                                      <span>{dateTime.date}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Clock className="h-3 w-3" />
                                      <span>{dateTime.time} ({appointment.duration} phút)</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <MapPin className="h-3 w-3" />
                                      <span>{appointment.type}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col items-end space-y-2">
                                {getAppointmentStatusBadge(appointment.status)}
                                {appointment.status === 'upcoming' && appointment.meetingLink && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleJoinMeeting(appointment.meetingLink!)}
                                    className="bg-blue-600 hover:bg-blue-700"
                                  >
                                    <Video className="h-4 w-4 mr-2" />
                                    Tham gia
                                  </Button>
                                )}
                              </div>
                            </div>

                            {appointment.notes && (
                              <div className="mt-3 p-3 bg-blue-50/50 rounded-lg">
                                <p className="text-sm text-gray-700">
                                  <span className="font-medium">Ghi chú:</span> {appointment.notes}
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Chưa có lịch hẹn nào
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Đặt lịch tư vấn với chuyên gia để bắt đầu hành trình chăm sóc sức khỏe tinh thần
                    </p>
                    <Button
                      onClick={() => onCourseSelect && onCourseSelect('experts')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Tìm chuyên gia
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist">
            <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
              <CardHeader>
                <CardTitle>Danh sách yêu thích</CardTitle>
                <CardDescription>
                  Các khóa học bạn đã lưu để xem sau ({wishlistedCourses.length} khóa học)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {wishlistedCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {wishlistedCourses.map((course) => (
                      <Card
                        key={course.id}
                        className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm border-blue-100 hover:border-blue-200 cursor-pointer group"
                        onClick={() => handleCourseClick(course.id)}
                      >
                        <div className="relative overflow-hidden">
                          <ImageWithFallback
                            src={course.courseImg}
                            alt={course.title}
                            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2 left-2">
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                              {course.category}
                            </Badge>
                          </div>
                          <div className="absolute top-2 right-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveFromWishlist(course.id);
                              }}
                              className="rounded-full p-1.5 bg-white/80 text-red-600 hover:bg-white/90 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                              {course.title}
                            </h3>
                            <p className="text-sm text-blue-600 font-medium">{course.instructor}</p>

                            <div className="flex items-center space-x-3 text-xs text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span>{course.rating}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{course.totalHours}h</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Users className="h-3 w-3" />
                                <span>{course.students}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                              <div className="text-lg font-bold text-primary">
                                {formatPrice(course.price)}
                              </div>
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Handle purchase
                                }}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                <ShoppingCart className="h-3 w-3 mr-1" />
                                Mua
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Chưa có khóa học nào trong wishlist
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Bắt đầu thêm các khóa học yêu thích vào danh sách để xem sau
                    </p>
                    <Button
                      onClick={() => onCourseSelect && onCourseSelect('courses')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Khám phá khóa học
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
              <CardHeader>
                <CardTitle>Lịch sử giao dịch</CardTitle>
                <CardDescription>
                  Xem tất cả các giao dịch và hoạt động của bạn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTransactions.map((transaction) => {
                    const details = getTransactionDetails(transaction);
                    const displayName = transaction.courseName || transaction.expertName || transaction.description;

                    return (
                      <div key={transaction.id} className="flex items-center justify-between p-4 border border-blue-100 rounded-lg bg-white/50 hover:bg-white/80 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                            {details.icon}
                          </div>
                          <div>
                            <div className="font-medium">{displayName}</div>
                            <div className="text-sm text-gray-600 flex items-center space-x-2">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(transaction.date)}</span>
                              {details.duration && (
                                <>
                                  <span>•</span>
                                  <Clock className="h-3 w-3" />
                                  <span>{details.duration} giờ</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatPrice(transaction.amount)}</div>
                          <div className="mt-1">
                            {getStatusBadge(transaction.status)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {mockTransactions.length === 0 && (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Chưa có giao dịch nào
                    </h3>
                    <p className="text-gray-600">
                      Lịch sử giao dịch của bạn sẽ hiển thị ở đây
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}