import { NextRequest, NextResponse } from "next/server";
import { taskService } from "@/services/task.service";
import {
  getAuthenticatedUser,
  unauthorizedResponse,
} from "@/lib/auth-middleware";

// GET /api/tasks?projectId=xxx
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) return unauthorizedResponse();

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: "projectId is required" },
        { status: 400 }
      );
    }

    const tasks = await taskService.getProjectTasks(projectId, user.id);

    return NextResponse.json({
      success: true,
      data: { tasks },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message ?? "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// POST /api/tasks
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) return unauthorizedResponse();

    const body = await request.json();
    const { title, description, status, priority, projectId, assigneeId, dueDate, tags } = body;

    if (!title || title.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Task title must be at least 2 characters" },
        { status: 400 }
      );
    }

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: "projectId is required" },
        { status: 400 }
      );
    }

    const task = await taskService.createTask({
      title: title.trim(),
      description,
      status,
      priority,
      projectId,
      assigneeId,
      createdById: user.id,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      tags,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Task created successfully",
        data: { task },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message ?? "Failed to create task" },
      { status: 500 }
    );
  }
}