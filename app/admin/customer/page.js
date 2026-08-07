"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Zap,
  Edit,
  Trash2,
  Loader2,
  X,
  Check,
  ShieldCheck,
  Calendar,
  MessageSquare,
  Key,
  Globe,
  Award,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export default function AdminCustomerPage() {
  const [users, setUsers] = useState([]);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newLimitInput, setNewLimitInput] = useState("100");
  const [submittingUserLimit, setSubmittingUserLimit] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState(null);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [gotoInput, setGotoInput] = useState("");

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  const fetchAdminUsers = async (query = "") => {
    try {
      setLoadingUsers(true);
      const res = await fetch(`/api/admin/users?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setCurrentPage(1);
      }
    } catch (err) {
      console.error("Failed to load admin users", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAdminUsers(userSearchQuery);
  };

  const handleOpenEditUserModal = (u) => {
    setEditingUser(u);
    setNewLimitInput(String(u.dailyLimit || 100));
    setIsUserModalOpen(true);
  };

  const handleUpdateUserLimit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    setSubmittingUserLimit(true);

    try {
      const res = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dailyLimit: parseInt(newLimitInput, 10) }),
      });

      if (res.ok) {
        const data = await res.json();
        setUsers((prev) =>
          prev.map((u) =>
            u.id === editingUser.id ? { ...u, dailyLimit: data.user.dailyLimit } : u
          )
        );
        setIsUserModalOpen(false);
        setEditingUser(null);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update daily limit");
      }
    } catch (err) {
      alert("Error updating user daily limit");
    } finally {
      setSubmittingUserLimit(false);
    }
  };

  const handleDeleteUser = async (u) => {
    if (!u) return;
    if (
      !confirm(
        `Are you sure you want to PERMANENTLY delete customer "${u.name}" (${u.email || "N/A"})?\n\nThis action will permanently delete:\n• User account\n• ALL chat sessions\n• ALL messages & chat history\n• ALL personas & credit usage logs`
      )
    ) {
      return;
    }

    setDeletingUserId(u.id);
    try {
      const res = await fetch(`/api/admin/users/${u.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user.id !== u.id));
        if (editingUser?.id === u.id) {
          setIsUserModalOpen(false);
          setEditingUser(null);
        }
      } else {
        const err = await res.json();
        alert(err.error || "Failed to delete user");
      }
    } catch (err) {
      alert("Error deleting user");
    } finally {
      setDeletingUserId(null);
    }
  };

  // Pagination Computations
  const totalPages = Math.ceil(users.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = users.slice(startIndex, endIndex);

  const handleGotoSubmit = (e) => {
    e.preventDefault();
    const pageNum = parseInt(gotoInput, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      setGotoInput("");
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-black text-white tracking-tight">
              Customer Management (User Model)
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Route: /admin/customer • Managed via Prisma User Model & Daily Usage
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search user model by name or email..."
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-64 sm:w-72"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>

      {/* Summary Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Total Customers</span>
            <span className="text-2xl font-black text-white">{users.length}</span>
          </div>
          <Users className="w-6 h-6 text-cyan-400" />
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Total Chat Sessions</span>
            <span className="text-2xl font-black text-purple-400">
              {users.reduce((acc, u) => acc + (u.chatsCount || 0), 0)}
            </span>
          </div>
          <MessageSquare className="w-6 h-6 text-purple-400" />
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Active Limit Reached</span>
            <span className="text-2xl font-black text-rose-400">
              {users.filter((u) => (u.todayCount || 0) >= (u.dailyLimit || 100)).length}
            </span>
          </div>
          <Zap className="w-6 h-6 text-rose-400" />
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Total Credits Used Today</span>
            <span className="text-2xl font-black text-amber-400">
              {users.reduce((acc, u) => acc + (u.todayCount || 0), 0)}
            </span>
          </div>
          <Award className="w-6 h-6 text-amber-400" />
        </div>
      </div>

      {/* Users Table Card */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between">
        {loadingUsers ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
            <span className="text-xs font-mono text-slate-400">Loading User Model Customers...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-300">No Customers Found</p>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your search query</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-mono text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Customer Name & ID</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Auth Provider</th>
                  <th className="py-3.5 px-4">Chat Sessions</th>
                  <th className="py-3.5 px-4">Daily Credit Usage</th>
                  <th className="py-3.5 px-4">All-Time Usage</th>
                  <th className="py-3.5 px-4">Joined Date & Time</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {paginatedUsers.map((u) => {
                  const todayCount = u.todayCount || 0;
                  const dailyLimit = u.dailyLimit || 100;
                  const isLimitReached = todayCount >= dailyLimit;
                  const formattedDate = u.createdAt
                    ? new Date(u.createdAt).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      })
                    : "N/A";

                  return (
                    <tr key={u.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-white flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold flex items-center justify-center text-xs shrink-0">
                          {u.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <span className="block truncate max-w-[150px]">{u.name || "Anonymous User"}</span>
                          <span className="text-[10px] text-slate-500 font-mono block">ID: {u.id.substring(0, 10)}...</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300 font-mono">{u.email || "N/A"}</td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold border ${
                            u.authProvider === "google"
                              ? "bg-blue-950/80 border-blue-500/50 text-blue-300"
                              : "bg-slate-900 border-slate-800 text-slate-300"
                          }`}
                        >
                          {u.authProvider === "google" ? "Google SSO" : "Credentials"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-bold">
                          <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                          <span>{(u.chatsCount || 0).toLocaleString()} chats</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="font-mono font-bold text-white">
                            {todayCount} / {dailyLimit}
                          </span>
                          {isLimitReached && (
                            <span className="text-[9px] bg-red-950 border border-red-800 text-red-300 px-1.5 py-0.2 rounded font-bold">
                              MAX
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-300 font-semibold">
                        {(u.totalCount || 0).toLocaleString()} credits
                      </td>

                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                        {formattedDate}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/customer/${u.id}`}
                            className="px-3 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                            title="Inspect Realtime Chat Sessions & Live Monitor"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                            <span>View Chats</span>
                          </Link>
                          <button
                            onClick={() => handleOpenEditUserModal(u)}
                            className="px-3 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit Limit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u)}
                            disabled={deletingUserId === u.id}
                            className="p-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 hover:text-rose-100 transition-all cursor-pointer disabled:opacity-50"
                            title="Permanently Delete Customer & All Chat Sessions"
                          >
                            {deletingUserId === u.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Professional Pagination Controls Bar: <<  <  1  2  3  >  >>  & Goto Number */}
        {!loadingUsers && users.length > 0 && (
          <div className="p-4 bg-slate-900/80 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            {/* Range & Row Size */}
            <div className="flex items-center gap-4 text-slate-400 font-mono">
              <span>
                Showing <strong className="text-white">{startIndex + 1}</strong> to{" "}
                <strong className="text-white">{Math.min(endIndex, users.length)}</strong> of{" "}
                <strong className="text-white">{users.length}</strong> customers
              </span>

              <div className="flex items-center gap-1.5">
                <span>Per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-white font-bold font-mono focus:outline-none focus:border-cyan-500"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            {/* Navigation Controls & Goto Number */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Controls: <<  <  1 2 3  >  >> */}
              <div className="flex items-center gap-1">
                {/* << First Page */}
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  title="First Page (<<)"
                  className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>

                {/* < Previous Page */}
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  title="Previous Page (<)"
                  className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Number Buttons */}
                {getPageNumbers().map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => typeof p === "number" && setCurrentPage(p)}
                    disabled={p === "..."}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition-all ${
                      p === currentPage
                        ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                        : p === "..."
                        ? "bg-transparent text-slate-500 cursor-default"
                        : "bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 cursor-pointer"
                    }`}
                  >
                    {p}
                  </button>
                ))}

                {/* > Next Page */}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  title="Next Page (>)"
                  className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* >> Last Page */}
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  title="Last Page (>>)"
                  className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>

              {/* Goto Page Number */}
              <form onSubmit={handleGotoSubmit} className="flex items-center gap-1.5 pl-2 border-l border-slate-800">
                <span className="text-[11px] text-slate-400 font-mono">Goto page:</span>
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={gotoInput}
                  onChange={(e) => setGotoInput(e.target.value)}
                  placeholder="#"
                  className="w-12 px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono font-bold text-center focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-mono font-bold text-[11px] transition-all cursor-pointer"
                >
                  Go
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Edit User Credit Limit Modal */}
      {isUserModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Edit Customer Daily Limit</h3>
              </div>
              <button
                onClick={() => setIsUserModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateUserLimit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1 font-mono">CUSTOMER USER MODEL DETAILS</label>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1 text-xs text-slate-200">
                  <p><strong className="text-white">Name:</strong> {editingUser.name || "N/A"}</p>
                  <p><strong className="text-white">Email:</strong> {editingUser.email || "N/A"}</p>
                  <p><strong className="text-white">Auth Provider:</strong> {editingUser.authProvider}</p>
                  <p><strong className="text-white">Today Credits Used:</strong> {editingUser.todayCount || 0}</p>
                  <p>
                    <strong className="text-white">Joined Date & Time:</strong>{" "}
                    {editingUser.createdAt
                      ? new Date(editingUser.createdAt).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true,
                        })
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1 font-mono">DAILY CREDIT LIMIT (dailyLimit)</label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={newLimitInput}
                  onChange={(e) => setNewLimitInput(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-cyan-500"
                  required
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Updates the `dailyLimit` property in the Prisma `User` model. Default is 100.
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => handleDeleteUser(editingUser)}
                  disabled={deletingUserId === editingUser.id}
                  className="px-3 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {deletingUserId === editingUser.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  <span>Delete Customer & Chats</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsUserModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingUserLimit}
                    className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 disabled:opacity-50 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
                  >
                    {submittingUserLimit ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    <span>Save User Limit</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
