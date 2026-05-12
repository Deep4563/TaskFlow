import { User } from "./user.types";

export type ProjectRole = "owner" | "admin" | "member";

export interface ProjectMember {
  user: User;
  role: ProjectRole;
  joinedAt: Date;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  owner: User;
  members: ProjectMember[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
}