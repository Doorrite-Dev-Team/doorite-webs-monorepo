"use client";

import { useState } from "react";
import { useAtom } from "jotai";
import { riderAtom } from "@/store/riderAtom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Switch } from "@repo/ui/components/switch";
import { Separator } from "@repo/ui/components/separator";
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
} from "lucide-react";
import { toast } from "@repo/ui/components/sonner";

export default function AccountPage() {
  const [rider] = useAtom(riderAtom);
  const [isAvailable, setIsAvailable] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleAvailabilityToggle = (checked: boolean) => {
    setIsAvailable(checked);
    toast.success(
      checked ? "You are now available for deliveries" : "You are now offline",
    );
  };

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 md:w-20 md:h-20">
              <AvatarFallback className="text-2xl bg-green-100 text-green-600">
                {rider?.name?.charAt(0).toUpperCase() || "R"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-bold">
                {rider?.name || rider?.fullName || "Rider Name"}
              </h3>
              <p className="text-sm text-gray-600">
                {rider?.email || "rider@example.com"}
              </p>
              <div className="flex gap-2 mt-2">
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700"
                >
                  Verified
                </Badge>
                <Badge variant="secondary">
                  {rider?.vehicleType || "Bike"}
                </Badge>
              </div>
            </div>
            <Button size="sm" variant="outline">
              <Camera className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">Full Name</Label>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <Input
                  defaultValue={rider?.name || rider?.fullName || ""}
                  disabled
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">Email</Label>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <Input
                  type="email"
                  defaultValue={rider?.email || ""}
                  disabled
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">Phone</Label>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <Input
                  defaultValue={
                    rider?.phone || rider?.phoneNumber || "+1 (XXX) XXX-XXXX"
                  }
                  disabled
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">Vehicle</Label>
              <div className="flex items-center gap-2">
                <Bike className="w-4 h-4 text-gray-400" />
                <Input defaultValue={rider?.vehicleType || "Bike"} disabled />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Availability Card */}
      <Card>
        <CardHeader>
          <CardTitle>Availability</CardTitle>
          <CardDescription>Control when you receive orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">Available for Deliveries</h4>
              <p className="text-sm text-gray-600">
                {isAvailable
                  ? "You will receive new orders"
                  : "You are offline"}
              </p>
            </div>
            <Switch
              checked={isAvailable}
              onCheckedChange={handleAvailabilityToggle}
              className="data-[state=checked]:bg-green-600"
            />
          </div>
        </CardContent>
      </Card>

      {/* Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-400" />
              <div>
                <h4 className="font-medium">Push Notifications</h4>
                <p className="text-xs text-gray-600">Receive order alerts</p>
              </div>
            </div>
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-gray-400" />
              <div>
                <h4 className="font-medium">Dark Mode</h4>
                <p className="text-xs text-gray-600">Switch to dark theme</p>
              </div>
            </div>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-gray-400" />
              <div>
                <h4 className="font-medium">Language</h4>
                <p className="text-xs text-gray-600">English (US)</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Change
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Card */}
      <Card>
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Package className="w-5 h-5 mx-auto text-blue-600 mb-1" />
              <p className="text-xl font-bold text-blue-600">127</p>
              <p className="text-xs text-gray-600">Deliveries</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <Star className="w-5 h-5 mx-auto text-green-600 mb-1" />
              <p className="text-xl font-bold text-green-600">4.8</p>
              <p className="text-xs text-gray-600">Rating</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <p className="text-xl font-bold text-yellow-600">₦230k</p>
              <p className="text-xs text-gray-600">Earned</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-xl font-bold text-purple-600">98%</p>
              <p className="text-xs text-gray-600">Completion</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
