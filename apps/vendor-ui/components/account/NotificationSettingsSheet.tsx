"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Bell, Mail, MessageSquare, Smartphone } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@repo/ui/components/sheet";
import { Switch } from "@repo/ui/components/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@repo/ui/components/form";
import { Separator } from "@repo/ui/components/separator";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { NotificationSettings, useUpdateNotificationSettings } from "./hooks";

const NotificationSettingsSchema = z.object({
  orderNotifications: z.boolean(),
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  smsNotifications: z.boolean(),
});

type NotificationSettingsFormValues = z.infer<
  typeof NotificationSettingsSchema
>;

interface NotificationSettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: NotificationSettings | undefined;
}

export default function NotificationSettingsSheet({
  open,
  onOpenChange,
  settings,
}: NotificationSettingsSheetProps) {
  const { mutate: updateSettings } = useUpdateNotificationSettings();

  const form = useForm<NotificationSettingsFormValues>({
    resolver: zodResolver(NotificationSettingsSchema),
    defaultValues: {
      orderNotifications: settings?.orderNotifications ?? true,
      emailNotifications: settings?.emailNotifications ?? true,
      pushNotifications: settings?.pushNotifications ?? true,
      smsNotifications: settings?.smsNotifications ?? false,
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset(settings);
    }
  }, [settings, form]);

  const handleChange = (
    field: keyof NotificationSettingsFormValues,
    value: boolean,
  ) => {
    form.setValue(field, value);
    updateSettings({ [field]: value });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col"
      >
        <SheetHeader className="px-6 pt-6 pb-4">
          <SheetTitle>Notification Settings</SheetTitle>
          <SheetDescription>
            Choose how you want to receive notifications about orders and
            updates
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1">
              <ScrollArea className="h-full px-6">
                <div className="space-y-6 pb-6">
                  <FormField
                    control={form.control}
                    name="orderNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <Bell className="w-4 h-4 text-green-600" />
                            <FormLabel className="text-base">
                              Order Alerts
                            </FormLabel>
                          </div>
                          <FormDescription>
                            Get notified about new orders and updates
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={(checked) =>
                              handleChange("orderNotifications", checked)
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      Notification Channels
                    </h3>
                    <p className="text-sm text-gray-500">
                      Select how you want to receive notifications
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="emailNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-blue-600" />
                            <FormLabel className="text-base">Email</FormLabel>
                          </div>
                          <FormDescription>
                            Receive notifications via email
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={(checked) =>
                              handleChange("emailNotifications", checked)
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pushNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <Smartphone className="w-4 h-4 text-purple-600" />
                            <FormLabel className="text-base">
                              Push Notifications
                            </FormLabel>
                          </div>
                          <FormDescription>
                            Get instant alerts on your device
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={(checked) =>
                              handleChange("pushNotifications", checked)
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="smsNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-orange-600" />
                            <FormLabel className="text-base">SMS</FormLabel>
                          </div>
                          <FormDescription>
                            Receive text messages for urgent updates
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={(checked) =>
                              handleChange("smsNotifications", checked)
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Tip:</strong> Enable push notifications for
                      instant order alerts and faster response times.
                    </p>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
