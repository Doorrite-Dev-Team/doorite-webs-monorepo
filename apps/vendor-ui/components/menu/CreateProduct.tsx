"use client";

import React, { useState } from "react";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import apiClient from "@/libs/api/client";
import { toast } from "@repo/ui/components/sonner";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Textarea } from "@repo/ui/components/textarea";
import { Switch } from "@repo/ui/components/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@repo/ui/components/sheet";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { Separator } from "@repo/ui/components/separator";
import { X, Plus, Loader2, Package } from "lucide-react";
import { ImageUpload } from "@/components/ImageUpload";
import { deriveError } from "@/libs/utils/errorHandler";

// Zod v4 compatible schema
const ProductFormSchema = z.object({
  name: z
    .string({ message: "Product name is required" })
    .min(2, { message: "Name must be at least 2 characters" })
    .trim(),
  description: z.string().optional(),
  basePrice: z
    .number({ message: "Price is required" })
    .min(0.01, { message: "Price must be at least ₦0.01" })
    .positive({ message: "Price must be positive" }),
  sku: z.string().optional(),
  isAvailable: z.boolean().optional(),
  imageUrl: z.string().url().nullable().optional(),
  attributes: z
    .array(
      z.object({
        key: z.string().min(1, { message: "Attribute key is required" }),
        value: z.string().optional(),
      }),
    )
    .optional(),
  variants: z
    .array(
      z.object({
        name: z.string().min(1, { message: "Variant name is required" }),
        price: z
          .number()
          .min(0, { message: "Variant price cannot be negative" }),
        stock: z
          .number()
          .int({ message: "Stock must be a whole number" })
          .nonnegative({ message: "Stock cannot be negative" })
          .optional(),
        isAvailable: z.boolean().optional(),
      }),
    )
    .optional(),
});

type ProductFormValues = z.infer<typeof ProductFormSchema>;

type Props = {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  endpoint?: string;
  onSuccessAction?: () => void;
};

export default function CreateProductSheet({
  open,
  onOpenChangeAction,
  endpoint = "/vendors/products",
  onSuccessAction,
}: Props) {
  const [loading, setLoading] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: "",
      description: "",
      basePrice: 0,
      sku: "",
      isAvailable: true,
      attributes: [],
      variants: [],
      imageUrl: null,
    },
  });

  const {
    fields: attrFields,
    append: addAttr,
    remove: removeAttr,
  } = useFieldArray({
    control: form.control,
    name: "attributes",
  });

  const {
    fields: variantFields,
    append: addVariant,
    remove: removeVariant,
  } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const close = () => {
    onOpenChangeAction(false);
    form.reset();
  };

  const onSubmit = async (data: ProductFormValues) => {
    setLoading(true);
    try {
      // Filter out empty attributes
      const payload = {
        ...data,
        ...(data.attributes && {
          attributes: data.attributes
            .filter((a) => a.key.trim() !== "")
            .reduce(
              (acc, attr) => {
                acc[attr.key] = attr.value || "";
                return acc;
              },
              {} as Record<string, string>,
            ),
        }),
      };

      const res = await apiClient.post(endpoint, payload);

      console.log(res.data.product);

      toast.success(`Product "${res.data.product.name}" created successfully`, {
        description: "Your product is now available in your menu",
      });

      close();
      onSuccessAction?.();
    } catch (err) {
      const errorMessage = deriveError(err) || "Failed to create product";

      toast.error("Failed to create product", {
        description: errorMessage,
      });

      console.error("Product creation error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChangeAction}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl p-0 flex flex-col"
      >
        <SheetHeader className="px-6 pt-6 pb-4">
          <SheetTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-green-600" />
            Create New Product
          </SheetTitle>
          <SheetDescription>
            Add product details, variants, and attributes to your menu
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <ScrollArea className="flex-1 px-6">
              <div className="space-y-6 pb-6">
                {/* Image Upload */}
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Image</FormLabel>
                      <FormControl>
                        <ImageUpload
                          value={field.value ?? null}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormDescription>
                        Upload a clear image of your product
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-gray-900">
                    Basic Information
                  </h3>

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Jollof Rice Special"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your product..."
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Optional: Add details about ingredients, preparation,
                          etc.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="basePrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Base Price (₦)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sku"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SKU (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="PROD-001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="isAvailable"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Available for Sale
                          </FormLabel>
                          <FormDescription>
                            Customers can order this product
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                {/* Attributes Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-sm text-gray-900">
                        Attributes
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Add custom properties like size, color, spice level,
                        etc.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addAttr({ key: "", value: "" })}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>

                  {attrFields.length === 0 ? (
                    <div className="text-center py-6 border-2 border-dashed rounded-lg">
                      <p className="text-sm text-gray-500">
                        No attributes added yet
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {attrFields.map((field, index) => (
                        <div key={field.id} className="flex gap-2 items-start">
                          <FormField
                            control={form.control}
                            name={`attributes.${index}.key`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Input
                                    placeholder="Key (e.g. Size)"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`attributes.${index}.value`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Input
                                    placeholder="Value (e.g. Large)"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() => removeAttr(index)}
                            className="shrink-0"
                          >
                            <X className="w-4 h-4 text-gray-400" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Separator />

                {/* Variants Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-sm text-gray-900">
                        Product Variants
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Offer different versions with unique pricing and stock
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        addVariant({
                          name: "",
                          price: 0,
                          stock: 0,
                          isAvailable: true,
                        })
                      }
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Variant
                    </Button>
                  </div>

                  {variantFields.length === 0 ? (
                    <div className="text-center py-6 border-2 border-dashed rounded-lg">
                      <p className="text-sm text-gray-500">
                        No variants added yet
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {variantFields.map((field, index) => (
                        <div
                          key={field.id}
                          className="p-4 border-2 rounded-lg space-y-4 relative bg-gray-50/50"
                        >
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="absolute top-2 right-2"
                            onClick={() => removeVariant(index)}
                          >
                            <X className="w-4 h-4 text-gray-400" />
                          </Button>

                          <FormField
                            control={form.control}
                            name={`variants.${index}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Variant Name</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g. Large, Extra Spicy"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-2 gap-3">
                            <FormField
                              control={form.control}
                              name={`variants.${index}.price`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Price (₦)</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      placeholder="0.00"
                                      {...field}
                                      onChange={(e) =>
                                        field.onChange(
                                          parseFloat(e.target.value) || 0,
                                        )
                                      }
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`variants.${index}.stock`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Stock (Optional)</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min="0"
                                      placeholder="0"
                                      {...field}
                                      onChange={(e) =>
                                        field.onChange(
                                          parseInt(e.target.value) || undefined,
                                        )
                                      }
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name={`variants.${index}.isAvailable`}
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border bg-white p-3">
                                <FormLabel className="text-sm font-normal">
                                  Available
                                </FormLabel>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>

            <SheetFooter className="px-6 py-4 border-t bg-gray-50/50">
              <div className="flex gap-3 w-full">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={close}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Product"
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
