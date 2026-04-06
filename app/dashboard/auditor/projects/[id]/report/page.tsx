import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle, AlertTriangle, XCircle, ArrowLeft, Download, Send } from "lucide-react";
import { submitProjectToQA } from "@/lib/actions/project-actions";

export default async function AuditReportPage(props: { 
  params: Promise<{ id: string }> 
}) {
  // Await params at the very top
  const { id } = await props.params;
  
  // Bind the action with the resolved ID
  const handleSubmitAudit = submitProjectToQA.bind(null, id);

  const project = await prisma.auditProject.findUnique({
    where: { id: id },
    include: { 
      pages: { include: { issues: { include: { evidence: true } } } } 
    },
  });

  if (!project) return notFound();

  // Advanced Calculations
  const allIssues = project.pages.flatMap(p => p.issues);
  const criticalCount = allIssues.filter(i => i.severity === 'CRITICAL').length;
  const highCount = allIssues.filter(i => i.severity === 'HIGH').length;
  const healthScore = Math.max(0, 100 - (criticalCount * 10) - (highCount * 5));

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 bg-white min-h-screen shadow-2xl my-10 rounded-sm border-t-8 border-slate-900">
      
      {/* NAVIGATION SECTION */}
      <div className="flex justify-between items-center mb-10 print:hidden border-b border-slate-100 pb-6">
        <Link 
          href={`/dashboard/auditor/tasks`} 
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Task List
        </Link>
        
        {/* Submit to QA Form */}
        <form action={handleSubmitAudit}>
          <button 
            type="submit"
            className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-black hover:bg-slate-900 transition-all shadow-lg shadow-emerald-100 flex items-center gap-2"
          >
            <Send className="w-3 h-3" />
            Submit Final Report to QA
          </button>
        </form>
      </div>

      {/* REPORT HEADER */}
      <div className="flex justify-between items-center border-b pb-8 mb-10">
        <div>
          <h4 className="text-blue-600 font-bold uppercase tracking-widest text-[10px] mb-2">Accessibility Compliance Report</h4>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">{project.domain}</h1>
          <p className="text-slate-500 mt-1 italic text-sm">
            Generated on {new Date().toLocaleDateString()} • WCAG {project.wcagVersion} {project.complianceLevel}
          </p>
        </div>
        <div className="text-right">
          <div className={`text-6xl font-black ${healthScore > 80 ? 'text-emerald-500' : healthScore > 50 ? 'text-orange-500' : 'text-red-600'}`}>
            {healthScore}%
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Overall Health Score</p>
        </div>
      </div>

      {/* EXECUTIVE SUMMARY CARDS */}
      <div className="grid grid-cols-3 gap-6 mb-12">
        <div className="p-6 bg-red-50 border border-red-100 rounded-2xl">
          <XCircle className="text-red-600 mb-2 w-5 h-5" />
          <div className="text-3xl font-black text-red-700">{criticalCount}</div>
          <div className="text-[10px] font-black text-red-500 uppercase">Critical Blockers</div>
        </div>
        <div className="p-6 bg-orange-50 border border-orange-100 rounded-2xl">
          <AlertTriangle className="text-orange-600 mb-2 w-5 h-5" />
          <div className="text-3xl font-black text-orange-700">{highCount}</div>
          <div className="text-[10px] font-black text-orange-500 uppercase">High Priority</div>
        </div>
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
          <CheckCircle className="text-slate-600 mb-2 w-5 h-5" />
          <div className="text-3xl font-black text-slate-700">{project.pages.length}</div>
          <div className="text-[10px] font-black text-slate-400 uppercase">Verified Targets</div>
        </div>
      </div>

      {/* DETAILED FINDINGS */}
      <div className="space-y-16">
        <h2 className="text-2xl font-black text-slate-900 border-l-4 border-blue-600 pl-4 uppercase tracking-tight">Audit Breakdown</h2>
        
        {project.pages.map((page) => (
          <div key={page.id} className="space-y-8">
            <div className="bg-slate-900 text-white p-5 rounded-xl flex justify-between items-center shadow-lg">
              <span className="font-black text-lg tracking-tight">{page.name}</span>
              <span className="text-xs opacity-60 font-mono bg-slate-800 px-3 py-1 rounded-md">{page.url}</span>
            </div>

            {page.issues.length === 0 ? (
              <p className="text-slate-400 italic text-sm ml-4">No issues identified for this target.</p>
            ) : (
              page.issues.map((issue, idx) => (
                <div key={issue.id} className="ml-6 border-l-2 border-slate-100 pl-8 pb-12 relative last:pb-0">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 bg-white border-2 border-slate-900 rounded-full" />
                  
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-slate-800">{idx + 1}. {issue.title}</h3>
                    <span className="px-3 py-1 bg-slate-900 text-white rounded text-[10px] font-black uppercase tracking-widest">{issue.severity}</span>
                  </div>
                  
                  <div className="text-blue-600 text-[11px] font-black mb-4 uppercase tracking-widest">Criteria: {issue.wcagMapping}</div>
                  <p className="text-slate-600 mb-6 leading-relaxed text-sm">{issue.description}</p>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-6">
                    <span className="text-[10px] font-black text-slate-400 uppercase block mb-2 tracking-widest flex items-center gap-1">
                       <Download className="w-3 h-3" /> Remediation Strategy
                    </span>
                    <p className="text-slate-800 font-medium italic border-l-2 border-blue-200 pl-4 leading-relaxed">
                      "{issue.recommendation}"
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    {issue.evidence.map(ev => (
                      <img 
                        key={ev.id}
                        src={ev.url} 
                        className="w-48 h-32 object-cover rounded-xl border border-slate-200 shadow-sm hover:scale-105 transition-transform cursor-zoom-in" 
                        alt="Evidence" 
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
}