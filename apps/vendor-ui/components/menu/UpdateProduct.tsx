"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { Separator } from "@repo/ui/components/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@repo/ui/components/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";
import { Badge } from "@repo/ui/components/badge";
import { toast } from "@repo/ui/components/sonner";
import { Switch } from "@repo/ui/components/switch";
import { Textarea } from "@repo/ui/components/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@repo/ui/components/alert-dialog";
import {
  Check,
  Info,
  Layers,
  Loader2,
  Package,
  Pencil,
  Plus,
  Settings2,
  Trash2,
  X,
} from "lucide-react";
import React, { useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { deleteImage } from "@/actions/uploadThing";
import { ImageUpload, type ImageUploadRef } from "@/components/ImageUpload";
import apiClient from "@/libs/api/client";
import { deriveError } from "@/libs/utils/errorHandler";
import AttachModifiersSection from "./AttachModifiersSection";
import CreateModifierSheet from "./CreateModifierSheet";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const DetailsSchema = z.object({
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
  imageUrl: z.string().url().optional(),
  attributes: z
    .array(
      z.object({
        key: z.string().min(1, { message: "Key is required" }),
        value: z.string().optional(),
      }),
    )
    .optional(),
});

const NewVariantSchema = z.object({
  name: z.string().min(1, { message: "Variant name is required" }),
  price: z.number().min(0, { message: "Price cannot be negative" }),
  stock: z
    .number()
    .int({ message: "Stock must be a whole number" })
    .nonnegative({ message: "Stock cannot be negative" })
    .optional(),
  isAvailable: z.boolean().optional(),
});

type DetailsValues = z.infer<typeof DetailsSchema>;
type NewVariantValues = z.infer<typeof NewVariantSchema>;

// ─── Types ────────────────────────────────────────────────────────────────────

type Variant = {
  id: string;
  name: string;
  price: number;
  stock?: number;
  isAvailable: boolean;
};

type ModifierGroup = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  name: string;
  description?: string;
  basePrice: number;
  sku?: string;
  isAvailable: boolean;
  imageUrl?: string | null;
  attributes?: Array<{ key: string; value: string }> | Record<string, string>;
  variants?: Variant[];
  modifierGroups?: ModifierGroup[] | string[];
};

type Props = {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  product: Product;
  endpoint?: string;
  onSuccessAction?: () => void;
};

// ─── Sub-component: Variant Row ───────────────────────────────────────────────

function VariantRow({
  variant,
  productId,
  endpoint,
  onUpdated,
  onDeleted,
}: {
  variant: Variant;
  productId: string;
  endpoint: string;
  onUpdated: (updated: Variant) => void;
  onDeleted: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const form = useForm<NewVariantValues>({
    resolver: zodResolver(NewVariantSchema),
    defaultValues: {
      name: variant.name,
      price: variant.price,
      stock: variant.stock,
      isAvailable: variant.isAvailable,
    },
  });

  const handleSave = async (data: NewVariantValues) => {
    setSaving(true);
    try {
      const res = await apiClient.put(
        `${endpoint}/${productId}/variants/${variant.id}`,
        data,
      );
      const updated = res.data.variant ?? { ...variant, ...data };
      onUpdated(updated);
      setEditing(false);
      toast.success(`Variant "${updated.name}" updated`);
    } catch (err) {
      toast.error("Failed to update variant", {
        description: deriveError(err) || "Please try again",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await apiClient.delete(`${endpoint}/${productId}/variants/${variant.id}`);
      onDeleted(variant.id);
      toast.success(`Variant "${variant.name}" removed`);
    } catch (err) {
      toast.error("Failed to delete variant", {
        description: deriveError(err) || "Please try again",
      });
    } finally {
      setDeleting(false);
    }
  };

  if (!editing) {
    return (
      <div className="flex items-center justify-between rounded-lg border bg-stone-50/60 px-4 py-3 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-2 h-2 rounded-full shrink-0 bg-green-500" />
          <div className="min-w-0">
            <p className="font-medium text-sm text-stone-900 truncate">
              {variant.name}
            </p>
            <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
              <span className="font-semibold text-green-600">
                ₦{variant.price.toLocaleString()}
              </span>
              {variant.stock !== undefined && (
                <>
                  <span className="text-stone-300">·</span>
                  <span>Stock: {variant.stock}</span>
                </>
              )}
              <span className="text-stone-300">·</span>
              <Badge
                variant={variant.isAvailable ? "default" : "secondary"}
                className={
                  variant.isAvailable
                    ? "text-[10px] px-1.5 py-0 bg-green-100 text-green-700 hover:bg-green-100"
                    : "text-[10px] px-1.5 py-0 bg-stone-100 text-stone-500 hover:bg-stone-100"
                }
              >
                {variant.isAvailable ? "Available" : "Unavailable"}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-stone-400 hover:text-green-600"
            onClick={() => setEditing(true)}
          >
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-stone-400 hover:text-red-600"
                disabled={deleting}
              >
                {deleting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Variant</AlertDialogTitle>
                <AlertDialogDescription>
                  Remove <strong>{variant.name}</strong>? This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 hover:bg-red-700"
                  onClick={handleDelete}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSave)}
        className="rounded-lg border-2 border-green-200 bg-green-50/30 p-4 space-y-3"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Variant Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Large" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Price (₦)</FormLabel>
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
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Stock (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder="Unlimited"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseInt(e.target.value) : undefined,
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
          name="isAvailable"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-md border bg-white px-3 py-2">
              <FormLabel className="text-xs font-normal">Available</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex gap-2 pt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => {
              form.reset();
              setEditing(false);
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            className="flex-1 bg-green-600 hover:bg-green-700"
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <Check className="w-3.5 h-3.5 mr-1" />
                Save
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

// ─── Sub-component: Add Variant Form ─────────────────────────────────────────

function AddVariantForm({
  productId,
  endpoint,
  onAdded,
  onCancel,
}: {
  productId: string;
  endpoint: string;
  onAdded: (variant: Variant) => void;
  onCancel: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const form = useForm<NewVariantValues>({
    resolver: zodResolver(NewVariantSchema),
    defaultValues: { name: "", price: 0, stock: undefined, isAvailable: true },
  });

  const handleSubmit = async (data: NewVariantValues) => {
    setSaving(true);
    try {
      const res = await apiClient.post(
        `${endpoint}/${productId}/variants`,
        data,
      );
      const newVariant: Variant = res.data.variant ?? {
        id: crypto.randomUUID(),
        ...data,
        isAvailable: data.isAvailable ?? true,
      };
      onAdded(newVariant);
      toast.success(`Variant "${newVariant.name}" added`);
    } catch (err) {
      toast.error("Failed to add variant", {
        description: deriveError(err) || "Please try again",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="rounded-lg border-2 border-dashed border-green-300 bg-green-50/20 p-4 space-y-3"
      >
        <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">
          New Variant
        </p>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Variant Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Large, Extra Spicy, With Cheese"
                  {...field}
                  autoFocus
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Price (₦)</FormLabel>
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
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Stock (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder="Unlimited"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseInt(e.target.value) : undefined,
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-2 pt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            className="flex-1 bg-green-600 hover:bg-green-700"
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Variant
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function UpdateProductSheet({
  open,
  onOpenChangeAction,
  product,
  endpoint = "vendors/products",
  onSuccessAction,
}: Props) {
  if (!product) return null;
  const [detailsSaving, setDetailsSaving] = useState(false);
  const [showModifierSheet, setShowModifierSheet] = useState(false);
  const [showAddVariant, setShowAddVariant] = useState(false);
  const [variants, setVariants] = useState<Variant[]>(
    (product.variants as Variant[]) ?? [],
  );
  const [attachedModifiers, setAttachedModifiers] = useState<string[]>(
    product.modifierGroups
      ? product.modifierGroups.map((m) =>
          typeof m === "string" ? m : (m as ModifierGroup).id,
        )
      : [],
  );
  const [modifierLoading, setModifierLoading] = useState<string | null>(null);
  const imageRef = useRef<ImageUploadRef>(null);

  const normalizedAttrs = !product.attributes
    ? []
    : Array.isArray(product.attributes)
      ? (product.attributes as Array<{ key: string; value: string }>)
      : Object.entries(product.attributes as Record<string, string>).map(
          ([key, value]) => ({ key, value }),
        );

  const form = useForm<DetailsValues>({
    resolver: zodResolver(DetailsSchema),
    defaultValues: {
      name: product.name,
      description: product.description ?? "",
      basePrice: Number(product.basePrice),
      sku: product.sku ?? "",
      isAvailable: product.isAvailable,
      imageUrl: product.imageUrl ?? undefined,
      attributes: normalizedAttrs,
    },
  });

  const {
    fields: attrFields,
    append: addAttr,
    remove: removeAttr,
  } = useFieldArray({ control: form.control, name: "attributes" });

  React.useEffect(() => {
    if (open) {
      const attrs = !product.attributes
        ? []
        : Array.isArray(product.attributes)
          ? (product.attributes as Array<{ key: string; value: string }>)
          : Object.entries(product.attributes as Record<string, string>).map(
              ([key, value]) => ({ key, value }),
            );
      form.reset({
        name: product.name,
        description: product.description ?? "",
        basePrice: Number(product.basePrice),
        sku: product.sku ?? "",
        isAvailable: product.isAvailable,
        imageUrl: product.imageUrl ?? undefined,
        attributes: attrs,
      });
      setVariants((product.variants as Variant[]) ?? []);
      setAttachedModifiers(
        product.modifierGroups
          ? product.modifierGroups.map((m) =>
              typeof m === "string" ? m : (m as ModifierGroup).id,
            )
          : [],
      );
    }
  }, [open, product, form]);

  const handleSaveDetails = async (data: DetailsValues) => {
    setDetailsSaving(true);
    try {
      const payload: Record<string, unknown> = {
        name: data.name,
        description: data.description,
        basePrice: data.basePrice,
        sku: data.sku,
        isAvailable: data.isAvailable,
        ...(data.imageUrl ? { imageUrl: data.imageUrl } : {}),
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

      await apiClient.put(`${endpoint}/${product.id}`, payload);
      toast.success("Product details saved", {
        description: `"${data.name}" has been updated`,
      });
      onSuccessAction?.();
    } catch (err) {
      const errorMessage = deriveError(err) || "Failed to update product";
      if (data.imageUrl) {
        await imageRef.current?.rollback();
      }
      toast.error("Failed to save details", { description: errorMessage });
    } finally {
      setDetailsSaving(false);
    }
  };

  const handleModifiersChange = async (newModifierIds: string[]) => {
    const toAttach = newModifierIds.filter(
      (id) => !attachedModifiers.includes(id),
    );
    const toDetach = attachedModifiers.filter(
      (id) => !newModifierIds.includes(id),
    );

    for (const id of toAttach) {
      setModifierLoading(id);
      try {
        await apiClient.post(`${endpoint}/${product.id}/modifiers`, {
          modifierGroupId: id,
        });
        setAttachedModifiers((prev) => [...prev, id]);
        toast.success("Modifier group attached");
      } catch (err) {
        toast.error("Failed to attach modifier", {
          description: deriveError(err) || "Please try again",
        });
      } finally {
        setModifierLoading(null);
      }
    }

    for (const id of toDetach) {
      setModifierLoading(id);
      try {
        await apiClient.delete(`${endpoint}/${product.id}/modifiers/${id}`);
        setAttachedModifiers((prev) => prev.filter((m) => m !== id));
        toast.success("Modifier group removed");
      } catch (err) {
        toast.error("Failed to detach modifier", {
          description: deriveError(err) || "Please try again",
        });
      } finally {
        setModifierLoading(null);
      }
    }
  };

  const close = () => onOpenChangeAction(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChangeAction}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl p-0 flex flex-col h-full"
      >
        <SheetHeader className="px-6 pt-6 pb-0 shrink-0">
          <SheetTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-green-600" />
            Edit Product
          </SheetTitle>
          <SheetDescription className="truncate">
            {product.name}
          </SheetDescription>
        </SheetHeader>

        <Tabs
          defaultValue="details"
          className="flex flex-col flex-1 min-h-0 mt-4"
        >
          <TabsList className="mx-6 mb-0 shrink-0 grid grid-cols-3">
            <TabsTrigger value="details" className="gap-1.5">
              <Info className="w-3.5 h-3.5" />
              Details
            </TabsTrigger>
            <TabsTrigger value="variants" className="gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Variants
              {variants.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 px-1.5 py-0 text-[10px] leading-none"
                >
                  {variants.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="modifiers" className="gap-1.5">
              <Settings2 className="w-3.5 h-3.5" />
              Modifiers
              {attachedModifiers.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 px-1.5 py-0 text-[10px] leading-none"
                >
                  {attachedModifiers.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <Separator className="mt-3 shrink-0" />

          <TabsContent value="details" className="flex-1 min-h-0 mt-0">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSaveDetails)}
                className="flex flex-col h-full"
              >
                <ScrollArea className="flex-1">
                  <div className="space-y-6 px-6 py-4">
                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Image</FormLabel>
                          <FormControl>
                            <ImageUpload
                              ref={imageRef}
                              value={field.value ?? null}
                              onChange={field.onChange}
                              onRemove={deleteImage}
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

                    <div className="space-y-4">
                      <h3 className="font-semibold text-sm text-stone-900">
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
                          name="sku"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>SKU (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. JR-001" {...field} />
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

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-sm text-stone-900">
                            Attributes
                          </h3>
                          <p className="text-xs text-stone-500 mt-0.5">
                            Custom properties like size, colour, spice level
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
                          <p className="text-sm text-stone-500">
                            No attributes added yet
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {attrFields.map((field, index) => (
                            <div
                              key={field.id}
                              className="flex gap-2 items-start"
                            >
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
                                <X className="w-4 h-4 text-stone-400" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </ScrollArea>

                <div className="px-6 py-4 border-t bg-stone-50/50 shrink-0 flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={close}
                    disabled={detailsSaving}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={detailsSaving}
                  >
                    {detailsSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Save Details
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="variants" className="flex-1 min-h-0 mt-0">
            <div className="flex flex-col h-full">
              <ScrollArea className="flex-1">
                <div className="space-y-3 px-6 py-4">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <h3 className="font-semibold text-sm text-stone-900">
                        Product Variants
                      </h3>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Each save is instant — no need to confirm
                      </p>
                    </div>
                    {!showAddVariant && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAddVariant(true)}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Variant
                      </Button>
                    )}
                  </div>

                  {showAddVariant && (
                    <AddVariantForm
                      productId={product.id}
                      endpoint={endpoint}
                      onAdded={(v) => {
                        setVariants((prev) => [...prev, v]);
                        setShowAddVariant(false);
                      }}
                      onCancel={() => setShowAddVariant(false)}
                    />
                  )}

                  {variants.length === 0 && !showAddVariant ? (
                    <div className="text-center py-10 border-2 border-dashed rounded-lg">
                      <Layers className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                      <p className="text-sm text-stone-500 mb-3">
                        No variants yet
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAddVariant(true)}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add First Variant
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {variants.map((variant) => (
                        <VariantRow
                          key={variant.id}
                          variant={variant}
                          productId={product.id}
                          endpoint={endpoint}
                          onUpdated={(updated) =>
                            setVariants((prev) =>
                              prev.map((v) =>
                                v.id === updated.id ? updated : v,
                              ),
                            )
                          }
                          onDeleted={(id) =>
                            setVariants((prev) =>
                              prev.filter((v) => v.id !== id),
                            )
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
              <div className="px-6 py-4 border-t bg-stone-50/50 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={close}
                >
                  Done
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="modifiers" className="flex-1 min-h-0 mt-0">
            <div className="flex flex-col h-full">
              <ScrollArea className="flex-1">
                <div className="space-y-4 px-6 py-4">
                  <div>
                    <h3 className="font-semibold text-sm text-stone-900">
                      Modifier Groups
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Attaching or removing a modifier group saves instantly
                    </p>
                  </div>
                  {modifierLoading && (
                    <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 rounded-lg px-3 py-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating modifiers…
                    </div>
                  )}
                  <AttachModifiersSection
                    selectedModifiers={attachedModifiers}
                    onModifiersChange={handleModifiersChange}
                    onCreateModifierGroup={() => setShowModifierSheet(true)}
                  />
                </div>
              </ScrollArea>
              <div className="px-6 py-4 border-t bg-stone-50/50 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={close}
                >
                  Done
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>

      <CreateModifierSheet
        open={showModifierSheet}
        onOpenChange={setShowModifierSheet}
      />
    </Sheet>
  );
}
