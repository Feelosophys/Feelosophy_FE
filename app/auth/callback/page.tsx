"use client";

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { Separator } from '../../components/ui/separator';
import { useAuthContext } from '../../../lib/auth-context';

const decodeUser = (encoded: string) => {
    try {
        const normalized = encoded.replace(/-/g, '+').replace(/_/g, '/');
        const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
        const json = atob(padded);
        return JSON.parse(json);
    } catch (error) {
        console.error('Failed to decode user payload', error);
        return null;
    }
};

const CallbackPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { initializeSession } = useAuthContext();

    const [status, setStatus] = useState<'processing' | 'error'>('processing');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const payload = useMemo(() => {
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');
        const encodedUser = searchParams.get('user');

        return {
            accessToken,
            refreshToken,
            user: encodedUser ? decodeUser(encodedUser) : null,
        };
    }, [searchParams]);

    useEffect(() => {
        if (!payload.accessToken || !payload.refreshToken || !payload.user) {
            setStatus('error');
            setErrorMessage('Không thể hoàn tất đăng nhập Google. Vui lòng thử lại.');
            return;
        }

        initializeSession({
            accessToken: payload.accessToken,
            refreshToken: payload.refreshToken,
            user: payload.user,
        });

        const timeout = setTimeout(() => {
            router.replace('/');
        }, 1500);

        return () => clearTimeout(timeout);
    }, [initializeSession, payload.accessToken, payload.refreshToken, payload.user, router]);

    const handleBackToAuth = () => {
        router.replace('/auth');
    };

    return (
        <div className="flex min-h-[calc(100vh-120px)] items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12">
            <Card className="w-full max-w-md border-blue-100/60 shadow-lg">
                <CardHeader className="text-center space-y-1">
                    <CardTitle className="text-2xl font-semibold text-gray-900">
                        Đang xử lý đăng nhập Google
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {status === 'processing' ? (
                        <div className="flex flex-col items-center gap-4 text-center text-gray-600">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                            <p>Chúng tôi đang thiết lập tài khoản của bạn. Bạn sẽ được chuyển hướng trong giây lát.</p>
                        </div>
                    ) : (
                        <Alert variant="destructive">
                            <ShieldAlert className="h-4 w-4" />
                            <AlertTitle>Không thể hoàn tất đăng nhập</AlertTitle>
                            <AlertDescription>
                                {errorMessage || 'Đã xảy ra lỗi trong quá trình xác thực. Vui lòng thử lại.'}
                            </AlertDescription>
                        </Alert>
                    )}

                    <Separator />

                    <div className="flex justify-center">
                        <Button variant="outline" onClick={handleBackToAuth} disabled={status === 'processing'}>
                            Quay lại trang đăng nhập
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CallbackPage;
