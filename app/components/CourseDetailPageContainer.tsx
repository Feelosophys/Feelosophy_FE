"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CourseDetailPage } from './CourseDetailPage';
import { useAuth } from '@/lib/hooks';
import PaymentConfirmModal from './PaymentConfirmModal';

interface CourseDetailPageContainerProps {
  courseId: string;
}

export default function CourseDetailPageContainer({ courseId }: CourseDetailPageContainerProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [courseData, setCourseData] = useState<{
    title: string;
    price: number;
  } | null>(null);

  const handleBack = () => {
    router.push('/courses');
  };

  const handlePurchase = async (courseId: string, courseTitle: string, coursePrice: number) => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    // Lưu thông tin khóa học và mở modal xác nhận
    setCourseData({
      title: courseTitle,
      price: coursePrice
    });
    setPaymentModalOpen(true);
  };

  const handleCorporatePurchase = (courseId: string) => {
    router.push(`/courses/corporate/${courseId}`);
  };

  const handleLearn = (courseId: string) => {
    router.push(`/courses/learn/${courseId}`);
  };

  return (
    <>
      <CourseDetailPage
        courseId={courseId}
        onBack={handleBack}
        onPurchase={handlePurchase}
        onCorporatePurchase={handleCorporatePurchase}
        onLearn={handleLearn}
        currentUser={user}
      />
      
      {courseData && (
        <PaymentConfirmModal
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          courseId={courseId}
          courseTitle={courseData.title}
          coursePrice={courseData.price}
        />
      )}
    </>
  );
}
