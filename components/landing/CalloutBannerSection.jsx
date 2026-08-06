"use client";

import { ArrowRight, ShieldCheck } from "lucide-react";

export default function CalloutBannerSection({ appUrl = "https://app.nextaichat.online" }) {
  const avatarStack = [
    "/avatars/aarav_smart_bestie.png",
    "/avatars/shanaya_delhi.png",
    "/avatars/kabir_rich_bestie.png",
    "/avatars/coach_priya.png",
    "/avatars/kota_verma_teacher.png"
  ];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-950/80 via-neutral-950 to-indigo-950/80 border border-purple-500/30 p-8 sm:p-12 shadow-[0_0_50px_rgba(168,85,247,0.15)] backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
          <div className="space-y-4 text-center lg:text-left max-w-2xl">
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <div className="flex -space-x-3 overflow-hidden">
                {avatarStack.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="User avatar"
                    className="inline-block h-9 w-9 rounded-full ring-2 ring-neutral-950 object-cover"
                  />
                ))}
              </div>
              <span className="text-xs text-purple-300 font-bold tracking-wide flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                Trusted by 100K+ Roleplayers
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight uppercase font-sans">
              Together, let's explore unlimited AI personas & stories.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300">
              Join NextAiChat today and get instant access to 33+ pre-configured AI tutors, besties, squads, and interactive games.
            </p>
          </div>

          <div className="shrink-0">
            <a
              href={appUrl}
              className="px-8 py-4 rounded-full bg-purple-500 hover:bg-purple-400 text-neutral-950 font-black text-sm sm:text-base transition-all duration-300 shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:scale-105 flex items-center gap-2 cursor-pointer"
            >
              <span>Join AI Roleplay Today</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
