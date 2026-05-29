import { NextRequest, NextResponse } from "next/server";
import { projectService } from "@/services/project.service";
import {
  getAuthenticatedUser,
  unauthorizedResponse,
} from "@/lib/auth-middleware";

// GET /api/projects — get all projects
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) return unauthorizedResponse();

    const projects = await projectService.getUserProjects(user.id);

    return NextResponse.json({
      success: true,
      data: { projects },
    });
  } catch (error) {
    console.error("Get projects error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST /api/projects — create project
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) return unauthorizedResponse();

    const body = await request.json();
    const { name, description, color } = body;

    // Validate
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Project name must be at least 2 characters" },
        { status: 400 }
      );
    }

    const project = await projectService.createProject({
      name: name.trim(),
      description,
      color,
      ownerId: user.id,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Project created successfully",
        data: { project },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create project" },
      { status: 500 }
    );
  }
}