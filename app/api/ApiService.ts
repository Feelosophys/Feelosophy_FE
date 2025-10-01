class ApiService {
    private baseUrl: string;

    constructor(baseUrl: string = 'http://localhost:5000/api/v1') {
        this.baseUrl = baseUrl;
    }

    private async request<T>(
        endpoint: string,
        method: string,
        body?: Record<string, unknown>,
        headers: Record<string, string> = { 'Content-Type': 'application/json' }
    ): Promise<T> {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method,
                headers,
                body: body ? JSON.stringify(body) : undefined,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Request failed');
            }

            return response.json();
        } catch (err) {
            throw err instanceof Error ? err : new Error('An unexpected error occurred');
        }
    }

    async login(email: string, password: string) {
        return this.request('/auth/login', 'POST', { email, password });
    }

    async register(name: string, email: string, phone: string, password: string) {
        return this.request('/auth/register', 'POST', { name, email, phone, password });
    }

    async sendVerificationCode(email: string) {
        return this.request('/auth/change-password', 'POST', { email });
    }

    async verifyCode(email: string, verificationCode: string) {
        return this.request('/auth/change-password', 'POST', { email, verificationCode });
    }

    async resetPassword(email: string, verificationCode: string, newPassword: string) {
        return this.request('/auth/change-password', 'POST', { email, verificationCode, newPassword });
    }

    getGoogleAuthUrl() {
        return `${this.baseUrl}/auth/google/callback`;
    }
}

export const apiService = new ApiService();