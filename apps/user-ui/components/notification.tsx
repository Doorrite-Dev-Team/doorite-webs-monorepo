"use client";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@repo/ui/components/sheet";
import React, { useState } from "react";
import { WithCount } from "./withBadge";

import { Bell, Clock, Package, Utensils } from "lucide-react";

type NotificationType = "order" | "promo" | "restaurant";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "order",
    title: "Order Delivered!",
    message: "Your order from Burger Palace has been delivered successfully.",
    time: "2 minutes ago",
    read: false,
    icon: Package,
  },
  {
    id: "2",
    type: "promo",
    title: "🎉 25% Off Today!",
    message: "Get 25% off on orders above $30 from Italian Corner.",
    time: "1 hour ago",
    read: false,
    icon: Utensils,
  },
  {
    id: "3",
    type: "order",
    title: "Order Confirmed",
    message: "Your order #DT-2024 is being prepared at Pizza House.",
    time: "2 hours ago",
    read: true,
    icon: Clock,
  },
];

export default function NotificationPanel() {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          aria-label="Notifications"
          className="p-2 rounded-full hover:bg-primary/10 transition-colors"
        >
          <WithCount count={unreadCount} Icon={Bell} />
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:w-96 z-[999]">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Bell size={18} className="text-primary" />
              Notifications
              {unreadCount > 0 && (
                <Badge className="bg-primary text-white text-xs ml-2">
                  {unreadCount} new
                </Badge>
              )}
            </SheetTitle>

            <div className="flex items-center gap-2">
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  Mark all read
                </Button>
              )}
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="text-xs"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>

          <SheetDescription className="mt-1 text-sm text-muted-foreground">
            Stay updated with your orders and offers from Doorrite
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[70vh] mt-4">
          <div className="space-y-3 pr-4">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell
                  size={48}
                  className="mx-auto text-muted-foreground mb-3"
                />
                <p className="text-muted-foreground font-medium">
                  No notifications yet
                </p>
                <p className="text-sm text-muted-foreground">
                  We&apos;ll notify you about orders & offers
                </p>
              </div>
            ) : (
              notifications.map((notification) => {
                const Icon = notification.icon;
                return (
                  <Card
                    key={notification.id}
                    className={`cursor-pointer transition-colors ${
                      !notification.read
                        ? "border-primary/30 bg-primary/5"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => markAsRead(notification.id)}
                    role="button"
                    aria-pressed={notification.read}
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <div
                          className={`p-2 rounded-full shrink-0 flex items-center justify-center ${
                            !notification.read ? "bg-primary/20" : "bg-muted"
                          }`}
                        >
                          <Icon
                            size={16}
                            className={
                              !notification.read
                                ? "text-primary"
                                : "text-muted-foreground"
                            }
                          />
                        </div>

                        <div className="flex-1 space-y-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4
                              className={`font-medium text-sm truncate ${!notification.read ? "text-primary" : ""}`}
                            >
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1" />
                            )}
                          </div>

                          <p className="text-sm text-muted-foreground truncate">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
