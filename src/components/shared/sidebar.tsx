"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/constants";

const navItems = [
  { label: "Dashboard", href: ROUTES.DASHBOARD, icon: "📊" },
  { label: "Projects", href: ROUTES.PROJECTS, icon: "📁" },
  { label: "Tasks", href: ROUTES.TASKS, icon: "✅" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-bold text-indigo-600">TaskFlow</h1>
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === item.href
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* User section placeholder */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-indigo-100" />
          <div>
            <p className="text-sm font-medium text-gray-700">User Name</p>
            <p className="text-xs text-gray-400">user@email.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}