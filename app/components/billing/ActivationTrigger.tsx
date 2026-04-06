"use client";

import { useEffect, useState } from "react";
import { verifyAndActivateProject } from "@/lib/actions/stripe-actions";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function ActivationTrigger({ sessionId }: { sessionId: string }) {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    async function activate() {
      try {
        const result = await verifyAndActivateProject(sessionId);
        if (result.success) setStatus("success");
        else setStatus("error");
      } catch (err) {
        setStatus("error");
      }
    }
    activate();
  }, [sessionId]);

  if (status === "loading") {
    return (
      <div className="flex items-center gap-2 text-blue-600 font-bold animate-pulse">
        <Loader2 className="w-5 h-5 animate-spin" />
        Syncing with Nexus OS...
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex items-center gap-2 text-rose-500 font-bold">
        <AlertCircle className="w-5 h-5" />
        Verification Pending
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-emerald-600 font-bold animate-in fade-in zoom-in duration-500">
      <CheckCircle2 className="w-5 h-5" />
      Project Live in Founder Queue
    </div>
  );
}