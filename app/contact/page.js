"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Mail,
  Send,
  User,
  MessageSquare,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Shield,
  FileText,
  Clock,
  Zap,
} from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("General");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const categories = [
    { id: "General", label: "💬 General" },
    { id: "Bug", label: "🐛 Bug Report" },
    { id: "Feature", label: "🚀 Feature Idea" },
    { id: "Feedback", label: "⭐ AI Feedback" },
    { id: "DMCA", label: "⚖️ Legal / DMCA" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, category, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message.");
      }

      setSuccessMsg(data.message || "Your message has been sent successfully!");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-16 relative z-10 flex flex-col justify-center">
      {/* Dynamic Ambient Background Glow */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* LEFT SIDE CONTENT (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-semibold self-start backdrop-blur-sm shadow-sm">
            <Mail className="w-4 h-4 text-purple-400" />
            <span>Support & Inquiries Desk</span>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Get in Touch with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
                NextAiChat
              </span>
            </h1>
            <p className="text-neutral-400 text-xs sm:text-sm mt-3 leading-relaxed">
              Have questions about NextAiChat's multi-character roleplay, custom AI tutors, feedback, or DMCA legal inquiries? Drop us a message!
            </p>
          </div>

          {/* Feature Highlight Cards */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-sm">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Instant Team Delivery</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">Submissions trigger instant notifications to our team support desk.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-sm">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Daily Monitoring</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">We monitor bug reports, feature ideas, and inquiries daily.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-sm">
              <div className="w-9 h-9 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">100% Privacy Protected</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">Your email and messages are stored securely and never shared.</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE FORM (7 Columns) */}
        <div className="lg:col-span-7">
          <div className="bg-neutral-900/80 border border-neutral-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
            {/* Top Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500" />

            {successMsg ? (
              <div className="py-8 text-center flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Message Sent!</h3>
                <p className="text-xs text-neutral-300 max-w-sm mb-6 leading-relaxed">{successMsg}</p>
                <button
                  type="button"
                  onClick={() => setSuccessMsg("")}
                  className="px-6 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">Send Us a Message</h3>
                  <p className="text-xs text-neutral-400">Fill out the details below and we will respond as soon as possible.</p>
                </div>

                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Category Selection Pills */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300">Topic Category</label>
                  <div className="flex flex-wrap gap-1.5">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          category === cat.id
                            ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                            : "bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name & Email Fields Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-300">Your Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-300">Your Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Message Field */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-300">Message Details</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your inquiry, bug report, or feature suggestion in detail..."
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-extrabold text-sm shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
