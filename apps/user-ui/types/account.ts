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

export type {
  NotificationsDialogProps,
  NotificationSettings,
  AppSettingsSectionProps,
  ThemeDialogProps,
  Theme,
  LanguageDialogProps,
  MenuItemProps,
};
