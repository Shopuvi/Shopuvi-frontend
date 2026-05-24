"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send, Store, Image as ImageIcon, X } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { messageAPI } from "@/lib/api";
import { formatTime, formatDate } from "@/lib/utils";

interface Message {
  id: string;
  content?: string;
  image_url?: string;
  type: "TEXT" | "IMAGE";
  sender_id: string;
  created_at: string;
  sender: { username: string };
}

interface Conversation {
  id: string;
  vendor: {
    username: string;
    business?: { business_name: string; logo_url?: string };
  };
  customer: { username: string };
}

export default function ConversationPage() {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const conversationId = params?.id as string;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.replace("/auth/login");
  }, [authLoading, isAuthenticated, router]);

  const loadMessages = useCallback(async () => {
    try {
      const res = await messageAPI.getMessages(conversationId);
      setConversation(res.data.conversation);
      setMessages(res.data.messages);
    } catch {
      router.replace("/messages");
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, router]);

  useEffect(() => {
    if (isAuthenticated) loadMessages();
  }, [isAuthenticated, loadMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Poll for new messages every 10 seconds
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(loadMessages, 10000);
    return () => clearInterval(interval);
  }, [isAuthenticated, loadMessages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const hasContent = content.trim().length > 0;
    const hasImage = imageUrl.trim().length > 0;
    if (!hasContent && !hasImage) return;

    setIsSending(true);
    try {
      const payload: { content?: string; image_url?: string; type: "TEXT" | "IMAGE" } = {
        type: hasImage && !hasContent ? "IMAGE" : "TEXT",
      };
      if (hasContent) payload.content = content.trim();
      if (hasImage) payload.image_url = imageUrl.trim();

      const res = await messageAPI.sendMessage(conversationId, payload);
      setMessages((prev) => [...prev, res.data]);
      setContent("");
      setImageUrl("");
      setShowImageInput(false);
    } catch {
      toast("Failed to send message.", "error");
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  const getOtherParty = () => {
    if (!conversation || !user) return null;
    if (user.role === "VENDOR") return conversation.customer;
    return conversation.vendor;
  };

  const getOtherName = () => {
    const other = getOtherParty();
    if (!other) return "";
    if (user?.role === "CUSTOMER" && conversation?.vendor?.business) {
      return conversation.vendor.business.business_name;
    }
    return (other as any).username;
  };

  const getOtherUsername = () => {
    if (user?.role === "CUSTOMER") return conversation?.vendor?.username;
    return conversation?.customer?.username;
  };

  // Group messages by date
  const groupedMessages: { date: string; messages: Message[] }[] = [];
  messages.forEach((msg) => {
    const date = new Date(msg.created_at).toDateString();
    const last = groupedMessages[groupedMessages.length - 1];
    if (last && last.date === date) {
      last.messages.push(msg);
    } else {
      groupedMessages.push({ date, messages: [msg] });
    }
  });

  const isOwnMessage = (msg: Message) => msg.sender_id === user?.id;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-secondary)" }}>
      <Navbar />

      {/* Chat header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 sticky top-16 z-40">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={() => router.back()}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
            style={{ background: "var(--brand)" }}>
            {getOtherName()?.slice(0, 2).toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-800 text-sm truncate">{getOtherName()}</p>
            <p className="text-xs text-gray-400">@{getOtherUsername()}</p>
          </div>

          {user?.role === "CUSTOMER" && (
            <Link href={`/@${getOtherUsername()}`}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
              style={{ color: "var(--brand)", background: "var(--brand-light)" }}>
              <Store className="w-3.5 h-3.5" />
              View Store
            </Link>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="max-w-2xl mx-auto px-4 space-y-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <span className="spinner" style={{ width: 28, height: 28 }} />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                style={{ background: "var(--brand-light)" }}>
                <Send className="w-6 h-6" style={{ color: "var(--brand)" }} />
              </div>
              <p className="text-gray-400 text-sm">
                Start the conversation. Ask about availability, pricing, or anything.
              </p>
            </div>
          ) : (
            groupedMessages.map((group) => (
              <div key={group.date}>
                {/* Date divider */}
                <div className="flex items-center gap-3 py-4">
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-xs text-gray-300 font-medium">
                    {new Date(group.date).toDateString() === new Date().toDateString()
                      ? "Today"
                      : formatDate(group.messages[0].created_at)}
                  </span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>

                {/* Messages in group */}
                {group.messages.map((msg, i) => {
                  const own = isOwnMessage(msg);
                  const showSender = i === 0 || group.messages[i - 1].sender_id !== msg.sender_id;

                  return (
                    <div key={msg.id}
                      className={`flex ${own ? "justify-end" : "justify-start"} mb-1`}>
                      <div className={`max-w-[75%] ${own ? "items-end" : "items-start"} flex flex-col`}>

                        {/* Sender name */}
                        {showSender && !own && (
                          <span className="text-xs text-gray-400 mb-1 ml-1">
                            {msg.sender.username}
                          </span>
                        )}

                        {/* Message bubble */}
                        <div className={`rounded-2xl px-4 py-2.5 ${own
                          ? "rounded-br-sm text-white"
                          : "rounded-bl-sm bg-white border border-gray-100 text-gray-800"
                          }`}
                          style={own ? { background: "var(--brand)" } : {}}>

                          {msg.image_url && (
                            <a href={msg.image_url} target="_blank" rel="noopener noreferrer"
                              className="block mb-2">
                              <img src={msg.image_url} alt="Shared image"
                                className="rounded-xl max-w-full max-h-48 object-cover" />
                            </a>
                          )}

                          {msg.content && (
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                              {msg.content}
                            </p>
                          )}
                        </div>

                        {/* Time */}
                        <span className="text-xs text-gray-300 mt-0.5 mx-1">
                          {formatTime(msg.created_at)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message input */}
      <div className="bg-white border-t border-gray-100 px-4 py-3 sticky bottom-0">
        <div className="max-w-2xl mx-auto">

          {/* Image URL input */}
          {showImageInput && (
            <div className="flex items-center gap-2 mb-2 p-2 bg-gray-50 rounded-xl">
              <ImageIcon className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="url"
                placeholder="Paste image URL here..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
              />
              <button onClick={() => { setShowImageInput(false); setImageUrl(""); }}
                className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <form onSubmit={handleSend} className="flex items-end gap-2">
            {/* Image button */}
            <button
              type="button"
              onClick={() => setShowImageInput(!showImageInput)}
              className="p-2.5 rounded-xl border border-gray-200 text-gray-400 hover:text-green-600 hover:border-green-300 transition-all shrink-0">
              <ImageIcon className="w-5 h-5" />
            </button>

            {/* Text input */}
            <div className="flex-1 flex items-end bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100 transition-all">
              <textarea
                ref={inputRef as any}
                placeholder="Type a message..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e as any);
                  }
                }}
                rows={1}
                className="flex-1 bg-transparent text-sm outline-none text-gray-800 placeholder-gray-400 resize-none max-h-32"
                style={{ lineHeight: "1.5" }}
              />
            </div>

            {/* Send button */}
            <button
              type="submit"
              disabled={isSending || (!content.trim() && !imageUrl.trim())}
              className="p-2.5 rounded-xl text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 shrink-0"
              style={{ background: "var(--brand)" }}>
              {isSending
                ? <span className="spinner" style={{ borderColor: "#fff3", borderTopColor: "#fff", width: 18, height: 18 }} />
                : <Send className="w-5 h-5" />}
            </button>
          </form>

          <p className="text-xs text-gray-300 text-center mt-2">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
