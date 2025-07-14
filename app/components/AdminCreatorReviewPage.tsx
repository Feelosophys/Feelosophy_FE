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
  Download,
  User,
  GraduationCap,
  Calendar,
  Star,
  AlertCircle,
  FileText,
  ExternalLink,
  Mail,
  Phone
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

// Mock data cho đơn đăng ký
const creatorApplications = [
  {
    id: 'app-1',
    user: {
      id: 'user-1',
      name: 'Dr. Trần Văn Nam',
      email: 'trannam@email.com',
      phone: '+84 901 234 567',
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop',
      currentRole: 'patient'
    },
    creatorType: 'expert',
    submittedDate: '2024-12-20T09:15:00Z',
    status: 'pending',
    personalInfo: {
      bio: 'Tôi là bác sĩ tâm lý với 12 năm kinh nghiệm trong lĩnh vực tư vấn tâm lý gia đình và trẻ em. Tôi mong muốn chia sẻ kiến thức và hỗ trợ nhiều người hơn thông qua nền tảng trực tuyến.',
      website: 'https://drtrannam.com',
      linkedin: 'linkedin.com/in/drtrannam'
    },
    professionalInfo: {
      profession: 'Bác sĩ Tâm lý học',
      experience: '10+',
      education: 'Tiến sĩ Tâm lý học - Đại học Y Hà Nội (2012)\nThạc sĩ Tâm lý lâm sàng - Đại học Quốc gia (2008)',
      specialization: ['Tâm lý gia đình', 'Tâm lý trẻ em', 'Stress và lo âu'],
      achievements: 'Giải thưởng "Bác sĩ xuất sắc" năm 2020\nChứng chỉ CBT (Cognitive Behavioral Therapy)\nTác giả 2 cuốn sách về tâm lý gia đình'
    },
    documents: {
      cv: 'CV_DrTranVanNam.pdf',
      certificates: ['Certificate_Psychology.pdf', 'CBT_Certification.jpg'],
      portfolio: null
    },
    whyJoin: 'Tôi muốn mở rộng khả năng hỗ trợ cộng đồng thông qua công nghệ. Với kinh nghiệm 12 năm, tôi tin có thể giúp nhiều người giải quyết các vấn đề tâm lý một cách hiệu quả và tiện lợi.',
    reviewNotes: ''
  },
  {
    id: 'app-2',
    user: {
      id: 'user-2',
      name: 'Nguyễn Thị Lan',
      email: 'nguyenlan@email.com',
      phone: '+84 902 345 678',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop',
      currentRole: 'patient'
    },
    creatorType: 'teacher',
    submittedDate: '2024-12-19T16:30:00Z',
    status: 'pending',
    personalInfo: {
      bio: 'Tôi là giảng viên tại Đại học Sư phạm với 8 năm kinh nghiệm giảng dạy về tâm lý học ứng dụng. Tôi đam mê tạo ra những khóa học trực tuyến chất lượng cao.',
      website: 'https://teacherlan.edu.vn',
      linkedin: ''
    },
    professionalInfo: {
      profession: 'Giảng viên Đại học',
      experience: '6-10',
      education: 'Thạc sĩ Tâm lý học - Đại học Sư phạm Hà Nội (2016)\nCử nhân Tâm lý học - Đại học Sư phạm Hà Nội (2014)',
      specialization: ['Tâm lý học ứng dụng', 'Phát triển bản thân', 'Tâm lý công việc'],
      achievements: 'Giảng viên xuất sắc năm 2022\nChứng chỉ đào tạo trực tuyến\n5 năm kinh nghiệm tạo nội dung e-learning'
    },
    documents: {
      cv: 'CV_NguyenThiLan.pdf',
      certificates: ['Teaching_Certificate.pdf'],
      portfolio: 'Sample_Course_Material.pptx'
    },
    whyJoin: 'Tôi muốn đưa kiến thức tâm lý học đến gần hơn với mọi người thông qua các khóa học trực tuyến. Với kinh nghiệm giảng dạy và tạo nội dung, tôi tin có thể tạo ra những khóa học hữu ích và dễ hiểu.',
    reviewNotes: ''
  },
  {
    id: 'app-3',
    user: {
      id: 'user-3',
      name: 'Lê Văn Hòa',
      email: 'levanhoa@email.com',
      phone: '+84 903 456 789',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
      currentRole: 'patient'
    },
    creatorType: 'teacher',
    submittedDate: '2024-12-18T11:45:00Z',
    status: 'rejected',
    personalInfo: {
      bio: 'Tôi quan tâm đến tâm lý học và muốn chia sẻ kiến thức.',
      website: '',
      linkedin: ''
    },
    professionalInfo: {
      profession: 'Nhân viên văn phòng',
      experience: '1-2',
      education: 'Cử nhân Kinh tế',
      specialization: ['Phát triển bản thân'],
      achievements: ''
    },
    documents: {
      cv: 'CV_LeVanHoa.pdf',
      certificates: [],
      portfolio: null
    },
    whyJoin: 'Tôi muốn kiếm thêm thu nhập.',
    reviewNotes: 'Ứng viên chưa có đủ kinh nghiệm và chuyên môn trong lĩnh vực tâm lý học. Cần có bằng cấp và kinh nghiệm chuyên môn liên quan.',
    rejectedDate: '2024-12-19T10:30:00Z',
    rejectedBy: 'Admin System'
  }
];

export function AdminCreatorReviewPage() {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | null>(null);
  const [reviewNote, setReviewNote] = useState('');
  const [showReviewDialog, setShowReviewDialog] = useState(false);

  const filteredApplications = creatorApplications.filter(app => {
    const matchesSearch = app.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || app.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleReviewApplication = (application: any, action: 'approve' | 'reject') => {
    setSelectedApplication(application);
    setReviewAction(action);
    setReviewNote(application.reviewNotes || '');
    setShowReviewDialog(true);
  };

  const handleSubmitReview = () => {
    if (!selectedApplication || !reviewAction) return;
    
    console.log(`${reviewAction === 'approve' ? 'Approving' : 'Rejecting'} application:`, selectedApplication.id);
    console.log('Review note:', reviewNote);
    
    // Here you would typically make an API call to update the application status
    
    setShowReviewDialog(false);
    setSelectedApplication(null);
    setReviewAction(null);
    setReviewNote('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200"><Clock className="h-3 w-3 mr-1" />Chờ xét duyệt</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-700 border-green-200"><CheckCircle className="h-3 w-3 mr-1" />Đã duyệt</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700 border-red-200"><XCircle className="h-3 w-3 mr-1" />Từ chối</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getCreatorTypeBadge = (type: string) => {
    switch (type) {
      case 'teacher':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200"><GraduationCap className="h-3 w-3 mr-1" />Giảng viên</Badge>;
      case 'expert':
        return <Badge className="bg-purple-100 text-purple-700 border-purple-200"><User className="h-3 w-3 mr-1" />Chuyên gia</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/30 to-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Xét duyệt Đơn đăng ký</h1>
          <p className="text-gray-600">
            Quản lý và xét duyệt các đơn đăng ký trở thành giảng viên/chuyên gia
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6 bg-white/90 backdrop-blur-sm border-purple-100">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm theo tên hoặc email..."
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
              Chờ xét duyệt ({creatorApplications.filter(a => a.status === 'pending').length})
            </TabsTrigger>
            <TabsTrigger value="approved" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
              Đã duyệt (0)
            </TabsTrigger>
            <TabsTrigger value="rejected" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
              Từ chối ({creatorApplications.filter(a => a.status === 'rejected').length})
            </TabsTrigger>
            <TabsTrigger value="all" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
              Tất cả ({creatorApplications.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredApplications.length === 0 ? (
              <Card className="bg-white/90 backdrop-blur-sm border-purple-100">
                <CardContent className="p-12 text-center">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Không có đơn đăng ký nào</h3>
                  <p className="text-gray-600">
                    {searchQuery ? 'Không tìm thấy đơn đăng ký phù hợp với từ khóa tìm kiếm.' : 'Chưa có đơn đăng ký nào trong danh mục này.'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredApplications.map((application) => (
                  <Card key={application.id} className="bg-white/90 backdrop-blur-sm border-purple-100 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        {/* Avatar */}
                        <ImageWithFallback
                          src={application.user.avatar}
                          alt={application.user.name}
                          className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                        />
                        
                        {/* Main Content */}
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-bold text-lg text-gray-900">{application.user.name}</h3>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Mail className="h-3 w-3" />
                                <span>{application.user.email}</span>
                                <span>•</span>
                                <Phone className="h-3 w-3" />
                                <span>{application.user.phone}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getStatusBadge(application.status)}
                              {getCreatorTypeBadge(application.creatorType)}
                            </div>
                          </div>
                          
                          {/* Professional Info */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">Nghề nghiệp:</span>
                              <p className="text-gray-600">{application.professionalInfo.profession}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Kinh nghiệm:</span>
                              <p className="text-gray-600">{application.professionalInfo.experience} năm</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Chuyên môn:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {application.professionalInfo.specialization.slice(0, 2).map((spec, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {spec}
                                  </Badge>
                                ))}
                                {application.professionalInfo.specialization.length > 2 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{application.professionalInfo.specialization.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Bio Preview */}
                          <div className="text-sm">
                            <span className="font-medium text-gray-700">Giới thiệu:</span>
                            <p className="text-gray-600 line-clamp-2 mt-1">{application.personalInfo.bio}</p>
                          </div>
                          
                          {/* Submission Info */}
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              Gửi đơn: {formatDate(application.submittedDate)}
                            </div>
                            {application.status === 'rejected' && application.rejectedDate && (
                              <div className="text-red-500">
                                Từ chối: {formatDate(application.rejectedDate)}
                              </div>
                            )}
                          </div>

                          {/* Rejection Reason */}
                          {application.status === 'rejected' && application.reviewNotes && (
                            <Alert className="border-red-200 bg-red-50">
                              <XCircle className="h-4 w-4 text-red-600" />
                              <AlertDescription className="text-red-700 text-sm">
                                <strong>Lý do từ chối:</strong> {application.reviewNotes}
                              </AlertDescription>
                            </Alert>
                          )}
                          
                          {/* Action Buttons */}
                          <div className="flex space-x-2 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-purple-200 text-purple-700 hover:bg-purple-50"
                              onClick={() => setSelectedApplication(application)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Xem chi tiết
                            </Button>
                            
                            {application.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleReviewApplication(application, 'approve')}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Phê duyệt
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleReviewApplication(application, 'reject')}
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Từ chối
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Application Detail Modal */}
        {selectedApplication && !showReviewDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-6xl max-h-[90vh] overflow-auto bg-white">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Chi tiết đơn đăng ký</CardTitle>
                    <CardDescription>{selectedApplication.user.name}</CardDescription>
                  </div>
                  <Button variant="ghost" onClick={() => setSelectedApplication(null)}>
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Personal Info */}
                    <div>
                      <h3 className="font-bold text-lg mb-4">Thông tin cá nhân</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <ImageWithFallback
                            src={selectedApplication.user.avatar}
                            alt={selectedApplication.user.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div>
                            <h4 className="font-medium">{selectedApplication.user.name}</h4>
                            <p className="text-sm text-gray-600">{selectedApplication.user.email}</p>
                            <p className="text-sm text-gray-600">{selectedApplication.user.phone}</p>
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="font-medium mb-2">Giới thiệu:</h5>
                          <p className="text-gray-600 text-sm">{selectedApplication.personalInfo.bio}</p>
                        </div>
                        
                        {selectedApplication.personalInfo.website && (
                          <div>
                            <h5 className="font-medium mb-2">Website:</h5>
                            <a 
                              href={selectedApplication.personalInfo.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-sm flex items-center"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              {selectedApplication.personalInfo.website}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Professional Info */}
                    <div>
                      <h3 className="font-bold text-lg mb-4">Thông tin chuyên môn</h3>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-sm">Nghề nghiệp:</h5>
                            <p className="text-gray-600 text-sm">{selectedApplication.professionalInfo.profession}</p>
                          </div>
                          <div>
                            <h5 className="font-medium text-sm">Kinh nghiệm:</h5>
                            <p className="text-gray-600 text-sm">{selectedApplication.professionalInfo.experience} năm</p>
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="font-medium mb-2">Học vấn:</h5>
                          <p className="text-gray-600 text-sm whitespace-pre-line">{selectedApplication.professionalInfo.education}</p>
                        </div>
                        
                        <div>
                          <h5 className="font-medium mb-2">Chuyên môn:</h5>
                          <div className="flex flex-wrap gap-1">
                            {selectedApplication.professionalInfo.specialization.map((spec, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {spec}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        {selectedApplication.professionalInfo.achievements && (
                          <div>
                            <h5 className="font-medium mb-2">Thành tựu:</h5>
                            <p className="text-gray-600 text-sm whitespace-pre-line">{selectedApplication.professionalInfo.achievements}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Documents */}
                    <div>
                      <h3 className="font-bold text-lg mb-4">Tài liệu đính kèm</h3>
                      <div className="space-y-3">
                        <div>
                          <h5 className="font-medium mb-2">CV/Resume:</h5>
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            {selectedApplication.documents.cv}
                            <Download className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                        
                        {selectedApplication.documents.certificates.length > 0 && (
                          <div>
                            <h5 className="font-medium mb-2">Chứng chỉ:</h5>
                            <div className="space-y-1">
                              {selectedApplication.documents.certificates.map((cert, index) => (
                                <Button key={index} variant="outline" size="sm" className="block text-left">
                                  <FileText className="h-4 w-4 mr-2" />
                                  {cert}
                                  <Download className="h-4 w-4 ml-2" />
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {selectedApplication.documents.portfolio && (
                          <div>
                            <h5 className="font-medium mb-2">Portfolio/Mẫu bài giảng:</h5>
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4 mr-2" />
                              {selectedApplication.documents.portfolio}
                              <Download className="h-4 w-4 ml-2" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Why Join */}
                    <div>
                      <h3 className="font-bold text-lg mb-4">Lý do tham gia</h3>
                      <p className="text-gray-600 text-sm">{selectedApplication.whyJoin}</p>
                    </div>
                    
                    {/* Application Info */}
                    <div>
                      <h3 className="font-bold text-lg mb-4">Thông tin đơn</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Loại đăng ký:</span>
                          <span className="font-medium">
                            {selectedApplication.creatorType === 'teacher' ? 'Giảng viên' : 'Chuyên gia'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ngày gửi:</span>
                          <span className="font-medium">{formatDate(selectedApplication.submittedDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Trạng thái:</span>
                          <span>{getStatusBadge(selectedApplication.status)}</span>
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
        {showReviewDialog && selectedApplication && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md bg-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  {reviewAction === 'approve' ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 mr-2" />
                  )}
                  {reviewAction === 'approve' ? 'Phê duyệt đơn đăng ký' : 'Từ chối đơn đăng ký'}
                </CardTitle>
                <CardDescription>
                  {selectedApplication.user.name} - {selectedApplication.creatorType === 'teacher' ? 'Giảng viên' : 'Chuyên gia'}
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
                      ? 'Ghi chú cho ứng viên (tùy chọn)...' 
                      : 'Vui lòng nêu rõ lý do từ chối để ứng viên có thể cải thiện...'
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
                    {reviewAction === 'approve' ? 'Phê duyệt' : 'Từ chối'}
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