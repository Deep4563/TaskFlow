import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Good morning 👋
      </h1>

      {/* Stats cards — real data comes Day 18 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {["Total Projects", "Active Tasks", "Team Members"].map((stat) => (
          <div
            key={stat}
            className="bg-white rounded-xl border border-gray-100 p-5"
          >
            <p className="text-sm text-gray-500">{stat}</p>
            <div className="h-7 w-16 bg-gray-100 rounded animate-pulse mt-2" />
          </div>
        ))}
      </div>

      {/* Recent activity placeholder */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-700 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 bg-gray-50 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}