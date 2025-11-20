"use client";

import { NotificationSettings, Theme } from "@/types/account";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@repo/ui/components/card";
import { Settings } from "lucide-react";
import { NotificationsDialog, LanguageDialog, ThemeDialog } from "./Dialogs";
import { useState } from "react";

// App Settings Section
export const AppSettingsSection = () => {
  const [notifications, setNotifications] = useState<NotificationSettings>({
    orderUpdates: true,
    promotions: false,
    newRestaurants: true,
  });

  const [theme, setTheme] = useState<Theme>("light");
  const [language, setLanguage] = useState<string>("English");

  const handleNotificationChange = (
    key: keyof NotificationSettings,
    value: boolean
  ): void => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings size={20} />
          App Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <NotificationsDialog
          notifications={notifications}
          onNotificationChange={handleNotificationChange}
        />
        <LanguageDialog language={language} onLanguageChange={setLanguage} />
        <ThemeDialog theme={theme} onThemeChange={setTheme} />
      </CardContent>
    </Card>
  );
};
