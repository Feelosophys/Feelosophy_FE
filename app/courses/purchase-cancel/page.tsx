"use client";

import React from 'react';
import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/app/components/ui/card';

export default function PurchaseCancelPage() {
  return (
    <div className="container max-w-lg mx-auto py-16 px-4">
      <Card className="border-red-100 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex flex-col items-center">
            <XCircle className="h-16 w-16 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-center">Thanh toán đã bị hủy</h1>
          </div>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          <p>
            Thanh toán của bạn đã bị hủy hoặc không thành công.
          </p>
          
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-red-700">
              Không có khoản phí nào được tính vào tài khoản của bạn.
            </p>
          </div>
          
          <p className="text-gray-600">
            Nếu bạn gặp vấn đề trong quá trình thanh toán, vui lòng liên hệ với chúng tôi để được hỗ trợ.
          </p>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild>
            <Link href="/courses">
              Quay lại khóa học
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/about">
              Liên hệ hỗ trợ
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
