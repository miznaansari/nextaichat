"use client";

import { Quote, Sparkles } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

export default function QuoteStatsSection({ stats = { totalChats: 0, totalCharacters: 0, totalMessages: 0 } }) {
  const { t } = useLanguage();
  const charCount = stats.totalCharacters || 34;
  const messageDisplay = formatNumber(stats.totalMessages ?? 0);
  const chatDisplay = formatNumber(stats.totalChats ?? 0);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-purple-600/10 blur-[140px] pointer-events-none -z-10" />

      <div className="rounded-3xl bg-neutral-950/80 border border-purple-500/20 p-8 sm:p-12 backdrop-blur-xl relative shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <Quote className="w-10 h-10 text-purple-400 opacity-60" />
            <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-snug tracking-tight font-sans">
              "{t("Talk, learn, and play with AI companions that listen, remember your stories, and chat just like real friends.")}"
            </blockquote>
            <p className="text-xs sm:text-sm text-purple-300 font-bold uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t("NEXTAICHAT ROLEPLAY PLATFORM")}</span>
            </p>
          </div>

          <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-neutral-800 pt-6 lg:pt-0 lg:pl-8 space-y-6">
            <div>
              <p className="text-3xl sm:text-4xl font-black text-white">{charCount}+</p>
              <p className="text-xs text-neutral-300 uppercase tracking-wider font-semibold mt-1">{t("Unique AI Avatars & Games")}</p>
            </div>

            <div>
              <p className="text-3xl sm:text-4xl font-black text-purple-400">{messageDisplay}+</p>
              <p className="text-xs text-neutral-300 uppercase tracking-wider font-semibold mt-1">{t("Roleplay Messages Generated")}</p>
            </div>

            <div>
              <p className="text-3xl sm:text-4xl font-black text-indigo-400">{chatDisplay}+</p>
              <p className="text-xs text-neutral-300 uppercase tracking-wider font-semibold mt-1">{t("Total Roleplays Started")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
