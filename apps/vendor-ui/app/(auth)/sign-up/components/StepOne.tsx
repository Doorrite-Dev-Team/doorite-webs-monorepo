// src/components/signup/StepOne.tsx
"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { Building2, Mail, Phone, Lock, User, Eye, EyeOff } from "lucide-react";
import { FormValues } from "./types";
import { useState } from "react";

export const StepOne = () => {
  const form = useFormContext<FormValues>();
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-6">
      {/* Business Name */}
      <FormField
        control={form.control}
        name="businessName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">
              Business Name <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  {...field}
                  leftIcon={<User className="w-5 h-5" />}
                  placeholder="Enter your business name"
                  className="pl-10 h-11 border-gray-300 focus:border-primary focus:ring-primary"
                />
              </div>
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      {/* Phone Number */}
      <FormField
        control={form.control}
        name="phoneNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">
              Phone Number <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  {...field}
                  leftIcon={<Phone className="w-5 h-5" />}
                  type="tel"
                  placeholder="07011111111"
                  className="pl-10 h-11 border-gray-300 focus:border-primary focus:ring-primary"
                />
              </div>
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      {/* Email */}
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">
              Email Address <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  {...field}
                  leftIcon={<Mail className="w-5 h-5" />}
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10 h-11 border-gray-300 focus:border-primary focus:ring-primary"
                />
              </div>
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      {/* Password */}
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">
              Password <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  {...field}
                  leftIcon={<Lock className="w-5 h-5" />}
                  rightIcon={
                    <button
                      type="button"
                      className="cursor-pointer p-1 hover:bg-muted rounded transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  }
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className="pl-10 h-11 border-gray-300 focus:border-primary focus:ring-primary"
                />
              </div>
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      {/* Confirm Password */}
      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">
              Confirm Password <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  {...field}
                  leftIcon={<Lock className="w-5 h-5" />}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  className="pl-10 h-11 border-gray-300 focus:border-primary focus:ring-primary"
                  rightIcon={
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="cursor-pointer p-1 hover:bg-muted rounded transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  }
                />
              </div>
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
    </div>
  );
};
