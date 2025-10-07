"use client"

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { ArrowLeft, BookOpen, CheckCircle, Clock, Download, FileText, Play, SkipBack, SkipForward, Settings } from 'lucide-react';
import { useAuthContext } from '@/lib/auth-context';
import { apiClient } from '@/lib/api';
import type { CourseLearningContent } from '@/lib/types';

interface CourseLearnPageProps {
  courseId: string;
  onBack: () => void;
}

type LessonType = 'video' | 'document';

interface LessonItem {
  id: string;
  type: LessonType;
  title: string;
  moduleTitle: string;
  durationLabel: string;
  durationSeconds?: number;
  videoUrl?: string;
  documentUrl?: string;
}

const VIDEO_POSTER_FALLBACK = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=675&fit=crop&auto=format&q=80';

const formatVideoDuration = (seconds?: number) => {
  if (!seconds || seconds <= 0) {
    return '--:--';
  }
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const formatModuleDuration = (seconds: number, count: number) => {
  if (!seconds) {
    return `${count} nội dung`;
  }
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${count} nội dung • ${hours}h ${mins}m`;
  }
  return `${count} nội dung • ${mins} phút`;
};

const formatPlaybackTime = (value: number) => {
  const mins = Math.floor(value / 60);
  const secs = Math.floor(value % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export function CourseLearnPage({ courseId, onBack }: CourseLearnPageProps) {
  const { isAuthenticated } = useAuthContext();
  const [data, setData] = useState<CourseLearningContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const modules = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.curriculum.map((module) => {
      const items: LessonItem[] = [];

      module.videos.forEach((video) => {
        items.push({
          id: `video-${module._id}-${video._id}`,
          type: 'video',
          title: video.title,
          moduleTitle: module.title,
          durationLabel: formatVideoDuration(video.duration),
          durationSeconds: video.duration,
          videoUrl: video.url,
        });
      });

      module.documents.forEach((document) => {
        items.push({
          id: `document-${module._id}-${document._id}`,
          type: 'document',
          title: document.name,
          moduleTitle: module.title,
          durationLabel: 'Tài liệu',
          documentUrl: document.fileUrl,
        });
      });

      const durationSeconds = module.videos.reduce((sum, video) => sum + (video.duration || 0), 0);

      return {
        ...module,
        items,
        durationSeconds,
      };
    });
  }, [data]);

  const lessons = useMemo(() => modules.flatMap((module) => module.items), [modules]);

  const currentLesson = useMemo(
    () => lessons.find((lesson) => lesson.id === currentLessonId) || null,
    [lessons, currentLessonId]
  );

  const currentLessonIndex = useMemo(
    () => lessons.findIndex((lesson) => lesson.id === currentLessonId),
    [lessons, currentLessonId]
  );

  const completedLessons = data?.progress.completedLessons ?? 0;
  const totalLessons = data?.progress.totalLessons ?? lessons.length;
  const courseProgress = data
    ? Math.round(
      data.progress.percentage ??
      (totalLessons ? (completedLessons / totalLessons) * 100 : 0)
    )
    : 0;

  const totalDurationLabel = data?.course.totalHours
    ? `${data.course.totalHours} giờ`
    : data?.course.courseDuration || '--';

  const loadContent = useCallback(async () => {
    if (!isAuthenticated) {
      setData(null);
      setError('Vui lòng đăng nhập để truy cập nội dung khóa học.');
      setCurrentLessonId(null);
      setCurrentTime(0);
      setDuration(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setCurrentLessonId(null);
    setCurrentTime(0);
    setDuration(0);

    try {
      const response = await apiClient.getCourseLearningContent(courseId);
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setData(null);
        setError(response.error || response.message || 'Không thể tải nội dung khóa học.');
      }
    } catch (err) {
      setData(null);
      setError(err instanceof Error ? err.message : 'Không thể tải nội dung khóa học.');
    } finally {
      setLoading(false);
    }
  }, [courseId, isAuthenticated]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  useEffect(() => {
    if (!currentLessonId && lessons.length > 0) {
      setCurrentLessonId(lessons[0].id);
    }
  }, [lessons, currentLessonId]);

  const handleLessonSelect = (lesson: LessonItem) => {
    setCurrentLessonId(lesson.id);
    setCurrentTime(0);
  };

  const handleNextLesson = () => {
    if (currentLessonIndex >= 0 && currentLessonIndex < lessons.length - 1) {
      setCurrentLessonId(lessons[currentLessonIndex + 1].id);
      setCurrentTime(0);
    }
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonId(lessons[currentLessonIndex - 1].id);
      setCurrentTime(0);
    }
  };

  const handleOpenDocument = (url?: string) => {
    if (!url) return;
    window.open(url, '_blank', 'noopener');
  };

  const markLessonComplete = () => {
    if (currentLesson) {
      console.log('Marking lesson as complete:', currentLesson.id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center space-y-4">
        <div className="h-12 w-12 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        <p className="text-sm text-gray-300">Đang tải nội dung khóa học...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center space-y-6 px-6 text-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Không thể truy cập khóa học</h2>
          <p className="text-gray-400 max-w-md">{error}</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={onBack} className="text-white border-white/20 hover:bg-gray-800">
            <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại
          </Button>
          <Button onClick={loadContent} className="bg-blue-600 hover:bg-blue-700">
            Thử tải lại
          </Button>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const modulesCount = modules.length;
  const instructorName = data.course.instructor?.name || 'Giảng viên Feelosophy';
  const courseTitle = data.course.title;

  const renderLessonContent = () => {
    if (!currentLesson) {
      return (
        <div className="w-full h-full flex items-center justify-center text-gray-300">
          Chưa có nội dung học tập cho khóa học này.
        </div>
      );
    }

    if (currentLesson.type === 'video') {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <video
            className="w-full h-full"
            controls
            poster={VIDEO_POSTER_FALLBACK}
            onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
            onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
          >
            <source src={currentLesson.videoUrl} type="video/mp4" />
            Trình duyệt của bạn không hỗ trợ phát video.
          </video>

          <div className="absolute bottom-4 left-4 right-4 bg-black/60 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-base">{currentLesson.title}</h3>
                <p className="text-xs text-gray-300">{currentLesson.moduleTitle}</p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Clock className="h-4 w-4" />
                <span>
                  {formatPlaybackTime(currentTime)} / {formatPlaybackTime(duration)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handlePreviousLesson}
                  disabled={currentLessonIndex <= 0}
                  className="text-white hover:bg-gray-700"
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleNextLesson}
                  disabled={currentLessonIndex === lessons.length - 1}
                  className="text-white hover:bg-gray-700"
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
              <Button
                size="sm"
                onClick={markLessonComplete}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" /> Đánh dấu hoàn thành
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full h-full p-8 overflow-auto">
        <div className="max-w-4xl mx-auto bg-white text-gray-900 rounded-lg p-8 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs uppercase text-blue-600 tracking-wide">Tài liệu học tập</p>
              <h2 className="text-2xl font-semibold">{currentLesson.title}</h2>
            </div>
            <Button
              onClick={() => handleOpenDocument(currentLesson.documentUrl)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Mở tài liệu
            </Button>
          </div>
          <div className="space-y-4 text-sm leading-relaxed">
            <p>
              Tài liệu này hỗ trợ cho chương {currentLesson.moduleTitle}. Hãy đọc kỹ trước khi chuyển sang bài học tiếp theo để nắm được các khái niệm quan trọng.
            </p>
            <div className="p-4 bg-blue-50 rounded-md border border-blue-100">
              <p className="text-blue-700 font-medium">Gợi ý</p>
              <p className="text-blue-600 mt-2">
                Ghi chú lại những điểm chính và câu hỏi phát sinh trong quá trình đọc. Bạn có thể trao đổi thêm ở phần cộng đồng hoặc với giảng viên.
              </p>
            </div>
          </div>
          <div className="mt-8 flex justify-between">
            <Button variant="outline" onClick={handlePreviousLesson} disabled={currentLessonIndex <= 0}>
              <SkipBack className="h-4 w-4 mr-2" /> Bài trước
            </Button>
            <div className="space-x-2">
              <Button variant="outline" onClick={markLessonComplete}>
                <CheckCircle className="h-4 w-4 mr-2" /> Hoàn thành bài học
              </Button>
              <Button onClick={handleNextLesson} disabled={currentLessonIndex === lessons.length - 1}>
                Bài tiếp theo <SkipForward className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-gray-700">
              <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại
            </Button>
            <div>
              <h1 className="text-lg font-semibold">{courseTitle}</h1>
              <p className="text-sm text-gray-400">{instructorName}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-300">
              {completedLessons}/{totalLessons} bài học
            </div>
            <Progress value={courseProgress} className="w-32" />
            <span className="text-sm font-medium">{courseProgress}%</span>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        <div className="flex-1 flex flex-col">
          <div className="flex-1 bg-black relative">{renderLessonContent()}</div>
          <div className="bg-gray-800 p-4 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Bài học hiện tại</p>
                <h3 className="font-semibold text-base">{currentLesson?.title || 'Chọn bài học để bắt đầu'}</h3>
              </div>
              <div className="text-xs text-gray-400">
                {currentLesson?.moduleTitle || ''}
              </div>
            </div>
          </div>
        </div>

        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-700 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Nội dung khóa học</h2>
                <p className="text-xs text-gray-400">
                  {modulesCount} chương • {totalLessons} bài học • {totalDurationLabel}
                </p>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                <BookOpen className="h-3 w-3 mr-1" /> Học online
              </Badge>
            </div>
            <Progress value={courseProgress} />
            <p className="text-xs text-gray-400">
              {completedLessons}/{totalLessons} nội dung đã hoàn thành
            </p>
          </div>

          <div className="flex-1 overflow-auto">
            {modules.map((module) => (
              <div key={module._id} className="border-b border-gray-700">
                <div className="p-4 bg-gray-750">
                  <h3 className="font-medium text-sm">{module.title}</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatModuleDuration(module.durationSeconds, module.items.length)}
                  </p>
                </div>
                <div>
                  {module.items.map((lesson) => {
                    const isActive = lesson.id === currentLessonId;
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => handleLessonSelect(lesson)}
                        className={`w-full text-left p-3 transition-colors border-b border-gray-700/40 ${isActive ? 'bg-blue-600/20 border-l-4 border-l-blue-500' : 'hover:bg-gray-700'
                          }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-1 rounded ${isActive ? 'bg-blue-500' : 'bg-gray-600'}`}>
                            {lesson.type === 'video' ? <Play className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{lesson.title}</div>
                            <div className="text-xs text-gray-400 flex items-center space-x-2">
                              <span>{lesson.type === 'video' ? 'Video' : 'Tài liệu'}</span>
                              <span>•</span>
                              <span>{lesson.durationLabel}</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-700 space-y-2">
            <Card className="bg-gray-900/60 border border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-200">Mẹo học hiệu quả</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-gray-400 space-y-2">
                <p>• Ghi chú nhanh những ý chính trong mỗi video</p>
                <p>• Hoàn thành bài tập sau mỗi chương để củng cố kiến thức</p>
              </CardContent>
            </Card>
            <Button variant="outline" size="sm" className="w-full text-white border-gray-600 hover:bg-gray-700">
              <Settings className="h-4 w-4 mr-2" /> Cài đặt lớp học
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}