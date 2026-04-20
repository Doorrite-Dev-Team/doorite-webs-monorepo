"use client";

import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { useTheme } from "next-themes";
import { riderAtom } from "@/store/riderAtom";
import { metricsAtom } from "@/store/earningsAtom";
import { apiClient } from "@/libs/api-client";
import { Card, CardContent } from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Switch } from "@repo/ui/components/switch";
import { Avatar, AvatarFallback } from "@repo/ui/components/avatar";
import { Badge } from "@repo/ui/components/badge";
import {
  User,
  Mail,
  Phone,
  Bike,
  Camera,
  Bell,
  Moon,
  Globe,
  Package,
  Star,
  DollarSign,
  CheckCircle,
  Pencil,
  Save,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "@repo/ui/components/sonner";

export default function AccountPage() {
  const [rider, setRider] = useAtom(riderAtom);
  const [metrics] = useAtom(metricsAtom);
  const { theme, setTheme } = useTheme();

  const [isAvailable, setIsAvailable] = useState(rider?.isAvailable ?? true);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    vehicleType: "",
  });

  // Sync edit form with rider data
  useEffect(() => {
    if (rider) {
      setEditForm({
        name: rider.name || rider.fullName || "",
        email: rider.email || "",
        phone: rider.phone || rider.phoneNumber || "",
        vehicleType: rider.vehicleType || "Bike",
      });
    }
  }, [rider]);

  const handleAvailabilityToggle = async (checked: boolean) => {
    setAvailabilityLoading(true);
    try {
      await apiClient.put("/riders/me", { isAvailable: checked });
      setIsAvailable(checked);
      // Update local rider state
      if (rider) {
        setRider({ ...rider, isAvailable: checked });
      }
      toast.success(
        checked ? "You are now available for deliveries" : "You are now offline",
      );
    } catch (error) {
      console.error("Failed to update availability:", error);
      toast.error("Failed to update availability. Please try again.");
    } finally {
      setAvailabilityLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setEditLoading(true);
    try {
      await apiClient.put("/riders/me", {
        fullName: editForm.name,
        phoneNumber: editForm.phone,
        vehicleType: editForm.vehicleType,
      });
      // Update local state
      if (rider) {
        setRider({
          ...rider,
          name: editForm.name,
          fullName: editForm.name,
          phoneNumber: editForm.phone,
          phone: editForm.phone,
          vehicleType: editForm.vehicleType,
        });
      }
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDarkModeToggle = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  const getInitials = (name?: string) => {
    if (!name) return "R";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-5 pb-4">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Account</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Manage your profile and preferences
        </p>
      </div>

      {/* Profile Card */}
      <Card className="border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="w-16 h-16 border-2 border-white shadow-sm">
                <AvatarFallback className="text-xl bg-green-600 text-white">
                  {getInitials(rider?.name || rider?.fullName)}
                </AvatarFallback>
              </Avatar>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full border border-gray-200 flex items-center justify-center shadow-sm hover:bg-gray-50">
                <Camera className="w-3.5 h-3.5 text-gray-500" />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 truncate">
                {rider?.name || rider?.fullName || "Rider"}
              </h3>
              <p className="text-sm text-gray-600 truncate">
                {rider?.email || "rider@example.com"}
              </p>
              <div className="flex gap-1.5 mt-1.5">
                <Badge className="bg-green-100 text-green-700 text-[10px]">
                  Verified
                </Badge>
                <Badge variant="secondary" className="text-[10px]">
                  {rider?.vehicleType || "Bike"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Edit toggle */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Profile Details
            </h3>
            {!isEditing ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="w-3.5 h-3.5 mr-1.5" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-1.5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  disabled={editLoading}
                >
                  <X className="w-3.5 h-3.5 mr-1" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveProfile}
                  disabled={editLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {editLoading ? (
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5 mr-1.5" />
                  )}
                  Save
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-500">Full Name</Label>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400 shrink-0" />
                <Input
                  value={isEditing ? editForm.name : (rider?.name || rider?.fullName || "")}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  disabled={!isEditing}
                  className="h-9"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-500">Email</Label>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                <Input
                  type="email"
                  value={rider?.email || ""}
                  disabled
                  className="h-9"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-500">Phone</Label>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                <Input
                  value={
                    isEditing
                      ? editForm.phone
                      : (rider?.phone || rider?.phoneNumber || "")
                  }
                  onChange={(e) =>
                    setEditForm({ ...editForm, phone: e.target.value })
                  }
                  disabled={!isEditing}
                  className="h-9"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-500">Vehicle</Label>
              <div className="flex items-center gap-2">
                <Bike className="w-4 h-4 text-gray-400 shrink-0" />
                <Input
                  value={
                    isEditing
                      ? editForm.vehicleType
                      : (rider?.vehicleType || "Bike")
                  }
                  onChange={(e) =>
                    setEditForm({ ...editForm, vehicleType: e.target.value })
                  }
                  disabled={!isEditing}
                  className="h-9"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Availability */}
      <Card className="border-gray-100">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isAvailable
                    ? "bg-green-50 text-green-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-900">
                  Available for Deliveries
                </h4>
                <p className="text-xs text-gray-500">
                  {isAvailable
                    ? "You will receive new orders"
                    : "You are currently offline"}
                </p>
              </div>
            </div>
            <Switch
              checked={isAvailable}
              onCheckedChange={handleAvailabilityToggle}
              disabled={availabilityLoading}
              className="data-[state=checked]:bg-green-600"
            />
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card className="border-gray-100">
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Your Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-3 rounded-xl bg-blue-50">
              <Package className="w-5 h-5 mx-auto text-blue-600 mb-1" />
              <p className="text-xl font-bold text-blue-600">
                {metrics.data.totalDeliveries}
              </p>
              <p className="text-[11px] text-gray-600">Deliveries</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-amber-50">
              <Star className="w-5 h-5 mx-auto text-amber-500 mb-1" />
              <p className="text-xl font-bold text-amber-600">
                {metrics.data.rating.toFixed(1)}
              </p>
              <p className="text-[11px] text-gray-600">Rating</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-green-50">
              <DollarSign className="w-5 h-5 mx-auto text-green-600 mb-1" />
              <p className="text-xl font-bold text-green-600">
                ₦{(metrics.data.totalDeliveries * 1200).toLocaleString()}
              </p>
              <p className="text-[11px] text-gray-600">Earned</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-purple-50">
              <CheckCircle className="w-5 h-5 mx-auto text-purple-600 mb-1" />
              <p className="text-xl font-bold text-purple-600">
                {metrics.data.totalDeliveries > 0 ? "98%" : "0%"}
              </p>
              <p className="text-[11px] text-gray-600">Completion</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="border-gray-100">
        <CardContent className="p-4 space-y-0">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Preferences
          </h3>

          <div className="space-y-1">
            <div className="flex items-center justify-between py-3 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Push Notifications</h4>
                  <p className="text-[11px] text-gray-500">
                    Receive order alerts
                  </p>
                </div>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Moon className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Dark Mode</h4>
                  <p className="text-[11px] text-gray-500">
                    Switch to dark theme
                  </p>
                </div>
              </div>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={handleDarkModeToggle}
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
                  <Globe className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Language</h4>
                  <p className="text-[11px] text-gray-500">English (US)</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="h-8 text-xs">
                Change
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
