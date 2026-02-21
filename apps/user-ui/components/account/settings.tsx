// "use client";

// import * as React from "react";
// import { useAtom } from "jotai";
// import {
//   appSettingsAtom,
//   type NotificationSettings,
// } from "@/store/settingsAtom"; // Adjust path as needed
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
// } from "@repo/ui/components/card";
// import { Switch } from "@repo/ui/components/switch";
// import { Label } from "@repo/ui/components/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@repo/ui/components/select";
// import { Settings, Bell, Globe, Moon, Sun, Monitor } from "lucide-react";
// import { toast } from "@repo/ui/components/sonner";

// const LANGUAGES = [
//   { value: "en", label: "English" },
//   { value: "es", label: "Spanish" },
//   { value: "fr", label: "French" },
//   { value: "de", label: "German" },
//   { value: "pt", label: "Portuguese" },
// ];

// export const AppSettingsSection = () => {
//   // Replace react-query with useAtom
//   const [settings, setSettings] = useAtom(appSettingsAtom);
//   const [hasMounted, setHasMounted] = React.useState(false);

//   // Prevent hydration mismatch with localStorage
//   React.useEffect(() => {
//     setHasMounted(true);
//   }, []);

//   // Effect to apply theme changes to the document
//   React.useEffect(() => {
//     if (!hasMounted) return;

//     const root = document.documentElement;
//     const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
//       .matches
//       ? "dark"
//       : "light";

//     if (settings.theme === "dark") {
//       root.classList.add("dark");
//     } else if (settings.theme === "light") {
//       root.classList.remove("dark");
//     } else {
//       // System handling
//       systemTheme === "dark"
//         ? root.classList.add("dark")
//         : root.classList.remove("dark");
//     }
//   }, [settings.theme, hasMounted]);

//   const handleNotificationChange = (
//     key: keyof NotificationSettings,
//     value: boolean,
//   ) => {
//     setSettings((prev) => ({
//       ...prev,
//       notifications: {
//         ...prev.notifications,
//         [key]: value,
//       },
//     }));

//     toast.success("Preferences updated");
//   };

//   const handleThemeChange = (theme: "light" | "dark" | "system") => {
//     setSettings((prev) => ({ ...prev, theme }));
//     toast.success(`Theme set to ${theme}`);
//   };

//   const handleLanguageChange = (language: string) => {
//     setSettings((prev) => ({ ...prev, language }));
//     toast.success("Language updated");
//   };

//   // Avoid rendering until client-side storage is available to prevent flicker
//   if (!hasMounted) return null;

//   return (
//     <Card>
//       <CardHeader>
//         <div className="flex items-center justify-between">
//           <CardTitle className="flex items-center gap-2">
//             <Settings className="w-5 h-5" />
//             App Settings
//           </CardTitle>
//         </div>
//       </CardHeader>
//       <CardContent className="space-y-6">
//         {/* Notifications Section */}
//         <div className="space-y-4">
//           <div className="flex items-center gap-2 pb-2 border-b">
//             <Bell className="w-4 h-4 text-primary" />
//             <h3 className="font-semibold text-gray-900">Notifications</h3>
//           </div>

//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <div className="space-y-0.5">
//                 <Label htmlFor="orderUpdates" className="text-base">
//                   Order Updates
//                 </Label>
//                 <p className="text-sm text-gray-600">
//                   Get notified about your order status
//                 </p>
//               </div>
//               <Switch
//                 id="orderUpdates"
//                 checked={settings.notifications.orderUpdates}
//                 onCheckedChange={(checked) =>
//                   handleNotificationChange("orderUpdates", checked)
//                 }
//               />
//             </div>

//             <div className="flex items-center justify-between">
//               <div className="space-y-0.5">
//                 <Label htmlFor="promotions" className="text-base">
//                   Promotions
//                 </Label>
//                 <p className="text-sm text-gray-600">
//                   Receive special offers and deals
//                 </p>
//               </div>
//               <Switch
//                 id="promotions"
//                 checked={settings.notifications.promotions}
//                 onCheckedChange={(checked) =>
//                   handleNotificationChange("promotions", checked)
//                 }
//               />
//             </div>

//             <div className="flex items-center justify-between">
//               <div className="space-y-0.5">
//                 <Label htmlFor="newRestaurants" className="text-base">
//                   New Restaurants
//                 </Label>
//                 <p className="text-sm text-gray-600">
//                   Alerts for newly added vendors
//                 </p>
//               </div>
//               <Switch
//                 id="newRestaurants"
//                 checked={settings.notifications.newRestaurants}
//                 onCheckedChange={(checked) =>
//                   handleNotificationChange("newRestaurants", checked)
//                 }
//               />
//             </div>

//             <div className="flex items-center justify-between">
//               <div className="space-y-0.5">
//                 <Label htmlFor="emailNotifications" className="text-base">
//                   Email Notifications
//                 </Label>
//                 <p className="text-sm text-gray-600">
//                   Receive updates via email
//                 </p>
//               </div>
//               <Switch
//                 id="emailNotifications"
//                 checked={settings.notifications.emailNotifications}
//                 onCheckedChange={(checked) =>
//                   handleNotificationChange("emailNotifications", checked)
//                 }
//               />
//             </div>

//             <div className="flex items-center justify-between">
//               <div className="space-y-0.5">
//                 <Label htmlFor="pushNotifications" className="text-base">
//                   Push Notifications
//                 </Label>
//                 <p className="text-sm text-gray-600">
//                   Receive mobile push alerts
//                 </p>
//               </div>
//               <Switch
//                 id="pushNotifications"
//                 checked={settings.notifications.pushNotifications}
//                 onCheckedChange={(checked) =>
//                   handleNotificationChange("pushNotifications", checked)
//                 }
//               />
//             </div>
//           </div>
//         </div>

//         {/* Theme Section */}
//         <div className="space-y-4">
//           <div className="flex items-center gap-2 pb-2 border-b">
//             <Moon className="w-4 h-4 text-primary" />
//             <h3 className="font-semibold text-gray-900">Appearance</h3>
//           </div>

//           <div className="space-y-3">
//             <Label>Theme</Label>
//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handleThemeChange("light")}
//                 className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
//                   settings.theme === "light"
//                     ? "border-primary bg-primary/5"
//                     : "border-gray-200 hover:border-gray-300"
//                 }`}
//               >
//                 <Sun className="w-5 h-5" />
//                 <span className="text-sm font-medium">Light</span>
//               </button>

//               <button
//                 onClick={() => handleThemeChange("dark")}
//                 className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
//                   settings.theme === "dark"
//                     ? "border-primary bg-primary/5"
//                     : "border-gray-200 hover:border-gray-300"
//                 }`}
//               >
//                 <Moon className="w-5 h-5" />
//                 <span className="text-sm font-medium">Dark</span>
//               </button>

//               <button
//                 onClick={() => handleThemeChange("system")}
//                 className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
//                   settings.theme === "system"
//                     ? "border-primary bg-primary/5"
//                     : "border-gray-200 hover:border-gray-300"
//                 }`}
//               >
//                 <Monitor className="w-5 h-5" />
//                 <span className="text-sm font-medium">System</span>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Language Section */}
//         <div className="space-y-4">
//           <div className="flex items-center gap-2 pb-2 border-b">
//             <Globe className="w-4 h-4 text-primary" />
//             <h3 className="font-semibold text-gray-900">Language</h3>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="language">Display Language</Label>
//             <Select
//               value={settings.language}
//               onValueChange={handleLanguageChange}
//             >
//               <SelectTrigger id="language">
//                 <SelectValue placeholder="Select language" />
//               </SelectTrigger>
//               <SelectContent>
//                 {LANGUAGES.map((lang) => (
//                   <SelectItem key={lang.value} value={lang.value}>
//                     {lang.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };
