import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Task from "@/models/task.model";
import {
  getAuthenticatedUser,
  unauthorizedResponse,
} from "@/lib/auth-middleware";
import mongoose from "mongoose";

// POST /api/tasks/:id/comments
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthenticatedUser(request);
    if (!user) return unauthorizedResponse();

    const body = await request.json();
    const { content } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Comment cannot be empty" },
        { status: 400 }
      );
    }

    if (content.trim().length > 500) {
      return NextResponse.json(
        { success: false, error: "Comment cannot exceed 500 characters" },
        { status: 400 }
      );
    }

    await connectDB();

    const task = await Task.findByIdAndUpdate(
      id,
      {
        $push: {
          comments: {
            user: new mongoose.Types.ObjectId(user.id),
            content: content.trim(),
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    ).populate("comments.user", "name email");

    if (!task) {
      return NextResponse.json(
        { success: false, error: "Task not found" },
        { status: 404 }
      );
    }

    // Return just the last comment
    const newComment = task.comments[task.comments.length - 1];

    return NextResponse.json({
      success: true,
      message: "Comment added",
      data: { comment: newComment },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to add comment" },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/:id/comments
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthenticatedUser(request);
    if (!user) return unauthorizedResponse();

    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get("commentId");

    if (!commentId) {
      return NextResponse.json(
        { success: false, error: "commentId is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const task = await Task.findByIdAndUpdate(
      id,
      {
        $pull: {
          comments: {
            _id: new mongoose.Types.ObjectId(commentId),
            user: new mongoose.Types.ObjectId(user.id),
          },
        },
      },
      { new: true }
    );

    if (!task) {
      return NextResponse.json(
        { success: false, error: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Comment deleted",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}