"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Button from "@/components/ui/button";
import { CheckCircle, XCircle, Loader } from "lucide-react";
import { Suspense } from "react";

function InviteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const token = searchParams.get("token");

 type InviteState = "loading" | "ready" | "accepting" | "success" | "error";
const [state, setState] = useState<InviteState>("loading");

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (!token) {
      setState("error");
      setMessage("Invalid invitation link");
      return;
    }
    if (status === "unauthenticated") {
      router.push(`/login?redirect=/invite?token=${token}`);
      return;
    }
    setState("ready");
  }, [status, token]);

  const handleAccept = async () => {
    setState("accepting");

    try {
      const res = await fetch("/api/invite/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (data.success) {
        setState("success");
        setMessage("You have successfully joined the project!");
        setTimeout(() => router.push("/projects"), 2000);
      } else {
        setState("error");
        setMessage(data.error || "Failed to accept invitation");
      }
    } catch {
      setState("error");
      setMessage("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md text-center">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          {state === "loading" && (
            <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
          )}
          {(state === "ready" || state === "accepting") && (
            <span className="text-2xl">👥</span>
          )}
          {state === "success" && (
            <CheckCircle className="w-8 h-8 text-green-600" />
          )}
          {state === "error" && (
            <XCircle className="w-8 h-8 text-red-500" />
          )}
        </div>

        {state === "ready" && (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Project Invitation
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              You have been invited to join a project on TaskFlow.
              Click below to accept.
            </p>
            <Button onClick={handleAccept}>
              Accept Invitation
            </Button>
          </>
        )}

        {state === "accepting" && (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Joining project...
            </h2>
            <p className="text-gray-500 text-sm">Please wait</p>
          </>
        )}

        {state === "success" && (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Welcome to the team!
            </h2>
            <p className="text-green-600 text-sm">{message}</p>
            <p className="text-gray-400 text-xs mt-2">
              Redirecting to projects...
            </p>
          </>
        )}

        {state === "error" && (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Invalid Invitation
            </h2>
            <p className="text-red-500 text-sm mb-6">{message}</p>
            <Button
              variant="secondary"
              onClick={() => router.push("/dashboard")}
            >
              Go to Dashboard
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default function InvitePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InviteContent />
    </Suspense>
  );
}