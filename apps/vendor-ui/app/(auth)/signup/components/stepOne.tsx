import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import React from "react";
import { Control } from "react-hook-form";

export interface FormValues {
  businessName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  address: [string, string?];
  category: string;
  logo?: string;
}

interface StepOneProps {
  control: Control<FormValues>;
}

export const StepOne: React.FC<StepOneProps> = ({ control }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <FormField
        control={control}
        name="businessName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Business Name</FormLabel>
            <FormControl>
              <Input placeholder="e.g. Item7" type="text" {...field} />
            </FormControl>
            <FormDescription>
              Enter your business name (4-30 characters)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="phoneNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <Input placeholder="+234 8098987651" type="tel" {...field} />
            </FormControl>
            <FormDescription>Enter your business phone number</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email Address</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g. johndoe@gmail.com"
                type="email"
                {...field}
              />
            </FormControl>
            <FormDescription>Enter your business email address</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="***********" type="password" {...field} />
              </FormControl>
              <FormDescription>
                Choose a secure password (8+ characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input placeholder="***********" type="password" {...field} />
              </FormControl>
              <FormDescription>Confirm your password</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};