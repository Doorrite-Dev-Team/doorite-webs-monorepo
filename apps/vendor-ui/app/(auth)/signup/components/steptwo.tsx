"use client";

import React, { useEffect, useState } from "react";
import { Control, UseFormGetValues, UseFormSetValue } from "react-hook-form";
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
import { toast } from "@repo/ui/components/sonner";
import { LocationSelector } from "./select-location";
import { FormValues } from "./stepOne";
import Axios from "@/libs/Axios";

// Add a simple multi-select checkbox group component
const MultiSelect = ({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string[];
  onChange: (value: string[]) => void;
}) => {
  const toggleOption = (opt: string) => {
    if (selected.includes(opt)) {
      onChange(selected.filter((s) => s !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };

  return (
    <div className="space-y-2 border rounded-md p-3">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={selected.includes(opt)}
            onChange={() => toggleOption(opt)}
            className="accent-blue-500"
          />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  );
};

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
  const [categories, setCategories] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>("");
  const [subOptions, setSubOptions] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    []
  );

  // ✅ Fetch categories from backend
  const getVendorCategories = async () => {
    try {
      setLoading(true);
      const response = await Axios.get("/auth/vendor-categories");

      if (response.status !== 200 || !response.data.ok) {
        toast.error("Failed to fetch business categories");
        return;
      }

      setCategories(response.data.categories || {});
    } catch (error: any) {
      console.error("❌ Error fetching vendor categories:", error);
      toast.error("Unable to load categories");
      setCategories({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVendorCategories();
  }, []);

  // 🧩 Update subcategory options when main category changes
  useEffect(() => {
    if (selectedMainCategory && categories[selectedMainCategory]) {
      const subKeys = Object.keys(categories[selectedMainCategory]).map(
        (key) => `${selectedMainCategory}.${key}`
      );
      setSubOptions(subKeys);
      setSelectedSubcategories([]); // reset subcategories
    } else {
      setSubOptions([]);
    }
  }, [selectedMainCategory]);

  // 🧠 Update the final array in form values whenever selections change
  useEffect(() => {
    if (selectedMainCategory) {
      const allSelected = [selectedMainCategory, ...selectedSubcategories];
      setValue("category", allSelected);
    } else {
      setValue("category", []);
    }
  }, [selectedMainCategory, selectedSubcategories, setValue]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 🏙️ Business Location */}
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

      {/* 🏢 Business Category */}
      <FormItem>
        <FormLabel>Main Business Category</FormLabel>
        <Select
          onValueChange={(value) => {
            setSelectedMainCategory(value);
          }}
          value={selectedMainCategory}
          disabled={loading}
        >
          <FormControl>
            <SelectTrigger>
              <SelectValue
                placeholder={
                  loading
                    ? "Loading categories..."
                    : "Select your main category"
                }
              />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {Object.keys(categories).length > 0 ? (
              Object.keys(categories).map((key) => (
                <SelectItem key={key} value={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </SelectItem>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                {loading ? "Loading..." : "No categories found"}
              </div>
            )}
          </SelectContent>
        </Select>
        <FormDescription>
          Choose the category that best describes your business
        </FormDescription>
      </FormItem>

      {/* 🍽️ Subcategory Multi-select */}
      {subOptions.length > 0 && (
        <FormItem>
          <FormLabel>Subcategories</FormLabel>
          <MultiSelect
            options={subOptions}
            selected={selectedSubcategories}
            onChange={setSelectedSubcategories}
          />
          <FormDescription>
            Select all applicable subcategories
          </FormDescription>
        </FormItem>
      )}

      {/* 🖼️ Business Logo Upload */}
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
