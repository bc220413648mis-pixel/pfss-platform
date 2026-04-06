import { prisma } from "@/lib/prisma";
import RoleSelector from "@/app/components/admin/RoleSelector";
import { UserCog, Search, Filter, ShieldCheck } from "lucide-react";
import DashboardShell from "@/app/components/dashboard-shell";
export default async function UserManagementPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <DashboardShell role="FOUNDER">
      <div className="p-8 bg-[#F8FAFC] min-h-screen">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">User Governance</h1>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Manage platform access and security levels</p>
          </div>
          <div className="flex gap-4">
             <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search by email..." className="outline-none text-sm font-medium w-64" />
             </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="px-8 py-5">Identity</th>
                <th className="px-8 py-5">Security Role</th>
                <th className="px-8 py-5">Join Date</th>
                <th className="px-8 py-5 text-right">Verification</th>
                <th className="px-8 py-5">Assigned Work</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-400">
                          {u.name?.charAt(0)}
                       </div>
                       <div>
                          <p className="font-black text-slate-900 text-sm">{u.name}</p>
                          <p className="text-xs text-slate-400 font-medium">{u.email}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <RoleSelector userId={u.id} initialRole={u.role} />
                  </td>
                  <td className="px-8 py-6 text-xs font-bold text-slate-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase">
                       <ShieldCheck className="w-3 h-3" />verified
                    </span> 
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs text-slate-400 font-medium">No URLs assigned</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}