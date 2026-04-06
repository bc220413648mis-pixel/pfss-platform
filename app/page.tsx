import Link from "next/link";

export default function HomePage() {
  const auditTiers = [
    {
      name: "Basic",
      price: "Free / PKR 0",
      description: "Ideal for individual developers & small NGOs.",
      features: ["Automated WCAG 2.1 Scan", "Score Dashboard", "Standard HTML Report", "24-Hour Queue"],
      cta: "Start Free Scan",
      id: "basic"
    },
    {
      name: "Professional",
      price: "$199 / PKR 55k",
      description: "For Corporates & Gov Agencies needing manual proof.",
      features: ["Manual Auditor Evidence", "Direct Auditor Messaging", "Remediation Checklist (CSV)", "SLA: 3-5 Business Days"],
      cta: "Get Professional Audit",
      id: "professional"
    },
    {
      name: "Enterprise",
      price: "Custom Quote",
      description: "Full organization-wide compliance management.",
      features: ["QA Admin Double-Review", "Founder Final Approval", "PDF Executive Summary", "Priority Support & Training"],
      cta: "Contact for Enterprise",
      id: "enterprise"
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-blue-100">
      {/* 1. TOP NAVIGATION */}
      <nav className="h-20 border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-xl">P</div>
          <span className="font-black text-2xl tracking-tighter">PATHFINDER</span>
        </div>
        <div className="hidden md:flex gap-8 text-xs font-bold tracking-widest text-slate-500 uppercase">
          <Link href="#process" className="hover:text-blue-700">Our Process</Link>
          <Link href="#plans" className="hover:text-blue-700">Audit Plans</Link>
          <Link href="/policy" className="hover:text-blue-700">Gov Policy</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-bold px-4 py-2 hover:text-blue-700">LOGIN</Link>
          <Link href="/login?view=register" className="bg-blue-700 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:shadow-lg hover:shadow-blue-200 transition-all">GET STARTED</Link>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <header className="py-24 px-6 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Next-Gen Compliance for Pakistan & Emerging Markets
        </div>
        <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight mb-8">
          Bridge the digital <br />
          <span className="text-blue-700 underline decoration-blue-200 underline-offset-8">accessibility gap.</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          The only platform combining automated speed with manual auditor expertise. Compliant with WCAG 2.1, specialized for NGOs, Government, and Corporates.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/login?view=register&plan=basic" className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all">Submit Your First URL</Link>
          <Link href="#process" className="bg-white border-2 border-slate-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all">How it Works</Link>
        </div>
      </header>

      {/* 3. PROCESS WORKFLOW (MVP Section 1) */}
      <section id="process" className="py-20 bg-white border-y">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-xs font-black text-blue-700 tracking-[0.3em] uppercase mb-12 text-center">Our Professional Workflow</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Scan", desc: "Automated engine identifies 40% of issues instantly." },
              { step: "02", title: "Audit", desc: "Human experts provide manual evidence for complex barriers." },
              { step: "03", title: "QA Review", desc: "Admin-level quality assurance ensures report accuracy." },
              { step: "04", title: "Certify", desc: "Receive accessible HTML/PDF reports for compliance." }
            ].map((s) => (
              <div key={s.step} className="relative p-6">
                <span className="text-5xl font-black text-slate-100 absolute top-0 left-0 -z-0 leading-none">{s.step}</span>
                <div className="relative z-10">
                  <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. REVENUE ENGINE (Pricing Tiers) */}
      <section id="plans" className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4 tracking-tight">Audit Plans & Gating</h2>
            <p className="text-slate-500">Scalable solutions from single-page scans to full enterprise retainership.</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {auditTiers.map((tier) => (
              <div key={tier.name} className="bg-white border-2 border-slate-200 rounded-3xl p-10 flex flex-col hover:border-blue-600 hover:shadow-2xl hover:shadow-blue-100 transition-all group">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <p className="text-slate-500 text-sm mb-6">{tier.description}</p>
                  <div className="text-3xl font-black text-blue-700 mb-8">{tier.price}</div>
                  <ul className="space-y-4 mb-10">
                    {tier.features.map(f => (
                      <li key={f} className="flex items-start gap-3 text-sm font-medium text-slate-600">
                        <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link 
                  href={`/login?view=register&plan=${tier.id}`}
                  className="w-full py-4 rounded-xl font-bold text-center bg-slate-900 text-white group-hover:bg-blue-700 transition-colors"
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FOOTER & LOW-BANDWIDTH LINKS */}
      <footer className="py-16 px-6 border-t bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center text-white font-bold">P</div>
              <span className="font-bold tracking-tighter">PATHFINDER SOLUTIONS</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm">© 2026 Pathfinder Solutions (Private) Limited. Registered in Pakistan. Optimized for low-bandwidth environments.</p>
          </div>
          <div className="flex flex-wrap gap-x-12 gap-y-4 text-[10px] font-black uppercase tracking-widest text-slate-400 md:justify-end">
            <Link href="/policy" className="hover:text-blue-700">National Policy</Link>
            <Link href="/sla" className="hover:text-blue-700">SLA Terms</Link>
            <Link href="/compliance" className="hover:text-blue-700">Accessibility Statement</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}