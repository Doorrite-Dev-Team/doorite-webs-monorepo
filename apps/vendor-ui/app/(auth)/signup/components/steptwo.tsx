import { FileUploader } from "@repo/ui/components/file-upload";
import {
  FormControl,
  FormDescription,
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
import React from "react";
import { Control, UseFormGetValues, UseFormSetValue } from "react-hook-form";
import { LocationSelector } from "./select-location";
import { FormValues } from "./stepOne";

interface StepTwoProps {
  control: Control<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  getValues: UseFormGetValues<FormValues>;
  countryName: string;
  setCountryName: (name: string) => void;
  stateName: string;
  setStateName: (name: string) => void;
  files: File[] | null;
  setFiles: (files: File[] | null) => void;
}

const BUSINESS_CATEGORIES = [
  { value: "technology", label: "Technology" },
  { value: "retail", label: "Retail" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "finance", label: "Finance" },
  { value: "food-beverage", label: "Food & Beverage" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "consulting", label: "Consulting" },
  { value: "real-estate", label: "Real Estate" },
  { value: "automotive", label: "Automotive" },
  { value: "construction", label: "Construction" },
  { value: "entertainment", label: "Entertainment" },
  { value: "travel", label: "Travel & Tourism" },
  { value: "non-profit", label: "Non-Profit" },
  { value: "other", label: "Other" },
];

export const StepTwo: React.FC<StepTwoProps> = ({
  control,
  setValue,
  getValues,
  countryName,
  setCountryName,
  stateName,
  setStateName,
  files,
  setFiles,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <FormField
        control={control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Business Location</FormLabel>
            <FormControl>
              <LocationSelector
                countryValue={countryName}
                stateValue={stateName}
                onCountryChange={(country) => {
                  const newCountryName = country?.name || "";
                  setCountryName(newCountryName);
                  // Reset state when country changes
                  setStateName("");
                  setValue(field.name, [newCountryName, ""]);
                }}
                onStateChange={(state) => {
                  const newStateName = state?.name || "";
                  setStateName(newStateName);
                  setValue(field.name, [
                    getValues(field.name)[0] || "",
                    newStateName,
                  ]);
                }}
              />
            </FormControl>
            <FormDescription>
              Select your country and state (if applicable)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Business Category</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select your business industry/category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {BUSINESS_CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Choose the category that best describes your business
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="logo"
        render={() => (
          <FormItem>
            <FormLabel>Business Logo (Optional)</FormLabel>
            <FormControl>
              <FileUploader
                value={files}
                onValueChange={setFiles}
                maxFiles={1}
                maxSize={4 * 1024 * 1024} // 4MB
                accept="image/*"
                className="relative bg-background rounded-lg p-2"
              />
            </FormControl>
            <FormDescription>
              Upload your business logo (optional, max 4MB)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
