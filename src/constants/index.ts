import { TASK_STATUS, TASK_PRIORITY } from "@/types";

export { TASK_STATUS, TASK_PRIORITY };

export const APP_NAME = "TaskFlow";
export const API_BASE = "/api";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  PROJECTS: "/projects",
  TASKS: "/tasks",
} as const;