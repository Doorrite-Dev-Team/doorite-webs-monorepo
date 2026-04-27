"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "@repo/ui/components/sonner"; // Ensure toast is imported
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
import { ImageUpload, ImageUploadRef } from "@/components/ImageUpload";
import { deleteImage } from "@/actions/uploadThing"; // ✅ Import your delete action

const EditProfileSchema = z.object({
  businessName: z
    .string()
    .min(2, "Business name must be at least 2 characters"),
  phoneNumber: z.string().min(10, "Enter a valid phone number"),
  address: z.string().min(5, "Address is required"),
  logoUrl: z.url().nullable().optional(), // Changed z.url() to z.string().url() for better compatibility
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
  // ✅ Use mutateAsync for promise-based flow (better for ACID rollback)
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();
  const imageRef = useRef<ImageUploadRef>(null);

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

  useEffect(() => {
    if (open) {
      form.reset({
        businessName: profile.businessName,
        phoneNumber: profile.phoneNumber,
        address: profile.address?.address || "",
        logoUrl: profile.logoUrl,
        openingTime: profile.openingTime || "",
        closingTime: profile.closingTime || "",
        avrgPreparationTime: profile.avrgPreparationTime || "",
      });
    }
  }, [profile, form, open]);

  const onSubmit = async (data: EditProfileFormValues) => {
    try {
      await updateProfile({
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
      });

      toast.success("Profile updated successfully");
      onOpenChange(false);
    } catch (error) {
      // ✅ ACID: If the DB update fails, rollback the uploaded image
      console.error("Profile update failed, rolling back image...", error);
      toast.error("Profile update failed, rolling back image...");

      // Only rollback if the URL has changed (meaning a new file was just uploaded)
      if (data.logoUrl !== profile.logoUrl) {
        await imageRef.current?.rollback();
      }

      toast.error("Failed to update profile. Please try again.");
    }
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
            <ScrollArea className="h-[calc(100%-8rem)] px-6">
              <div className="space-y-6 pb-6">
                <FormField
                  control={form.control}
                  name="logoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Logo</FormLabel>
                      <FormControl>
                        <ImageUpload
                          ref={imageRef} // ✅ Attach the ref here
                          value={field.value ?? null}
                          onChange={field.onChange}
                          onRemove={deleteImage} // ✅ Pass the deletion action
                          title="Logo"
                        />
                      </FormControl>
                      <FormDescription>
                        Upload your business logo (recommended: 500x500px)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="openingTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Opening Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
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
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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
