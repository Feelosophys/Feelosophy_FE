"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/app/components/ui/card';
import { apiClient } from '@/lib/api';

export default function PurchaseSuccessPage({
  searchParams,
}: {
  searchParams: { orderId?: string };
}) {
  const orderId = searchParams.orderId || '';
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  // Kiểm tra trạng thái thanh toán khi trang được tải
  useEffect(() => {
    const verifyPayment = async () => {
      if (!orderId) {
        setIsVerifying(false);
        return;
      }

      try {
        const response = await apiClient.checkPaymentStatus(orderId);
        
        if (response.success && response.data?.status === 'completed') {
          setIsSuccess(true);
        }
      } catch (error) {
        console.error('Failed to verify payment:', error);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [orderId]);

  if (isVerifying) {
    return (
      <div className="container max-w-lg mx-auto py-16 px-4 flex flex-col items-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
        <p className="text-lg">Đang xác nhận thanh toán...</p>
      </div>
    );
  }

  if (!isSuccess) {
    return (
      <div className="container max-w-lg mx-auto py-16 px-4">
        <Card className="border-yellow-100 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex flex-col items-center">
              <CheckCircle className="h-16 w-16 text-yellow-500 mb-4" />
              <h1 className="text-2xl font-bold text-center">Đang xử lý thanh toán</h1>
            </div>
          </CardHeader>
          
          <CardContent className="text-center space-y-4">
            <p>
              Chúng tôi đang xử lý thanh toán của bạn. Vui lòng kiểm tra email để biết thêm thông tin.
            </p>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-yellow-700">
                Nếu bạn đã thanh toán nhưng chưa được cấp quyền truy cập khóa học, vui lòng liên hệ hỗ trợ.
              </p>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild>
              <Link href="/dashboard">
                Đến Dashboard
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/courses">
                Xem thêm khóa học
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-lg mx-auto py-16 px-4">
      <Card className="border-green-100 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex flex-col items-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h1 className="text-2xl font-bold text-center">Thanh toán thành công!</h1>
          </div>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          <p>
            Cảm ơn bạn đã mua khóa học. Chúng tôi đã ghi nhận thanh toán của bạn.
          </p>
          
          {orderId && (
            <p className="text-sm text-gray-500">
              Mã đơn hàng: <span className="font-medium">{orderId}</span>
            </p>
          )}
          
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-green-700">
              Bạn có thể truy cập khóa học ngay bây giờ từ trang Dashboard của mình.
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild>
            <Link href="/dashboard">
              Đến Dashboard
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/courses">
              Xem thêm khóa học
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
