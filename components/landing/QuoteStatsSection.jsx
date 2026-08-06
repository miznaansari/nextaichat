"use client";

import { Quote, Sparkles } from "lucide-react";

export default function QuoteStatsSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-purple-600/10 blur-[140px] pointer-events-none -z-10" />

      <div className="rounded-3xl bg-neutral-950/80 border border-purple-500/20 p-8 sm:p-12 backdrop-blur-xl relative shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <Quote className="w-10 h-10 text-purple-400 opacity-60" />
            <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-snug tracking-tight">
              "Unleash your imagination with AI characters that remember your past, adapt to your personality, and converse like real human companions."
            </blockquote>
            <p className="text-xs sm:text-sm text-purple-300 font-bold uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>NEXTAICAT ROLEPLAY ENGINE v4.1</span>
            </p>
          </div>

          <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-neutral-800 pt-6 lg:pt-0 lg:pl-8 space-y-6">
            <div>
              <p className="text-3xl sm:text-4xl font-black text-white">33+</p>
              <p className="text-xs text-neutral-400 uppercase tracking-wider font-semibold mt-1">Unique AI Avatars & Games</p>
            </div>

            <div>
              <p className="text-3xl sm:text-4xl font-black text-purple-400">2.5M+</p>
              <p className="text-xs text-neutral-400 uppercase tracking-wider font-semibold mt-1">Roleplay Messages Generated</p>
            </div>

            <div>
              <p className="text-3xl sm:text-4xl font-black text-indigo-400">24 / 7</p>
              <p className="text-xs text-neutral-400 uppercase tracking-wider font-semibold mt-1">Always Available & Zero Queue</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
