"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useKanbanStore, TaskStatus, TaskItem } from "@/store/useKanbanStore"; // ← added TaskItem
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";

interface CreateTaskModalProps {
  projectId: string;
  defaultStatus: TaskStatus;
  onClose: () => void;
}

export default function CreateTaskModal({
  projectId,
  defaultStatus,
  onClose,
}: CreateTaskModalProps) {
  const { addTask } = useKanbanStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!title.trim() || title.trim().length < 2) {
      setError("Title must be at least 2 characters");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          priority,
          status: defaultStatus,
          projectId,
        }),
      });

      const data = await res.json();

      if (data.success) {
        addTask(data.data.task as TaskItem); // ← added cast
        onClose();
      } else {
        setError(data.error || "Failed to create task");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Create Task</h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <Input
            label="Task Title"
            placeholder="Enter task title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              placeholder="Optional description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Priority
            </label>
            <div className="flex gap-2">
              {(["low", "medium", "high"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-colors capitalize ${
                    priority === p
                      ? p === "high"
                        ? "bg-red-50 border-red-300 text-red-600"
                        : p === "medium"
                        ? "bg-amber-50 border-amber-300 text-amber-600"
                        : "bg-green-50 border-green-300 text-green-600"
                      : "bg-gray-50 border-gray-200 text-gray-500"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Column
            </label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 capitalize">
              {defaultStatus.replace("-", " ")}
            </div>
          </div>
        </div>

        <div className="flex gap-2 p-5 border-t border-gray-100">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button isLoading={isLoading} onClick={handleSubmit}>
            Create Task
          </Button>
        </div>
      </div>
    </div>
  );
}