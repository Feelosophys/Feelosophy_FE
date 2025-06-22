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
  History, 
  Calendar,
  Heart,
  LogOut,
  LogIn,
  Settings
} from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  onProfileTabChange?: (tab: string) => void;
  currentUser?: {
    name: string;
    email: string;
    avatar?: string;
    role?: string;
  };
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
  // Check if current user is an expert
  const isExpert = currentUser?.role === 'expert';
  
  const navItems = [
    { id: 'home', label: 'Trang chủ', icon: Brain },
    { id: 'courses', label: 'Khóa học', icon: BookOpen },
    { id: 'experts', label: 'Chuyên gia', icon: Users },
    { id: 'forum', label: 'Forum', icon: MessageSquare },
    { id: 'blog', label: 'Blog', icon: FileText },
    // Add schedule management for experts only
    ...(isExpert ? [{ id: 'schedule-management', label: 'Set lịch', icon: Calendar }] : [])
  ];

  const handleProfileNavigation = (tab: string) => {
    if (onProfileTabChange) {
      onProfileTabChange(tab);
    }
    onPageChange('profile');
  };

  const profileMenuItems = [
    {
      id: 'profile',
      label: 'Thông tin cá nhân',
      icon: User,
      tab: 'profile'
    },
    {
      id: 'my-courses',
      label: 'Khóa học của tôi',
      icon: BookOpen,
      tab: 'courses'
    },
    {
      id: 'wishlist',
      label: 'Danh sách yêu thích',
      icon: Heart,
      tab: 'wishlist'
    },
    {
      id: 'history',
      label: 'Lịch sử giao dịch',
      icon: History,
      tab: 'history'
    },
    {
      id: 'schedule',
      label: 'Lịch của tôi',
      icon: Calendar,
      tab: 'schedule'
    }
  ];

  // Add expert-specific menu items
  const expertMenuItems = [
    {
      id: 'schedule-management',
      label: 'Quản lý lịch trình',
      icon: Settings,
      tab: 'schedule-management'
    }
  ];

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-blue-200 px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onPageChange('home')}>
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">Feelosophy</span>
          </div>
          
          <div className="hidden md:flex space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "default" : "ghost"}
                  onClick={() => onPageChange(item.id)}
                  className={`flex items-center space-x-2 transition-colors ${
                    currentPage === item.id 
                      ? "bg-blue-600 text-white hover:bg-blue-700" 
                      : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Authentication Section */}
        <div className="flex items-center space-x-4">
          {currentUser ? (
            // Logged in user dropdown
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-blue-50 transition-colors">
                  <Avatar className="h-9 w-9 ring-2 ring-blue-100 hover:ring-blue-200 transition-all">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">
                      {currentUser.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-white/95 backdrop-blur-sm border-blue-200 shadow-lg" align="end" forceMount>
                <DropdownMenuLabel className="px-4 py-3 border-b border-blue-100">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10 ring-2 ring-blue-100">
                      <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                      <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">
                        {currentUser.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{currentUser.name}</p>
                      <p className="text-sm text-gray-600 truncate">{currentUser.email}</p>
                      {isExpert && (
                        <p className="text-xs text-blue-600 font-medium">Chuyên gia tâm lý</p>
                      )}
                    </div>
                  </div>
                </DropdownMenuLabel>
                
                <div className="py-1">
                  {profileMenuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <DropdownMenuItem
                        key={item.id}
                        onClick={() => handleProfileNavigation(item.tab)}
                        className="px-4 py-2.5 hover:bg-blue-50 focus:bg-blue-50 cursor-pointer transition-colors"
                      >
                        <Icon className="mr-3 h-4 w-4 text-blue-600" />
                        <span className="text-gray-700">{item.label}</span>
                      </DropdownMenuItem>
                    );
                  })}
                  
                  {/* Expert-specific menu items */}
                  {isExpert && (
                    <>
                      <DropdownMenuSeparator className="bg-blue-100" />
                      {expertMenuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <DropdownMenuItem
                            key={item.id}
                            onClick={() => onPageChange('schedule-management')}
                            className="px-4 py-2.5 hover:bg-blue-50 focus:bg-blue-50 cursor-pointer transition-colors"
                          >
                            <Icon className="mr-3 h-4 w-4 text-blue-600" />
                            <span className="text-gray-700">{item.label}</span>
                          </DropdownMenuItem>
                        );
                      })}
                    </>
                  )}
                </div>
                
                <DropdownMenuSeparator className="bg-blue-100" />
                
                <div className="py-1">
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="px-4 py-2.5 hover:bg-red-50 focus:bg-red-50 cursor-pointer transition-colors"
                  >
                    <LogOut className="mr-3 h-4 w-4 text-red-600" />
                    <span className="text-red-700">Đăng xuất</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // Login button for guests
            <Button 
              onClick={onShowAuth}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Đăng nhập
            </Button>
          )}
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden mt-3 flex space-x-2 overflow-x-auto pb-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={currentPage === item.id ? "default" : "ghost"}
              onClick={() => onPageChange(item.id)}
              size="sm"
              className={`flex items-center space-x-1 whitespace-nowrap ${
                currentPage === item.id 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              <Icon className="h-3 w-3" />
              <span className="text-xs">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}