"use client";

import {
  NotificationsDialogProps,
  LanguageDialogProps,
  ThemeDialogProps,
} from "@/types/account";
import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@repo/ui/components/dialog";
import { Label } from "@repo/ui/components/label";
import { Switch } from "@repo/ui/components/switch";
import { Bell, Globe, Moon, LogOut } from "lucide-react";
import MenuItem from "./menu-item";
import { useRouter } from "next/navigation";
// import { clientToken as tokenManager } from "@/libs/utils/client-tokens";
import { useAtom } from "jotai";
import { logoutAtom } from "@/store/userAtom";
import { logout } from "@/actions/auth";

// Notifications Settings Dialog
export const NotificationsDialog = ({
  notifications,
  onNotificationChange,
}: NotificationsDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <MenuItem
            icon={Bell}
            title="Notifications"
            subtitle="Order updates, promotions"
          />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Notification Preferences</DialogTitle>
          <DialogDescription>
            Choose what notifications you&apos;d like to receive from Dooeeite
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Order Updates</Label>
              <p className="text-sm text-muted-foreground">
                Get notified about your order status
              </p>
            </div>
            <Switch
              checked={notifications.orderUpdates}
              onCheckedChange={(checked: boolean) =>
                onNotificationChange("orderUpdates", checked)
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Promotions</Label>
              <p className="text-sm text-muted-foreground">
                Deals and special offers
              </p>
            </div>
            <Switch
              checked={notifications.promotions}
              onCheckedChange={(checked: boolean) =>
                onNotificationChange("promotions", checked)
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>New Restaurants</Label>
              <p className="text-sm text-muted-foreground">
                When new restaurants join Dooeeite
              </p>
            </div>
            <Switch
              checked={notifications.newRestaurants}
              onCheckedChange={(checked: boolean) =>
                onNotificationChange("newRestaurants", checked)
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button className="bg-primary hover:bg-primary/90 text-white">
            Save Preferences
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Language Settings Dialog
export const LanguageDialog = ({
  language,
  onLanguageChange,
}: LanguageDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <MenuItem icon={Globe} title="Language" subtitle={language} />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Language</DialogTitle>
          <DialogDescription>
            Choose your preferred language for the Dooeeite app
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          {(["English", "Spanish", "French", "German", "Italian"] as const).map(
            (lang) => (
              <Button
                key={lang}
                variant={language === lang ? "default" : "ghost"}
                className={`w-full justify-start ${
                  language === lang
                    ? "bg-primary hover:bg-primary/90 text-white"
                    : "hover:bg-primary/5"
                }`}
                onClick={() => onLanguageChange(lang)}
              >
                {lang}
              </Button>
            ),
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Theme Settings Dialog
export const ThemeDialog = ({ theme, onThemeChange }: ThemeDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <MenuItem
            icon={Moon}
            title="Theme"
            subtitle={
              theme === "light" ? "Light" : theme === "dark" ? "Dark" : "System"
            }
          />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose Theme</DialogTitle>
          <DialogDescription>
            Select your preferred theme for the Dooeeite app
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Button
            variant={theme === "light" ? "default" : "ghost"}
            className={`w-full justify-start ${
              theme === "light"
                ? "bg-primary hover:bg-primary/90 text-white"
                : "hover:bg-primary/5"
            }`}
            onClick={() => onThemeChange("light")}
          >
            ☀️ Light
          </Button>
          <Button
            variant={theme === "dark" ? "default" : "ghost"}
            className={`w-full justify-start ${
              theme === "dark"
                ? "bg-primary hover:bg-primary/90 text-white"
                : "hover:bg-primary/5"
            }`}
            onClick={() => onThemeChange("dark")}
          >
            🌙 Dark
          </Button>
          <Button
            variant={theme === "system" ? "default" : "ghost"}
            className={`w-full justify-start ${
              theme === "system"
                ? "bg-primary hover:bg-primary/90 text-white"
                : "hover:bg-primary/5"
            }`}
            onClick={() => onThemeChange("system")}
          >
            📱 System
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Sign Out Confirmation Dialog
export const SignOutDialog = () => {
  const [, logUserOut] = useAtom(logoutAtom);
  const logOut = async () => {
    // await tokenManager.clear();
    await logout();
    await logUserOut();
    ///////////////////////////
    router.push("/log-in");
  };
  const router = useRouter();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut size={16} className="mr-2" />
          Sign Out
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign Out</DialogTitle>
          <DialogDescription>
            Are you sure you want to sign out of your Dooeeite account?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button variant="destructive" onClick={logOut}>
            Sign Out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
