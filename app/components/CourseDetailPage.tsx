"use client"

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import {
  ArrowLeft,
  Play,
  Clock,
  Users,
  Star,
  BookOpen,
  Award,
  Download,
  Share2,
  Heart,
  MessageCircle,
  CheckCircle,
  Calendar,
  Smartphone,
  Monitor,
  Building2,
  ShoppingCart,
  Gift,
  Loader2
} from 'lucide-react';
import { mockCourses } from '../data/mockData';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { apiClient } from '../../lib/api';
import type { CourseAPIResponse, Course, User } from '../../lib/types';

interface CourseDetailPageProps {
  courseId: string;
  onBack: () => void;
  onPurchase: (courseId: string, courseTitle: string, coursePrice: number) => void;
  onCorporatePurchase?: (courseId: string) => void;
  onLearn?: (courseId: string) => void;
  currentUser?: User | null;
}

export function CourseDetailPage({
  courseId,
  onBack,
  onPurchase,
  onCorporatePurchase,
  onLearn,
  currentUser
}: CourseDetailPageProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch course details from API
  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching course details for ID:', courseId);
        const response = await apiClient.getCourse(courseId);
        console.log('Course API Response:', response);

        if (response.success && response.data) {
          // Map API data to UI format
          const apiData = response.data as unknown as CourseAPIResponse;
          const mappedCourse = {
            _id: apiData._id,
            id: apiData._id, // For compatibility
            title: apiData.title,
            description: apiData.description,
            price: apiData.price,
            category: typeof apiData.category === 'string' ? apiData.category : apiData.category.name,
            instructor: apiData.instructor?.name || 'Unknown Instructor',
            instructorImage: apiData.instructor?.avatar || '',
            duration: '4 weeks', // Default, API doesn't provide
            level: 'Beginner' as const, // Default
            rating: 4.5, // Default, API doesn't provide
            students: apiData.stats?.totalEnrollments || 0,
            image: apiData.courseImg, // Default image
            topics: [], // Default
            objectives: [], // Default
            requirements: [], // Default
            curriculum: [], // Default
            reviews: [], // Default
            ageRange: 'children', // Default
            courseDuration: '4 weeks', // Default
            courseType: 'individual' as const, // Default
            features: ['Video Lectures', 'Quizzes', 'Certificate'], // Default
            corporateFeatures: [], // Default
            minParticipants: 1, // Default
            maxParticipants: 1, // Default
            totalHours: 12, // Default
            lessons: apiData.stats?.totalLessons || 0,
            createdAt: apiData.createdAt,
            updatedAt: apiData.updatedAt
          };
          console.log('Mapped course:', mappedCourse);
          setCourse(mappedCourse);
        } else {
          setError(response.error || 'Failed to fetch course details');
        }
      } catch (err) {
        console.error('Fetch course error:', err);
        setError('Failed to fetch course details');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  const courseReviews = course?.reviews || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Đang tải chi tiết khóa học...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl mb-4">{error || 'Course not found'}</h2>
          <Button onClick={onBack}>Quay lại</Button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getCorporatePrice = () => {
    const basePrice = course.price;
    // Corporate pricing starts at 15% discount for 10+ users
    const corporatePrice = Math.round(basePrice * 0.85);
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(corporatePrice);
  };

  const getDifficultyColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
      case 'cơ bản':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'intermediate':
      case 'trung bình':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'advanced':
      case 'nâng cao':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCompletionStats = () => {
    const totalLessons = course.lessons || 8;
    const completedLessons = Math.floor(totalLessons * 0.3); // Simulate 30% completion
    return { totalLessons, completedLessons, percentage: (completedLessons / totalLessons) * 100 };
  };

  const stats = getCompletionStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button onClick={onBack} variant="ghost" size="lg">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Quay lại khóa học
          </Button>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => setIsWishlisted(!isWishlisted)}>
              <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Hero */}
            <div className="relative">
              <ImageWithFallback
                src={course.image}
                alt={course.title}
                className="w-full h-64 lg:h-80 object-cover rounded-2xl shadow-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Badge className={getDifficultyColor(course.level)}>
                    {course.level}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {course.category}
                  </Badge>
                </div>
                <h1 className="text-2xl lg:text-4xl font-bold text-white mb-2">{course.title}</h1>
                <p className="text-white/90 text-sm lg:text-base line-clamp-2">{course.description}</p>
              </div>
              <Button
                size="lg"
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
              >
                <Play className="h-5 w-5 mr-2" />
                Xem giới thiệu
              </Button>
            </div>

            {/* Course Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{course.students}</div>
                  <div className="text-sm text-gray-600">Học viên</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
                    <Star className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{course.rating}</div>
                  <div className="text-sm text-gray-600">Đánh giá</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{course.duration}</div>
                  <div className="text-sm text-gray-600">Thời lượng</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-2">
                    <Award className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">95%</div>
                  <div className="text-sm text-gray-600">Hoàn thành</div>
                </CardContent>
              </Card>
            </div>

            {/* Course Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                <TabsTrigger value="curriculum">Nội dung</TabsTrigger>
                <TabsTrigger value="instructor">Giảng viên</TabsTrigger>
                <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Mô tả khóa học</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {course.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Bạn sẽ học được gì:</h4>
                        <ul className="space-y-2">
                          {course.features?.map((feature, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-700">{feature}</span>
                            </li>
                          )) || course.objectives?.map((objective, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-700">{objective}</span>
                            </li>
                          )) || [
                            'Hiểu sâu về tâm lý học cơ bản',
                            'Phát triển kỹ năng tư duy phản biện',
                            'Áp dụng kiến thức vào cuộc sống',
                            'Cải thiện mối quan hệ cá nhân'
                          ].map((feature, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Yêu cầu:</h4>
                        <ul className="space-y-2">
                          {course.requirements?.map((requirement, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-700">{requirement}</span>
                            </li>
                          )) || [
                            'Không cần kiến thức trước',
                            'Máy tính hoặc điện thoại',
                            'Kết nối internet ổn định'
                          ].map((requirement, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-700">{requirement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="curriculum" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Nội dung khóa học</CardTitle>
                    <CardDescription>
                      {stats.totalLessons} bài học • {course.duration} • Cập nhật {new Date().getFullYear()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {course.curriculum?.map((module, moduleIndex) => (
                      <div key={moduleIndex} className="space-y-2">
                        <h4 className="font-semibold text-lg mb-3">{module.module}</h4>
                        {module.lessons.map((lesson, lessonIndex) => (
                          <div key={lessonIndex} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                                <span className="text-sm font-medium text-blue-600">{lessonIndex + 1}</span>
                              </div>
                              <div>
                                <h4 className="font-medium">{lesson.title}</h4>
                                <p className="text-sm text-gray-600">{lesson.duration}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {lessonIndex < 3 && <CheckCircle className="h-5 w-5 text-green-600" />}
                              <Button variant="ghost" size="sm">
                                <Play className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )) || Array.from({ length: 8 }, (_, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                            <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                          </div>
                          <div>
                            <h4 className="font-medium">Bài {index + 1}: Giới thiệu tâm lý học</h4>
                            <p className="text-sm text-gray-600">15 phút</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {index < 3 && <CheckCircle className="h-5 w-5 text-green-600" />}
                          <Button variant="ghost" size="sm">
                            <Play className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="instructor" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Giảng viên</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start space-x-4">
                      <ImageWithFallback
                        src={course.instructorImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"}
                        alt={course.instructor || "Instructor"}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold">{course.instructor || "TS. Nguyễn Văn A"}</h3>
                        <p className="text-gray-600 mb-3">Tiến sĩ Tâm lý học</p>
                        <p className="text-gray-700 leading-relaxed">
                          Với hơn 15 năm kinh nghiệm trong lĩnh vực tâm lý học, {course.instructor} đã giúp hàng nghìn người cải thiện sức khỏe tinh thần và chất lượng cuộc sống.
                        </p>
                        <div className="flex items-center space-x-4 mt-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>5,000+ học viên</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <BookOpen className="h-4 w-4" />
                            <span>12 khóa học</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>4.9 đánh giá</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Đánh giá từ học viên</CardTitle>
                    <CardDescription>
                      {courseReviews.length} đánh giá • Trung bình {course.rating}/5
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {courseReviews.map((review) => (
                      <div key={review.id} className="border-b pb-6 last:border-b-0">
                        <div className="flex items-start space-x-4">
                          <ImageWithFallback
                            src={review.avatar}
                            alt={review.studentName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h4 className="font-medium">{review.studentName}</h4>
                                <div className="flex items-center space-x-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${i < review.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                        }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <span className="text-sm text-gray-500">{review.date}</span>
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase Card */}
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {formatPrice(course.price)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Truy cập trọn đời • Chứng chỉ hoàn thành
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <Button
                    onClick={() => onPurchase(courseId, course.title, course.price)}
                    className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg font-semibold"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Mua ngay
                  </Button>

                  <Button
                    onClick={() => onCorporatePurchase?.(courseId)}
                    variant="outline"
                    className="w-full h-12 border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
                  >
                    <Building2 className="h-5 w-5 mr-2" />
                    <div className="flex flex-col items-start">
                      <span className="font-semibold">Mua cho tổ chức</span>
                      <span className="text-xs text-blue-600">Từ {getCorporatePrice()}/người</span>
                    </div>
                  </Button>

                  <Button variant="outline" className="w-full">
                    <Gift className="h-4 w-4 mr-2" />
                    Dùng thử miễn phí
                  </Button>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h4 className="font-semibold">Khóa học bao gồm:</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <Monitor className="h-4 w-4 text-blue-600" />
                      <span>{course.duration} video theo yêu cầu</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4 text-blue-600" />
                      <span>Tài liệu bổ trợ</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Smartphone className="h-4 w-4 text-blue-600" />
                      <span>Truy cập trên mobile và TV</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span>Truy cập trọn đời</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-blue-600" />
                      <span>Chứng chỉ hoàn thành</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Download className="h-4 w-4 text-blue-600" />
                      <span>Tải về để học offline</span>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="text-center">
                  <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Liên hệ tư vấn
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Progress Card (if user is enrolled) */}
            {currentUser ? (
              <Card>
                <CardHeader>
                  <CardTitle>Tiến độ học tập</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Hoàn thành</span>
                      <span>{stats.completedLessons}/{stats.totalLessons} bài học</span>
                    </div>
                    <Progress value={stats.percentage} className="h-2" />
                    <div className="text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onLearn?.(courseId)}
                        disabled={!onLearn}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Tiếp tục học
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {/* Related Courses */}
            <Card>
              <CardHeader>
                <CardTitle>Khóa học liên quan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockCourses
                    .filter(c => c.id !== courseId && c.category === course.category)
                    .slice(0, 3)
                    .map((relatedCourse) => (
                      <div key={relatedCourse.id} className="flex space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                        <ImageWithFallback
                          src={relatedCourse.image}
                          alt={relatedCourse.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2 mb-1">
                            {relatedCourse.title}
                          </h4>
                          <div className="flex items-center space-x-1 text-xs text-gray-600">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{relatedCourse.rating}</span>
                          </div>
                          <div className="text-sm font-semibold text-blue-600 mt-1">
                            {formatPrice(relatedCourse.price)}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}