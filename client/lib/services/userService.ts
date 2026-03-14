import axiosService from '../axios-service';
import { BackendDataType, WorkbookType } from '../transformers/dataTransformer';

const defaultWorkbook: WorkbookType = 'pdca';

class UserService {
  async getUserInputs(workbook: WorkbookType = defaultWorkbook): Promise<BackendDataType[]> {
    return axiosService.get<BackendDataType[]>(`/api/user/inputs`, {
      params: { workbook },
    });
  }

  async saveUserInput(input: BackendDataType, workbook: WorkbookType = defaultWorkbook): Promise<BackendDataType> {
    return axiosService.post<BackendDataType>('/api/user/inputs', { ...input, workbook });
  }

  async saveMultipleInputs(
    inputs: BackendDataType[],
    workbook: WorkbookType = defaultWorkbook
  ): Promise<BackendDataType[]> {
    return axiosService.post<BackendDataType[]>('/api/user/inputs/bulk', { inputs, workbook });
  }

  async resetUserData(
    workbook: WorkbookType = defaultWorkbook
  ): Promise<{ success: boolean; message: string; resetCompleted: boolean }> {
    return axiosService.post<{ success: boolean; message: string; resetCompleted: boolean }>(
      '/api/user/reset',
      { workbook },
      { timeout: 35000 }
    );
  }
}

// Export singleton instance
export const userService = new UserService();
export default userService;
