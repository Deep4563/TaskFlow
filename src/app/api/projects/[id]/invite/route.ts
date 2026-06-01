import { NextRequest, NextResponse } from "next/server";
import { invitationService } from "@/services/invitation.service";
import {
  getAuthenticatedUser,
  unauthorizedResponse,
} from "@/lib/auth-middleware";

// POST /api/projects/:id/invite
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthenticatedUser(request);
    if (!user) return unauthorizedResponse();

    const body = await request.json();
    const { email, role = "member" } = body;

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: "Valid email is required" },
        { status: 400 }
      );
    }

    const invitation = await invitationService.sendInvitation({
      projectId: id,
      invitedByUserId: user.id,
      email,
      role,
    });

    return NextResponse.json({
      success: true,
      message: `Invitation sent to ${email}`,
      data: { invitation },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message ?? "Failed to send invitation" },
      { status: 400 }
    );
  }
}

// GET /api/projects/:id/invite — get pending invitations
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthenticatedUser(request);
    if (!user) return unauthorizedResponse();

    const invitations = await invitationService.getProjectInvitations(id);

    return NextResponse.json({
      success: true,
      data: { invitations },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch invitations" },
      { status: 500 }
    );
  }
}