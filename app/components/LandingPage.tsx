"use client"

import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Brain, BookOpen, Shield, Star, Clock } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const features = [
    {
      icon: Brain,
      title: 'Tư vấn Chuyên nghiệp',
      description: 'Kết nối với các chuyên gia tâm lý có kinh nghiệm và được chứng nhận.',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop'
    },
    {
      icon: BookOpen,
      title: 'Khóa học Đa dạng',
      description: 'Học tập với các khóa học được thiết kế khoa học, phù hợp mọi cấp độ.',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop'
    },
    {
      icon: Shield,
      title: 'Bảo mật Tuyệt đối',
      description: 'Thông tin cá nhân và các buổi tư vấn được bảo mật hoàn toàn.',
      image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=400&h=300&fit=crop'
    },
    {
      icon: Clock,
      title: 'Linh hoạt Thời gian',
      description: 'Đặt lịch tư vấn theo thời gian phù hợp với lịch trình của bạn.',
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Người dùng tin tưởng' },
    { number: '50+', label: 'Chuyên gia tâm lý' },
    { number: '100+', label: 'Khóa học chất lượng' },
    { number: '98%', label: 'Tỷ lệ hài lòng' }
  ];

  const howItWorksSteps = [
    {
      step: 1,
      title: 'Chọn dịch vụ',
      description: 'Lựa chọn giữa tư vấn trực tiếp với chuyên gia hoặc tham gia khóa học tự học',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop'
    },
    {
      step: 2,
      title: 'Đặt lịch hẹn',
      description: 'Chọn chuyên gia phù hợp và đặt lịch hẹn theo thời gian tiện lợi',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop'
    },
    {
      step: 3,
      title: 'Bắt đầu hành trình',
      description: 'Tham gia buổi tư vấn hoặc khóa học và cải thiện sức khỏe tâm lý',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-indigo-100/20"></div>
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
                Nền tảng #1 về Sức khỏe Tâm lý
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Chăm sóc <span className="text-primary bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Sức khỏe Tâm lý</span><br />
                của bạn cùng Feelosophy
              </h1>
              <p className="text-xl text-gray-700 mb-8">
                Kết nối với các chuyên gia tâm lý hàng đầu và tham gia các khóa học 
                được thiết kế khoa học để cải thiện sức khỏe tinh thần của bạn.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={() => onNavigate('experts')}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  Tư vấn ngay
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => onNavigate('courses')}
                  className="px-8 py-3 border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  Khám phá khóa học
                </Button>
              </div>
            </div>
            
            {/* Hero Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=500&fit=crop"
                  alt="Mental health consultation"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -top-4 -left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 max-w-xs border border-blue-100">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div>
                    <div className="font-medium text-sm text-gray-800">Dr. Sarah Johnson</div>
                    <div className="text-xs text-gray-600">Đang tư vấn online</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 border border-blue-100">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <div>
                    <div className="font-bold text-lg text-gray-800">4.9</div>
                    <div className="text-xs text-gray-600">Đánh giá TB</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-cyan-50/70"></div>
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tại sao chọn Feelosophy?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Chúng tôi cung cấp giải pháp toàn diện cho sức khỏe tâm lý của bạn
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300 group border-blue-100 hover:border-blue-200">
                  <div className="aspect-video relative overflow-hidden">
                    <ImageWithFallback
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-800">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Cách hoạt động
            </h2>
            <p className="text-xl text-gray-600">
              Bắt đầu hành trình chăm sóc sức khỏe tâm lý chỉ với 3 bước đơn giản
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorksSteps.map((item, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="aspect-square w-48 mx-auto rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent"></div>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                      {item.step}
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{item.title}</h3>
                <p className="text-gray-600 max-w-sm mx-auto">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-b from-blue-50/50 to-indigo-50/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Người dùng nói gì về chúng tôi
            </h2>
            <p className="text-xl text-gray-600">
              Những phản hồi tích cực từ cộng đồng Feelosophy
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Mai Phương',
                role: 'Nhân viên văn phòng',
                image: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150&h=150&fit=crop',
                quote: 'Feelosophy đã giúp tôi vượt qua căng thẳng công việc và tìm lại cân bằng trong cuộc sống.'
              },
              {
                name: 'Hoàng Nam',
                role: 'Sinh viên',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
                quote: 'Các khóa học rất thực tế và dễ áp dụng. Tôi đã học được nhiều kỹ năng quản lý cảm xúc.'
              },
              {
                name: 'Lan Anh',
                role: 'Chủ doanh nghiệp',
                image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
                quote: 'Dịch vụ tư vấn chuyên nghiệp, chuyên gia tận tâm và hiểu được nhu cầu của tôi.'
              }
            ].map((testimonial, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm border-blue-100 bg-[rgba(255,255,255,0.8)]">
                <CardContent className="space-y-4">
                  <div className="mx-auto">
                    <ImageWithFallback
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover mx-auto"
                    />
                  </div>
                  <div className="flex justify-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 italic">
                    &quot;{testimonial.quote}&quot;
                  </p>
                  <div>
                    <div className="font-semibold text-gray-800">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=1920&h=600&fit=crop"
            alt="Mental wellness"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-indigo-600/90"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Sẵn sàng cải thiện sức khỏe tâm lý của bạn?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Hãy bắt đầu hành trình của bạn ngay hôm nay với Feelosophy
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => onNavigate('experts')}
              className="px-8 py-3 bg-white text-blue-600 hover:bg-blue-50"
            >
              Tìm chuyên gia
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => onNavigate('courses')}
              className="px-8 py-3 bg-transparent border-white text-white hover:bg-white/10"
            >
              Xem khóa học
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}