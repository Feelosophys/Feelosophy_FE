import React from 'react';
import CourseDetailPageContainer from '@/app/components/CourseDetailPageContainer';

interface CoursePageProps {
  params: {
    id: string;
  };
}

export default function CoursePage({ params }: CoursePageProps) {
  return <CourseDetailPageContainer courseId={params.id} />;
}
