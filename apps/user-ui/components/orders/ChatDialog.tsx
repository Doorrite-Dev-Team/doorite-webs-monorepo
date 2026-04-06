"use client";

import { useState, useEffect, useRef } from "react";
import { useAtomValue } from "jotai";
import { Send, X } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { socketAtom } from "@/store/socketAtom";
import { api } from "@/actions/api";
import { cn } from "@repo/ui/lib/utils";

interface ChatMessage {
  id: string;
  content: string;
  senderType: "customer" | "rider" | "vendor";
  senderId: string;
  createdAt: string;
}

interface ChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  riderName?: string;
  riderImage?: string;
}

export function ChatDialog({
  open,
  onOpenChange,
  orderId,
  riderName = "Rider",
  riderImage,
}: ChatDialogProps) {
  const socket = useAtomValue(socketAtom);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !orderId) return;

    const loadMessages = async () => {
      setIsLoading(true);
      const msgs = await api.fetchChatMessages(orderId);
      setMessages(msgs);
      setIsLoading(false);
    };

    loadMessages();
  }, [open, orderId]);

  useEffect(() => {
    if (!socket || !open || !orderId) return;

    socket.emit("join_order", orderId);

    const handleNewMessage = (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.emit("leave_order", orderId);
      socket.off("new_message", handleNewMessage);
    };
  }, [socket, open, orderId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !socket) return;

    setIsSending(true);
    socket.emit("send_message", { orderId, content: newMessage.trim() });
    setNewMessage("");
    setIsSending(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const isOwnMessage = (msg: ChatMessage) => msg.senderType === "customer";

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative w-full sm:max-w-md sm:rounded-xl bg-white h-[80vh] sm:h-[600px] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={riderImage} />
              <AvatarFallback>
                {riderName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900">{riderName}</h3>
              <p className="text-xs text-green-600">Online</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-sm">
                No messages yet. Start the conversation!
              </p>
            </div>
          ) : (
            <div className="space-y-4" ref={scrollRef}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex",
                    isOwnMessage(msg) ? "justify-end" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[75%] rounded-2xl px-4 py-2",
                      isOwnMessage(msg)
                        ? "bg-primary text-white rounded-br-md"
                        : "bg-gray-100 text-gray-900 rounded-bl-md",
                    )}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p
                      className={cn(
                        "text-xs mt-1",
                        isOwnMessage(msg) ? "text-white/70" : "text-gray-500",
                      )}
                    >
                      {formatTime(msg.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={!newMessage.trim() || isSending}
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
