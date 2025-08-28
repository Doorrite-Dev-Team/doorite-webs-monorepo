"use client";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import { Label } from "@repo/ui/components/label";
import { Switch } from "@repo/ui/components/switch";
import {
  Bell,
  ChevronRight,
  CreditCard,
  Globe,
  HelpCircle,
  Lock,
  LogOut,
  MapPin,
  Moon,
  Phone,
  Plus,
  Settings,
  Shield,
  Trash2,
  User,
} from "lucide-react";
import React, { useState } from "react";

// Types
interface NotificationSettings {
  orderUpdates: boolean;
  promotions: boolean;
  newRestaurants: boolean;
}

type Theme = "light" | "dark" | "system";

interface MenuItemProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  subtitle?: string;
  onClick?: () => void;
  badge?: string;
  isSecure?: boolean;
  href?: string;
}

interface NotificationsDialogProps {
  notifications: NotificationSettings;
  onNotificationChange: (
    key: keyof NotificationSettings,
    value: boolean
  ) => void;
}

interface LanguageDialogProps {
  language: string;
  onLanguageChange: (language: string) => void;
}

interface ThemeDialogProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

interface AppSettingsSectionProps {
  notifications: NotificationSettings;
  onNotificationChange: (
    key: keyof NotificationSettings,
    value: boolean
  ) => void;
  language: string;
  onLanguageChange: (language: string) => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

// Profile Section Component
const ProfileSection: React.FC = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative group">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              OC
            </div>
            <div className="absolute -bottom-1 -right-1 bg-primary rounded-full w-6 h-6 border-2 border-white shadow-sm"></div>
            <Button
              size="sm"
              className="absolute -top-1 -right-1 rounded-full w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-primary hover:bg-primary/90 text-white shadow-md"
              onClick={() => (window.location.href = "/profile/edit-photo")}
            >
              <Plus size={14} />
            </Button>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold">Olivia Carter</h2>
            <p className="text-muted-foreground">olivia.carter@gmail.com</p>
            <Badge
              className="mt-2 border-primary/20 text-primary bg-primary/10"
              variant="outline"
            >
              Member
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Menu Item Component
const MenuItem: React.FC<MenuItemProps> = ({
  icon: Icon,
  title,
  subtitle,
  onClick,
  badge,
  isSecure = false,
  href,
}) => {
  const handleClick = (): void => {
    if (href) {
      window.location.href = href;
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center justify-between p-4 rounded-lg hover:bg-primary/5 cursor-pointer transition-colors group border border-transparent hover:border-primary/10"
    >
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 rounded-lg p-3 group-hover:bg-primary/15 transition-colors border border-primary/10">
          <Icon size={20} className="text-primary" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium">{title}</p>
            {isSecure && <Shield size={14} className="text-primary" />}
            {badge && <Badge variant="secondary">{badge}</Badge>}
          </div>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      <ChevronRight
        size={16}
        className="text-muted-foreground group-hover:text-foreground transition-colors"
      />
    </div>
  );
};

// Notifications Settings Dialog
const NotificationsDialog: React.FC<NotificationsDialogProps> = ({
  notifications,
  onNotificationChange,
}) => {
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
const LanguageDialog: React.FC<LanguageDialogProps> = ({
  language,
  onLanguageChange,
}) => {
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
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Theme Settings Dialog
const ThemeDialog: React.FC<ThemeDialogProps> = ({ theme, onThemeChange }) => {
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
const SignOutDialog: React.FC = () => {
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
          <Button
            variant="destructive"
            onClick={() => (window.location.href = "/auth/signin")}
          >
            Sign Out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Payment Options Section
const PaymentSection: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard size={20} />
          Payment Options
        </CardTitle>
        <CardDescription>Manage your payment methods securely</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <MenuItem
          icon={CreditCard}
          title="Card Information"
          subtitle="**** **** **** 1234"
          isSecure={true}
          href="/account/payment/cards"
        />
        <MenuItem
          icon={Phone}
          title="Mobile Payment"
          subtitle="Apple Pay, Google Pay"
          href="/account/payment/mobile"
        />
        <MenuItem
          icon={Plus}
          title="Add Payment Method"
          href="/account/payment/add"
        />
      </CardContent>
    </Card>
  );
};

// App Settings Section
const AppSettingsSection: React.FC<AppSettingsSectionProps> = ({
  notifications,
  onNotificationChange,
  language,
  onLanguageChange,
  theme,
  onThemeChange,
}) => {
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
          onNotificationChange={onNotificationChange}
        />
        <LanguageDialog
          language={language}
          onLanguageChange={onLanguageChange}
        />
        <ThemeDialog theme={theme} onThemeChange={onThemeChange} />
      </CardContent>
    </Card>
  );
};

// Account Settings Section
const AccountSettingsSection: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User size={20} />
          Account Settings
        </CardTitle>
        <CardDescription>
          Manage your account security and information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <MenuItem
          icon={User}
          title="Update Information"
          subtitle="Name, email, phone number"
          href="/account/profile/edit"
        />
        <MenuItem
          icon={Lock}
          title="Change Password"
          subtitle="Last changed 3 months ago"
          isSecure={true}
          href="/account/security/password"
        />
        <MenuItem
          icon={MapPin}
          title="Manage Addresses"
          subtitle="Home, work, and other locations"
          badge="3"
          href="/account/addresses"
        />
        <MenuItem
          icon={Shield}
          title="Security Settings"
          subtitle="Two-factor authentication, login history"
          isSecure={true}
          href="/account/security"
        />
      </CardContent>
    </Card>
  );
};

// Support Section
const SupportSection: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle size={20} />
          Support
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <MenuItem
          icon={HelpCircle}
          title="FAQ"
          subtitle="Find answers to common questions"
          href="/support/faq"
        />
        <MenuItem
          icon={Phone}
          title="Contact Us"
          subtitle="Get help from our support team"
          href="/support/contact"
        />
      </CardContent>
    </Card>
  );
};

// Account Actions Section
const AccountActionsSection: React.FC = () => {
  return (
    <Card className="border-destructive/20 bg-destructive/5">
      <CardHeader>
        <CardTitle className="text-destructive flex items-center gap-2">
          <Trash2 size={20} />
          Account Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <SignOutDialog />
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => (window.location.href = "/account/delete")}
        >
          <Trash2 size={16} className="mr-2" />
          Delete Account
        </Button>
      </CardContent>
    </Card>
  );
};

// Main Account Page Component
const AccountPage: React.FC = () => {
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
    <div className="w-full max-w-2xl mx-auto space-y-6 p-4">
      <ProfileSection />

      <PaymentSection />

      <AppSettingsSection
        notifications={notifications}
        onNotificationChange={handleNotificationChange}
        language={language}
        onLanguageChange={setLanguage}
        theme={theme}
        onThemeChange={setTheme}
      />

      <AccountSettingsSection />

      <SupportSection />

      <AccountActionsSection />
    </div>
  );
};

export default AccountPage;
