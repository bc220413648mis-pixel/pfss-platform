import { prisma } from "@/lib/prisma";
import DashboardShell from "@/app/components/dashboard-shell";
import { 
  Users, DollarSign, Settings, ShieldCheck, ArrowRight,
  Activity, Zap, CheckCircle, Rocket
} from "lucide-react";
import Link from "next/link";
import { assignAuditor, deliverProject } from "@/lib/actions/founder-actions";

export const revalidate = 0;

export default async function FounderOverview() {
  const [userCount, projectCount, pendingAssignment, approvedByQA, auditors, totalRevenue] = await Promise.all([
    prisma.user.count(),
    prisma.auditProject.count(),
    // 1. Projects needing an Auditor
    prisma.auditProject.findMany({
      where: { auditorId: null, status: "IN_PROGRESS" },
      include: { client: true },
      take: 3
    }),
    // 2. Projects approved by QA, waiting for Founder to "Deliver"
    prisma.auditProject.findMany({
      where: { status: "QA_APPROVED" },
      include: { auditor: true },
      take: 5
    }),
    prisma.user.findMany({ where: { role: "AUDITOR" } }),
    prisma.transaction.aggregate({
      where: { status: "COMPLETED" },
      _sum: { amount: true }
    })
  ]);

  const portals = [
    {
      title: "User Governance",
      desc: "Manage roles, permissions, and workload distribution.",
      href: "/dashboard/founder/users",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      stats: `${userCount} Active Users`
    },
    {
      title: "Financial Engine",
      desc: "Revenue tracking and billing logs.",
      href: "/dashboard/founder/billing",
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      stats: `$${(totalRevenue._sum.amount || 0).toLocaleString()}`
    },
    {
      title: "System Settings",
      desc: "Global configurations and SLA days.",
      href: "/dashboard/founder/settings",
      icon: Settings,
      color: "text-slate-600",
      bg: "bg-slate-100",
      stats: "Global MVP Rules"
    }
  ];

  return (
    <DashboardShell role="FOUNDER">
      <div className="p-10 bg-[#F8FAFC] min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-12 ">
          {/* LEFT COLUMN: Portals & Stats */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 gap-8 mb-10">
              {portals.map((portal) => (
                <Link key={portal.href} href={portal.href} className="group">
                  <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 hover:shadow-xl transition-all h-full flex flex-col justify-between">
                    <div>
                      <div className={`${portal.bg} ${portal.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6`}>
                        <portal.icon className="w-7 h-7" />
                      </div>
                      <h2 className="text-2xl font-black text-slate-900 mb-2">{portal.title}</h2>
                      <p className="text-slate-500 text-sm font-medium">{portal.desc}</p>
                    </div>
                    <div className="flex justify-between items-center pt-8 mt-4 border-t border-slate-50">
                       <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{portal.stats}</span>
                       <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>            
          </div>          
        </div>

        {/* RIGHT COLUMN: Incoming Queue */}

        <div className="lg:col-span-4">
          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-200 sticky top-10 mb-10">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black flex items-center gap-2 text-white">
                  <Zap className="text-amber-400 w-5 h-5 fill-amber-400" /> Intake Queue
                </h3>
                <span className="bg-indigo-500 text-[10px] px-3 py-1 rounded-full font-black">{pendingAssignment.length} NEW</span>
            </div>
            <div className="space-y-6">
              {pendingAssignment.map((project) => (
                <div key={project.id} className="p-6 bg-indigo-500/30 rounded-[2rem] border border-indigo-400/30">
                  <p className="text-[10px] font-black text-indigo-200 uppercase mb-2 tracking-widest">{project.tier} TIER</p>
                  <h4 className="font-black text-white mb-4 truncate">{project.domain}</h4>
                  
                  <form action={async (formData) => {
                    "use server";
                    const auditorId = formData.get("auditorId") as string;
                    await assignAuditor(project.id, auditorId);
                  }} className="space-y-3">
                    <select name="auditorId" required className="w-full bg-indigo-900/50 border border-indigo-400/50 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none appearance-none">
                      <option value="" className="text-slate-900">Select Auditor...</option>
                      {auditors.map(a => (
                        <option key={a.id} value={a.id} className="text-slate-900">{a.name || a.email}</option>
                      ))}
                    </select>
                    <button className="w-full bg-white text-indigo-600 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-400 hover:text-slate-900 transition-all shadow-lg">
                      Deploy Auditor
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RELEASE DESK: The "Final Gate" */}
          <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <Rocket className="text-indigo-600 w-6 h-6" /> Ready for Delivery
              </h3>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{approvedByQA.length} Approved by QA</span>
            </div>
            <div className="space-y-4">
              {approvedByQA.length === 0 ? (
                <p className="text-slate-300 italic font-medium py-10 text-center border-2 border-dashed border-slate-50 rounded-[2rem]">No reports waiting for final release.</p>
              ) : (
                approvedByQA.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:bg-white hover:shadow-lg transition-all">
                    <div>
                      <h4 className="font-black text-slate-900">{project.domain}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Verified by QA Admin • Auditor: {project.auditor?.name}</p>
                    </div>
                    <form action={async () => { "use server"; await deliverProject(project.id); }}>
                      <button className="bg-slate-900 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" /> Deliver Report
                      </button>
                    </form>
                  </div>
                ))
              )}
            </div>
          </div>
      </div>
    </DashboardShell>
  );
}