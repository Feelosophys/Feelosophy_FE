"use client";

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Mail, Lock, User as UserIcon, Loader2, LogIn, UserPlus, ShieldCheck } from 'lucide-react';
import { useAuthContext } from '../../lib/auth-context';
import type { User } from '../../lib/types';

const AUTH_API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1').replace(/\/$/, '');

type TabValue = 'login' | 'register';

interface AuthPageProps {
  onClose?: () => void;
  onAuthSuccess?: (user: User) => void;
}

const AuthPage = ({ onClose, onAuthSuccess }: AuthPageProps) => {
  const router = useRouter();
  const { login, register } = useAuthContext();

  const [tab, setTab] = useState<TabValue>('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  const googleAuthUrl = `${AUTH_API_BASE_URL}/auth/google`;

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setIsSubmitting(true);

    const response = await login({
      email: loginForm.email.trim(),
      password: loginForm.password,
    });

    if (response.success && response.data) {
      setMessage({
        type: 'success',
        text: 'Đăng nhập thành công. Đang chuyển hướng...',
      });
      onAuthSuccess?.(response.data.user);
      onClose?.();
      router.push('/');
    } else {
      setMessage({
        type: 'error',
        text: response.error || response.message || 'Đăng nhập thất bại. Vui lòng thử lại.',
      });
    }

    setIsSubmitting(false);
  };

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    if (registerForm.password !== registerForm.confirmPassword) {
      setMessage({
        type: 'error',
        text: 'Mật khẩu xác nhận không khớp.',
      });
      return;
    }

    setIsSubmitting(true);
    const response = await register({
      name: registerForm.name.trim(),
      email: registerForm.email.trim(),
      password: registerForm.password,
    });

    if (response.success && response.data) {
      setMessage({
        type: 'success',
        text: 'Đăng ký thành công. Đang chuyển hướng...',
      });
      onAuthSuccess?.(response.data.user);
      onClose?.();
      router.push('/');
    } else {
      setMessage({
        type: 'error',
        text: response.error || response.message || 'Đăng ký thất bại. Vui lòng thử lại.',
      });
    }

    setIsSubmitting(false);
  };

  const handleGoogleLogin = () => {
    window.location.href = googleAuthUrl;
  };

  return (
    <div className="min-h-[calc(100vh-120px)] w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-10 px-4">
        <div className="space-y-3 text-center">
          <h1 className="text-3xl font-semibold text-gray-900">Cùng đồng hành với Feelosophy</h1>
          <p className="text-base text-gray-600">
            Đăng nhập hoặc tạo tài khoản để khám phá các khóa học, bài viết và cộng đồng hỗ trợ sức khỏe tinh thần.
          </p>
        </div>

        <Card className="w-full max-w-3xl border-blue-100/50 shadow-xl backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold text-gray-900">Chào mừng trở lại 👋</CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Sử dụng email hoặc Google để kết nối với Feelosophy.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-8 p-8 md:grid-cols-[1.15fr_1fr]">
            <div className="space-y-6">
              <Tabs value={tab} onValueChange={(value) => setTab(value as TabValue)} className="space-y-6">
                <TabsList className="grid grid-cols-2 bg-blue-50">
                  <TabsTrigger value="login">Đăng nhập</TabsTrigger>
                  <TabsTrigger value="register">Đăng ký</TabsTrigger>
                </TabsList>

                {message && (
                  <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
                    <AlertTitle>{message.type === 'error' ? 'Có lỗi xảy ra' : 'Thành công'}</AlertTitle>
                    <AlertDescription>{message.text}</AlertDescription>
                  </Alert>
                )}

                <TabsContent value="login" className="space-y-5">
                  <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          id="login-email"
                          type="email"
                          autoComplete="email"
                          placeholder="you@example.com"
                          value={loginForm.email}
                          onChange={(event) =>
                            setLoginForm((prev) => ({ ...prev, email: event.target.value }))
                          }
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password">Mật khẩu</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          id="login-password"
                          type="password"
                          autoComplete="current-password"
                          placeholder="••••••••"
                          value={loginForm.password}
                          onChange={(event) =>
                            setLoginForm((prev) => ({ ...prev, password: event.target.value }))
                          }
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <LogIn className="mr-2 h-4 w-4" />
                      )}
                      Đăng nhập
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register" className="space-y-5">
                  <form onSubmit={handleRegister} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="register-name">Họ và tên</Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          id="register-name"
                          type="text"
                          placeholder="Nguyễn Văn A"
                          value={registerForm.name}
                          onChange={(event) =>
                            setRegisterForm((prev) => ({ ...prev, name: event.target.value }))
                          }
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          id="register-email"
                          type="email"
                          autoComplete="email"
                          placeholder="you@example.com"
                          value={registerForm.email}
                          onChange={(event) =>
                            setRegisterForm((prev) => ({ ...prev, email: event.target.value }))
                          }
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-password">Mật khẩu</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          id="register-password"
                          type="password"
                          autoComplete="new-password"
                          placeholder="Tối thiểu 8 ký tự"
                          value={registerForm.password}
                          onChange={(event) =>
                            setRegisterForm((prev) => ({ ...prev, password: event.target.value }))
                          }
                          className="pl-10"
                          required
                          minLength={8}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-confirm-password">Xác nhận mật khẩu</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          id="register-confirm-password"
                          type="password"
                          placeholder="Nhập lại mật khẩu"
                          value={registerForm.confirmPassword}
                          onChange={(event) =>
                            setRegisterForm((prev) => ({ ...prev, confirmPassword: event.target.value }))
                          }
                          className="pl-10"
                          required
                          minLength={8}
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <UserPlus className="mr-2 h-4 w-4" />
                      )}
                      Đăng ký
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6 rounded-lg border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-gray-900">Tiếp tục với Google</h3>
                <p className="text-sm text-gray-500">
                  Đăng nhập nhanh chóng bằng tài khoản Google của bạn.
                </p>
              </div>

              <Button
                variant="outline"
                type="button"
                className="w-full border-blue-200 bg-white text-gray-700 hover:bg-blue-50"
                onClick={handleGoogleLogin}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M21.35 11.1h-9.18v2.91h5.4c-.24 1.44-1.65 4.23-5.4 4.23-3.25 0-5.91-2.7-5.91-6.04s2.66-6.04 5.91-6.04c1.85 0 3.09.79 3.8 1.48l2.59-2.5C16.8 3.7 14.62 2.7 12.17 2.7 6.99 2.7 2.8 6.88 2.8 12.2c0 5.32 4.19 9.5 9.37 9.5 5.41 0 8.99-3.81 8.99-9.16 0-.62-.07-1.09-.18-1.44Z"
                      fill="currentColor"
                    />
                  </svg>
                )}
                Đăng nhập với Google
              </Button>

              <Separator />

              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 text-blue-500" />
                  <span>Truy cập các khóa học và nội dung chuyên sâu về sức khỏe tinh thần.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 text-blue-500" />
                  <span>Kết nối với chuyên gia, chia sẻ và nhận hỗ trợ từ cộng đồng.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 text-blue-500" />
                  <span>Lưu giữ tiến trình học tập và nhận thông báo cá nhân hóa.</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;