import axiosService from '../axios-service';

// Admin Types
export interface Parameter {
  id: string;
  key: string;
  value: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ParameterUpdateRequest {
  key: string;
  value: number;
  description?: string;
}

export interface ParameterCreateRequest {
  key: string;
  value: number;
  description?: string;
}

// Admin Service
class AdminService {
  async getParameters(): Promise<Parameter[]> {
    return axiosService.get<Parameter[]>('/api/admin/parameters');
  }

  async getParameter(key: string): Promise<Parameter> {
    return axiosService.get<Parameter>(`/api/admin/parameters/${key}`);
  }

  async updateParameter(params: ParameterUpdateRequest): Promise<Parameter> {
    return axiosService.post<Parameter>('/api/admin/parameters', params);
  }

  async createParameter(params: ParameterCreateRequest): Promise<Parameter> {
    return axiosService.post<Parameter>('/api/admin/parameters/create', params);
  }

  async deleteParameter(key: string): Promise<void> {
    return axiosService.delete(`/api/admin/parameters/${key}`);
  }

  // Bulk operations
  async updateMultipleParameters(parameters: ParameterUpdateRequest[]): Promise<Parameter[]> {
    return axiosService.post<Parameter[]>('/api/admin/parameters/batch', { parameters });
  }

  // Get parameters by category or type
  async getParametersByCategory(category: string): Promise<Parameter[]> {
    return axiosService.get<Parameter[]>(`/api/admin/parameters/category/${category}`);
  }
}

// Export singleton instance
export const adminService = new AdminService();
export default adminService;
