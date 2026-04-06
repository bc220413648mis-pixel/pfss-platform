import { uploadEvidence } from "@/lib/actions/evidence";
import IssueLogger from "@/app/components/projects/IssueLogger";
import ScanButton from "@/app/components/projects/ScanButton";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { 
  Shield, 
  Calendar, 
  Layers, 
  CheckCircle2, 
  ImageIcon, 
  ExternalLink, 
  UploadCloud,
  FileBarChart
} from "lucide-react";
import Link from "next/link";

export default async function ProjectDetailsPage(props: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await props.params;

  const project = await prisma.auditProject.findUnique({
    where: { id: id },
    include: { 
        pages: {
        include: {
          issues: {
            include: { evidence: true } 
          }        
        }
      } 
    },
  });

  if (!project) return notFound();

  /**
   * INLINE SERVER ACTION
   * Professional pattern for handling file uploads within a Server Component loop.
   */
  const handleUpload = async (formData: FormData) => {
    "use server";
    await uploadEvidence(formData);
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-10 border-b border-slate-200 pb-10 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
             <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> {project.status}
            </span>
            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full border border-slate-200 uppercase tracking-widest">
              {project.tier}
            </span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">{project.domain}</h1>
          <div className="flex flex-wrap gap-6 mt-4 text-slate-500 font-medium">
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-md border border-slate-100 text-sm">
              <Shield className="w-4 h-4 text-blue-600" /> WCAG {project.wcagVersion} {project.complianceLevel}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4" /> Launched {new Date(project.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Link 
            href={`/dashboard/projects/${id}/report`}
            className="flex items-center gap-2 bg-white border-2 border-slate-900 text-slate-900 px-6 py-4 rounded-2xl font-black hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
          >
            <FileBarChart className="w-5 h-5" /> View Report
          </Link>
          <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-slate-800 hover:shadow-2xl transition-all active:scale-95 whitespace-nowrap">
            Start Expert Review
          </button>
        </div>
      </div>

      {/* --- PAGES INVENTORY --- */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <Layers className="w-6 h-6 text-blue-600" /> Audit Inventory
          </h2>
          <span className="text-sm font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
            {project.pages.length} Targets Defined
          </span>
        </div>

        <div className="grid gap-8">
        {project.pages.map((page) => (
            <div key={page.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            
            {/* Target Header with Integrated Scan Engine */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900">{page.name}</h3>
                  <p className="text-sm font-mono text-blue-600 truncate max-w-md">{page.url}</p>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                    {/* AUTOMATED SCAN TRIGGER */}
                    <ScanButton pageId={page.id} url={page.url} projectId={id} />
                    
                    <span className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-500 shadow-sm">
                      {page.issues.length} Findings
                    </span>
                </div>
            </div>

            <div className="divide-y divide-slate-100">
                {page.issues.length === 0 ? (
                <div className="p-10 text-center text-slate-400 italic text-sm bg-white">
                    No issues logged for this page. Click "Auto-Scan" to begin.
                </div>
                ) : (
                page.issues.map((issue) => (
                    <div key={issue.id} className={`p-6 transition-colors flex gap-6 ${!issue.isManual ? 'bg-blue-50/30' : 'bg-white'}`}>
                    <div className={`w-1.5 rounded-full ${
                        issue.severity === 'CRITICAL' ? 'bg-red-600' : 
                        issue.severity === 'HIGH' ? 'bg-orange-500' : 
                        'bg-yellow-400'
                    }`} />
                    
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                  WCAG {issue.wcagMapping}
                                </span>
                                {!issue.isManual && (
                                  <span className="text-[9px] font-black bg-blue-600 text-white px-2 py-0.5 rounded uppercase">AI Automated</span>
                                )}
                              </div>
                              <h4 className="text-lg font-bold text-slate-900">{issue.title}</h4>
                          </div>
                        </div>
                        <p className="text-slate-600 text-sm mt-2 leading-relaxed">{issue.description}</p>
                        
                        <div className="mt-4 p-4 bg-slate-100/80 rounded-2xl border border-slate-200">
                          <p className="text-[11px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Recommendation</p>
                          <p className="text-sm text-slate-700 italic font-medium">"{issue.recommendation}"</p>
                        </div>

                        {/* EVIDENCE SECTION */}
                        <div className="mt-6 border-t border-slate-100 pt-5">
                          <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                            <ImageIcon className="w-3 h-3" /> Visual Evidence Vault
                          </h5>

                          <div className="flex flex-wrap gap-3 mb-5">
                            {issue.evidence.map((ev) => (
                              <a 
                                key={ev.id} 
                                href={ev.url} 
                                target="_blank" 
                                className="group relative w-28 h-20 rounded-xl overflow-hidden border-2 border-slate-200 hover:border-blue-500 transition-all shadow-sm"
                              >
                                <img src={ev.url} alt="Evidence" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-blue-600/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                  <ExternalLink className="text-white w-5 h-5" />
                                </div>
                              </a>
                            ))}
                          </div>

                          {/* Professional Evidence Upload Action */}
                          <form action={handleUpload} className="flex items-center gap-3 bg-white p-2 pr-4 rounded-2xl border border-slate-200 shadow-sm w-fit">
                            <input type="hidden" name="issueId" value={issue.id} />
                            <input type="hidden" name="projectId" value={id} />
                            <label className="flex items-center gap-3 cursor-pointer group">
                              <div className="bg-slate-100 p-2.5 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all text-slate-500">
                                <UploadCloud className="w-5 h-5" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-900 uppercase">Add Evidence</span>
                                <input 
                                  type="file" 
                                  name="image" 
                                  accept="image/*" 
                                  required 
                                  className="text-[9px] text-slate-400 font-bold cursor-pointer"
                                />
                              </div>
                            </label>
                            <button className="bg-slate-900 text-white text-[10px] font-black px-5 py-2.5 rounded-xl hover:bg-blue-600 transition-all uppercase tracking-tight ml-2">
                              Upload
                            </button>
                          </form>
                        </div>
                    </div>
                    </div>
                ))
                )}
            </div>
            </div>
        ))}
        </div>

      </div>

      {/* Manual Issue Logger Drawer */}
      <IssueLogger projectId={id} pages={project.pages} />
    </div>
  );
}