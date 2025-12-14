"use client";

import React, { useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { AnimatePresence, motion } from "framer-motion";
import {
  notificationStateAtom,
  unreadCountAtom,
  activeNotificationsAtom,
} from "@/store/notificationAtom";
import { useNotificationWebSocket } from "@/hooks/useNotificationWebSocket";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@repo/ui/components/sheet";
import { Bell, X, Check } from "lucide-react";
import { WithCount } from "./withBadge";
import type { Notification } from "@/types/notification";
import { toast } from "@repo/ui/components/sonner";

/**
 * NotificationPanel — Clean UI without connection status indicators
 *
 * WebSocket connection is managed automatically when the sheet is open.
 * No UI clutter about connection states - just works seamlessly.
 */
export default function NotificationPanel() {
  const [open, setOpen] = useState(false);

  // Atoms
  const setNotificationState = useSetAtom(notificationStateAtom);
  const unreadCount = useAtomValue(unreadCountAtom);
  const notifications = useAtomValue(activeNotificationsAtom);

  // WebSocket hook - only connects when sheet is open
  useNotificationWebSocket(open);

  // Mark single notification as read
  const markAsRead = (id: string) => {
    setNotificationState((prev) => {
      const updated = prev.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      );
      return {
        ...prev,
        notifications: updated,
        unreadCount: updated.filter((n) => !n.read).length,
      };
    });
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotificationState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
    toast.success("Marked all as read");
  };

  // Clear all notifications
  const clearAll = () => {
    setNotificationState((prev) => ({
      ...prev,
      notifications: [],
      unreadCount: 0,
    }));
    toast.success("Cleared all notifications");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          aria-label="Notifications"
          className="p-2 rounded-full hover:bg-primary/10 transition-colors"
        >
          <WithCount count={unreadCount} Icon={Bell} />
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full sm:w-96 z-[999] flex flex-col"
      >
        {/* Header */}
        <SheetHeader className="px-4 pt-4 pb-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <SheetTitle className="text-base font-semibold">
                  Notifications
                </SheetTitle>
                <SheetDescription className="text-sm text-muted-foreground mt-1">
                  Stay updated about orders, deliveries, and offers
                </SheetDescription>
              </div>
            </div>
            <button
              aria-label="Close notifications"
              onClick={() => setOpen(false)}
              className="p-1 rounded hover:bg-muted/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Action bar */}
          {notifications.length > 0 && (
            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="text-sm text-muted-foreground">
                {notifications.length} notification
                {notifications.length !== 1 ? "s" : ""}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={markAllAsRead}
                    className="h-8"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Mark all read
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={clearAll}
                  className="h-8"
                >
                  Clear all
                </Button>
              </div>
            </div>
          )}
        </SheetHeader>

        {/* Notification List */}
        <div className="flex-1 overflow-hidden px-4 pb-4">
          <ScrollArea className="h-full">
            <div className="space-y-3 py-2">
              <AnimatePresence initial={false}>
                {notifications.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="text-center py-16"
                  >
                    <div className="rounded-full bg-muted/50 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Bell className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-base font-medium text-foreground mb-1">
                      No notifications yet
                    </p>
                    <p className="text-sm text-muted-foreground">
                      We&apos;ll notify you about orders and offers
                    </p>
                  </motion.div>
                ) : (
                  notifications.map((n: Notification) => {
                    const isUnread = !n.read;
                    return (
                      <motion.div
                        key={n.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card
                          onClick={() => markAsRead(n.id)}
                          className={`cursor-pointer transition-all ${
                            isUnread
                              ? "bg-primary/5 border-primary/20 hover:bg-primary/10"
                              : "bg-background hover:bg-muted/50"
                          }`}
                          role="button"
                          aria-pressed={n.read}
                        >
                          <CardContent className="p-4 flex gap-3">
                            <div
                              className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg ${
                                isUnread ? "bg-primary/15" : "bg-muted"
                              }`}
                            >
                              <Bell
                                className={`w-5 h-5 ${
                                  isUnread
                                    ? "text-primary"
                                    : "text-muted-foreground"
                                }`}
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h4
                                  className={`font-semibold text-sm ${
                                    isUnread
                                      ? "text-foreground"
                                      : "text-foreground/80"
                                  }`}
                                >
                                  {n.title}
                                </h4>
                                {isUnread && (
                                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                                )}
                              </div>

                              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                {n.message}
                              </p>

                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs text-muted-foreground">
                                  {new Date(n.timestamp).toLocaleString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      hour: "numeric",
                                      minute: "2-digit",
                                    },
                                  )}
                                </span>

                                {n.metadata?.actionUrl && (
                                  <a
                                    href={n.metadata.actionUrl}
                                    className="text-xs text-primary hover:underline font-medium"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    View details →
                                  </a>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
