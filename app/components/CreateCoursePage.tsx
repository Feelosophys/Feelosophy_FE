"use client"

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  ArrowLeft, 
  Upload, 
  Plus, 
  Trash2, 
  Video, 
  FileText, 
  Image, 
  Save,
  Eye,
  DollarSign,
  Clock,
  Users,
  BookOpen,
  Play,
  Edit
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CreateCoursePageProps {
  onBack: () => void;
  onSave: (courseData: any) => void;
  existingCourse?: any; // For editing existing course
}

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'document' | 'quiz';
  duration: string;
  videoFile?: File;
  documentFile?: File;
  description: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export function CreateCoursePage({ onBack, onSave, existingCourse }: CreateCoursePageProps) {
  const [activeTab, setActiveTab] = useState('basic');
  const [courseData, setCourseData] = useState({
    title: existingCourse?.title || '',
    description: existingCourse?.description || '',
    shortDescription: existingCourse?.shortDescription || '',
    category: existingCourse?.category || '',
    level: existingCourse?.level || '',
    language: existingCourse?.language || 'vi',
    price: existingCourse?.price || '',
    originalPrice: existingCourse?.originalPrice || '',
    thumbnail: existingCourse?.thumbnail || null,
    previewVideo: existingCourse?.previewVideo || null,
    objectives: existingCourse?.objectives || [''],
    requirements: existingCourse?.requirements || [''],
    targetAudience: existingCourse?.targetAudience || ['']
  });

  const [modules, setModules] = useState<Module[]>(existingCourse?.modules || [
    {
      id: 'module-1',
      title: '',
      description: '',
      lessons: []
    }
  ]);

  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    existingCourse?.thumbnail || null
  );

  const handleInputChange = (field: string, value: any) => {
    setCourseData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayFieldChange = (field: string, index: number, value: string) => {
    setCourseData(prev => ({
      ...prev,
      [field]: prev[field].map((item: string, i: number) => i === index ? value : item)
    }));
  };

  const addArrayField = (field: string) => {
    setCourseData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field: string, index: number) => {
    setCourseData(prev => ({
      ...prev,
      [field]: prev[field].filter((_: string, i: number) => i !== index)
    }));
  };

  const handleThumbnailUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCourseData(prev => ({ ...prev, thumbnail: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addModule = () => {
    const newModule: Module = {
      id: `module-${modules.length + 1}`,
      title: '',
      description: '',
      lessons: []
    };
    setModules([...modules, newModule]);
  };

  const updateModule = (moduleId: string, field: string, value: string) => {
    setModules(modules.map(module => 
      module.id === moduleId ? { ...module, [field]: value } : module
    ));
  };

  const removeModule = (moduleId: string) => {
    setModules(modules.filter(module => module.id !== moduleId));
  };

  const addLesson = (moduleId: string) => {
    const newLesson: Lesson = {
      id: `lesson-${Date.now()}`,
      title: '',
      type: 'video',
      duration: '',
      description: ''
    };
    
    setModules(modules.map(module => 
      module.id === moduleId 
        ? { ...module, lessons: [...module.lessons, newLesson] }
        : module
    ));
  };

  const updateLesson = (moduleId: string, lessonId: string, field: string, value: any) => {
    setModules(modules.map(module => 
      module.id === moduleId 
        ? {
            ...module,
            lessons: module.lessons.map(lesson =>
              lesson.id === lessonId ? { ...lesson, [field]: value } : lesson
            )
          }
        : module
    ));
  };

  const removeLesson = (moduleId: string, lessonId: string) => {
    setModules(modules.map(module => 
      module.id === moduleId 
        ? { ...module, lessons: module.lessons.filter(lesson => lesson.id !== lessonId) }
        : module
    ));
  };

  const handleSave = () => {
    const courseToSave = {
      ...courseData,
      modules,
      status: 'draft',
      createdDate: existingCourse?.createdDate || new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    onSave(courseToSave);
  };

  const handlePublish = () => {
    const courseToSave = {
      ...courseData,
      modules,
      status: 'under_review',
      createdDate: existingCourse?.createdDate || new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    onSave(courseToSave);
  };

  const totalLessons = modules.reduce((total, module) => total + module.lessons.length, 0);
  const estimatedDuration = modules.reduce((total, module) => {
    return total + module.lessons.reduce((moduleTotal, lesson) => {
      const duration = lesson.duration ? parseInt(lesson.duration) || 0 : 0;
      return moduleTotal + duration;
    }, 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {existingCourse ? 'Chỉnh sửa khóa học' : 'Tạo khóa học mới'}
              </h1>
              <p className="text-gray-600">
                {existingCourse ? 'Cập nhật thông tin khóa học' : 'Tạo và chia sẻ kiến thức của bạn'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Lưu nháp
            </Button>
            <Button onClick={handlePublish} className="bg-blue-600 hover:bg-blue-700">
              <Eye className="h-4 w-4 mr-2" />
              Gửi duyệt
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm border border-blue-100">
            <TabsTrigger value="basic" className="flex items-center space-x-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              <BookOpen className="h-4 w-4" />
              <span>Thông tin cơ bản</span>
            </TabsTrigger>
            <TabsTrigger value="curriculum" className="flex items-center space-x-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              <Play className="h-4 w-4" />
              <span>Nội dung khóa học</span>
            </TabsTrigger>
            <TabsTrigger value="pricing" className="flex items-center space-x-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              <DollarSign className="h-4 w-4" />
              <span>Giá & Xuất bản</span>
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center space-x-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              <Eye className="h-4 w-4" />
              <span>Xem trước</span>
            </TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
                <CardDescription>Thông tin chung về khóa học của bạn</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Tiêu đề khóa học *</Label>
                      <Input
                        id="title"
                        value={courseData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Nhập tiêu đề hấp dẫn cho khóa học"
                        className="border-blue-200 focus:border-blue-400"
                      />
                    </div>

                    <div>
                      <Label htmlFor="shortDescription">Mô tả ngắn *</Label>
                      <Textarea
                        id="shortDescription"
                        value={courseData.shortDescription}
                        onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                        placeholder="Mô tả ngắn gọn về khóa học (tối đa 160 ký tự)"
                        className="border-blue-200 focus:border-blue-400"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Danh mục *</Label>
                        <Select value={courseData.category} onValueChange={(value) => handleInputChange('category', value)}>
                          <SelectTrigger className="border-blue-200 focus:border-blue-400">
                            <SelectValue placeholder="Chọn danh mục" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="psychology">Tâm lý học</SelectItem>
                            <SelectItem value="mental-health">Sức khỏe tinh thần</SelectItem>
                            <SelectItem value="meditation">Thiền định</SelectItem>
                            <SelectItem value="communication">Giao tiếp</SelectItem>
                            <SelectItem value="personal-development">Phát triển bản thân</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="level">Trình độ *</Label>
                        <Select value={courseData.level} onValueChange={(value) => handleInputChange('level', value)}>
                          <SelectTrigger className="border-blue-200 focus:border-blue-400">
                            <SelectValue placeholder="Chọn trình độ" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Người mới bắt đầu</SelectItem>
                            <SelectItem value="intermediate">Trung cấp</SelectItem>
                            <SelectItem value="advanced">Nâng cao</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Ảnh thumbnail *</Label>
                      <div className="border-2 border-dashed border-blue-200 rounded-lg p-6 text-center">
                        {thumbnailPreview ? (
                          <div className="space-y-4">
                            <ImageWithFallback
                              src={thumbnailPreview}
                              alt="Course thumbnail"
                              className="w-full h-40 object-cover rounded-lg mx-auto"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => document.getElementById('thumbnail-upload')?.click()}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Thay đổi ảnh
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <Image className="h-12 w-12 text-gray-400 mx-auto" />
                            <div>
                              <Button
                                variant="outline"
                                onClick={() => document.getElementById('thumbnail-upload')?.click()}
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                Tải lên ảnh
                              </Button>
                              <p className="text-sm text-gray-500 mt-2">
                                Kích thước khuyến nghị: 1280x720px
                              </p>
                            </div>
                          </div>
                        )}
                        <input
                          id="thumbnail-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleThumbnailUpload}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Mô tả chi tiết *</Label>
                  <Textarea
                    id="description"
                    value={courseData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Mô tả chi tiết về nội dung, lợi ích và giá trị của khóa học..."
                    className="border-blue-200 focus:border-blue-400"
                    rows={6}
                  />
                </div>

                {/* Learning Objectives */}
                <div>
                  <Label>Mục tiêu học tập *</Label>
                  <div className="space-y-2">
                    {courseData.objectives.map((objective, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={objective}
                          onChange={(e) => handleArrayFieldChange('objectives', index, e.target.value)}
                          placeholder="Học viên sẽ học được gì..."
                          className="border-blue-200 focus:border-blue-400"
                        />
                        {courseData.objectives.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeArrayField('objectives', index)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addArrayField('objectives')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm mục tiêu
                    </Button>
                  </div>
                </div>

                {/* Requirements */}
                <div>
                  <Label>Yêu cầu tiên quyết</Label>
                  <div className="space-y-2">
                    {courseData.requirements.map((requirement, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={requirement}
                          onChange={(e) => handleArrayFieldChange('requirements', index, e.target.value)}
                          placeholder="Kiến thức hoặc kỹ năng cần có..."
                          className="border-blue-200 focus:border-blue-400"
                        />
                        {courseData.requirements.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeArrayField('requirements', index)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addArrayField('requirements')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm yêu cầu
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Curriculum Tab */}
          <TabsContent value="curriculum" className="space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Nội dung khóa học</CardTitle>
                    <CardDescription>
                      Tạo các chương và bài học cho khóa học ({totalLessons} bài học, ~{Math.round(estimatedDuration/60)} giờ)
                    </CardDescription>
                  </div>
                  <Button onClick={addModule} variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm chương
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {modules.map((module, moduleIndex) => (
                    <Card key={module.id} className="border-blue-200">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">Chương {moduleIndex + 1}</Badge>
                          {modules.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeModule(module.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>
                        <div className="space-y-3">
                          <Input
                            value={module.title}
                            onChange={(e) => updateModule(module.id, 'title', e.target.value)}
                            placeholder="Tiêu đề chương..."
                            className="border-blue-200 focus:border-blue-400"
                          />
                          <Textarea
                            value={module.description}
                            onChange={(e) => updateModule(module.id, 'description', e.target.value)}
                            placeholder="Mô tả ngắn về nội dung chương..."
                            className="border-blue-200 focus:border-blue-400"
                            rows={2}
                          />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <div key={lesson.id} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <Badge variant="outline">Bài {lessonIndex + 1}</Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeLesson(module.id, lesson.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                  <Input
                                    value={lesson.title}
                                    onChange={(e) => updateLesson(module.id, lesson.id, 'title', e.target.value)}
                                    placeholder="Tiêu đề bài học..."
                                    className="border-blue-200 focus:border-blue-400"
                                  />
                                  
                                  <div className="grid grid-cols-2 gap-2">
                                    <Select
                                      value={lesson.type}
                                      onValueChange={(value) => updateLesson(module.id, lesson.id, 'type', value)}
                                    >
                                      <SelectTrigger className="border-blue-200">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="video">
                                          <div className="flex items-center space-x-2">
                                            <Video className="h-4 w-4" />
                                            <span>Video</span>
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="document">
                                          <div className="flex items-center space-x-2">
                                            <FileText className="h-4 w-4" />
                                            <span>Tài liệu</span>
                                          </div>
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                    
                                    <Input
                                      value={lesson.duration}
                                      onChange={(e) => updateLesson(module.id, lesson.id, 'duration', e.target.value)}
                                      placeholder="Thời lượng (phút)"
                                      className="border-blue-200 focus:border-blue-400"
                                    />
                                  </div>
                                </div>
                                
                                <div className="space-y-3">
                                  <Textarea
                                    value={lesson.description}
                                    onChange={(e) => updateLesson(module.id, lesson.id, 'description', e.target.value)}
                                    placeholder="Mô tả bài học..."
                                    className="border-blue-200 focus:border-blue-400"
                                    rows={3}
                                  />
                                  
                                  {lesson.type === 'video' ? (
                                    <div className="border-2 border-dashed border-blue-200 rounded-lg p-4 text-center">
                                      <Video className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                      <Button variant="outline" size="sm">
                                        <Upload className="h-4 w-4 mr-2" />
                                        Tải video
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="border-2 border-dashed border-blue-200 rounded-lg p-4 text-center">
                                      <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                      <Button variant="outline" size="sm">
                                        <Upload className="h-4 w-4 mr-2" />
                                        Tải tài liệu
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          <Button
                            variant="outline"
                            onClick={() => addLesson(module.id)}
                            className="w-full border-dashed"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm bài học
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
              <CardHeader>
                <CardTitle>Giá và xuất bản</CardTitle>
                <CardDescription>Thiết lập giá và điều kiện xuất bản khóa học</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="price">Giá khóa học (VND) *</Label>
                      <Input
                        id="price"
                        type="number"
                        value={courseData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        placeholder="599000"
                        className="border-blue-200 focus:border-blue-400"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="originalPrice">Giá gốc (VND)</Label>
                      <Input
                        id="originalPrice"
                        type="number"
                        value={courseData.originalPrice}
                        onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                        placeholder="799000"
                        className="border-blue-200 focus:border-blue-400"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Để trống nếu không có giá khuyến mãi
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3">Thông tin thu nhập</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Giá khóa học:</span>
                        <span className="font-medium">
                          {courseData.price ? parseInt(courseData.price).toLocaleString('vi-VN') + ' VND' : '0 VND'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Phí nền tảng (10%):</span>
                        <span className="text-red-600">
                          -{courseData.price ? (parseInt(courseData.price) * 0.1).toLocaleString('vi-VN') + ' VND' : '0 VND'}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-medium">
                        <span>Thu nhập của bạn:</span>
                        <span className="text-green-600">
                          {courseData.price ? (parseInt(courseData.price) * 0.9).toLocaleString('vi-VN') + ' VND' : '0 VND'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
              <CardHeader>
                <CardTitle>Xem trước khóa học</CardTitle>
                <CardDescription>Xem khóa học sẽ hiển thị như thế nào với học viên</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Course Preview Card */}
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="relative h-64 lg:h-auto">
                      {thumbnailPreview ? (
                        <ImageWithFallback
                          src={thumbnailPreview}
                          alt={courseData.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <Image className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">
                            {courseData.title || 'Tiêu đề khóa học'}
                          </h2>
                          <p className="text-gray-600 mt-2">
                            {courseData.shortDescription || 'Mô tả ngắn về khóa học'}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>0 học viên</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <BookOpen className="h-4 w-4" />
                            <span>{totalLessons} bài học</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>~{Math.round(estimatedDuration/60)} giờ</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {courseData.originalPrice && (
                            <span className="text-lg text-gray-500 line-through">
                              {parseInt(courseData.originalPrice).toLocaleString('vi-VN')} VND
                            </span>
                          )}
                          <span className="text-2xl font-bold text-blue-600">
                            {courseData.price ? parseInt(courseData.price).toLocaleString('vi-VN') + ' VND' : 'Miễn phí'}
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="font-medium">Bạn sẽ học được:</p>
                          <ul className="space-y-1">
                            {courseData.objectives.filter(obj => obj.trim()).map((objective, index) => (
                              <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                                <span className="text-green-500 mt-1">✓</span>
                                <span>{objective}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}