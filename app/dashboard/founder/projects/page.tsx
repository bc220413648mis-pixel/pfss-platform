import { prisma } from "@/lib/prisma";
import DashboardShell from "@/app/components/dashboard-shell";
import { 
  ChevronLeft, Globe, User, ShieldCheck, 
  Clock, CheckCircle2, AlertCircle, Search 
} from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

export default async function FounderProjectMaster() {
  // Fetch every single project with its relations
  const allProjects = await prisma.auditProject.findMany({
    include: {
      auditor: true,
      client: true,
      _count: { select: { issues: true } }
    },
    orderBy: { updatedAt: 'desc' }
  });
  const gettierStyle = (status: string) => {
    switch (status) {
      case "BASIC": return "bg-slate-100 text-slate-500";
      case "PRO": return "bg-blue-100 text-blue-500";
      case "ENTERPRISE": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      default: return "bg-slate-100 text-slate-500";
    }
  };

  // Helper for Status Badge Styling
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-slate-100 text-slate-500 border-slate-200";
      case "IN_PROGRESS": return "bg-blue-50 text-blue-600 border-blue-100";
      case "SUBMITTED_FOR_QA": return "bg-amber-50 text-amber-600 border-amber-100";
      case "QA_APPROVED": return "bg-indigo-50 text-indigo-600 border-indigo-100";
      case "DELIVERED": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "QA_RETURNED": return "bg-red-50 text-red-600 border-red-100";
      default: return "bg-slate-100 text-slate-500";
    }
  };

  return (
    <DashboardShell role="FOUNDER">
      <div className="p-5 bg-[#F8FAFC] min-h-screen">
        {/* Navigation & Header */}
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div>
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Project Registry</h2>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mt-2">Full Pipeline Transparency</p>
            </div>
            
            <div className="bg-white border border-slate-200 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-sm">
              <Search className="w-3 h-3 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search URL or Auditor..." 
                className="bg-transparent outline-none text-sm font-bold text-slate-900 w-64"
              />
            </div>
          </div>

          {/* Master Table */}
          <div className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-xl shadow-slate-200/50">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Domain</th>
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Plan</th>
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Auditor</th>
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Status</th>
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Payload</th>
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {allProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-5">
                      <div className="flex items-center gap-1">
                        <div className="w-6 h-6 bg-slate-900 rounded-xl flex items-center justify-center shrink-0">
                          <Globe className="w-3 h-3 text-white" />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 leading-none mb-1">{project.domain}</p>
                        </div>
                      </div> 
                    </td>
                    <td>
                      <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase border ${gettierStyle(project.tier)}`}>
                        {project.tier.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-5">
                      {project.auditor ? (
                        <div className="flex items-center gap-1">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-3 h-3 text-blue-600" />
                          </div>
                          <span className="text-sm font-black text-slate-700">{project.auditor.name}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-black text-rose-500 uppercase flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Unassigned
                        </span>
                      )}
                    </td>

                    <td className="p-5">
                      <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase border ${getStatusStyle(project.status)}`}>
                        {project.status.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="p-5">
                      <div className="flex items-center gap-1">
                        <span className="text-lg font-black text-slate-900">{project._count.issues}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Issues</span>
                      </div>
                    </td>

                    <td className="p-5 text-sm font-bold text-slate-500">
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {allProjects.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-slate-400 font-bold italic">The registry is currently empty.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}