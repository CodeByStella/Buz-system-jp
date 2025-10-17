import axiosService from '../axios-service';

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name?: string;
    role?: "ADMIN" | "USER";
  };
  token?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: "ADMIN" | "USER";
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  user: {
    id: string;
    email: string;
    name?: string;
  };
  token?: string;
}

// Auth Service
class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await axiosService.post<LoginResponse>('/api/auth/login', credentials);
    
    // Store token if provided
    if (response.token && typeof window !== 'undefined') {
      axiosService.setAuthToken(response.token);
    }
    
    return response;
  }

  async signup(payload: SignupRequest): Promise<SignupResponse> {
    const response = await axiosService.post<SignupResponse>('/api/auth/signup', payload);
    if (response.token && typeof window !== 'undefined') {
      axiosService.setAuthToken(response.token);
    }
    return response;
  }

  async logout(): Promise<void> {
    try {
      await axiosService.post('/api/auth/logout');
    } finally {
      // Always clear token, even if logout request fails
      axiosService.clearAuthToken();
    }
  }

  async getCurrentUser(): Promise<User> {
    const res = await axiosService.get<{ user: User } | User>('/api/auth/me');
    // The server returns { user: {...} }
    if ((res as any)?.user) return (res as any).user as User;
    return res as User;
  }

  // Token management
  setAuthToken(token: string): void {
    axiosService.setAuthToken(token);
  }

  clearAuthToken(): void {
    axiosService.clearAuthToken();
  }

  getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
