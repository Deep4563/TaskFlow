import mongoose, { Document, Schema } from "mongoose";

export interface IComment {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
}

export interface ITask extends Document {
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  assignee?: mongoose.Types.ObjectId;
  project: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  dueDate?: Date;
  order: number;
  tags: string[];
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, "Comment cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
  }
);

const TaskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: [2, "Title must be at least 2 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    assignee: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    order: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
    comments: {
      type: [CommentSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

TaskSchema.index({ project: 1, status: 1 });
TaskSchema.index({ assignee: 1 });
TaskSchema.index({ project: 1, order: 1 });

export default mongoose.models.Task ||
  mongoose.model<ITask>("Task", TaskSchema);