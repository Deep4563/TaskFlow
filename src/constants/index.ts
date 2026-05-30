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

export const PRIORITY_CONFIG = {
  low: {
    label: "Low",
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
    dot: "bg-green-500",
  },
  medium: {
    label: "Medium",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  high: {
    label: "High",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    dot: "bg-red-500",
  },
} as const;

export const STATUS_CONFIG = {
  "todo": {
    label: "To Do",
    color: "text-gray-600",
    bg: "bg-gray-100",
    headerBg: "bg-gray-50",
    border: "border-gray-200",
    dot: "bg-gray-400",
  },
  "in-progress": {
    label: "In Progress",
    color: "text-blue-600",
    bg: "bg-blue-50",
    headerBg: "bg-blue-50",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
  "done": {
    label: "Done",
    color: "text-green-600",
    bg: "bg-green-50",
    headerBg: "bg-green-50",
    border: "border-green-200",
    dot: "bg-green-500",
  },
} as const;