"use client";

import { Plus } from "lucide-react";
import { TaskItem, TaskStatus } from "@/store/useKanbanStore";
import { STATUS_CONFIG } from "@/constants";
import TaskCard from "./task-card";

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

  return (
    <div className="flex flex-col bg-gray-50 rounded-xl border border-gray-200 min-h-[500px] w-full">

      {/* Column header */}
      <div className={`px-4 py-3 rounded-t-xl border-b border-gray-200 ${config.headerBg}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${config.dot}`} />
            <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
            <span className="text-xs font-medium text-gray-400 bg-white border border-gray-200 rounded-full px-2 py-0.5">
              {tasks.length}
            </span>
          </div>
        </div>
      </div>

      {/* Tasks */}
      <div className="flex-1 p-3 space-y-2 overflow-y-auto">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <p className="text-xs text-gray-400">No tasks here</p>
            <p className="text-xs text-gray-300 mt-1">
              Drop tasks here or add new
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task._id.toString()}
              task={task}
              onClick={onTaskClick}
            />
          ))
        )}
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