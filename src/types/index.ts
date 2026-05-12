export * from "./user.types";
export * from "./project.types";
export * from "./task.types";

// Global API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}