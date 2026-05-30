"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskItem } from "@/store/useKanbanStore";
import TaskCard from "./task-card";

interface SortableTaskCardProps {
  task: TaskItem;
  onClick?: (task: TaskItem) => void;
}

export default function SortableTaskCard({
  task,
  onClick,
}: SortableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
  <div
    ref={setNodeRef}
    style={style}
    {...attributes}
    {...listeners}
  >
    {/* Placeholder shown when dragging */}
    {isDragging ? (
      <div className="rounded-lg border-2 border-dashed border-indigo-300 bg-indigo-50 h-24 transition-all" />
    ) : (
      <TaskCard task={task} onClick={onClick} />
    )}
  </div>
);
}