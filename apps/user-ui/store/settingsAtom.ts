import { atomWithStorage } from "jotai/utils";

export interface NotificationSettings {
  orderUpdates: boolean;
  promotions: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export interface AppSettings {
  theme: "light" | "dark";
  notifications: NotificationSettings;
}

const defaultSettings: AppSettings = {
  theme: "light",
  notifications: {
    orderUpdates: true,
    promotions: false,
    emailNotifications: true,
    pushNotifications: false,
  },
};

export const appSettingsAtom = atomWithStorage<AppSettings>(
  "app-settings-storage",
  defaultSettings,
);
