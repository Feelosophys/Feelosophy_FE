"use client"

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { Mail, Lock, User, Phone, Eye, EyeOff, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';
import { apiService } from '../api/ApiService';

interface AuthPageProps {
  onClose: () => void;
  onAuthSuccess: (user: unknown) => void;
}

type AuthStep = 'login' | 'register' | 'forgot-password' | 'verify-code' | 'reset-password';

export function AuthPage({ onClose, onAuthSuccess }: AuthPageProps) {
  const [currentStep, setCurrentStep] = useState<AuthStep>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [registerForm, setRegisterForm] = useState({
    name: '',
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const user = await apiService.login(loginForm.email, loginForm.password);
      onAuthSuccess(user);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi đăng nhập');
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
      const user = await apiService.register(
        registerForm.name,
        registerForm.email,
        registerForm.phone,
        registerForm.password
      );
      onAuthSuccess(user);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi đăng ký');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await apiService.sendVerificationCode(forgotPasswordForm.email);
      setSuccess('Mã xác nhận đã được gửi đến email của bạn');
      setCurrentStep('verify-code');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể gửi mã xác nhận');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await apiService.verifyCode(forgotPasswordForm.email, forgotPasswordForm.verificationCode);
      setSuccess('Mã xác nhận đúng');
      setCurrentStep('reset-password');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Mã xác nhận không đúng');
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
      await apiService.resetPassword(
        forgotPasswordForm.email,
        forgotPasswordForm.verificationCode,
        forgotPasswordForm.newPassword
      );
      setSuccess('Mật khẩu đã được đặt lại thành công');
      setTimeout(() => {
        setCurrentStep('login');
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi khi đặt lại mật khẩu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      window.location.href = apiService.getGoogleAuthUrl();
    } catch {
      setError('Không thể đăng nhập bằng Google');
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

        <Button
          variant="outline"
          onClick={handleSocialLogin}
          disabled={isLoading}
          className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google
        </Button>

        <div className="text-center text-sm text-gray-600">
          Chưa có tài khoản?{' '}
          <button
            onClick={() => setCurrentStep('register')}
            className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
          >
            Đăng ký ngay
          </button>
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
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <Label htmlFor="fullName">Họ và tên</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="fullName"
                type="text"
                placeholder="Nguyễn Văn A"
                value={registerForm.name}
                onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
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

  const renderVerifyCodeForm = () => (
    <Card className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-sm border-blue-100">
      <CardHeader className="text-center">
        <button
          onClick={() => setCurrentStep('forgot-password')}
          className="absolute left-6 top-6 text-gray-400 hover:text-gray-600"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <CardTitle className="text-2xl text-gray-900">Xác nhận mã</CardTitle>
        <CardDescription>
          Nhập mã xác nhận được gửi đến email của bạn
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <div>
            <Label htmlFor="verificationCode">Mã xác nhận</Label>
            <Input
              id="verificationCode"
              type="text"
              placeholder="Nhập mã xác nhận"
              value={forgotPasswordForm.verificationCode}
              onChange={(e) => setForgotPasswordForm({...forgotPasswordForm, verificationCode: e.target.value})}
              className="border-blue-200 focus:border-blue-400"
              required
            />
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
            {isLoading ? 'Đang xác nhận...' : 'Xác nhận'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  const renderResetPasswordForm = () => (
    <Card className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-sm border-blue-100">
      <CardHeader className="text-center">
        <button
          onClick={() => setCurrentStep('verify-code')}
          className="absolute left-6 top-6 text-gray-400 hover:text-gray-600"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <CardTitle className="text-2xl text-gray-900">Đặt lại mật khẩu</CardTitle>
        <CardDescription>
          Nhập mật khẩu mới cho tài khoản của bạn
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <Label htmlFor="newPassword">Mật khẩu mới</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="newPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={forgotPasswordForm.newPassword}
                onChange={(e) => setForgotPasswordForm({...forgotPasswordForm, newPassword: e.target.value})}
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
            <Label htmlFor="confirmNewPassword">Xác nhận mật khẩu mới</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="confirmNewPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={forgotPasswordForm.confirmNewPassword}
                onChange={(e) => setForgotPasswordForm({...forgotPasswordForm, confirmNewPassword: e.target.value})}
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
            {isLoading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
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
      case 'verify-code':
        return renderVerifyCodeForm();
      case 'reset-password':
        return renderResetPasswordForm();
      default:
        return renderLoginForm();
    }
  };

  return (
    <div className="bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {renderCurrentStep()}
      </div>
    </div>
  );
}