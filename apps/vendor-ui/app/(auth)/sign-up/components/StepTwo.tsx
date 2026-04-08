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
import { MapPin, Loader2, CheckCircle, XCircle } from "lucide-react";
import { ImageUpload } from "@/components/ImageUpload";
import { FormValues } from "./types";
import { useState, useEffect } from "react";
import { MultiSelect } from "./MultiSelect";
import { toast } from "@repo/ui/components/sonner";
import axios from "axios";
import { Input } from "@repo/ui/components/input";

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

const CATEGORIES_CACHE_KEY = "doorrite-categories-cache";
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CachedCategories {
  data: { value: string; label: string }[];
  timestamp: number;
}

/**
 * Transform the hierarchical category keys into human-readable labels
 */
const formatCategoryLabel = (key: string): string => {
  // Split by dot to get parts
  const parts = key.split(".");

  // Format each part
  const formatted = parts.map((part) => {
    // Convert camelCase to Title Case
    return part
      .replace(/([A-Z])/g, " $1") // Add space before capital letters
      .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
      .trim();
  });

  // Join with arrow for nested categories
  return formatted.join(" → ");
};

export const StepTwo = () => {
  const form = useFormContext<FormValues>();
  const [categories, setCategories] = useState<
    { value: string; label: string }[]
  >([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [locationStatus, setLocationStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [locationError, setLocationError] = useState<string>("");
  const baseUrl = process.env.NEXT_PUBLIC_API_URI;

  // Set Nigeria as default country on mount
  useEffect(() => {
    form.setValue("address.country", "nigeria");
  }, [form]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setLocationStatus("error");
      return;
    }

    setLocationStatus("loading");
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        form.setValue("address.coordinates", {
          lat: position.coords.latitude,
          long: position.coords.longitude,
        });
        setLocationStatus("success");
      },
      (error) => {
        let errorMessage = "Failed to get location";
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage =
            "Location permission denied. Please enable location access.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = "Location information unavailable.";
        } else if (error.code === error.TIMEOUT) {
          errorMessage = "Location request timed out.";
        }
        setLocationError(errorMessage);
        setLocationStatus("error");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  // Fetch categories from API with caching
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);

        // Check cache first
        const cached = sessionStorage.getItem(CATEGORIES_CACHE_KEY);
        if (cached) {
          const parsedCache: CachedCategories = JSON.parse(cached);
          const now = Date.now();

          // If cache is still valid, use it
          if (now - parsedCache.timestamp < CACHE_EXPIRY_MS) {
            setCategories(parsedCache.data);
            setIsLoadingCategories(false);
            return;
          }
        }

        // Fetch from API
        const res = await axios.get(`${baseUrl}/auth/vendor-categories`);

        const data = res.data as {
          ok: boolean;
          keys: string[];
          message?: string;
        };

        if (!data.ok || !data.keys) {
          toast.error("Failed to load business categories.", {
            description: `Error: ${data.message || "Invalid response format"}, Please refresh the page.`,
          });
          console.error("Error fetching categories:", data.message);
          return;
        }

        // Transform the keys array into formatted options
        const formattedCategories = data.keys.map((key) => ({
          value: key,
          label: formatCategoryLabel(key),
        }));

        setCategories(formattedCategories);

        // Cache the results
        const cacheData: CachedCategories = {
          data: formattedCategories,
          timestamp: Date.now(),
        };
        sessionStorage.setItem(CATEGORIES_CACHE_KEY, JSON.stringify(cacheData));
      } catch (error: any) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load business categories.", {
          description: `Error: ${error?.response?.data?.message || error?.message}, Please refresh the page.`,
        });
        setCategories([]);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [baseUrl]);

  return (
    <div className="space-y-6">
      {/* Country & State */}
      <div className="grid grid-cols-2 gap-4">
        {/* Country - Fixed to Nigeria */}
        <FormField
          control={form.control}
          name="address.country"
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
          name="address.state"
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

        {/*address string*/}
        <FormField
          control={form.control}
          name="address.address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Address <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input type="text" placeholder="Company's Address" {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      </div>

      {/* Precise Location */}
      <div className="space-y-2">
        <FormField
          control={form.control}
          name="address.coordinates"
          render={() => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Precise Location <span className="text-red-500">*</span>
              </FormLabel>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={locationStatus === "loading"}
                  className={`
                    h-11 px-4 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700
                    hover:bg-gray-50 hover:border-gray-400
                    focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white
                    transition-colors duration-200
                    ${locationStatus === "success" ? "border-green-500 bg-green-50" : ""}
                    ${locationStatus === "error" ? "border-red-300 bg-red-50" : ""}
                  `}
                >
                  {locationStatus === "loading" ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Getting location...
                    </span>
                  ) : locationStatus === "success" ? (
                    <span className="flex items-center justify-center gap-2 text-green-700">
                      <CheckCircle className="w-4 h-4" />
                      Location set
                    </span>
                  ) : locationStatus === "error" ? (
                    <span className="flex items-center justify-center gap-2 text-red-600">
                      <XCircle className="w-4 h-4" />
                      Try Again
                    </span>
                  ) : (
                    "Set Precise Location"
                  )}
                </button>
                {locationError && (
                  <p className="text-xs text-red-500">{locationError}</p>
                )}
                <p className="text-xs text-gray-500">
                  We need your precise location for delivery mapping and
                  customer directions
                </p>
              </div>
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
              <ImageUpload value={field.value} onChange={field.onChange} />
            </FormControl>
            <FormMessage className="text-xs" />
            <p className="text-xs text-gray-500 mt-1">
              Upload your business logo (optional)
            </p>
          </FormItem>
        )}
      />

      {/* Opening & Closing Time */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="openingTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Opening Time <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <input
                  type="time"
                  value={field.value}
                  onChange={field.onChange}
                  className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="closingTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Closing Time <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <input
                  type="time"
                  value={field.value}
                  onChange={field.onChange}
                  className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
