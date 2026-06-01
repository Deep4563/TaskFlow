import crypto from "crypto";
import { connectDB } from "@/lib/db";
import Invitation from "@/models/invitation.model";
import Project from "@/models/project.model";
import User from "@/models/user.model";
import { sendInviteEmail } from "@/lib/email";
import mongoose from "mongoose";

export const invitationService = {
  async sendInvitation({
    projectId,
    invitedByUserId,
    email,
    role = "member",
  }: {
    projectId: string;
    invitedByUserId: string;
    email: string;
    role?: "admin" | "member";
  }) {
    await connectDB();

    // Get project
    const project = await Project.findById(projectId).populate(
      "owner",
      "name"
    );
    if (!project) throw new Error("Project not found");

    // Check inviter has permission
    const inviter = await User.findById(invitedByUserId);
    if (!inviter) throw new Error("Inviter not found");

    // Check if already a member
    const alreadyMember = project.members.some(
  (m: { user: mongoose.Types.ObjectId | string; role: string }) =>
    m.user.toString() === invitedByUserId
);
    // Check if already invited
    const existingInvite = await Invitation.findOne({
      email: email.toLowerCase(),
      projectId,
      status: "pending",
    });

    if (existingInvite) {
      throw new Error("An invitation has already been sent to this email");
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString("hex");

    // Create invitation
    const invitation = await Invitation.create({
      email: email.toLowerCase(),
      projectId: new mongoose.Types.ObjectId(projectId),
      invitedBy: new mongoose.Types.ObjectId(invitedByUserId),
      role,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    // Send email
    const inviteUrl = `${process.env.NEXTAUTH_URL}/invite?token=${token}`;

    await sendInviteEmail({
      to: email,
      inviterName: inviter.name,
      projectName: project.name,
      inviteUrl,
    });

    return invitation;
  },

  async acceptInvitation(token: string, userId: string) {
    await connectDB();

    // Find valid invitation
    const invitation = await Invitation.findOne({
      token,
      status: "pending",
      expiresAt: { $gt: new Date() },
    });

    if (!invitation) {
      throw new Error("Invitation not found or expired");
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    // Check email matches
    if (user.email !== invitation.email) {
      throw new Error("This invitation was sent to a different email address");
    }

    // Add user to project
    const project = await Project.findById(invitation.projectId);
    if (!project) throw new Error("Project not found");

    // Check not already a member
   const alreadyMember = project.members.some(
  (m: { user: mongoose.Types.ObjectId | string; role: string }) =>
    m.user.toString() === userId
);

    if (!alreadyMember) {
      project.members.push({
        user: new mongoose.Types.ObjectId(userId),
        role: invitation.role,
        joinedAt: new Date(),
      });
      await project.save();
    }

    // Mark invitation as accepted
    invitation.status = "accepted";
    await invitation.save();

    return project;
  },

  async getProjectInvitations(projectId: string) {
    await connectDB();

    return Invitation.find({
      projectId,
      status: "pending",
    })
      .populate("invitedBy", "name email")
      .sort({ createdAt: -1 });
  },
};