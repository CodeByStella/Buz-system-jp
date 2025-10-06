import axiosService from '../axios-service';

// User Types
export interface UserInputRequest {
  sheet: string;
  cellKey: string;
  value: number;
}

export interface UserInput {
  id: string;
  sheet: string;
  cellKey: string;
  value: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CalculateRequest {
  sheet: string;
  inputs: Record<string, number>;
}

export interface CalculateResponse {
  results: Record<string, number>;
  sheet: string;
  calculatedAt: string;
}

// User Service
class UserService {
  async getUserInputs(sheet?: string): Promise<UserInput[]> {
    const params = sheet ? `?sheet=${sheet}` : '';
    return axiosService.get<UserInput[]>(`/api/user/inputs${params}`);
  }

  async saveUserInput(input: UserInputRequest): Promise<UserInput> {
    return axiosService.post<UserInput>('/api/user/inputs', input);
  }

  async updateUserInput(id: string, input: Partial<UserInputRequest>): Promise<UserInput> {
    return axiosService.put<UserInput>(`/api/user/inputs/${id}`, input);
  }

  async deleteUserInput(id: string): Promise<void> {
    return axiosService.delete(`/api/user/inputs/${id}`);
  }

  async calculate(params: CalculateRequest): Promise<CalculateResponse> {
    return axiosService.post<CalculateResponse>('/api/calculate', params);
  }

  // Get inputs for specific sheet
  async getSheetInputs(sheet: string): Promise<UserInput[]> {
    return this.getUserInputs(sheet);
  }

  // Save multiple inputs at once
  async saveMultipleInputs(inputs: UserInputRequest[]): Promise<UserInput[]> {
    return axiosService.post<UserInput[]>('/api/user/inputs/batch', { inputs });
  }
}

// Export singleton instance
export const userService = new UserService();
export default userService;
