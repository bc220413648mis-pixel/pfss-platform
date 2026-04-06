"use client";

import { useState } from "react";
import { Zap, Loader2, CheckCircle } from "lucide-react";
import { runAutoScan } from "@/lib/actions/scanner";

interface ScanButtonProps {
  pageId: string;
  url: string;
  projectId: string;
}

export default function ScanButton({ pageId, url, projectId }: ScanButtonProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleScan = async () => {
    setIsScanning(true);
    try {
      const result = await runAutoScan(pageId, url, projectId);
      if (result.success) {
        setIsDone(true);
        setTimeout(() => setIsDone(false), 3000); // Reset after 3 seconds
      }
    } catch (error) {
      console.error("Scan Trigger Error:", error);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <button
      onClick={handleScan}
      disabled={isScanning}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all ${
        isDone 
          ? "bg-emerald-500 text-white" 
          : "bg-blue-600 text-white hover:bg-blue-700 shadow-md active:scale-95 disabled:opacity-50"
      }`}
    >
      {isScanning ? (
        <>
          <Loader2 className="w-3 h-3 animate-spin" />
          Analyzing DOM...
        </>
      ) : isDone ? (
        <>
          <CheckCircle className="w-3 h-3" />
          Scan Complete
        </>
      ) : (
        <>
          <Zap className="w-3 h-3 fill-white" />
          Auto-Scan Page
        </>
      )}
    </button>
  );
}