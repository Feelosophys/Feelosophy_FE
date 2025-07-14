"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Users, 
  Search, 
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  MapPin
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

// Mock users data
const mockUsers = [
  {
    id: 'user-001',
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '0901234567',
    role: 'patient',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    joinDate: '2024-01-15',
    lastLogin: '2024-12-20',
    coursesEnrolled: 3,
    totalSpent: 2145000,
    city: 'TP.HCM'
  },
  {
    id: 'expert-001',
    name: 'Dr. Sarah Wilson',
    email: 'expert@feelosophy.com',
    phone: '0912345678',
    role: 'expert',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop',
    joinDate: '2023-08-10',
    lastLogin: '2024-12-20',
    coursesEnrolled: 0,
    totalSpent: 0,
    specialization: 'Tâm lý học lâm sàng',
    rating: 4.9,
    consultations: 245,
    city: 'Hà Nội'
  },
  {
    id: 'admin-001',
    name: 'Admin System',
    email: 'admin@feelosophy.com',
    phone: '0923456789',
    role: 'admin',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    joinDate: '2023-01-01',
    lastLogin: '2024-12-20',
    coursesEnrolled: 0,
    totalSpent: 0,
    permissions: ['manage_users', 'manage_courses', 'view_analytics'],
    city: 'TP.HCM'
  },
  {
    id: 'user-002',
    name: 'Trần Thị B',
    email: 'tranthib@example.com',
    phone: '0934567890',
    role: 'patient',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b602?w=150&h=150&fit=crop',
    joinDate: '2024-02-20',
    lastLogin: '2024-12-19',
    coursesEnrolled: 1,
    totalSpent: 599000,
    city: 'Đà Nẵng'
  },
  {
    id: 'user-003',
    name: 'Lê Văn C',
    email: 'levanc@example.com',
    phone: '0945678901',
    role: 'patient',
    status: 'inactive',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    joinDate: '2023-12-05',
    lastLogin: '2024-11-15',
    coursesEnrolled: 2,
    totalSpent: 1348000,
    city: 'Hải Phòng'
  },
  {
    id: 'expert-002',
    name: 'Dr. Nguyễn Minh Anh',
    email: 'doctor.minh@example.com',
    phone: '0956789012',
    role: 'expert',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop',
    joinDate: '2023-09-15',
    lastLogin: '2024-12-18',
    coursesEnrolled: 0,
    totalSpent: 0,
    specialization: 'Tâm lý học',
    rating: 4.8,
    consultations: 189,
    city: 'TP.HCM'
  },
  {
    id: 'user-004',
    name: 'Phạm Thị D',
    email: 'phamthid@example.com',
    phone: '0967890123',
    role: 'patient',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    joinDate: '2024-03-10',
    lastLogin: '2024-12-20',
    coursesEnrolled: 4,
    totalSpent: 2896000,
    city: 'Cần Thơ'
  },
  {
    id: 'expert-003',
    name: 'ThS. Trần Văn Bình',
    email: 'expert.binh@example.com',
    phone: '0978901234',
    role: 'expert',
    status: 'pending',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    joinDate: '2024-12-01',
    lastLogin: '2024-12-20',
    coursesEnrolled: 0,
    totalSpent: 0,
    specialization: 'Tâm lý gia đình',
    rating: 4.7,
    consultations: 156,
    city: 'Nha Trang'
  }
];

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'patient' | 'expert' | 'admin';
  status: 'active' | 'inactive' | 'pending';
  avatar: string;
  joinDate: string;
  lastLogin: string;
  coursesEnrolled: number;
  totalSpent: number;
  specialization?: string;
  rating?: number;
  consultations?: number;
  permissions?: string[];
  city: string;
}

export function AdminUsersPage() {
  const [users] = useState<User[]>(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof User>('joinDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Calculate statistics
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const experts = users.filter(u => u.role === 'expert').length;
  const patients = users.filter(u => u.role === 'patient').length;
  const admins = users.filter(u => u.role === 'admin').length;

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

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-purple-100 text-purple-800">Admin</Badge>;
      case 'expert':
        return <Badge className="bg-blue-100 text-blue-800">Chuyên gia</Badge>;
      case 'patient':
        return <Badge className="bg-green-100 text-green-800">Bệnh nhân</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Không hoạt động</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Chờ duyệt</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterUsers(term, roleFilter, statusFilter);
  };

  const handleRoleFilter = (role: string) => {
    setRoleFilter(role);
    filterUsers(searchTerm, role, statusFilter);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    filterUsers(searchTerm, roleFilter, status);
  };

  const filterUsers = (search: string, role: string, status: string) => {
    let filtered = users;

    if (search) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.phone.includes(search)
      );
    }

    if (role !== 'all') {
      filtered = filtered.filter(user => user.role === role);
    }

    if (status !== 'all') {
      filtered = filtered.filter(user => user.status === status);
    }

    // Sort users
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const handleSort = (field: keyof User) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
    filterUsers(searchTerm, roleFilter, statusFilter);
  };

  const exportToCSV = () => {
    const headers = [
      'ID',
      'Họ tên',
      'Email',
      'Số điện thoại',
      'Vai trò',
      'Trạng thái',
      'Ngày tham gia',
      'Đăng nhập gần nhất',
      'Khóa học đã đăng ký',
      'Tổng chi tiêu',
      'Thành phố',
      'Chuyên môn',
      'Đánh giá',
      'Số lượng tư vấn'
    ];

    const csvData = filteredUsers.map(user => [
      user.id,
      user.name,
      user.email,
      user.phone,
      user.role,
      user.status,
      user.joinDate,
      user.lastLogin,
      user.coursesEnrolled,
      user.totalSpent,
      user.city,
      user.specialization || '',
      user.rating || '',
      user.consultations || ''
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `users_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý người dùng</h1>
          <p className="text-gray-600">
            Quản lý thông tin và phân quyền người dùng trong hệ thống
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-bold text-lg">{totalUsers}</div>
                  <div className="text-sm text-gray-600">Tổng người dùng</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-bold text-lg">{patients}</div>
                  <div className="text-sm text-gray-600">Bệnh nhân</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-bold text-lg">{experts}</div>
                  <div className="text-sm text-gray-600">Chuyên gia</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="font-bold text-lg">{activeUsers}</div>
                  <div className="text-sm text-gray-600">Đang hoạt động</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card className="bg-white/90 backdrop-blur-sm border-blue-100 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Tìm kiếm theo tên, email, SĐT..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 border-blue-200 focus:border-blue-400"
                  />
                </div>
                
                <Select value={roleFilter} onValueChange={handleRoleFilter}>
                  <SelectTrigger className="w-40 border-blue-200">
                    <SelectValue placeholder="Vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả vai trò</SelectItem>
                    <SelectItem value="patient">Bệnh nhân</SelectItem>
                    <SelectItem value="expert">Chuyên gia</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={handleStatusFilter}>
                  <SelectTrigger className="w-40 border-blue-200">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Không hoạt động</SelectItem>
                    <SelectItem value="pending">Chờ duyệt</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={exportToCSV}
                  variant="outline" 
                  className="border-green-200 text-green-600 hover:bg-green-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Xuất CSV
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Thêm người dùng
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-blue-100">
                    <TableHead 
                      className="cursor-pointer hover:bg-blue-50"
                      onClick={() => handleSort('name')}
                    >
                      Người dùng {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead>Vai trò</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-blue-50"
                      onClick={() => handleSort('joinDate')}
                    >
                      Ngày tham gia {sortField === 'joinDate' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-blue-50"
                      onClick={() => handleSort('lastLogin')}
                    >
                      Đăng nhập gần nhất {sortField === 'lastLogin' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead>Thông tin thêm</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentUsers.map((user) => (
                    <TableRow key={user.id} className="border-blue-50 hover:bg-blue-50/50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {user.email}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {user.phone}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getRoleBadge(user.role)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(user.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(user.joinDate)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {formatDate(user.lastLogin)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm space-y-1">
                          {user.role === 'patient' && (
                            <>
                              <div>Khóa học: {user.coursesEnrolled}</div>
                              <div>Chi tiêu: {formatCurrency(user.totalSpent)}</div>
                            </>
                          )}
                          {user.role === 'expert' && (
                            <>
                              <div>Chuyên môn: {user.specialization}</div>
                              <div>Đánh giá: {user.rating}/5 ({user.consultations} tư vấn)</div>
                            </>
                          )}
                          {user.role === 'admin' && (
                            <div>Quyền: {user.permissions?.length} permissions</div>
                          )}
                          <div className="flex items-center text-gray-500">
                            <MapPin className="h-3 w-3 mr-1" />
                            {user.city}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            {user.status === 'pending' && (
                              <DropdownMenuItem>
                                <UserCheck className="h-4 w-4 mr-2" />
                                Phê duyệt
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <UserX className="h-4 w-4 mr-2" />
                              {user.status === 'active' ? 'Vô hiệu hóa' : 'Kích hoạt'}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-blue-100">
                <div className="text-sm text-gray-500">
                  Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} trong tổng số {filteredUsers.length} người dùng
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Trước
                  </Button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Sau
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}