"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { TaskItem, TaskStatus } from "@/store/useKanbanStore";
import { STATUS_CONFIG } from "@/constants";
import SortableTaskCard from "./sortable-task-card";

interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  tasks: TaskItem[];
  onAddTask?: (status: TaskStatus) => void;
  onTaskClick?: (task: TaskItem) => void;
}

export default function KanbanColumn({
  id,
  title,
  tasks,
  onAddTask,
  onTaskClick,
}: KanbanColumnProps) {
  const config = STATUS_CONFIG[id];

  // Make this column a drop zone
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      className={`flex flex-col rounded-xl border min-h-[500px] w-full transition-colors ${
        isOver
          ? "border-indigo-300 bg-indigo-50/50"
          : "border-gray-200 bg-gray-50"
      }`}
    >
      {/* Column header */}
      <div
        className={`px-4 py-3 rounded-t-xl border-b border-gray-200 ${config.headerBg}`}
      >
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${config.dot}`} />
          <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
          <span
            className={`text-xs font-medium rounded-full px-2 py-0.5 ${
              tasks.length > 3
                ? "bg-indigo-100 text-indigo-600"
                : "bg-white text-gray-400 border border-gray-200"
            }`}
          >
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Drop zone + sortable tasks */}
      <div ref={setNodeRef} className="flex-1 p-3 space-y-2 overflow-y-auto">
        <SortableContext
          items={tasks.map((t) => t._id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <p className="text-xs text-gray-400">No tasks here</p>
              <p className="text-xs text-gray-300 mt-1">
                Drop tasks here or add new
              </p>
            </div>
          ) : (
            tasks.map((task) => (
              <SortableTaskCard
                key={task._id}
                task={task}
                onClick={onTaskClick}
              />
            ))
          )}
        </SortableContext>
      </div>

      {/* Add task button */}
      <div className="p-3 border-t border-gray-200">
        <button
          onClick={() => onAddTask?.(id)}
          className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-dashed border-gray-300 hover:border-indigo-300"
        >
          <Plus className="w-3.5 h-3.5" />
          Add task
        </button>
      </div>
    </div>
  );
}