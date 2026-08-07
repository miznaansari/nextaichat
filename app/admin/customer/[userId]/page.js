"use client";

import { useState, useEffect, useRef, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  Search,
  MessageSquare,
  Clock,
  Radio,
  RefreshCw,
  Zap,
  Layers,
  ChevronRight,
  Pause,
  Play,
  Loader2,
  ArrowDown,
} from "lucide-react";
import OptimizedAvatar from "@/components/landing/OptimizedAvatar";

export default function AdminCustomerDetailPage({ params }) {
  const resolvedParams = use(params);
  const userId = resolvedParams.userId;

  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [sessionSearchQuery, setSessionSearchQuery] = useState("");

  // Active Selected Session State
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [activeSessionData, setActiveSessionData] = useState(null);
  const [loadingChat, setLoadingChat] = useState(false);

  // Real-Time Polling States
  const [isPollingActive, setIsPollingActive] = useState(true);
  const [lastPolledAt, setLastPolledAt] = useState(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Smart User Scroll Tracking (Prevents background polling from pulling user down when reading history)
  const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const prevMessageCountRef = useRef(0);
  const prevSessionIdRef = useRef(null);

  // 1. Fetch User Info and Sessions List
  useEffect(() => {
    if (!userId) return;
    fetchUserDetail();
  }, [userId]);

  const fetchUserDetail = async () => {
    try {
      setLoadingUser(true);
      const res = await fetch(`/api/admin/users/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        const userChats = data.user?.chats || [];
        setSessions(userChats);
        if (userChats.length > 0 && !selectedSessionId) {
          setSelectedSessionId(userChats[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to load user detail:", err);
    } finally {
      setLoadingUser(false);
    }
  };

  // 2. Fetch Selected Chat Session Messages
  const fetchChatMessages = async (chatId, showLoading = false) => {
    if (!chatId || !userId) return;
    if (showLoading) setLoadingChat(true);
    setIsRefreshing(true);

    try {
      const res = await fetch(`/api/admin/users/${userId}/chats/${chatId}`);
      if (res.ok) {
        const data = await res.json();
        setActiveSessionData(data.chatSession);
        setLastPolledAt(new Date());

        if (data.chatSession?.messages) {
          const msgCount = data.chatSession.messages.length;
          setSessions((prev) =>
            prev.map((s) => (s.id === chatId ? { ...s, _count: { messages: msgCount } } : s))
          );
        }
      }
    } catch (err) {
      console.error("Error fetching chat messages:", err);
    } finally {
      setLoadingChat(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (selectedSessionId) {
      fetchChatMessages(selectedSessionId, true);
    }
  }, [selectedSessionId]);

  // 3. Real-Time Polling Engine (Every 2.5 seconds)
  useEffect(() => {
    if (!isPollingActive || !selectedSessionId) return;

    const interval = setInterval(() => {
      fetchChatMessages(selectedSessionId, false);
    }, 2500);

    return () => clearInterval(interval);
  }, [isPollingActive, selectedSessionId]);

  // Handle scroll events in chat messages container to detect user scroll intent
  const handleMessagesScroll = () => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    // User is considered scrolled up if distance to bottom is > 80px
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 80;
    setIsUserScrolledUp(!isNearBottom);
  };

  // Smart Auto-Scroll: Only scroll down if switching sessions OR user is at bottom when new messages arrive
  useEffect(() => {
    if (!activeSessionData?.messages) return;

    const currentCount = activeSessionData.messages.length;
    const isNewSession = prevSessionIdRef.current !== selectedSessionId;
    const hasNewMessages = currentCount > prevMessageCountRef.current;

    if (isNewSession) {
      setIsUserScrolledUp(false);
      messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
    } else if (!isUserScrolledUp && (hasNewMessages || autoScroll)) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    prevMessageCountRef.current = currentCount;
    prevSessionIdRef.current = selectedSessionId;
  }, [activeSessionData?.messages, selectedSessionId, isUserScrolledUp, autoScroll]);

  // Filtered session list by search query
  const filteredSessions = sessions.filter((s) => {
    const q = sessionSearchQuery.toLowerCase().trim();
    if (!q) return true;
    const titleMatch = s.title?.toLowerCase().includes(q);
    const charName = s.discoverCharacter?.name?.toLowerCase() || "";
    return titleMatch || charName.includes(q);
  });

  const totalUserMessages = sessions.reduce((acc, s) => acc + (s._count?.messages || 0), 0);

  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full overflow-hidden bg-[#030712] text-neutral-100 p-3 sm:p-4 flex flex-col font-sans">
      
      {/* 1. Top Compact Header Bar */}
      <div className="shrink-0 mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-purple-500/20 pb-2.5">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/customer"
            className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-purple-500/40 text-purple-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Customers</span>
          </Link>
          <div className="h-4 w-px bg-neutral-800" />
          <h1 className="text-base sm:text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            <span>Live Chat Monitor</span>
          </h1>
        </div>

        {/* Real-time Polling Status Pill */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPollingActive((prev) => !prev)}
            className={`px-3 py-1 rounded-xl text-[11px] font-mono font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
              isPollingActive
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white"
            }`}
          >
            {isPollingActive ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>POLLING ON (2.5s)</span>
                <Pause className="w-3 h-3 ml-0.5" />
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-neutral-500" />
                <span>PAUSED</span>
                <Play className="w-3 h-3 ml-0.5" />
              </>
            )}
          </button>

          <button
            onClick={() => fetchChatMessages(selectedSessionId, false)}
            className="p-1.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-purple-500/40 text-purple-300 hover:text-white transition-all cursor-pointer"
            title="Refresh Messages Now"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-purple-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* 2. Compact User Banner */}
      {loadingUser ? (
        <div className="shrink-0 mb-3 p-3 rounded-xl bg-neutral-900/60 border border-purple-500/15 flex items-center justify-center gap-2 text-xs text-neutral-300">
          <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
          <span>Loading Customer Profile...</span>
        </div>
      ) : user ? (
        <div className="shrink-0 mb-3 p-3.5 rounded-xl bg-gradient-to-r from-purple-950/40 via-neutral-950 to-indigo-950/40 border border-purple-500/30 backdrop-blur-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-center text-xs">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 font-bold text-sm uppercase shrink-0">
                {user.name ? user.name[0] : "U"}
              </div>
              <div className="overflow-hidden">
                <h2 className="font-bold text-white tracking-tight truncate flex items-center gap-1.5">
                  <span>{user.name}</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase bg-purple-500/20 border border-purple-500/40 text-purple-300">
                    {user.authProvider || "credentials"}
                  </span>
                </h2>
                <p className="text-[10px] text-neutral-300 font-mono truncate">{user.email || "No Email"}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-lg bg-neutral-900/80 border border-neutral-800">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <p className="text-[10px] text-neutral-400 font-mono font-semibold">Daily Limit</p>
                <p className="text-xs font-bold text-white">{user.dailyLimit || 100} credits</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-lg bg-neutral-900/80 border border-neutral-800">
              <Layers className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <p className="text-[10px] text-neutral-400 font-mono font-semibold">Chat Sessions</p>
                <p className="text-xs font-bold text-white">{sessions.length} chats</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-lg bg-neutral-900/80 border border-neutral-800">
              <MessageSquare className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <p className="text-[10px] text-neutral-400 font-mono font-semibold">Total Messages</p>
                <p className="text-xs font-bold text-white">{totalUserMessages} msgs</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* 3. 100dvh Main Flex Container */}
      <div className="flex-1 min-h-0 grid grid-cols-12 gap-3.5 overflow-hidden">
        
        {/* LEFT PANEL: Independently Scrollable Chat Sessions List */}
        <div className="col-span-12 lg:col-span-4 h-full max-h-full overflow-hidden flex flex-col rounded-xl bg-neutral-950/80 border border-purple-500/20 p-3 backdrop-blur-xl">
          {/* Search Header */}
          <div className="shrink-0 space-y-2 mb-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Sessions ({filteredSessions.length})</span>
              </h3>
              <span className="text-[9px] font-mono text-neutral-400">Click to load</span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter sessions..."
                value={sessionSearchQuery}
                onChange={(e) => setSessionSearchQuery(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-8 pr-3 py-1.5 text-[11px] text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500/60"
              />
            </div>
          </div>

          {/* Scrollable Sessions List */}
          <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-2 [scrollbar-width:thin]">
            {filteredSessions.length === 0 ? (
              <div className="p-6 text-center text-[11px] text-neutral-400 bg-neutral-900/40 rounded-lg border border-neutral-800">
                No chat sessions found.
              </div>
            ) : (
              filteredSessions.map((s) => {
                const isSelected = s.id === selectedSessionId;
                const charName = s.discoverCharacter?.name || "AI Character";
                const avatar = s.discoverCharacter?.avatar || "/avatars/kota_verma_teacher.png";
                const msgCount = s._count?.messages || 0;

                return (
                  <div
                    key={s.id}
                    onClick={() => setSelectedSessionId(s.id)}
                    className={`p-2.5 rounded-lg transition-all duration-200 cursor-pointer border flex items-center justify-between gap-2.5 ${
                      isSelected
                        ? "bg-purple-950/80 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.25)]"
                        : "bg-neutral-900/60 border-neutral-800/80 hover:border-purple-500/40 hover:bg-neutral-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-purple-500/30">
                        <OptimizedAvatar src={avatar} alt={charName} className="w-full h-full object-cover" />
                      </div>

                      <div className="overflow-hidden">
                        <h4 className="text-xs font-bold text-white line-clamp-1">
                          {s.title || charName}
                        </h4>
                        <p className="text-[10px] text-purple-300 font-semibold line-clamp-1">{charName}</p>
                        <p className="text-[9px] text-neutral-400 font-mono flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5 text-neutral-500" />
                          <span>{new Date(s.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-0.5 shrink-0">
                      <span className="px-1.5 py-0.2 rounded bg-neutral-900 border border-purple-500/30 text-purple-300 text-[9px] font-mono font-bold">
                        {msgCount}
                      </span>
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? "text-purple-400 translate-x-0.5" : "text-neutral-600"}`} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT PANEL: Independently Scrollable Real-Time Chat Feed */}
        <div className="col-span-12 lg:col-span-8 h-full max-h-full overflow-hidden flex flex-col rounded-xl bg-neutral-950/90 border border-purple-500/20 backdrop-blur-xl shadow-2xl relative">
          {/* Active Session Header */}
          <div className="shrink-0 px-4 py-3 border-b border-neutral-800 bg-neutral-900/70 flex flex-wrap items-center justify-between gap-3">
            {activeSessionData ? (
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-purple-500/40">
                  <OptimizedAvatar
                    src={activeSessionData.discoverCharacter?.avatar || "/avatars/kota_verma_teacher.png"}
                    alt={activeSessionData.discoverCharacter?.name || "AI Character"}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <h3 className="text-xs sm:text-sm font-black text-white flex items-center gap-2">
                    <span className="line-clamp-1">{activeSessionData.title}</span>
                    <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[9px] font-mono border border-purple-500/30 shrink-0">
                      {activeSessionData.selectedModel || "gemini-3.5-flash-lite"}
                    </span>
                  </h3>
                  <p className="text-[10px] text-purple-300 font-semibold">
                    Character: {activeSessionData.discoverCharacter?.name || "AI Persona"}
                  </p>
                </div>
              </div>
            ) : (
              <span className="text-xs text-neutral-400 font-mono">Select a session from left list</span>
            )}

            <div className="flex items-center gap-2 text-xs">
              {lastPolledAt && (
                <span className="text-[9px] font-mono text-neutral-400 hidden sm:inline">
                  Sync: {lastPolledAt.toLocaleTimeString()}
                </span>
              )}

              <button
                onClick={() => setAutoScroll((prev) => !prev)}
                className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border transition-all ${
                  autoScroll
                    ? "bg-purple-500/20 border-purple-500/40 text-purple-300"
                    : "bg-neutral-900 border-neutral-800 text-neutral-400"
                }`}
              >
                Auto-Scroll: {autoScroll ? "ON" : "OFF"}
              </button>
            </div>
          </div>

          {/* Scrollable Live Messages Body Stream with User Scroll Detection */}
          <div
            ref={messagesContainerRef}
            onScroll={handleMessagesScroll}
            className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 font-sans bg-[#030712]/60 [scrollbar-width:thin] relative"
          >
            {loadingChat ? (
              <div className="h-full flex items-center justify-center gap-2 text-neutral-400 text-xs">
                <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                <span>Loading Live Messages...</span>
              </div>
            ) : !activeSessionData ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-2 text-neutral-400 p-6">
                <Radio className="w-8 h-8 text-purple-500/40 animate-pulse" />
                <p className="text-xs font-bold text-white">No Chat Session Selected</p>
                <p className="text-[11px] max-w-xs text-neutral-400">
                  Select a session from the left list to monitor live user roleplay chats.
                </p>
              </div>
            ) : !activeSessionData.messages || activeSessionData.messages.length === 0 ? (
              <div className="p-6 text-center text-xs text-neutral-400 bg-neutral-900/40 rounded-xl border border-neutral-800">
                This chat session has no messages.
              </div>
            ) : (
              activeSessionData.messages.map((msg, index) => {
                const isUser = msg.role === "user";
                const charAvatar = activeSessionData.discoverCharacter?.avatar || "/avatars/kota_verma_teacher.png";
                const charName = activeSessionData.discoverCharacter?.name || "AI Character";

                return (
                  <div
                    key={msg.id || index}
                    className={`flex items-start gap-2.5 transition-all duration-300 ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isUser && (
                      <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 border border-purple-500/40 shadow-sm mt-0.5">
                        <OptimizedAvatar src={charAvatar} alt={charName} className="w-full h-full object-cover" />
                      </div>
                    )}

                    <div
                      className={`max-w-[82%] p-3 rounded-xl text-xs sm:text-xs leading-relaxed ${
                        isUser
                          ? "bg-purple-600/90 text-white rounded-tr-none shadow-md border border-purple-400/30"
                          : "bg-neutral-900 border border-purple-500/20 text-neutral-100 rounded-tl-none shadow-sm"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 mb-1 border-b border-white/10 pb-0.5 text-[9px] font-mono">
                        <span className={`font-bold uppercase ${isUser ? "text-purple-200" : "text-purple-400"}`}>
                          {isUser ? user?.name || "Customer User" : charName}
                        </span>
                        <span className="text-neutral-400">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                        </span>
                      </div>

                      <div className="whitespace-pre-wrap font-sans text-xs">{msg.content}</div>

                      <div className="pt-1.5 mt-1.5 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-neutral-400">
                        <span>Tokens: {msg.tokenEstimate || Math.ceil((msg.content?.length || 0) / 4)}</span>
                        <span className={msg.includeInContext ? "text-emerald-400" : "text-rose-400"}>
                          {msg.includeInContext ? "✓ In Context" : "✗ Excluded"}
                        </span>
                      </div>
                    </div>

                    {isUser && (
                      <div className="w-7 h-7 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold flex items-center justify-center text-[10px] uppercase shrink-0 mt-0.5">
                        {user?.name ? user.name[0] : "U"}
                      </div>
                    )}
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Floating "Jump to Latest Messages" button when user scrolls up */}
          {isUserScrolledUp && activeSessionData?.messages?.length > 0 && (
            <button
              onClick={() => {
                setIsUserScrolledUp(false);
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
              className="absolute bottom-12 right-6 px-3.5 py-1.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-[0_0_20px_rgba(168,85,247,0.5)] flex items-center gap-1.5 transition-all z-20 cursor-pointer border border-purple-400/40"
            >
              <ArrowDown className="w-3.5 h-3.5 animate-bounce text-white" />
              <span>Jump to latest messages</span>
            </button>
          )}

          {/* Bottom Toolbar Footer */}
          <div className="shrink-0 px-4 py-2 border-t border-neutral-800 bg-neutral-900/70 flex items-center justify-between text-[10px] text-neutral-400 font-mono">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isPollingActive ? "bg-emerald-400 animate-pulse" : "bg-neutral-600"}`} />
              <span>{isPollingActive ? "Realtime Live Monitor Active (2.5s)" : "Polling Paused"}</span>
            </div>

            <span>Total Messages: {activeSessionData?.messages?.length || 0}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
