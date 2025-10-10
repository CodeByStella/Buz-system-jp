import axiosService from '../axios-service';
import { BackendDataType } from '../transformers/dataTransformer';


// User Service
class UserService {
  async getUserInputs(): Promise<BackendDataType[]> {
    return axiosService.get<BackendDataType[]>(`/api/user/inputs`);
  }

  async saveUserInput(input: BackendDataType): Promise<BackendDataType> {
    return axiosService.post<BackendDataType>('/api/user/inputs', input);
  }

  // Save multiple inputs at once
  async saveMultipleInputs(inputs: BackendDataType[]): Promise<BackendDataType[]> {
    return axiosService.post<BackendDataType[]>('/api/user/inputs/bulk', { inputs });
  }
}

// Export singleton instance
export const userService = new UserService();
export default userService;
