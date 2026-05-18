import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-1">
        Welcome back
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        Sign in to your TaskFlow account
      </p>

      {/* Form comes on Day 7 */}
      <div className="space-y-4">
        <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-10 bg-indigo-100 rounded-lg animate-pulse" />
      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-indigo-600 font-medium hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}