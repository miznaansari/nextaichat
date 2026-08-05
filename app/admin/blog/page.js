"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  BookOpen,
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  ExternalLink,
  Eye,
  CheckCircle2,
  Clock,
  X,
  Check,
  FolderPlus,
} from "lucide-react";

export default function AdminBlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [blogSearchQuery, setBlogSearchQuery] = useState("");
  const [selectedBlogCategory, setSelectedBlogCategory] = useState("All");
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [submittingBlog, setSubmittingBlog] = useState(false);

  // Custom Category State
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState("");

  const [blogFormData, setBlogFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
    category: "Study & Education",
    author: "NextAiChat Team",
    published: true,
  });

  useEffect(() => {
    fetchAdminBlogs();
  }, []);

  const fetchAdminBlogs = async () => {
    try {
      setLoadingBlogs(true);
      const res = await fetch("/api/admin/blog");
      if (res.ok) {
        const data = await res.json();
        setBlogs(data.blogs || []);
      }
    } catch (err) {
      console.error("Failed to load admin blog posts", err);
    } finally {
      setLoadingBlogs(false);
    }
  };

  const defaultCategories = ["Study & Education", "AI Tech", "Tutorials", "Guides"];

  const availableCategories = Array.from(
    new Set([
      ...defaultCategories,
      ...blogs.map((b) => b.category).filter(Boolean),
      ...(customCategoryInput ? [customCategoryInput] : []),
    ])
  );

  const filterTabs = ["All", ...availableCategories];

  const handleOpenCreateBlogModal = () => {
    setEditingBlog(null);
    setIsCustomCategory(false);
    setCustomCategoryInput("");
    setBlogFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImage:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
      category: "Study & Education",
      author: "NextAiChat Team",
      published: true,
    });
    setIsBlogModalOpen(true);
  };

  const handleOpenEditBlogModal = (blog) => {
    setEditingBlog(blog);
    setIsCustomCategory(false);
    setCustomCategoryInput("");

    setBlogFormData({
      title: blog.title || "",
      slug: blog.slug || "",
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      coverImage: blog.coverImage || "",
      category: blog.category || "Study & Education",
      author: blog.author || "NextAiChat Team",
      published: blog.published !== undefined ? blog.published : true,
    });
    setIsBlogModalOpen(true);
  };

  const handleDeleteBlog = async (blogId) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    try {
      const res = await fetch(`/api/admin/blog/${blogId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setBlogs((prev) => prev.filter((b) => b.id !== blogId));
      } else {
        alert("Failed to delete blog post");
      }
    } catch (err) {
      alert("Error deleting blog post");
    }
  };

  const handleSubmitBlog = async (e) => {
    e.preventDefault();
    setSubmittingBlog(true);

    const finalCategory = isCustomCategory
      ? customCategoryInput.trim() || blogFormData.category
      : blogFormData.category;

    const payload = {
      title: blogFormData.title.trim(),
      slug: blogFormData.slug.trim() || blogFormData.title.toLowerCase().replace(/\s+/g, "-"),
      excerpt: blogFormData.excerpt.trim(),
      content: blogFormData.content.trim(),
      coverImage: blogFormData.coverImage.trim(),
      category: finalCategory,
      author: blogFormData.author.trim(),
      published: blogFormData.published,
    };

    try {
      const url = editingBlog ? `/api/admin/blog/${editingBlog.id}` : "/api/admin/blog";
      const method = editingBlog ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        fetchAdminBlogs();
        setIsBlogModalOpen(false);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to save blog post");
      }
    } catch (err) {
      alert("Error saving blog post");
    } finally {
      setSubmittingBlog(false);
    }
  };

  const filteredBlogs = blogs.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(blogSearchQuery.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(blogSearchQuery.toLowerCase());
    const matchesCategory =
      selectedBlogCategory === "All" || b.category === selectedBlogCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-black text-white tracking-tight">Blog Articles Manager</h1>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Route: /admin/blog • Manage Articles & Custom Categories
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenCreateBlogModal}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Quick Add Post</span>
          </button>
          <Link
            href="/admin/blog/add"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Full Editor Page</span>
          </Link>
        </div>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {filterTabs.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedBlogCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedBlogCategory === cat
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search article by title..."
            value={blogSearchQuery}
            onChange={(e) => setBlogSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Blog Cards List */}
      {loadingBlogs ? (
        <div className="p-12 text-center flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mb-3" />
          <span className="text-xs font-mono text-slate-400">Loading Blog Articles...</span>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="p-12 text-center bg-slate-950 border border-slate-800 rounded-2xl">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-300">No Blog Posts Found</p>
          <p className="text-xs text-slate-500 mt-1">Write your first blog post using the button above</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between group hover:border-slate-700 transition-all"
            >
              <div>
                <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                  <img
                    src={blog.coverImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800"}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-800 text-[10px] font-mono text-emerald-400 uppercase font-bold">
                    {blog.category}
                  </div>
                  <div className="absolute top-3 right-3">
                    {blog.published ? (
                      <span className="bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Published
                      </span>
                    ) : (
                      <span className="bg-amber-950/80 border border-amber-500/60 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Draft
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-base text-white line-clamp-2 leading-snug">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-4 border-t border-slate-800/80 bg-slate-900/30 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono">By {blog.author}</span>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/blog/${blog.slug}`}
                    target="_blank"
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleOpenEditBlogModal(blog)}
                    className="p-1.5 text-slate-400 hover:text-cyan-400 rounded-lg hover:bg-slate-800 cursor-pointer"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteBlog(blog.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Blog Modal */}
      {isBlogModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">
                  {editingBlog ? "Edit Blog Article" : "Create New Blog Article"}
                </h3>
              </div>
              <button
                onClick={() => setIsBlogModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitBlog} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1 font-mono">ARTICLE TITLE</label>
                <input
                  type="text"
                  value={blogFormData.title}
                  onChange={(e) => setBlogFormData({ ...blogFormData, title: e.target.value })}
                  placeholder="e.g. Master AI Prompt Engineering in 2026"
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category Selection + Custom Category Option */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-slate-400 font-mono">CATEGORY</label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomCategory(!isCustomCategory);
                        if (!isCustomCategory) {
                          setCustomCategoryInput("");
                        }
                      }}
                      className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold underline cursor-pointer"
                    >
                      {isCustomCategory ? "Select Existing" : "+ Create New Category"}
                    </button>
                  </div>

                  {isCustomCategory ? (
                    <input
                      type="text"
                      placeholder="Type new category name..."
                      value={customCategoryInput}
                      onChange={(e) => {
                        setCustomCategoryInput(e.target.value);
                        setBlogFormData({ ...blogFormData, category: e.target.value });
                      }}
                      className="w-full p-2.5 bg-slate-900 border border-emerald-500/80 rounded-xl text-xs font-bold text-emerald-200 focus:outline-none shadow-sm"
                      required
                    />
                  ) : (
                    <select
                      value={blogFormData.category}
                      onChange={(e) => {
                        if (e.target.value === "__NEW__") {
                          setIsCustomCategory(true);
                          setCustomCategoryInput("");
                        } else {
                          setBlogFormData({ ...blogFormData, category: e.target.value });
                        }
                      }}
                      className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      {availableCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                      <option value="__NEW__" className="text-emerald-400 font-bold">
                        + Create New Category...
                      </option>
                    </select>
                  )}
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-mono">AUTHOR</label>
                  <input
                    type="text"
                    value={blogFormData.author}
                    onChange={(e) => setBlogFormData({ ...blogFormData, author: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1 font-mono">COVER IMAGE URL</label>
                <input
                  type="text"
                  value={blogFormData.coverImage}
                  onChange={(e) => setBlogFormData({ ...blogFormData, coverImage: e.target.value })}
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1 font-mono">EXCERPT (SHORT SUMMARY)</label>
                <textarea
                  rows={2}
                  value={blogFormData.excerpt}
                  onChange={(e) => setBlogFormData({ ...blogFormData, excerpt: e.target.value })}
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1 font-mono">CONTENT (MARKDOWN)</label>
                <textarea
                  rows={6}
                  value={blogFormData.content}
                  onChange={(e) => setBlogFormData({ ...blogFormData, content: e.target.value })}
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={blogFormData.published}
                  onChange={(e) => setBlogFormData({ ...blogFormData, published: e.target.checked })}
                  className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
                />
                <label htmlFor="published" className="text-xs text-slate-300 cursor-pointer">
                  Publish immediately (Visible on website)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsBlogModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingBlog}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 disabled:opacity-50 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  {submittingBlog ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Save Article</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
