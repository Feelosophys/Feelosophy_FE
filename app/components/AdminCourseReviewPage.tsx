"use client"
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Search,
  Filter,
  Play,
  Calendar,
  Star,
  AlertCircle,
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

// Mock data cho khóa học chờ duyệt
const pendingCourses = [
  {
    id: 'pending-1',
    title: 'Mindfulness trong Cuộc sống Hiện đại',
    description: 'Khóa học về mindfulness và các kỹ thuật thiền định để giảm stress trong cuộc sống bận rộn',
    instructor: {
      id: 'teacher-1',
      name: 'Dr. Nguyễn Minh Anh',
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop',
      experience: '10 năm',
      rating: 4.8
    },
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    price: 649000,
    category: 'Thiền định',
    level: 'Người mới bắt đầu',
    totalLessons: 18,
    totalDuration: '6.5 giờ',
    submittedDate: '2024-12-20T10:30:00Z',
    status: 'pending',
    modules: [
      {
        title: 'Giới thiệu về Mindfulness',
        lessons: ['Khái niệm Mindfulness', 'Lợi ích của việc thực hành', 'Chuẩn bị cho hành trình']
      },
      {
        title: 'Kỹ thuật thở cơ bản',
        lessons: ['Thở ý thức', 'Thở bụng', 'Thở đếm số']
      }
    ],
    objectives: [
      'Hiểu rõ về khái niệm Mindfulness',
      'Thực hành các kỹ thuật thiền định cơ bản',
      'Áp dụng mindfulness vào cuộc sống hàng ngày'
    ]
  },
  {
    id: 'pending-2',
    title: 'Tâm lý Trẻ em và Phát triển Nhân cách',
    description: 'Khóa học chuyên sâu về tâm lý phát triển của trẻ em từ 0-12 tuổi',
    instructor: {
      id: 'teacher-2',
      name: 'Dr. Lê Thị Hương',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop',
      experience: '15 năm',
      rating: 4.9
    },
    thumbnail: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    price: 899000,
    category: 'Tâm lý trẻ em',
    level: 'Trung cấp',
    totalLessons: 24,
    totalDuration: '10.2 giờ',
    submittedDate: '2024-12-19T14:15:00Z',
    status: 'pending',
    modules: [
      {
        title: 'Phát triển tâm lý theo độ tuổi',
        lessons: ['0-2 tuổi', '3-5 tuổi', '6-8 tuổi', '9-12 tuổi']
      },
      {
        title: 'Các vấn đề tâm lý thường gặp',
        lessons: ['Lo lắng ở trẻ', 'Hành vi bướng bỉnh', 'Khó khăn trong học tập']
      }
    ],
    objectives: [
      'Nắm vững các giai đoạn phát triển tâm lý trẻ em',
      'Nhận biết các dấu hiệu bất thường',
      'Phương pháp hỗ trợ phát triển tích cực'
    ]
  },
  {
    id: 'rejected-1',
    title: 'Khóa học bị từ chối mẫu',
    description: 'Nội dung không đạt yêu cầu chất lượng',
    instructor: {
      id: 'teacher-3',
      name: 'Nguyễn Văn B',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
      experience: '2 năm',
      rating: 3.5
    },
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    price: 299000,
    category: 'Khác',
    level: 'Cơ bản',
    totalLessons: 8,
    totalDuration: '2.5 giờ',
    submittedDate: '2024-12-18T09:00:00Z',
    status: 'rejected',
    rejectionReason: 'Nội dung khóa học không đủ chất lượng và thiếu tính chuyên môn. Cần bổ sung thêm kiến thức chuyên sâu và cải thiện chất lượng video.',
    modules: [],
    objectives: []
  }
];

export function AdminCourseReviewPage() {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | null>(null);
  const [reviewNote, setReviewNote] = useState('');
  const [showReviewDialog, setShowReviewDialog] = useState(false);

  const filteredCourses = pendingCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.instructor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || course.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleReviewCourse = (course: any, action: 'approve' | 'reject') => {
    setSelectedCourse(course);
    setReviewAction(action);
    setShowReviewDialog(true);
  };

  const handleSubmitReview = () => {
    if (!selectedCourse || !reviewAction) return;
    
    console.log(`${reviewAction === 'approve' ? 'Approving' : 'Rejecting'} course:`, selectedCourse.id);
    console.log('Review note:', reviewNote);
    
    // Here you would typically make an API call to update the course status
    
    setShowReviewDialog(false);
    setSelectedCourse(null);
    setReviewAction(null);
    setReviewNote('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200"><Clock className="h-3 w-3 mr-1" />Chờ duyệt</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-700 border-green-200"><CheckCircle className="h-3 w-3 mr-1" />Đã duyệt</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700 border-red-200"><XCircle className="h-3 w-3 mr-1" />Từ chối</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/30 to-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Xét duyệt Khóa học</h1>
          <p className="text-gray-600">
            Quản lý và xét duyệt các khóa học được gửi bởi giảng viên
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6 bg-white/90 backdrop-blur-sm border-purple-100">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm theo tên khóa học hoặc giảng viên..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-purple-200 focus:border-purple-400"
                />
              </div>
              <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                <Filter className="h-4 w-4 mr-2" />
                Bộ lọc
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm border border-purple-100">
            <TabsTrigger value="pending" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
              Chờ duyệt ({pendingCourses.filter(c => c.status === 'pending').length})
            </TabsTrigger>
            <TabsTrigger value="approved" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
              Đã duyệt (0)
            </TabsTrigger>
            <TabsTrigger value="rejected" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
              Từ chối ({pendingCourses.filter(c => c.status === 'rejected').length})
            </TabsTrigger>
            <TabsTrigger value="all" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
              Tất cả ({pendingCourses.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredCourses.length === 0 ? (
              <Card className="bg-white/90 backdrop-blur-sm border-purple-100">
                <CardContent className="p-12 text-center">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Không có khóa học nào</h3>
                  <p className="text-gray-600">
                    {searchQuery ? 'Không tìm thấy khóa học phù hợp với từ khóa tìm kiếm.' : 'Chưa có khóa học nào trong danh mục này.'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredCourses.map((course) => (
                  <Card key={course.id} className="bg-white/90 backdrop-blur-sm border-purple-100 overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <ImageWithFallback
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        {getStatusBadge(course.status)}
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-white/90">
                          {course.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                            {course.title}
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-3">{course.description}</p>
                        </div>

                        {/* Instructor Info */}
                        <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                          <ImageWithFallback
                            src={course.instructor.avatar}
                            alt={course.instructor.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{course.instructor.name}</p>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <span>{course.instructor.experience}</span>
                              <span>•</span>
                              <div className="flex items-center">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                                <span>{course.instructor.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Course Details */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
                            <div className="flex items-center text-gray-600">
                              <Play className="h-4 w-4 mr-2" />
                              {course.totalLessons} bài học
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Clock className="h-4 w-4 mr-2" />
                              {course.totalDuration}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-gray-600">
                              Trình độ: <span className="font-medium">{course.level}</span>
                            </div>
                            <div className="text-gray-600">
                              Giá: <span className="font-bold text-green-600">{formatCurrency(course.price)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-xs text-gray-500">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          Gửi duyệt: {formatDate(course.submittedDate)}
                        </div>

                        {/* Rejection Reason */}
                        {course.status === 'rejected' && course.rejectionReason && (
                          <Alert className="border-red-200 bg-red-50">
                            <XCircle className="h-4 w-4 text-red-600" />
                            <AlertDescription className="text-red-700 text-sm">
                              <strong>Lý do từ chối:</strong> {course.rejectionReason}
                            </AlertDescription>
                          </Alert>
                        )}

                        {/* Action Buttons */}
                        <div className="flex space-x-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 border-purple-200 text-purple-700 hover:bg-purple-50"
                            onClick={() => setSelectedCourse(course)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Xem chi tiết
                          </Button>
                          
                          {course.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleReviewCourse(course, 'approve')}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Duyệt
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleReviewCourse(course, 'reject')}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Từ chối
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Course Detail Modal */}
        {selectedCourse && !showReviewDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto bg-white">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{selectedCourse.title}</CardTitle>
                    <CardDescription>Chi tiết khóa học</CardDescription>
                  </div>
                  <Button variant="ghost" onClick={() => setSelectedCourse(null)}>
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <ImageWithFallback
                        src={selectedCourse.thumbnail}
                        alt={selectedCourse.title}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Mục tiêu khóa học:</h4>
                        <ul className="space-y-1">
                          {selectedCourse.objectives.map((objective: string, index: number) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              {objective}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Nội dung khóa học:</h4>
                        <div className="space-y-2">
                          {selectedCourse.modules.map((module: any, index: number) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-lg">
                              <h5 className="font-medium text-sm">{module.title}</h5>
                              <ul className="mt-2 space-y-1">
                                {module.lessons.map((lesson: string, lessonIndex: number) => (
                                  <li key={lessonIndex} className="text-xs text-gray-600 ml-4">
                                    • {lesson}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Review Dialog */}
        {showReviewDialog && selectedCourse && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md bg-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  {reviewAction === 'approve' ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 mr-2" />
                  )}
                  {reviewAction === 'approve' ? 'Duyệt khóa học' : 'Từ chối khóa học'}
                </CardTitle>
                <CardDescription>
                  {selectedCourse.title}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">
                    {reviewAction === 'approve' ? 'Ghi chú phê duyệt:' : 'Lý do từ chối:'}
                  </label>
                  <Textarea
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    placeholder={reviewAction === 'approve' 
                      ? 'Ghi chú cho giảng viên (tùy chọn)...' 
                      : 'Vui lòng nêu rõ lý do từ chối để giảng viên có thể cải thiện...'
                    }
                    className="mt-2"
                    rows={4}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowReviewDialog(false)}
                  >
                    Hủy
                  </Button>
                  <Button
                    className={`flex-1 ${reviewAction === 'approve' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                    }`}
                    onClick={handleSubmitReview}
                  >
                    {reviewAction === 'approve' ? 'Duyệt khóa học' : 'Từ chối'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}