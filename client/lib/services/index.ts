// Export all services for easy importing
export { default as authService } from "./authService";
export { default as userService } from "./userService";
export { default as adminService } from "./adminService";
export { default as pdfService } from "./pdfService";

// Export types
export type { LoginRequest, LoginResponse, User } from "./authService";
export type { UserInputRequest, UserInput } from "./userService";
export type {
  Parameter,
  ParameterUpdateRequest,
  ParameterCreateRequest,
} from "./adminService";
export type { PdfGenerateRequest, PdfGenerateResponse } from "./pdfService";
