import { getServerSession } from "next-auth";
import DashboardShell from "@/app/components/dashboard-shell";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { 
  LayoutGrid, FileText, Trophy, ChevronRight, AlertCircle, Plus, 
  CreditCard, Sparkles, Activity
} from "lucide-react";
import Link from "next/link";

// Force fresh data on every visit
export const revalidate = 0;

export default async function ClientDashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { organization: true }
  });

  if (!user) redirect("/login");

  const myProjects = await prisma.auditProject.findMany({
    where: { clientId: user.id },
    include: {
      _count: { select: { issues: true } },
      report: true
    },
    orderBy: { createdAt: 'desc' }
  });

  const totalIssues = myProjects.reduce((acc, p) => acc + p._count.issues, 0);
  const healthScore = myProjects.length > 0 ? Math.max(100 - (totalIssues * 2), 0) : 100;
  const currentTier = myProjects[0]?.tier || "BASIC";
  return (
    <DashboardShell role="CLIENT">
      <div className="min-h-screen bg-white p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2 block">
              Organization: {user.organization?.name || "Personal Account"}
            </span>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Your Digital Health</h1>
          </div>
          <Link 
            href="/dashboard/client/projects/new" 
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
            <Plus className="w-5 h-5" /> New Compliance Audit
          </Link>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-slate-900 rounded-[2rem] p-8 text-white flex flex-col justify-between h-64 relative overflow-hidden">
            <Trophy className="absolute -right-4 -top-4 w-32 h-32 text-white/5" />
            <div>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Accessibility Score</p>
              <h2 className="text-6xl font-black mt-2">{healthScore}%</h2>
            </div>
            <div className="text-emerald-400 text-sm font-bold flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Compliance Status
            </div>
          </div>

          <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 flex flex-col justify-between h-64">
            <div>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Active Domains</p>
              <h2 className="text-5xl font-black text-slate-900 mt-2">{myProjects.length}</h2>
            </div>
            <Link href="/dashboard/client/projects/allprojects" className="text-blue-600 font-bold text-sm flex items-center gap-1 group">
              All Projects <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="bg-blue-50 rounded-[2rem] p-8 border border-blue-100 flex flex-col justify-between h-64 relative overflow-hidden">
            <Sparkles className="absolute -right-2 -top-2 w-24 h-24 text-blue-200/50" />
              <div>
                <p className="text-blue-600 font-bold text-xs uppercase tracking-widest">Subscription Tier</p>
                  <h2 className="text-4xl font-black text-slate-900 mt-2">
                    {user.organization?.subscriptionTier || <span>{currentTier}</span>}
                  </h2>
              </div>
            <Link 
              href="/dashboard/billing/plans" 
                className="bg-white text-blue-600 px-4 py-3 rounded-xl text-xs font-black shadow-sm border border-blue-200 uppercase tracking-tighter text-center hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2">
              <CreditCard className="w-4 h-4" /> Upgrade Plan
            </Link>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}