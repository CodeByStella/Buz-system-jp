import axiosService from '../axios-service';

// User Types
export interface UserInputRequest {
  sheet: string;
  cell: string;
  value: number;
}

export interface UserInput {
  _id: string;
  sheet: string;
  cell: string;
  value: number;
  formula: string;
  user: string;
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
    return axiosService.get<UserInput[]>(`/api/user/inputs`);
  }

  async saveUserInput(input: UserInputRequest): Promise<UserInput> {
    return axiosService.post<UserInput>('/api/user/inputs', input);
  }

  // Save multiple inputs at once
  async saveMultipleInputs(inputs: UserInputRequest[]): Promise<UserInput[]> {
    return axiosService.post<UserInput[]>('/api/user/inputs/bulk', { inputs });
  }
}

// Export singleton instance
export const userService = new UserService();
export default userService;
