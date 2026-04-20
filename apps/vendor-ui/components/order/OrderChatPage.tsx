"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Phone, Send, Loader2 } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Skeleton } from "@repo/ui/components/skeleton";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import {
  fetchChatMessages,
  sendChatMessage,
  subscribeToOrderChat,
  unsubscribeFromOrderChat,
  type ChatMessage,
} from "@/actions/chat";

interface OrderChatPageProps {
  orderId: string;
}

export default function OrderChatPage({ orderId }: OrderChatPageProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();

    // Subscribe to real-time updates
    const handleNewMessage = (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    };

    subscribeToOrderChat(orderId, handleNewMessage);

    return () => {
      unsubscribeFromOrderChat(orderId);
    };
  }, [orderId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadMessages = async () => {
    setLoading(true);
    try {
      const chatData = await fetchChatMessages(orderId);
      setMessages(chatData.messages);
      setError(null);
    } catch (err) {
      setError("Failed to load chat messages");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      const message = await sendChatMessage(orderId, newMessage.trim());
      setMessages((prev) => [...prev, message]);
      setNewMessage("");
    } catch (err) {
      // Show error toast in production
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading && messages.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="p-4 border-b">
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-16 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadMessages} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* HEADER */}
      <div className="p-4 flex items-center gap-3 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-gray-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <div className="flex-1">
          <p className="font-semibold text-gray-900">Order #{orderId}</p>
          <p className="text-green-700 text-sm">Chat</p>
        </div>

        <Button variant="ghost" size="icon">
          <Phone className="text-green-700 w-5 h-5" />
        </Button>
      </div>

      {/* CHAT MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id}>
              {/* Sender Name */}
              {msg.sender !== "vendor" && (
                <div className="flex items-center gap-2 mb-1">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {msg.senderName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm text-gray-700 font-semibold">
                    {msg.senderName}
                  </p>
                </div>
              )}

              {/* Chat Bubble */}
              <div
                className={`max-w-[80%] p-3 rounded-xl text-sm ${
                  msg.sender === "vendor"
                    ? "bg-green-600 text-white ml-auto"
                    : "bg-green-100 text-gray-900"
                }`}
              >
                {msg.text}
              </div>

              {/* Timestamp */}
              <p
                className={`text-xs text-gray-500 mt-1 ${
                  msg.sender === "vendor" ? "text-right" : ""
                }`}
              >
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* MESSAGE INPUT */}
      <div className="p-4 border-t bg-white">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-green-50 border-green-200 focus:border-green-500"
            disabled={sending}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending}
            className="bg-green-600 hover:bg-green-700"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
