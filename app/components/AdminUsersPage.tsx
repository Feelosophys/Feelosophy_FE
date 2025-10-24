"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Users,
  Search,
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
  MapPin,
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { getUsers, getUserStats, exportUsers, approveUser, toggleUserStatus, deleteUser } from "../../lib/adminApi";
import { User } from "../../lib/types";

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  experts: number;
  patients: number;
  admins: number;
}

export function AdminUsersPage() {
  const [, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    experts: 0,
    patients: 0,
    admins: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState<keyof User>("joinDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch users and stats on component mount and when filters/pagination change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
  
      try {
        const usersResponse = await getUsers({
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
          role: roleFilter,
          status: statusFilter,
          sortBy: sortField,
          sortOrder: sortDirection,
        });
  
        console.log('Users API response:', usersResponse);
  
        if (
          usersResponse.success &&
          usersResponse.data &&
          Array.isArray(usersResponse.data.users) &&
          typeof usersResponse.data.totalPages === 'number'
        ) {
          setUsers(usersResponse.data.users);
          setFilteredUsers(usersResponse.data.users);
          setTotalPages(usersResponse.data.totalPages);
        } else {
          const errorMsg = usersResponse.error || 'Failed to fetch users: Invalid response structure';
          console.error('Invalid users response:', usersResponse);
          setError(errorMsg);
        }
  
        const statsResponse = await getUserStats();
        console.log('Stats API response:', statsResponse);
        if (statsResponse.success && statsResponse.data) {
          setStats(statsResponse.data);
        } else {
          const errorMsg = statsResponse.error || 'Failed to fetch user stats';
          console.error('Invalid stats response:', statsResponse);
          setError(errorMsg);
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'An error occurred while fetching data';
        console.error('Fetch data error:', err);
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [currentPage, searchTerm, roleFilter, statusFilter, sortField, sortDirection, itemsPerPage]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-100 text-purple-800">Admin</Badge>;
      case "expert":
        return <Badge className="bg-blue-100 text-blue-800">Chuyên gia</Badge>;
      case "patient":
        return <Badge className="bg-green-100 text-green-800">Bệnh nhân</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Không hoạt động</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Chờ duyệt</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleRoleFilter = (role: string) => {
    setRoleFilter(role);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleSort = (field: keyof User) => {
    const newDirection = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);
    setCurrentPage(1);
  };

  const handleApproveUser = async (userId: string) => {
    try {
      const response = await approveUser(userId);
      if (response.success) {
        setUsers((prev) =>
          prev.map((user) => (user.id === userId ? { ...user, status: "active" } : user))
        );
        setFilteredUsers((prev) =>
          prev.map((user) => (user.id === userId ? { ...user, status: "active" } : user))
        );
      } else {
        setError(response.error || "Failed to approve user");
      }
    } catch (err) {
      setError("An error occurred while approving user");
      console.error(err);
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      const response = await toggleUserStatus(userId);
      if (response.success) {
        setUsers((prev) =>
          prev.map((user) => (user.id === userId ? { ...user, status: newStatus } : user))
        );
        setFilteredUsers((prev) =>
          prev.map((user) => (user.id === userId ? { ...user, status: newStatus } : user))
        );
      } else {
        setError(response.error || "Failed to toggle user status");
      }
    } catch (err) {
      setError("An error occurred while toggling user status");
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await deleteUser(userId);
      if (response.success) {
        setUsers((prev) => prev.filter((user) => user.id !== userId));
        setFilteredUsers((prev) => prev.filter((user) => user.id !== userId));
      } else {
        setError(response.error || "Failed to delete user");
      }
    } catch (err) {
      setError("An error occurred while deleting user");
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Lỗi: {error}</div>;
  }

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
                  <div className="font-bold text-lg">{stats.totalUsers}</div>
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
                  <div className="font-bold text-lg">{stats.patients}</div>
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
                  <div className="font-bold text-lg">{stats.experts}</div>
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
                  <div className="font-bold text-lg">{stats.activeUsers}</div>
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
                  onClick={exportUsers}
                  variant="outline"
                  className="border-green-200 text-green-600 hover:bg-green-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Xuất Excel
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
                      onClick={() => handleSort("name")}
                    >
                      Người dùng {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead>Vai trò</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-blue-50"
                      onClick={() => handleSort("joinDate")}
                    >
                      Ngày tham gia {sortField === "joinDate" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-blue-50"
                      onClick={() => handleSort("lastLogin")}
                    >
                      Đăng nhập gần nhất {sortField === "lastLogin" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead>Thông tin thêm</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
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
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(user.joinDate)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">{formatDate(user.lastLogin)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm space-y-1">
                          {user.role === "patient" && (
                            <>
                              <div>Khóa học: {user.coursesEnrolled}</div>
                              <div>Chi tiêu: {formatCurrency(user.totalSpent)}</div>
                            </>
                          )}
                          {user.role === "expert" && (
                            <>
                              <div>Chuyên môn: {user.specialization}</div>
                              <div>Đánh giá: {user.rating}/5 ({user.consultations} tư vấn)</div>
                            </>
                          )}
                          {user.role === "admin" && (
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
                            {user.status === "pending" && (
                              <DropdownMenuItem onClick={() => handleApproveUser(user.id)}>
                                <UserCheck className="h-4 w-4 mr-2" />
                                Phê duyệt
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleToggleStatus(user.id, user.status)}>
                              <UserX className="h-4 w-4 mr-2" />
                              {user.status === "active" ? "Vô hiệu hóa" : "Kích hoạt"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteUser(user.id)}
                            >
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
                  Hiển thị {(currentPage - 1) * itemsPerPage + 1}-
                  {Math.min(currentPage * itemsPerPage, stats.totalUsers)} trong tổng số {stats.totalUsers} người dùng
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