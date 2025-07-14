"use client"

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Separator } from './ui/separator';
import { Star, Clock, Users, BookOpen, Play, CheckCircle, X } from 'lucide-react';
import { Course } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CourseDetailProps {
  course: Course;
  onClose: () => void;
}

export function CourseDetail({ course, onClose }: CourseDetailProps) {
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handlePurchase = () => {
    // Simulate purchase process
    setTimeout(() => {
      setPurchaseSuccess(true);
      setTimeout(() => {
        setShowPurchaseDialog(false);
        setPurchaseSuccess(false);
        onClose();
      }, 2000);
    }, 1500);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl">{course.title}</DialogTitle>
        <DialogDescription className="text-base">
          {course.description}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        {/* Course Image */}
        <div className="aspect-video relative overflow-hidden rounded-lg">
          <ImageWithFallback
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <Button size="lg" className="rounded-full">
              <Play className="h-6 w-6 mr-2" />
              Xem trailer
            </Button>
          </div>
        </div>

        {/* Course Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Stats */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-1 text-sm">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{course.rating}</span>
                <span className="text-gray-600">({course.reviews.length} đánh giá)</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>{course.students.toLocaleString()} học viên</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <BookOpen className="h-4 w-4" />
                <span>{course.lessons} bài học</span>
              </div>
              <Badge variant="secondary">{course.level}</Badge>
              <Badge variant="outline">{course.category}</Badge>
            </div>

            <Separator />

            {/* Instructor */}
            <div>
              <h3 className="font-semibold mb-2">Giảng viên</h3>
              <p className="text-gray-600">{course.instructor}</p>
            </div>

            <Separator />

            {/* Features */}
            <div>
              <h3 className="font-semibold mb-3">Nội dung khóa học</h3>
              <div className="space-y-2">
                {course.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Reviews */}
            <div>
              <h3 className="font-semibold mb-3">Đánh giá từ học viên</h3>
              <div className="space-y-4">
                {course.reviews.map((review) => (
                  <Card key={review.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{review.studentName}</div>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString('vi-VN')}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-600">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Purchase Card */}
          <div className="md:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">
                  {formatPrice(course.price)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => setShowPurchaseDialog(true)}
                >
                  Mua khóa học ngay
                </Button>
                <Button variant="outline" className="w-full">
                  Thêm vào wishlist
                </Button>
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Truy cập trọn đời</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Chứng chỉ hoàn thành</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Hỗ trợ từ giảng viên</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Đảm bảo hoàn tiền 30 ngày</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Purchase Dialog */}
      <Dialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {purchaseSuccess ? 'Mua thành công!' : 'Xác nhận mua khóa học'}
            </DialogTitle>
            <DialogDescription>
              {purchaseSuccess 
                ? 'Bạn đã mua khóa học thành công. Hãy bắt đầu học ngay!'
                : 'Bạn có chắc chắn muốn mua khóa học này không?'
              }
            </DialogDescription>
          </DialogHeader>
          
          {!purchaseSuccess ? (
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span>Giá khóa học:</span>
                    <span className="font-bold text-primary">
                      {formatPrice(course.price)}
                    </span>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex space-x-2 justify-end">
                <Button variant="outline" onClick={() => setShowPurchaseDialog(false)}>
                  Hủy
                </Button>
                <Button onClick={handlePurchase}>
                  Xác nhận mua
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <p className="text-green-600">
                Khóa học đã được thêm vào thư viện của bạn!
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}