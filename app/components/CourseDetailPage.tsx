"use client";

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { 
  Star, 
  Users, 
  Clock, 
  Calendar,
  BookOpen, 
  Heart,
  ShoppingCart,
  Play,
  CheckCircle,
  Award,
  MessageSquare,
  ArrowLeft,
  Share2,
  Download
} from 'lucide-react';
import { mockCourses, toggleWishlist, isInWishlist } from '../data/mockData';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CourseDetailPageProps {
  courseId: string;
  onBack: () => void;
  onPurchase?: (courseId: string) => void;
}

export function CourseDetailPage({ courseId, onBack, onPurchase }: CourseDetailPageProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [isInWishlistState, setIsInWishlistState] = useState(isInWishlist(courseId));

  const course = mockCourses.find(c => c.id === courseId);
  
  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy khóa học
            </h3>
            <Button onClick={onBack} variant="outline">
              Quay lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (date: string | Date) => {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString('vi-VN');
  };

  const handleWishlistToggle = () => {
    const newState = toggleWishlist(courseId);
    setIsInWishlistState(newState);
  };

  const handlePurchase = () => {
    if (onPurchase) {
      onPurchase(courseId);
    }
  };

  const relatedCourses = mockCourses
    .filter(c => c.id !== courseId && (c.category === course.category || c.instructor === course.instructor))
    .slice(0, 3);

  const ratingDistribution = [
    { stars: 5, count: Math.floor(course.reviews.length * 0.6) },
    { stars: 4, count: Math.floor(course.reviews.length * 0.25) },
    { stars: 3, count: Math.floor(course.reviews.length * 0.1) },
    { stars: 2, count: Math.floor(course.reviews.length * 0.03) },
    { stars: 1, count: Math.floor(course.reviews.length * 0.02) }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-blue-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Quay lại khóa học</span>
            </Button>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Chia sẻ
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleWishlistToggle}
                className={isInWishlistState ? 'text-red-600' : ''}
              >
                <Heart className={`h-4 w-4 mr-2 ${isInWishlistState ? 'fill-current' : ''}`} />
                {isInWishlistState ? 'Đã lưu' : 'Lưu'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Hero */}
            <div className="space-y-6">
              <div className="relative overflow-hidden rounded-xl">
                <ImageWithFallback
                  src={course.image}
                  alt={course.title}
                  className="w-full h-64 md:h-80 object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <Button size="lg" className="bg-white/90 text-gray-900 hover:bg-white">
                    <Play className="h-5 w-5 mr-2" />
                    Xem trước khóa học
                  </Button>
                </div>
                <div className="absolute top-4 left-4">
                  <Badge className="bg-blue-600 text-white">
                    {course.category}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-blue-200 text-blue-700">
                    {course.level}
                  </Badge>
                  <Badge variant="outline" className="border-green-200 text-green-700">
                    {course.ageRange} tuổi
                  </Badge>
                  <Badge variant="outline" className="border-purple-200 text-purple-700">
                    {course.courseDuration}
                  </Badge>
                </div>

                <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
                
                <p className="text-lg text-gray-700">{course.description}</p>

                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{course.rating}</span>
                    <span>({course.reviews.length} đánh giá)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{course.students.toLocaleString()} học viên</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.totalHours} giờ</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{course.lessons} bài học</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12 ring-2 ring-blue-100">
                    <AvatarImage src={`https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop`} alt={course.instructor} />
                    <AvatarFallback>{course.instructor.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-gray-900">{course.instructor}</div>
                    <div className="text-sm text-gray-600">Giảng viên</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm border border-blue-100">
                <TabsTrigger value="overview" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
                  Tổng quan
                </TabsTrigger>
                <TabsTrigger value="curriculum" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
                  Chương trình
                </TabsTrigger>
                <TabsTrigger value="reviews" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
                  Đánh giá
                </TabsTrigger>
                <TabsTrigger value="instructor" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
                  Giảng viên
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
                  <CardHeader>
                    <CardTitle>
                      {course.courseType === 'corporate' ? 'Tổ chức sẽ đạt được gì?' : 'Bạn sẽ học được gì?'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {course.features.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Corporate Features */}
                {course.courseType === 'corporate' && course.corporateFeatures && (
                  <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
                    <CardHeader>
                      <CardTitle className="text-emerald-800">Tính năng dành riêng cho Doanh nghiệp</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {course.corporateFeatures.map((feature: string, index: number) => (
                          <div key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <span className="text-emerald-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Participant Information for Corporate */}
                {course.courseType === 'corporate' && (
                  <Card className="bg-blue-50/50 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-blue-800">Thông tin tham gia</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-white rounded-lg">
                          <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                          <div className="font-bold text-lg">{course.minParticipants}-{course.maxParticipants}</div>
                          <div className="text-sm text-gray-600">Số người tham gia</div>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg">
                          <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                          <div className="font-bold text-lg">{course.totalHours}h</div>
                          <div className="text-sm text-gray-600">Tổng thời gian</div>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg">
                          <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                          <div className="font-bold text-lg">{course.courseDuration}</div>
                          <div className="text-sm text-gray-600">Thời lượng</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
                  <CardHeader>
                    <CardTitle>
                      {course.courseType === 'corporate' ? 'Mô tả chương trình' : 'Mô tả khóa học'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none text-gray-700">
                      <p>
                        {course.description} 
                        {course.courseType === 'corporate' 
                          ? ' Chương trình này được thiết kế đặc biệt cho các tổ chức muốn đầu tư vào sức khỏe tinh thần và phát triển nhân sự thông qua các giải pháp tâm lý học ứng dụng.'
                          : ' Khóa học này được thiết kế đặc biệt cho những ai muốn cải thiện sức khỏe tinh thần và phát triển kỹ năng cần thiết để đối phó với những thách thức trong cuộc sống hiện đại.'
                        }
                      </p>
                      <p>
                        {course.courseType === 'corporate'
                          ? `Với phương pháp đào tạo tương tác và customizable, chương trình sẽ được điều chỉnh phù hợp với văn hóa và nhu cầu cụ thể của tổ chức. Phù hợp cho nhân viên độ tuổi ${course.ageRange} và có thể thực hiện tại văn phòng hoặc online.`
                          : `Với phương pháp giảng dạy tương tác và thực hành, bạn sẽ được hướng dẫn từng bước để áp dụng kiến thức vào thực tế. Khóa học phù hợp với độ tuổi ${course.ageRange} và không yêu cầu kiến thức nền tảng.`
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="curriculum" className="space-y-4">
                <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
                  <CardHeader>
                    <CardTitle>Chương trình học</CardTitle>
                    <CardDescription>
                      {course.lessons} bài học • {course.totalHours} giờ tổng cộng
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Array.from({ length: Math.min(Number(course.lessons) || 0, 8) }, (_, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border border-blue-100 rounded-lg hover:bg-blue-50/50 transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-700">{index + 1}</span>
                            </div>
                            <div>
                              <div className="font-medium">Bài {index + 1}: {course.title.split(' ').slice(0, 3).join(' ')}</div>
                              <div className="text-sm text-gray-600">
                                {Math.floor((Number(course.totalHours) || 0) / (Number(course.lessons) || 1) * 60)} phút
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Play className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      {typeof course.lessons === 'number' && course.lessons > 8 && (
                        <div className="text-center py-4">
                          <Button variant="outline" className="border-blue-300 text-blue-700">
                            Xem thêm {course.lessons - 8} bài học
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                {/* Rating Overview */}
                <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
                  <CardHeader>
                    <CardTitle>Đánh giá của học viên</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-gray-900">{course.rating}</div>
                        <div className="flex items-center justify-center space-x-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-5 w-5 ${i < Math.floor(course.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <div className="text-sm text-gray-600">{course.reviews.length} đánh giá</div>
                      </div>
                      <div className="space-y-2">
                        {ratingDistribution.map((item) => (
                          <div key={item.stars} className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1 w-12">
                              <span className="text-sm">{item.stars}</span>
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            </div>
                            <Progress value={(item.count / course.reviews.length) * 100} className="flex-1" />
                            <span className="text-sm text-gray-600 w-8">{item.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Reviews List */}
                <div className="space-y-4">
                  {course.reviews.map((review) => (
                    <Card key={`${review.reviewer}-${review.rating}`} className="bg-white/90 backdrop-blur-sm border-blue-100">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <Avatar className="ring-2 ring-blue-100">
                            <AvatarImage src="https://via.placeholder.com/100" alt={review.reviewer} />
                            <AvatarFallback>{review.reviewer.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{review.reviewer}</span>
                                {/* Removed 'verified' property check as it does not exist */}
                              </div>
                              <span className="text-sm text-gray-600">{formatDate(review.date)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                              ))}
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Add Review */}
                <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
                  <CardHeader>
                    <CardTitle>Viết đánh giá</CardTitle>
                    <CardDescription>
                      Chia sẻ trải nghiệm của bạn với khóa học này
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Đánh giá của bạn</label>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Button
                              key={i}
                              variant="ghost"
                              size="sm"
                              onClick={() => setNewReview({...newReview, rating: i + 1})}
                              className="p-1"
                            >
                              <Star className={`h-5 w-5 ${i < newReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Nhận xét</label>
                        <Textarea
                          placeholder="Chia sẻ trải nghiệm của bạn về khóa học..."
                          value={newReview.comment}
                          onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                          rows={4}
                          className="border-blue-200 focus:border-blue-400"
                        />
                      </div>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Gửi đánh giá
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="instructor" className="space-y-6">
                <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-6">
                      <Avatar className="h-24 w-24 ring-4 ring-blue-100">
                        <AvatarImage src={`https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop`} alt={course.instructor} />
                        <AvatarFallback className="text-2xl">{course.instructor.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{course.instructor}</h3>
                          <p className="text-blue-600 font-medium">Chuyên gia Tâm lý học</p>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-gray-900">4.8</div>
                            <div className="text-sm text-gray-600">Đánh giá</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-gray-900">1,234</div>
                            <div className="text-sm text-gray-600">Học viên</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-gray-900">12+</div>
                            <div className="text-sm text-gray-600">Năm KN</div>
                          </div>
                        </div>
                        <p className="text-gray-700">
                          Chuyên gia hàng đầu trong lĩnh vực tâm lý học với hơn 12 năm kinh nghiệm. 
                          Đã giúp hàng nghìn người cải thiện sức khỏe tinh thần và phát triển bản thân.
                        </p>
                        <div className="flex items-center space-x-2">
                          <Award className="h-5 w-5 text-yellow-500" />
                          <span className="text-sm text-gray-600">Chứng chỉ Tâm lý học Lâm sàng</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              {/* Purchase Card */}
              <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${
                        course.courseType === 'corporate' ? 'text-emerald-600' : 'text-primary'
                      }`}>
                        {formatPrice(course.price)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {course.courseType === 'corporate' ? 'Giá khởi điểm' : 'Một lần thanh toán'}
                      </div>
                      {course.courseType === 'corporate' && (
                        <div className="text-xs text-gray-500 mt-1">
                          *Giá cuối cùng tùy theo số người tham gia
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Button 
                        size="lg" 
                        className={`w-full ${
                          course.courseType === 'corporate'
                            ? 'bg-emerald-600 hover:bg-emerald-700'
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                        onClick={handlePurchase}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {course.courseType === 'corporate' ? 'Liên hệ tư vấn' : 'Mua ngay'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
                        onClick={handleWishlistToggle}
                      >
                        <Heart className={`h-4 w-4 mr-2 ${isInWishlistState ? 'fill-current' : ''}`} />
                        {isInWishlistState ? 'Đã thêm vào wishlist' : 'Thêm vào wishlist'}
                      </Button>
                    </div>

                    <Separator />

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Thời lượng:</span>
                        <span className="font-medium">{course.courseDuration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {course.courseType === 'corporate' ? 'Giờ đào tạo:' : 'Số giờ học:'}
                        </span>
                        <span className="font-medium">{course.totalHours} giờ</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {course.courseType === 'corporate' ? 'Modules:' : 'Bài học:'}
                        </span>
                        <span className="font-medium">{course.lessons} {course.courseType === 'corporate' ? 'modules' : 'bài'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cấp độ:</span>
                        <span className="font-medium">{course.level}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Độ tuổi:</span>
                        <span className="font-medium">{course.ageRange} tuổi</span>
                      </div>
                      {course.courseType === 'corporate' && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Số người:</span>
                          <span className="font-medium">{course.minParticipants}-{course.maxParticipants} người</span>
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Truy cập trọn đời</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Download className="h-4 w-4 text-green-600" />
                        <span>Tài liệu tải về</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Award className="h-4 w-4 text-green-600" />
                        <span>Chứng chỉ hoàn thành</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Related Courses */}
              {relatedCourses.length > 0 && (
                <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
                  <CardHeader>
                    <CardTitle>Khóa học liên quan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {relatedCourses.map((relatedCourse) => (
                        <div key={relatedCourse.id} className="flex space-x-3 cursor-pointer hover:bg-blue-50/50 p-2 rounded-lg transition-colors">
                          <ImageWithFallback
                            src={relatedCourse.image}
                            alt={relatedCourse.title}
                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 space-y-1">
                            <h4 className="font-medium text-sm line-clamp-2">{relatedCourse.title}</h4>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs">{relatedCourse.rating}</span>
                            </div>
                            <div className="text-sm font-medium text-primary">
                              {formatPrice(relatedCourse.price)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}