"use client"; // This is the key to fixing the onClick error

import { Download } from "lucide-react";

export default function PrintButton() {
  return (
    <button 
      className="flex-1 bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
      onClick={() => window.print()}
    >
      <Download className="w-4 h-4" /> Receipt
    </button>
  );
}