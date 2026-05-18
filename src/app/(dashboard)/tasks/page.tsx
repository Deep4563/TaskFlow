import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tasks",
};

export default function TasksPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
          + New Task
        </button>
      </div>

      {/* Kanban board placeholder — real version Day 11 */}
      <div className="grid grid-cols-3 gap-4">
        {["To Do", "In Progress", "Done"].map((col) => (
          <div
            key={col}
            className="bg-white rounded-xl border border-gray-100 p-4"
          >
            <h3 className="font-semibold text-gray-600 text-sm mb-3">{col}</h3>
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <div key={i} className="h-16 bg-gray-50 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}