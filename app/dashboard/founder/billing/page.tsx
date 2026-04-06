import { prisma } from "@/lib/prisma";
import DashboardShell from "@/app/components/dashboard-shell";
import { DollarSign, CreditCard, PieChart, ArrowRight } from "lucide-react";

export const revalidate = 0; // DISABLE CACHING

export default async function FounderBillingPage() {
  // Fetch aggregate sum of COMPLETED transactions
  const stats = await prisma.transaction.aggregate({
    where: { status: "COMPLETED" },
    _sum: { amount: true }
  });

  const totalRevenue = stats._sum.amount || 0;

  const recentTransactions = await prisma.transaction.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: { user: true }
  });

  return (
    <DashboardShell role="FOUNDER">
      <div className="p-8 bg-[#F8FAFC] min-h-screen">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Financial Oversight</h1>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Global Revenue Stream</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm">
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Total Gross Revenue</p>
            <h2 className="text-6xl font-black text-slate-900 mb-10">
              ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h2>

            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recent Activity</p>
              {recentTransactions.length === 0 ? (
                <p className="text-slate-400 italic text-sm">No transactions found.</p>
              ) : (
                recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-slate-200 text-emerald-500 font-bold">
                        $
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{tx.user?.email || 'Unknown User'}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(tx.createdAt).toDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-slate-900">$+{tx.amount.toFixed(2)}</p>
                      <p className="text-[9px] font-bold text-emerald-500 uppercase">Success</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2rem] p-8 text-white h-fit">
            <CreditCard className="w-8 h-8 text-blue-400 mb-6" />
            <h3 className="font-black text-xl mb-2">Stripe Payouts</h3>
            <p className="text-slate-400 text-sm mb-6">Funds are typically settled within 2-3 business days.</p>
            <a href="https://dashboard.stripe.com" target="_blank" className="block w-full bg-blue-600 text-center py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-500 transition-all">
              View Stripe Dashboard
            </a>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}