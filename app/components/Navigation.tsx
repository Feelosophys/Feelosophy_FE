"use client"

import React from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from './ui/dropdown-menu';
import { 
  Brain, 
  BookOpen, 
  Users, 
  User, 
  MessageSquare, 
  FileText, 
  Calendar,
  Heart,
  LogOut,
  LogIn,
  BarChart3,
  Database,
  GraduationCap,
  Plus,
  Building,
  UserPlus,
  ClipboardCheck,
} from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  onProfileTabChange?: (tab: string) => void;
  currentUser?: { role: string; avatar?: string; name?: string; email?: string };
  onShowAuth?: () => void;
  onLogout?: () => void;
}

export function Navigation({ 
  currentPage, 
  onPageChange, 
  onProfileTabChange, 
  currentUser,
  onShowAuth,
  onLogout
}: NavigationProps) {
  const isExpert = currentUser?.role === 'expert';
  const isAdmin = currentUser?.role === 'admin';
  const isTeacher = currentUser?.role === 'teacher';
  const isUser = currentUser?.role === 'patient';
  
  const getNavItems = () => {
    if (isAdmin) {
      return [
        { id: 'admin-dashboard', label: 'Dashboard', icon: BarChart3 },
        { id: 'admin-users', label: 'Người dùng', icon: Users },
        { id: 'admin-courses', label: 'Khóa học', icon: BookOpen },
        { id: 'admin-course-review', label: 'Duyệt khóa học', icon: ClipboardCheck },
        { id: 'admin-creator-review', label: 'Duyệt đăng ký', icon: UserPlus },
        { id: 'admin-analytics', label: 'Phân tích', icon: Database }
      ];
    } else if (isTeacher) {
      return [
        { id: 'teacher-dashboard', label: 'Dashboard', icon: BarChart3 },
        { id: 'courses', label: 'Khóa học', icon: BookOpen },
        { id: 'experts', label: 'Chuyên gia', icon: Users },
        { id: 'forum', label: 'Forum', icon: MessageSquare },
        { id: 'blog', label: 'Blog', icon: FileText }
      ];
    } else {
      const baseItems = [
        { id: 'home', label: 'Trang chủ', icon: Brain },
        { id: 'courses', label: 'Khóa học', icon: BookOpen },
        { id: 'experts', label: 'Chuyên gia', icon: Users },
        { id: 'forum', label: 'Forum', icon: MessageSquare },
        { id: 'blog', label: 'Blog', icon: FileText }
      ];

      if (isExpert) {
        baseItems.push({ id: 'schedule-management', label: 'Set lịch', icon: Calendar });
      }

      return baseItems;
    }
  };

  const navItems = getNavItems();

  const handleProfileNavigation = (tab: string) => {
    if (onProfileTabChange) {
      onProfileTabChange(tab);
    }
    onPageChange('profile');
  };

  const getProfileMenuItems = () => {
    if (isTeacher) {
      return [
        {
          id: 'teacher-dashboard',
          label: 'Dashboard giảng viên',
          icon: BarChart3,
          action: () => onPageChange('teacher-dashboard')
        },
        {
          id: 'create-course',
          label: 'Tạo khóa học mới',
          icon: Plus,
          action: () => onPageChange('create-course')
        },
        {
          id: 'profile',
          label: 'Thông tin cá nhân',
          icon: User,
          action: () => handleProfileNavigation('profile')
        },
        {
          id: 'my-courses',
          label: 'Khóa học của tôi',
          icon: BookOpen,
          action: () => handleProfileNavigation('my-courses')
        }
      ];
    } else if (isUser) {
      return [
        {
          id: 'profile',
          label: 'Thông tin cá nhân',
          icon: User,
          action: () => handleProfileNavigation('profile')
        },
        {
          id: 'become-creator',
          label: 'Trở thành người sáng tạo',
          icon: GraduationCap,
          action: () => onPageChange('become-creator')
        },
        {
          id: 'organization',
          label: 'Chế độ tổ chức',
          icon: Building,
          action: () => onPageChange('organization')
        },
        {
          id: 'enrolled-courses',
          label: 'Khóa học của tôi',
          icon: BookOpen,
          action: () => handleProfileNavigation('enrolled-courses')
        },
        {
          id: 'favorites',
          label: 'Yêu thích',
          icon: Heart,
          action: () => handleProfileNavigation('favorites')
        }
      ];
    } else {
      return [
        {
          id: 'profile',
          label: 'Thông tin cá nhân',
          icon: User,
          action: () => handleProfileNavigation('profile')
        },
        {
          id: 'schedule-management',
          label: 'Quản lý lịch',
          icon: Calendar,
          action: () => onPageChange('schedule-management')
        }
      ];
    }
  };

  return (
    <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="flex h-16 items-center px-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2 mr-8">
          <Brain className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-primary">Feelosophy</span>
        </div>

        <div className="flex items-center space-x-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "default" : "ghost"}
                onClick={() => onPageChange(item.id)}
                className="flex items-center space-x-2"
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Button>
            );
          })}
        </div>

        <div className="ml-auto flex items-center space-x-4">
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage 
                      src={currentUser.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop`} 
                      alt={currentUser.name || 'User'} 
                    />
                    <AvatarFallback>
                      {(currentUser.name || 'U').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {currentUser.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {getProfileMenuItems().map((item) => {
                  const Icon = item.icon;
                  return (
                    <DropdownMenuItem key={item.id} onClick={item.action}>
                      <Icon className="mr-2 h-4 w-4" />
                      <span>{item.label}</span>
                    </DropdownMenuItem>
                  );
                })}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={onShowAuth} className="flex items-center space-x-2">
              <LogIn className="h-4 w-4" />
              <span>Đăng nhập</span>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}