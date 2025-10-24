"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { 
  Users, 
  GraduationCap, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  UserCheck,
  BookOpen,
  Star,
  Target,
  Activity,
  BarChart3,
  PieChart,
  Download,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { adminApiClient } from '../../lib/adminDashboardApi';

// Types từ AdminApiClient
interface DashboardStats {
  totalUsers: number;
  totalExperts: number;
  totalCourses: number;
  totalRevenue: number;
  monthlyRevenue: number;
  growthRate: number;
  activeUsers: number;
  coursesCompleted: number;
  averageRating: number;
  responseTime: string;
}

interface UserGrowthData {
  month: string;
  users: number;
  experts: number;
  revenue: number;
}

interface CourseStats {
  category: string;
  students: number;
  revenue: number;
}

interface UserTypeDistribution {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

interface RecentActivity {
  id: string;
  type: string;
  user: string;
  time: string;
  description: string;
}

export function AdminDashboard() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalExperts: 0,
    totalCourses: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    growthRate: 0,
    activeUsers: 0,
    coursesCompleted: 0,
    averageRating: 0,
    responseTime: '0h',
  });
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthData[]>([]);
  const [courseStatsData, setCourseStatsData] = useState<CourseStats[]>([]);
  const [userTypeDistribution, setUserTypeDistribution] = useState<UserTypeDistribution[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('12months');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const statsRes = await adminApiClient.getDashboardStats(selectedTimeRange);
      const growthRes = await adminApiClient.getUserGrowth(selectedTimeRange);
      const coursesRes = await adminApiClient.getCourseStats(selectedTimeRange, 6);
      const distributionRes = await adminApiClient.getUserTypeDistribution(selectedTimeRange);
      const activitiesRes = await adminApiClient.getRecentActivities(5, 'all');

      if (statsRes.success) {
        setDashboardStats(statsRes.data || {
          totalUsers: 0,
          totalExperts: 0,
          totalCourses: 0,
          totalRevenue: 0,
          monthlyRevenue: 0,
          growthRate: 0,
          activeUsers: 0,
          coursesCompleted: 0,
          averageRating: 0,
          responseTime: '0h',
        });
      } else {
        setError(statsRes.error || 'Failed to fetch dashboard stats');
      }

      if (growthRes.success) {
        setUserGrowthData(growthRes.data || []);
      } else {
        setError(growthRes.error || 'Failed to fetch user growth data');
      }

      if (coursesRes.success) {
        setCourseStatsData(coursesRes.data || []);
      } else {
        setError(coursesRes.error || 'Failed to fetch course stats');
      }

      if (distributionRes.success) {
        setUserTypeDistribution(distributionRes.data || []);
      } else {
        setError(distributionRes.error || 'Failed to fetch user type distribution');
      }

      if (activitiesRes.success) {
        setRecentActivities(activitiesRes.data || []);
      } else {
        setError(activitiesRes.error || 'Failed to fetch recent activities');
      }
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Fetch error:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedTimeRange]);

  const handleRefresh = async () => {
    await fetchData();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registration': return <UserCheck className="h-4 w-4 text-green-600" />;
      case 'course_purchase': return <BookOpen className="h-4 w-4 text-blue-600" />;
      case 'expert_booking': return <Calendar className="h-4 w-4 text-purple-600" />;
      case 'course_completion': return <Target className="h-4 w-4 text-yellow-600" />;
      case 'expert_registration': return <Users className="h-4 w-4 text-indigo-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Quản trị</h1>
            <p className="text-gray-600 mt-1">
              Tổng quan hoạt động hệ thống Feelosophy
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select 
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7days">7 ngày qua</option>
              <option value="30days">30 ngày qua</option>
              <option value="3months">3 tháng qua</option>
              <option value="12months">12 tháng qua</option>
            </select>
            <Button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Download className="h-4 w-4 mr-2" />
              Xuất báo cáo
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tổng người dùng</p>
                  <p className="text-3xl font-bold text-gray-900">{formatNumber(dashboardStats.totalUsers)}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+{dashboardStats.growthRate}%</span>
                    <span className="text-sm text-gray-500 ml-1">tháng này</span>
                  </div>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Chuyên gia</p>
                  <p className="text-3xl font-bold text-gray-900">{formatNumber(dashboardStats.totalExperts)}</p>
                  <div className="flex items-center mt-2">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-sm text-gray-600">Đánh giá TB: {dashboardStats.averageRating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Khóa học</p>
                  <p className="text-3xl font-bold text-gray-900">{formatNumber(dashboardStats.totalCourses)}</p>
                  <div className="flex items-center mt-2">
                    <Target className="h-4 w-4 text-purple-500 mr-1" />
                    <span className="text-sm text-gray-600">{formatNumber(dashboardStats.coursesCompleted)} hoàn thành</span>
                  </div>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <GraduationCap className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Doanh thu</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(dashboardStats.totalRevenue)}</p>
                  <div className="flex items-center mt-2">
                    <DollarSign className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-gray-600">{formatCurrency(dashboardStats.monthlyRevenue)}/tháng</span>
                  </div>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Growth Chart */}
          <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span>Tăng trưởng người dùng</span>
              </CardTitle>
              <CardDescription>
                Số lượng người dùng và chuyên gia theo tháng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [formatNumber(Number(value)), name === 'users' ? 'Người dùng' : 'Chuyên gia']} />
                  <Legend formatter={(value) => value === 'users' ? 'Người dùng' : 'Chuyên gia'} />
                  <Area type="monotone" dataKey="users" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
                  <Area type="monotone" dataKey="experts" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Revenue Chart */}
          <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span>Doanh thu theo tháng</span>
              </CardTitle>
              <CardDescription>
                Xu hướng doanh thu 12 tháng qua
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                  <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Doanh thu']} />
                  <Legend formatter={() => 'Doanh thu (VND)'} />
                  <Line type="monotone" dataKey="revenue" stroke="#059669" strokeWidth={3} dot={{ fill: '#059669', strokeWidth: 2, r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Additional Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Distribution */}
          <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="h-5 w-5 text-purple-600" />
                <span>Phân bố người dùng</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <RechartsPieChart>
                  <Pie
                    data={userTypeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {userTypeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [formatNumber(Number(value)), 'Người dùng']} />
                </RechartsPieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4">
                {userTypeDistribution.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatNumber(item.value)} ({item.percentage}%)
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Course Performance */}
          <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <span>Top khóa học</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courseStatsData.slice(0, 5).map((course, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{course.category}</span>
                      <span className="text-sm text-gray-600">{formatNumber(course.students)} học viên</span>
                    </div>
                    <Progress value={(course.students / 1000) * 100} className="h-2" />
                    <div className="text-xs text-gray-500">
                      Doanh thu: {formatCurrency(course.revenue)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-green-600" />
                <span>Hoạt động gần đây</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 text-blue-600 border-blue-200 hover:bg-blue-50">
                Xem tất cả hoạt động
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}