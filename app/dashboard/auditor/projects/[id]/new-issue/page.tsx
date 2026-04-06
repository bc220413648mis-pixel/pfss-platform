import { saveIssue } from "@/lib/actions/auditor-actions";
import DashboardShell from "@/app/components/dashboard-shell";
import { ChevronLeft, ShieldCheck, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default async function NewIssuePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const projectId = resolvedParams.id;

  return (
    <DashboardShell role="AUDITOR">
      <div className="p-10 max-w-4xl mx-auto">
        <Link href={`/dashboard/auditor/projects/${projectId}`} className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase mb-8 hover:text-blue-600 transition-all">
          <ChevronLeft className="w-4 h-4" /> Cancel Audit
        </Link>

        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Log WCAG Violation</h1>
          <p className="text-slate-500 font-medium">Record a manual finding for project: <span className="font-mono text-blue-600">{projectId}</span></p>
        </div>

        <form action={saveIssue} className="space-y-8 bg-white border border-slate-200 p-12 rounded-[3rem] shadow-sm">
          <input type="hidden" name="projectId" value={projectId} />

          {/* Title & WCAG Rule */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Issue Title</label>
              <input 
                name="title" 
                placeholder="e.g., Non-Descriptive Image Alt Text" 
                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">WCAG Mapping</label>
              <input 
                name="wcagMapping" 
                placeholder="e.g., 1.1.1 Non-text Content" 
                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold"
                required
              />
            </div>
          </div>

          {/* Severity & Status */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Violation Severity</label>
            <select name="severity" className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:border-blue-500 transition-all font-black uppercase text-xs">
              <option value="LOW">Low (Minor UX)</option>
              <option value="MEDIUM">Medium (Barrier)</option>
              <option value="HIGH">High (Major Barrier)</option>
              <option value="CRITICAL">Critical (Blocked Access)</option>
            </select>
          </div>

          {/* Detailed Findings */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Description of finding</label>
            <textarea 
              name="description" 
              rows={4}
              placeholder="Describe the exact location and nature of the accessibility barrier..."
              className="w-full bg-slate-50 border border-slate-100 p-6 rounded-[2rem] outline-none focus:border-blue-500 transition-all font-medium"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Expert Recommendation</label>
            <textarea 
              name="recommendation" 
              rows={4}
              placeholder="Provide clear technical instructions for the developer to fix this..."
              className="w-full bg-slate-50 border border-slate-100 p-6 rounded-[2rem] outline-none focus:border-blue-500 transition-all font-medium"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3"
          >
            <ShieldCheck className="w-5 h-5" /> Save Violation to Project
          </button>
        </form>
      </div>
    </DashboardShell>
  );
}