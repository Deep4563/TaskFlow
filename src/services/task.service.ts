import { connectDB } from "@/lib/db";
import Task, { ITask } from "@/models/task.model";
import Project from "@/models/project.model";
import mongoose from "mongoose";

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: "todo" | "in-progress" | "done";
  priority?: "low" | "medium" | "high";
  assigneeId?: string;
  projectId: string;
  createdById: string;
  dueDate?: Date;
  tags?: string[];
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: "todo" | "in-progress" | "done";
  priority?: "low" | "medium" | "high";
  assigneeId?: string | null;
  dueDate?: Date | null;
  tags?: string[];
  order?: number;
}

export const taskService = {
  // Create task
  async createTask(data: CreateTaskData): Promise<ITask> {
    await connectDB();

    // Verify user is a member of the project
    const project = await Project.findOne({
      _id: new mongoose.Types.ObjectId(data.projectId),
      $or: [
        { owner: new mongoose.Types.ObjectId(data.createdById) },
        { "members.user": new mongoose.Types.ObjectId(data.createdById) },
      ],
    });

    if (!project) {
      throw new Error("Project not found or unauthorized");
    }

    // Get highest order for this status column
    const lastTask = await Task.findOne({
      project: data.projectId,
      status: data.status ?? "todo",
    }).sort({ order: -1 });

    const order = lastTask ? lastTask.order + 1 : 0;

    const task = await Task.create({
      title: data.title,
      description: data.description ?? "",
      status: data.status ?? "todo",
      priority: data.priority ?? "medium",
      assignee: data.assigneeId
        ? new mongoose.Types.ObjectId(data.assigneeId)
        : null,
      project: new mongoose.Types.ObjectId(data.projectId),
      createdBy: new mongoose.Types.ObjectId(data.createdById),
      dueDate: data.dueDate ?? null,
      tags: data.tags ?? [],
      order,
    });

    return task.populate(["assignee", "createdBy"]);
  },

  // Get tasks for a project
  async getProjectTasks(
    projectId: string,
    userId: string
  ): Promise<ITask[]> {
    await connectDB();

    // Verify access
    const project = await Project.findOne({
      _id: new mongoose.Types.ObjectId(projectId),
      $or: [
        { owner: new mongoose.Types.ObjectId(userId) },
        { "members.user": new mongoose.Types.ObjectId(userId) },
      ],
    });

    if (!project) {
      throw new Error("Project not found or unauthorized");
    }

    const tasks = await Task.find({
      project: new mongoose.Types.ObjectId(projectId),
    })
      .populate("assignee", "name email avatar")
      .populate("createdBy", "name email")
      .sort({ order: 1, createdAt: -1 });

    return tasks;
  },

  // Get single task
  async getTaskById(
    taskId: string,
    userId: string
  ): Promise<ITask | null> {
    await connectDB();

    const task = await Task.findById(taskId)
      .populate("assignee", "name email avatar")
      .populate("createdBy", "name email")
      .populate("project", "name");

    if (!task) return null;

    // Verify user has access to this task's project
    const project = await Project.findOne({
      _id: task.project,
      $or: [
        { owner: new mongoose.Types.ObjectId(userId) },
        { "members.user": new mongoose.Types.ObjectId(userId) },
      ],
    });

    if (!project) return null;

    return task;
  },

  // Update task
  async updateTask(
    taskId: string,
    userId: string,
    data: UpdateTaskData
  ): Promise<ITask | null> {
    await connectDB();

    const task = await Task.findById(taskId);
    if (!task) return null;

    // Verify access
    const project = await Project.findOne({
      _id: task.project,
      $or: [
        { owner: new mongoose.Types.ObjectId(userId) },
        { "members.user": new mongoose.Types.ObjectId(userId) },
      ],
    });

    if (!project) return null;

    // Build update object
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.dueDate !== undefined) updateData.dueDate = data.dueDate;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.order !== undefined) updateData.order = data.order;
    if (data.assigneeId !== undefined) {
      updateData.assignee = data.assigneeId
        ? new mongoose.Types.ObjectId(data.assigneeId)
        : null;
    }

    const updated = await Task.findByIdAndUpdate(
      taskId,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate("assignee", "name email avatar")
      .populate("createdBy", "name email");

    return updated;
  },

  // Update task status only (for Kanban drag and drop)
  async updateTaskStatus(
    taskId: string,
    userId: string,
    status: "todo" | "in-progress" | "done",
    order: number
  ): Promise<ITask | null> {
    await connectDB();

    const task = await Task.findById(taskId);
    if (!task) return null;

    // Verify access
    const project = await Project.findOne({
      _id: task.project,
      $or: [
        { owner: new mongoose.Types.ObjectId(userId) },
        { "members.user": new mongoose.Types.ObjectId(userId) },
      ],
    });

    if (!project) return null;

    const updated = await Task.findByIdAndUpdate(
      taskId,
      { $set: { status, order } },
      { new: true }
    ).populate("assignee", "name email avatar");

    return updated;
  },

  // Delete task
  async deleteTask(
    taskId: string,
    userId: string
  ): Promise<boolean> {
    await connectDB();

    const task = await Task.findById(taskId);
    if (!task) return false;

    // Only creator or project owner can delete
    const project = await Project.findOne({
      _id: task.project,
      $or: [
        { owner: new mongoose.Types.ObjectId(userId) },
        { "members.user": new mongoose.Types.ObjectId(userId) },
      ],
    });

    if (!project) return false;

    await Task.findByIdAndDelete(taskId);
    return true;
  },

  // Get tasks grouped by status (for Kanban board)
  async getTasksGroupedByStatus(
    projectId: string,
    userId: string
  ): Promise<{
    todo: ITask[];
    "in-progress": ITask[];
    done: ITask[];
  }> {
    const tasks = await this.getProjectTasks(projectId, userId);

    return {
      todo: tasks.filter((t) => t.status === "todo"),
      "in-progress": tasks.filter((t) => t.status === "in-progress"),
      done: tasks.filter((t) => t.status === "done"),
    };
  },
};