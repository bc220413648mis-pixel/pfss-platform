import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { 
  DollarSign, ShieldAlert, Users, LayoutDashboard, 
  Search, FolderRoot, HeartPulse, PlusCircle, 
  LogOut, ClipboardCheck, Settings, Briefcase, UserIcon,
  Activity
} from "lucide-react";

export default async function DashboardShell({ 
  children, 
  role 
}: { 
  children: React.ReactNode, 
  role: string 
}) {
  const session = await getServerSession(authOptions);

  // Advanced Nav Logic: Dynamic based on Role
  const navItems = {
    
    CLIENT: [
      { name: 'Overview', href: '/dashboard/client', icon: LayoutDashboard },
      { name: 'New Scan', href: '/dashboard/projects/new', icon: PlusCircle },
      { name: 'All Audits', href: '/dashboard/client/projects/allprojects', icon: Activity },
      { name: 'Log out', href: '/api/auth/signout', icon: LogOut },
    ],
    AUDITOR: [
      { name: 'Overview', icon: LayoutDashboard, href: '/dashboard/auditor' },
      { name: 'Pending Audits', icon: ClipboardCheck, href: '/dashboard/auditor/tasks' },
      { name: 'QA Returned', icon: ClipboardCheck, href: '/dashboard/auditor/Returned' },
      { name: 'Log out',  icon: LogOut ,href: '/api/auth/signout' },
    ],
    QA: [
      { name: 'Overview', icon: LayoutDashboard, href: '/dashboard/qa' },
      { name: 'Log out' , icon: LogOut, href: '/api/auth/signout' },
    ],
    FOUNDER: [
      { name: 'Overview', icon: LayoutDashboard, href: '/dashboard/founder' },
      { name: 'Project Registry', icon: FolderRoot, href: '/dashboard/founder/projects' },
      { name: 'User Governance', icon: Users, href: '/dashboard/founder/users' },
      { name: 'Financial Engine', icon: DollarSign, href: '/dashboard/founder/billing' },
      { name: 'System Settings', icon: ShieldAlert, href: '/dashboard/founder/settings' },
      { name: 'Log out', href: '/api/auth/signout', icon: LogOut },
    ]
  };


  const activeNav = navItems[role as keyof typeof navItems] || [];

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      {/* 1. SOLID SIDEBAR - Fixed Width, Full Height, No Scroll */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col shrink-0 border-r border-slate-800">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
              <ShieldAlert className="text-white w-6 h-6" />
            </div>
            <h2 className="text-xl font-black tracking-tighter text-white uppercase italic">Nexus OS</h2>
          </div>

          <nav className="space-y-1">
            {activeNav.map((item) => (
              <Link 
                key={item.href} 
                href={item.href} 
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-white hover:bg-blue-500 transition-all group ">
                <item.icon className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* 2. MAIN VIEWPORT - Right Side Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* SOLID HEADER - Fixed at Top */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 shrink-0">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Operational Mode</span>
            <p className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {role} Interface Active
            </p>
          </div>

          {/* USER INFO: Showing Full Name and Avatar */}
          <div className="flex items-center gap-4">
            <span className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-400">
                {session?.user?.name?.charAt(0)}
              </span>
            <div className="text-left flex flex-col">
              <span className="text-sm font-black text-slate-900 leading-none mb-1">
                {session?.user?.name || "Nexus Operator"}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                {session?.user?.email}
              </span>
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT AREA */}
        <main className="flex-1 overflow-y-auto bg-[#F8FAFC]">
          {children}
        </main>
      </div>
    </div>
  );
}