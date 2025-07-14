"use client"

import React, { useState } from 'react';
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
  BookOpen,
  Heart,
  Share2,
  MessageSquare,
  Video,
  Phone,
  Mail,
  GraduationCap,
  Building2,
  Languages,
  Shield
} from 'lucide-react';
import { mockExperts, type Expert } from '../data/mockData';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { CalendarBooking } from './CalendarBooking';

interface ExpertDetailPageProps {
  expertId: string;
  onBack: () => void;
  currentUser?: any;
  onShowAuth?: () => void;
}

// Mock reviews data for expert
const mockExpertReviews = [
  {
    id: '1',
    userName: 'Nguyễn Minh Anh',
    userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b602?w=150&h=150&fit=crop',
    rating: 5,
    comment: 'Dr. Nguyễn rất chuyên nghiệp và tận tâm. Buổi tư vấn đã giúp tôi hiểu rõ hơn về vấn đề của mình và có hướng giải quyết cụ thể.',
    date: '2024-01-20',
    consultationType: 'Tư vấn cá nhân',
    helpful: 12
  },
  {
    id: '2',
    userName: 'Trần Văn Bình',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    rating: 5,
    comment: 'Chuyên gia rất có kinh nghiệm, lắng nghe và đưa ra lời khuyên thực tế. Tôi cảm thấy thoải mái hơn nhiều sau buổi tư vấn.',
    date: '2024-01-18',
    consultationType: 'Tư vấn online',
    helpful: 8
  },
  {
    id: '3',
    userName: 'Lê Thị Cẩm',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    rating: 4,
    comment: 'Buổi tư vấn rất bổ ích, bác sĩ giải thích dễ hiểu và đưa ra nhiều kỹ thuật thực hành hữu ích cho việc quản lý stress.',
    date: '2024-01-15',
    consultationType: 'Workshop nhóm',
    helpful: 15
  },
  {
    id: '4',
    userName: 'Phạm Đức Nam',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    rating: 5,
    comment: 'Tôi đã tham gia nhiều buổi tư vấn với Dr. Nguyễn. Phương pháp tiếp cận của bác sĩ rất hiệu quả và phù hợp với tôi.',
    date: '2024-01-12',
    consultationType: 'Tư vấn định kỳ',
    helpful: 6
  }
];

// Mock additional expert data
const mockExpertDetails = {
  education: [
    {
      degree: 'Tiến sĩ Tâm lý học Lâm sàng',
      institution: 'Đại học Y Hà Nội',
      year: '2015',
      description: 'Chuyên sâu về rối loạn lo âu và trầm cảm'
    },
    {
      degree: 'Thạc sĩ Tâm lý học Ứng dụng',
      institution: 'Đại học Quốc gia Hà Nội',
      year: '2010',
      description: 'Tâm lý học trong môi trường công việc'
    }
  ],
  certifications: [
    'Chứng chỉ Trị liệu Nhận thức Hành vi (CBT)',
    'Chứng chỉ Mindfulness-Based Stress Reduction (MBSR)',
    'Chứng chỉ Tư vấn Tâm lý Gia đình',
    'Thành viên Hội Tâm lý học Việt Nam'
  ],
  languages: ['Tiếng Việt', 'English', 'Français'],
  workingHours: 'Thứ 2 - Thứ 6: 8:00 - 17:00, Thứ 7: 9:00 - 15:00',
  consultationTypes: [
    { type: 'Tư vấn trực tiếp', duration: '60 phút', price: 500000 },
    { type: 'Tư vấn trực tuyến', duration: '60 phút', price: 400000 },
    { type: 'Tư vấn nhóm', duration: '90 phút', price: 300000 },
    { type: 'Workshop', duration: '120 phút', price: 250000 }
  ]
};

export function ExpertDetailPage({ expertId, onBack, currentUser, onShowAuth }: ExpertDetailPageProps) {
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const expert = mockExperts.find(e => e.id === expertId);
  
  if (!expert) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy chuyên gia</h2>
            <Button onClick={onBack} className="bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getExpertStatus = () => {
    const hasAvailableSlots = expert.availability.some(slot => slot.available);
    return hasAvailableSlots ? 'online' : 'offline';
  };

  const status = getExpertStatus();
  const avgRating = mockExpertReviews.reduce((sum, review) => sum + review.rating, 0) / mockExpertReviews.length;
  const totalReviews = mockExpertReviews.length;

  const handleBookConsultation = () => {
    if (!currentUser && onShowAuth) {
      onShowAuth();
      return;
    }
    setShowBookingDialog(true);
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
  };

  const handleShare = () => {
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: `Chuyên gia ${expert.name}`,
        text: expert.bio,
        url: window.location.href,
      });
    }
  };

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
                        <span>{expert.experience} năm kinh nghiệm</span>
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
                          {mockExpertDetails.languages.map((lang, index) => (
                            <Badge key={index} variant="outline" className="border-blue-200">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-3 flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span>Giờ làm việc</span>
                        </h4>
                        <p className="text-gray-700">{mockExpertDetails.workingHours}</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-medium mb-3 flex items-center space-x-2">
                        <MessageSquare className="h-4 w-4 text-blue-600" />
                        <span>Dịch vụ tư vấn</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {mockExpertDetails.consultationTypes.map((consultation, index) => (
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
                        {mockExpertDetails.education.map((edu, index) => (
                          <div key={index} className="border-l-4 border-blue-200 pl-4">
                            <h4 className="font-medium">{edu.degree}</h4>
                            <p className="text-blue-600">{edu.institution}</p>
                            <p className="text-sm text-gray-600">Năm {edu.year}</p>
                            <p className="text-sm text-gray-700 mt-1">{edu.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-semibold mb-4 flex items-center space-x-2">
                        <Shield className="h-5 w-5 text-blue-600" />
                        <span>Chứng chỉ & Thành viên</span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {mockExpertDetails.certifications.map((cert, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Award className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                            <span className="text-gray-700">{cert}</span>
                          </div>
                        ))}
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
                      {mockExpertReviews.map((review) => (
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
                      ))}
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
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 sticky top-4">
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
                  <span className="font-medium">{expert.experience} năm</span>
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
                  <span className="text-sm">expert@feelosophy.com</span>
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

      {/* Booking Dialog - Standard dialog size */}
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