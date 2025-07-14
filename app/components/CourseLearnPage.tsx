"use client"

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Maximize, 
  FileText, 
  Download, 
  CheckCircle, 
  Clock,
  BookOpen,
  ArrowLeft,
  Settings
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CourseLearnPageProps {
  courseId: string;
  onBack: () => void;
}

// Mock course learning data
const mockCourseData = {
  id: '1',
  title: 'Tâm lý học Ứng dụng trong Đời sống',
  instructor: 'Dr. Nguyễn Văn A',
  description: 'Khóa học toàn diện về tâm lý học ứng dụng trong cuộc sống hàng ngày',
  totalDuration: '8 giờ 30 phút',
  progress: 35,
  modules: [
    {
      id: 'module-1',
      title: 'Chương 1: Giới thiệu về Tâm lý học',
      duration: '1 giờ 45 phút',
      lessons: [
        {
          id: 'lesson-1-1',
          title: 'Tâm lý học là gì?',
          type: 'video',
          duration: '15:30',
          completed: true,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          description: 'Khái niệm cơ bản về tâm lý học và ứng dụng trong đời sống'
        },
        {
          id: 'lesson-1-2',
          title: 'Lịch sử phát triển tâm lý học',
          type: 'video',
          duration: '20:15',
          completed: true,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          description: 'Tìm hiểu về quá trình phát triển của tâm lý học qua các thời kỳ'
        },
        {
          id: 'lesson-1-3',
          title: 'Các phân ngành của tâm lý học',
          type: 'video',
          duration: '25:45',
          completed: false,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          description: 'Khám phá các lĩnh vực chuyên môn trong tâm lý học'
        },
        {
          id: 'lesson-1-4',
          title: 'Tài liệu tham khảo chương 1',
          type: 'document',
          duration: '10 phút đọc',
          completed: false,
          documentUrl: '#',
          description: 'Tài liệu PDF bổ sung kiến thức chương 1'
        }
      ]
    },
    {
      id: 'module-2',
      title: 'Chương 2: Tâm lý nhận thức',
      duration: '2 giờ 15 phút',
      lessons: [
        {
          id: 'lesson-2-1',
          title: 'Quá trình nhận thức',
          type: 'video',
          duration: '18:20',
          completed: false,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
          description: 'Hiểu về cách bộ não xử lý thông tin'
        },
        {
          id: 'lesson-2-2',
          title: 'Trí nhớ và học tập',
          type: 'video',
          duration: '22:30',
          completed: false,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
          description: 'Cơ chế hoạt động của trí nhớ và phương pháp học hiệu quả'
        },
        {
          id: 'lesson-2-3',
          title: 'Bài tập thực hành',
          type: 'document',
          duration: '30 phút',
          completed: false,
          documentUrl: '#',
          description: 'Bài tập ứng dụng kiến thức về tâm lý nhận thức'
        }
      ]
    },
    {
      id: 'module-3',
      title: 'Chương 3: Tâm lý cảm xúc',
      duration: '1 giờ 50 phút',
      lessons: [
        {
          id: 'lesson-3-1',
          title: 'Cảm xúc và tâm trạng',
          type: 'video',
          duration: '16:45',
          completed: false,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
          description: 'Phân biệt cảm xúc và tâm trạng, tác động đến hành vi'
        },
        {
          id: 'lesson-3-2',
          title: 'Quản lý cảm xúc',
          type: 'video',
          duration: '24:10',
          completed: false,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
          description: 'Kỹ thuật điều chỉnh và quản lý cảm xúc hiệu quả'
        }
      ]
    }
  ]
};

export function CourseLearnPage({ courseId, onBack }: CourseLearnPageProps) {
  const [currentLesson, setCurrentLesson] = useState(mockCourseData.modules[0].lessons[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const allLessons = mockCourseData.modules.flatMap(module => 
    module.lessons.map(lesson => ({ ...lesson, moduleTitle: module.title }))
  );

  const currentLessonIndex = allLessons.findIndex(lesson => lesson.id === currentLesson.id);
  const completedLessons = allLessons.filter(lesson => lesson.completed).length;
  const totalLessons = allLessons.length;
  const courseProgress = Math.round((completedLessons / totalLessons) * 100);

  const handleLessonSelect = (lesson: any) => {
    setCurrentLesson(lesson);
    setIsPlaying(false);
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      setCurrentLesson(allLessons[currentLessonIndex + 1]);
      setIsPlaying(false);
    }
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLesson(allLessons[currentLessonIndex - 1]);
      setIsPlaying(false);
    }
  };

  const markLessonComplete = () => {
    // Mark current lesson as completed
    console.log('Marking lesson as complete:', currentLesson.id);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white hover:bg-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
            <div>
              <h1 className="text-lg font-semibold">{mockCourseData.title}</h1>
              <p className="text-sm text-gray-400">bởi {mockCourseData.instructor}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-400">
              {completedLessons}/{totalLessons} bài học
            </div>
            <Progress value={courseProgress} className="w-32" />
            <span className="text-sm font-medium">{courseProgress}%</span>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Main Content Area - 80% */}
        <div className="flex-1 flex flex-col">
          {/* Video/Content Player */}
          <div className="flex-1 bg-black relative">
            {currentLesson.type === 'video' ? (
              <div className="w-full h-full flex items-center justify-center">
                <video
                  className="w-full h-full"
                  controls
                  poster="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop"
                  onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                  onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                >
                  <source src={currentLesson.videoUrl} type="video/mp4" />
                  Trình duyệt không hỗ trợ video.
                </video>
                
                {/* Custom Controls Overlay */}
                <div className="absolute bottom-4 left-4 right-4 bg-black/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{currentLesson.title}</h3>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handlePreviousLesson}
                        disabled={currentLessonIndex === 0}
                      >
                        <SkipBack className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleNextLesson}
                        disabled={currentLessonIndex === allLessons.length - 1}
                      >
                        <SkipForward className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={markLessonComplete}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Hoàn thành
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Document viewer
              <div className="w-full h-full p-8 overflow-auto">
                <div className="max-w-4xl mx-auto bg-white text-black rounded-lg p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">{currentLesson.title}</h2>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Download className="h-4 w-4 mr-2" />
                      Tải xuống
                    </Button>
                  </div>
                  <div className="prose max-w-none">
                    <p className="text-gray-600 mb-4">{currentLesson.description}</p>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">Nội dung tài liệu</h3>
                      <p>Đây là nội dung mẫu của tài liệu học tập. Trong thực tế, đây sẽ là nội dung PDF hoặc tài liệu được nhúng.</p>
                      <ul className="list-disc pl-6 mt-4">
                        <li>Khái niệm cơ bản</li>
                        <li>Ví dụ thực tế</li>
                        <li>Bài tập ứng dụng</li>
                        <li>Câu hỏi thảo luận</li>
                      </ul>
                    </div>
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <p className="font-medium text-blue-800">💡 Ghi chú quan trọng</p>
                      <p className="text-blue-700 mt-2">Hãy đảm bảo bạn đã hiểu rõ nội dung trước khi chuyển sang bài học tiếp theo.</p>
                    </div>
                  </div>
                  <div className="mt-8 flex justify-between">
                    <Button
                      variant="outline"
                      onClick={handlePreviousLesson}
                      disabled={currentLessonIndex === 0}
                    >
                      <SkipBack className="h-4 w-4 mr-2" />
                      Bài trước
                    </Button>
                    <Button
                      onClick={markLessonComplete}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Hoàn thành bài học
                    </Button>
                    <Button
                      onClick={handleNextLesson}
                      disabled={currentLessonIndex === allLessons.length - 1}
                    >
                      Bài tiếp theo
                      <SkipForward className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Lesson Info */}
          <div className="bg-gray-800 p-4 border-t border-gray-700">
            <h3 className="font-semibold mb-2">{currentLesson.title}</h3>
            <p className="text-gray-400 text-sm">{currentLesson.description}</p>
          </div>
        </div>

        {/* Sidebar - 20% */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          {/* Course Info */}
          <div className="p-4 border-b border-gray-700">
            <h2 className="font-semibold mb-2">Nội dung khóa học</h2>
            <div className="text-sm text-gray-400">
              {mockCourseData.modules.length} chương • {totalLessons} bài học • {mockCourseData.totalDuration}
            </div>
            <Progress value={courseProgress} className="mt-3" />
            <div className="text-sm text-gray-400 mt-2">
              {completedLessons}/{totalLessons} bài học hoàn thành
            </div>
          </div>

          {/* Curriculum */}
          <div className="flex-1 overflow-auto">
            {mockCourseData.modules.map((module) => (
              <div key={module.id} className="border-b border-gray-700">
                <div className="p-4 bg-gray-750">
                  <h3 className="font-medium text-sm">{module.title}</h3>
                  <div className="text-xs text-gray-400 mt-1">{module.duration}</div>
                </div>
                <div>
                  {module.lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => handleLessonSelect(lesson)}
                      className={`w-full text-left p-3 hover:bg-gray-700 border-b border-gray-700/50 transition-colors ${
                        currentLesson.id === lesson.id ? 'bg-blue-600/20 border-l-4 border-l-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-1 rounded ${lesson.completed ? 'bg-green-600' : 'bg-gray-600'}`}>
                          {lesson.type === 'video' ? (
                            lesson.completed ? <CheckCircle className="h-3 w-3" /> : <Play className="h-3 w-3" />
                          ) : (
                            lesson.completed ? <CheckCircle className="h-3 w-3" /> : <FileText className="h-3 w-3" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{lesson.title}</div>
                          <div className="text-xs text-gray-400 flex items-center space-x-2">
                            <span>{lesson.type === 'video' ? 'Video' : 'Tài liệu'}</span>
                            <span>•</span>
                            <span>{lesson.duration}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Course Actions */}
          <div className="p-4 border-t border-gray-700 space-y-2">
            <Button variant="outline" size="sm" className="w-full">
              <Settings className="h-4 w-4 mr-2" />
              Cài đặt
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}