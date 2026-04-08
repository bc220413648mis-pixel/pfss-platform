"use client";

import { useState } from "react";
import { createProject } from "@/lib/actions/project";
import { Plus, Trash2, Globe, Shield, Activity, Link, BackpackIcon } from "lucide-react";


export default function NewProjectPage() {
  const [pages, setPages] = useState([{ id: 1, url: "", name: "" }]);
  const [isPending, setIsPending] = useState(false);

  const addPage = () => {
    setPages([...pages, { id: Date.now(), url: "", name: "" }]);
  };

  const removePage = (id: number) => {
    if (pages.length > 1) {
      setPages(pages.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
        
      <div className="flex items-center gap-4 mb-8">
        <div className="flex items-center p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-200">
          <Activity className="text-white w-6 h-6" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Project Architect</h2>
          <p className="text-slate-500 font-medium">Define scope and compliance standards for Pathfinder Audit.</p>
        </div>
      </div>

      <form 
        action={async (formData) => {
          setIsPending(true);
          await createProject(formData);
        }} 
        className="space-y-8"
      >
        {/* SECTION 1: CORE DETAILS */}
        <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" /> Core Audit Target
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Client Root Domain</label>
              <input 
                name="domain"
                required
                type="text" 
                placeholder="https://client-website.com"
                className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Service Level (Tier)</label>
              <select name="tier" className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none appearance-none cursor-pointer">
                <option value="BASIC">Tier 1: Basic (Automated Only)</option>
                <option value="PRO">Tier 2: Pro (Expert Manual Audit)</option>
                <option value="ENTERPRISE">Tier 3: Enterprise (Governance & Legal)</option>
              </select>
            </div>
          </div>
        </section>

        {/* SECTION 2: COMPLIANCE SCOPE */}
        <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600" /> Compliance Framework
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">WCAG Version</label>
              <select name="wcagVersion" className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 outline-none">
                <option value="2.1">WCAG 2.1 (International Standard)</option>
                <option value="2.2">WCAG 2.2 (Modern Accessibility)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Compliance Level</label>
              <select name="complianceLevel" className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 outline-none">
                <option value="AA">Level AA (Legal Requirement)</option>
                <option value="AAA">Level AAA (Highest Standard)</option>
              </select>
            </div>
          </div>
        </section>

        {/* SECTION 3: DYNAMIC PAGE INVENTORY */}
        <section className="bg-slate-50 p-8 rounded-2xl border-2 border-dashed border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Audit Inventory</h3>
              <p className="text-sm text-slate-500">List specific pages to be audited under this project.</p>
            </div>
            <button 
              type="button" 
              onClick={addPage}
              className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg border border-blue-200 font-bold hover:bg-blue-50 transition"
            >
              <Plus className="w-4 h-4" /> Add Page
            </button>
          </div>

          <div className="space-y-4">
            {pages.map((page, index) => (
              <div key={page.id} className="flex gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <input 
                    name="pageNames"
                    placeholder="Page Name (e.g. Checkout)"
                    required
                    className="p-3 rounded-lg border border-slate-200 outline-none focus:border-blue-500" 
                  />
                  <input 
                    name="pages"
                    placeholder="/url-path"
                    required
                    className="p-3 rounded-lg border border-slate-200 outline-none focus:border-blue-500" 
                  />
                </div>
                <button 
                  type="button" 
                  onClick={() => removePage(page.id)}
                  className="p-3 text-slate-400 hover:text-red-500 transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </section>

        <button 
          disabled={isPending}
          className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-slate-800 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3">
          {isPending ? "Generating Audit Infrastructure..." : "Finalize & Launch Project"}
        </button>
      </form>
      
    </div>
    
  );
}