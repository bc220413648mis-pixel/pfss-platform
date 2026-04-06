import { prisma } from "@/lib/prisma";
import DashboardShell from "@/app/components/dashboard-shell";
import { updateGlobalSettings } from "@/lib/actions/founder-actions";
import { 
  ShieldAlert, Star, Percent, ShieldCheck, 
  Activity, Zap, Fingerprint, Cog 
} from "lucide-react";

export default async function FounderSettingsPage() {
  // Fetch real data with a fallback for the first-time setup
  const settings = await prisma.systemSettings.findFirst() || {
    qaThreshold: 90,
    ngoDiscount: 50.0,
    slaDays: 3
  };

  return (
    <DashboardShell role="FOUNDER">
      
      <form action={updateGlobalSettings} className="p-10 bg-[#F8FAFC] min-h-screen">
        
        {/* Header with Glassmorphism Effect */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-ping" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Core Protocol Engine</span>
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Governance</h1>
          </div>
          <button type="submit" className="group relative bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest overflow-hidden transition-all hover:pr-14 hover:bg-blue-600">
            <span className="relative z-10">Commit Changes</span>
            <Zap className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* PRIMARY CONTROLS (8 Columns) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* QA Threshold: The "Founder Rating" Setting */}
            <div className="bg-white border border-slate-200 rounded-[3rem] p-10 relative overflow-hidden group">
               <div className="flex justify-between items-start mb-10">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2 flex items-center gap-2">
                      <Star className="text-yellow-500 fill-yellow-500 w-6 h-6" /> QA Approval Gate
                    </h2>
                    <p className="text-slate-500 text-sm font-medium max-w-md">
                      Define the minimum accessibility score an auditor must achieve for a project to move to "Completed" status.
                    </p>
                  </div>
                  <div className="text-6xl font-black text-slate-500 group-hover:text-blue-50 transition-colors">
                    {settings.qaThreshold}%
                  </div>
               </div>
               
               <div className="relative py-4">
                  <input 
                    name="qaThreshold"
                    type="range" 
                    min="50" max="100"
                    defaultValue={settings.qaThreshold}
                    className="w-full h-4 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600 border-4 border-white shadow-inner" 
                  />
                  <div className="flex justify-between mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span>Minimum (50%)</span>
                    <span>Professional Grade (90%)</span>
                    <span>Perfect (100%)</span>
                  </div>
               </div>
            </div>

            {/* NGO & SLA Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-slate-200">
                  <Percent className="text-emerald-400 mb-6 w-10 h-10" />
                  <h3 className="font-black text-xl mb-2">NGO Subsidy</h3>
                  <p className="text-slate-400 text-xs mb-8 leading-relaxed">Applied to all .org and verified non-profit domains automatically.</p>
                  <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <input 
                      name="ngoDiscount"
                      type="number" 
                      defaultValue={settings.ngoDiscount}
                      className="bg-transparent text-5xl font-black w-full outline-none focus:text-emerald-400"
                    />
                    <span className="text-xl font-bold text-slate-500">%</span>
                  </div>
               </div>

               <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm">
                  <ShieldCheck className="text-blue-600 mb-6 w-10 h-10" />
                  <h3 className="font-black text-xl text-slate-900 mb-2">SLA Window</h3>
                  <p className="text-slate-500 text-xs mb-8 leading-relaxed">Guaranteed turnaround time for manual expert audits.</p>
                  <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <input 
                      name="slaDays"
                      type="number" 
                      defaultValue={settings.slaDays}
                      className="bg-transparent text-5xl font-black text-slate-900 w-full outline-none"
                    />
                    <span className="text-xl font-bold text-slate-400">DAYS</span>
                  </div>
               </div>
            </div>
          </div>

          {/* SECONDARY CONTROLS (4 Columns) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white border border-slate-200 rounded-[3rem] p-8 shadow-sm">
               <h3 className="text-sm font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-tighter">
                 <ShieldAlert className="w-4 h-4 text-red-500" /> Panic Controls
               </h3>
               <div className="space-y-4">
                  <div className="p-6 bg-red-50 rounded-3xl border border-red-100 flex justify-between items-center group cursor-pointer hover:bg-red-500 hover:text-white transition-all">
                    <div>
                      <p className="font-black text-sm">Maintenence</p>
                      <p className="text-[10px] opacity-60 font-bold uppercase">Lock Platform</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                       <Cog className="w-5 h-5 animate-spin-slow" />
                    </div>
                  </div>
               </div>
            </div>

            <div className="bg-blue-600 rounded-[3rem] p-8 text-white">
               <Fingerprint className="w-8 h-8 mb-4 text-blue-200" />
               <h3 className="font-black text-lg mb-2">Audit Encryption</h3>
               <p className="text-blue-100 text-[10px] leading-relaxed mb-6 font-medium">
                 All audit data is currently encrypted with AES-256 standards. Node engine status: Healthy.
               </p>
               <div className="flex items-center gap-2">
                  <Activity className="w-3 h-3 text-emerald-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Active Monitoring</span>
               </div>
            </div>
          </div>

        </div>
      </form>
    </DashboardShell>
  );
}