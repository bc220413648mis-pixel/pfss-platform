"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function AuthContent() {
  const [view, setView] = useState<"login" | "register" | "forgot">("login");
  const [formData, setFormData] = useState({ email: "", password: "", name: "", role: "CLIENT" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const viewParam = searchParams.get("view");
    if (viewParam === "register") setView("register");
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (view === "login") {
      const res = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });
      if (res?.error) setError("Invalid credentials. Please check your email and password.");
      else router.push("/dashboard/check");
    } else if (view === "register") {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setView("login");
        alert("Registration successful! Please login.");
      } else {
        const data = await res.json();
        setError(data.error || "Registration failed.");
      }
    }else if (view === "forgot") {
    // NEW LOGIC FOR FORGOT PASSWORD
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      if (res.ok) {
        alert("If an account exists with that email, a reset link has been sent.");
        setView("login");
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setError("Failed to send reset email.");
    }
  }
  setLoading(false);
};
    

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      {/* Back to Home Link */}
      <div className="p-6">
        <Link href="/" className="text-slate-500 hover:text-blue-700 font-bold text-sm flex items-center gap-2 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
          BACK TO HOME
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-10 rounded-[2rem] shadow-2xl shadow-blue-100/50 border border-slate-100">
          <div className="text-center mb-10">
            <div className="w-12 h-12 bg-blue-700 rounded-xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">P</div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Pathfinder Portal</h1>
            <p className="text-slate-400 text-sm mt-1">Accessibility Compliance Management</p>
          </div>

          {view !== "forgot" && (
            <div className="flex mb-8 bg-slate-100 p-1.5 rounded-2xl">
              <button onClick={() => setView("login")} className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${view === "login" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500"}`}>Login</button>
              <button onClick={() => setView("register")} className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${view === "register" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500"}`}>Register</button>
            </div>
          )}

          {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold mb-6 border border-red-100 animate-pulse">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {view === "register" && (
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-1 block">Full Name / Org</label>
                <input type="text" placeholder="John Doe" required className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all" onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
            )}
            
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-1 block">Email Address</label>
              <input type="email" placeholder="name@company.com" required className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all" onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
            
            {view !== "forgot" && (
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-1 block">Password</label>
                <input type="password" placeholder="••••••••" required className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all" onChange={(e) => setFormData({...formData, password: e.target.value})} />
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full py-4 bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-blue-800 shadow-lg shadow-blue-200 transition-all disabled:opacity-50 mt-4">
              {loading ? "Processing..." : view === "login" ? "Sign In" : view === "register" ? "Create Account" : "Send Reset Link"}
            </button>
          </form>

          <div className="mt-8 text-center">
            {view === "login" && (
              <button onClick={() => setView("forgot")} className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-700 hover:underline">Forgot your password?</button>
            )}
            {view === "forgot" && (
              <button onClick={() => setView("login")} className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-700 hover:underline">Return to Login</button>
            )}
          </div>
        </div>
      </div>
      
      <p className="text-center py-8 text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">
        Pathfinder Solutions (Private) Limited
      </p>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-black text-slate-200 tracking-widest">LOADING PORTAL...</div>}>
      <AuthContent />
    </Suspense>
  );
}