import { NextRequest, NextResponse } from "next/server";
import { invitationService } from "@/services/invitation.service";
import {
  getAuthenticatedUser,
  unauthorizedResponse,
} from "@/lib/auth-middleware";

// POST /api/invite/accept
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) return unauthorizedResponse();

    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Token is required" },
        { status: 400 }
      );
    }

    const project = await invitationService.acceptInvitation(token, user.id);

    return NextResponse.json({
      success: true,
      message: "Successfully joined the project",
      data: { project },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message ?? "Failed to accept invitation" },
      { status: 400 }
    );
  }
}