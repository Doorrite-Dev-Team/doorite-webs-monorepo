"use client";

import { useState } from "react";
import { useAtom } from "jotai";
import { riderAtom } from "@/store/riderAtom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Switch } from "@repo/ui/components/switch";
import { Separator } from "@repo/ui/components/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/avatar";
import { Badge } from "@repo/ui/components/badge";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Bike,
  Camera,
  Settings,
  LogOut,
  Bell,
  Moon,
  Globe
} from "lucide-react";
import { toast } from "@repo/ui/components/sonner";

export default function AccountPage() {
  const [rider, setRider] = useAtom(riderAtom);
  const [isAvailable, setIsAvailable] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleAvailabilityToggle = (checked: boolean) => {
    setIsAvailable(checked);
    toast.success(checked ? "You are now available for deliveries" : "You are now offline");
  };

  const handleLogout = () => {
    // TODO: Implement logout functionality
    toast.info("Logging out...");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Account</h1>
            <p className="text-gray-600 mt-1">Manage your profile and settings</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your personal details and verification status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={rider?.profileImage} />
                  <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                    {rider?.name?.charAt(0).toUpperCase() || "R"}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold">{rider?.name || rider?.fullName || "Rider Name"}</h3>
                <p className="text-sm text-gray-600">{rider?.email || "rider@example.com"}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    ✓ Verified
                  </Badge>
                  <Badge variant="secondary">
                    {rider?.vehicleType || "Bike"}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="flex gap-2">
                  <User className="w-5 h-5 text-gray-400 mt-2" />
                  <Input
                    id="name"
                    defaultValue={rider?.name || rider?.fullName || ""}
                    disabled
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="flex gap-2">
                  <Mail className="w-5 h-5 text-gray-400 mt-2" />
                  <Input
                    id="email"
                    type="email"
                    defaultValue={rider?.email || ""}
                    disabled
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex gap-2">
                  <Phone className="w-5 h-5 text-gray-400 mt-2" />
                  <Input
                    id="phone"
                    defaultValue={rider?.phone || rider?.phoneNumber || "+1 (XXX) XXX-XXXX"}
                    disabled
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicle">Vehicle Type</Label>
                <div className="flex gap-2">
                  <Bike className="w-5 h-5 text-gray-400 mt-2" />
                  <Input
                    id="vehicle"
                    defaultValue={rider?.vehicleType || "Bike"}
                    disabled
                  />
                </div>
              </div>
            </div>

            <Button className="w-full md:w-auto">
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* Availability Card */}
        <Card>
          <CardHeader>
            <CardTitle>Availability</CardTitle>
            <CardDescription>Control when you receive delivery requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">Available for Deliveries</h4>
                <p className="text-sm text-gray-600">
                  {isAvailable
                    ? "You will receive new delivery requests"
                    : "You won't receive any delivery requests"}
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
            <CardDescription>Customize your app experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <Bell className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">Push Notifications</h4>
                  <p className="text-sm text-gray-600">Receive alerts for new orders</p>
                </div>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <Moon className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">Dark Mode</h4>
                  <p className="text-sm text-gray-600">Switch to dark theme</p>
                </div>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <Globe className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">Language</h4>
                  <p className="text-sm text-gray-600">English (US)</p>
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
            <CardDescription>Your delivery performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-3xl font-bold text-blue-600">127</p>
                <p className="text-sm text-gray-600 mt-1">Total Deliveries</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-3xl font-bold text-green-600">4.8</p>
                <p className="text-sm text-gray-600 mt-1">Rating</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-3xl font-bold text-yellow-600">$2,340</p>
                <p className="text-sm text-gray-600 mt-1">Total Earnings</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-3xl font-bold text-purple-600">98%</p>
                <p className="text-sm text-gray-600 mt-1">Completion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
