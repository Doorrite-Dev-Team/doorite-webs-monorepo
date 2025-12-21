"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User, Mail, Phone, Edit2, Loader2 } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/dialog";
import { toast } from "@repo/ui/components/sonner";
import { api } from "@/libs/api";

interface ProfileSectionProps {
  profile: User;
}

interface ProfileFormData {
  fullName: string;
  phoneNumber: string;
}

export default function ProfileSection({ profile }: ProfileSectionProps) {
  const queryClient = useQueryClient();
  const [showDialog, setShowDialog] = React.useState(false);
  const [formData, setFormData] = React.useState<ProfileFormData>({
    fullName: profile.fullName,
    phoneNumber: profile.phoneNumber,
  });
  const [errors, setErrors] = React.useState<Partial<ProfileFormData>>({});

  // Update profile mutation
  const updateMutation = useMutation({
    mutationFn: api.updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["user-profile"],
        (oldData: ProfileFormData) => ({
          ...oldData,
          ...data.user,
        }),
      );
      setShowDialog(false);
      toast.success("Profile updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });

  // Sync form with profile when dialog opens
  React.useEffect(() => {
    if (showDialog) {
      setFormData({
        fullName: profile.fullName,
        phoneNumber: profile.phoneNumber,
      });
      setErrors({});
    }
  }, [showDialog, profile]);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<ProfileFormData> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    updateMutation.mutate(formData);
  };

  const handleCancel = () => {
    setShowDialog(false);
    setErrors({});
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Profile Information</h3>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowDialog(true)}
            className="gap-1"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </Button>
        </div>

        <div className="space-y-3 rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-600">Full Name</p>
              <p className="font-medium text-gray-900 truncate">
                {profile.fullName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium text-gray-900 truncate">
                {profile.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-medium text-gray-900">{profile.phoneNumber}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your personal information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className={errors.fullName ? "border-red-500" : ""}
                disabled={updateMutation.isPending}
              />
              {errors.fullName && (
                <p className="text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="+234 800 000 0000"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                className={errors.phoneNumber ? "border-red-500" : ""}
                disabled={updateMutation.isPending}
              />
              {errors.phoneNumber && (
                <p className="text-sm text-red-600">{errors.phoneNumber}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email (Read-only)</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-600">
                Email cannot be changed. Contact support if needed.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
