"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { User, Loader2 } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@repo/ui/components/card";
import { api } from "@/libs/api";

import ProfileSection from "./settings/ProfileSection";
import PasswordSection from "./settings/PasswordSection";
import AddressesSection from "./settings/AddressesSection";

export const AccountSettingsSection = () => {
  // Fetch user profile (contains all user data including addresses)
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useQuery({
    queryKey: ["user-profile"],
    queryFn: api.fetchProfile,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2,
  });

  // Loading state
  if (profileLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (profileError) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-red-600 mb-4">
            Failed to load profile: {(profileError as Error).message}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-primary hover:underline"
          >
            Try again
          </button>
        </CardContent>
      </Card>
    );
  }

  // No profile data
  if (!profile) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-gray-600">No profile data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Account Settings
        </CardTitle>
        <CardDescription>
          Manage your account security and information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Information Section */}
        <ProfileSection profile={profile} />

        {/* Password Section */}
        <PasswordSection />

        {/* Addresses Section */}
        <AddressesSection addresses={profile.address || []} />
      </CardContent>
    </Card>
  );
};
