"use client";

import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/projects": "Projects",
  "/tasks": "Tasks",
};

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-gray-800">
        {pageTitles[pathname] ?? "TaskFlow"}
      </h2>

      <div className="flex items-center gap-3">
        {/* Notification bell placeholder */}
        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
          🔔
        </button>

        {/* Avatar placeholder */}
        <div className="w-8 h-8 rounded-full bg-indigo-100 cursor-pointer" />
      </div>
    </header>
  );
}