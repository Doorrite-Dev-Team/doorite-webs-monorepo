import { atomWithStorage } from "jotai/utils";

export interface NotificationSettings {
  orderUpdates: boolean;
  promotions: boolean;
  newRestaurants: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export interface AppSettings {
  theme: "light" | "dark" | "system";
  language: string;
  notifications: NotificationSettings;
}

// Default initial state
const defaultSettings: AppSettings = {
  theme: "system",
  language: "en",
  notifications: {
    orderUpdates: true,
    promotions: false,
    newRestaurants: true,
    emailNotifications: true,
    pushNotifications: false,
  },
};

// atomWithStorage automatically syncs with localStorage
export const appSettingsAtom = atomWithStorage<AppSettings>(
  "app-settings-storage",
  defaultSettings,
);
