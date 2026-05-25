import {
  FolderKanban,
  CheckSquare,
  Users,
  TrendingUp,
} from "lucide-react";
import StatsCard from "@/components/ui/stats-card";
import Card from "@/components/ui/card";

// Placeholder data — real data comes Day 18
const stats = [
  {
    title: "Total Projects",
    value: 12,
    subtitle: "3 active this week",
    icon: FolderKanban,
    color: "indigo" as const,
    trend: { value: 8, label: "this month" },
  },
  {
    title: "Active Tasks",
    value: 48,
    subtitle: "12 due today",
    icon: CheckSquare,
    color: "green" as const,
    trend: { value: 12, label: "this week" },
  },
  {
    title: "Team Members",
    value: 8,
    subtitle: "2 added recently",
    icon: Users,
    color: "amber" as const,
  },
  {
    title: "Completed",
    value: "86%",
    subtitle: "Task completion rate",
    icon: TrendingUp,
    color: "red" as const,
    trend: { value: 4, label: "vs last month" },
  },
];

const recentActivity = [
  {
    id: 1,
    user: "Deep Patel",
    action: "created task",
    target: "Fix login bug",
    time: "2 min ago",
    avatar: "D",
  },
  {
    id: 2,
    user: "John Doe",
    action: "moved task to",
    target: "In Progress",
    time: "15 min ago",
    avatar: "J",
  },
  {
    id: 3,
    user: "Sarah Smith",
    action: "completed task",
    target: "Design homepage",
    time: "1 hour ago",
    avatar: "S",
  },
  {
    id: 4,
    user: "Deep Patel",
    action: "created project",
    target: "TaskFlow v2",
    time: "2 hours ago",
    avatar: "D",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Good morning 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Here&apos;s what&apos;s happening with your projects today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Recent Activity */}
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Recent Activity</h3>
            <button className="text-xs text-indigo-600 hover:underline">
              View all
            </button>
          </div>

          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-indigo-600">
                    {activity.avatar}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">{activity.user}</span>
                    {" "}{activity.action}{" "}
                    <span className="font-medium text-indigo-600">
                      {activity.target}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { label: "New Project", icon: "📁", color: "hover:bg-indigo-50 hover:text-indigo-600" },
              { label: "Create Task", icon: "✅", color: "hover:bg-green-50 hover:text-green-600" },
              { label: "Invite Member", icon: "👥", color: "hover:bg-amber-50 hover:text-amber-600" },
              { label: "View Reports", icon: "📊", color: "hover:bg-purple-50 hover:text-purple-600" },
            ].map((action) => (
              <button
                key={action.label}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 font-medium transition-colors ${action.color}`}
              >
                <span>{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>
        </Card>

      </div>
    </div>
  );
}