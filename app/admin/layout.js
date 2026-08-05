"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  BookOpen,
  Sparkles,
  LogOut,
  Menu,
  X,
  Loader2,
  Activity,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

export default function AdminLayoutShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!isLoginPage) {
      checkAdminAuth();
    } else {
      setLoadingAuth(false);
    }
  }, [pathname]);

  const checkAdminAuth = async () => {
    try {
      const res = await fetch("/api/admin/me");
      if (!res.ok) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      setAdmin(data.admin);
    } catch (err) {
      router.push("/admin/login");
    } finally {
      setLoadingAuth(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mb-4" />
        <span className="text-sm font-mono tracking-wider text-slate-400">Verifying Admin Access...</span>
      </div>
    );
  }

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      active: pathname === "/admin",
    },
    {
      name: "System Health",
      href: "/admin/health",
      icon: Activity,
      active: pathname?.startsWith("/admin/health"),
    },
    {
      name: "Customers",
      href: "/admin/customer",
      icon: Users,
      active: pathname?.startsWith("/admin/customer"),
    },
    {
      name: "Blog Articles",
      href: "/admin/blog",
      icon: BookOpen,
      active: pathname?.startsWith("/admin/blog"),
    },
    {
      name: "Discover Characters",
      href: "/admin/discoverCharacter",
      icon: Sparkles,
      active:
        pathname?.startsWith("/admin/discoverCharacter") ||
        pathname?.startsWith("/admin/discoverCharactor"),
    },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col md:flex-row select-none">
      {/* Mobile Header Bar */}
      <header className="md:hidden h-16 bg-slate-950/90 border-b border-slate-800 px-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-cyan-400" />
          <span className="font-bold text-base tracking-tight text-white font-mono">
            NextAiChat Admin
          </span>
        </div>
        <button
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
        >
          {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Admin Sidebar Navigation (Fixed Viewport Anchor for Sticky Sidebar) */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 shrink-0 bg-slate-950 border-r border-slate-800/80 flex flex-col z-50 transition-transform duration-200 ease-out ${
          isMobileNavOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand Section */}
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-[1px] shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="font-bold text-sm text-white tracking-tight block">
                NextAiChat
              </span>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block">
                ADMIN CONTROL
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsMobileNavOpen(false)}
            className="md:hidden text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin User Info */}
        <div className="px-6 py-4 border-b border-slate-800/50 bg-slate-900/30 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold flex items-center justify-center text-xs">
            {admin?.username?.[0]?.toUpperCase() || "A"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">
              {admin?.username || "Admin User"}
            </p>
            <p className="text-[10px] text-slate-400 font-mono">SUPERADMIN</p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileNavOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  item.active
                    ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/10 text-cyan-300 border border-cyan-500/40 shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <Icon className={`w-4 h-4 ${item.active ? "text-cyan-400" : "text-slate-400"}`} />
                <span>{item.name}</span>
                {item.active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-cyan-400" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800/80 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
              <span>View Main Site</span>
            </span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 border border-transparent hover:border-rose-800/50 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Nexus</span>
          </button>
        </div>
      </aside>

      {/* Desktop Sidebar Spacer to preserve flex layout */}
      <div className="hidden md:block w-64 shrink-0 h-screen" />

      {/* Main Content View */}
      <main className="flex-1 min-w-0 bg-[#030712] min-h-screen">
        {children}
      </main>
    </div>
  );
}
