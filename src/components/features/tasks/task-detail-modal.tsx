"use client";

import { useState } from "react";
import {
  X,
  Calendar,
  User,
  Flag,
  MessageSquare,
  Edit2,
  Check,
  Trash2,
} from "lucide-react";
import { TaskItem, CommentItem, useKanbanStore } from "@/store/useKanbanStore";
import { PRIORITY_CONFIG, STATUS_CONFIG } from "@/constants";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/button";

interface TaskDetailModalProps {
  task: TaskItem;
  onClose: () => void;
}

export default function TaskDetailModal({
  task,
  onClose,
}: TaskDetailModalProps) {
  const { updateTask } = useKanbanStore();
  const { user } = useAuth();

  // Edit states
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [priority, setPriority] = useState(task.priority);

  // Comment states
  const [comments, setComments] = useState<CommentItem[]>(
    task.comments ?? []
  );
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  // Save title
  const saveTitle = async () => {
    if (!title.trim() || title.trim().length < 2) return;
    setIsSaving(true);

    try {
      const res = await fetch(`/api/tasks/${task._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim() }),
      });

      const data = await res.json();
      if (data.success) {
        updateTask(task._id, { title: title.trim() });
        setIsEditingTitle(false);
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Save description
  const saveDescription = async () => {
    setIsSaving(true);

    try {
      const res = await fetch(`/api/tasks/${task._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: description.trim() }),
      });

      const data = await res.json();
      if (data.success) {
        updateTask(task._id, { description: description.trim() });
        setIsEditingDesc(false);
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Save priority
  const savePriority = async (
    newPriority: "low" | "medium" | "high"
  ) => {
    setPriority(newPriority);

    await fetch(`/api/tasks/${task._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priority: newPriority }),
    });

    updateTask(task._id, { priority: newPriority });
  };

  // Add comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setIsSubmittingComment(true);

    try {
      const res = await fetch(`/api/tasks/${task._id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        setComments((prev) => [...prev, data.data.comment]);
        setNewComment("");
      }
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId: string) => {
    try {
      const res = await fetch(
        `/api/tasks/${task._id}/comments?commentId=${commentId}`,
        { method: "DELETE" }
      );

      const data = await res.json();
      if (data.success) {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
      }
    } catch {
      console.error("Failed to delete comment");
    }
  };

  const priorityConfig = PRIORITY_CONFIG[priority];
  const statusConfig = STATUS_CONFIG[task.status];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-gray-100">
          <div className="flex-1 mr-4">
            {isEditingTitle ? (
              <div className="flex items-center gap-2">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="flex-1 text-lg font-semibold border-b-2 border-indigo-500 outline-none bg-transparent"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && saveTitle()}
                />
                <button
                  onClick={saveTitle}
                  className="p-1 text-green-600 hover:bg-green-50 rounded"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setTitle(task.title);
                    setIsEditingTitle(false);
                  }}
                  className="p-1 text-gray-400 hover:bg-gray-50 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 group">
                <h3 className="text-lg font-semibold text-gray-800">
                  {title}
                </h3>
                <button
                  onClick={() => setIsEditingTitle(true)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-indigo-600 rounded transition-all"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* Meta info */}
          <div className="flex flex-wrap gap-3">
            {/* Status */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-medium">Status</span>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${statusConfig.bg} ${statusConfig.color}`}
              >
                {statusConfig.label}
              </span>
            </div>

            {/* Priority */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-medium">
                Priority
              </span>
              <div className="flex gap-1">
                {(["low", "medium", "high"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => savePriority(p)}
                    className={`text-xs font-medium px-2 py-1 rounded-full border transition-colors capitalize ${
                      priority === p
                        ? `${PRIORITY_CONFIG[p].bg} ${PRIORITY_CONFIG[p].color} ${PRIORITY_CONFIG[p].border}`
                        : "bg-gray-50 text-gray-400 border-gray-200"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Due date */}
            {task.dueDate && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(task.dueDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            )}

            {/* Assignee */}
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <User className="w-3.5 h-3.5" />
              {task.assignee
                ? task.assignee.name
                : "Unassigned"}
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700">
                Description
              </h4>
              {!isEditingDesc && (
                <button
                  onClick={() => setIsEditingDesc(true)}
                  className="text-xs text-indigo-600 hover:underline"
                >
                  Edit
                </button>
              )}
            </div>

            {isEditingDesc ? (
              <div className="space-y-2">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-indigo-300 rounded-lg text-sm outline-none focus:border-indigo-500 resize-none"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={saveDescription}
                    disabled={isSaving}
                    className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setDescription(task.description ?? "");
                      setIsEditingDesc(false);
                    }}
                    className="text-xs text-gray-500 px-3 py-1.5 rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 leading-relaxed">
                {description || (
                  <span className="text-gray-300 italic">
                    No description yet. Click Edit to add one.
                  </span>
                )}
              </p>
            )}
          </div>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Comments ({comments.length})
            </h4>

            {/* Comment list */}
            <div className="space-y-3 mb-4">
              {comments.length === 0 ? (
                <p className="text-xs text-gray-400 italic">
                  No comments yet. Be the first to comment.
                </p>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="flex items-start gap-3 group"
                  >
                    {/* Avatar */}
                    <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-indigo-600">
                        {comment.user?.name?.charAt(0).toUpperCase() ?? "?"}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-700">
                          {comment.user?.name ?? "Unknown"}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">
                            {new Date(
                              comment.createdAt
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          {/* Delete own comment */}
                          {comment.user?._id === user?.id && (
                            <button
                              onClick={() =>
                                handleDeleteComment(comment._id)
                              }
                              className="opacity-0 group-hover:opacity-100 p-0.5 text-gray-300 hover:text-red-500 transition-all"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add comment */}
            <div className="flex gap-2">
              <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-semibold text-indigo-600">
                  {user?.name?.charAt(0).toUpperCase() ?? "?"}
                </span>
              </div>
              <div className="flex-1 flex gap-2">
                <input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAddComment();
                    }
                  }}
                />
                <Button
                  isLoading={isSubmittingComment}
                  onClick={handleAddComment}
                  className="w-auto px-4"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}