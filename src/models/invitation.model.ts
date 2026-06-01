import mongoose, { Document, Schema } from "mongoose";

export interface IInvitation extends Document {
  email: string;
  projectId: mongoose.Types.ObjectId;
  invitedBy: mongoose.Types.ObjectId;
  role: "admin" | "member";
  token: string;
  status: "pending" | "accepted" | "expired";
  expiresAt: Date;
  createdAt: Date;
}

const InvitationSchema = new Schema<IInvitation>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    invitedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member",
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "expired"],
      default: "pending",
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-expire index
InvitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
InvitationSchema.index({ token: 1 });
InvitationSchema.index({ email: 1, projectId: 1 });

export default mongoose.models.Invitation ||
  mongoose.model<IInvitation>("Invitation", InvitationSchema);