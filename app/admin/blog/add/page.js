"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  BookOpen,
  ArrowLeft,
  Loader2,
  Check,
  Sparkles,
  Globe,
  ImageIcon,
  FileText,
  Send,
  Eye,
  Edit3,
  Calendar,
  User
} from "lucide-react";

export default function AddBlogArticlePage() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
    category: "Study & Education",
    author: "NextAiChat Team",
    published: true,
  });

  useEffect(() => {
    checkAdminAuth();
  }, []);

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

  const handleGenerateSlug = () => {
    if (!formData.title) return;
    const generated = formData.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    setFormData((prev) => ({ ...prev, slug: generated }));
  };

  const handleSubmitBlog = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const payload = {
      title: formData.title.trim(),
      slug: formData.slug.trim(),
      excerpt: formData.excerpt.trim() || formData.title.trim(),
      content: formData.content.trim(),
      coverImage: formData.coverImage.trim(),
      category: formData.category,
      author: formData.author.trim(),
      published: formData.published,
    };

    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create blog post");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const wordCount = formData.content.trim() ? formData.content.trim().split(/\s+/).length : 0;

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex flex-col items-center justify-center space-y-4 font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        <p className="text-sm font-mono text-neutral-400">Verifying Admin Permissions...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 md:pt-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-950/20 via-neutral-950 to-[#030712] text-white font-sans flex flex-col selection:bg-purple-500 selection:text-white">
      
      {/* FIXED HEADER WITH PREVIEW TOGGLE & PUBLISH ACTIONS */}
      <header className="fixed top-0 left-0 right-0 z-[100] w-full h-16 md:h-20 border-b border-purple-500/20 px-4 sm:px-8 lg:px-12 flex items-center justify-between bg-neutral-950/95 backdrop-blur-2xl shrink-0 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => router.push("/admin")}
            className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition-all cursor-pointer"
            title="Back to Admin Dashboard"
          >
            <ArrowLeft className="w-5 h-5 text-purple-400" />
          </button>

          <Image
            src="/logo-landspace.png"
            alt="NextAiChat Logo"
            width={240}
            height={70}
            priority
            className="h-9 sm:h-12 w-auto object-contain drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]"
          />

          <div className="border-l border-neutral-800/80 pl-3 hidden sm:block">
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-sm md:text-base text-white tracking-tight flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-400" />
                <span>Create Official Blog Article</span>
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-950 border border-purple-800 text-purple-300 text-[10px] font-mono font-bold">
                NEW ARTICLE
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-mono">
              Author: <span className="text-purple-300">{admin?.email}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Live Preview Toggle Button */}
          <button
            type="button"
            onClick={() => setIsPreviewMode((prev) => !prev)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer border ${
              isPreviewMode
                ? "bg-purple-600 border-purple-400 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                : "bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700"
            }`}
          >
            {isPreviewMode ? (
              <>
                <Edit3 className="w-4 h-4" />
                <span>Return to Editor</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 text-purple-400" />
                <span>👁 Live Layout Preview</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="hidden sm:block px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-semibold text-neutral-400 hover:text-white transition-all cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="create-blog-article-form"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-extrabold text-xs shadow-[0_0_25px_rgba(147,51,234,0.4)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>PUBLISH ARTICLE NOW</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Container: Editor OR Live Original Layout Preview */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-[1500px] mx-auto w-full">
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-950/80 border border-red-800 text-red-300 text-xs font-bold text-center">
            {error}
          </div>
        )}

        {/* MODE 1: LIVE ORIGINAL LAYOUT PREVIEW (EXACTLY MATCHES /blog/[slug]/page.js) */}
        {isPreviewMode ? (
          <div className="max-w-4xl mx-auto space-y-8 py-4 animate-fadeIn">
            
            {/* Admin Live Preview Banner Banner */}
            <div className="p-4 rounded-2xl bg-purple-950/90 border border-purple-500/50 text-purple-200 text-xs font-mono font-bold flex items-center justify-between shadow-[0_0_30px_rgba(168,85,247,0.2)]">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                <span>LIVE PREVIEW MODE — EXACT LAYOUT OF PUBLIC ARTICLE /blog/{formData.slug || "slug"}</span>
              </span>
              <button
                type="button"
                onClick={() => setIsPreviewMode(false)}
                className="px-3 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-sans font-semibold cursor-pointer border border-neutral-800"
              >
                ← Back to Editor
              </button>
            </div>

            {/* Article Header (Matches app/blog/[slug]/page.js) */}
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1 rounded-full bg-purple-950 border border-purple-700 text-purple-300 text-xs font-semibold">
                  {formData.category || "Study & Education"}
                </span>
                <span className="text-xs text-neutral-400 flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>1 view (Live Preview)</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                {formData.title || "Untitled Article Title"}
              </h1>

              <div className="flex items-center gap-4 text-xs text-neutral-400 pt-2 border-b border-neutral-800 pb-6">
                <div className="flex items-center gap-1.5 font-semibold text-neutral-200">
                  <User className="w-4 h-4 text-purple-400" />
                  <span>{formData.author || "NextAiChat Team"}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-neutral-400" />
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Cover Image Banner */}
            {formData.coverImage && (
              <div className="w-full h-72 sm:h-96 rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl relative">
                <img src={formData.coverImage} alt={formData.title} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Article Body Container */}
            <article className="relative z-10 p-6 sm:p-10 rounded-3xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-xl shadow-2xl space-y-6 text-neutral-200 text-sm leading-relaxed prose prose-invert max-w-none">
              {formData.excerpt && (
                <p className="text-base text-neutral-300 font-medium italic border-l-4 border-purple-500 pl-4 py-2 bg-purple-950/20 rounded-r-xl">
                  {formData.excerpt}
                </p>
              )}

              {formData.content ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {formData.content}
                </ReactMarkdown>
              ) : (
                <p className="text-neutral-500 italic">No article content written yet. Switch to Editor mode to write your post.</p>
              )}
            </article>

            {/* Live Public CTA Box Preview */}
            <div className="relative z-10 p-6 rounded-3xl bg-neutral-900/80 border border-purple-500/30 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white">
                  Experience NextAiChat AI Roleplays
                </h3>
                <p className="text-xs text-neutral-400">
                  Try dynamic multi-character roleplay for study or entertainment.
                </p>
              </div>
              <button
                type="button"
                className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-md shrink-0 cursor-not-allowed opacity-80"
              >
                Launch NextAiChat
              </button>
            </div>
          </div>
        ) : (
          /* MODE 2: EDITOR VIEW */
          <form id="create-blog-article-form" onSubmit={handleSubmitBlog} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Title, Slug, Excerpt, Main Content Editor */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Title & Slug Box */}
              <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-xl space-y-5 shadow-xl">
                
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-200 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-purple-400" />
                    <span>Article Title *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. How to Use AI Personas for Exam Prep & Interactive Study"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500 rounded-2xl px-4 py-3.5 text-base font-bold text-white placeholder-neutral-500 outline-none transition-colors shadow-inner"
                  />
                </div>

                {/* Slug */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-neutral-200 uppercase tracking-wider font-mono">
                      URL Slug Path *
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateSlug}
                      className="text-xs text-purple-400 hover:text-purple-300 font-mono font-bold flex items-center gap-1 cursor-pointer hover:underline"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      <span>Auto-Generate from Title</span>
                    </button>
                  </div>

                  <div className="flex items-center bg-neutral-950 border border-neutral-800 focus-within:border-purple-500 rounded-2xl px-4 py-2.5 text-xs text-neutral-400 font-mono shadow-inner">
                    <span className="text-neutral-500 select-none mr-1">/blog/</span>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="how-to-use-ai-personas-for-exam-prep"
                      className="w-full bg-transparent text-white outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Excerpt */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-200 uppercase tracking-wider">
                    Short Excerpt / Search Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Brief 1-2 sentence preview summary shown on blog cards and Google search previews..."
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500 rounded-2xl p-4 text-xs text-white placeholder-neutral-500 outline-none transition-colors leading-relaxed shadow-inner"
                  />
                </div>
              </div>

              {/* Main Content Editor */}
              <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-xl space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-neutral-200 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-purple-400" />
                    <span>Full Article Content (Markdown & HTML Supported) *</span>
                  </label>
                  <span className="text-xs font-mono text-purple-400 font-bold">
                    {wordCount} words
                  </span>
                </div>

                <textarea
                  required
                  rows={16}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your complete blog post article content here...

# Introduction
Start with a compelling opening line...

## Section 1: Key Study Benefits
Explain how students use AI roleplay..."
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500 rounded-2xl p-5 text-xs text-white placeholder-neutral-600 outline-none transition-colors font-mono leading-relaxed shadow-inner"
                />
              </div>
            </div>

            {/* Right Column: Publishing Sidebar */}
            <div className="space-y-6">
              
              {/* Live Layout Preview Button in Sidebar */}
              <div className="p-5 rounded-3xl bg-purple-950/40 border border-purple-500/30 text-center space-y-2">
                <p className="text-xs font-bold text-purple-300">Want to see how it looks?</p>
                <button
                  type="button"
                  onClick={() => setIsPreviewMode(true)}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>👁 Live Article Preview</span>
                </button>
              </div>

              {/* Publishing Status Card */}
              <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-xl space-y-4 shadow-xl">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span>Publishing Status</span>
                </h3>

                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-300">Visibility</span>
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${formData.published ? "bg-emerald-950 text-emerald-400 border border-emerald-500/40" : "bg-amber-950 text-amber-300 border border-amber-500/40"}`}>
                      {formData.published ? "PUBLISHED (LIVE)" : "DRAFT (HIDDEN)"}
                    </span>
                  </div>

                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    When enabled, this article will immediately be indexed and displayed on the public <strong className="text-purple-300">/blog</strong> page.
                  </p>

                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, published: !prev.published }))}
                    className={`w-full py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      formData.published
                        ? "bg-emerald-950 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-900"
                        : "bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white"
                    }`}
                  >
                    {formData.published ? <Check className="w-4 h-4 text-emerald-400" /> : null}
                    <span>{formData.published ? "Live on Website" : "Set as Draft"}</span>
                  </button>
                </div>
              </div>

              {/* Category & Author Settings */}
              <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-xl space-y-4 shadow-xl">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Article Metadata
                </h3>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-300">Category Section *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500 rounded-xl px-4 py-3 text-xs text-white outline-none transition-colors"
                    >
                      <option value="Study & Education">Study & Education</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Guides">Guides</option>
                      <option value="Platform Updates">Platform Updates</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-300">Author Name</label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      placeholder="NextAiChat Team"
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500 rounded-xl px-4 py-3 text-xs text-white outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Cover Image Box */}
              <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-xl space-y-4 shadow-xl">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-purple-400" />
                  <span>Cover Banner Image</span>
                </h3>

                <div className="space-y-3">
                  <input
                    type="text"
                    required
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500 rounded-xl px-4 py-3 text-xs text-white outline-none transition-colors"
                  />

                  {/* Live Image Preview */}
                  <div className="h-40 rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950 relative">
                    {formData.coverImage ? (
                      <img src={formData.coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-600 text-xs">No Cover Image</div>
                    )}
                    <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-black/80 text-[10px] font-mono text-purple-300 border border-neutral-800">
                      Live Preview
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </form>
        )}
      </main>
    </div>
  );
}
