"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2, KeyRound, Eye, EyeOff, Sparkles, Check } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid admin credentials");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoFill = () => {
    setEmail("");
    setPassword("");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-950/40 via-neutral-950 to-[#030712] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-purple-500 selection:text-white">
      {/* Background Animated Neon Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="absolute inset-0 bg-antigravity-grid opacity-30 pointer-events-none" />

      {/* Main Glass Card */}
      <div className="w-full max-w-md bg-neutral-900/70 backdrop-blur-2xl border border-purple-500/30 p-7 sm:p-9 rounded-3xl shadow-[0_0_80px_rgba(147,51,234,0.25)] space-y-6 relative z-10">

        {/* Portal Header */}
        <div className="text-center space-y-3 flex flex-col items-center">
          <Image
            src="/logo-landspace.png"
            alt="NextAiChat Logo"
            width={320}
            height={90}
            priority
            className="h-14 sm:h-16 w-auto object-contain drop-shadow-[0_0_25px_rgba(168,85,247,0.5)]"
          />

          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-purple-950/90 border border-purple-500/40 text-purple-300 text-[11px] font-mono font-bold shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>EXECUTIVE CONTROL PORTAL</span>
          </div>

          <p className="text-xs text-neutral-400 leading-relaxed max-w-xs mx-auto">
            Authorized portal to manage showcase AI characters, dynamic speaker presets & system metrics.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-red-950/90 border border-red-800 text-red-300 text-xs font-semibold text-center animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-purple-400" />
              <span>Admin Email Address</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gmail.com"
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500 rounded-2xl px-4 py-3 text-xs text-white outline-none transition-all shadow-inner"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-purple-400" />
                <span>Admin Password</span>
              </span>
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-[11px] text-purple-400 hover:underline flex items-center gap-1"
              >
                {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showPassword ? "Hide" : "Show"}</span>
              </button>
            </label>

            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500 rounded-2xl px-4 py-3 text-xs text-white outline-none transition-all shadow-inner"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-extrabold text-xs tracking-wider shadow-[0_0_30px_rgba(147,51,234,0.4)] flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 cursor-pointer mt-3"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <>
                <span>AUTHENTICATE & ACCESS PORTAL</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Seed Credentials Card */}

      </div>
    </div>
  );
}
