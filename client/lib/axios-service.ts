import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// API Response Types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  error: string;
  message?: string;
  statusCode?: number;
}

// Axios Service Class
class AxiosService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
      timeout: 15000, // Reduced timeout to 15 seconds for better UX
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        return this.handleError(error);
      }
    );
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  private handleError(error: AxiosError): Promise<never> {
    let errorMessage = '予期しないエラーが発生しました';

    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data as ApiError;

      switch (status) {
        case 401:
          errorMessage = '認証が必要です。ログインしてください。';
          // Clear auth token and redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
          }
          break;
        case 403:
          errorMessage = 'アクセス権限がありません。';
          break;
        case 404:
          errorMessage = 'リソースが見つかりません。';
          break;
        case 500:
          errorMessage = 'サーバー内部エラーが発生しました。';
          break;
        default:
          errorMessage = data?.error || data?.message || `HTTP ${status} エラーが発生しました`;
      }
    } else if (error.request) {
      // Network error
      errorMessage = 'サーバーに接続できません。ネットワーク接続を確認してください。';
    } else {
      // Other error
      errorMessage = error.message || 'リクエストの準備中にエラーが発生しました';
    }

    const customError = new Error(errorMessage);
    (customError as any).status = error.response?.status;
    (customError as any).data = error.response?.data;
    
    return Promise.reject(customError);
  }

  // Generic request method with retry logic
  async request<T = any>(config: AxiosRequestConfig, retries: number = 3): Promise<T> {
    try {
      const response = await this.axiosInstance.request<T>(config);
      return response.data;
    } catch (error) {
      // Retry on network errors or 5xx server errors
      if (retries > 0 && this.shouldRetry(error)) {
        console.log(`Request failed, retrying... (${retries} attempts left)`);
        await this.delay(1000 * (4 - retries)); // Exponential backoff
        return this.request<T>(config, retries - 1);
      }
      throw error;
    }
  }

  private shouldRetry(error: any): boolean {
    // Retry on network errors or 5xx server errors
    if (error.code === 'ECONNABORTED' || error.code === 'ENOTFOUND' || error.code === 'ECONNRESET') {
      return true;
    }
    
    if (error.response) {
      const status = error.response.status;
      return status >= 500 && status < 600;
    }
    
    return false;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // HTTP Methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH', url, data });
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }


  // Utility Methods
  setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  clearAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }

  // Get the underlying axios instance for advanced usage
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

// Create and export a singleton instance
export const axiosService = new AxiosService();

// Export the class for custom instances if needed
export { AxiosService };

// Export default for convenience
export default axiosService;
