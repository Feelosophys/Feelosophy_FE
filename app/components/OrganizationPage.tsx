"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  Download,
  Upload,
  Mail,
  UserPlus,
  UserMinus,
  BookOpen,
  Calendar,
  TrendingUp,
  BarChart3,
  Settings,
  Share,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Building,
  Crown,
  Edit,
  Trash2
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface OrganizationPageProps {
  currentUser: any;
  onBack: () => void;
}

// Mock organization data
const organizationData = {
  id: 'org-1',
  name: 'Công ty TNHH ABC',
  type: 'Enterprise',
  memberCount: 45,
  maxMembers: 100,
  activeMembers: 38,
  coursesOwned: 8,
  totalSpent: 15600000,
  joinDate: '2024-01-15',
  plan: 'Premium',
  admin: {
    name: 'Nguyễn Văn A',
    email: 'admin@abc.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop'
  }
};

const organizationCourses = [
  {
    id: 'course-1',
    title: 'Tâm lý học Ứng dụng trong Môi trường Làm việc',
    instructor: 'Dr. Nguyễn Minh Anh',
    thumbnail: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    price: 899000,
    purchaseDate: '2024-11-15',
    totalLessons: 24,
    totalDuration: '8.5 giờ',
    enrolledMembers: 23,
    completedMembers: 15,
    avgProgress: 68,
    category: 'Tâm lý công việc'
  },
  {
    id: 'course-2',
    title: 'Quản lý Stress và Burnout',
    instructor: 'Dr. Lê Thị Hương',
    thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    price: 749000,
    purchaseDate: '2024-10-20',
    totalLessons: 18,
    totalDuration: '6.2 giờ',
    enrolledMembers: 35,
    completedMembers: 28,
    avgProgress: 85,
    category: 'Sức khỏe tinh thần'
  }
];

const organizationMembers = [
  {
    id: 'member-1',
    name: 'Trần Văn B',
    email: 'tranb@abc.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    department: 'Nhân sự',
    joinDate: '2024-02-01',
    role: 'member',
    status: 'active',
    coursesEnrolled: 6,
    coursesCompleted: 4,
    lastActivity: '2024-12-20T14:30:00Z',
    totalStudyTime: '12.5 giờ'
  },
  {
    id: 'member-2',
    name: 'Lê Thị C',
    email: 'lethic@abc.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b602?w=150&h=150&fit=crop',
    department: 'Marketing',
    joinDate: '2024-02-15',
    role: 'member',
    status: 'active',
    coursesEnrolled: 4,
    coursesCompleted: 3,
    lastActivity: '2024-12-19T16:45:00Z',
    totalStudyTime: '8.2 giờ'
  },
  {
    id: 'member-3',
    name: 'Phạm Văn D',
    email: 'phamd@abc.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    department: 'IT',
    joinDate: '2024-03-01',
    role: 'moderator',
    status: 'inactive',
    coursesEnrolled: 2,
    coursesCompleted: 1,
    lastActivity: '2024-12-10T10:20:00Z',
    totalStudyTime: '3.5 giờ'
  }
];

export function OrganizationPage({ currentUser, onBack }: OrganizationPageProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [showAssignCourseDialog, setShowAssignCourseDialog] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Hoạt động</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Không hoạt động</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-purple-100 text-purple-700 border-purple-200"><Crown className="h-3 w-3 mr-1" />Admin</Badge>;
      case 'moderator':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Moderator</Badge>;
      default:
        return <Badge variant="outline">Thành viên</Badge>;
    }
  };

  const handleAddMember = () => {
    if (!newMemberEmail.trim()) return;
    
    console.log('Adding member:', newMemberEmail);
    // Here you would typically make an API call
    
    setNewMemberEmail('');
    setShowAddMemberDialog(false);
  };

  const handleRemoveMember = (memberId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa thành viên này?')) {
      console.log('Removing member:', memberId);
      // Here you would typically make an API call
    }
  };

  const handleAssignCourse = () => {
    if (selectedMembers.length === 0 || !selectedCourse) return;
    
    console.log('Assigning course:', selectedCourse.id, 'to members:', selectedMembers);
    // Here you would typically make an API call
    
    setSelectedMembers([]);
    setSelectedCourse(null);
    setShowAssignCourseDialog(false);
  };

  const filteredMembers = organizationMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack}>
              ← Quay lại
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Building className="h-8 w-8 mr-3 text-blue-600" />
                {organizationData.name}
              </h1>
              <p className="text-gray-600">Quản lý khóa học và thành viên tổ chức</p>
            </div>
          </div>
          <div className="text-right">
            <Badge className="bg-blue-100 text-blue-700 border-blue-200 mb-2">
              {organizationData.plan}
            </Badge>
            <p className="text-sm text-gray-600">
              {organizationData.memberCount}/{organizationData.maxMembers} thành viên
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tổng thành viên</p>
                  <p className="text-2xl font-bold text-gray-900">{organizationData.memberCount}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Khóa học sở hữu</p>
                  <p className="text-2xl font-bold text-gray-900">{organizationData.coursesOwned}</p>
                </div>
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Thành viên hoạt động</p>
                  <p className="text-2xl font-bold text-gray-900">{organizationData.activeMembers}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tổng chi phí</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(organizationData.totalSpent)}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm border border-blue-100">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              Tổng quan
            </TabsTrigger>
            <TabsTrigger value="courses" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              Khóa học ({organizationCourses.length})
            </TabsTrigger>
            <TabsTrigger value="members" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              Thành viên ({organizationMembers.length})
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              Báo cáo
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
                <CardHeader>
                  <CardTitle>Hoạt động gần đây</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Trần Văn B hoàn thành khóa học</p>
                        <p className="text-xs text-gray-600">Quản lý Stress và Burnout • 2 giờ trước</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <UserPlus className="h-5 w-5 text-blue-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Thêm 3 thành viên mới</p>
                        <p className="text-xs text-gray-600">Phòng Marketing • 1 ngày trước</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                      <BookOpen className="h-5 w-5 text-purple-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Mua khóa học mới</p>
                        <p className="text-xs text-gray-600">Tâm lý học Ứng dụng • 3 ngày trước</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Courses */}
              <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
                <CardHeader>
                  <CardTitle>Khóa học phổ biến</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {organizationCourses.map((course) => (
                      <div key={course.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <ImageWithFallback
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{course.title}</h4>
                          <div className="flex items-center space-x-2 text-xs text-gray-600">
                            <span>{course.enrolledMembers} đã tham gia</span>
                            <span>•</span>
                            <span>{course.avgProgress}% hoán thành</span>
                          </div>
                          <Progress value={course.avgProgress} className="h-1 mt-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Khóa học của tổ chức</CardTitle>
                    <CardDescription>Quản lý các khóa học đã mua cho tổ chức</CardDescription>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Mua khóa học mới
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {organizationCourses.map((course) => (
                    <Card key={course.id} className="border-gray-200 hover:shadow-md transition-shadow">
                      <div className="relative">
                        <ImageWithFallback
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-40 object-cover rounded-t-lg"
                        />
                        <Badge className="absolute top-3 right-3 bg-white/90 text-gray-700">
                          {course.category}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div>
                            <h3 className="font-bold text-lg">{course.title}</h3>
                            <p className="text-sm text-gray-600">bởi {course.instructor}</p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Đã tham gia:</span>
                              <p className="font-medium">{course.enrolledMembers}/{organizationData.memberCount} thành viên</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Hoàn thành:</span>
                              <p className="font-medium">{course.completedMembers} thành viên</p>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span>Tiến độ trung bình</span>
                              <span className="font-medium">{course.avgProgress}%</span>
                            </div>
                            <Progress value={course.avgProgress} className="h-2" />
                          </div>
                          
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Mua ngày {formatDate(course.purchaseDate)}</span>
                            <span>{formatCurrency(course.price)}</span>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => setSelectedCourse(course)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Chi tiết
                            </Button>
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={() => {
                                setSelectedCourse(course);
                                setShowAssignCourseDialog(true);
                              }}
                            >
                              <Share className="h-4 w-4 mr-2" />
                              Giao khóa học
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-6">
            {/* Search and Actions */}
            <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Tìm kiếm thành viên..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 border-blue-200 focus:border-blue-400"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowAddMemberDialog(true)}
                      className="border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Thêm thành viên
                    </Button>
                    <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                      <Upload className="h-4 w-4 mr-2" />
                      Import CSV
                    </Button>
                    <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Members List */}
            <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
              <CardHeader>
                <CardTitle>Danh sách thành viên</CardTitle>
                <CardDescription>Quản lý {filteredMembers.length} thành viên</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredMembers.map((member) => (
                    <div key={member.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <ImageWithFallback
                        src={member.avatar}
                        alt={member.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium">{member.name}</h4>
                          {getRoleBadge(member.role)}
                          {getStatusBadge(member.status)}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{member.email}</span>
                          <span>•</span>
                          <span>{member.department}</span>
                          <span>•</span>
                          <span>Tham gia {formatDate(member.joinDate)}</span>
                        </div>
                      </div>
                      
                      <div className="text-right text-sm">
                        <div className="text-gray-900 font-medium">
                          {member.coursesCompleted}/{member.coursesEnrolled} khóa học
                        </div>
                        <div className="text-gray-600">
                          {member.totalStudyTime} học tập
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <UserMinus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
                <CardHeader>
                  <CardTitle>Tiến độ học tập theo khóa học</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {organizationCourses.map((course) => (
                      <div key={course.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium truncate">{course.title}</span>
                          <span className="text-gray-600">{course.avgProgress}%</span>
                        </div>
                        <Progress value={course.avgProgress} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{course.enrolledMembers} thành viên tham gia</span>
                          <span>{course.completedMembers} hoàn thành</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
                <CardHeader>
                  <CardTitle>Thống kê hoạt động</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-blue-700">Tổng thời gian học</p>
                          <p className="text-2xl font-bold text-blue-800">156.5 giờ</p>
                        </div>
                        <Clock className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-green-50 rounded-lg text-center">
                        <p className="text-lg font-bold text-green-800">89%</p>
                        <p className="text-xs text-green-600">Tỷ lệ hoàn thành</p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg text-center">
                        <p className="text-lg font-bold text-purple-800">4.8</p>
                        <p className="text-xs text-purple-600">Đánh giá TB</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Add Member Dialog */}
        {showAddMemberDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md bg-white">
              <CardHeader>
                <CardTitle>Thêm thành viên mới</CardTitle>
                <CardDescription>Mời thành viên tham gia tổ chức</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">Email thành viên</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    placeholder="user@company.com"
                    className="mt-1"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowAddMemberDialog(false)}
                  >
                    Hủy
                  </Button>
                  <Button
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={handleAddMember}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Gửi lời mời
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Assign Course Dialog */}
        {showAssignCourseDialog && selectedCourse && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl bg-white max-h-[80vh] overflow-auto">
              <CardHeader>
                <CardTitle>Giao khóa học</CardTitle>
                <CardDescription>
                  Chọn thành viên để giao khóa học: {selectedCourse.title}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {organizationMembers.map((member) => (
                    <div key={member.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(member.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedMembers([...selectedMembers, member.id]);
                          } else {
                            setSelectedMembers(selectedMembers.filter(id => id !== member.id));
                          }
                        }}
                        className="rounded"
                      />
                      <ImageWithFallback
                        src={member.avatar}
                        alt={member.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{member.name}</p>
                        <p className="text-xs text-gray-600">{member.department}</p>
                      </div>
                      {getStatusBadge(member.status)}
                    </div>
                  ))}
                </div>
                
                <div className="flex space-x-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowAssignCourseDialog(false)}
                  >
                    Hủy
                  </Button>
                  <Button
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={handleAssignCourse}
                    disabled={selectedMembers.length === 0}
                  >
                    Giao khóa học ({selectedMembers.length})
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