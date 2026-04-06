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
        {/* Projects List */}
        <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" /> All Audits
        </h3>
        
        <div className="grid grid-cols-1 ">
          {myProjects.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">No projects found. Launch your first audit to get started.</p>
            </div>
          ) : (
            myProjects.map((project) => (
              <div key={project.id} className="bg-white border border-slate-200 p-6 rounded-3xl hover:border-blue-300 transition-all group shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="font-black text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{project.domain}</h4>
                    <p className="text-xs text-slate-400 font-mono">ID: {project.id}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-blue-100 text-blue-700">
                    {project.status}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Issues Detected</p>
                    <p className="font-black text-slate-900">{project._count.issues}</p>
                  </div>
                  <Link href={`/dashboard/client/projects/${project.id}/report`} className="bg-slate-900 text-white p-3 rounded-xl hover:bg-blue-600 transition-all">
                    <FileText className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardShell>
  );
}