import { SubscriptionTier } from "@prisma/client";
import { Check, Zap, Shield, Crown } from "lucide-react";
import DashboardShell from "@/app/components/dashboard-shell";
import { createCheckoutSession } from "@/lib/actions/stripe-actions";

const plans = [
  {
    tier: SubscriptionTier.BASIC,
    name: "Automated Pulse",
    price: 199,
    features: ["Unlimited Auto-Scans", "WCAG 2.1 Checklist", "Email Support"],
    icon: Zap,
    color: "text-blue-600",
    description: "Best for small landing pages and startups."
  },
  {
    tier: SubscriptionTier.PRO,
    name: "Expert Hybrid",
    price: 899,
    features: ["Everything in Basic", "Manual Auditor Review", "PDF Executive Report", "Priority QA"],
    icon: Shield,
    color: "text-indigo-600",
    popular: true,
    description: "Professional compliance for SaaS & E-commerce."
  },
  {
    tier: SubscriptionTier.ENTERPRISE,
    name: "Full Governance",
    price: 2499,
    features: ["Full Manual Audit", "Founder Review Access", "Custom SLA (3 Days)", "Legal Compliance Letter"],
    icon: Crown,
    color: "text-slate-900",
    description: "Critical infrastructure and government-grade audits."
  }
];

export default function PlansPage() {
  return (
    <DashboardShell role="CLIENT">
      <div className="p-10 bg-[#F8FAFC] min-h-screen">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">Select Audit Depth</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Choose the level of compliance required for your domain</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <div key={plan.tier} className={`relative bg-white rounded-[3rem] p-10 border-2 transition-all hover:shadow-2xl ${plan.popular ? 'border-blue-600 scale-105 z-10' : 'border-slate-100'}`}>
              {plan.popular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Most Requested</span>
              )}
              
              <plan.icon className={`w-12 h-12 ${plan.color} mb-6`} />
              <h3 className="text-2xl font-black text-slate-900 mb-2">{plan.name}</h3>
              <p className="text-slate-400 text-xs font-bold mb-8 leading-relaxed">{plan.description}</p>
              
              <div className="mb-8">
                <span className="text-5xl font-black text-slate-900">${plan.price}</span>
                <span className="text-slate-400 font-bold">/per audit</span>
              </div>

              <ul className="space-y-4 mb-10">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                    <Check className="w-4 h-4 text-emerald-500" /> {f}
                  </li>
                ))}
              </ul>

              <form action={createCheckoutSession}>
                <input type="hidden" name="tier" value={plan.tier} />
                <input type="hidden" name="price" value={plan.price} />
                <button className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${plan.popular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-100 text-slate-900 hover:bg-slate-900 hover:text-white'}`}>
                  Initialize {plan.tier} Audit
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}