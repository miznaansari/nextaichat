"use client";

import { ArrowUpRight, Sparkles, Cpu, Shield, Zap, Layers, RefreshCw, MessageSquare, Bot, Star } from "lucide-react";

export default function ToolkitProcessCtaSection({
  appUrl = "https://app.nextaichat.online",
  stats = { totalCharacters: 0 }
}) {
  const charCount = stats.totalCharacters || 34;

  const capabilities = [
    { name: "Smart AI", icon: Cpu },
    { name: "Instant Chat", icon: Zap },
    { name: "Remembers You", icon: RefreshCw },
    { name: "100% Private", icon: Shield },
    { name: "Group Chats", icon: Layers },
    { name: `${charCount}+ Characters`, icon: Bot },
    { name: "Natural Talking", icon: MessageSquare },
    { name: "Always Online", icon: Star }
  ];

  const steps = [
    { num: "01", title: "PICK CHARACTER", desc: `Pick any character — study tutor, college bestie, or fun game.` },
    { num: "02", title: "SET PREFERENCE", desc: "Choose your favorite chat style, language, or topic." },
    { num: "03", title: "START CHATTING", desc: "Start talking instantly with zero waiting time." },
    { num: "04", title: "LEARN & ENJOY", desc: "Solve physics problems, gossip, or play story games." }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto border-b border-purple-500/10 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Column 1: MY TOOLKIT / AI CAPABILITIES */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-neutral-900/60 border border-purple-500/15 backdrop-blur-md flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight text-white mb-6 font-sans">
              WHY YOU'LL LOVE IT
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {capabilities.map((cap, i) => {
                const Icon = cap.icon;
                return (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-center gap-2.5 hover:border-purple-500/40 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-neutral-300">{cap.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-neutral-800 text-[11px] font-mono text-neutral-400">
            PLATFORM STATUS: ONLINE & READY 24/7
          </div>
        </div>

        {/* Column 2: WORK PROCESS / HOW IT WORKS */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-neutral-900/60 border border-purple-500/15 backdrop-blur-md flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight text-white mb-6 font-sans">
              HOW IT WORKS
            </h3>

            <div className="space-y-4">
              {steps.map((st, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {st.num}
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold uppercase text-white tracking-wider">
                      {st.title}
                    </h4>
                    <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
                      {st.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-neutral-800 text-[11px] font-mono text-neutral-400">
            SIMPLE • FAST • PRIVATE
          </div>
        </div>

        {/* Column 3: Vibrant Solid Purple CTA Block (Exact Layout "LET'S BUILD SOMETHING AMAZING TOGETHER ✦" from Image) */}
        <div className="lg:col-span-4 p-8 rounded-2xl bg-purple-600 border border-purple-400 text-neutral-950 flex flex-col justify-between shadow-[0_0_40px_rgba(168,85,247,0.4)] relative overflow-hidden group">
          
          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-extrabold tracking-widest text-neutral-950/70 uppercase">
                START ROLEPLAY
              </span>
              <Sparkles className="w-5 h-5 text-neutral-950" />
            </div>

            <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-neutral-950 leading-[0.95] font-sans">
              LET'S CHAT <br /> WITH AI <br /> TOGETHER ✦
            </h3>

            <p className="text-xs text-neutral-950/80 font-medium leading-relaxed">
              Get instant access to {charCount}+ AI personas, study simulators, college squads, and interactive story games.
            </p>
          </div>

          <div className="pt-6 relative z-10">
            <a
              href={appUrl}
              className="w-full py-4 rounded-xl bg-neutral-950 hover:bg-neutral-900 text-white font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg group-hover:scale-[1.02]"
            >
              <span>GET STARTED FREE</span>
              <ArrowUpRight className="w-4 h-4 text-purple-400" />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
