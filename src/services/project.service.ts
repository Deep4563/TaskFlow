import { connectDB } from "@/lib/db";
import Project, { IProject } from "@/models/project.model";
import mongoose from "mongoose";

export interface CreateProjectData {
  name: string;
  description?: string;
  color?: string;
  ownerId: string;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  color?: string;
}

export const projectService = {
  // Create a new project
  async createProject(data: CreateProjectData): Promise<IProject> {
    await connectDB();

    const project = await Project.create({
      name: data.name,
      description: data.description ?? "",
      color: data.color ?? "#6366f1",
      owner: new mongoose.Types.ObjectId(data.ownerId),
      members: [
        {
          user: new mongoose.Types.ObjectId(data.ownerId),
          role: "owner",
          joinedAt: new Date(),
        },
      ],
    });

    return project;
  },

  // Get all projects for a user (owned + member of)
  async getUserProjects(userId: string): Promise<IProject[]> {
    await connectDB();

    const projects = await Project.find({
      $or: [
        { owner: new mongoose.Types.ObjectId(userId) },
        { "members.user": new mongoose.Types.ObjectId(userId) },
      ],
    })
      .populate("owner", "name email avatar")
      .populate("members.user", "name email avatar")
      .sort({ createdAt: -1 });

    return projects;
  },

  // Get single project by ID
  async getProjectById(
    projectId: string,
    userId: string
  ): Promise<IProject | null> {
    await connectDB();

    const project = await Project.findOne({
      _id: new mongoose.Types.ObjectId(projectId),
      $or: [
        { owner: new mongoose.Types.ObjectId(userId) },
        { "members.user": new mongoose.Types.ObjectId(userId) },
      ],
    })
      .populate("owner", "name email avatar")
      .populate("members.user", "name email avatar");

    return project;
  },

  // Update project
  async updateProject(
    projectId: string,
    userId: string,
    data: UpdateProjectData
  ): Promise<IProject | null> {
    await connectDB();

    const project = await Project.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(projectId),
        owner: new mongoose.Types.ObjectId(userId), // only owner can update
      },
      { $set: data },
      { new: true, runValidators: true }
    );

    return project;
  },

  // Delete project
  async deleteProject(
    projectId: string,
    userId: string
  ): Promise<boolean> {
    await connectDB();

    const result = await Project.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(projectId),
      owner: new mongoose.Types.ObjectId(userId), // only owner can delete
    });

    return !!result;
  },
};