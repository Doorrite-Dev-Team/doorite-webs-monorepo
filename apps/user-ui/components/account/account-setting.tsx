"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@repo/ui/components/card";
import { User, MapPin, Shield, Lock } from "lucide-react";
import MenuItem from "./menu-item";

// Account Settings Section
export const AccountSettingsSection = () => {
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
