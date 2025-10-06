"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api';
import Image from 'next/image';

interface PaymentConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle: string;
  coursePrice: number;
}

export default function PaymentConfirmModal({
  isOpen,
  onClose,
  courseId,
  courseTitle,
  coursePrice
}: PaymentConfirmModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleConfirmPurchase = async () => {
    setIsLoading(true);
    try {
      // Gọi API tạo thanh toán
      const response = await apiClient.createCoursePayment(courseId);
      
      if (response.success && response.data) {
        // Chuyển hướng đến trang thanh toán PayOS
        window.location.href = response.data.checkoutUrl;
      } else {
        console.error('Failed to create payment:', response.error);
        alert('Có lỗi xảy ra khi tạo thanh toán. Vui lòng thử lại sau.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            Xác nhận mua khóa học
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center p-4">
          <div className="mb-6 text-center">
            <h3 className="text-lg font-semibold mb-2">{courseTitle}</h3>
            <p className="text-xl font-bold text-blue-600">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(coursePrice)}
            </p>
          </div>
          
          <div className="space-y-4 w-full">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700">
                Bạn có chắc chắn muốn mua khóa học này không?
              </p>
            </div>
            
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Hủy
              </Button>
              
              <Button
                onClick={handleConfirmPurchase}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  'Xác nhận mua'
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
