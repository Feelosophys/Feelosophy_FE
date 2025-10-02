"use client"

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Star, Users, Search, Clock, BookOpen, Heart, ShoppingCart, Calendar, Building2, User, Target, Award, Loader2 } from 'lucide-react';
import { mockCourses, toggleWishlist, isInWishlist, getCoursesByType, type Course } from '../data/mockData';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { apiClient } from '../../lib/api';

interface CoursesPageProps {
  onCourseSelect?: (courseId: string) => void;
}

export function CoursesPage({ onCourseSelect }: CoursesPageProps) {
  const [courseType, setCourseType] = useState<'individual' | 'corporate'>('individual');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [ageRangeFilter, setAgeRangeFilter] = useState('all');
  const [durationFilter, setDurationFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [ageRanges, setAgeRanges] = useState<string[]>([]);
  const [durations, setDurations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        // Map sortBy to backend accepted values
        let apiSortBy: string;
        let apiSortOrder: string;
        switch (sortBy) {
          case 'popular':
            apiSortBy = 'enrolledUsers';
            apiSortOrder = 'desc';
            break;
          case 'rating':
            // Backend doesn't have rating sort, use createdAt
            apiSortBy = 'createdAt';
            apiSortOrder = 'desc';
            break;
          case 'price-low':
            apiSortBy = 'price';
            apiSortOrder = 'asc';
            break;
          case 'price-high':
            apiSortBy = 'price';
            apiSortOrder = 'desc';
            break;
          case 'newest':
            apiSortBy = 'createdAt';
            apiSortOrder = 'desc';
            break;
          case 'students':
            apiSortBy = 'enrolledUsers';
            apiSortOrder = 'desc';
            break;
          default:
            apiSortBy = 'createdAt';
            apiSortOrder = 'desc';
        }

        const params: any = {
          page: 1,
          limit: 12,
          sortBy: apiSortBy,
          sortOrder: apiSortOrder,
        };

        if (searchTerm) params.search = searchTerm;
        if (categoryFilter !== 'all') params.category = categoryFilter;

        console.log('Fetching courses with params:', params);
        const response = await apiClient.getAllCourses(params);
        console.log('API Response:', response);

        if (response.success && response.data) {
          const allCourses = response.data.courses || [];
          console.log('All courses data:', allCourses);
          // Filter client-side by courseType
          const filteredByType = allCourses.filter((course: Course) => course.courseType === courseType);
          console.log('Filtered courses for type', courseType, ':', filteredByType);
          setCourses(filteredByType);
        } else {
          setError(response.error || 'Failed to fetch courses');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [courseType, searchTerm, categoryFilter, sortBy]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.getAvailableCategories();
        if (response.success && response.data) {
          setCategories(response.data.categories || []);
        }
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };
    fetchCategories();
  }, []);

  // Update filters from courses
  useEffect(() => {
    if (courses.length > 0) {
      setAgeRanges(Array.from(new Set(courses.map(course => course.ageRange))));
      setDurations(Array.from(new Set(courses.map(course => course.courseDuration))));
    }
  }, [courses]);

  const filteredCourses = courses.filter(course => {
    const matchesAgeRange = ageRangeFilter === 'all' || course.ageRange === ageRangeFilter;
    const matchesDuration = durationFilter === 'all' || course.courseDuration === durationFilter;

    return matchesAgeRange && matchesDuration;
  }); // Remove .sort() since sorting is done server-side

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleWishlistToggle = (courseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newWishlistState = toggleWishlist(courseId);
    if (newWishlistState) {
      setWishlistItems([...wishlistItems, courseId]);
    } else {
      setWishlistItems(wishlistItems.filter(id => id !== courseId));
    }
  };

  const handlePurchase = (course: Course, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCourse(course);
    setShowPurchaseDialog(true);
  };

  const handleCourseClick = (courseId: string) => {
    if (onCourseSelect) {
      onCourseSelect(courseId);
    }
  };

  const confirmPurchase = () => {
    // Simulate purchase process
    setShowPurchaseDialog(false);
    setSelectedCourse(null);
    // Here you would typically integrate with payment system
  };

  const resetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setAgeRangeFilter('all');
    setDurationFilter('all');
    setSortBy('popular');
  };

  const getStatsForCurrentType = () => {
    const totalCourses = courses.length;
    const totalStudents = courses.reduce((sum: number, course: Course) => sum + course.students, 0);
    const avgRating = courses.reduce((sum: number, course: Course) => sum + course.rating, 0) / totalCourses;
    const totalHours = courses.reduce((sum: number, course: Course) => sum + course.totalHours, 0);

    return { totalCourses, totalStudents, avgRating: avgRating.toFixed(1), totalHours };
  };

  const stats = getStatsForCurrentType();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Khóa học Tâm lý</h1>
          <p className="text-gray-600">
            Khám phá các khóa học chuyên sâu về tâm lý học từ các chuyên gia hàng đầu
          </p>
        </div>

        {/* Course Type Tabs */}
        <Tabs value={courseType} onValueChange={(value) => setCourseType(value as 'individual' | 'corporate')} className="mb-8">
          <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm border border-blue-100 max-w-md">
            <TabsTrigger
              value="individual"
              className="flex items-center space-x-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
            >
              <User className="h-4 w-4" />
              <span>Cá nhân</span>
            </TabsTrigger>
            <TabsTrigger
              value="corporate"
              className="flex items-center space-x-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
            >
              <Building2 className="h-4 w-4" />
              <span>Doanh nghiệp</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="individual" className="space-y-8">
            {/* Individual Course Description */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Khóa học dành cho Cá nhân</h3>
                    <p className="text-gray-700 mb-4">
                      Phát triển bản thân, cải thiện sức khỏe tinh thần và xây dựng kỹ năng sống tích cực.
                      Học theo tiến độ cá nhân với sự hỗ trợ từ chuyên gia.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        <Target className="h-3 w-3 mr-1" />
                        Self-improvement
                      </Badge>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        <Clock className="h-3 w-3 mr-1" />
                        Học linh hoạt
                      </Badge>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                        <Award className="h-3 w-3 mr-1" />
                        Chứng chỉ cá nhân
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="corporate" className="space-y-8">
            {/* Corporate Course Description */}
            <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-emerald-100 rounded-full">
                    <Building2 className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Chương trình đào tạo Doanh nghiệp</h3>
                    <p className="text-gray-700 mb-4">
                      Giải pháp đào tạo toàn diện cho tổ chức. Cải thiện môi trường làm việc,
                      tăng năng suất và phát triển nhân sự thông qua các chương trình tâm lý học ứng dụng.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                        <Users className="h-3 w-3 mr-1" />
                        Team Training
                      </Badge>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        <Target className="h-3 w-3 mr-1" />
                        Custom Solutions
                      </Badge>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                        <Award className="h-3 w-3 mr-1" />
                        Enterprise Certificate
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Loading and Error States */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Đang tải khóa học...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <div className="text-red-600 font-medium">Lỗi:</div>
              <div className="ml-2 text-red-700">{error}</div>
            </div>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Thử lại
            </Button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-bold text-lg">{stats.totalCourses}</div>
                  <div className="text-sm text-gray-600">
                    {courseType === 'individual' ? 'Khóa học cá nhân' : 'Chương trình doanh nghiệp'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-bold text-lg">{stats.totalStudents.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">
                    {courseType === 'individual' ? 'Học viên' : 'Tổ chức tham gia'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <div>
                  <div className="font-bold text-lg">{stats.avgRating}</div>
                  <div className="text-sm text-gray-600">Đánh giá TB</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="font-bold text-lg">{stats.totalHours}</div>
                  <div className="text-sm text-gray-600">Giờ đào tạo</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-6 mb-8 border border-blue-100">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={`Tìm kiếm ${courseType === 'individual' ? 'khóa học' : 'chương trình'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-blue-200 focus:border-blue-400"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="border-blue-200 focus:border-blue-400">
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={ageRangeFilter} onValueChange={setAgeRangeFilter}>
              <SelectTrigger className="border-blue-200 focus:border-blue-400">
                <SelectValue placeholder="Độ tuổi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả độ tuổi</SelectItem>
                {ageRanges.map(ageRange => (
                  <SelectItem key={ageRange} value={ageRange}>{ageRange} tuổi</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={durationFilter} onValueChange={setDurationFilter}>
              <SelectTrigger className="border-blue-200 focus:border-blue-400">
                <SelectValue placeholder="Thời lượng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả thời lượng</SelectItem>
                {durations.map(duration => (
                  <SelectItem key={duration} value={duration}>{duration}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="border-blue-200 focus:border-blue-400">
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Phổ biến nhất</SelectItem>
                <SelectItem value="rating">Đánh giá cao</SelectItem>
                <SelectItem value="price-low">Giá thấp → cao</SelectItem>
                <SelectItem value="price-high">Giá cao → thấp</SelectItem>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="students">
                  {courseType === 'individual' ? 'Nhiều học viên' : 'Nhiều tổ chức'}
                </SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={resetFilters}
              className="border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              Xóa bộ lọc
            </Button>
          </div>
        </div>

        {/* Courses Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card
                key={course._id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm border-blue-100 hover:border-blue-200 cursor-pointer group"
                onClick={() => handleCourseClick(course._id)}
              >
                <div className="relative overflow-hidden">
                  <ImageWithFallback
                    src={course.courseImg}
                    alt={course.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className={`${course.courseType === 'corporate'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-blue-100 text-blue-700'
                      }`}>
                      {course.category}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleWishlistToggle(course._id, e)}
                      className={`rounded-full p-2 backdrop-blur-sm ${isInWishlist(course._id)
                        ? 'bg-red-100/80 text-red-600 hover:bg-red-200/80'
                        : 'bg-white/80 text-gray-600 hover:bg-white/90'
                        }`}
                    >
                      <Heart className={`h-4 w-4 ${isInWishlist(course._id) ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <Badge className="bg-white/90 text-gray-800">
                      {course.ageRange} tuổi
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
                        {course.title}
                      </CardTitle>
                      <CardDescription className="text-blue-600 font-medium">
                        {course.instructor}
                      </CardDescription>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{course.rating}</span>
                      <span>({course.students})</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.totalHours}h</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{course.courseDuration}</span>
                    </div>
                  </div>

                  {/* Corporate specific info */}
                  {course.courseType === 'corporate' && (
                    <div className="flex items-center space-x-2 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                      <Users className="h-3 w-3" />
                      <span>{course.minParticipants}-{course.maxParticipants} người tham gia</span>
                    </div>
                  )}
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${course.courseType === 'corporate' ? 'text-emerald-600' : 'text-primary'
                        }`}>
                        {formatPrice(course.price)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {course.courseType === 'corporate'
                          ? `${course.lessons} modules`
                          : `${course.lessons} bài học`
                        }
                      </div>
                    </div>

                    <Button
                      size="sm"
                      onClick={(e) => handlePurchase(course, e)}
                      className={`ml-3 ${course.courseType === 'corporate'
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {course.courseType === 'corporate' ? 'Liên hệ' : 'Mua ngay'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && !error && filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy {courseType === 'individual' ? 'khóa học' : 'chương trình'} nào
            </h3>
            <p className="text-gray-600">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm khác
            </p>
          </div>
        )}
      </div>

      {/* Purchase Dialog */}
      <Dialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedCourse?.courseType === 'corporate' ? 'Liên hệ tư vấn' : 'Xác nhận mua khóa học'}
            </DialogTitle>
            <DialogDescription>
              {selectedCourse?.courseType === 'corporate'
                ? 'Chúng tôi sẽ liên hệ để tư vấn chi tiết về chương trình phù hợp với tổ chức của bạn.'
                : 'Bạn có chắc chắn muốn mua khóa học này không?'
              }
            </DialogDescription>
          </DialogHeader>

          {selectedCourse && (
            <div className="space-y-4">
              <div className="flex space-x-3">
                <ImageWithFallback
                  src={selectedCourse.image}
                  alt={selectedCourse.title}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{selectedCourse.title}</h4>
                  <p className="text-sm text-gray-600">{selectedCourse.instructor}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs">{selectedCourse.rating}</span>
                    <span className="text-xs text-gray-500">({selectedCourse.students} học viên)</span>
                  </div>
                </div>
              </div>

              {selectedCourse.courseType === 'corporate' && (
                <div className="bg-emerald-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 text-sm text-emerald-700 mb-2">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">Thông tin chương trình doanh nghiệp</span>
                  </div>
                  <div className="text-sm text-emerald-600 space-y-1">
                    <div>• Số lượng: {selectedCourse.minParticipants}-{selectedCourse.maxParticipants} người</div>
                    <div>• Thời lượng: {selectedCourse.totalHours} giờ đào tạo</div>
                    <div>• Customization theo nhu cầu công ty</div>
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span>
                    {selectedCourse.courseType === 'corporate' ? 'Giá khởi điểm:' : 'Giá khóa học:'}
                  </span>
                  <span className={`font-bold text-lg ${selectedCourse.courseType === 'corporate' ? 'text-emerald-600' : 'text-primary'
                    }`}>
                    {formatPrice(selectedCourse.price)}
                  </span>
                </div>
                {selectedCourse.courseType === 'corporate' && (
                  <p className="text-xs text-gray-500 mt-1">
                    *Giá cuối cùng sẽ được tính theo số lượng tham gia và yêu cầu tùy chỉnh
                  </p>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPurchaseDialog(false)}>
              Hủy
            </Button>
            <Button
              onClick={confirmPurchase}
              className={selectedCourse?.courseType === 'corporate'
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-blue-600 hover:bg-blue-700'
              }
            >
              {selectedCourse?.courseType === 'corporate' ? 'Gửi yêu cầu tư vấn' : 'Xác nhận mua'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}