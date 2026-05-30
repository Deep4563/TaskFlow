"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import KanbanBoard from "@/components/features/tasks/kanban-board";
import { FolderKanban } from "lucide-react";

export default function TasksPage() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  if (!projectId) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <FolderKanban className="w-12 h-12 text-gray-300 mb-4" />
        <h3 className="text-gray-600 font-medium">No project selected</h3>
        <p className="text-gray-400 text-sm mt-1">
          Select a project from the Projects page to view its tasks
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Kanban Board</h1>
      </div>
      <KanbanBoard projectId={projectId} />
    </div>
  );
}