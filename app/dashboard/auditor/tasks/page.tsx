import { prisma } from "@/lib/prisma";
import DashboardShell from "@/app/components/dashboard-shell";
import { 
  ClipboardCheck, AlertCircle, Clock, CheckCircle2, 
  ArrowRight, Search, Globe, Shield
} from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Points to your actual file

export default async function AuditorDashboard() {
  const session = await getServerSession(authOptions);
  
  // 1. Fetch Projects assigned specifically to this Auditor
  const [assignedProjects, stats] = await Promise.all([
    prisma.auditProject.findMany({
      where: { auditorId: session?.user?.id,
                status: "IN_PROGRESS"
      },
      include: { client: true, _count: { select: { issues: true } } },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.auditProject.groupBy({
      by: ['status'],
      where: { auditorId: session?.user?.id },
      _count: true
    })
  ]);

  const activeCount = stats.find(s => s.status === 'IN_PROGRESS')?._count || 0;

  return (
    <DashboardShell role="AUDITOR">
      <div className="p-10 bg-[#F8FAFC] min-h-screen">
        {/* Auditor Header */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">       
          <div className="flex gap-4">
             <div className="bg-white border border-slate-200 px-6 py-4 rounded-2xl shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Active Pipeline</p>
                <p className="text-xl font-black text-blue-600">{activeCount} Projects</p>
             </div>
          </div>
        </div>

        {/* Work Queue Grid */}
        <div className="grid grid-cols-1 gap-8">
          {assignedProjects.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] py-32 text-center">
              <Shield className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <h3 className="text-xl font-black text-slate-900">Queue Standby</h3>
              <p className="text-slate-400 font-medium">No projects currently assigned by the Founder.</p>
            </div>
          ) : (
            assignedProjects.map((project) => (
              <div key={project.id} className="bg-white border border-slate-200 rounded-[2.5rem] p-8 hover:shadow-xl transition-all group">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                  
                  {/* Project Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${
                        project.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {project.status.replace('_', ' ')}
                      </span>
                      <span className="text-slate-200">/</span>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {project.tier} Compliance
                      </p>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 mb-2 flex items-center gap-3">
                      <Globe className="w-6 h-6 text-slate-300" /> {project.domain}
                    </h3>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                        <ClipboardCheck className="w-4 h-4 text-emerald-500" />
                        {project._count.issues} Issues Found
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                        <Clock className="w-4 h-4 text-blue-500" />
                        Due in 48h
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 w-full lg:w-auto">
                    <Link 
                      href={`/dashboard/auditor/projects/${project.id}`}
                      className="flex-1 lg:flex-none text-center bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-3"
                    >
                      Enter Audit Room <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardShell>
  );
}