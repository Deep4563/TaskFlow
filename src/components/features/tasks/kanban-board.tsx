"use client";

import { useEffect, useState } from "react";
import { useKanbanStore, TaskStatus, TaskItem } from "@/store/useKanbanStore";
import KanbanColumn from "./kanban-column";
import CreateTaskModal from "./create-task-modal";

interface KanbanBoardProps {
  projectId: string;
}

export default function KanbanBoard({ projectId }: KanbanBoardProps) {
  const {
    columns,
    isLoading,
    error,
    setTasks,
    setLoading,
    setError,
    setActiveProject,
  } = useKanbanStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>("todo");
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);
      setActiveProject(projectId);

      try {
        const res = await fetch(`/api/tasks?projectId=${projectId}`);
        const data = await res.json();

        if (data.success) {
          // Cast to TaskItem[] — API returns plain JSON not Mongoose objects
          setTasks(data.data.tasks as TaskItem[]);
        } else {
          setError(data.error);
        }
      } catch {
        setError("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    if (projectId) fetchTasks();
  }, [projectId]);

  const handleAddTask = (status: TaskStatus) => {
    setDefaultStatus(status);
    setIsModalOpen(true);
  };

  const handleTaskClick = (task: TaskItem) => {
    setSelectedTask(task);
    console.log("Task clicked:", task.title);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-gray-50 rounded-xl border border-gray-200 h-96 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-indigo-600 mt-2 hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            tasks={column.tasks}
            onAddTask={handleAddTask}
            onTaskClick={handleTaskClick}
          />
        ))}
      </div>

      {isModalOpen && (
        <CreateTaskModal
          projectId={projectId}
          defaultStatus={defaultStatus}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}