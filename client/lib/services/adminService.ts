import axiosService from "../axios-service";

// User Management Types
export interface User {
  id: string;
  email: string;
  name?: string;
  description?: string;
  role: "ADMIN" | "USER";
  status: "ACTIVE" | "PAUSED";
  subscriptionStartAt?: string;
  subscriptionEndAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  name?: string;
  description?: string;
  subscriptionStartAt?: string;
  subscriptionEndAt?: string;
}

export interface UpdateUserRequest {
  name?: string;
  description?: string;
  subscriptionStartAt?: string | null;
  subscriptionEndAt?: string | null;
  email?: string;
  password?: string;
}

export interface UsersResponse {
  users: User[];
  totalPages: number;
  currentPage: number;
  totalUsers: number;
}

// Admin Service
class AdminService {
  // User Management
  async getUsers(page: number = 1, limit: number = 10): Promise<UsersResponse> {
    return axiosService.get<UsersResponse>(
      `/api/admin/users?page=${page}&limit=${limit}`
    );
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    return axiosService.post<User>("/api/admin/users", userData);
  }

  async updateUser(userId: string, userData: UpdateUserRequest): Promise<User> {
    return axiosService.put<User>(`/api/admin/users/${userId}`, userData);
  }

  async updateUserStatus(
    userId: string,
    status: "ACTIVE" | "PAUSED"
  ): Promise<User> {
    return axiosService.patch<User>(`/api/admin/users/${userId}/status`, {
      status,
    });
  }

  async deleteUser(userId: string): Promise<void> {
    return axiosService.delete(`/api/admin/users/${userId}`);
  }
}

// Export singleton instance
export const adminService = new AdminService();
export default adminService;
