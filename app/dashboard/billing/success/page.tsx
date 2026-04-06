import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import DashboardShell from "@/app/components/dashboard-shell";
import PrintButton from "@/app/components/billing/PrintButton";
import ActivationTrigger from "@/app/components/billing/ActivationTrigger";

export default async function BillingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id: string }>;
}) {
  const params = await searchParams;
  const sessionId = params.session_id;

  return (
    <DashboardShell role="CLIENT">
      <div className="min-h-[80vh] flex items-center justify-center p-6 bg-[#F8FAFC]">
        <div className="max-w-2xl w-full bg-white rounded-[3rem] p-12 shadow-xl border border-slate-100 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />
          
          <div className="mb-8 flex justify-center">
             <ActivationTrigger sessionId={sessionId} />
          </div>

          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">
            Payment Secured
          </h1>
          <p className="text-slate-500 font-medium mb-10 leading-relaxed">
            Your transaction was successful. Our auditors have been notified and your domain is now prioritized in the system.
          </p>

          <div className="bg-slate-50 rounded-3xl p-6 mb-10 text-left border border-slate-100">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Receipt Token</span>
              <span className="text-[10px] font-mono font-bold text-slate-900 truncate ml-4 max-w-[200px]">
                {sessionId}
              </span>
            </div>
            <div className="flex items-center gap-3 text-indigo-600 font-black text-sm">
              <ShieldCheck className="w-5 h-5" />
              Pro-Tier Audit License Activated
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/dashboard/client" 
              className="flex-1 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
            >
              Back to Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
            <PrintButton />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}