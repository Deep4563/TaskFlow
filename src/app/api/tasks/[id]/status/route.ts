import { NextRequest, NextResponse } from "next/server";
import { taskService } from "@/services/task.service";
import {
  getAuthenticatedUser,
  unauthorizedResponse,
} from "@/lib/auth-middleware";

// PATCH /api/tasks/:id/status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthenticatedUser(request);
    if (!user) return unauthorizedResponse();

    const body = await request.json();
    const { status, order } = body;

    if (!["todo", "in-progress", "done"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status value" },
        { status: 400 }
      );
    }

    const task = await taskService.updateTaskStatus(
      id,
      user.id,
      status,
      order ?? 0
    );

    if (!task) {
      return NextResponse.json(
        { success: false, error: "Task not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Task status updated",
      data: { task },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update task status" },
      { status: 500 }
    );
  }
}