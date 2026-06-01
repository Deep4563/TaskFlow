"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCorners,
} from "@dnd-kit/core";
import { useKanbanStore, TaskStatus, TaskItem } from "@/store/useKanbanStore";
import KanbanColumn from "./kanban-column";
import TaskCard from "./task-card";
import CreateTaskModal from "./create-task-modal";
import TaskDetailModal from "./task-detail-modal";
import { useSocket } from "@/components/shared/socket-provider";

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
    moveTask,
  } = useKanbanStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>("todo");
  const [activeTask, setActiveTask] = useState<TaskItem | null>(null);

  const { socket } = useSocket();

  // Add state for selected task
const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);

  // Pointer sensor — requires 8px movement before drag starts
  // prevents accidental drags on click
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
  if (!socket || !projectId) return;

  socket.emit("join-project", projectId);

  // Listen for task moves from other users
  socket.on("task-moved", (data: {
    taskId: string;
    status: TaskStatus;
    order: number;
    movedBy: string;
  }) => {
    // Update store for other users (not the one who moved it)
    moveTask(data.taskId, data.status, data.order);
  });

  return () => {
    socket.emit("leave-project", projectId);
    socket.off("task-moved");
  };
}, [socket, projectId]);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);
      setActiveProject(projectId);

      try {
        const res = await fetch(`/api/tasks?projectId=${projectId}`);
        const data = await res.json();

        if (data.success) {
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

  // Drag start — record which task is being dragged
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = findTaskById(active.id as string);
    setActiveTask(task);
  };

  // Drag over — move task between columns in real time
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeColumn = findColumnByTaskId(activeId);
    const overColumn = findColumnById(overId) ?? findColumnByTaskId(overId);

    if (!activeColumn || !overColumn) return;
    if (activeColumn.id === overColumn.id) return;

    // Move task to new column instantly in UI
    moveTask(activeId, overColumn.id as TaskStatus, 0);
  };

  // Drag end — save to MongoDB
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const overColumn = findColumnById(overId) ?? findColumnByTaskId(overId);
    if (!overColumn) return;

    // Save to MongoDB
    try {
      await fetch(`/api/tasks/${activeId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: overColumn.id,
          order: 0,
        }),
      });
    } catch (err) {
      console.error("Failed to save task status:", err);
    }
  };

  // Helper functions
  const findTaskById = (id: string): TaskItem | null => {
    for (const col of columns) {
      const task = col.tasks.find((t) => t._id === id);
      if (task) return task;
    }
    return null;
  };

  const findColumnByTaskId = (taskId: string) => {
    return columns.find((col) =>
      col.tasks.some((t) => t._id === taskId)
    );
  };

  const findColumnById = (id: string) => {
    return columns.find((col) => col.id === id);
  };

  const handleAddTask = (status: TaskStatus) => {
    setDefaultStatus(status);
    setIsModalOpen(true);
  };

  const handleTaskClick = (task: TaskItem) => {
  setSelectedTask(task);
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
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
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

      {/* Drag overlay — shows the card while dragging */}
      <DragOverlay>
        {activeTask ? (
          <div className="rotate-3 opacity-90">
            <TaskCard task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>

      {isModalOpen && (
        <CreateTaskModal
          projectId={projectId}
          defaultStatus={defaultStatus}
          onClose={() => setIsModalOpen(false)}
        />
      )}
       {selectedTask && (
  <TaskDetailModal
    task={selectedTask}
    onClose={() => setSelectedTask(null)}
  />
)}
    </DndContext>
    
  );
}