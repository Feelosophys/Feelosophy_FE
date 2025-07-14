"use client"

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { 
  ArrowLeft, 
  Building2, 
  Users, 
  Calculator, 
  FileText, 
  Upload, 
  Check, 
  Star,
  Shield,
  Clock,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  DollarSign,
  TrendingUp,
  Award,
  Target,
  Globe,
  CheckCircle,
  AlertCircle,
  Download
} from 'lucide-react';
import { mockCourses } from '../data/mockData';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CorporatePurchasePageProps {
  courseId: string;
  onBack: () => void;
}

export function CorporatePurchasePage({ courseId, onBack }: CorporatePurchasePageProps) {
  const course = mockCourses.find(c => c.id === courseId);
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    position: '',
    email: '',
    phone: '',
    companySize: '',
    industry: '',
    numberOfUsers: 10,
    budget: '',
    timeline: '',
    requirements: '',
    useCase: '',
    address: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Không tìm thấy khóa học</h2>
          <Button onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(price);
  };

  const calculateCorporatePrice = () => {
    const basePrice = course.price;
    const userCount = formData.numberOfUsers;
    
    // Corporate pricing tiers
    let discount = 0;
    if (userCount >= 100) discount = 0.4; // 40% discount for 100+ users
    else if (userCount >= 50) discount = 0.3; // 30% discount for 50-99 users
    else if (userCount >= 20) discount = 0.2; // 20% discount for 20-49 users
    else if (userCount >= 10) discount = 0.15; // 15% discount for 10-19 users
    
    const totalPrice = basePrice * userCount * (1 - discount);
    const savings = basePrice * userCount - totalPrice;
    
    return { totalPrice, savings, discount, perUser: totalPrice / userCount };
  };

  const { totalPrice, savings, discount, perUser } = calculateCorporatePrice();

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const isStepComplete = (step: number) => {
    switch (step) {
      case 1:
        return formData.companyName && formData.contactName && formData.email && formData.phone;
      case 2:
        return formData.companySize && formData.industry && formData.numberOfUsers >= 10;
      case 3:
        return formData.useCase && formData.requirements;
      case 4:
        return true;
      default:
        return false;
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
        <Card className="max-w-2xl w-full">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Yêu cầu đã được gửi thành công!
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Cảm ơn bạn đã quan tâm đến gói doanh nghiệp của chúng tôi. 
              Đội ngũ tư vấn sẽ liên hệ với bạn trong vòng 24 giờ.
            </p>
            <div className="bg-blue-50 p-6 rounded-lg mb-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Thông tin yêu cầu của bạn:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700 font-medium">Khóa học:</span>
                  <div className="text-blue-900">{course.title}</div>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Số lượng người dùng:</span>
                  <div className="text-blue-900">{formData.numberOfUsers} người</div>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Công ty:</span>
                  <div className="text-blue-900">{formData.companyName}</div>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Giá ước tính:</span>
                  <div className="text-blue-900 font-bold">{formatPrice(totalPrice)}</div>
                </div>
              </div>
            </div>
            <div className="flex space-x-4 justify-center">
              <Button onClick={onBack} variant="outline" size="lg">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại khóa học
              </Button>
              <Button size="lg">
                <Mail className="h-4 w-4 mr-2" />
                Kiểm tra email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button onClick={onBack} variant="ghost" size="lg">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Quay lại khóa học
          </Button>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 px-4 py-2">
            <Building2 className="h-4 w-4 mr-2" />
            Gói Doanh Nghiệp
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Indicator */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Bước {currentStep}/4</h3>
                  <span className="text-sm text-gray-600">{Math.round((currentStep / 4) * 100)}% hoàn thành</span>
                </div>
                <Progress value={(currentStep / 4) * 100} className="mb-4" />
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className={`text-center ${currentStep >= 1 ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
                    Thông tin liên hệ
                  </div>
                  <div className={`text-center ${currentStep >= 2 ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
                    Thông tin công ty
                  </div>
                  <div className={`text-center ${currentStep >= 3 ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
                    Yêu cầu chi tiết
                  </div>
                  <div className={`text-center ${currentStep >= 4 ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
                    Tài liệu & Xác nhận
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Form Steps */}
            <form onSubmit={handleSubmit}>
              {/* Step 1: Contact Information */}
              {currentStep === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Phone className="h-5 w-5 text-blue-600" />
                      <span>Thông tin liên hệ</span>
                    </CardTitle>
                    <CardDescription>
                      Vui lòng cung cấp thông tin liên hệ của người đại diện
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="contactName">Họ và tên *</Label>
                        <Input
                          id="contactName"
                          value={formData.contactName}
                          onChange={(e) => handleInputChange('contactName', e.target.value)}
                          placeholder="Nguyễn Văn A"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="position">Chức vụ *</Label>
                        <Input
                          id="position"
                          value={formData.position}
                          onChange={(e) => handleInputChange('position', e.target.value)}
                          placeholder="Giám đốc Nhân sự"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="nguyen.vana@company.com"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Số điện thoại *</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="0901 234 567"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="companyName">Tên công ty *</Label>
                      <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        placeholder="Công ty TNHH ABC"
                        className="mt-1"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Company Information */}
              {currentStep === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Building2 className="h-5 w-5 text-blue-600" />
                      <span>Thông tin công ty</span>
                    </CardTitle>
                    <CardDescription>
                      Thông tin về quy mô và ngành nghề của công ty
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="companySize">Quy mô công ty *</Label>
                        <Select value={formData.companySize} onValueChange={(value) => handleInputChange('companySize', value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Chọn quy mô" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="startup">Startup (1-10 nhân viên)</SelectItem>
                            <SelectItem value="small">Nhỏ (11-50 nhân viên)</SelectItem>
                            <SelectItem value="medium">Trung bình (51-200 nhân viên)</SelectItem>
                            <SelectItem value="large">Lớn (201-1000 nhân viên)</SelectItem>
                            <SelectItem value="enterprise">Tập đoàn (1000+ nhân viên)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="industry">Ngành nghề *</Label>
                        <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Chọn ngành nghề" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="technology">Công nghệ thông tin</SelectItem>
                            <SelectItem value="finance">Tài chính - Ngân hàng</SelectItem>
                            <SelectItem value="healthcare">Y tế - Sức khỏe</SelectItem>
                            <SelectItem value="education">Giáo dục</SelectItem>
                            <SelectItem value="manufacturing">Sản xuất</SelectItem>
                            <SelectItem value="retail">Bán lẻ</SelectItem>
                            <SelectItem value="consulting">Tư vấn</SelectItem>
                            <SelectItem value="other">Khác</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="numberOfUsers">Số lượng người dùng dự kiến *</Label>
                      <div className="mt-1 space-y-2">
                        <Input
                          id="numberOfUsers"
                          type="number"
                          min="10"
                          max="10000"
                          value={formData.numberOfUsers}
                          onChange={(e) => handleInputChange('numberOfUsers', parseInt(e.target.value) || 10)}
                          className="text-lg font-semibold"
                        />
                        <div className="text-sm text-gray-600">
                          Tối thiểu 10 người dùng. Càng nhiều người dùng, chiết khấu càng lớn.
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address">Địa chỉ công ty</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Số 123, Đường ABC, Quận 1, TP.HCM"
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Requirements */}
              {currentStep === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      <span>Yêu cầu chi tiết</span>
                    </CardTitle>
                    <CardDescription>
                      Mô tả chi tiết về mục đích sử dụng và yêu cầu đặc biệt
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="useCase">Mục đích sử dụng khóa học *</Label>
                      <Textarea
                        id="useCase"
                        value={formData.useCase}
                        onChange={(e) => handleInputChange('useCase', e.target.value)}
                        placeholder="Ví dụ: Đào tạo kỹ năng tâm lý cho nhân viên bộ phận nhân sự, cải thiện môi trường làm việc..."
                        className="mt-1"
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label htmlFor="requirements">Yêu cầu đặc biệt *</Label>
                      <Textarea
                        id="requirements"
                        value={formData.requirements}
                        onChange={(e) => handleInputChange('requirements', e.target.value)}
                        placeholder="Ví dụ: Cần báo cáo tiến độ học tập, chứng chỉ hoàn thành, tích hợp với hệ thống LMS hiện tại..."
                        className="mt-1"
                        rows={4}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="budget">Ngân sách dự kiến</Label>
                        <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Chọn khoảng ngân sách" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="under-100m">Dưới 100 triệu VND</SelectItem>
                            <SelectItem value="100-500m">100 - 500 triệu VND</SelectItem>
                            <SelectItem value="500m-1b">500 triệu - 1 tỷ VND</SelectItem>
                            <SelectItem value="over-1b">Trên 1 tỷ VND</SelectItem>
                            <SelectItem value="flexible">Linh hoạt theo đề xuất</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="timeline">Thời gian triển khai</Label>
                        <Select value={formData.timeline} onValueChange={(value) => handleInputChange('timeline', value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Chọn thời gian" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="asap">Càng sớm càng tốt</SelectItem>
                            <SelectItem value="1-month">Trong 1 tháng</SelectItem>
                            <SelectItem value="3-months">Trong 3 tháng</SelectItem>
                            <SelectItem value="6-months">Trong 6 tháng</SelectItem>
                            <SelectItem value="flexible">Linh hoạt</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 4: Documents & Confirmation */}
              {currentStep === 4 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <span>Tài liệu & Xác nhận</span>
                    </CardTitle>
                    <CardDescription>
                      Upload tài liệu liên quan (không bắt buộc) và xác nhận thông tin
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label>Tài liệu đính kèm</Label>
                      <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600 mb-2">
                          Kéo thả file hoặc click để chọn
                        </p>
                        <p className="text-xs text-gray-500 mb-4">
                          Hỗ trợ: PDF, DOC, DOCX, JPG, PNG (tối đa 10MB)
                        </p>
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                        />
                        <Button type="button" variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                          Chọn file
                        </Button>
                      </div>
                      
                      {uploadedFiles.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <Label>File đã upload:</Label>
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <FileText className="h-4 w-4 text-blue-600" />
                                <span className="text-sm">{file.name}</span>
                                <span className="text-xs text-gray-500">
                                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                              >
                                Xóa
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Summary */}
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-4">Tóm tắt yêu cầu:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-blue-700">Người liên hệ:</span>
                          <div className="font-medium">{formData.contactName} ({formData.position})</div>
                        </div>
                        <div>
                          <span className="text-blue-700">Công ty:</span>
                          <div className="font-medium">{formData.companyName}</div>
                        </div>
                        <div>
                          <span className="text-blue-700">Số người dùng:</span>
                          <div className="font-medium">{formData.numberOfUsers} người</div>
                        </div>
                        <div>
                          <span className="text-blue-700">Khóa học:</span>
                          <div className="font-medium">{course.title}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại
                </Button>
                
                {currentStep < 4 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStepComplete(currentStep)}
                  >
                    Tiếp tục
                    <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                  </Button>
                ) : (
                  <Button type="submit">
                    <Check className="h-4 w-4 mr-2" />
                    Gửi yêu cầu
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Info */}
            <Card>
              <CardHeader>
                <CardTitle>Khóa học được chọn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <ImageWithFallback
                    src={course.image}
                    alt={course.title}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="font-semibold mb-2">{course.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{course.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>{course.students} học viên</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{course.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing Calculator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5 text-blue-600" />
                  <span>Tính giá dự kiến</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-2">Giá lẻ gốc:</div>
                    <div className="text-lg font-semibold">{formatPrice(course.price)}/người</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Số lượng:</span>
                      <span className="font-medium">{formData.numberOfUsers} người</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Chiết khấu:</span>
                      <span className="font-medium text-green-600">
                        -{Math.round(discount * 100)}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Giá/người:</span>
                      <span className="font-medium">{formatPrice(perUser)}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">Tổng cộng:</span>
                      <span className="text-xl font-bold text-blue-600">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                    {savings > 0 && (
                      <div className="text-sm text-green-600 text-right">
                        Tiết kiệm: {formatPrice(savings)}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-4 p-3 bg-yellow-50 rounded-lg">
                    <AlertCircle className="h-4 w-4 inline mr-1" />
                    Đây chỉ là giá ước tính. Giá cuối cùng sẽ được thương lượng dựa trên yêu cầu cụ thể.
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle>Ưu đãi doanh nghiệp</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    'Chiết khấu theo số lượng',
                    'Dashboard quản lý tiến độ',
                    'Báo cáo chi tiết',
                    'Hỗ trợ 24/7',
                    'Tùy chỉnh nội dung',
                    'Chứng chỉ hoàn thành',
                    'Tích hợp API',
                    'Đào tạo quản trị viên'
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Liên hệ hỗ trợ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-blue-600" />
                    <span>1900 xxx xxx</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span>enterprise@feelosophy.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span>8:00 - 17:30 (T2-T6)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}