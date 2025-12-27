// src/components/signup/StepTwo.tsx
"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { MapPin, Loader2 } from "lucide-react";
import { LogoUpload } from "@/components/LogoUpload";
import { FormValues } from "./types";
import { useState, useEffect } from "react";
import { MultiSelect } from "./MultiSelect";
import { toast } from "@repo/ui/components/sonner";
import apiClient from "@/libs/api/client";

// Nigeria states
const NIGERIAN_STATES = [
  { value: "abia", label: "Abia" },
  { value: "adamawa", label: "Adamawa" },
  { value: "akwa-ibom", label: "Akwa Ibom" },
  { value: "anambra", label: "Anambra" },
  { value: "bauchi", label: "Bauchi" },
  { value: "bayelsa", label: "Bayelsa" },
  { value: "benue", label: "Benue" },
  { value: "borno", label: "Borno" },
  { value: "cross-river", label: "Cross River" },
  { value: "delta", label: "Delta" },
  { value: "ebonyi", label: "Ebonyi" },
  { value: "edo", label: "Edo" },
  { value: "ekiti", label: "Ekiti" },
  { value: "enugu", label: "Enugu" },
  { value: "fct", label: "Federal Capital Territory" },
  { value: "gombe", label: "Gombe" },
  { value: "imo", label: "Imo" },
  { value: "jigawa", label: "Jigawa" },
  { value: "kaduna", label: "Kaduna" },
  { value: "kano", label: "Kano" },
  { value: "katsina", label: "Katsina" },
  { value: "kebbi", label: "Kebbi" },
  { value: "kogi", label: "Kogi" },
  { value: "kwara", label: "Kwara" },
  { value: "lagos", label: "Lagos" },
  { value: "nasarawa", label: "Nasarawa" },
  { value: "niger", label: "Niger" },
  { value: "ogun", label: "Ogun" },
  { value: "ondo", label: "Ondo" },
  { value: "osun", label: "Osun" },
  { value: "oyo", label: "Oyo" },
  { value: "plateau", label: "Plateau" },
  { value: "rivers", label: "Rivers" },
  { value: "sokoto", label: "Sokoto" },
  { value: "taraba", label: "Taraba" },
  { value: "yobe", label: "Yobe" },
  { value: "zamfara", label: "Zamfara" },
];

export const StepTwo = () => {
  const form = useFormContext<FormValues>();
  const [categories, setCategories] = useState<
    { value: string; label: string }[]
  >([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Set Nigeria as default country on mount
  useEffect(() => {
    form.setValue("address.0", "nigeria");
  }, [form]);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const res = await apiClient("/auth/vendor-categories");

        const data = res.data as string[];

        // Transform API response to select options format
        const formattedCategories = data.map((cat) => ({
          value: cat,
          label: cat,
        }));

        setCategories(formattedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load business categories.", {
          description: `Error: ${(error as Error).message}, Please refresh the page.`,
        });
        // Set empty array on error
        setCategories([]);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="space-y-6">
      {/* Country & State */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Country - Fixed to Nigeria */}
        <FormField
          control={form.control}
          name="address.0"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Country <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                  <Select value={field.value} disabled>
                    <SelectTrigger className="h-11 border-gray-300 bg-gray-50 pl-10">
                      <SelectValue placeholder="Nigeria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nigeria">Nigeria</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* State */}
        <FormField
          control={form.control}
          name="address.1"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                State <span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="h-11 border-gray-300">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <SelectValue placeholder="Select state" />
                    </div>
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-[300px]">
                  {NIGERIAN_STATES.map((state) => (
                    <SelectItem key={state.value} value={state.value}>
                      {state.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      </div>

      {/* Business Categories */}
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">
              Business Categories <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              {isLoadingCategories ? (
                <div className="flex items-center justify-center h-11 border-2 border-gray-200 rounded-lg bg-gray-50">
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  <span className="ml-2 text-sm text-gray-600">
                    Loading categories...
                  </span>
                </div>
              ) : categories.length === 0 ? (
                <div className="flex items-center justify-center h-11 border-2 border-red-200 rounded-lg bg-red-50">
                  <span className="text-sm text-red-600">
                    Failed to load categories
                  </span>
                </div>
              ) : (
                <MultiSelect
                  options={categories}
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder="Select business categories"
                />
              )}
            </FormControl>
            <FormMessage className="text-xs" />
            <p className="text-xs text-gray-500 mt-1">
              Select one or more categories that describe your business
            </p>
          </FormItem>
        )}
      />

      {/* Business Logo */}
      <FormField
        control={form.control}
        name="logo"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">
              Business Logo
            </FormLabel>
            <FormControl>
              <LogoUpload value={field.value} onChange={field.onChange} />
            </FormControl>
            <FormMessage className="text-xs" />
            <p className="text-xs text-gray-500 mt-1">
              Upload your business logo (optional)
            </p>
          </FormItem>
        )}
      />
    </div>
  );
};
