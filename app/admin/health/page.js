"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  RefreshCw,
  Clock,
  Server,
  Zap,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  LogOut,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export default function AdminHealthPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [healthData, setHealthData] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [gotoInput, setGotoInput] = useState("");

  useEffect(() => {
    checkAdminAuth();
  }, []);

  useEffect(() => {
    if (!autoRefresh || !admin) return;

    const interval = setInterval(() => {
      fetchHealthMetrics(true);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh, admin]);

  const checkAdminAuth = async () => {
    try {
      const res = await fetch("/api/admin/me");
      if (!res.ok) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      setAdmin(data.admin);
      fetchHealthMetrics();
    } catch (err) {
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchHealthMetrics = async (isBackground = false) => {
    if (!isBackground) setRefreshing(true);
    try {
      const res = await fetch("/api/admin/health");
      if (res.ok) {
        const data = await res.json();
        setHealthData(data);
      }
    } catch (err) {
      console.error("Failed to fetch health metrics:", err);
    } finally {
      if (!isBackground) setRefreshing(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mb-4" />
        <span className="text-sm font-mono tracking-wider text-slate-400">Loading System Health Metrics...</span>
      </div>
    );
  }

  const {
    status = "healthy",
    formattedUptime = "0s",
    rateQueue = { activeInLastMin: 0, maxLimit: 15, queuedCount: 0, isHighDemand: false },
    memory = { rssMb: 0, heapTotalMb: 0, heapUsedMb: 0 },
    recentMetrics = [],
  } = healthData || {};

  const maxHistoricalRequests = Math.max(
    ...recentMetrics.map((m) => m.requestCount || 0),
    rateQueue.maxLimit || 15
  );

  const totalWindowRequests = recentMetrics.reduce((acc, m) => acc + (m.requestCount || 0), 0);
  const peakWindowRequests = recentMetrics.length ? Math.max(...recentMetrics.map((m) => m.requestCount || 0)) : 0;
  const avgWindowRequests = recentMetrics.length ? (totalWindowRequests / recentMetrics.length).toFixed(1) : "0.0";

  const formatMinuteBucketLocal = (m) => {
    if (!m) return "N/A";
    let dateObj = m.createdAt ? new Date(m.createdAt) : null;
    if (!dateObj || isNaN(dateObj.getTime())) {
      if (m.minuteBucket) {
        const [datePart, timePart] = m.minuteBucket.split(" ");
        if (datePart && timePart) {
          dateObj = new Date(`${datePart}T${timePart}:00Z`);
        }
      }
    }
    if (!dateObj || isNaN(dateObj.getTime())) return m.minuteBucket || "N/A";

    return dateObj.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const reversedMetrics = [...recentMetrics].reverse();
  const totalPages = Math.ceil(reversedMetrics.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedMetrics = reversedMetrics.slice(startIndex, endIndex);

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
    <div className="space-y-6">
      {/* Header Bar Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-4 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-base md:text-lg text-white tracking-tight flex items-center gap-2">
              <span>System Health & Rate Monitoring</span>
              <span className="text-xs bg-cyan-950 border border-cyan-700/60 text-cyan-300 font-mono px-2.5 py-0.5 rounded-full">
                /health
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Live server uptime, memory consumption & per-minute request rate metrics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={() => fetchHealthMetrics()}
            disabled={refreshing}
            className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh Metrics"
          >
            <RefreshCw className={`w-4.5 h-4.5 ${refreshing ? "animate-spin text-cyan-400" : ""}`} />
          </button>

          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-2 rounded-2xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              autoRefresh
                ? "bg-cyan-950/80 border-cyan-600/80 text-cyan-300 shadow-sm"
                : "bg-slate-900 border-slate-800 text-slate-400"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${autoRefresh ? "bg-emerald-400 animate-pulse" : "bg-slate-600"}`} />
            <span>Auto-refresh (5s)</span>
          </button>
        </div>
      </div>

      {/* System Health Status Banner */}
      <div
        className={`p-5 rounded-3xl border backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xl ${
          status === "high_demand"
            ? "bg-amber-950/40 border-amber-500/50 text-amber-200"
            : "bg-emerald-950/40 border-emerald-500/50 text-emerald-200"
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
              status === "high_demand"
                ? "bg-amber-500/10 border-amber-500/40 text-amber-400"
                : "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
            }`}
          >
            {status === "high_demand" ? (
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            ) : (
              <CheckCircle2 className="w-6 h-6" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-wide text-white">
                {status === "high_demand"
                  ? "System High Traffic Active"
                  : "All Systems Operational"}
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                  status === "high_demand"
                    ? "bg-amber-900/80 border-amber-600 text-amber-300"
                    : "bg-emerald-900/80 border-emerald-600 text-emerald-300"
                }`}
              >
                {status === "high_demand" ? "High Traffic" : "Healthy"}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {status === "high_demand"
                ? "Requests in the last 60 seconds have reached or exceeded the 15 req/min threshold. Rate queuing is actively protecting AI operations."
                : "AI endpoints are running smoothly within rate capacity limits."}
            </p>
          </div>
        </div>
      </div>

      {/* 4 Metric Hero Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Requests Card */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Requests (Last 60s)
            </span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-white font-mono">
              {rateQueue.activeInLastMin}{" "}
              <span className="text-xs text-slate-500 font-normal">
                / {rateQueue.maxLimit} max
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Active sliding window count
            </p>
          </div>
        </div>

        {/* Queued Requests Card */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Queued Requests
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-amber-400 font-mono">
              {rateQueue.queuedCount}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Requests waiting in FIFO queue
            </p>
          </div>
        </div>

        {/* Server Uptime Card */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Server Uptime
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl font-extrabold text-emerald-300 font-mono">
              {formattedUptime}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Continuous process runtime
            </p>
          </div>
        </div>

        {/* Heap Memory Card */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Heap Memory
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl font-extrabold text-purple-300 font-mono">
              {memory.heapUsedMb} <span className="text-xs text-slate-400 font-normal">MB</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Total: {memory.heapTotalMb} MB (RSS: {memory.rssMb} MB)
            </p>
          </div>
        </div>
      </div>

      {/* Visual Bar Graph & Table for Recent Minutes */}
      <div className="bg-slate-900/90 backdrop-blur-2xl border border-slate-800/90 p-5 md:p-6 rounded-3xl shadow-2xl space-y-6">
        {/* Timeline Section Header & Stat Chips */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center font-bold shadow-lg shadow-cyan-500/10">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base md:text-lg font-black text-white tracking-tight">
                  Request Volume Timeline
                </h2>
                <span className="text-[10px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-700/60 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  60m Sliding Window
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Real-time per-minute AI API request volume & rate limit queuing metrics
              </p>
            </div>
          </div>

          {/* Quick Stat Summary Chips */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs self-stretch lg:self-auto">
            <div className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center gap-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Peak:</span>
              <span className="text-cyan-300 font-bold">{peakWindowRequests} <span className="text-[10px] font-normal text-slate-500">req/min</span></span>
            </div>
            <div className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center gap-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Avg:</span>
              <span className="text-purple-300 font-bold">{avgWindowRequests} <span className="text-[10px] font-normal text-slate-500">req/min</span></span>
            </div>
            <div className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center gap-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Total Window:</span>
              <span className="text-emerald-300 font-bold">{totalWindowRequests} <span className="text-[10px] font-normal text-slate-500">reqs</span></span>
            </div>
          </div>
        </div>

        {recentMetrics.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-2xl bg-slate-950/40">
            No minute request metrics recorded yet. Metrics will populate automatically as users send messages!
          </div>
        ) : (
          <div className="space-y-6">
            {/* Datadog / Vercel Style Bar Visualizer Card */}
            <div className="bg-slate-950/90 border border-slate-800/90 rounded-2xl p-5 pt-8 space-y-3 shadow-2xl relative backdrop-blur-xl overflow-visible">
              {/* Background Reference Dotted Gridlines */}
              <div className="absolute inset-x-5 top-8 bottom-10 flex flex-col justify-between pointer-events-none z-0">
                <div className="border-b border-dashed border-slate-800/60 w-full flex items-center justify-between text-[9px] text-slate-600 font-mono">
                  <span>{maxHistoricalRequests} reqs</span>
                  <span>100% capacity</span>
                </div>
                <div className="border-b border-dashed border-slate-800/40 w-full flex items-center justify-between text-[9px] text-slate-700 font-mono">
                  <span>{Math.round(maxHistoricalRequests / 2)} reqs</span>
                  <span>50% capacity</span>
                </div>
                <div className="border-b border-slate-800/60 w-full flex items-center justify-between text-[9px] text-slate-700 font-mono">
                  <span>0 reqs</span>
                  <span>Baseline</span>
                </div>
              </div>

              {/* 60 Columns Container - Fits 100% Width without X-Axis Scroll */}
              <div className="w-full h-36 flex items-end gap-0.5 sm:gap-1 pt-6 pb-2 px-1 relative z-10 overflow-visible">
                {recentMetrics.map((m, idx) => {
                  const pct = Math.min(
                    100,
                    Math.round((m.requestCount / maxHistoricalRequests) * 100)
                  );
                  const isHigh = m.requestCount >= rateQueue.maxLimit || m.queuedCount > 0;
                  const hasRequests = m.requestCount > 0;

                  // Adjust tooltip alignment for first/last bars so tooltips don't clip horizontally
                  let tooltipPositionClass = "left-1/2 -translate-x-1/2";
                  if (idx < 5) tooltipPositionClass = "left-0";
                  if (idx > 54) tooltipPositionClass = "right-0";

                  return (
                    <div
                      key={m.id || m.minuteBucket}
                      className="flex-1 min-w-0 h-full flex flex-col justify-end items-center group relative cursor-pointer"
                    >
                      {/* Floating Glassmorphic Tooltip */}
                      <div className={`hidden group-hover:flex absolute bottom-full mb-2 ${tooltipPositionClass} flex-col items-center z-50 pointer-events-none whitespace-nowrap`}>
                        <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 text-white text-xs font-mono p-2.5 rounded-2xl shadow-2xl space-y-1">
                          <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{formatMinuteBucketLocal(m)}</span>
                          </div>
                          <div className="text-slate-300 text-[11px] flex items-center gap-3 pt-0.5 border-t border-slate-800 mt-1">
                            <span>Requests: <strong className="text-white">{m.requestCount}</strong></span>
                            <span>Queued: <strong className="text-amber-400">{m.queuedCount}</strong></span>
                          </div>
                        </div>
                        <div className="w-2.5 h-2.5 bg-slate-900 border-r border-b border-slate-700 rotate-45 -mt-1.5" />
                      </div>

                      {/* Bar Column Pill */}
                      <div
                        style={{ height: `${Math.max(10, pct)}%` }}
                        className={`w-full rounded-t-sm sm:rounded-t-md transition-all duration-200 ${
                          isHigh
                            ? "bg-gradient-to-t from-amber-600 via-amber-500 to-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.6)] group-hover:brightness-125"
                            : hasRequests
                            ? "bg-gradient-to-t from-cyan-600 via-cyan-400 to-sky-300 shadow-[0_0_6px_rgba(6,182,212,0.5)] group-hover:brightness-125"
                            : "bg-slate-800/70 border-t border-slate-700/50 group-hover:bg-cyan-500/50"
                        }`}
                      />
                    </div>
                  );
                })}
              </div>

              {/* X-Axis Timeline Time Markers */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] font-mono text-slate-400 tracking-wider">
                <span>-60 min ago</span>
                <span>-45 min</span>
                <span>-30 min</span>
                <span>-15 min</span>
                <span className="text-cyan-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  Live (Now)
                </span>
              </div>
            </div>

            {/* Detailed Data Table */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/90 text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4">Time Bucket (System Time)</th>
                      <th className="py-3.5 px-4">Requests Received</th>
                      <th className="py-3.5 px-4">Requests Queued</th>
                      <th className="py-3.5 px-4">Traffic State</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {paginatedMetrics.map((m) => {
                      const isHigh = m.requestCount >= rateQueue.maxLimit || m.queuedCount > 0;
                      return (
                        <tr key={m.id || m.minuteBucket} className="hover:bg-slate-900/50 transition-colors">
                          <td className="py-3 px-4 text-white font-bold flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-cyan-400/70 shrink-0" />
                            <span>{formatMinuteBucketLocal(m)}</span>
                          </td>

                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 font-bold">
                              <Zap className="w-3 h-3 text-cyan-400" />
                              {m.requestCount} reqs
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            {m.queuedCount > 0 ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-950/60 border border-amber-800/60 text-amber-300 font-bold">
                                {m.queuedCount} queued
                              </span>
                            ) : (
                              <span className="text-slate-500 font-normal">0</span>
                            )}
                          </td>

                          <td className="py-3 px-4">
                            {isHigh ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-600/80 text-amber-300 text-[10px] font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                High Demand
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-600/80 text-emerald-300 text-[10px] font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                Normal
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Professional Pagination Bar */}
              {reversedMetrics.length > 0 && (
                <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
                  {/* Range & Row Size */}
                  <div className="flex items-center gap-4 text-slate-400 font-mono">
                    <span>
                      Showing <strong className="text-white">{startIndex + 1}</strong> to{" "}
                      <strong className="text-white">{Math.min(endIndex, reversedMetrics.length)}</strong> of{" "}
                      <strong className="text-white">{reversedMetrics.length}</strong> minute buckets
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

                      {/* Page Numbers */}
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
          </div>
        )}
      </div>
    </div>
  );
}
