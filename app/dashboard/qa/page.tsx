import { getServerSession } from "next-auth";
import DashboardShell from "@/app/components/dashboard-shell";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { 
  ClipboardCheck, Clock, CheckCircle2, 
  ArrowRight, ShieldCheck, History, Activity
} from "lucide-react";
import Link from "next/link";

export default async function QADashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  // Ensure this matches your Enum in schema.prisma exactly
  if (!user || user.role !== "QA_ADMIN") { 
    return redirect("/dashboard");
  }

  const [pendingQA, recentlyApproved, totalSystemIssues] = await Promise.all([
    prisma.auditProject.findMany({
      where: { status: "SUBMITTED_FOR_QA" },
      include: { auditor: true, client: true, _count: { select: { issues: true } } },
      orderBy: { updatedAt: 'asc' }
    }),
    prisma.auditProject.findMany({
      where: { status: "QA_APPROVED" },
      take: 5,
      orderBy: { updatedAt: 'desc' }
    }),
    prisma.issue.count()
  ]);

  return (
    <DashboardShell role="QA">
      <div className="min-h-screen bg-[#F8FAFC] p-8">
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-indigo-100 p-1.5 rounded-lg">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
              </div>
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Quality Assurance Command</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Audit Verification Queue</h1>
          </div>
          <div className="bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
             <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Node Status</p>
                <p className="text-sm font-black text-slate-900">Active</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-7 rounded-[2.5rem] border border-slate-200 shadow-sm group hover:border-orange-200 transition-all">
              <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 text-orange-500" />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pending Release</p>
              <h3 className="text-4xl font-black text-slate-900">{pendingQA.length}</h3>
          </div>
          <div className="bg-indigo-600 p-7 rounded-[2.5rem] shadow-2xl shadow-indigo-200 text-white relative overflow-hidden">
              <Activity className="absolute -right-4 -bottom-4 w-32 h-32 text-indigo-500 opacity-20" />
              <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center mb-6">
                <ClipboardCheck className="w-6 h-6 text-indigo-100" />
              </div>
              <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1">System Health</p>
              <h3 className="text-4xl font-black tracking-tighter">99.2%</h3>
          </div>
          <div className="bg-white p-7 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
                <History className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Historical Issues</p>
              <h3 className="text-4xl font-black text-slate-900">{totalSystemIssues}</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-4">
            <h2 className="text-xl font-black text-slate-900 tracking-tight mb-6">Active Audits Awaiting QA</h2>
            {pendingQA.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] py-24 text-center">
                  <CheckCircle2 className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-400 font-bold italic">Queue is currently empty.</p>
              </div>
            ) : (
              pendingQA.map((project) => (
                <div key={project.id} className="bg-white border border-slate-200 p-8 rounded-[2rem] flex flex-col md:flex-row justify-between items-center hover:shadow-xl transition-all group">
                  <div>
                    <h4 className="font-black text-xl text-slate-900 tracking-tight group-hover:text-indigo-600">{project.domain}</h4>
                    <p className="text-xs font-bold text-slate-400">Auditor: {project.auditor?.name || "N/A"} • Issues: {project._count.issues}</p>
                  </div>
                  <Link 
                    href={`/dashboard/qa/projects/${project.id}`} 
                    className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-indigo-600 transition-all">
                    Inspect Report <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))
            )}
          </div>
          <div className="lg:col-span-4">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-8">Verified Today</h2>
              <div className="space-y-6">
                {recentlyApproved.map((p) => (
                  <div key={p.id} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900">{p.domain}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Approved</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}