import Link from "next/link";

export default function PolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="max-w-3xl mx-auto bg-white p-12 rounded-3xl shadow-sm border">
        <Link href="/" className="text-blue-700 font-bold text-sm hover:underline">← Back to Home</Link>
        <h1 className="text-4xl font-black mt-8 mb-6">National Digital Accessibility Policy</h1>
        <p className="text-slate-600 mb-6 leading-relaxed">
          Pathfinder Solutions (Private) Limited operates in alignment with the **Digital Pakistan Policy** and international **WCAG 2.1** standards. Our mission is to ensure that digital services for all citizens—regardless of disability—are accessible and inclusive.
        </p>
        <h2 className="text-xl font-bold mb-4">Compliance Framework</h2>
        <ul className="space-y-4 text-slate-600 mb-8">
          <li className="flex gap-2"><strong>Level A:</strong> Essential accessibility for all web platforms.</li>
          <li className="flex gap-2"><strong>Level AA:</strong> The standard for Government and Corporate portals.</li>
          <li className="flex gap-2"><strong>Level AAA:</strong> Specialized high-accessibility for NGO and educational sites.</li>
        </ul>
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
          <p className="text-sm text-blue-800 font-medium italic">"Ensuring no citizen is left behind in the digital era."</p>
        </div>
      </div>
    </div>
  );
}