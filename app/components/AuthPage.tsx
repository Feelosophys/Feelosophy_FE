"use client"

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Eye, 
  EyeOff, 
  AlertCircle,
  ArrowLeft,
  Shield,
  CheckCircle,
  UserCog,
  Stethoscope,
  Settings,
  GraduationCap
} from 'lucide-react';

interface AuthPageProps {
  onClose: () => void;
  onAuthSuccess: (user: any) => void;
}

type AuthStep = 'login' | 'register' | 'forgot-password' | 'verify-code' | 'reset-password';

// Demo accounts
const DEMO_ACCOUNTS = {
  expert: {
    id: 'expert-demo-1',
    name: 'Dr. Sarah Wilson',
    email: 'expert@feelosophy.com',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop',
    role: 'expert',
    title: 'Bác sĩ Tâm lý học Lâm sàng',
    experience: '8 năm',
    specialization: ['Trầm cảm', 'Lo âu', 'Stress công việc'],
    bio: 'Bác sĩ Sarah Wilson có hơn 8 năm kinh nghiệm trong lĩnh vực tâm lý học lâm sàng, chuyên về điều trị trầm cảm, lo âu và stress công việc.'
  },
  teacher: {
    id: 'teacher-demo-1',
    name: 'Dr. Nguyễn Minh Anh',
    email: 'teacher@feelosophy.com',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop',
    role: 'teacher',
    title: 'Giảng viên Tâm lý học',
    experience: '10 năm',
    specialization: ['Tâm lý học ứng dụng', 'Stress management', 'Mindfulness'],
    bio: 'Dr. Nguyễn Minh Anh là giảng viên với 10 năm kinh nghiệm, chuyên tạo nội dung giáo dục về tâm lý học.'
  },
  patient: {
    id: 'patient-demo-1',
    name: 'John Doe',
    email: 'patient@feelosophy.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    role: 'patient'
  },
  admin: {
    id: 'admin-demo-1',
    name: 'Admin System',
    email: 'admin@feelosophy.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    role: 'admin',
    title: 'Quản trị viên hệ thống',
    permissions: ['manage_users', 'manage_courses', 'view_analytics', 'system_settings']
  }
};

export function AuthPage({ onClose, onAuthSuccess }: AuthPageProps) {
  const [currentStep, setCurrentStep] = useState<AuthStep>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [forgotPasswordForm, setForgotPasswordForm] = useState({
    email: '',
    verificationCode: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const detectUserRole = (email: string): 'admin' | 'expert' | 'teacher' | 'patient' => {
    const lowercaseEmail = email.toLowerCase();
    if (lowercaseEmail.includes('admin')) {
      return 'admin';
    } else if (lowercaseEmail.includes('expert') || lowercaseEmail.includes('doctor')) {
      return 'expert';
    } else if (lowercaseEmail.includes('teacher') || lowercaseEmail.includes('instructor')) {
      return 'teacher';
    } else if (lowercaseEmail.includes('user')) {
      return 'patient';
    }
    return 'patient'; // default role
  };

  const handleDemoLogin = async (accountType: 'expert' | 'teacher' | 'patient' | 'admin') => {
    setIsLoading(true);
    setError('');

    try {
      // Mock login delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const demoUser = DEMO_ACCOUNTS[accountType];
      onAuthSuccess(demoUser);
      onClose();
    } catch (err) {
      setError('Có lỗi xảy ra khi đăng nhập demo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Mock login API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if using demo credentials
      if (loginForm.email === 'expert@feelosophy.com') {
        onAuthSuccess(DEMO_ACCOUNTS.expert);
        onClose();
        return;
      }
      
      if (loginForm.email === 'teacher@feelosophy.com') {
        onAuthSuccess(DEMO_ACCOUNTS.teacher);
        onClose();
        return;
      }
      
      if (loginForm.email === 'patient@feelosophy.com') {
        onAuthSuccess(DEMO_ACCOUNTS.patient);
        onClose();
        return;
      }

      if (loginForm.email === 'admin@feelosophy.com') {
        onAuthSuccess(DEMO_ACCOUNTS.admin);
        onClose();
        return;
      }
      
      // Mock successful login - detect role from email
      const userRole = detectUserRole(loginForm.email);
      const mockUser = {
        id: Date.now().toString(),
        name: loginForm.email.split('@')[0],
        email: loginForm.email,
        avatar: userRole === 'admin' 
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
          : userRole === 'expert'
          ? 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop'
          : userRole === 'teacher'
          ? 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop'
          : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
        role: userRole,
        title: userRole === 'admin' ? 'Quản trị viên' : userRole === 'expert' ? 'Chuyên gia tâm lý' : userRole === 'teacher' ? 'Giảng viên' : undefined,
        permissions: userRole === 'admin' ? ['manage_users', 'manage_courses', 'view_analytics'] : undefined
      };
      
      onAuthSuccess(mockUser);
      onClose();
    } catch (err) {
      setError('Email hoặc mật khẩu không đúng');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      setIsLoading(false);
      return;
    }

    try {
      // Mock register API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful registration - detect role from email
      const userRole = detectUserRole(registerForm.email);
      const mockUser = {
        id: Date.now().toString(),
        name: registerForm.fullName,
        email: registerForm.email,
        avatar: userRole === 'admin' 
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
          : userRole === 'expert'
          ? 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop'
          : userRole === 'teacher'
          ? 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop'
          : 'https://images.unsplash.com/photo-1494790108755-2616b612b602?w=150&h=150&fit=crop',
        role: userRole,
        title: userRole === 'admin' ? 'Quản trị viên' : userRole === 'expert' ? 'Chuyên gia tâm lý' : userRole === 'teacher' ? 'Giảng viên' : undefined,
        permissions: userRole === 'admin' ? ['manage_users', 'manage_courses', 'view_analytics'] : undefined
      };
      
      onAuthSuccess(mockUser);
      onClose();
    } catch (err) {
      setError('Có lỗi xảy ra khi đăng ký');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Mock send verification code
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Mã xác nhận đã được gửi đến email của bạn');
      setCurrentStep('verify-code');
    } catch (err) {
      setError('Không thể gửi mã xác nhận');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Mock verify code
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Mã xác nhận đúng');
      setCurrentStep('reset-password');
    } catch (err) {
      setError('Mã xác nhận không đúng');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (forgotPasswordForm.newPassword !== forgotPasswordForm.confirmNewPassword) {
      setError('Mật khẩu xác nhận không khớp');
      setIsLoading(false);
      return;
    }

    try {
      // Mock reset password
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Mật khẩu đã được đặt lại thành công');
      setTimeout(() => {
        setCurrentStep('login');
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError('Có lỗi xảy ra khi đặt lại mật khẩu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setIsLoading(true);
    
    try {
      // Mock social login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = {
        id: provider === 'google' ? '3' : '4',
        name: provider === 'google' ? 'Google User' : 'Facebook User',
        email: `user@${provider}.com`,
        avatar: provider === 'google' 
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
          : 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
        role: 'patient' // Default role for social login
      };
      
      onAuthSuccess(mockUser);
      onClose();
    } catch (err) {
      setError(`Không thể đăng nhập bằng ${provider === 'google' ? 'Google' : 'Facebook'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderLoginForm = () => (
    <Card className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-sm border-blue-100">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-gray-900">Đăng nhập</CardTitle>
        <CardDescription>
          Chào mừng bạn trở lại với Feelosophy
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Demo Login Section */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-700 text-center">
            🎯 Demo Accounts - Đăng nhập nhanh:
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => handleDemoLogin('expert')}
              disabled={isLoading}
              className="border-blue-200 text-blue-700 hover:bg-blue-50 h-auto py-3 flex flex-col items-center space-y-1"
            >
              <Stethoscope className="h-4 w-4" />
              <span className="text-xs">Chuyên gia</span>
              <span className="text-xs text-gray-500">Dr. Sarah</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleDemoLogin('teacher')}
              disabled={isLoading}
              className="border-orange-200 text-orange-700 hover:bg-orange-50 h-auto py-3 flex flex-col items-center space-y-1"
            >
              <GraduationCap className="h-4 w-4" />
              <span className="text-xs">Giảng viên</span>
              <span className="text-xs text-gray-500">Dr. Anh</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleDemoLogin('patient')}
              disabled={isLoading}
              className="border-green-200 text-green-700 hover:bg-green-50 h-auto py-3 flex flex-col items-center space-y-1"
            >
              <User className="h-4 w-4" />
              <span className="text-xs">Học viên</span>
              <span className="text-xs text-gray-500">John Doe</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleDemoLogin('admin')}
              disabled={isLoading}
              className="border-purple-200 text-purple-700 hover:bg-purple-50 h-auto py-3 flex flex-col items-center space-y-1"
            >
              <Settings className="h-4 w-4" />
              <span className="text-xs">Admin</span>
              <span className="text-xs text-gray-500">System</span>
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">Hoặc đăng nhập thủ công</span>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={loginForm.email}
                onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                className="pl-10 border-blue-200 focus:border-blue-400"
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="password">Mật khẩu</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                className="pl-10 pr-10 border-blue-200 focus:border-blue-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="text-right">
            <button
              type="button"
              onClick={() => setCurrentStep('forgot-password')}
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              Quên mật khẩu?
            </button>
          </div>

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">Hoặc đăng nhập bằng</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => handleSocialLogin('google')}
            disabled={isLoading}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSocialLogin('facebook')}
            disabled={isLoading}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </Button>
        </div>

        <div className="text-center text-sm text-gray-600">
          Chưa có tài khoản?{' '}
          <button
            onClick={() => setCurrentStep('register')}
            className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
          >
            Đăng ký ngay
          </button>
        </div>

        <div className="text-center text-xs text-blue-600 bg-blue-50 p-3 rounded-lg">
          💡 <strong>Demo:</strong> 
          <br />• Email chứa "admin" → Quyền admin
          <br />• Email chứa "teacher"/"instructor" → Quyền giảng viên
          <br />• Email chứa "doctor"/"expert" → Quyền chuyên gia  
          <br />• Email chứa "user" → Quyền người dùng
        </div>
      </CardContent>
    </Card>
  );

  const renderRegisterForm = () => (
    <Card className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-sm border-blue-100">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-gray-900">Đăng ký tài khoản</CardTitle>
        <CardDescription>
          Tham gia cộng đồng Feelosophy ngay hôm nay
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Demo Login Section */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-700 text-center">
            🎯 Demo Accounts - Đăng nhập nhanh:
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => handleDemoLogin('expert')}
              disabled={isLoading}
              className="border-blue-200 text-blue-700 hover:bg-blue-50 h-auto py-3 flex flex-col items-center space-y-1"
            >
              <Stethoscope className="h-4 w-4" />
              <span className="text-xs">Chuyên gia</span>
              <span className="text-xs text-gray-500">Dr. Sarah</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleDemoLogin('teacher')}
              disabled={isLoading}
              className="border-orange-200 text-orange-700 hover:bg-orange-50 h-auto py-3 flex flex-col items-center space-y-1"
            >
              <GraduationCap className="h-4 w-4" />
              <span className="text-xs">Giảng viên</span>
              <span className="text-xs text-gray-500">Dr. Anh</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleDemoLogin('patient')}
              disabled={isLoading}
              className="border-green-200 text-green-700 hover:bg-green-50 h-auto py-3 flex flex-col items-center space-y-1"
            >
              <User className="h-4 w-4" />
              <span className="text-xs">Học viên</span>
              <span className="text-xs text-gray-500">John Doe</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleDemoLogin('admin')}
              disabled={isLoading}
              className="border-purple-200 text-purple-700 hover:bg-purple-50 h-auto py-3 flex flex-col items-center space-y-1"
            >
              <Settings className="h-4 w-4" />
              <span className="text-xs">Admin</span>
              <span className="text-xs text-gray-500">System</span>
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">Hoặc đăng ký tài khoản mới</span>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <Label htmlFor="fullName">Họ và tên</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="fullName"
                type="text"
                placeholder="Nguyễn Văn A"
                value={registerForm.fullName}
                onChange={(e) => setRegisterForm({...registerForm, fullName: e.target.value})}
                className="pl-10 border-blue-200 focus:border-blue-400"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="registerEmail">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="registerEmail"
                type="email"
                placeholder="your@email.com"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                className="pl-10 border-blue-200 focus:border-blue-400"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="phone">Số điện thoại</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="phone"
                type="tel"
                placeholder="0901234567"
                value={registerForm.phone}
                onChange={(e) => setRegisterForm({...registerForm, phone: e.target.value})}
                className="pl-10 border-blue-200 focus:border-blue-400"
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="registerPassword">Mật khẩu</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="registerPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                className="pl-10 pr-10 border-blue-200 focus:border-blue-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={registerForm.confirmPassword}
                onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                className="pl-10 pr-10 border-blue-200 focus:border-blue-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-600">
          Đã có tài khoản?{' '}
          <button
            onClick={() => setCurrentStep('login')}
            className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
          >
            Đăng nhập
          </button>
        </div>

        <div className="text-center text-xs text-blue-600 bg-blue-50 p-3 rounded-lg">
          💡 <strong>Demo:</strong> 
          <br />• Email chứa "admin" → Quyền admin
          <br />• Email chứa "teacher"/"instructor" → Quyền giảng viên
          <br />• Email chứa "doctor"/"expert" → Quyền chuyên gia  
          <br />• Email chứa "user" → Quyền người dùng
        </div>
      </CardContent>
    </Card>
  );

  const renderForgotPasswordForm = () => (
    <Card className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-sm border-blue-100">
      <CardHeader className="text-center">
        <button
          onClick={() => setCurrentStep('login')}
          className="absolute left-6 top-6 text-gray-400 hover:text-gray-600"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <CardTitle className="text-2xl text-gray-900">Quên mật khẩu</CardTitle>
        <CardDescription>
          Nhập email của bạn để nhận mã xác nhận
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <div>
            <Label htmlFor="forgotEmail">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="forgotEmail"
                type="email"
                placeholder="your@email.com"
                value={forgotPasswordForm.email}
                onChange={(e) => setForgotPasswordForm({...forgotPasswordForm, email: e.target.value})}
                className="pl-10 border-blue-200 focus:border-blue-400"
                required
              />
            </div>
          </div>

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">{success}</AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? 'Đang gửi...' : 'Gửi mã xác nhận'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'login':
        return renderLoginForm();
      case 'register':
        return renderRegisterForm();
      case 'forgot-password':
        return renderForgotPasswordForm();
      default:
        return renderLoginForm();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {renderCurrentStep()}
      </div>
    </div>
  );
}