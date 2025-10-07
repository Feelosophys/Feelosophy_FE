"use client"

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, CheckCircle, Download, FileText, Link as LinkIcon, Play, User as UserIcon, Video as VideoIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { Separator } from '@/app/components/ui/separator';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { apiClient } from '@/lib/api';
import type { CourseLearningContent, CourseLearningModule, CourseLearningVideo, CourseLearningDocument } from '@/lib/types';

const FALLBACK_COVER = 'https://images.unsplash.com/photo-1515165562835-c4c31f75821a?w=1200&h=600&fit=crop&auto=format&q=80';

const formatDuration = (seconds?: number) => {
  if (!seconds || seconds <= 0) {
    return '--:--';
  }
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const getModuleStats = (module: CourseLearningModule) => {
  const videoCount = module.videos.length;
  const documentCount = module.documents.length;
  const totalDuration = module.videos.reduce((sum, video) => sum + (video.duration || 0), 0);
  const durationLabel = totalDuration > 0 ? `${Math.round(totalDuration / 60)} phút video` : undefined;
  return {
    videoCount,
    documentCount,
    durationLabel,
  };
};

const openResource = (url?: string) => {
  if (!url) return;
  window.open(url, '_blank', 'noopener');
};

export default function LearnerPage() {
  const params = useParams<{ courseId: string }>();
  const router = useRouter();
  const courseId = params?.courseId ?? '';

  const [data, setData] = useState<CourseLearningContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadContent = useCallback(async () => {
    if (!courseId) {
      setError('Không tìm thấy khóa học.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getCourseLearningContent(courseId);
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.error || response.message || 'Không thể tải nội dung khóa học.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải nội dung khóa học.');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const course = data?.course;
  const progress = data?.progress;
  const enrollment = data?.enrollment;

  const totals = useMemo(() => {
    if (!course) {
      return {
        lessons: 0,
        videos: 0,
        documents: 0,
      };
    }
    return {
      lessons: course.totalLessons ?? data?.curriculum.length ?? 0,
      videos: course.totalVideos ?? data?.curriculum.reduce((sum, module) => sum + module.videos.length, 0) ?? 0,
      documents: course.stats?.totalDocuments ?? data?.curriculum.reduce((sum, module) => sum + module.documents.length, 0) ?? 0,
    };
  }, [course, data?.curriculum]);

  const renderVideo = (video: CourseLearningVideo) => (
    <Card key={video._id} className="border-blue-100 bg-blue-50/60">
      <CardContent className="p-4 flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="mt-1 rounded-full bg-blue-200 p-2 text-blue-700">
            <VideoIcon className="h-4 w-4" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{video.title}</p>
            <div className="text-sm text-gray-600 flex items-center space-x-2 mt-1">
              <span>{formatDuration(video.duration)}</span>
              <span>•</span>
              <button
                className="inline-flex items-center text-blue-600 hover:underline"
                onClick={() => openResource(video.url)}
              >
                <LinkIcon className="h-4 w-4 mr-1" /> Mở video
              </button>
            </div>
          </div>
        </div>
        <Badge variant="outline" className="text-blue-700 border-blue-200">Video</Badge>
      </CardContent>
    </Card>
  );

  const renderDocument = (document: CourseLearningDocument) => (
    <Card key={document._id} className="border-amber-100 bg-amber-50/60">
      <CardContent className="p-4 flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="mt-1 rounded-full bg-amber-200 p-2 text-amber-700">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{document.name}</p>
            <button
              className="mt-1 inline-flex items-center text-amber-600 hover:underline text-sm"
              onClick={() => openResource(document.fileUrl)}
            >
              <Download className="h-4 w-4 mr-1" /> Tải tài liệu
            </button>
          </div>
        </div>
        <Badge variant="outline" className="text-amber-700 border-amber-200">Tài liệu</Badge>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center justify-center space-y-4 text-gray-600">
        <div className="h-12 w-12 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        <p>Đang tải nội dung khóa học...</p>
      </div>
    );
  }

  if (error || !data || !course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center justify-center px-6 text-center space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-900">Không thể tải nội dung</h2>
          <p className="text-gray-600 max-w-md">{error || 'Vui lòng thử lại sau.'}</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => router.back()} className="border-blue-200 text-blue-700 hover:bg-blue-50">
            <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại
          </Button>
          <Button onClick={loadContent} className="bg-blue-600 hover:bg-blue-700">
            Thử tải lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-10">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center space-x-2 text-sm text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
              <BookOpen className="h-4 w-4" />
              <span>Khóa học của bạn</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
            <p className="text-gray-600 max-w-2xl">{course.description}</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-700">
              <div className="flex items-center space-x-2">
                <UserIcon className="h-4 w-4" />
                <span>{course.instructor?.name || 'Giảng viên Feelosophy'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Play className="h-4 w-4" />
                <span>{totals.videos} video</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>{totals.documents} tài liệu</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>{progress?.completedLessons ?? 0}/{progress?.totalLessons ?? totals.lessons} bài học</span>
              </div>
            </div>
            {enrollment?.enrolledAt && (
              <p className="text-sm text-gray-500">
                Đăng ký ngày {new Date(enrollment.enrolledAt).toLocaleDateString('vi-VN')}
              </p>
            )}
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={() => router.back()} className="border-blue-200 text-blue-700 hover:bg-blue-50">
                <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại hồ sơ
              </Button>
              {course.courseImg && (
                <Button variant="ghost" onClick={() => openResource(course.courseImg)} className="text-blue-700 hover:bg-blue-100">
                  Xem ảnh khóa học
                </Button>
              )}
            </div>
          </div>
          <div className="w-72">
            <Card className="overflow-hidden">
              <ImageWithFallback
                src={course.courseImg || FALLBACK_COVER}
                alt={course.title}
                className="h-32 w-full object-cover"
              />
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Tiến độ</p>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Khóa học</span>
                    <span>{Math.round(progress?.percentage ?? 0)}%</span>
                  </div>
                  <Progress value={progress?.percentage ?? 0} />
                </div>
                <Separator />
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Tổng bài học</span>
                    <span>{totals.lessons}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Video</span>
                    <span>{totals.videos}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tài liệu</span>
                    <span>{totals.documents}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Nội dung khóa học</h2>
              <p className="text-sm text-gray-600">Chọn một bài học để mở video hoặc tài liệu tương ứng.</p>
            </div>
          </div>

          <div className="space-y-6">
            {data.curriculum.map((module) => {
              const stats = getModuleStats(module);
              return (
                <Card key={module._id} className="border-gray-200 bg-white/80 backdrop-blur">
                  <CardHeader className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="text-gray-700">
                          Bài {module.order}
                        </Badge>
                        <CardTitle className="text-xl">{module.title}</CardTitle>
                      </div>
                      <CardDescription className="text-sm text-gray-500">
                        {stats.videoCount} video • {stats.documentCount} tài liệu{stats.durationLabel ? ` • ${stats.durationLabel}` : ''}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {module.videos.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center">
                          <VideoIcon className="h-4 w-4 mr-2" /> Video
                        </h3>
                        <div className="grid gap-3">
                          {module.videos.map(renderVideo)}
                        </div>
                      </div>
                    )}

                    {module.documents.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center">
                          <FileText className="h-4 w-4 mr-2" /> Tài liệu
                        </h3>
                        <div className="grid gap-3">
                          {module.documents.map(renderDocument)}
                        </div>
                      </div>
                    )}

                    {module.videos.length === 0 && module.documents.length === 0 && (
                      <p className="text-sm text-gray-500">
                        Nội dung cho bài học này sẽ được cập nhật sớm.
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
