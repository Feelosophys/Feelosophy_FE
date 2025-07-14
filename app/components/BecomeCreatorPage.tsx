"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { 
  ArrowLeft,
  Upload,
  FileText,
  User,
  GraduationCap,
  Award,
  CheckCircle,
  AlertCircle,
  Camera,
  Link as LinkIcon,
  Star,
  Clock,
  Users,
  Briefcase
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface BecomeCreatorPageProps {
  onBack: () => void;
  currentUser: any;
}

const creatorTypes = [
  {
    id: 'teacher',
    name: 'Giảng viên',
    icon: GraduationCap,
    description: 'Tạo và bán khóa học trực tuyến',
    benefits: [
      'Tạo và quản lý khóa học',
      'Nhận doanh thu từ bán khóa học',
      'Công cụ phân tích học viên',
      'Hỗ trợ marketing khóa học'
    ],
    requirements: [
      'Bằng cấp chuyên môn liên quan',
      'Kinh nghiệm giảng dạy/đào tạo',
      'Mẫu bài giảng demo'
    ]
  },
  {
    id: 'expert',
    name: 'Chuyên gia tư vấn',
    icon: User,
    description: 'Cung cấp dịch vụ tư vấn 1-1',
    benefits: [
      'Tư vấn trực tuyến 1-1',
      'Đặt lịch và quản lý cuộc hẹn',
      'Thu phí tư vấn',
      'Xây dựng danh tiếng chuyên môn'
    ],
    requirements: [
      'Chứng chỉ chuyên môn',
      'Kinh nghiệm tư vấn thực tế',
      'Hồ sơ năng lực'
    ]
  }
];

const categories = [
  'Tâm lý học ứng dụng',
  'Tâm lý trẻ em',
  'Tâm lý gia đình',
  'Stress và lo âu',
  'Thiền định',
  'Phát triển bản thân',
  'Tâm lý công việc',
  'Khác'
];

export function BecomeCreatorPage({ onBack, currentUser }: BecomeCreatorPageProps) {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string>('');
  const [formData, setFormData] = useState({
    // Basic info
    fullName: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '',
    bio: '',
    
    // Professional info
    profession: '',
    experience: '',
    education: '',
    specialization: [] as string[],
    
    // Documents
    cv: null as File | null,
    certificates: [] as File[],
    portfolio: null as File | null,
    avatar: null as File | null,
    
    // Additional info
    website: '',
    linkedin: '',
    achievements: '',
    whyJoin: '',
    sampleWork: null as File | null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(currentUser?.avatar || null);

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleFileUpload = (field: string, file: File | null) => {
    handleInputChange(field, file);
    
    if (field === 'avatar' && file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSpecializationToggle = (category: string) => {
    const current = formData.specialization;
    if (current.includes(category)) {
      handleInputChange('specialization', current.filter(item => item !== category));
    } else {
      handleInputChange('specialization', [...current, category]);
    }
  };

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (stepNumber) {
      case 1:
        if (!selectedType) {
          newErrors.type = 'Vui lòng chọn loại tài khoản';
        }
        break;
      case 2:
        if (!formData.fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ tên';
        if (!formData.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại';
        if (!formData.bio.trim()) newErrors.bio = 'Vui lòng nhập giới thiệu về bản thân';
        break;
      case 3:
        if (!formData.profession.trim()) newErrors.profession = 'Vui lòng nhập nghề nghiệp';
        if (!formData.experience.trim()) newErrors.experience = 'Vui lòng nhập kinh nghiệm';
        if (!formData.education.trim()) newErrors.education = 'Vui lòng nhập học vấn';
        if (formData.specialization.length === 0) newErrors.specialization = 'Vui lòng chọn ít nhất 1 chuyên môn';
        break;
      case 4:
        if (!formData.cv) newErrors.cv = 'Vui lòng tải lên CV';
        if (!formData.whyJoin.trim()) newErrors.whyJoin = 'Vui lòng nhập lý do tham gia';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleSubmit = () => {
    if (!validateStep(step)) return;
    
    const applicationData = {
      ...formData,
      creatorType: selectedType,
      userId: currentUser?.id,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };
    
    console.log('Submitting creator application:', applicationData);
    
    // Here you would typically make an API call
    alert('Đơn đăng ký đã được gửi thành công! Chúng tôi sẽ xem xét và phản hồi trong vòng 3-5 ngày làm việc.');
    onBack();
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Chọn loại tài khoản</h2>
              <p className="text-gray-600">Bạn muốn trở thành loại người sáng tạo nào?</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {creatorTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.id;
                
                return (
                  <Card 
                    key={type.id} 
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedType(type.id)}
                  >
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-3 rounded-full ${
                            isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                          }`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{type.name}</h3>
                            <p className="text-gray-600 text-sm">{type.description}</p>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Lợi ích:</h4>
                          <ul className="space-y-1">
                            {type.benefits.map((benefit, index) => (
                              <li key={index} className="text-sm text-gray-600 flex items-center">
                                <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Yêu cầu:</h4>
                          <ul className="space-y-1">
                            {type.requirements.map((req, index) => (
                              <li key={index} className="text-sm text-gray-600 flex items-center">
                                <AlertCircle className="h-3 w-3 text-orange-500 mr-2" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {errors.type && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">{errors.type}</AlertDescription>
              </Alert>
            )}
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Thông tin cá nhân</h2>
              <p className="text-gray-600">Cung cấp thông tin cơ bản về bản thân</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 flex justify-center">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {avatarPreview ? (
                      <ImageWithFallback
                        src={avatarPreview}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute -bottom-2 -right-2 rounded-full p-2 h-8 w-8"
                    onClick={() => document.getElementById('avatar-upload')?.click()}
                  >
                    <Camera className="h-3 w-3" />
                  </Button>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('avatar', e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="fullName">Họ và tên *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className={`mt-1 ${errors.fullName ? 'border-red-300' : ''}`}
                />
                {errors.fullName && <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>}
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="mt-1 bg-gray-50"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Số điện thoại *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`mt-1 ${errors.phone ? 'border-red-300' : ''}`}
                />
                {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
              </div>
              
              <div>
                <Label htmlFor="website">Website (tùy chọn)</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="mt-1"
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="bio">Giới thiệu về bản thân *</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Hãy viết một đoạn giới thiệu ngắn về bản thân, kinh nghiệm và passion của bạn..."
                  className={`mt-1 ${errors.bio ? 'border-red-300' : ''}`}
                  rows={4}
                />
                {errors.bio && <p className="text-red-600 text-sm mt-1">{errors.bio}</p>}
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Thông tin chuyên môn</h2>
              <p className="text-gray-600">Chia sẻ về kinh nghiệm và chuyên môn của bạn</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="profession">Nghề nghiệp hiện tại *</Label>
                <Input
                  id="profession"
                  value={formData.profession}
                  onChange={(e) => handleInputChange('profession', e.target.value)}
                  placeholder="VD: Bác sĩ tâm lý, Chuyên viên tư vấn..."
                  className={`mt-1 ${errors.profession ? 'border-red-300' : ''}`}
                />
                {errors.profession && <p className="text-red-600 text-sm mt-1">{errors.profession}</p>}
              </div>
              
              <div>
                <Label htmlFor="experience">Kinh nghiệm (năm) *</Label>
                <Select value={formData.experience} onValueChange={(value) => handleInputChange('experience', value)}>
                  <SelectTrigger className={`mt-1 ${errors.experience ? 'border-red-300' : ''}`}>
                    <SelectValue placeholder="Chọn số năm kinh nghiệm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-2">1-2 năm</SelectItem>
                    <SelectItem value="3-5">3-5 năm</SelectItem>
                    <SelectItem value="6-10">6-10 năm</SelectItem>
                    <SelectItem value="10+">Trên 10 năm</SelectItem>
                  </SelectContent>
                </Select>
                {errors.experience && <p className="text-red-600 text-sm mt-1">{errors.experience}</p>}
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="education">Học vấn và bằng cấp *</Label>
                <Textarea
                  id="education"
                  value={formData.education}
                  onChange={(e) => handleInputChange('education', e.target.value)}
                  placeholder="VD: Thạc sĩ Tâm lý học - Đại học Y Hà Nội (2018)..."
                  className={`mt-1 ${errors.education ? 'border-red-300' : ''}`}
                  rows={3}
                />
                {errors.education && <p className="text-red-600 text-sm mt-1">{errors.education}</p>}
              </div>
              
              <div className="md:col-span-2">
                <Label>Lĩnh vực chuyên môn *</Label>
                <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                  {categories.map((category) => (
                    <div
                      key={category}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        formData.specialization.includes(category)
                          ? 'bg-blue-50 border-blue-200 text-blue-700'
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => handleSpecializationToggle(category)}
                    >
                      <div className="text-sm font-medium">{category}</div>
                    </div>
                  ))}
                </div>
                {errors.specialization && <p className="text-red-600 text-sm mt-1">{errors.specialization}</p>}
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="achievements">Thành tựu và giải thưởng (tùy chọn)</Label>
                <Textarea
                  id="achievements"
                  value={formData.achievements}
                  onChange={(e) => handleInputChange('achievements', e.target.value)}
                  placeholder="Các giải thưởng, chứng nhận, thành tựu đáng chú ý..."
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Tài liệu xác thực</h2>
              <p className="text-gray-600">Tải lên các tài liệu để xác thực năng lực chuyên môn</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label>CV/Resume *</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileUpload('cv', e.target.files?.[0] || null)}
                    className="hidden"
                    id="cv-upload"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('cv-upload')?.click()}
                    className="mb-2"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Tải lên CV
                  </Button>
                  <p className="text-sm text-gray-600">PDF, DOC, DOCX (tối đa 10MB)</p>
                  {formData.cv && (
                    <p className="text-sm text-green-600 mt-2">
                      <FileText className="h-4 w-4 inline mr-1" />
                      {formData.cv.name}
                    </p>
                  )}
                </div>
                {errors.cv && <p className="text-red-600 text-sm mt-1">{errors.cv}</p>}
              </div>
              
              <div className="md:col-span-2">
                <Label>Chứng chỉ chuyên môn (tùy chọn)</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      handleInputChange('certificates', files);
                    }}
                    className="hidden"
                    id="certificates-upload"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('certificates-upload')?.click()}
                    className="mb-2"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Tải lên chứng chỉ
                  </Button>
                  <p className="text-sm text-gray-600">PDF, JPG, PNG (tối đa 5MB mỗi file)</p>
                  {formData.certificates.length > 0 && (
                    <div className="mt-2">
                      {formData.certificates.map((file, index) => (
                        <p key={index} className="text-sm text-green-600">
                          <FileText className="h-4 w-4 inline mr-1" />
                          {file.name}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {selectedType === 'teacher' && (
                <div className="md:col-span-2">
                  <Label>Mẫu bài giảng/Portfolio (khuyến khích)</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      accept=".pdf,.ppt,.pptx,.mp4,.mov"
                      onChange={(e) => handleFileUpload('sampleWork', e.target.files?.[0] || null)}
                      className="hidden"
                      id="sample-upload"
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('sample-upload')?.click()}
                      className="mb-2"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Tải lên mẫu bài giảng
                    </Button>
                    <p className="text-sm text-gray-600">PDF, PPT, MP4, MOV (tối đa 50MB)</p>
                    {formData.sampleWork && (
                      <p className="text-sm text-green-600 mt-2">
                        <FileText className="h-4 w-4 inline mr-1" />
                        {formData.sampleWork.name}
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              <div className="md:col-span-2">
                <Label htmlFor="whyJoin">Tại sao bạn muốn tham gia Feelosophy? *</Label>
                <Textarea
                  id="whyJoin"
                  value={formData.whyJoin}
                  onChange={(e) => handleInputChange('whyJoin', e.target.value)}
                  placeholder="Chia sẻ động lực và mục tiêu của bạn khi tham gia nền tảng..."
                  className={`mt-1 ${errors.whyJoin ? 'border-red-300' : ''}`}
                  rows={4}
                />
                {errors.whyJoin && <p className="text-red-600 text-sm mt-1">{errors.whyJoin}</p>}
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Trở thành Người sáng tạo</h1>
              <p className="text-gray-600">Chia sẻ kiến thức và kiếm thu nhập từ chuyên môn của bạn</p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <Card className="mb-8 bg-white/90 backdrop-blur-sm border-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">Bước {step} / {totalSteps}</span>
              <span className="text-sm font-medium text-blue-600">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Chọn loại</span>
              <span>Thông tin cá nhân</span>
              <span>Chuyên môn</span>
              <span>Tài liệu</span>
            </div>
          </CardContent>
        </Card>

        {/* Form Content */}
        <Card className="mb-8 bg-white/90 backdrop-blur-sm border-blue-100">
          <CardContent className="p-8">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => step > 1 ? setStep(step - 1) : onBack()}
            disabled={step === 1}
          >
            {step === 1 ? 'Hủy' : 'Quay lại'}
          </Button>
          
          {step < totalSteps ? (
            <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
              Tiếp theo
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="h-4 w-4 mr-2" />
              Gửi đơn đăng ký
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}