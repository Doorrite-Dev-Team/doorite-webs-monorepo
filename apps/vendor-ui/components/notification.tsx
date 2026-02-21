"use client";

import { useState } from "react";
import { useAtom } from "jotai";
import { Bell, Check } from "lucide-react";
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
import { toast } from "@repo/ui/components/sonner";
import { notificationStateAtom } from "@/store/notificationAtom";
import type { Notification } from "@/types/notification";

export default function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const [notificationState, setNotificationState] = useAtom(
    notificationStateAtom,
  );

  const { notifications, unreadCount } = notificationState;

  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n,
    );

    setNotificationState({
      notifications: updatedNotifications,
      unreadCount: updatedNotifications.filter((n) => !n.read).length,
      lastSync: new Date().toISOString(),
    });
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((n) => ({
      ...n,
      read: true,
    }));

    setNotificationState({
      notifications: updatedNotifications,
      unreadCount: 0,
      lastSync: new Date().toISOString(),
    });

    toast.success("All notifications marked as read");
  };

  const clearAll = () => {
    setNotificationState({
      notifications: [],
      unreadCount: 0,
      lastSync: new Date().toISOString(),
    });

    toast.success("All notifications cleared");
  };

  const getNotificationIcon = (priority?: string) => {
    switch (priority) {
      case "urgent":
        return "🚨";
      case "high":
        return "⚡";
      default:
        return "🔔";
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 border-red-200 hover:bg-red-50";
      case "high":
        return "bg-orange-100 border-orange-200 hover:bg-orange-50";
      default:
        return "bg-green-50 border-green-200 hover:bg-green-100";
    }
  };

  const getPriorityIconBg = (priority?: string, isUnread?: boolean) => {
    if (!isUnread) return "bg-gray-100";

    switch (priority) {
      case "urgent":
        return "bg-red-200";
      case "high":
        return "bg-orange-200";
      default:
        return "bg-green-200";
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-6 h-6 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:w-96 flex flex-col">
        {/* Header */}
        <SheetHeader className="px-4 pt-4 pb-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-green-100 p-2">
                <Bell className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <SheetTitle className="text-base font-semibold">
                  Notifications
                </SheetTitle>
                <SheetDescription className="text-sm text-gray-600 mt-1">
                  Orders, payments, and updates
                </SheetDescription>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          {notifications.length > 0 && (
            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="text-sm text-gray-600">
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
              {notifications.length === 0 ? (
                <div className="text-center py-16">
                  <div className="rounded-full bg-gray-100 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Bell className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-base font-medium text-gray-900 mb-1">
                    No notifications yet
                  </p>
                  <p className="text-sm text-gray-600">
                    We&apos;ll notify you about orders and payments
                  </p>
                </div>
              ) : (
                notifications.map((n: Notification) => {
                  const isUnread = !n.read;
                  return (
                    <Card
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={`cursor-pointer transition-all ${
                        isUnread
                          ? getPriorityColor(n.priority)
                          : "bg-white hover:bg-gray-50"
                      }`}
                    >
                      <CardContent className="p-4 flex gap-3">
                        <div
                          className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg ${getPriorityIconBg(
                            n.priority,
                            isUnread,
                          )}`}
                        >
                          <span className="text-xl">
                            {getNotificationIcon(n.priority)}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4
                              className={`font-semibold text-sm ${
                                isUnread ? "text-gray-900" : "text-gray-700"
                              }`}
                            >
                              {n.title}
                            </h4>
                            {isUnread && (
                              <div
                                className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${
                                  n.priority === "urgent"
                                    ? "bg-red-600"
                                    : n.priority === "high"
                                      ? "bg-orange-600"
                                      : "bg-green-600"
                                }`}
                              />
                            )}
                          </div>

                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {n.message}
                          </p>

                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs text-gray-500">
                              {new Date(n.timestamp).toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                              })}
                            </span>

                            {n.metadata?.actionUrl && (
                              <a
                                href={n.metadata.actionUrl}
                                className="text-xs text-green-600 hover:underline font-medium"
                                onClick={(e) => e.stopPropagation()}
                              >
                                View details →
                              </a>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
