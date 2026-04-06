import { prisma } from "@/lib/prisma";
import DashboardShell from "@/app/components/dashboard-shell";
import { approveAudit, returnToAuditor } from "@/lib/actions/qa-actions";
import { ChevronLeft, CheckCircle, XCircle, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default async function QAProjectReview({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = await params;
  const project = await prisma.auditProject.findUnique({
    where: { id: resolvedParams.id },
    include: { issues: true, auditor: true }
  });

  if (!project) return <div>Project not found</div>;

  return (
    <DashboardShell role="QA">
      <div className="p-10 max-w-7xl mx-auto">
        <Link href="/dashboard/qa" className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase mb-8">
          <ChevronLeft className="w-4 h-4" /> Back to Queue
        </Link>

        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">{project.domain}</h1>
            <p className="text-slate-500 font-medium">Audit Review by QA Admin</p>
          </div>

          <div className="flex gap-4">
            {/* Rejection Form */}
            <form action={async () => { "use server"; await returnToAuditor(project.id); }}>
              <button className="bg-red-50 text-red-600 px-8 py-4 rounded-2xl font-black text-xs uppercase hover:bg-red-600 hover:text-white transition-all border border-red-100 flex items-center gap-2">
                <XCircle className="w-4 h-4" /> Reject & Return
              </button>
            </form>

            {/* Approval Form */}
            <form action={async () => { "use server"; await approveAudit(project.id); }}>
              <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase hover:bg-emerald-600 transition-all flex items-center gap-2 shadow-xl shadow-slate-200">
                <CheckCircle className="w-4 h-4" /> Approve Report
              </button>
            </form>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden">
          <div className="p-8 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-indigo-600" /> 
              Findings Reported by {project.auditor?.name}
            </h2>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="p-6">Severity</th>
                <th className="p-6">Violation Title</th>
                <th className="p-6">WCAG Rule</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {project.issues.map((issue) => (
                <tr key={issue.id}>
                  <td className="p-6">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black bg-slate-100 text-slate-600">
                      {issue.severity}
                    </span>
                  </td>
                  <td className="p-6 font-bold text-slate-900">{issue.title}</td>
                  <td className="p-6 text-sm text-slate-500 font-medium">{issue.wcagMapping}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}