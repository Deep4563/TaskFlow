import type { Metadata } from "next";
import Sidebar from "@/components/shared/sidebar";
import Navbar from "@/components/shared/navbar";
import { SocketProvider } from "@/components/shared/socket-provider";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SocketProvider>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SocketProvider>
  );
}