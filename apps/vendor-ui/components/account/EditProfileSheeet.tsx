"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@repo/ui/components/sheet";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Textarea } from "@repo/ui/components/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { VendorProfile, useUpdateProfile } from "./hooks";
import { ImageUpload } from "@/components/ImageUpload";

const EditProfileSchema = z.object({
  businessName: z
    .string()
    .min(2, "Business name must be at least 2 characters"),
  phoneNumber: z.string().min(10, "Enter a valid phone number"),
  address: z.string().min(5, "Address is required"),
  logoUrl: z.url().nullable().optional(),
  openingTime: z.string().optional(),
  closingTime: z.string().optional(),
  avrgPreparationTime: z.string().optional(),
});

type EditProfileFormValues = z.infer<typeof EditProfileSchema>;

interface EditProfileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: VendorProfile;
}

export default function EditProfileSheet({
  open,
  onOpenChange,
  profile,
}: EditProfileSheetProps) {
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      businessName: profile.businessName,
      phoneNumber: profile.phoneNumber,
      address: profile.address?.address || "",
      logoUrl: profile.logoUrl,
      openingTime: profile.openingTime || "",
      closingTime: profile.closingTime || "",
      avrgPreparationTime: profile.avrgPreparationTime || "",
    },
  });

  // Reset form when profile changes
  useEffect(() => {
    form.reset({
      businessName: profile.businessName,
      phoneNumber: profile.phoneNumber,
      address: profile.address?.address || "",
      logoUrl: profile.logoUrl,
      openingTime: profile.openingTime || "",
      closingTime: profile.closingTime || "",
      avrgPreparationTime: profile.avrgPreparationTime || "",
    });
  }, [profile, form]);

  const onSubmit = (data: EditProfileFormValues) => {
    updateProfile(
      {
        businessName: data.businessName,
        phoneNumber: data.phoneNumber,
        address: {
          address: data.address,
          state: profile.address?.state,
          country: profile.address?.country,
          coordinates: profile.address?.coordinates,
        },
        logoUrl: data.logoUrl || undefined,
        openingTime: data.openingTime || undefined,
        closingTime: data.closingTime || undefined,
        avrgPreparationTime: data.avrgPreparationTime || undefined,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl p-0 flex flex-col"
      >
        <SheetHeader className="px-6 pt-6 pb-4">
          <SheetTitle>Edit Profile</SheetTitle>
          <SheetDescription>
            Update your business information and settings
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <ScrollArea className="flex-1 px-6">
              <div className="space-y-6 pb-6">
                {/* Logo Upload */}
                <FormField
                  control={form.control}
                  name="logoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Logo</FormLabel>
                      <FormControl>
                        <ImageUpload
                          value={field.value ?? null}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormDescription>
                        Upload your business logo (recommended: 500x500px)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Business Name */}
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. The Daily Grind" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone Number */}
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="e.g. 08012345678"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Address */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your complete business address"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Operating Hours */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="openingTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Opening Time</FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            placeholder="e.g. 09:00 AM"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="closingTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Closing Time</FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            placeholder="e.g. 09:00 PM"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Preparation Time */}
                <FormField
                  control={form.control}
                  name="avrgPreparationTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Average Preparation Time</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 20-30 mins" {...field} />
                      </FormControl>
                      <FormDescription>
                        Estimated time to prepare orders
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>

            <SheetFooter className="px-6 py-4 border-t bg-gray-50/50">
              <div className="flex gap-3 w-full">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => onOpenChange(false)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
