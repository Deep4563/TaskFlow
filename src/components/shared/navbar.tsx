"use client";

import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": {
    title: "Dashboard",
    subtitle: "Welcome back",
  },
  "/projects": {
    title: "Projects",
    subtitle: "Manage your projects",
  },
  "/tasks": {
    title: "Tasks",
    subtitle: "Track your work",
  },
  "/team": {
    title: "Team",
    subtitle: "Manage your team",
  },
};

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const page = pageTitles[pathname] ?? { title: "TaskFlow", subtitle: "" };

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">

      {/* Page title */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{page.title}</h2>
        <p className="text-xs text-gray-400">{page.subtitle}</p>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2">

        {/* Search */}
        <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
          <Search className="w-4 h-4" />
          <span className="hidden md:block">Search...</span>
          <kbd className="hidden md:block text-xs bg-white border border-gray-200 rounded px-1.5 py-0.5">
            ⌘K
          </kbd>
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          {/* Notification dot */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center cursor-pointer">
          <span className="text-sm font-semibold text-indigo-600">
            {user?.name?.charAt(0).toUpperCase() ?? "?"}
          </span>
        </div>
      </div>
    </header>
  );
}