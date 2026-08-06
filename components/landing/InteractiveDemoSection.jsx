"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Sparkles, Send, Zap, Shield, Cpu, Layers } from "lucide-react";

export default function InteractiveDemoSection({ id, appUrl = "https://app.nextaichat.online" }) {
  const [activeStep, setActiveStep] = useState(0);

  const simulatedChatMessages = [
    { sender: "user", text: "Hey Sir! Can you explain Lenz's law in 2 simple sentences for my physics exam tomorrow?" },
    { sender: "kota", avatar: "/avatars/kota_verma_teacher.png", name: "Kota Verma Sir", text: "Arey beta! Lenz's law states that induced current always opposes the magnetic change that created it. Think of it like nature being stubborn — if magnetic flux increases, induced current fights to decrease it!" },
    { sender: "user", text: "Wow, that analogy makes total sense! What about Faraday's law?" },
    { sender: "kota", avatar: "/avatars/kota_verma_teacher.png", name: "Kota Verma Sir", text: "Faraday's law gives you the MAGNITUDE of induced emf (rate of change of flux), while Lenz's law gives you the DIRECTION (- sign). Simple as that! Keep practicing!" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % simulatedChatMessages.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [simulatedChatMessages.length]);

  const features = [
    {
      title: "Real-Time Persona Adaptation",
      description: "Characters remember your study goals, tone preferences, and past chat context continuously.",
      icon: Cpu
    },
    {
      title: "Multi-Character Group Chats",
      description: "Chat with entire squads (Campus Trio, Delhi College Squad, Study Buddies) with dynamic turn-taking.",
      icon: Layers
    },
    {
      title: "Sub-Second Latency Powered by Gemini AI",
      description: "Lightning fast responses with zero waiting time. Built for fluid, natural dialogue flow.",
      icon: Zap
    },
    {
      title: "100% Private & End-to-End Secure",
      description: "Your roleplay conversations are encrypted and never used for public training without consent.",
      icon: Shield
    }
  ];

  return (
    <section id={id} className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ADVANCED ENGINE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight uppercase font-sans">
            Data. AI. Speed. <br />
            <span className="text-purple-400">Better Together.</span>
          </h2>

          <p className="text-neutral-300 text-base leading-relaxed">
            NextAiChat combines cutting-edge LLMs with dedicated memory layers and persona steering. Experience realistic conversations whether you're studying for exams or unwinding with AI besties.
          </p>

          <div className="space-y-4 pt-2">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div key={i} className="flex items-start gap-4 p-3.5 rounded-2xl bg-neutral-900/40 border border-purple-500/15 hover:border-purple-500/40 transition-all backdrop-blur-md">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{feat.title}</span>
                      <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">{feat.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <a
              href={appUrl}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-purple-500 hover:bg-purple-400 text-neutral-950 font-bold text-sm transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)]"
            >
              <span>Test Live Chat Sandbox</span>
              <Zap className="w-4 h-4 fill-current" />
            </a>
          </div>
        </div>

        <div className="lg:col-span-6 relative">
          <div className="rounded-3xl bg-neutral-950/90 border border-purple-500/20 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-xl">
            <div className="px-5 py-4 border-b border-neutral-800/80 bg-neutral-900/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-semibold text-neutral-400 border-l border-neutral-800 pl-3">
                  Live AI Roleplay Sandbox
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-full font-mono">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                <span>ONLINE: 0.4s</span>
              </div>
            </div>

            <div className="p-5 space-y-4 h-[360px] overflow-y-auto font-sans">
              {simulatedChatMessages.slice(0, activeStep + 1).map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 transition-all duration-300 ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender !== "user" && (
                    <img
                      src={msg.avatar}
                      alt={msg.name}
                      className="w-9 h-9 rounded-full object-cover border border-purple-500/40 shrink-0"
                    />
                  )}

                  <div
                    className={`max-w-[82%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-purple-600 text-white rounded-tr-none font-medium shadow-md"
                        : "bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-tl-none shadow-sm"
                    }`}
                  >
                    {msg.sender !== "user" && (
                      <p className="text-[10px] font-bold text-purple-300 mb-1">{msg.name}</p>
                    )}
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-neutral-800/80 bg-neutral-900/40 flex items-center gap-2">
              <div className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-neutral-400 flex items-center justify-between">
                <span>Ask physics problem, talk to Shanaya, or play Escape Room...</span>
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              <button className="w-10 h-10 rounded-xl bg-purple-500 text-neutral-950 flex items-center justify-center font-bold">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
