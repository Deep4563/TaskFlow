"use client";

import { Calendar, User } from "lucide-react";
import { TaskItem } from "@/store/useKanbanStore";
import { PRIORITY_CONFIG } from "@/constants";

interface TaskCardProps {
  task: TaskItem;
  onClick?: (task: TaskItem) => void;
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
  const priority = PRIORITY_CONFIG[task.priority];

  return (
    <div
      onClick={() => onClick?.(task)}
      className="bg-white rounded-lg border border-gray-100 p-3 shadow-sm hover:shadow-md transition-all cursor-pointer group"
    >
      {/* Priority badge */}
      <div className="flex items-center justify-between mb-2">
        <span
          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${priority.bg} ${priority.color}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
          {priority.label}
        </span>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
            {task.tags[0]}
          </span>
        )}
      </div>

      {/* Title */}
      <p className="text-sm font-medium text-gray-800 line-clamp-2 mb-3">
        {task.title}
      </p>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-400 line-clamp-2 mb-3">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
        {/* Assignee */}
        <div className="flex items-center gap-1.5">
          {task.assignee ? (
            <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-xs font-medium text-indigo-600">
                {(task.assignee as any).name?.charAt(0).toUpperCase()}
              </span>
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
              <User className="w-3 h-3 text-gray-400" />
            </div>
          )}
          <span className="text-xs text-gray-400">
            {task.assignee
              ? (task.assignee as any).name?.split(" ")[0]
              : "Unassigned"}
          </span>
        </div>

        {/* Due date */}
        {task.dueDate && (
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Calendar className="w-3 h-3" />
            {new Date(task.dueDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </div>
        )}
      </div>
    </div>
  );
}