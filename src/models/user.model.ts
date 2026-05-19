import mongoose, { Document, Schema } from "mongoose";
import { UserRole } from "@/types";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // never returned in queries by default
    },
    avatar: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["admin", "member", "viewer"],
      default: "member",
    },
  },
  {
    timestamps: true, // auto adds createdAt and updatedAt
  }
);

// Prevent model recompilation in Next.js hot reload
export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);