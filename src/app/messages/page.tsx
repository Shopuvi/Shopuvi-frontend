"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MessageCircle, Search, Store } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { MessageSkeleton } from "@/components/ui/Skeletons";
import EmptyState from "@/components/ui/EmptyState";
import { useAuth } from "@/context/AuthContext";
import { messageAPI } from "@/lib/api";
import { formatTime, formatDate } from "@/lib/utils";

export default function InboxPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.replace("/auth/login");
  }, [authLoading, isAuthenticated, router]);

  const loadInbox = useCallback(async () => {
    try {
      const res = await messageAPI.getInbox();
      setConversations(res.data);
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) loadInbox();
  }, [isAuthenticated, loadInbox]);

  const filtered = conversations.filter((conv) => {
    const name = user?.role === "VENDOR"
      ? conv.customer?.username
      : conv.vendor?.business?.business_name || conv.vendor?.username;
    return name?.toLowerCase().includes(search.toLowerCase());
  });

  const getConversationName = (conv: any) => {
    if (user?.role === "VENDOR") return conv.customer?.username;
    return conv.vendor?.business?.business_name || conv.vendor?.username;
  };

  const getConversationInitial = (conv: any) => {
    return getConversationName(conv)?.slice(0, 2).toUpperCase() || "?";
  };

  const getLastMessage = (conv: any) => {
    const msg = conv.messages?.[0];
    if (!msg) return "No messages yet";
    if (msg.type === "IMAGE") return "📷 Image";
    return msg.content;
  };

  const getMessageTime = (conv: any) => {
    const msg = conv.messages?.[0];
    if (!msg) return "";
    const date = new Date(msg.created_at);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    return isToday ? formatTime(msg.created_at) : formatDate(msg.created_at);
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-secondary)" }}>
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800"
            style={{ fontFamily: "var(--font-syne)" }}>
            Messages
          </h1>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 mb-4 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100 transition-all">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none text-gray-800 placeholder-gray-400"
          />
        </div>

        {/* Conversations list */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          {isLoading ? (
            [...Array(5)].map((_, i) => <MessageSkeleton key={i} />)
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={MessageCircle}
              title={search ? "No conversations found" : "No messages yet"}
              description={
                search
                  ? "Try a different search term."
                  : user?.role === "VENDOR"
                    ? "When customers message you, they'll appear here."
                    : "Browse products and message vendors to start a conversation."
              }
              action={
                user?.role === "CUSTOMER"
                  ? { label: "Browse Marketplace", href: "/" }
                  : undefined
              }
            />
          ) : (
            filtered.map((conv, i) => (
              <Link
                key={conv.id}
                href={`/messages/${conv.id}`}
                className="flex items-center gap-3 px-4 py-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">

                {/* Avatar */}
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                  style={{ background: "var(--brand)" }}>
                  {getConversationInitial(conv)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="font-semibold text-gray-800 text-sm truncate">
                      {getConversationName(conv)}
                    </p>
                    <span className="text-xs text-gray-400 shrink-0 ml-2">
                      {getMessageTime(conv)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">
                    {getLastMessage(conv)}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
