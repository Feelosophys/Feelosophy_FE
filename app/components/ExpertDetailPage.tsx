"use client";

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { 
  ArrowLeft, 
  Star, 
  Users, 
  Clock, 
  Calendar, 
  Award, 
  MapPin, 
  CheckCircle, 
  Languages, 
  Shield, 
  Video, 
  Phone, 
  Mail, 
  Building2, 
  Heart, 
  Share2, 
  MessageSquare, 
  GraduationCap
} from 'lucide-react';
import { CalendarBooking } from './CalendarBooking';
import { apiClient } from '../../lib/api';

interface User {
  _id: string;
  name: string;
  email: string;
  bio: string;
  joinedDate: string | null;
  id: string;
}

interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  consultationType: string;
  helpful: number;
}

interface Education {
  degree: string;
  institution: string;
  year: string;
  description: string;
}

interface ConsultationType {
  type: string;
  duration: string;
  price: number;
}

interface WorkingHour {
  _id: string;
  teacherId: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Teacher {
  _id: string;
  user: User;
  specialization: string[];
  experience: string;
  rating: number;
  reviews: number;
  price: number;
  bio: string;
  availability: string[];
  expertise: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  education?: Education[];
  certifications?: string[];
  languages?: string[];
  workingHours?: WorkingHour[];
  consultationTypes?: ConsultationType[];
  reviewDetails?: Review[];
}

interface Expert {
  user: any;
  id: string;
  userId: string;
  name: string;
  title: string;
  image: string;
  rating: number;
  reviews: number;
  email: string
  specialization: string[];
  experience: string;
  price: number;
  bio: string;
  availability: { time: string; available: boolean }[];
  education: Education[];
  certifications: string[];
  languages: string[];
  workingHours: string;
  consultationTypes: ConsultationType[];
  reviewDetails: Review[];
}

interface ApiResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    teacher: Teacher;
    workingHours: WorkingHour[];
  };
}

interface ExpertDetailPageProps {
  expertId: string;
  onBack: () => void;
}

const mapTeacherToExpert = (teacher: Teacher, workingHours: WorkingHour[]): Expert => {
  console.log('Mapping Teacher:', JSON.stringify(teacher, null, 2));
  console.log('Working Hours:', JSON.stringify(workingHours, null, 2));

  // Dự phòng cho dữ liệu user bị thiếu
  const user = teacher.user || {
    name: 'Không có tên',
    id: '',
    _id: '',
    bio: 'Không có mô tả',
    email: 'Không có email', // Thêm giá trị dự phòng cho email
    joinedDate: null,
  };

  // Xử lý workingHours và availability an toàn
  const workingHoursString = teacher.availability?.length
    ? teacher.availability.join(', ')
    : 'Không có thông tin';

  // Lọc các workingHours không hợp lệ và ánh xạ sang availability
  const availability = (workingHours || [])
    .filter(hour => hour && hour.date && hour.startTime && hour.endTime)
    .map(hour => ({
      time: `${hour.date.split('T')[0]} ${hour.startTime}-${hour.endTime}`,
      available: !hour.isBooked,
    }));

  // Trả về đối tượng Expert với các giá trị dự phòng
  return {
    id: teacher._id || '',
    userId: user.id || user._id || '',
    name: user.name || 'Không có tên',
    title: teacher.specialization?.[0] || 'Chuyên gia tâm lý',
    image: 'https://i.pinimg.com/564x/c6/12/ac/c612ac447dff18c445897fb2130cc3fa.jpg',
    rating: teacher.rating || 0,
    reviews: teacher.reviews || 0,
    specialization: teacher.specialization || [],
    experience: teacher.experience || 'Không có thông tin',
    price: teacher.price || 0,
    bio: teacher.bio || user.bio || 'Không có mô tả',
    availability: availability.length > 0 ? availability : [{ time: 'Không có lịch', available: false }],
    education: teacher.education || [],
    certifications: teacher.certifications || [],
    languages: teacher.languages || [],
    workingHours: workingHoursString,
    consultationTypes: teacher.consultationTypes || [
      { type: 'Tư vấn cá nhân', duration: '60 phút', price: teacher.price || 0 },
    ],
    reviewDetails: teacher.reviewDetails || [],
    user: {
      // Thêm user vào đối tượng Expert để khớp với cấu trúc sử dụng trong render
      _id: user._id || '',
      name: user.name || 'Không có tên',
      email: user.email || 'Không có email',
      bio: user.bio || 'Không có mô tả',
      joinedDate: user.joinedDate || null,
      id: user.id || '',
    },
  };
};

export function ExpertDetailPage({ expertId, onBack }: ExpertDetailPageProps) {
  const [expert, setExpert] = useState<Expert | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchExpert = async () => {
      try {
        setLoading(true);
        const response: ApiResponse = await apiClient.getExpert(expertId);
        console.log('API Response:', JSON.stringify(response, null, 2));
  
        // Kiểm tra xem response có hợp lệ không
        if (!response.success || response.status !== 200 || !response.data) {
          setError(response.message || 'Không có dữ liệu từ API');
          console.log('Dữ liệu không hợp lệ:', response);
          return;
        }
  
        // Kiểm tra xem teacher có tồn tại không
        if (!response.data.teacher) {
          setError('Không tìm thấy thông tin chuyên gia');
          console.log('Thiếu dữ liệu teacher:', response.data);
          return;
        }
  
        // Ánh xạ dữ liệu teacher sang expert
        const mappedExpert = mapTeacherToExpert(
          response.data.teacher,
          response.data.workingHours || []
        );
        console.log('Mapped Expert:', JSON.stringify(mappedExpert, null, 2));
  
        // Kiểm tra xem mappedExpert có hợp lệ không
        if (!mappedExpert) {
          setError('Lỗi khi ánh xạ dữ liệu chuyên gia');
          console.log('mappedExpert không hợp lệ:', mappedExpert);
          return;
        }
  
        setExpert(mappedExpert);
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        setError('Đã xảy ra lỗi khi gọi API. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchExpert();
  }, [expertId]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price * 23000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getExpertStatus = (expert: Expert) => {
    const hasAvailableSlots = expert.availability.some(slot => slot.available);
    return hasAvailableSlots ? 'online' : 'offline';
  };

  const handleBookConsultation = () => {
    setShowBookingDialog(true);
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Chuyên gia ${expert?.name}`,
        text: expert?.bio,
        url: window.location.href,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-600">Đang tải thông tin chuyên gia...</p>
        </div>
      </div>
    );
  }

  if (error || !expert) {
    console.log('Render error:', error, 'Expert:', expert);
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || 'Không tìm thấy chuyên gia'}</h2>
            <Button onClick={onBack} className="bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const status = getExpertStatus(expert);
  const avgRating = expert.reviewDetails.length
    ? expert.reviewDetails.reduce((sum, review) => sum + review.rating, 0) / expert.reviewDetails.length
    : expert.rating;

  const totalReviews = expert.reviewDetails.length || expert.reviews;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <button 
            onClick={onBack}
            className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Chuyên gia</span>
          </button>
          <span>/</span>
          <span className="text-gray-900">{expert.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Expert Header */}
            <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start space-y-6 md:space-y-0 md:space-x-6">
                  <div className="flex-shrink-0 mx-auto md:mx-0">
                    <div className="relative">
                      <Avatar className="h-32 w-32 ring-4 ring-blue-100">
                        <AvatarImage src={expert.image} alt={expert.name} />
                        <AvatarFallback className="text-2xl">{expert.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center ${
                        status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                      }`}>
                        {status === 'online' ? (
                          <CheckCircle className="h-4 w-4 text-white" />
                        ) : (
                          <Clock className="h-4 w-4 text-white" />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{expert.name}</h1>
                        <p className="text-xl text-blue-600 font-medium mb-3">{expert.title}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleWishlistToggle}
                          className={`${
                            isWishlisted 
                              ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' 
                              : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleShare}
                          className="border-blue-200 text-blue-600 hover:bg-blue-50"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm mb-4">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{avgRating.toFixed(1)}</span>
                        <span className="text-gray-600">({totalReviews} đánh giá)</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{expert.experience}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>1.2k+ tư vấn</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                      {expert.specialization.map((spec, index) => (
                        <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                    
                    <Badge 
                      className={`${
                        status === 'online' 
                          ? 'bg-green-100 text-green-700 border-green-200' 
                          : 'bg-gray-100 text-gray-700 border-gray-200'
                      }`}
                    >
                      {status === 'online' ? 'Đang hoạt động' : 'Bận'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Expert Details Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm border border-blue-100">
                <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                <TabsTrigger value="experience">Kinh nghiệm</TabsTrigger>
                <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
                <TabsTrigger value="availability">Lịch trình</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
                  <CardHeader>
                    <CardTitle>Giới thiệu chuyên gia</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-3">Về tôi</h3>
                      <p className="text-gray-700 leading-relaxed">{expert.bio}</p>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3 flex items-center space-x-2">
                          <Languages className="h-4 w-4 text-blue-600" />
                          <span>Ngôn ngữ</span>
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {expert.languages.length > 0 ? (
                            expert.languages.map((lang, index) => (
                              <Badge key={index} variant="outline" className="border-blue-200">
                                {lang}
                              </Badge>
                            ))
                          ) : (
                            <p className="text-gray-600">Không có thông tin</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-3 flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span>Giờ làm việc</span>
                        </h4>
                        <p className="text-gray-700">{expert.workingHours}</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-medium mb-3 flex items-center space-x-2">
                        <MessageSquare className="h-4 w-4 text-blue-600" />
                        <span>Dịch vụ tư vấn</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {expert.consultationTypes.map((consultation, index) => (
                          <div key={index} className="p-4 border border-blue-100 rounded-lg bg-blue-50/30">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium">{consultation.type}</h5>
                              <span className="text-blue-600 font-bold">{formatPrice(consultation.price)}</span>
                            </div>
                            <p className="text-sm text-gray-600">Thời gian: {consultation.duration}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="experience">
                <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
                  <CardHeader>
                    <CardTitle>Trình độ & Kinh nghiệm</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-4 flex items-center space-x-2">
                        <GraduationCap className="h-5 w-5 text-blue-600" />
                        <span>Học vấn</span>
                      </h3>
                      <div className="space-y-4">
                        {expert.education.length > 0 ? (
                          expert.education.map((edu, index) => (
                            <div key={index} className="border-l-4 border-blue-200 pl-4">
                              <h4 className="font-medium">{edu.degree}</h4>
                              <p className="text-blue-600">{edu.institution}</p>
                              <p className="text-sm text-gray-600">Năm {edu.year}</p>
                              <p className="text-sm text-gray-700 mt-1">{edu.description}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-600">Không có thông tin học vấn</p>
                        )}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-semibold mb-4 flex items-center space-x-2">
                        <Shield className="h-5 w-5 text-blue-600" />
                        <span>Chứng chỉ & Thành viên</span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {expert.certifications.length > 0 ? (
                          expert.certifications.map((cert, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <Award className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                              <span className="text-gray-700">{cert}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-600">Không có thông tin chứng chỉ</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
                  <CardHeader>
                    <CardTitle>Đánh giá từ khách hàng</CardTitle>
                    <CardDescription>
                      {totalReviews} đánh giá • Điểm trung bình {avgRating.toFixed(1)}/5
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {expert.reviewDetails.length > 0 ? (
                        expert.reviewDetails.map((review) => (
                          <div key={review.id} className="border-b border-blue-100 pb-6 last:border-b-0">
                            <div className="flex items-start space-x-4">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={review.userAvatar} alt={review.userName} />
                                <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <div>
                                    <h4 className="font-medium">{review.userName}</h4>
                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                      <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                          <Star
                                            key={i}
                                            className={`h-3 w-3 ${
                                              i < review.rating 
                                                ? 'fill-yellow-400 text-yellow-400' 
                                                : 'text-gray-300'
                                            }`}
                                          />
                                        ))}
                                      </div>
                                      <span>•</span>
                                      <span>{formatDate(review.date)}</span>
                                      <span>•</span>
                                      <span>{review.consultationType}</span>
                                    </div>
                                  </div>
                                </div>
                                <p className="text-gray-700 mb-3">{review.comment}</p>
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                  <button className="flex items-center space-x-1 hover:text-blue-600">
                                    <Users className="h-3 w-3" />
                                    <span>Hữu ích ({review.helpful})</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-600">Chưa có đánh giá nào</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="availability">
                <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
                  <CardHeader>
                    <CardTitle>Lịch trình khả dụng</CardTitle>
                    <CardDescription>
                      Xem thời gian rảnh và đặt lịch tư vấn
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <p className="text-gray-600 mb-4">
                          Chọn ngày và giờ phù hợp để đặt lịch tư vấn
                        </p>
                        <Button 
                          onClick={handleBookConsultation}
                          className="bg-blue-600 hover:bg-blue-700"
                          disabled={status === 'offline'}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          {status === 'online' ? 'Đặt lịch tư vấn' : 'Hiện tại không khả dụng'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 top-4">
              <CardHeader>
                <CardTitle className="text-center">Đặt lịch tư vấn</CardTitle>
                <CardDescription className="text-center">
                  Bắt đầu hành trình chăm sóc sức khỏe tinh thần
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {formatPrice(expert.price)}
                  </div>
                  <div className="text-sm text-gray-600">/ buổi tư vấn</div>
                </div>
                
                <Button 
                  onClick={handleBookConsultation}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={status === 'offline'}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  {status === 'online' ? 'Đặt lịch ngay' : 'Hiện tại bận'}
                </Button>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Video className="h-4 w-4 text-blue-600" />
                    <span>Tư vấn trực tuyến & trực tiếp</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span>Bảo mật thông tin tuyệt đối</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <span>Hỗ trợ 24/7</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
              <CardHeader>
                <CardTitle className="text-lg">Thống kê</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>Đánh giá</span>
                  </div>
                  <span className="font-medium">{avgRating.toFixed(1)}/5</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span>Tư vấn</span>
                  </div>
                  <span className="font-medium">1.2k+</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-purple-600" />
                    <span>Kinh nghiệm</span>
                  </div>
                  <span className="font-medium">{expert.experience}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4 text-green-600" />
                    <span>Phản hồi</span>
                  </div>
                  <span className="font-medium">&lt; 2h</span>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
              <CardHeader>
                <CardTitle className="text-lg">Liên hệ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">{expert.user.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">+84 901 234 567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Hà Nội, Việt Nam</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Building2 className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Phòng khám tư nhân</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="sr-only">
            Đặt lịch tư vấn với chuyên gia {expert.name}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Dialog để đặt lịch tư vấn với chuyên gia tâm lý. Chọn ngày và giờ phù hợp để book appointment.
          </DialogDescription>
          <CalendarBooking 
            expert={expert} 
            onClose={() => setShowBookingDialog(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}