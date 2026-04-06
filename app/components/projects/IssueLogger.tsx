"use client";

import { useState } from "react";
import { createIssue } from "@/lib/actions/issues";
import { AlertCircle, X, Check } from "lucide-react";

export default function IssueLogger({ 
  projectId, 
  pages 
}: { 
  projectId: string, 
  pages: { id: string, name: string }[] 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  if (!isOpen) return (
    <button 
      onClick={() => setIsOpen(true)}
      className="fixed bottom-10 right-10 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all flex items-center gap-2 font-bold px-6"
    >
      <AlertCircle className="w-5 h-5" /> Log New Finding
    </button>
  );

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-end">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl p-8 overflow-y-auto animate-in slide-in-from-right duration-300">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-slate-900">New Audit Finding</h2>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <form action={async (formData) => {
          setIsPending(true);
          await createIssue(formData);
          setIsPending(false);
          setIsOpen(false);
        }} className="space-y-6">
          <input type="hidden" name="projectId" value={projectId} />

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Affected Page</label>
            <select name="pageId" required className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none appearance-none cursor-pointer">
              {pages.map(page => (
                <option key={page.id} value={page.id}>{page.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Issue Title</label>
            <input name="title" required placeholder="e.g., Contrast Ratio on Submit Button" className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Severity</label>
              <select name="severity" className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 outline-none">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">WCAG Success Criteria</label>
              <input name="wcagMapping" required placeholder="1.4.3 Contrast" className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 outline-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Detailed Observation</label>
            <textarea name="description" required rows={3} className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none" placeholder="Explain exactly what the user with disabilities experiences here..."></textarea>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Technical Recommendation</label>
            <textarea name="recommendation" required rows={3} className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none" placeholder="How should the developer fix this?"></textarea>
          </div>

          <button 
            disabled={isPending}
            className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-700 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {isPending ? "Logging Finding..." : "Commit Finding to Audit"}
          </button>
        </form>
      </div>
    </div>
  );
}