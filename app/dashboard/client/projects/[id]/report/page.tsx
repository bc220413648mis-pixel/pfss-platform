import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { 
  ShieldCheck, AlertTriangle, Zap, Lock, 
  BarChart3, Download, ArrowUpRight, Crown 
} from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function ReportPage(props: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await props.params;
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const project = await prisma.auditProject.findUnique({
    where: { id: id },
    include: { 
      pages: { include: { issues: true } } 
    },
  });

  if (!project) return notFound();

  const isBasic = project.tier === "BASIC";
  
  // Intelligence Calculations
  const allIssues = project.pages.flatMap(p => p.issues);
  const criticalCount = allIssues.filter(i => i.severity === "CRITICAL").length;
  const highCount = allIssues.filter(i => i.severity === "HIGH").length;
  const healthScore = Math.max(0, 100 - (criticalCount * 10) - (highCount * 5));

  return (
    <div className="max-w-7xl mx-auto py-16 px-8 animate-in fade-in duration-1000">
      
      {/* --- EXECUTIVE DASHBOARD HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-16">
        
        <div>
          <div className="flex items-center gap-3 mb-4">
             <span className="w-12 h-[2px] bg-blue-600" />
             <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em]">Intelligence Report // {id.slice(0,8)}</p>
          </div>
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter italic">Compliance Analysis</h1>
        </div>

        <div className="flex gap-4">
            <button className="px-8 py-4 bg-white border-2 border-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
                <Download className="w-4 h-4" /> Export JSON
            </button>
            <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2 shadow-xl shadow-blue-100">
                <Download className="w-4 h-4" /> Official PDF
            </button>
        </div>
      </div>

      {/* --- THE SCOREBOARD --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-slate-900 p-10 rounded-[3rem] text-white flex flex-col justify-between aspect-square md:aspect-auto">
            <BarChart3 className="w-8 h-8 text-blue-400" />
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Accessibility Health Score</p>
                <h2 className="text-8xl font-black italic tracking-tighter text-blue-400">{healthScore}%</h2>
            </div>
        </div>

        <div className="bg-white border border-slate-100 p-10 rounded-[3rem] shadow-sm flex flex-col justify-between">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Critical Blockers</p>
                <h2 className="text-8xl font-black italic tracking-tighter text-slate-900">{criticalCount}</h2>
            </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 p-10 rounded-[3rem] flex flex-col justify-between relative overflow-hidden">
            <Zap className="w-8 h-8 text-blue-600" />
            <div className="relative z-10">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">System Status</p>
                <h2 className="text-4xl font-black italic tracking-tighter text-blue-900 leading-none">
                    {healthScore > 80 ? "OPERATIONAL" : "ACTION REQUIRED"}
                </h2>
            </div>
            <div className="absolute -right-4 -bottom-4 text-blue-100 italic font-black text-9xl select-none">!</div>
        </div>
      </div>

      {/* --- THE PAYWALL / DATA SECTION --- */}
      <div className="relative">
        <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black text-slate-900 italic tracking-tight">Granular Finding Matrix</h3>
            <div className="h-px flex-1 mx-8 bg-slate-100" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{allIssues.length} Points of Interest</span>
        </div>

        {/* LOCKED CONTENT OVERLAY FOR BASIC USERS */}
        {isBasic && (
            <div className="absolute inset-0 z-50 flex items-center justify-center rounded-[3rem] overflow-hidden backdrop-blur-md bg-white/40 border-2 border-dashed border-blue-200 mt-16">
                <div className="max-w-md bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-200">
                        <Crown className="text-white w-10 h-10" />
                    </div>
                    <h4 className="text-3xl font-black text-slate-900 tracking-tighter italic mb-4">Upgrade to Professional</h4>
                    <p className="text-slate-500 font-medium leading-relaxed mb-8">
                        The Basic tier only provides high-level scoring. Unlock the Professional tier to view specific code-level violations, remediation guides, and manual audit evidence.
                    </p>
                    {/* REPLACING THE PREVIOUS BUTTON BLOCK */}
                    <Link 
                      href="/dashboard/billing/plans"
                      className="group w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-600 transition-all shadow-xl flex items-center justify-center gap-2">
                      <Crown className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                      Upgrade Intelligence Tier
                    </Link>
                    <p className="mt-6 text-[9px] font-black text-slate-300 uppercase tracking-widest">Instant Activation Available</p>
                </div>
            </div>
        )}

        {/* DATA TABLE (Blurred for Basic) */}
        <div className={`space-y-4 transition-all duration-1000 ${isBasic ? 'blur-xl grayscale pointer-events-none select-none opacity-40' : ''}`}>
            <table className="w-full border-separate border-spacing-y-4">
                <thead>
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">
                        <th className="px-8 pb-4">Violation ID</th>
                        <th className="pb-4">Source Page</th>
                        <th className="pb-4">Severity</th>
                        <th className="pb-4 text-right pr-8">Remediation Status</th>
                    </tr>
                </thead>
                <tbody>
                    {allIssues.map((issue) => (
                        <tr key={issue.id} className="group bg-white border border-slate-50 shadow-sm hover:shadow-md transition-all rounded-2xl">
                            <td className="py-6 px-8 rounded-l-3xl">
                                <div className="flex items-center gap-4">
                                    <div className={`w-3 h-3 rounded-full ${issue.severity === 'CRITICAL' ? 'bg-red-500' : 'bg-orange-400'}`} />
                                    <div>
                                        <p className="text-sm font-black text-slate-900">{issue.title}</p>
                                        <p className="text-[9px] font-black text-blue-600 uppercase tracking-tighter">{issue.wcagMapping}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="text-xs font-bold text-slate-400 italic">
                                {project.pages.find(p => p.id === issue.pageId)?.name || "System"}
                            </td>
                            <td>
                                <span className="px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-[9px] font-black text-slate-600 uppercase tracking-widest">
                                    {issue.severity}
                                </span>
                            </td>
                            <td className="text-right pr-8 rounded-r-3xl">
                                <button className="text-[10px] font-black text-blue-600 hover:text-slate-900 flex items-center gap-2 ml-auto uppercase tracking-widest">
                                    View Logic <ArrowUpRight className="w-3 h-3" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}