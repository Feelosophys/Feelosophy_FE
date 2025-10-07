"use client";

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Star, Users, Search, Clock, Calendar, Award, CheckCircle, Eye } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { CalendarBooking } from './CalendarBooking';
import { apiClient } from '../../lib/api';

interface Teacher {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    bio: string;
    joinedDate: string | null;
    id: string;
  };
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
}

interface Expert {
  id: string; // teacher._id
  userId: string; // teacher.user.id
  name: string;
  title: string;
  image: string;
  rating: number;
  reviews: number;
  specialization: string[];
  experience: string;
  price: number;
  bio: string;
  availability: { time: string; available: boolean }[];
}

interface ExpertsPageProps {
  onExpertSelect?: (expertId: string) => void;
}

export function ExpertsPage({ onExpertSelect }: ExpertsPageProps) {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('all');

  // Hàm ánh xạ dữ liệu API sang Expert
  const mapTeacherToExpert = (teacher: Teacher): Expert => ({
    id: teacher._id,
    userId: teacher.user.id || teacher.user._id,
    name: teacher.user.name,
    title: teacher.specialization[0] || 'Chuyên gia tâm lý',
    image: 'https://i.pinimg.com/564x/c6/12/ac/c612ac447dff18c445897fb2130cc3fa.jpg',
    rating: teacher.rating,
    reviews: teacher.reviews,
    specialization: teacher.specialization,
    experience: teacher.experience,
    price: teacher.price,
    bio: teacher.bio || teacher.user.bio || 'Không có mô tả',
    availability: teacher.availability.map(time => ({
      time,
      available: true,
    })),
  });

  // Fetch experts on component mount
  useEffect(() => {
    const fetchExperts = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getExperts();
        if (response.success && response.data) {
          const mappedExperts = (response.data as Teacher[]).map(mapTeacherToExpert);
          setExperts(mappedExperts);
        } else {
          setError(response.error || 'Không thể tải danh sách chuyên gia');
        }
      } catch {
        setError('Đã xảy ra lỗi khi tải danh sách chuyên gia');
      } finally {
        setLoading(false);
      }
    };

    fetchExperts();
  }, []);

  // Filter experts based on search term and specialization
  const filteredExperts = experts.filter(expert => {
    const matchesSearch = 
      (expert.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (expert.bio || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = specializationFilter === 'all' || 
                                 expert.specialization.includes(specializationFilter);
    
    return matchesSearch && matchesSpecialization;
  });

  // Get unique specializations for filter dropdown
  const allSpecializations = Array.from(
    new Set(experts.flatMap(expert => expert.specialization))
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getExpertStatus = (expert: Expert) => {
    const hasAvailableSlots = expert.availability.some(slot => slot.available);
    return hasAvailableSlots ? 'online' : 'offline';
  };

  const handleExpertClick = (expertId: string) => {
    if (onExpertSelect) {
      onExpertSelect(expertId); // Truyền expert.id (teacher._id)
    }
  };

  const handleBookingClick = (expert: Expert, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedExpert(expert);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600">Đang tải danh sách chuyên gia...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-red-600">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-600 hover:bg-blue-700"
          >
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Chuyên gia tâm lý</h1>
          <p className="text-gray-600">
            Kết nối với các chuyên gia tâm lý hàng đầu, được chứng nhận và có kinh nghiệm
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-bold text-lg">{experts.length}</div>
                  <div className="text-sm text-gray-600">Chuyên gia</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-bold text-lg">
                    {experts.filter(expert => getExpertStatus(expert) === 'online').length}
                  </div>
                  <div className="text-sm text-gray-600">Đang hoạt động</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <div>
                  <div className="font-bold text-lg">
                    {(experts.reduce((sum, expert) => sum + expert.rating, 0) / (experts.length || 1)).toFixed(1)}
                  </div>
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
                  <div className="font-bold text-lg">24/7</div>
                  <div className="text-sm text-gray-600">Hỗ trợ</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-6 mb-8 border border-blue-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm chuyên gia..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-blue-200 focus:border-blue-400"
              />
            </div>
            <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
              <SelectTrigger className="border-blue-200 focus:border-blue-400">
                <SelectValue placeholder="Chọn chuyên môn" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả chuyên môn</SelectItem>
                {allSpecializations.map(spec => (
                  <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSpecializationFilter('all');
              }}
              className="border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              Xóa bộ lọc
            </Button>
          </div>
        </div>

        {/* Experts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperts.map((expert) => {
            const status = getExpertStatus(expert);
            return (
              <Card 
                key={expert.id} 
                className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm border-blue-100 hover:border-blue-200 group cursor-pointer"
                onClick={() => handleExpertClick(expert.userId)}
              >
                <CardHeader className="text-center relative">
                  <div className="mx-auto mb-4 relative">
                    <ImageWithFallback
                      src={expert.image}
                      alt={expert.name}
                      className="w-24 h-24 rounded-full object-cover mx-auto ring-4 ring-blue-100 group-hover:ring-blue-200 transition-all duration-300"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${
                      status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                    }`}>
                      {status === 'online' ? (
                        <CheckCircle className="h-3 w-3 text-white" />
                      ) : (
                        <Clock className="h-3 w-3 text-white" />
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-xl text-gray-800 group-hover:text-blue-600 transition-colors">
                    {expert.name}
                  </CardTitle>
                  <CardDescription className="text-primary font-medium">
                    {expert.title}
                  </CardDescription>
                  <div className="flex items-center justify-center space-x-1 text-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{expert.rating}</span>
                    <span className="text-gray-600">({expert.reviews} đánh giá)</span>
                  </div>
                  <Badge 
                    className={`mt-2 ${
                      status === 'online' 
                        ? 'bg-green-100 text-green-700 border-green-200' 
                        : 'bg-gray-100 text-gray-700 border-gray-200'
                    }`}
                  >
                    {status === 'online' ? 'Đang hoạt động' : 'Bận'}
                  </Badge>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 text-gray-800 flex items-center space-x-1">
                      <Award className="h-4 w-4 text-blue-600" />
                      <span>Chuyên môn:</span>
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {expert.specialization.map((spec, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-blue-100 text-blue-700 border-blue-200">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600 bg-blue-50/50 rounded-lg p-3">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span>{expert.experience}</span>
                    </div>
                    <div className="text-primary font-bold text-lg">
                      {formatPrice(expert.price)}/giờ
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                      {expert.bio}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <h5 className="text-xs font-medium text-gray-700 mb-2 flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>Sắp tới:</span>
                    </h5>
                    <div className="flex space-x-1">
                      {expert.availability.slice(0, 4).map((slot, index) => (
                        <div
                          key={index}
                          className={`text-xs px-2 py-1 rounded ${
                            slot.available 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          {slot.time}
                        </div>
                      ))}
                      {expert.availability.length > 4 && (
                        <div className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                          +{expert.availability.length - 4}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExpertClick(expert.userId);
                      }}
                      className="border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Xem chi tiết
                    </Button>
                    <Button 
                      size="sm"
                      onClick={(e) => handleBookingClick(expert, e)}
                      disabled={status === 'offline'}
                      className="bg-blue-600 hover:bg-blue-700 group-hover:shadow-lg transition-all duration-300"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      {status === 'online' ? 'Đặt lịch' : 'Bận'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredExperts.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy chuyên gia nào
            </h3>
            <p className="text-gray-600">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm khác
            </p>
          </div>
        )}
      </div>

      <Dialog open={!!selectedExpert} onOpenChange={() => setSelectedExpert(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="sr-only">
            Đặt lịch tư vấn với chuyên gia {selectedExpert?.name || 'Chuyên gia tâm lý'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Dialog để đặt lịch tư vấn với chuyên gia tâm lý. Chọn ngày và giờ phù hợp để book appointment.
          </DialogDescription>
          {selectedExpert && (
            <CalendarBooking 
              expert={selectedExpert} 
              onClose={() => setSelectedExpert(null)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}