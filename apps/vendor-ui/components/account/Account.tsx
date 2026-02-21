"use client";

import { useState } from "react";
import {
  User,
  Lock,
  Bell,
  Store,
  Clock,
  Star,
  Package,
  ShoppingBag,
  Calendar,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";
import { Skeleton } from "@repo/ui/components/skeleton";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { Badge } from "@repo/ui/components/badge";
import { Separator } from "@repo/ui/components/separator";
import {
  useVendorProfile,
  useVendorStats,
  useNotificationSettings,
} from "./hooks";
import EditProfileSheet from "./EditProfileSheeet";
import ChangePasswordSheet from "./ChangePasswordSheet";
import NotificationSettingsSheet from "./NotificationSettingsSheet";
import { format } from "date-fns";

export default function Account() {
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [notificationSettingsOpen, setNotificationSettingsOpen] =
    useState(false);

  const { data: profile, isLoading: profileLoading } = useVendorProfile();
  const { data: stats, isLoading: statsLoading } = useVendorStats();
  const { data: notificationSettings } = useNotificationSettings();

  // Loading State
  if (profileLoading || statsLoading) {
    return (
      <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!profile || !stats) return null;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={profile.logoUrl || undefined}
                alt={profile.businessName}
              />
              <AvatarFallback className="bg-green-100 text-green-700 text-2xl">
                <Store className="w-12 h-12" />
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <h2 className="text-2xl font-bold text-gray-900">
                  {profile.businessName}
                </h2>
                {profile.isVerified && (
                  <Badge className="bg-green-100 text-green-700">
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-gray-600">{profile.email}</p>
              <p className="text-gray-600">{profile.phoneNumber}</p>
              {profile.address && (
                <p className="text-sm text-gray-500">
                  {profile.address.address}
                  {profile.address.state && `, ${profile.address.state}`}
                </p>
              )}
            </div>

            <Button
              onClick={() => setEditProfileOpen(true)}
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50"
            >
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.rating.toFixed(1)}
                </p>
                <p className="text-xs text-gray-600">Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalOrders}
                </p>
                <p className="text-xs text-gray-600">Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <Package className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.activeProducts}
                </p>
                <p className="text-xs text-gray-600">Active Items</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">
                  {format(new Date(stats.memberSince), "MMM yyyy")}
                </p>
                <p className="text-xs text-gray-600">Joined</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Business Hours */}
      {(profile.openingTime ||
        profile.closingTime ||
        profile.avrgPreparationTime) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-600" />
              Business Hours
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {profile.openingTime && profile.closingTime && (
              <div className="flex justify-between">
                <span className="text-gray-600">Operating Hours</span>
                <span className="font-medium">
                  {profile.openingTime} - {profile.closingTime}
                </span>
              </div>
            )}
            {profile.avrgPreparationTime && (
              <div className="flex justify-between">
                <span className="text-gray-600">Avg. Preparation Time</span>
                <span className="font-medium">
                  {profile.avrgPreparationTime}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Settings Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <button
              onClick={() => setEditProfileOpen(true)}
              className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Edit Profile</p>
                  <p className="text-sm text-gray-500">
                    Update business information
                  </p>
                </div>
              </div>
              <span className="text-gray-400">›</span>
            </button>

            <Separator />

            <button
              onClick={() => setChangePasswordOpen(true)}
              className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100">
                  <Lock className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Change Password</p>
                  <p className="text-sm text-gray-500">Update your password</p>
                </div>
              </div>
              <span className="text-gray-400">›</span>
            </button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Configure how you receive alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <button
              onClick={() => setNotificationSettingsOpen(true)}
              className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100">
                  <Bell className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Notification Preferences
                  </p>
                  <p className="text-sm text-gray-500">
                    {notificationSettings?.orderNotifications
                      ? "Order alerts enabled"
                      : "Order alerts disabled"}
                  </p>
                </div>
              </div>
              <span className="text-gray-400">›</span>
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Sheets */}
      <EditProfileSheet
        open={editProfileOpen}
        onOpenChange={setEditProfileOpen}
        profile={profile}
      />
      <ChangePasswordSheet
        open={changePasswordOpen}
        onOpenChange={setChangePasswordOpen}
      />
      <NotificationSettingsSheet
        open={notificationSettingsOpen}
        onOpenChange={setNotificationSettingsOpen}
        settings={notificationSettings}
      />
    </div>
  );
}
