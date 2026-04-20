"use client";

import { useState } from "react";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Bell, BellOff, Check } from "lucide-react";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import { toast } from "@repo/ui/components/sonner";

interface PushNotificationPromptProps {
  variant?: "card" | "button";
  className?: string;
}

export function PushNotificationPrompt({
  variant = "card",
  className = "",
}: PushNotificationPromptProps) {
  const { permission, isSubscribed, isLoading, subscribe, unsubscribe } =
    usePushNotifications();
  const [isMutating, setIsMutating] = useState(false);

  if (permission === "unsupported") {
    if (variant === "button") return null;
    return (
      <Card className={className}>
        <CardContent className="p-4 text-center text-sm text-muted-foreground">
          Push notifications are not supported in this browser.
        </CardContent>
      </Card>
    );
  }

  if (permission === "denied") {
    if (variant === "button") return null;
    return (
      <Card className={className}>
        <CardContent className="p-4 text-center text-sm text-muted-foreground">
          <BellOff className="mx-auto h-8 w-8 mb-2 opacity-50" />
          Push notifications are blocked. Enable them in your browser settings.
        </CardContent>
      </Card>
    );
  }

  const handleToggle = async () => {
    setIsMutating(true);
    try {
      if (isSubscribed) {
        await unsubscribe();
        toast.success("Push notifications disabled");
      } else {
        const success = await subscribe();
        if (success) {
          toast.success("Push notifications enabled");
        } else {
          toast.error("Failed to enable push notifications");
        }
      }
    } finally {
      setIsMutating(false);
    }
  };

  if (variant === "button") {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleToggle}
        disabled={isLoading || isMutating}
        className={className}
      >
        {isSubscribed ? (
          <>
            <BellOff className="w-4 h-4" />
            Disable Notifications
          </>
        ) : (
          <>
            <Bell className="w-4 h-4" />
            Enable Notifications
          </>
        )}
      </Button>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          {isSubscribed ? (
            <Bell className="h-5 w-5 text-primary" />
          ) : (
            <BellOff className="h-5 w-5 text-muted-foreground" />
          )}
          Order Notifications
        </CardTitle>
        <CardDescription className="text-sm">
          {isSubscribed
            ? "You'll receive push alerts for order updates."
            : "Get notified about order status even when the app is closed."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleToggle}
          disabled={isLoading || isMutating}
          className="w-full"
          variant={isSubscribed ? "outline" : "default"}
        >
          {isSubscribed ? (
            <>
              <Check className="w-4 h-4" />
              Notifications On
            </>
          ) : (
            <>
              <Bell className="w-4 h-4" />
              Enable Push Notifications
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
